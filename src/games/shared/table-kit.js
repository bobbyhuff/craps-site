// Browser-side helpers shared by the poker-family games: money formatting,
// the bankroll overlay, a session-stats tracker, the fast-play toggle and a
// screen-reader announcer. Same behavior and markup contracts as the
// overlay/statusbar code in blackjack.js and baccarat.js, written once.
// Exposes window.TABLE_KIT. Pure helpers (fmt, round2, SessionStats) also
// work under Node for tests.

(function () {
  function round2(x) { return Math.round(x * 100) / 100; }

  function fmt(n) {
    const sign = n < 0 ? '-' : '';
    return `${sign}$${Math.abs(n).toFixed(2)}`;
  }

  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  // Rounds played, money wagered/returned, biggest single-round win, and
  // session length. `record(staked, returned)` once per settled round.
  function SessionStats() { this.reset(); }
  SessionStats.prototype.reset = function () {
    this.rounds = 0; this.wagered = 0; this.returned = 0; this.biggestWin = 0;
    this.wins = 0; this.losses = 0; this.pushes = 0;
    this.startedAt = Date.now();
  };
  SessionStats.prototype.record = function (staked, returned) {
    this.rounds++;
    this.wagered = round2(this.wagered + staked);
    this.returned = round2(this.returned + returned);
    const net = round2(returned - staked);
    if (net > 0) { this.wins++; this.biggestWin = Math.max(this.biggestWin, net); }
    else if (net < 0) this.losses++;
    else this.pushes++;
  };
  SessionStats.prototype.net = function () { return round2(this.returned - this.wagered); };
  SessionStats.prototype.duration = function () {
    const s = Math.floor((Date.now() - this.startedAt) / 1000);
    const m = Math.floor(s / 60);
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m ${String(s % 60).padStart(2, '0')}s`;
  };
  SessionStats.prototype.render = function (el, roundWord) {
    if (!el) return;
    const net = this.net();
    el.innerHTML = `
      <div><span class="sb-k">${roundWord || 'Hands'}</span><b>${this.rounds}</b></div>
      <div><span class="sb-k">Wagered</span><b>${fmt(this.wagered)}</b></div>
      <div><span class="sb-k">Returned</span><b>${fmt(this.returned)}</b></div>
      <div><span class="sb-k">Net</span><b class="${net > 0 ? 'positive' : net < 0 ? 'negative' : ''}">${fmt(net)}</b></div>
      <div><span class="sb-k">Biggest win</span><b>${fmt(this.biggestWin)}</b></div>
      <div><span class="sb-k">Time</span><b>${this.duration()}</b></div>`;
  };

  // Same overlay contract as every other game page: #setupOverlay with
  // #overlayTitle/#overlayText/#overlayInput/#overlayCancel/#overlayConfirm.
  function showOverlay({ title, text, defaultValue, showCancel, confirmLabel, onConfirm }) {
    const overlay = document.getElementById('setupOverlay');
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlayText').textContent = text + (globalThis.StakesWallet?.hint() ?? '');
    const input = document.getElementById('overlayInput');
    input.value = defaultValue;
    const cancelBtn = document.getElementById('overlayCancel');
    cancelBtn.style.display = showCancel ? 'inline-block' : 'none';
    overlay.classList.remove('hidden');

    const confirmBtn = document.getElementById('overlayConfirm');
    confirmBtn.textContent = confirmLabel || 'Start';
    const doConfirm = () => {
      const amt = globalThis.StakesWallet ? StakesWallet.clamp(parseFloat(input.value)) : parseFloat(input.value);
      if (isNaN(amt) || amt <= 0) { input.focus(); return; }
      overlay.classList.add('hidden');
      cleanup();
      onConfirm(round2(amt));
    };
    const doCancel = () => { overlay.classList.add('hidden'); cleanup(); };
    const onKey = (e) => { if (e.key === 'Enter') doConfirm(); if (e.key === 'Escape' && showCancel) doCancel(); };
    function cleanup() {
      confirmBtn.removeEventListener('click', doConfirm);
      cancelBtn.removeEventListener('click', doCancel);
      input.removeEventListener('keydown', onKey);
    }
    confirmBtn.addEventListener('click', doConfirm);
    cancelBtn.addEventListener('click', doCancel);
    input.addEventListener('keydown', onKey);
    input.focus();
    input.select();
  }

  // Screen-reader announcement of round outcomes (visually hidden region).
  function announce(msg) {
    let el = document.getElementById('srAnnounce');
    if (!el) {
      el = document.createElement('div');
      el.id = 'srAnnounce';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('role', 'status');
      el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;';
      document.body.appendChild(el);
    }
    el.textContent = '';
    setTimeout(() => { el.textContent = msg; }, 30);
  }

  // Fast play: shortens deal pauses. Remembered per browser (a convenience
  // preference only; bankrolls are never stored).
  const FAST_KEY = '0stakes.fastPlay';
  function getFast() { try { return localStorage.getItem(FAST_KEY) === '1'; } catch (e) { return false; } }
  function setFast(v) { try { localStorage.setItem(FAST_KEY, v ? '1' : '0'); } catch (e) { /* storage blocked */ } }
  function reducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  // Delay helper honoring fast play and reduced motion.
  function pause(ms) { return sleep(getFast() || reducedMotion() ? Math.min(ms, 60) : ms); }

  function bindFastToggle(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.checked = getFast();
    el.addEventListener('change', () => setFast(el.checked));
  }

  function chipsHtml(chips, selected, onclickName) {
    return chips.map(v =>
      `<button type="button" class="chip-btn ${v === selected ? 'selected' : ''}" aria-pressed="${v === selected}" onclick="${onclickName}(${v})">$${v}</button>`
    ).join('');
  }

  const TABLE_KIT = { round2, fmt, sleep, pause, SessionStats, showOverlay, announce, bindFastToggle, getFast, chipsHtml };
  if (typeof module !== 'undefined') module.exports = TABLE_KIT;
  if (typeof window !== 'undefined') window.TABLE_KIT = TABLE_KIT;
})();
