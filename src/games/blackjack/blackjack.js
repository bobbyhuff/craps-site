const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♦', '♣'];
const CHIPS = [1, 5, 10, 25, 50, 100, 250];
const NUM_DECKS = 6;
const RESHUFFLE_CUTOFF = 52;

// All payout/odds/rule numbers come from the ODDS global — see
// src/_data/blackjack-odds.js, loaded via a <script> tag in index.njk before
// this file.

let state = null;

function newState(bankroll) {
  return {
    bankroll, startBankroll: bankroll,
    chip: 10,
    phase: 'betting', // betting -> insurance -> playing -> dealer -> payout -> betting
    shoe: [],
    currentBet: 0,
    lastBet: 0,
    hands: [],
    activeHandIndex: 0,
    dealer: { cards: [], holeRevealed: false },
    insuranceBet: 0,
    insuranceOffered: false,
    log: [],
  };
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
  if (card.rank === 'A') return 11;
  if (card.rank === 'K' || card.rank === 'Q' || card.rank === 'J') return 10;
  return parseInt(card.rank, 10);
}

function handValue(cards) {
  let total = 0, aces = 0;
  for (const c of cards) {
    if (c.rank === 'A') { aces++; total += 11; }
    else total += cardValue(c);
  }
  let softAces = aces;
  while (total > 21 && softAces > 0) { total -= 10; softAces--; }
  return { total, soft: softAces > 0 };
}

function isBlackjack(cards) { return cards.length === 2 && handValue(cards).total === 21; }

// ---------- round flow ----------
function activeHand() { return state.hands[state.activeHandIndex] || null; }

function clickBetSpot() {
  if (state.phase !== 'betting') return;
  if (!spend(state.chip)) return;
  state.currentBet = Math.round((state.currentBet + state.chip) * 100) / 100;
  render();
}

function removeBet() {
  if (state.phase !== 'betting' || state.currentBet <= 0) return;
  credit(state.currentBet); state.currentBet = 0; render();
}

function rebet() {
  if (state.phase !== 'betting' || !state.lastBet || state.currentBet > 0) return;
  if (!spend(state.lastBet)) return;
  state.currentBet = state.lastBet;
  render();
}

function dealClick() {
  if (state.phase !== 'betting') return;
  if (state.currentBet <= 0) { notice('Place a bet first.'); return; }
  dealInitial();
}

function dealInitial() {
  notice('');
  if (needsReshuffle()) buildShoe();

  state.dealer = { cards: [drawCard(), drawCard()], holeRevealed: false };
  state.hands = [{
    cards: [drawCard(), drawCard()], bet: state.currentBet,
    status: 'active', fromSplit: false, isSplitAces: false, doubled: false,
    resolved: false, outcome: null,
  }];
  state.lastBet = state.currentBet;
  state.currentBet = 0;
  state.activeHandIndex = 0;
  state.insuranceBet = 0;
  state.insuranceOffered = false;

  const up = state.dealer.cards[0];
  if (up.rank === 'A') {
    state.phase = 'insurance';
    state.insuranceOffered = true;
  } else {
    dealerPeek();
  }
  render();
}

function takeInsurance() {
  if (state.phase !== 'insurance') return;
  const amt = Math.round(state.hands[0].bet * ODDS.insuranceMaxFraction * 100) / 100;
  if (!spend(amt)) return;
  state.insuranceBet = amt;
  log(`Insurance taken for ${fmt(amt)}.`, 'neutral');
  dealerPeek();
  render();
}

function declineInsurance() {
  if (state.phase !== 'insurance') return;
  dealerPeek();
  render();
}

function dealerPeek() {
  const up = state.dealer.cards[0];
  const dealerCouldHaveBlackjack = up.rank === 'A' || cardValue(up) === 10;

  if (dealerCouldHaveBlackjack && isBlackjack(state.dealer.cards)) {
    state.dealer.holeRevealed = true;
    if (state.insuranceBet > 0) {
      const w = payout(state.insuranceBet, ODDS.insurancePayout);
      credit(state.insuranceBet + w);
      log(`Dealer has blackjack. Insurance wins ${fmt(w)}.`, 'win');
    } else {
      log(`Dealer has blackjack.`, 'lose');
    }
    settleAgainstDealerBlackjack();
    state.phase = 'payout';
    return;
  }

  if (state.insuranceBet > 0) {
    log(`No dealer blackjack. Insurance loses ${fmt(state.insuranceBet)}.`, 'lose');
    state.insuranceBet = 0;
  } else if (state.insuranceOffered) {
    log(`No dealer blackjack.`, 'neutral');
  }

  const hand = state.hands[0];
  if (isBlackjack(hand.cards)) {
    const w = payout(hand.bet, ODDS.blackjackPayout);
    credit(hand.bet + w);
    hand.status = 'resolved'; hand.resolved = true; hand.outcome = 'blackjack';
    log(`Blackjack! You win ${fmt(w)}.`, 'win');
    state.phase = 'payout';
  } else {
    state.phase = 'playing';
  }
}

function settleAgainstDealerBlackjack() {
  const hand = state.hands[0];
  if (isBlackjack(hand.cards)) {
    credit(hand.bet);
    hand.outcome = 'push';
    log(`Your blackjack pushes.`, 'neutral');
  } else {
    hand.outcome = 'lose';
    log(`You lose ${fmt(hand.bet)}.`, 'lose');
  }
  hand.status = 'resolved'; hand.resolved = true;
}

// ---------- player actions ----------
function canHit(hand) { return !!hand && hand.status === 'active'; }
function canStand(hand) { return !!hand && hand.status === 'active'; }
function canDouble(hand) {
  return !!hand && hand.status === 'active' && hand.cards.length === 2 && !hand.isSplitAces
    && ODDS.doubleAnyTwo && (!hand.fromSplit || ODDS.doubleAfterSplit)
    && state.bankroll + 1e-9 >= hand.bet;
}
function canSplit(hand) {
  return !!hand && hand.status === 'active' && hand.cards.length === 2 && !hand.isSplitAces
    && hand.cards[0].rank === hand.cards[1].rank
    && state.hands.length < ODDS.maxSplitHands
    && state.bankroll + 1e-9 >= hand.bet;
}

function advanceHand() {
  for (let i = state.activeHandIndex + 1; i < state.hands.length; i++) {
    if (state.hands[i].status === 'active') { state.activeHandIndex = i; return; }
  }
  if (!state.hands.some(h => h.status === 'active')) startDealerPhase();
}

function hit() {
  const hand = activeHand();
  if (!canHit(hand)) return;
  hand.cards.push(drawCard());
  const { total } = handValue(hand.cards);
  if (total > 21) {
    hand.status = 'bust'; hand.resolved = true; hand.outcome = 'lose';
    log(`Hand busts at ${total}.`, 'lose');
    advanceHand();
  }
  render();
}

function stand() {
  const hand = activeHand();
  if (!canStand(hand)) return;
  hand.status = 'stood';
  advanceHand();
  render();
}

function doubleDown() {
  const hand = activeHand();
  if (!canDouble(hand)) return;
  if (!spend(hand.bet)) return;
  hand.bet = Math.round(hand.bet * 2 * 100) / 100;
  hand.doubled = true;
  hand.cards.push(drawCard());
  const { total } = handValue(hand.cards);
  if (total > 21) {
    hand.status = 'bust'; hand.resolved = true; hand.outcome = 'lose';
    log(`Hand busts at ${total} after doubling.`, 'lose');
  } else {
    hand.status = 'stood';
  }
  advanceHand();
  render();
}

function split() {
  const hand = activeHand();
  if (!canSplit(hand)) return;
  if (!spend(hand.bet)) return;
  const [c1, c2] = hand.cards;
  const isAces = c1.rank === 'A';
  const hand1 = {
    cards: [c1, drawCard()], bet: hand.bet, status: isAces ? 'stood' : 'active',
    fromSplit: true, isSplitAces: isAces, doubled: false, resolved: false, outcome: null,
  };
  const hand2 = {
    cards: [c2, drawCard()], bet: hand.bet, status: isAces ? 'stood' : 'active',
    fromSplit: true, isSplitAces: isAces, doubled: false, resolved: false, outcome: null,
  };
  state.hands.splice(state.activeHandIndex, 1, hand1, hand2);
  log(isAces ? 'Split aces — one card each, no further action.' : 'Hand split.', 'neutral');
  if (isAces) advanceHand();
  render();
}

// ---------- dealer ----------
function playDealerHand() {
  while (true) {
    const { total, soft } = handValue(state.dealer.cards);
    if (total > 21 || total > 17) break;
    if (total === 17) {
      if (soft && ODDS.dealerHitSoft17) { state.dealer.cards.push(drawCard()); continue; }
      break;
    }
    state.dealer.cards.push(drawCard());
  }
}

function startDealerPhase() {
  state.phase = 'dealer';
  state.dealer.holeRevealed = true;
  const anyLive = state.hands.some(h => h.status === 'stood');
  if (anyLive) playDealerHand();
  settleRound();
  state.phase = 'payout';
  render();
}

// ---------- settlement ----------
function settleRound() {
  const { total: dTotal } = handValue(state.dealer.cards);
  const dBust = dTotal > 21;
  state.hands.forEach(hand => {
    if (hand.resolved) return;
    if (hand.status === 'bust') { hand.outcome = hand.outcome || 'lose'; hand.resolved = true; return; }
    const { total: pTotal } = handValue(hand.cards);
    if (dBust) {
      credit(hand.bet * 2);
      hand.outcome = 'win';
      log(`Hand wins ${fmt(hand.bet)} — dealer busts at ${dTotal}.`, 'win');
    } else if (pTotal > dTotal) {
      credit(hand.bet * 2);
      hand.outcome = 'win';
      log(`Hand wins ${fmt(hand.bet)} (${pTotal} vs ${dTotal}).`, 'win');
    } else if (pTotal < dTotal) {
      hand.outcome = 'lose';
      log(`Hand loses (${pTotal} vs ${dTotal}).`, 'lose');
    } else {
      credit(hand.bet);
      hand.outcome = 'push';
      log(`Push (${pTotal}).`, 'neutral');
    }
    hand.resolved = true;
  });
}

function nextRound() {
  state.phase = 'betting';
  state.hands = [];
  state.dealer = { cards: [], holeRevealed: false };
  state.activeHandIndex = 0;
  state.insuranceBet = 0;
  state.insuranceOffered = false;
  notice('');
  render();
}

// ---------- rendering ----------
function cardHtml(card, faceUp) {
  if (!faceUp) return `<div class="pcard-back"></div>`;
  const red = card.suit === '♥' || card.suit === '♦';
  return `<div class="pcard ${red ? 'is-red' : ''}">
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
  renderDealerHand();
  renderPlayerHands();

  document.getElementById('betArea').classList.toggle('hidden', state.phase !== 'betting');
  document.getElementById('actionBar').classList.toggle('hidden', state.phase !== 'playing');
  document.getElementById('insurancePrompt').classList.toggle('hidden', state.phase !== 'insurance');
  document.getElementById('newHandWrap').classList.toggle('hidden', state.phase !== 'payout');

  document.getElementById('betAmt').textContent = fmt(state.currentBet);
  document.getElementById('clearBetBtn').disabled = state.currentBet <= 0;
  document.getElementById('rebetBtn').disabled = !state.lastBet || state.currentBet > 0;
  document.getElementById('dealBtn').disabled = state.currentBet <= 0;

  if (state.phase === 'insurance') {
    const amt = Math.round(state.hands[0].bet * ODDS.insuranceMaxFraction * 100) / 100;
    document.getElementById('insuranceAmt').textContent = fmt(amt);
  }

  const hand = activeHand();
  document.getElementById('hitBtn').disabled = !canHit(hand);
  document.getElementById('standBtn').disabled = !canStand(hand);
  document.getElementById('doubleBtn').disabled = !canDouble(hand);
  document.getElementById('splitBtn').disabled = !canSplit(hand);

  renderLog();
}

function renderChips() {
  const c = document.getElementById('chipSelector');
  c.innerHTML = CHIPS.map(v =>
    `<button class="chip-btn ${v === state.chip ? 'selected' : ''}" onclick="setChip(${v})">$${v}</button>`
  ).join('');
}

function setChip(v) { state.chip = v; render(); }

function renderDealerHand() {
  const wrap = document.getElementById('dealerHand');
  const cards = state.dealer.cards || [];
  const totalEl = document.getElementById('dealerTotal');

  if (!cards.length) { wrap.innerHTML = ''; totalEl.textContent = ''; totalEl.className = 'hand-total'; return; }

  wrap.innerHTML = cards.map((c, i) => cardHtml(c, !(i === 1 && !state.dealer.holeRevealed))).join('');

  if (!state.dealer.holeRevealed) {
    const upVal = cardValue(cards[0]);
    totalEl.textContent = `Showing ${cards[0].rank === 'A' ? 'A' : upVal}`;
    totalEl.className = 'hand-total';
    return;
  }

  const { total, soft } = handValue(cards);
  if (total > 21) { totalEl.textContent = 'BUST'; totalEl.className = 'hand-total is-lose'; }
  else if (isBlackjack(cards)) { totalEl.textContent = 'BLACKJACK'; totalEl.className = 'hand-total is-win'; }
  else { totalEl.textContent = soft ? `Soft ${total}` : `${total}`; totalEl.className = 'hand-total'; }
}

function renderPlayerHands() {
  const wrap = document.getElementById('playerHands');
  if (!state.hands.length) { wrap.innerHTML = ''; return; }

  wrap.innerHTML = state.hands.map((hand, i) => {
    const { total, soft } = handValue(hand.cards);
    let label, cls;
    if (hand.status === 'bust') { label = 'BUST'; cls = 'is-lose'; }
    else if (hand.outcome === 'blackjack') { label = 'BLACKJACK'; cls = 'is-win'; }
    else if (hand.resolved) {
      if (hand.outcome === 'win') { label = `${total} · Win`; cls = 'is-win'; }
      else if (hand.outcome === 'lose') { label = `${total} · Lose`; cls = 'is-lose'; }
      else { label = `${total} · Push`; cls = ''; }
    } else {
      label = soft ? `Soft ${total}` : `${total}`; cls = '';
    }

    const active = state.phase === 'playing' && i === state.activeHandIndex;
    const tag = hand.doubled ? ' · Doubled' : '';
    const cardsHtml = hand.cards.map(c => cardHtml(c, true)).join('');

    return `<div class="hand-group ${active ? 'is-active' : ''}">
      ${state.hands.length > 1 ? `<div class="hand-label">Hand ${i + 1}${tag}</div>` : (hand.doubled ? `<div class="hand-label">Doubled</div>` : '')}
      <div class="hand">${cardsHtml}</div>
      <div class="hand-total ${cls}">${label}</div>
      <div class="hand-bet">${fmt(hand.bet)}</div>
    </div>`;
  }).join('');
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

  document.getElementById('betSpot').onclick = clickBetSpot;
  document.getElementById('clearBetBtn').addEventListener('click', removeBet);
  document.getElementById('rebetBtn').addEventListener('click', rebet);
  document.getElementById('dealBtn').addEventListener('click', dealClick);
  document.getElementById('hitBtn').addEventListener('click', hit);
  document.getElementById('standBtn').addEventListener('click', stand);
  document.getElementById('doubleBtn').addEventListener('click', doubleDown);
  document.getElementById('splitBtn').addEventListener('click', split);
  document.getElementById('insuranceYesBtn').addEventListener('click', takeInsurance);
  document.getElementById('insuranceNoBtn').addEventListener('click', declineInsurance);
  document.getElementById('newHandBtn').addEventListener('click', nextRound);
  document.getElementById('resetBtn').addEventListener('click', resetBankroll);

  showOverlay({
    title: "Welcome to Blackjack",
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
