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
  globalThis.StakesWallet?.buyIn(bankroll);   // wallet bridge: a new session starts
  return {
    bankroll, startBankroll: bankroll,
    chip: 10,
    phase: 'betting', // betting -> insurance -> playing -> dealer -> payout -> betting
    shoe: [],
    currentBet: 0,
    lastBet: 0,
    hands: [],
    activeHandIndex: 0,
    dealer: { cards: [], holeRevealed: false, shownCount: 0, flipIndex: null },
    insuranceBet: 0,
    insuranceOffered: false,
    isDealing: false,
    log: [],
  };
}

const DEAL_DELAY_MS = 450;
const FLIP_PAUSE_MS = 600;

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function dealCardTo(target, card) {
  target.cards.push(card);
  render();
  target.shownCount = target.cards.length;
  await sleep(DEAL_DELAY_MS);
}

async function flipHoleCard() {
  state.isDealing = true;
  render();
  await sleep(FLIP_PAUSE_MS);
  state.dealer.holeRevealed = true;
  state.dealer.flipIndex = 1;
  render();
  state.dealer.flipIndex = null;
  await sleep(FLIP_PAUSE_MS);
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
  if (state.isDealing) { notice('Please wait for the current deal to finish.'); return; }
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
  if (state.phase !== 'betting' || state.isDealing) return;
  if (!spend(state.chip)) return;
  state.currentBet = Math.round((state.currentBet + state.chip) * 100) / 100;
  render();
}

function removeBet() {
  if (state.phase !== 'betting' || state.isDealing || state.currentBet <= 0) return;
  credit(state.currentBet); state.currentBet = 0; render();
}

function tryRebet() {
  if (!state.lastBet || state.currentBet > 0) return false;
  if (!spend(state.lastBet)) return false;
  state.currentBet = state.lastBet;
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
  if (state.currentBet <= 0) { notice('Place a bet first.'); return; }
  dealInitial();
}

async function dealInitial() {
  notice('');
  if (needsReshuffle()) buildShoe();

  state.dealer = { cards: [], holeRevealed: false, shownCount: 0, flipIndex: null };
  state.hands = [{
    cards: [], bet: state.currentBet,
    status: 'active', fromSplit: false, isSplitAces: false, doubled: false,
    resolved: false, outcome: null, shownCount: 0,
  }];
  state.lastBet = state.currentBet;
  state.currentBet = 0;
  state.activeHandIndex = 0;
  state.insuranceBet = 0;
  state.insuranceOffered = false;

  state.isDealing = true;
  render();

  const hand = state.hands[0];
  await dealCardTo(hand, drawCard());
  await dealCardTo(state.dealer, drawCard());
  await dealCardTo(hand, drawCard());
  await dealCardTo(state.dealer, drawCard());

  const up = state.dealer.cards[0];
  if (up.rank === 'A') {
    state.phase = 'insurance';
    state.insuranceOffered = true;
    state.isDealing = false;
  } else {
    await dealerPeek();
    state.isDealing = false;
  }
  render();
}

async function takeInsurance() {
  if (state.phase !== 'insurance' || state.isDealing) return;
  const amt = Math.round(state.hands[0].bet * ODDS.insuranceMaxFraction * 100) / 100;
  if (!spend(amt)) return;
  state.insuranceBet = amt;
  log(`Insurance taken for ${fmt(amt)}.`, 'neutral');
  state.isDealing = true;
  render();
  await dealerPeek();
  state.isDealing = false;
  render();
}

async function declineInsurance() {
  if (state.phase !== 'insurance' || state.isDealing) return;
  state.isDealing = true;
  render();
  await dealerPeek();
  state.isDealing = false;
  render();
}

async function dealerPeek() {
  const up = state.dealer.cards[0];
  const dealerCouldHaveBlackjack = up.rank === 'A' || cardValue(up) === 10;

  if (dealerCouldHaveBlackjack && isBlackjack(state.dealer.cards)) {
    await flipHoleCard();
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

// ---------- basic-strategy coach ----------
// Reads the same decision table as the strategy chart and trainer
// (src/_data/blackjackStrategy.js, loaded as BJ_STRATEGY). Returns
// 'H' | 'S' | 'D' | 'P' for the active hand, already adjusted for what is
// legal right now (a chart Double you can't take becomes Hit, or Stand on
// soft 18+; a pair you can't split is played by its total).
function strategyAdvice(hand) {
  if (typeof BJ_STRATEGY === 'undefined' || !hand || hand.status !== 'active') return null;
  const up = state.dealer.cards[0];
  const upLabel = up.rank === 'A' ? 'A' : String(cardValue(up));
  const col = BJ_STRATEGY.DEALER_UPCARDS.indexOf(upLabel);
  const { total, soft } = handValue(hand.cards);
  let dec = null;
  if (canSplit(hand)) {
    const lab = hand.cards[0].rank === 'A' ? 'A' : String(cardValue(hand.cards[0]));
    const row = BJ_STRATEGY.PAIRS.find(r => r.hand === `${lab},${lab}`);
    if (row && row.dec[col] === 'P') return 'P';
  }
  if (soft && total >= 13 && total <= 20) dec = BJ_STRATEGY.SOFT_TOTALS.find(r => r.total === total).dec[col];
  else if (soft && total === 12) dec = 'H';
  else if (total >= 21) dec = 'S';
  else {
    const rows = BJ_STRATEGY.HARD_TOTALS;
    const row = total <= 8 ? rows[0] : total >= 17 ? rows[rows.length - 1] : rows.find(r => r.total === total);
    dec = row.dec[col];
  }
  if (dec === 'D' && !canDouble(hand)) dec = soft && total >= 18 ? 'S' : 'H';
  return dec;
}

const ACTION_WORD = { H: 'Hit', S: 'Stand', D: 'Double', P: 'Split' };

// Called at the start of each player action. Logs a note when the action
// differs from basic strategy (if "Flag mistakes" is on).
function coachCheck(action) {
  const chk = document.getElementById('flagChk');
  if (!chk || !chk.checked) return;
  const hand = activeHand();
  const best = strategyAdvice(hand);
  if (!best) return;
  const { total, soft } = handValue(hand.cards);
  const desc = `${soft ? 'soft ' : ''}${total} vs dealer ${state.dealer.cards[0].rank}`;
  if (best === action) state.coach = { ok: (state.coach ? state.coach.ok : 0) + 1, miss: state.coach ? state.coach.miss : 0 };
  else {
    state.coach = { ok: state.coach ? state.coach.ok : 0, miss: (state.coach ? state.coach.miss : 0) + 1 };
    log(`Basic strategy: ${ACTION_WORD[best]} on ${desc} (you chose ${ACTION_WORD[action]}).`, 'lose');
  }
}

async function advanceHand() {
  for (let i = state.activeHandIndex + 1; i < state.hands.length; i++) {
    if (state.hands[i].status === 'active') { state.activeHandIndex = i; return; }
  }
  if (!state.hands.some(h => h.status === 'active')) await startDealerPhase();
}

async function hit() {
  if (state.isDealing) return;
  const hand = activeHand();
  if (!canHit(hand)) return;
  coachCheck('H');
  state.isDealing = true;
  render();
  await dealCardTo(hand, drawCard());
  const { total } = handValue(hand.cards);
  if (total > 21) {
    hand.status = 'bust'; hand.resolved = true; hand.outcome = 'lose';
    log(`Hand busts at ${total}.`, 'lose');
    await advanceHand();
  }
  state.isDealing = false;
  render();
}

async function stand() {
  if (state.isDealing) return;
  const hand = activeHand();
  if (!canStand(hand)) return;
  coachCheck('S');
  hand.status = 'stood';
  state.isDealing = true;
  render();
  await advanceHand();
  state.isDealing = false;
  render();
}

async function doubleDown() {
  if (state.isDealing) return;
  const hand = activeHand();
  if (!canDouble(hand)) return;
  coachCheck('D');
  if (!spend(hand.bet)) return;
  hand.bet = Math.round(hand.bet * 2 * 100) / 100;
  hand.doubled = true;
  state.isDealing = true;
  render();
  await dealCardTo(hand, drawCard());
  const { total } = handValue(hand.cards);
  if (total > 21) {
    hand.status = 'bust'; hand.resolved = true; hand.outcome = 'lose';
    log(`Hand busts at ${total} after doubling.`, 'lose');
  } else {
    hand.status = 'stood';
  }
  await advanceHand();
  state.isDealing = false;
  render();
}

async function split() {
  if (state.isDealing) return;
  const hand = activeHand();
  if (!canSplit(hand)) return;
  coachCheck('P');
  if (!spend(hand.bet)) return;
  const [c1, c2] = hand.cards;
  const isAces = c1.rank === 'A';
  const hand1 = {
    cards: [c1], bet: hand.bet, status: isAces ? 'stood' : 'active',
    fromSplit: true, isSplitAces: isAces, doubled: false, resolved: false, outcome: null, shownCount: 1,
  };
  const hand2 = {
    cards: [c2], bet: hand.bet, status: isAces ? 'stood' : 'active',
    fromSplit: true, isSplitAces: isAces, doubled: false, resolved: false, outcome: null, shownCount: 1,
  };
  state.hands.splice(state.activeHandIndex, 1, hand1, hand2);
  log(isAces ? 'Split aces — one card each, no further action.' : 'Hand split.', 'neutral');

  state.isDealing = true;
  render();
  await dealCardTo(hand1, drawCard());
  await dealCardTo(hand2, drawCard());
  if (isAces) await advanceHand();
  state.isDealing = false;
  render();
}

// ---------- dealer ----------
async function playDealerHand() {
  while (true) {
    const { total, soft } = handValue(state.dealer.cards);
    if (total > 21 || total > 17) break;
    if (total === 17) {
      if (soft && ODDS.dealerHitSoft17) { await dealCardTo(state.dealer, drawCard()); continue; }
      break;
    }
    await dealCardTo(state.dealer, drawCard());
  }
}

async function startDealerPhase() {
  state.isDealing = true;
  state.phase = 'dealer';
  render();
  await flipHoleCard();
  const anyLive = state.hands.some(h => h.status === 'stood');
  if (anyLive) await playDealerHand();
  settleRound();
  state.phase = 'payout';
  state.isDealing = false;
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
  if (state.isDealing) return;
  state.phase = 'betting';
  state.hands = [];
  state.dealer = { cards: [], holeRevealed: false, shownCount: 0, flipIndex: null };
  state.activeHandIndex = 0;
  state.insuranceBet = 0;
  state.insuranceOffered = false;
  notice('');
  maybeAutoRebet();
  render();
}

// ---------- rendering ----------
function cardHtml(card, faceUp, opts) {
  opts = opts || {};
  if (!faceUp) return `<div class="pcard-back${opts.isNew ? ' pcard-deal-in' : ''}"></div>`;
  const red = card.suit === '♥' || card.suit === '♦';
  const animCls = opts.isFlip ? ' pcard-flip-in' : (opts.isNew ? ' pcard-deal-in' : '');
  return `<div class="pcard ${red ? 'is-red' : ''}${animCls}">
    <div class="pcard-corner">${card.rank}<span class="pcard-corner-suit">${card.suit}</span></div>
    <div class="pcard-suit-big">${card.suit}</div>
  </div>`;
}

function render() {
  globalThis.StakesWallet?.sync(state.bankroll);   // wallet bridge: report net result
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
  document.getElementById('clearBetBtn').disabled = state.currentBet <= 0 || state.isDealing;
  document.getElementById('rebetBtn').disabled = !state.lastBet || state.currentBet > 0 || state.isDealing;
  document.getElementById('dealBtn').disabled = state.currentBet <= 0 || state.isDealing;

  if (state.phase === 'insurance') {
    const amt = Math.round(state.hands[0].bet * ODDS.insuranceMaxFraction * 100) / 100;
    document.getElementById('insuranceAmt').textContent = fmt(amt);
  }
  document.getElementById('insuranceYesBtn').disabled = state.isDealing;
  document.getElementById('insuranceNoBtn').disabled = state.isDealing;
  document.getElementById('newHandBtn').disabled = state.isDealing;

  const hand = activeHand();
  document.getElementById('hitBtn').disabled = !canHit(hand) || state.isDealing;
  document.getElementById('standBtn').disabled = !canStand(hand) || state.isDealing;
  document.getElementById('doubleBtn').disabled = !canDouble(hand) || state.isDealing;
  document.getElementById('splitBtn').disabled = !canSplit(hand) || state.isDealing;

  const hintEl = document.getElementById('bsHint');
  const advice = state.phase === 'playing' && !state.isDealing && document.getElementById('hintChk').checked ? strategyAdvice(hand) : null;
  hintEl.innerHTML = advice ? `Basic strategy: <b>${ACTION_WORD[advice]}</b>` : '';
  ['hitBtn', 'standBtn', 'doubleBtn', 'splitBtn'].forEach((id, i) =>
    document.getElementById(id).classList.toggle('is-advised', advice === 'HSDP'[i]));
  const c = state.coach;
  document.getElementById('coachScore').textContent = c && document.getElementById('flagChk').checked
    ? `Basic strategy this session: ${c.ok} of ${c.ok + c.miss} decisions correct.` : '';

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

  const shown = state.dealer.shownCount || 0;
  wrap.innerHTML = cards.map((c, i) => cardHtml(c, !(i === 1 && !state.dealer.holeRevealed), {
    isNew: i >= shown,
    isFlip: state.dealer.flipIndex === i,
  })).join('');

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
    const shown = hand.shownCount || 0;
    const cardsHtml = hand.cards.map((c, ci) => cardHtml(c, true, { isNew: ci >= shown })).join('');

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
  document.getElementById('hintChk').addEventListener('change', render);
  document.getElementById('flagChk').addEventListener('change', render);

  // Keyboard: H hit, S stand, D double, P split, Enter = Deal / New Hand.
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('setupOverlay').classList.contains('hidden')) return;
    if (e.target.closest('input, select, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (state.phase === 'playing') {
      if (k === 'h') hit(); else if (k === 's') stand(); else if (k === 'd') doubleDown(); else if (k === 'p') split();
    } else if (e.key === 'Enter' && !e.target.closest('button, a, summary')) {
      if (state.phase === 'betting') dealClick(); else if (state.phase === 'payout') nextRound();
    }
  });

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
