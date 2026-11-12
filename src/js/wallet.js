// Shared account + wallet client. Plain script (no modules). Loaded on every page only
// when src/_data/supabase.js is configured, after /js/supabase.js (self-hosted supabase-js).
//
// Public API on window.Wallet:
//   Wallet.enabled            true once configured
//   Wallet.ready              Promise, resolves after the first session check
//   Wallet.balance            number | null (null = signed out)
//   Wallet.user               { id, email, username } | null
//   Wallet.signUp(email, password, username) / signIn(email, password) / signOut()
//   Wallet.claimDaily() / refill()   -> new balance, throws Error(code)
//   Wallet.report(game, delta)       -> record a net win/loss (batch per session, not per bet)
//   Wallet.history(limit)            -> ledger rows
// Event: document 'wallet:change' fires whenever user or balance changes.
(function () {
  var cfg = window.STAKES_SUPABASE;
  var W = (window.Wallet = { enabled: false, balance: null, user: null });
  if (!cfg || !cfg.url || !cfg.anonKey || !window.supabase) {
    W.ready = Promise.resolve();
    return;
  }
  W.enabled = true;
  var sb = window.supabase.createClient(cfg.url, cfg.anonKey);
  W.client = sb;

  function emit() { document.dispatchEvent(new CustomEvent('wallet:change')); }
  function fail(error) {
    var e = new Error((error && (error.message || error.code)) || 'unknown');
    throw e;
  }

  async function load() {
    var s = (await sb.auth.getSession()).data.session;
    if (!s) { W.user = null; W.balance = null; return emit(); }
    var uid = s.user.id;
    var res = await Promise.all([
      sb.from('profiles').select('username').eq('id', uid).maybeSingle(),
      sb.from('wallets').select('balance').eq('user_id', uid).maybeSingle(),
    ]);
    W.user = { id: uid, email: s.user.email, username: res[0].data && res[0].data.username };
    W.balance = res[1].data ? Number(res[1].data.balance) : null;
    emit();
  }

  W.ready = load();
  sb.auth.onAuthStateChange(function () { load(); });

  W.signUp = async function (email, password, username) {
    var r = await sb.auth.signUp({ email: email, password: password, options: { data: { username: username } } });
    if (r.error) fail(r.error);
    return r.data;
  };
  W.signIn = async function (email, password) {
    var r = await sb.auth.signInWithPassword({ email: email, password: password });
    if (r.error) fail(r.error);
  };
  W.signOut = async function () { await sb.auth.signOut(); };

  async function rpc(name, args) {
    var r = await sb.rpc(name, args);
    if (r.error) fail(r.error);
    W.balance = Number(r.data);
    emit();
    return W.balance;
  }
  W.claimDaily = function () { return rpc('claim_daily'); };
  W.refill = function () { return rpc('refill'); };
  W.report = function (game, delta) {
    if (!W.user) return Promise.resolve(null);
    return rpc('record_result', { p_game: game, p_delta: Math.round(delta) });
  };
  W.history = async function (limit) {
    var r = await sb.from('transactions').select('amount,kind,game,balance_after,created_at')
      .order('created_at', { ascending: false }).limit(limit || 20);
    if (r.error) fail(r.error);
    return r.data;
  };

  // Nav chip: "Log in" when signed out, chip balance when signed in.
  var chip = document.getElementById('wallet-chip');
  function paint() {
    if (!chip) return;
    chip.hidden = false;
    chip.textContent = W.user && W.balance !== null ? W.balance.toLocaleString('en-US') + ' chips' : 'Log in';
  }
  document.addEventListener('wallet:change', paint);
  paint();
})();
