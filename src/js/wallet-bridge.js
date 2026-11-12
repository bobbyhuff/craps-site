// Connects a game page's bankroll to the shared chip wallet. Plain script, loaded on
// every page; with accounts unconfigured or a guest playing, every call is a harmless no-op.
//
// Model: a session is a "buy-in" from the wallet. The player brings up to their wallet
// balance to the table (1 chip = $1 of play money). Only the NET result is ever recorded:
// the bridge reports bankroll - buy-in, in whole chips, throttled and batched, never per bet.
//
// Game hooks (each guarded by globalThis.StakesWallet?. so engines still run under test):
//   newState(b)        -> StakesWallet.buyIn(b)     a new session starts
//   render()           -> StakesWallet.sync(b)      bankroll changed
//   overlay confirm    -> StakesWallet.clamp(amt)   cap the buy-in at what the wallet holds
//   overlay text       -> StakesWallet.hint()       one line explaining the above
(function (root) {
  'use strict';
  var round2 = function (x) { return Math.round(x * 100) / 100; };

  function create(env) {
    var THROTTLE_MS = 5000;
    var s = null;       // { start, last, reported, tracked }
    var timer = null;

    function wallet() {
      var w = env.wallet();
      return w && w.enabled ? w : null;
    }
    function signedIn() {
      var w = wallet();
      return w && w.user && w.balance !== null ? w : null;
    }
    // Whole chips not yet reported for the live session.
    function pending(sess) {
      return sess ? Math.trunc(round2(sess.last - sess.start - sess.reported)) : 0;
    }
    // Chips the player could bring to a table right now: wallet balance plus the live
    // session's unreported result (what they would have after cashing out).
    function available() {
      var w = signedIn();
      if (!w) return 0;
      return Math.max(0, Math.floor(w.balance + (s && s.tracked ? pending(s) : 0)));
    }

    function flush(sess) {
      if (sess === s && timer) { env.clearTimeout(timer); timer = null; }
      if (!sess || !sess.tracked) return;
      var d = pending(sess);
      var w = signedIn();
      if (!d || !w || !env.game) return;
      sess.reported += d;
      Promise.resolve(w.report(env.game, d)).catch(function () {
        sess.reported -= d;                 // not recorded: try again with the next batch
        if (sess === s) schedule();
      });
    }
    function schedule() {
      if (timer) return;
      var sess = s;
      timer = env.setTimeout(function () { timer = null; flush(sess); }, THROTTLE_MS);
    }

    return {
      available: available,

      clamp: function (amt) {
        if (!(amt > 0)) return amt;
        var av = available();
        return av >= 1 && amt > av ? av : amt;
      },

      hint: function () {
        if (!wallet()) return '';
        var w = signedIn();
        if (!w) return ' Log in to keep your chips between games.';
        var av = available();
        if (av < 1) return ' Your wallet is empty, so this session will not be saved. Claim chips on your account page.';
        return ' Your wallet holds ' + av.toLocaleString('en-US') + ' chips. You can bring up to that much, and your net result is saved.';
      },

      buyIn: function (amt) {
        if (s) flush(s);                    // settle the session being replaced
        s = null;
        if (!(amt > 0)) return;
        s = { start: amt, last: amt, reported: 0, tracked: !!signedIn() && available() >= 1 };
      },

      sync: function (bankroll) {
        if (!s || !s.tracked || typeof bankroll !== 'number') return;
        s.last = bankroll;
        if (pending(s)) schedule();
      },

      flushNow: function () { flush(s); },
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { create: create };
  if (typeof window === 'undefined') return;

  var m = /^\/games\/([a-z0-9-]{2,32})\//.exec(root.location.pathname);
  var bridge = create({
    wallet: function () { return root.Wallet; },
    game: m ? m[1] : null,
    setTimeout: function (f, ms) { return root.setTimeout(f, ms); },
    clearTimeout: function (t) { root.clearTimeout(t); },
  });
  root.StakesWallet = bridge;
  // Settle when the tab is hidden or closed. Best effort: browsers may cancel in-flight requests.
  document.addEventListener('visibilitychange', function () { if (document.hidden) bridge.flushNow(); });
  root.addEventListener('pagehide', bridge.flushNow);
})(typeof window !== 'undefined' ? window : globalThis);
