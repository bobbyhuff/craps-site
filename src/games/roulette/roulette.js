const CHIPS = [1, 5, 10, 25, 50, 100, 250];
const SPIN_DURATION_MS = 2300;
const REVEAL_PAUSE_MS = 900;

// All payout/odds numbers come from the ODDS global -- see
// src/_data/rouletteOdds.js, loaded via a <script> tag in index.njk before
// this file.

let state = null;
let nextBetId = 1;
let wheelTotalDeg = 0;

function range(a, b, step) {
  step = step || 1;
  const out = [];
  for (let n = a; n <= b; n += step) out.push(n);
  return out;
}

const OUTSIDE_DEFS = {
  red: { label: 'Red', numbers: ODDS.redNumbers.map(String), ratioKey: 'outside' },
  black: { label: 'Black', numbers: ODDS.blackNumbers.map(String), ratioKey: 'outside' },
  odd: { label: 'Odd', numbers: range(1, 35, 2).map(String), ratioKey: 'outside' },
  even: { label: 'Even', numbers: range(2, 36, 2).map(String), ratioKey: 'outside' },
  low: { label: '1 to 18', numbers: range(1, 18).map(String), ratioKey: 'outside' },
  high: { label: '19 to 36', numbers: range(19, 36).map(String), ratioKey: 'outside' },
  dozen1: { label: '1st 12', numbers: range(1, 12).map(String), ratioKey: 'dozen' },
  dozen2: { label: '2nd 12', numbers: range(13, 24).map(String), ratioKey: 'dozen' },
  dozen3: { label: '3rd 12', numbers: range(25, 36).map(String), ratioKey: 'dozen' },
  col1: { label: 'Column 1', numbers: range(1, 34, 3).map(String), ratioKey: 'column' },
  col2: { label: 'Column 2', numbers: range(2, 35, 3).map(String), ratioKey: 'column' },
  col3: { label: 'Column 3', numbers: range(3, 36, 3).map(String), ratioKey: 'column' },
  topLine: { label: 'Top Line (0-00-1-2-3)', numbers: ['0', '00', '1', '2', '3'], ratioKey: 'topLine' },
};

function newState(bankroll) {
  return {
    bankroll, startBankroll: bankroll,
    chip: 10,
    betMode: 'straight', // 'straight' | 'combo'
    comboSelection: [], // numbers (ints, 1-36) currently toggled for a combo bet
    bets: [], // { id, type, numbers: [str], label, ratioKey, amount }
    lastBets: [],
    phase: 'betting', // betting -> spinning -> reveal -> betting
    lastResult: null, // winning pocket, e.g. '17', '0', '00'
    history: [],
    spins: 0,
    log: [],
  };
}

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function fmt(n) {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

function payout(amount, ratio) { return amount * ratio[0] / ratio[1]; }

function credit(x) { state.bankroll = Math.round((state.bankroll + x) * 100) / 100; }

function spend(x) {
  if (x > state.bankroll + 1e-9) { notice('Not enough bankroll.'); return false; }
  state.bankroll = Math.round((state.bankroll - x) * 100) / 100;
  return true;
}

function notice(msg) { document.getElementById('notice').textContent = msg; }

function log(msg, cls) { state.log.push({ msg, cls: cls || 'neutral' }); }

// ---------- grid geometry (numbers 1-36, 12 rows x 3 columns) ----------
function rowOf(n) { return Math.ceil(n / 3); }
function colOf(n) { return ((n - 1) % 3) + 1; }

function pocketClass(pocket) {
  if (pocket === '0' || pocket === '00') return 'is-green';
  return ODDS.redNumbers.includes(parseInt(pocket, 10)) ? 'is-red' : 'is-black';
}

// ---------- combo bet detection ----------
// Given a set of selected numbers (1-36), returns the matching inside bet
// (split/street/corner/six line) or null if the selection isn't a valid
// adjacent shape yet. 0 and 00 never participate here -- see index.njk /
// the page's rules note for why (no consistent real-table convention for
// 0/00 splits, so this game only offers them straight-up or in the top line).
function detectCombo(sel) {
  const nums = sel.slice().sort((a, b) => a - b);
  if (nums.length === 1) {
    return { type: 'straightUp', label: `Straight ${nums[0]}`, numbers: nums.map(String) };
  }
  if (nums.length === 2) {
    const [a, b] = nums;
    const rowSplit = rowOf(a) === rowOf(b) && Math.abs(colOf(a) - colOf(b)) === 1;
    const colSplit = colOf(a) === colOf(b) && Math.abs(rowOf(a) - rowOf(b)) === 1;
    if (rowSplit || colSplit) return { type: 'split', label: `Split ${a}-${b}`, numbers: nums.map(String) };
    return null;
  }
  if (nums.length === 3) {
    const rows = new Set(nums.map(rowOf));
    const cols = new Set(nums.map(colOf));
    if (rows.size === 1 && cols.size === 3) return { type: 'street', label: `Street ${nums.join('-')}`, numbers: nums.map(String) };
    return null;
  }
  if (nums.length === 4) {
    const rows = [...new Set(nums.map(rowOf))];
    const cols = [...new Set(nums.map(colOf))];
    if (rows.length === 2 && cols.length === 2 && Math.abs(rows[0] - rows[1]) === 1 && Math.abs(cols[0] - cols[1]) === 1) {
      const expected = new Set();
      rows.forEach((r) => cols.forEach((c) => expected.add((r - 1) * 3 + c)));
      if (expected.size === 4 && nums.every((n) => expected.has(n))) {
        return { type: 'corner', label: `Corner ${nums.join('-')}`, numbers: nums.map(String) };
      }
    }
    return null;
  }
  if (nums.length === 6) {
    const rows = [...new Set(nums.map(rowOf))];
    if (rows.length === 2 && Math.abs(rows[0] - rows[1]) === 1) {
      const expected = new Set();
      rows.forEach((r) => [1, 2, 3].forEach((c) => expected.add((r - 1) * 3 + c)));
      if (expected.size === 6 && nums.every((n) => expected.has(n))) {
        const top = Math.min(...rows);
        return { type: 'sixLine', label: `Six Line ${top * 3 - 2}-${(top + 1) * 3}`, numbers: nums.map(String) };
      }
    }
    return null;
  }
  return null;
}

// ---------- placing / removing bets ----------
function findBet(type, numbers) {
  const key = numbers.slice().sort().join(',');
  return state.bets.find((b) => b.type === type && b.numbers.slice().sort().join(',') === key);
}

function addBetToState(type, numbers, label, ratioKey) {
  if (state.phase !== 'betting') return;
  const existing = findBet(type, numbers);
  if (!spend(state.chip)) return;
  if (existing) {
    existing.amount = Math.round((existing.amount + state.chip) * 100) / 100;
  } else {
    state.bets.push({ id: nextBetId++, type, numbers, label, ratioKey, amount: state.chip });
  }
  render();
}

function removeBet(id) {
  if (state.phase !== 'betting') return;
  const idx = state.bets.findIndex((b) => b.id === id);
  if (idx < 0) return;
  credit(state.bets[idx].amount);
  state.bets.splice(idx, 1);
  render();
}

function clearAllBets() {
  if (state.phase !== 'betting') return;
  state.bets.forEach((b) => credit(b.amount));
  state.bets = [];
  notice('');
  render();
}

function rebetLast() {
  if (state.phase !== 'betting' || !state.lastBets.length || state.bets.length) return;
  const total = state.lastBets.reduce((s, b) => s + b.amount, 0);
  if (!spend(total)) return;
  state.bets = state.lastBets.map((b) => ({ ...b, id: nextBetId++ }));
  render();
}

// ---------- click handlers ----------
function setChip(v) { state.chip = v; render(); }

function setBetMode(mode) {
  state.betMode = mode;
  state.comboSelection = [];
  render();
}

function clickCell(pocket) {
  if (state.phase !== 'betting') return;
  if (pocket === '0' || pocket === '00' || state.betMode === 'straight') {
    addBetToState('straightUp', [pocket], `Straight ${pocket}`, 'straightUp');
    return;
  }
  const n = parseInt(pocket, 10);
  const idx = state.comboSelection.indexOf(n);
  if (idx >= 0) {
    state.comboSelection.splice(idx, 1);
  } else {
    if (state.comboSelection.length >= 6) { notice('Clear the selection to start a new combo bet.'); return; }
    state.comboSelection.push(n);
  }
  notice('');
  render();
}

function confirmCombo() {
  const combo = detectCombo(state.comboSelection);
  if (!combo) return;
  addBetToState(combo.type, combo.numbers, combo.label, combo.type);
  state.comboSelection = [];
  render();
}

function clearCombo() { state.comboSelection = []; render(); }

function clickOutside(kind) {
  if (state.phase !== 'betting') return;
  const def = OUTSIDE_DEFS[kind];
  addBetToState(kind, def.numbers, def.label, def.ratioKey);
}

function resetBankroll() {
  if (state.phase !== 'betting') { notice('Please wait for the spin to finish.'); return; }
  showOverlay({
    title: 'Reset Bankroll?',
    text: 'This clears all current bets and starts a fresh session.',
    defaultValue: state.bankroll > 0 ? Math.round(state.bankroll) : 200,
    showCancel: true,
    confirmLabel: 'Reset',
    onConfirm: (amt) => {
      state = newState(amt);
      log(`New session started with ${fmt(amt)}.`);
      render();
    },
  });
}

function showOverlay({ title, text, defaultValue, showCancel, confirmLabel, onConfirm }) {
  const overlay = document.getElementById('setupOverlay');
  document.getElementById('overlayTitle').textContent = title;
  document.getElementById('overlayText').textContent = text;
  const input = document.getElementById('overlayInput');
  input.value = defaultValue;
  const cancelBtn = document.getElementById('overlayCancel');
  cancelBtn.style.display = showCancel ? 'inline-block' : 'none';
  overlay.classList.remove('hidden');

  const confirmBtn = document.getElementById('overlayConfirm');
  confirmBtn.textContent = confirmLabel || 'Start';
  const doConfirm = () => {
    const amt = parseFloat(input.value);
    if (isNaN(amt) || amt <= 0) { input.focus(); return; }
    overlay.classList.add('hidden');
    cleanup();
    onConfirm(amt);
  };
  const doCancel = () => { overlay.classList.add('hidden'); cleanup(); };
  const onKey = (e) => { if (e.key === 'Enter') doConfirm(); };

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

// ---------- the spin ----------
async function spin() {
  if (state.phase !== 'betting') return;
  if (!state.bets.length) { notice('Place a bet first.'); return; }
  notice('');

  state.phase = 'spinning';
  state.lastResult = null;
  render();

  // Purely decorative -- the wheel's landing position has no bearing on the
  // outcome, which is drawn independently below. Extra full turns plus a
  // random offset each time just keeps the spin from looking identical
  // twice in a row.
  wheelTotalDeg += 1080 + Math.floor(Math.random() * 360);
  const wheel = document.getElementById('rlWheel');
  if (wheel) wheel.style.transform = `rotate(${wheelTotalDeg}deg)`;

  await sleep(SPIN_DURATION_MS);

  const pockets = ODDS.wheelOrder;
  const winning = pockets[Math.floor(Math.random() * pockets.length)];

  state.phase = 'reveal';
  state.lastResult = winning;
  state.history.unshift(winning);
  if (state.history.length > 14) state.history.pop();
  render();

  await sleep(REVEAL_PAUSE_MS);

  const colorWord = winning === '0' || winning === '00' ? 'Green' : (ODDS.redNumbers.includes(parseInt(winning, 10)) ? 'Red' : 'Black');
  log(`Spin #${state.spins + 1}: ${winning} (${colorWord})`, 'roll-header');
  resolveBets(winning);

  state.lastBets = state.bets.map((b) => ({ ...b }));
  state.bets = [];
  state.spins++;
  state.phase = 'betting';
  render();
}

function resolveBets(winning) {
  state.bets.forEach((bet) => {
    const ratio = ODDS.payouts[bet.ratioKey];
    if (bet.numbers.includes(winning)) {
      const w = payout(bet.amount, ratio);
      credit(bet.amount + w);
      log(`${bet.label} wins ${fmt(w)}.`, 'win');
    } else {
      log(`${bet.label} loses ${fmt(bet.amount)}.`, 'lose');
    }
  });
}

// ---------- rendering ----------
function render() {
  document.getElementById('bankroll').textContent = fmt(state.bankroll);
  const net = Math.round((state.bankroll - state.startBankroll) * 100) / 100;
  const netEl = document.getElementById('net');
  netEl.textContent = fmt(net);
  netEl.className = net >= 0 ? 'positive' : 'negative';
  document.getElementById('lastSpin').textContent = state.lastResult || '—';

  renderChips();
  renderTable();
  renderComboPanel();
  renderActiveBets();
  renderResult();
  renderHistory();
  renderLog();

  document.querySelector(`input[name=betMode][value=${state.betMode}]`).checked = true;
  document.getElementById('rlTable').classList.toggle('is-locked', state.phase !== 'betting');
  document.getElementById('spinBtn').disabled = state.phase !== 'betting' || !state.bets.length;
  document.getElementById('clearBetsBtn').disabled = state.phase !== 'betting' || !state.bets.length;
  document.getElementById('rebetBtn').disabled = state.phase !== 'betting' || !state.lastBets.length || state.bets.length > 0;
}

function renderChips() {
  const c = document.getElementById('chipSelector');
  c.innerHTML = CHIPS.map((v) =>
    `<button class="chip-btn ${v === state.chip ? 'selected' : ''}" onclick="setChip(${v})">$${v}</button>`
  ).join('');
}

function cellHtml(pocket) {
  const cls = pocketClass(pocket);
  const selected = state.betMode === 'combo' && pocket !== '0' && pocket !== '00' && state.comboSelection.includes(parseInt(pocket, 10));
  const bet = findBet('straightUp', [pocket]);
  return `<button type="button" class="rl-cell ${cls} ${selected ? 'is-selected' : ''}" onclick="clickCell('${pocket}')">
    <span class="rl-cell-num">${pocket}</span>
    ${bet ? `<span class="rl-amt">${fmt(bet.amount)}</span>` : ''}
  </button>`;
}

function renderTable() {
  document.getElementById('rlZeroRow').innerHTML = ['0', '00'].map(cellHtml).join('');

  let html = '';
  for (let row = 1; row <= 12; row++) {
    for (let col = 1; col <= 3; col++) {
      html += cellHtml(String((row - 1) * 3 + col));
    }
  }
  document.getElementById('rlGrid').innerHTML = html;

  document.getElementById('rlDozens').innerHTML = ['dozen1', 'dozen2', 'dozen3'].map(outsideBoxHtml).join('');
  document.getElementById('rlColumns').innerHTML = ['col1', 'col2', 'col3'].map(outsideBoxHtml).join('');
  document.getElementById('rlEvens').innerHTML = ['low', 'even', 'red', 'black', 'odd', 'high'].map(outsideBoxHtml).join('');
  document.getElementById('rlTopLine').innerHTML = outsideBoxHtml('topLine');
}

function outsideBoxHtml(kind) {
  const def = OUTSIDE_DEFS[kind];
  const bet = findBet(kind, def.numbers);
  const ratio = ODDS.payouts[def.ratioKey];
  const colorCls = kind === 'red' ? 'is-red-box' : kind === 'black' ? 'is-black-box' : '';
  return `<div class="rl-obox ${colorCls}" onclick="clickOutside('${kind}')">
    <div class="rl-obox-label">${def.label}</div>
    <div class="rl-obox-pay">${ratio[0]}:${ratio[1]}</div>
    ${bet ? `<div class="rl-obox-amt">${fmt(bet.amount)}</div>` : ''}
  </div>`;
}

function renderComboPanel() {
  const panel = document.getElementById('rlComboPanel');
  if (state.betMode !== 'combo') { panel.classList.add('hidden'); return; }
  panel.classList.remove('hidden');

  if (!state.comboSelection.length) {
    panel.innerHTML = '<p class="rl-combo-hint">Tap adjacent numbers on the grid: 2 for a split, 3 in a row for a street, a 2&times;2 block for a corner, or two full rows for a six line.</p>';
    return;
  }

  const combo = detectCombo(state.comboSelection);
  const picked = state.comboSelection.slice().sort((a, b) => a - b).join(', ');
  if (!combo) {
    panel.innerHTML = `
      <p class="rl-combo-hint">Selected: ${picked} — not a valid combination yet.</p>
      <button type="button" class="btn-outline" onclick="clearCombo()">Clear</button>`;
    return;
  }

  const ratio = ODDS.payouts[combo.type];
  panel.innerHTML = `
    <p class="rl-combo-hint"><b>${combo.label}</b> — pays ${ratio[0]}:${ratio[1]}</p>
    <div class="rl-combo-actions">
      <button type="button" class="btn-roll" onclick="confirmCombo()">Place ${fmt(state.chip)} Bet</button>
      <button type="button" class="btn-outline" onclick="clearCombo()">Clear</button>
    </div>`;
}

function renderActiveBets() {
  const wrap = document.getElementById('rlBetsList');
  const totalEl = document.getElementById('rlBetsTotal');
  if (!state.bets.length) {
    wrap.innerHTML = '<p class="rl-no-bets">No bets placed yet. Tap a number or an outside bet to begin.</p>';
    totalEl.textContent = fmt(0);
    return;
  }
  wrap.innerHTML = state.bets.map((b) => {
    const ratio = ODDS.payouts[b.ratioKey];
    return `<div class="rl-bet-row">
      <span class="rl-bet-label">${b.label}</span>
      <span class="rl-bet-pay">${ratio[0]}:${ratio[1]}</span>
      <span class="rl-bet-amt">${fmt(b.amount)}</span>
      <button type="button" class="mini-btn" onclick="removeBet(${b.id})">X</button>
    </div>`;
  }).join('');
  const total = state.bets.reduce((s, b) => s + b.amount, 0);
  totalEl.textContent = fmt(total);
}

function renderResult() {
  const el = document.getElementById('rlResult');
  if (state.phase === 'spinning') {
    el.textContent = 'Spinning…';
    el.className = 'rl-result is-spinning';
    return;
  }
  if (!state.lastResult) {
    el.textContent = 'Place a bet and spin';
    el.className = 'rl-result';
    return;
  }
  el.textContent = state.lastResult;
  el.className = `rl-result ${pocketClass(state.lastResult)} ${state.phase === 'reveal' ? 'is-landed' : ''}`;
}

function renderHistory() {
  const el = document.getElementById('rlHistory');
  el.innerHTML = state.history.map((p) => `<div class="rl-history-chip ${pocketClass(p)}">${p}</div>`).join('');
}

function renderLog() {
  const el = document.getElementById('log');
  el.innerHTML = state.log.slice().reverse().slice(0, 80).map((e) =>
    `<div class="${e.cls}">${e.msg}</div>`
  ).join('');
}

// ---------- init ----------
window.addEventListener('DOMContentLoaded', () => {
  state = newState(0);

  document.getElementById('spinBtn').addEventListener('click', spin);
  document.getElementById('clearBetsBtn').addEventListener('click', clearAllBets);
  document.getElementById('rebetBtn').addEventListener('click', rebetLast);
  document.getElementById('resetBtn').addEventListener('click', resetBankroll);
  document.querySelectorAll('input[name=betMode]').forEach((r) =>
    r.addEventListener('change', (e) => setBetMode(e.target.value))
  );

  showOverlay({
    title: 'Welcome to Roulette',
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
