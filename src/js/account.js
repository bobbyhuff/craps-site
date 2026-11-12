// /account/ page logic. Relies on window.Wallet (wallet.js).
(function () {
  var W = window.Wallet;
  if (!W || !W.enabled) return;
  var $ = function (id) { return document.getElementById(id); };
  var mode = 'in';

  var MESSAGES = {
    already_claimed: 'You already claimed today. Come back after midnight UTC.',
    not_eligible: 'Refill is only for when your balance is nearly gone.',
    cooldown: 'You refilled recently. Try again later.',
    'Invalid login credentials': 'Wrong email or password.',
    'Email not confirmed': 'Check your inbox and confirm your email first.',
    'User already registered': 'That email already has an account. Try logging in.',
  };
  function say(text, ok) {
    var el = $('acct-status');
    el.textContent = text || '';
    el.className = 'form-status ' + (text ? (ok ? 'ok' : 'err') : '');
  }
  function msg(e) { return MESSAGES[e.message] || e.message; }

  function setMode(m) {
    mode = m;
    document.querySelectorAll('.acct-tabs [data-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.mode === m));
    });
    $('f-username').hidden = m !== 'up';
    $('pw-hint').hidden = m !== 'up';
    $('a-password').autocomplete = m === 'up' ? 'new-password' : 'current-password';
    $('acct-submit').textContent = m === 'up' ? 'Create account' : 'Log in';
    say('');
  }
  document.querySelectorAll('.acct-tabs [data-mode]').forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.dataset.mode); });
  });

  $('acct-form').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var email = $('a-email').value.trim(), pw = $('a-password').value, name = $('a-username').value.trim();
    if (!email || pw.length < 8) return say('Enter an email and a password of at least 8 characters.');
    if (mode === 'up' && !/^[A-Za-z0-9_]{3,20}$/.test(name)) return say('Pick a username of 3 to 20 letters, numbers or underscores.');
    $('acct-submit').disabled = true;
    try {
      if (mode === 'up') {
        var d = await W.signUp(email, pw, name);
        if (!d.session) say('Account created. Check your email to confirm it, then log in.', true);
      } else {
        await W.signIn(email, pw);
      }
    } catch (e) { say(msg(e)); }
    $('acct-submit').disabled = false;
  });

  function fmtWhen(iso) { return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }
  function label(r) { return r.kind === 'game' ? 'Game: ' + r.game : r.kind.charAt(0).toUpperCase() + r.kind.slice(1); }

  async function paint() {
    var signed = !!W.user;
    $('acct-out').hidden = signed;
    $('acct-in').hidden = !signed;
    if (!signed) return;
    $('w-name').textContent = W.user.username || W.user.email;
    $('w-balance').textContent = (W.balance || 0).toLocaleString('en-US');
    try {
      var rows = await W.history(20);
      var body = $('w-ledger');
      body.textContent = '';
      rows.forEach(function (r) {
        var tr = document.createElement('tr');
        [fmtWhen(r.created_at), label(r), (r.amount > 0 ? '+' : '') + Number(r.amount).toLocaleString('en-US'), Number(r.balance_after).toLocaleString('en-US')]
          .forEach(function (t, i) {
            var td = document.createElement('td');
            td.textContent = t;   // textContent, never innerHTML: values are not trusted markup
            if (i > 1) td.className = 'num';
            tr.appendChild(td);
          });
        body.appendChild(tr);
      });
    } catch (e) { say(msg(e)); }
  }

  async function act(fn, okText) {
    try { await fn(); say(okText, true); } catch (e) { say(msg(e)); }
  }
  $('w-daily').addEventListener('click', function () { act(W.claimDaily, 'Daily chips added.'); });
  $('w-refill').addEventListener('click', function () { act(W.refill, 'Balance refilled.'); });
  $('w-out').addEventListener('click', function () { W.signOut(); });

  document.addEventListener('wallet:change', paint);
  W.ready.then(paint);
})();
