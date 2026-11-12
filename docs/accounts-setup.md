# Accounts and chip wallet setup

Chips are play money. They can never be bought or cashed out. Keep it that way: it is what
keeps 0stakes legal and AdSense-safe.

Until `src/_data/supabase.js` has a URL and key, the site builds exactly as before (no login
link, `/account/` shows a "not connected" notice).

## One-time setup (about 10 minutes)

1. Create a free project at supabase.com. Pick the region nearest your players.
2. SQL Editor > New query > paste all of `supabase/schema.sql` > Run.
3. Project Settings > API. Copy the **Project URL** and the **anon / publishable** key into
   `src/_data/supabase.js`. Both are public by design. **Never** use the `service_role` key.
4. Authentication > URL Configuration. Set Site URL to `https://0stakes.com` and add
   these Redirect URLs (password reset links return to `/account/`, and Supabase ignores any
   redirect that is not on this list): `https://0stakes.com/account/` and
   `http://localhost:8080/account/` for `npm run serve`.
5. Authentication > Providers > Email. Leave "Confirm email" on (recommended). Under
   Authentication > Rate Limits, keep the defaults.
6. `npm run build`, deploy as usual.

## Tuning the economy later (no redeploy)

Table Editor > `economy_settings`. Edit a `value` and it is live immediately:

| key | what it does |
|---|---|
| `signup_bonus` | chips on account creation (applies to new accounts only) |
| `daily_bonus` | chips per daily claim |
| `refill_threshold` / `refill_amount` / `refill_cooldown_hrs` | broke-player reset rules |
| `max_result_delta` | biggest single win or loss one report can record |
| `max_daily_net_gain` | cap on net chips won from games per UTC day |

To grant or remove chips by hand, run in the SQL Editor (it writes a ledger row):
`select public.apply_tx('<user uuid>', 500, 'admin', null);`

## Avoiding the free-tier pause

Free Supabase projects pause after about 7 days with no activity. Normal traffic prevents it.
For quiet stretches, schedule any request to the project at least every few days, for example a
free uptime monitor hitting
`https://<project>.supabase.co/rest/v1/economy_settings?select=key&limit=1` with the header
`apikey: <anon key>`.

## Security model and its one limit

- Browsers can only **read** their own profile, wallet and ledger. All writes go through the
  functions in `schema.sql`, which also write the ledger row in the same transaction.
- Game rules run in the browser, so the server cannot verify that a reported result really
  happened. `record_result` therefore caps each report and each day. A determined user can
  still inflate their own chips up to the daily cap. That is acceptable for chips with no cash
  value. **If you ever add a public leaderboard, prize or anything of value, move the game
  resolution server side first.**
- Passwords are handled and hashed by Supabase Auth. They never touch this code.

## How the games use the wallet

Each game session is a **buy-in**: a signed-in player can bring up to their wallet balance
to the table (1 chip = $1). Only the **net result** is saved, in whole chips, batched at most
once every 5 seconds and when the tab is hidden or closed. Guests, and signed-in players with an
empty wallet, play exactly as before and nothing is saved.

Logic lives in `src/js/wallet-bridge.js` (tested in `tests/wallet-bridge.test.js`). Each game
has four one-line hooks: `newState` (buy-in), `render` (sync), and the overlay confirm and text
(cap and hint). A new game needs the same four hooks. They are all guarded with
`globalThis.StakesWallet?.` so engines still run in tests.

Known limits: a closed tab can lose the last few seconds of results if the browser cancels the
request. Two tabs can bring the same chips to two tables. Both are acceptable for play money.

## Password reset

"Forgot your password?" on `/account/` calls `Wallet.resetPassword(email)`. The emailed link
returns to `/account/`, where supabase-js fires `PASSWORD_RECOVERY`, `Wallet.recovering` becomes
true and the page shows a "Set a new password" form. The reply never reveals whether an email
has an account. Supabase's built-in email sender is limited to a few messages per hour: add
your own SMTP provider under Authentication > Emails before real traffic.

## Account deletion

Handled by hand for now, as promised in `/privacy/`: Authentication > Users > delete the user.
The wallet, profile and ledger rows cascade-delete with it.

## Leaderboards

`/leaderboard/` shows two public top-10 boards, from the SQL functions `leaderboard_holders()`
(current balances) and `leaderboard_daily()` (net game winnings since 00:00 UTC, winners only).
Only usernames and chip totals are exposed. The functions are `security definer`, so the tables
themselves stay private. Run the leaderboard section of `supabase/schema.sql` on an existing
project (it is idempotent).

**Cheating:** results are reported by the browser, so anyone can inflate their own totals up to
`max_daily_net_gain` per day (default 250,000). A leaderboard makes that worth doing. To bound it,
lower `max_daily_net_gain` in `economy_settings` (it takes effect immediately). The real fix is
server-side game resolution. Delete a cheater in Authentication > Users and they vanish from the
boards. There is no username editing yet, so offensive usernames also have to be removed that way.
