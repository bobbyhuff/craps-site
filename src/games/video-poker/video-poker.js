// 9/6 Jacks or Better UI. Rules, payouts and the exact hold advisor live in
// vp-engine.js; the paytable in ODDS (src/_data/videoPokerOdds.js). This
// file only manages bankroll, phases and rendering.

const { fmt, round2, pause, SessionStats, showOverlay, announce } = TABLE_KIT;

let state = null;

function newState(bankroll) {
  return {
    bankroll, startBankroll: bankroll,
    denom: ODDS.defaultDenomination,
    coins: ODDS.maxCoins,
    phase: 'bet', // bet -> hold -> done -> (deal again)
    deck: [],
    hand: [],
    held: [false, false, false, false, false],
    fresh: new Set(), // indexes to animate on next render
    result: null, // { key, payCoins, payAmt, winIdx }
    lastWin: null,
    stake: 0,
    busy: false,
    advice: null, // { forHand, results }
    showAdvice: false,
    stats: new SessionStats(),
    log: [],
  };
}

function notice(msg) { document.getElementById('notice').textContent = msg; }
function log(msg, cls) { state.log.push({ msg, cls: cls || 'neutral' }); }
function credit(x) { state.bankroll = round2(state.bankroll + x); }
function betAmount() { return round2(state.coins * state.denom); }

// ---------- betting ----------
function setChip(v) {
  if (state.phase === 'hold' || state.busy) return;
  state.denom = v;
  render();
}

function betOne() {
  if (state.phase === 'hold' || state.busy) return;
  state.coins = state.coins >= ODDS.maxCoins ? 1 : state.coins + 1;
  notice('');
  render();
}

function betMax() {
  if (state.phase === 'hold' || state.busy) return;
  state.coins = ODDS.maxCoins;
  deal();
}

// ---------- round flow ----------
async function deal() {
  if (state.phase === 'hold' || state.busy) return;
  const cost = betAmount();
  if (cost > state.bankroll + 1e-9) { notice(`Not enough bankroll for ${fmt(cost)}. Lower the coins or coin value.`); return; }
  notice('');
  state.bankroll = round2(state.bankroll - cost);
  state.stake = cost;
  state.deck = CARDS.shuffledDeck();
  state.hand = [];
  state.held = [false, false, false, false, false];
  state.result = null;
  state.advice = null;
  state.showAdvice = false;
  state.busy = true;
  state.phase = 'hold';
  for (let i = 0; i < 5; i++) {
    state.hand.push(state.deck.pop());
    state.fresh.add(i);
    render();
    await pause(80);
  }
  state.busy = false;
  const dealtKey = VP_ENGINE.evaluate(state.hand);
  document.getElementById('vpResult').textContent = dealtKey !== 'nothing' ? `Dealt: ${ODDS.names[dealtKey]}` : 'Tap cards to hold, then Draw';
  render();
  if (document.getElementById('coachChk').checked) ensureAdvice();
}

async function draw() {
  if (state.phase !== 'hold' || state.busy) return;
  state.busy = true;
  const heldMask = state.held.reduce((m, h, i) => m | (h ? 1 << i : 0), 0);
  const before = state.hand.slice();
  const coach = document.getElementById('coachChk').checked;
  let advice = null;
  if (coach) advice = await ensureAdvice(true);

  for (let i = 0; i < 5; i++) {
    if (!state.held[i]) {
      state.hand[i] = state.deck.pop();
      state.fresh.add(i);
      render();
      await pause(90);
    }
  }

  const key = VP_ENGINE.evaluate(state.hand);
  const payCoins = VP_ENGINE.payoutCoins(key, state.coins, ODDS);
  const payAmt = round2(payCoins * state.denom);
  credit(payAmt);
  state.stats.record(state.stake, payAmt);
  state.result = { key, payCoins, payAmt, winIdx: VP_ENGINE.winningCardIndexes(state.hand, key) };
  state.lastWin = payAmt;
  state.phase = 'done';
  state.busy = false;
  state.showAdvice = false;

  const hand = state.hand.map(CARDS.cardLabel).join(' ');
  if (payAmt > 0) {
    log(`${ODDS.names[key]}: ${hand}. Pays ${payCoins} coin${payCoins === 1 ? '' : 's'} (${fmt(payAmt)}).`, 'win');
    announce(`${ODDS.names[key]}. You win ${fmt(payAmt)}.`);
  } else {
    log(`No win: ${hand}. Lost ${fmt(state.stake)}.`, 'lose');
    announce(`No win. You lose ${fmt(state.stake)}.`);
  }
  if (advice) coachMessage(before, heldMask, advice);
  render();
}

function coachMessage(cards, heldMask, results) {
  const best = results[0];
  const mine = results.find(r => r.mask === heldMask);
  const label = mask => {
    const kept = [0, 1, 2, 3, 4].filter(i => mask & (1 << i)).map(i => CARDS.cardLabel(cards[i]));
    return kept.length ? kept.join(' ') : 'nothing (draw five)';
  };
  if (Math.abs(mine.ev - best.ev) < 1e-9) {
    log(`Strategy check: optimal hold (${label(heldMask)}).`, 'win');
  } else {
    log(`Strategy check: best hold was ${label(best.mask)}, averaging ${best.evPerCoin.toFixed(3)} back per coin bet. Your hold averages ${mine.evPerCoin.toFixed(3)}.`, 'lose');
  }
}

// Exact EV for all 32 holds. Runs once per dealt hand (a fraction of a
// second), yielding to the browser first so the "Calculating" text paints.
async function ensureAdvice(silent) {
  if (state.phase !== 'hold') return null;
  if (state.advice && state.advice.coins === state.coins) return state.advice.results;
  const handAtStart = state.hand.slice();
  if (!silent) { setAdviceText('Calculating every possible draw…'); }
  await new Promise(r => setTimeout(r, 20));
  const results = VP_ENGINE.analyzeHolds(handAtStart, state.coins, ODDS);
  if (state.hand.some((c, i) => c !== handAtStart[i]) && state.phase === 'hold') return results;
  state.advice = { coins: state.coins, results };
  return results;
}

async function showBestHold() {
  if (state.phase !== 'hold' || state.busy) { notice('Deal a hand first, then ask for the best hold.'); return; }
  await ensureAdvice();
  state.showAdvice = true;
  render();
}

function applyBestHold() {
  if (!state.advice || state.phase !== 'hold') return;
  const m = state.advice.results[0].mask;
  state.held = [0, 1, 2, 3, 4].map(i => !!(m & (1 << i)));
  render();
}

function setAdviceText(html) {
  const el = document.getElementById('vpAdvice');
  el.classList.remove('hidden');
  el.innerHTML = html;
}

function toggleHold(i) {
  if (state.phase !== 'hold' || state.busy) return;
  state.held[i] = !state.held[i];
  render();
}

function primaryAction() {
  if (state.phase === 'hold') draw();
  else deal();
}

function resetBankroll() {
  if (state.busy) return;
  showOverlay({
    title: 'Reset Bankroll?',
    text: 'This ends the current hand and starts a fresh session.',
    defaultValue: state.bankroll > 0 ? Math.round(state.bankroll) : 200,
    showCancel: true,
    confirmLabel: 'Reset',
    onConfirm: (amt) => {
      const denom = state.denom, coins = state.coins;
      state = newState(amt);
      state.denom = denom; state.coins = coins;
      log(`New session started with ${fmt(amt)}.`);
      render();
    },
  });
}

// ---------- rendering ----------
function render() {
  document.getElementById('bankroll').textContent = fmt(state.bankroll);
  const net = round2(state.bankroll - state.startBankroll);
  const netEl = document.getElementById('net');
  netEl.textContent = fmt(net);
  netEl.className = net >= 0 ? 'positive' : 'negative';
  document.getElementById('lastWin').textContent = state.lastWin === null ? '—' : fmt(state.lastWin);

  document.getElementById('coinsLabel').textContent = `${state.coins} coin${state.coins > 1 ? 's' : ''}`;
  document.getElementById('denomLabel').textContent = fmt(state.denom);
  document.getElementById('betTotal').textContent = fmt(betAmount());

  document.getElementById('chipSelector').innerHTML = ODDS.denominations.map(v =>
    `<button type="button" class="chip-btn ${v === state.denom ? 'selected' : ''}" aria-pressed="${v === state.denom}" onclick="setChip(${v})" ${state.phase === 'hold' ? 'disabled' : ''}>${v < 1 ? `${Math.round(v * 100)}¢` : `$${v}`}</button>`
  ).join('');

  renderPaytable();
  renderHand();
  renderResult();
  renderAdvice();

  const holding = state.phase === 'hold';
  const dealBtn = document.getElementById('dealBtn');
  dealBtn.textContent = holding ? 'Draw' : 'Deal';
  dealBtn.disabled = state.busy;
  document.getElementById('betOneBtn').disabled = holding || state.busy;
  document.getElementById('betMaxBtn').disabled = holding || state.busy;
  document.getElementById('adviseBtn').disabled = !holding || state.busy;

  state.stats.render(document.getElementById('sessionStats'), 'Hands');
  document.getElementById('log').innerHTML = state.log.slice().reverse().slice(0, 80).map(e => `<div class="${e.cls}">${e.msg}</div>`).join('');
}

function renderPaytable() {
  const t = document.getElementById('paytable');
  t.querySelectorAll('[data-col]').forEach(el => el.classList.toggle('is-col', +el.dataset.col === state.coins));
  t.querySelectorAll('tbody tr').forEach(tr => tr.classList.toggle('is-hit', !!(state.result && state.result.key === tr.dataset.key)));
}

function renderHand() {
  const wrap = document.getElementById('vpHand');
  if (!state.hand.length) {
    wrap.innerHTML = [0, 1, 2, 3, 4].map(() => `<div class="vp-slot">${CARDS.cardHtml(null, { faceDown: true })}<span class="held-tag">&nbsp;</span></div>`).join('');
    return;
  }
  const winSet = new Set(state.result ? state.result.winIdx : []);
  const adviseMask = state.showAdvice && state.advice ? state.advice.results[0].mask : null;
  wrap.innerHTML = state.hand.map((c, i) => {
    const cls = [];
    if (state.phase === 'done' && state.result && state.result.key !== 'nothing') cls.push(winSet.has(i) ? 'is-win' : 'is-dim');
    const advised = adviseMask !== null && (adviseMask & (1 << i));
    return `<button type="button" class="pcard-btn vp-slot ${state.held[i] ? 'is-held' : ''} ${advised ? 'is-advised' : ''}" onclick="toggleHold(${i})" ${state.phase !== 'hold' ? 'disabled' : ''} aria-pressed="${state.held[i]}" aria-label="${CARDS.cardSpoken(c)}${state.held[i] ? ', held' : ''}">
      ${CARDS.cardHtml(c, { isNew: state.fresh.has(i), cls: cls.join(' ') })}
      <span class="held-tag">${state.held[i] ? 'HELD' : (state.phase === 'hold' ? 'hold' : '&nbsp;')}</span>
    </button>`;
  }).join('');
  state.fresh.clear();
}

function renderResult() {
  const el = document.getElementById('vpResult');
  if (state.phase !== 'done' || !state.result) {
    if (state.phase === 'bet') { el.textContent = 'Pick your bet and deal'; el.className = 'round-result'; }
    else el.className = 'round-result';
    return;
  }
  const r = state.result;
  if (r.payAmt > 0) { el.textContent = `${ODDS.names[r.key]} · wins ${fmt(r.payAmt)}`; el.className = 'round-result is-win'; }
  else { el.textContent = 'No win'; el.className = 'round-result is-lose'; }
}

function renderAdvice() {
  const el = document.getElementById('vpAdvice');
  if (!state.showAdvice || !state.advice || state.phase !== 'hold') { el.classList.add('hidden'); return; }
  const res = state.advice.results;
  const lab = r => r.held.length ? r.held.map(i => CARDS.cardLabel(state.hand[i])).join(' ') : 'nothing (draw five)';
  const rows = res.slice(0, 3).map((r, k) => `<li${k === 0 ? ' class="is-best"' : ''}><span>${lab(r)}</span><b>${r.evPerCoin.toFixed(3)}</b></li>`).join('');
  el.classList.remove('hidden');
  el.innerHTML = `<div class="vp-advice-head"><span>Best holds, exact</span><span>avg return per coin</span></div>
    <ol>${rows}</ol>
    <button type="button" class="btn-outline vp-apply" onclick="applyBestHold()">Hold the best cards</button>`;
}

// ---------- init ----------
window.addEventListener('DOMContentLoaded', () => {
  state = newState(0);
  document.getElementById('dealBtn').addEventListener('click', primaryAction);
  document.getElementById('betOneBtn').addEventListener('click', betOne);
  document.getElementById('betMaxBtn').addEventListener('click', betMax);
  document.getElementById('adviseBtn').addEventListener('click', showBestHold);
  document.getElementById('resetBtn').addEventListener('click', resetBankroll);
  TABLE_KIT.bindFastToggle('fastChk');

  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('setupOverlay').classList.contains('hidden')) return;
    if (e.target.closest('input, select, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[1-5]$/.test(e.key)) { toggleHold(+e.key - 1); e.preventDefault(); }
    else if (e.key === 'Enter' && !e.target.closest('button, a, summary')) { primaryAction(); e.preventDefault(); }
    else if (e.key === 'h' || e.key === 'H') showBestHold();
  });

  showOverlay({
    title: 'Welcome to Video Poker',
    text: 'Set your starting bankroll to begin.',
    defaultValue: 200,
    showCancel: false,
    onConfirm: (amt) => {
      state = newState(amt);
      log(`Session started with ${fmt(amt)}.`);
      render();
    },
  });
  render();
});
