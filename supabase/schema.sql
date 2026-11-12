-- 0stakes accounts + play-money wallet.
-- Run this whole file once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Chips are virtual. They can never be bought or cashed out.
--
-- Design rules:
--   * Browsers can READ their own rows but can never write wallet tables directly.
--   * Every balance change goes through a function below and writes a ledger row
--     (public.transactions) in the same database transaction.
--   * Every tunable number lives in public.economy_settings. Edit a row in the
--     Table Editor and the change is live instantly. No redeploy.

-- ---------------------------------------------------------------- tables

create table if not exists public.economy_settings (
  key   text primary key,
  value bigint not null,
  note  text
);

insert into public.economy_settings (key, value, note) values
  ('signup_bonus',        5000,   'Chips granted when an account is created'),
  ('daily_bonus',         1000,   'Chips for the once-per-UTC-day claim'),
  ('refill_threshold',    100,    'Refill is allowed only when balance is at or below this'),
  ('refill_amount',       2500,   'Balance a refill resets to'),
  ('refill_cooldown_hrs', 24,     'Hours between refills'),
  ('max_result_delta',    100000, 'Largest single win or loss one report can record'),
  ('max_daily_net_gain',  250000, 'Cap on net chips a player can win from games per UTC day')
on conflict (key) do nothing;

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   text not null unique check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  balance          bigint not null default 0 check (balance >= 0),
  last_daily_claim date,
  last_refill      timestamptz,
  updated_at       timestamptz not null default now()
);

create table if not exists public.transactions (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users (id) on delete cascade,
  amount        bigint not null,
  kind          text not null check (kind in ('signup', 'daily', 'refill', 'game', 'admin')),
  game          text,
  balance_after bigint not null,
  created_at    timestamptz not null default now()
);

create index if not exists transactions_user_time_idx
  on public.transactions (user_id, created_at desc);

-- ---------------------------------------------------------------- row level security

alter table public.economy_settings enable row level security;
alter table public.profiles         enable row level security;
alter table public.wallets          enable row level security;
alter table public.transactions     enable row level security;

drop policy if exists "settings readable"  on public.economy_settings;
drop policy if exists "own profile"        on public.profiles;
drop policy if exists "own wallet"         on public.wallets;
drop policy if exists "own transactions"   on public.transactions;

create policy "settings readable" on public.economy_settings for select to anon, authenticated using (true);
create policy "own profile"       on public.profiles         for select to authenticated using (id = auth.uid());
create policy "own wallet"        on public.wallets          for select to authenticated using (user_id = auth.uid());
create policy "own transactions"  on public.transactions     for select to authenticated using (user_id = auth.uid());

-- No insert/update/delete policies exist, and the grants are removed as a second lock.
revoke insert, update, delete, truncate on
  public.economy_settings, public.profiles, public.wallets, public.transactions
  from anon, authenticated;

-- ---------------------------------------------------------------- helpers (not callable from the browser)

create or replace function public.setting(p_key text)
returns bigint language sql stable security definer set search_path = public as
$$ select value from public.economy_settings where key = p_key $$;

create or replace function public.apply_tx(p_user uuid, p_amount bigint, p_kind text, p_game text)
returns bigint language plpgsql security definer set search_path = public as
$$
declare new_balance bigint;
begin
  update public.wallets
     set balance = balance + p_amount, updated_at = now()
   where user_id = p_user
   returning balance into new_balance;
  if not found then raise exception 'no_wallet'; end if;
  insert into public.transactions (user_id, amount, kind, game, balance_after)
  values (p_user, p_amount, p_kind, p_game, new_balance);
  return new_balance;
end $$;

revoke all on function public.setting(text), public.apply_tx(uuid, bigint, text, text)
  from public, anon, authenticated;

-- ---------------------------------------------------------------- new user trigger

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as
$$
declare
  wanted text := new.raw_user_meta_data ->> 'username';
  fallback text := 'player_' || left(replace(new.id::text, '-', ''), 8);
begin
  begin
    insert into public.profiles (id, username) values (new.id, coalesce(wanted, fallback));
  exception when unique_violation or check_violation then
    insert into public.profiles (id, username) values (new.id, fallback);
  end;
  insert into public.wallets (user_id, balance) values (new.id, 0);
  perform public.apply_tx(new.id, public.setting('signup_bonus'), 'signup', null);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- functions the browser may call

-- Once per UTC day.
create or replace function public.claim_daily()
returns bigint language plpgsql security definer set search_path = public as
$$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  update public.wallets set last_daily_claim = (now() at time zone 'utc')::date
   where user_id = uid
     and (last_daily_claim is null or last_daily_claim < (now() at time zone 'utc')::date);
  if not found then raise exception 'already_claimed'; end if;
  return public.apply_tx(uid, public.setting('daily_bonus'), 'daily', null);
end $$;

-- Broke-player reset, rate limited.
create or replace function public.refill()
returns bigint language plpgsql security definer set search_path = public as
$$
declare uid uuid := auth.uid(); w public.wallets;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into w from public.wallets where user_id = uid for update;
  if w.balance > public.setting('refill_threshold') then raise exception 'not_eligible'; end if;
  if w.last_refill is not null
     and w.last_refill > now() - make_interval(hours => public.setting('refill_cooldown_hrs')::int)
  then raise exception 'cooldown'; end if;
  update public.wallets set last_refill = now() where user_id = uid;
  return public.apply_tx(uid, greatest(public.setting('refill_amount') - w.balance, 0), 'refill', null);
end $$;

-- Net result of a play session or hand. The game logic runs in the browser, so the server
-- cannot verify outcomes. It can and does cap how much one report and one day can move.
create or replace function public.record_result(p_game text, p_delta bigint)
returns bigint language plpgsql security definer set search_path = public as
$$
declare
  uid uuid := auth.uid();
  bal bigint; delta bigint; won_today bigint; room bigint;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if p_game is null or p_game !~ '^[a-z0-9-]{2,32}$' then raise exception 'bad_game'; end if;

  select balance into bal from public.wallets where user_id = uid for update;
  delta := greatest(least(p_delta, public.setting('max_result_delta')), -public.setting('max_result_delta'));

  if delta > 0 then
    select coalesce(sum(amount), 0) into won_today from public.transactions
     where user_id = uid and kind = 'game'
       and created_at >= (now() at time zone 'utc')::date;
    room := greatest(public.setting('max_daily_net_gain') - won_today, 0);
    delta := least(delta, room);
  elsif delta < 0 then
    delta := greatest(delta, -bal);   -- never below zero
  end if;

  if delta = 0 then return bal; end if;
  return public.apply_tx(uid, delta, 'game', p_game);
end $$;

revoke all on function public.claim_daily(), public.refill(), public.record_result(text, bigint)
  from public, anon;
grant execute on function public.claim_daily(), public.refill(), public.record_result(text, bigint)
  to authenticated;
