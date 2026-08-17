const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♦', '♣'];
const CHIPS = [1, 5, 10, 25, 50, 100, 250];
const NUM_DECKS = 8;
const RESHUFFLE_CUTOFF = 60;

// All payout/odds/rule numbers come from the ODDS global -- see
// src/_data/baccaratOdds.js, loaded via a <script> tag in index.njk before
// this file.

let state = null;

function newState(bankroll) {
  return {
    bankroll, startBankroll: bankroll,
    chip: 10,
    phase: 'betting', // betting -> dealing -> payout -> betting
    shoe: [],
    betType: null, // 'player' | 'banker' | 'tie'
    betAmount: 0,
    lastBetType: null,
    lastBetAmount: 0,
    player: { cards: [], shownCount: 0 },
    banker: { cards: [], shownCount: 0 },
    result: null, // { winner, playerTotal, bankerTotal, outcome, payoutAmt }
    isDealing: false,
    log: [],
  };
}

const DEAL_DELAY_MS = 450;
const RESULT_PAUSE_MS = 500;

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function dealCardTo(target, card) {
  target.cards.push(card);
  render();
  target.shownCount = target.cards.length;
  await sleep(DEAL_DELAY_MS);
}

function fmt(n) {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

function payout(amount, ratio) { return amount * ratio[0] / ratio[1]; }

function credit(x) { state.bankroll = Math.round((state.bankroll + x) * 100) / 100; }

function spend(x) {
  if (x > state.bankroll + 1e-9) { notice("Not enough bankroll."); return false; }
  state.bankroll = Math.round((state.bankroll - x) * 100) / 100;
  return true;
}

function notice(msg) { document.getElementById('notice').textContent = msg; }

function log(msg, cls) {
  state.log.push({ msg, cls: cls || 'neutral' });
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

function resetBankroll() {
  if (state.isDealing) { notice('Please wait for the current hand to finish.'); return; }
  showOverlay({
    title: "Reset Bankroll?",
    text: "This clears the current hand and starts a fresh session.",
    defaultValue: state.bankroll > 0 ? Math.round(state.bankroll) : 200,
    showCancel: true,
    confirmLabel: "Reset",
    onConfirm: (amt) => {
      state = newState(amt);
      log(`New session started with ${fmt(amt)}.`);
      render();
    },
  });
}

// ---------- shoe ----------
function buildShoe() {
  const shoe = [];
  for (let d = 0; d < NUM_DECKS; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) shoe.push({ rank, suit });
    }
  }
  shuffle(shoe);
  state.shoe = shoe;
  log(`Shoe shuffled — ${shoe.length} cards.`, 'neutral');
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function needsReshuffle() { return !state.shoe || state.shoe.length < RESHUFFLE_CUTOFF; }
function drawCard() { return state.shoe.pop(); }

// ---------- card/hand math ----------
function cardValue(card) {
  if (card.rank === 'A') return 1;
  if (card.rank === 'K' || card.rank === 'Q' || card.rank === 'J' || card.rank === '10') return 0;
  return parseInt(card.rank, 10);
}

function handTotal(cards) {
  const sum = cards.reduce((s, c) => s + cardValue(c), 0);
  return sum % 10;
}

function isNatural(cards) { return cards.length === 2 && handTotal(cards) >= 8; }

// ---------- bet placement ----------
function clickBetSpot(type) {
  if (state.phase !== 'betting' || state.isDealing) return;
  if (state.betType && state.betType !== type) {
    notice('Clear your bet before switching spots.');
    return;
  }
  if (!spend(state.chip)) return;
  state.betType = type;
  state.betAmount = Math.round((state.betAmount + state.chip) * 100) / 100;
  notice('');
  render();
}

function removeBet() {
  if (state.phase !== 'betting' || state.isDealing || state.betAmount <= 0) return;
  credit(state.betAmount);
  state.betType = null;
  state.betAmount = 0;
  render();
}

function tryRebet() {
  if (!state.lastBetType || state.betAmount > 0) return false;
  if (!spend(state.lastBetAmount)) return false;
  state.betType = state.lastBetType;
  state.betAmount = state.lastBetAmount;
  return true;
}

function rebet() {
  if (state.phase !== 'betting' || state.isDealing) return;
  tryRebet();
  render();
}

function maybeAutoRebet() {
  if (state.phase !== 'betting') return;
  const chk = document.getElementById('autoRebetChk');
  if (chk && chk.checked) tryRebet();
}

function dealClick() {
  if (state.phase !== 'betting' || state.isDealing) return;
  if (state.betAmount <= 0) { notice('Place a bet first.'); return; }
  dealInitial();
}

// ---------- round flow ----------
async function dealInitial() {
  notice('');
  if (needsReshuffle()) buildShoe();

  state.player = { cards: [], shownCount: 0 };
  state.banker = { cards: [], shownCount: 0 };
  state.result = null;
  state.lastBetType = state.betType;
  state.lastBetAmount = state.betAmount;

  state.isDealing = true;
  state.phase = 'dealing';
  render();

  await dealCardTo(state.player, drawCard());
  await dealCardTo(state.banker, drawCard());
  await dealCardTo(state.player, drawCard());
  await dealCardTo(state.banker, drawCard());

  const playerNatural = isNatural(state.player.cards);
  const bankerNatural = isNatural(state.banker.cards);

  if (!playerNatural && !bankerNatural) {
    let playerThirdValue = null;
    if (handTotal(state.player.cards) <= 5) {
      const card = drawCard();
      playerThirdValue = cardValue(card);
      await dealCardTo(state.player, card);
    }

    const bTotal = handTotal(state.banker.cards);
    const bankerDraws = playerThirdValue === null
      ? ODDS.bankerThirdCardRule.playerStoodDrawTotals.includes(bTotal)
      : bankerShouldDrawOnThird(bTotal, playerThirdValue);

    if (bankerDraws) await dealCardTo(state.banker, drawCard());
  }

  await sleep(RESULT_PAUSE_MS);
  settleRound();
  state.phase = 'payout';
  state.isDealing = false;
  render();
}

function bankerShouldDrawOnThird(bankerTotal, playerThirdValue) {
  const rule = ODDS.bankerThirdCardRule.drawsOnPlayerThird[bankerTotal];
  if (rule === 'always') return true;
  if (Array.isArray(rule)) return rule.includes(playerThirdValue);
  return false;
}

function settleRound() {
  const pTotal = handTotal(state.player.cards);
  const bTotal = handTotal(state.banker.cards);
  const winner = pTotal > bTotal ? 'player' : (bTotal > pTotal ? 'banker' : 'tie');

  const bet = state.betAmount;
  const type = state.betType;
  let outcome, payoutAmt = 0;

  if (type === 'player') {
    if (winner === 'player') {
      const w = payout(bet, ODDS.payouts.player);
      credit(bet + w);
      outcome = 'win'; payoutAmt = w;
      log(`Player wins ${pTotal}-${bTotal}. You win ${fmt(w)}.`, 'win');
    } else if (winner === 'tie') {
      credit(bet);
      outcome = 'push';
      log(`Tie at ${pTotal}. Player bet pushes.`, 'neutral');
    } else {
      outcome = 'lose';
      log(`Banker wins ${bTotal}-${pTotal}. You lose ${fmt(bet)}.`, 'lose');
    }
  } else if (type === 'banker') {
    if (winner === 'banker') {
      const gross = payout(bet, ODDS.payouts.banker);
      const commission = Math.round(gross * (ODDS.bankerCommissionPct / 100) * 100) / 100;
      const net = Math.round((gross - commission) * 100) / 100;
      credit(bet + net);
      outcome = 'win'; payoutAmt = net;
      log(`Banker wins ${bTotal}-${pTotal}. You win ${fmt(net)} after ${ODDS.bankerCommissionPct}% commission.`, 'win');
    } else if (winner === 'tie') {
      credit(bet);
      outcome = 'push';
      log(`Tie at ${bTotal}. Banker bet pushes.`, 'neutral');
    } else {
      outcome = 'lose';
      log(`Player wins ${pTotal}-${bTotal}. You lose ${fmt(bet)}.`, 'lose');
    }
  } else if (type === 'tie') {
    if (winner === 'tie') {
      const w = payout(bet, ODDS.payouts.tie);
      credit(bet + w);
      outcome = 'win'; payoutAmt = w;
      log(`Tie at ${pTotal}! You win ${fmt(w)}.`, 'win');
    } else {
      outcome = 'lose';
      log(`${winner === 'player' ? 'Player' : 'Banker'} wins ${winner === 'player' ? pTotal : bTotal}-${winner === 'player' ? bTotal : pTotal}. Tie bet loses ${fmt(bet)}.`, 'lose');
    }
  }

  state.result = { winner, playerTotal: pTotal, bankerTotal: bTotal, betType: type, betAmount: bet, outcome, payoutAmt };
  state.betType = null;
  state.betAmount = 0;
}

function nextRound() {
  if (state.isDealing) return;
  state.phase = 'betting';
  state.player = { cards: [], shownCount: 0 };
  state.banker = { cards: [], shownCount: 0 };
  state.result = null;
  notice('');
  maybeAutoRebet();
  render();
}

// ---------- rendering ----------
function cardHtml(card, opts) {
  opts = opts || {};
  const red = card.suit === '♥' || card.suit === '♦';
  const animCls = opts.isNew ? ' pcard-deal-in' : '';
  return `<div class="pcard ${red ? 'is-red' : ''}${animCls}">
    <div class="pcard-corner">${card.rank}<span class="pcard-corner-suit">${card.suit}</span></div>
    <div class="pcard-suit-big">${card.suit}</div>
  </div>`;
}

function render() {
  document.getElementById('bankroll').textContent = fmt(state.bankroll);
  const net = Math.round((state.bankroll - state.startBankroll) * 100) / 100;
  const netEl = document.getElementById('net');
  netEl.textContent = fmt(net);
  netEl.className = net >= 0 ? 'positive' : 'negative';
  document.getElementById('shoeCount').textContent = state.shoe && state.shoe.length ? state.shoe.length : '—';

  renderChips();
  renderHand('playerHand', 'playerTotal', state.player, state.result && state.result.winner === 'player');
  renderHand('bankerHand', 'bankerTotal', state.banker, state.result && state.result.winner === 'banker');
  renderResult();
  renderBetSpots();

  document.getElementById('betArea').classList.toggle('hidden', state.phase !== 'betting');
  document.getElementById('newHandWrap').classList.toggle('hidden', state.phase !== 'payout');

  document.getElementById('clearBetBtn').disabled = state.betAmount <= 0 || state.isDealing;
  document.getElementById('rebetBtn').disabled = !state.lastBetType || state.betAmount > 0 || state.isDealing;
  document.getElementById('dealBtn').disabled = state.betAmount <= 0 || state.isDealing;
  document.getElementById('newHandBtn').disabled = state.isDealing;

  renderLog();
}

function renderChips() {
  const c = document.getElementById('chipSelector');
  c.innerHTML = CHIPS.map(v =>
    `<button class="chip-btn ${v === state.chip ? 'selected' : ''}" onclick="setChip(${v})">$${v}</button>`
  ).join('');
}

function setChip(v) { state.chip = v; render(); }

function renderHand(handElId, totalElId, hand, isWinner) {
  const wrap = document.getElementById(handElId);
  const totalEl = document.getElementById(totalElId);
  const cards = hand.cards || [];

  if (!cards.length) { wrap.innerHTML = ''; totalEl.textContent = ''; totalEl.className = 'hand-total'; return; }

  const shown = hand.shownCount || 0;
  wrap.innerHTML = cards.map((c, i) => cardHtml(c, { isNew: i >= shown })).join('');

  const total = handTotal(cards);
  let cls = 'hand-total';
  let label = `${total}`;
  if (state.phase === 'payout') {
    if (isNatural(cards)) label = `${total} · Natural`;
    if (isWinner) cls += ' is-win';
    else if (state.result && state.result.winner !== 'tie') cls += ' is-lose';
  }
  totalEl.textContent = label;
  totalEl.className = cls;
}

function renderResult() {
  const el = document.getElementById('bacResult');
  if (state.phase !== 'payout' || !state.result) { el.textContent = ''; el.className = 'bacc-result'; return; }
  const r = state.result;
  const winnerLabel = r.winner === 'tie' ? 'Tie' : (r.winner === 'player' ? 'Player wins' : 'Banker wins');
  el.textContent = r.winner === 'tie' ? `Tie at ${r.playerTotal}` : winnerLabel;
  el.className = `bacc-result is-${r.winner}`;
}

function renderBetSpots() {
  ['player', 'banker', 'tie'].forEach(type => {
    const spot = document.getElementById(`spot${type.charAt(0).toUpperCase()}${type.slice(1)}`);
    const amtEl = document.getElementById(`amt${type.charAt(0).toUpperCase()}${type.slice(1)}`);
    const active = state.betType === type && state.betAmount > 0;
    spot.classList.toggle('is-selected', active);
    amtEl.textContent = active ? fmt(state.betAmount) : '—';
  });
}

function renderLog() {
  const el = document.getElementById('log');
  el.innerHTML = state.log.slice().reverse().slice(0, 80).map(e =>
    `<div class="${e.cls}">${e.msg}</div>`
  ).join('');
}

// ---------- init ----------
window.addEventListener('DOMContentLoaded', () => {
  state = newState(0);

  document.getElementById('spotPlayer').addEventListener('click', () => clickBetSpot('player'));
  document.getElementById('spotBanker').addEventListener('click', () => clickBetSpot('banker'));
  document.getElementById('spotTie').addEventListener('click', () => clickBetSpot('tie'));
  document.getElementById('clearBetBtn').addEventListener('click', removeBet);
  document.getElementById('rebetBtn').addEventListener('click', rebet);
  document.getElementById('dealBtn').addEventListener('click', dealClick);
  document.getElementById('newHandBtn').addEventListener('click', nextRound);
  document.getElementById('resetBtn').addEventListener('click', resetBankroll);

  showOverlay({
    title: "Welcome to Baccarat",
    text: "Set your starting bankroll to begin.",
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
