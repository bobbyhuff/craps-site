// Pai Gow Poker UI. Hand evaluation, joker rules, validation, the house way
// and settlement live in pg-engine.js; payouts and house rules in ODDS
// (src/_data/paiGowOdds.js). This file manages bankroll, phases, the
// tap-to-move hand setter, and rendering.

const { fmt, round2, pause, SessionStats, showOverlay, announce } = TABLE_KIT;
const CHIPS = [1, 5, 10, 25, 50, 100, 250];

let state = null;

function newState(bankroll) {
  return {
    bankroll, startBankroll: bankroll,
    chip: 10,
    phase: 'betting', // betting -> arrange -> done
    bet: 0, lastBet: 0,
    cards: [],        // player's seven, sorted high to low
    low: new Set(),   // indexes into cards placed in the two-card hand
    dealerCards: [],
    dealerSplit: null,
    outcome: null,
    fresh: false,
    busy: false,
    stats: new SessionStats(),
    log: [],
  };
}

function notice(msg) { document.getElementById('notice').textContent = msg; }
function log(msg, cls) { state.log.push({ msg, cls: cls || 'neutral' }); }
function credit(x) { state.bankroll = round2(state.bankroll + x); }
function spend(x) {
  if (x > state.bankroll + 1e-9) { notice('Not enough bankroll.'); return false; }
  state.bankroll = round2(state.bankroll - x);
  return true;
}

const rankOf = c => (c.joker ? 15 : c.rank);
function sortCards(cards) { return cards.slice().sort((a, b) => rankOf(b) - rankOf(a) || a.suit - b.suit); }

// ---------- betting ----------
function setChip(v) { state.chip = v; render(); }
function addBet() {
  if (state.phase !== 'betting' || state.busy) return;
  if (!spend(state.chip)) return;
  state.bet = round2(state.bet + state.chip);
  notice('');
  render();
}
function clearBet() {
  if (state.phase !== 'betting' || state.busy) return;
  credit(state.bet); state.bet = 0; render();
}
function rebet() {
  if (state.phase !== 'betting' || state.busy || !state.lastBet || state.bet) return false;
  if (!spend(state.lastBet)) return false;
  state.bet = state.lastBet;
  render();
  return true;
}

// ---------- round ----------
async function deal() {
  if (state.phase !== 'betting' || state.busy) return;
  if (state.bet <= 0) { notice('Place a bet first.'); return; }
  notice('');
  state.lastBet = state.bet;
  const deck = CARDS.shuffledDeck({ jokers: 1 });
  state.cards = sortCards(deck.splice(0, 7));
  state.dealerCards = deck.splice(0, 7);
  state.low = new Set();
  state.dealerSplit = null;
  state.outcome = null;
  state.fresh = true;
  state.phase = 'arrange';
  state.busy = true;
  render();
  await pause(350);
  state.busy = false;
  announce(`Your seven cards: ${state.cards.map(CARDS.cardSpoken).join(', ')}. Choose two for your low hand.`);
  render();
}

function toggleCard(i) {
  if (state.phase !== 'arrange' || state.busy) return;
  if (state.low.has(i)) state.low.delete(i);
  else {
    if (state.low.size >= 2) { notice('Your two-card hand is full. Tap one of its cards to move it back first.'); return; }
    state.low.add(i);
  }
  notice('');
  render();
}

function currentSplit() {
  const low = [...state.low].sort((a, b) => a - b).map(i => state.cards[i]);
  const high = state.cards.filter((_, i) => !state.low.has(i));
  return { high, low };
}

function autoArrange() {
  if (state.phase !== 'arrange' || state.busy) return;
  const hw = PG_ENGINE.houseWay(state.cards);
  state.low = new Set(hw.low.map(c => state.cards.indexOf(c)));
  log(`Auto Arrange: ${hw.rule}`, 'neutral');
  render();
}

function clearLow() {
  if (state.phase !== 'arrange' || state.busy) return;
  state.low = new Set();
  render();
}

async function setHands() {
  if (state.phase !== 'arrange' || state.busy) return;
  if (state.low.size !== 2) { notice('Pick exactly two cards for your two-card hand.'); return; }
  const player = currentSplit();
  const problem = PG_ENGINE.splitProblem(player.high, player.low);
  if (problem) { notice(problem); return; }

  state.busy = true;
  state.phase = 'reveal';
  render();
  await pause(300);
  const dealer = PG_ENGINE.houseWay(state.dealerCards);
  state.dealerSplit = dealer;
  state.fresh = true;
  render();
  await pause(450);

  const cmp = PG_ENGINE.compare(player, dealer);
  const money = PG_ENGINE.settle(state.bet, cmp.outcome, ODDS);
  credit(money.returned);
  state.stats.record(state.bet, money.returned);
  state.outcome = { cmp, money, player, bet: state.bet };

  const side = r => (r === 'player' ? 'you win' : r === 'dealer' ? 'dealer wins' : 'copy, dealer wins');
  log(`High: your ${cmp.ph.name} vs ${cmp.dh.name}, ${side(cmp.highResult)}. Low: your ${cmp.pl.name} vs ${cmp.dl.name}, ${side(cmp.lowResult)}.`, 'roll-header');
  log(`Dealer set: ${dealer.rule}`, 'neutral');
  if (cmp.outcome === 'win') log(`You win ${fmt(money.net)} (${fmt(state.bet)} less ${fmt(money.commission)} commission).`, 'win');
  else if (cmp.outcome === 'push') log('Push. Your bet is returned.', 'neutral');
  else log(`You lose ${fmt(state.bet)}.`, 'lose');
  announce(cmp.outcome === 'win' ? `You win ${fmt(money.net)}.` : cmp.outcome === 'push' ? 'Push.' : `You lose ${fmt(state.bet)}.`);

  state.bet = 0;
  state.phase = 'done';
  state.busy = false;
  render();
}

function nextHand(sameBet) {
  if (state.phase !== 'done' || state.busy) return;
  state.phase = 'betting';
  state.cards = []; state.dealerCards = []; state.dealerSplit = null; state.outcome = null; state.low = new Set();
  notice('');
  if (sameBet) {
    if (rebet()) { deal(); return; }
    notice(`Not enough bankroll to repeat ${fmt(state.lastBet)}.`);
  }
  render();
}

function resetBankroll() {
  if (state.busy || state.phase === 'arrange') { notice('Finish the current hand first.'); return; }
  showOverlay({
    title: 'Reset Bankroll?',
    text: 'This starts a fresh session.',
    defaultValue: state.bankroll > 0 ? Math.round(state.bankroll) : 200,
    showCancel: true,
    confirmLabel: 'Reset',
    onConfirm: (amt) => {
      const chip = state.chip;
      state = newState(amt);
      state.chip = chip;
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
  document.getElementById('betShown').textContent = fmt(state.outcome ? state.outcome.bet : state.bet);
  document.getElementById('chipSelector').innerHTML = TABLE_KIT.chipsHtml(CHIPS, state.chip, 'setChip');
  document.getElementById('betAmt').textContent = state.bet > 0 ? fmt(state.bet) : '—';
  document.getElementById('betSpot').classList.toggle('is-selected', state.bet > 0);

  renderPlayer();
  renderDealer();
  renderStatus();
  renderResult();

  const p = state.phase;
  document.getElementById('betArea').classList.toggle('hidden', p !== 'betting');
  document.getElementById('arrangeBar').classList.toggle('hidden', !(p === 'arrange' || p === 'reveal'));
  document.getElementById('newHandWrap').classList.toggle('hidden', p !== 'done');
  document.getElementById('dealBtn').disabled = state.busy || state.bet <= 0;
  document.getElementById('clearBetBtn').disabled = state.busy || state.bet <= 0;
  document.getElementById('rebetBtn').disabled = state.busy || !state.lastBet || state.bet > 0;
  document.getElementById('betSpot').disabled = p !== 'betting' || state.busy;
  const valid = p === 'arrange' && state.low.size === 2 && !PG_ENGINE.splitProblem(currentSplit().high, currentSplit().low);
  document.getElementById('setBtn').disabled = state.busy || !valid;
  document.getElementById('autoBtn').disabled = state.busy || p !== 'arrange';
  document.getElementById('clearLowBtn').disabled = state.busy || p !== 'arrange' || state.low.size === 0;
  if (state.lastBet) document.getElementById('sameBetBtn').textContent = `Same Bet (${fmt(state.lastBet)}), Deal`;

  const hint = document.getElementById('pgHint');
  if (document.getElementById('hintChk').checked && p === 'arrange') {
    hint.textContent = `House way for this hand: ${PG_ENGINE.houseWay(state.cards).rule}`;
    hint.classList.remove('hidden');
  } else hint.classList.add('hidden');

  state.stats.render(document.getElementById('sessionStats'), 'Hands');
  document.getElementById('log').innerHTML = state.log.slice().reverse().slice(0, 80).map(e => `<div class="${e.cls}">${e.msg}</div>`).join('');
  state.fresh = false;
}

function badge(result) {
  if (!result) return '';
  if (result === 'player') return '<span class="pg-badge is-win">Win</span>';
  if (result === 'dealer') return '<span class="pg-badge is-lose">Lose</span>';
  return '<span class="pg-badge is-copy">Copy · dealer</span>';
}

function rowHtml(label, cards, evName, cls, cardFn, extra) {
  return `<div class="pg-row ${cls || ''}">
    <div class="pg-row-head"><span class="pg-row-label">${label}</span><span class="pg-row-name">${evName || ''}</span>${extra || ''}</div>
    <div class="hand pg-cards">${cards.map(cardFn).join('')}</div>
  </div>`;
}

function renderPlayer() {
  const el = document.getElementById('playerRows');
  const p = state.phase;
  if (!state.cards.length) { el.innerHTML = `<div class="pg-empty">Place a bet and deal seven cards.</div>`; return; }
  const o = state.outcome;
  const editable = p === 'arrange' && !state.busy;
  const btn = i => {
    const c = state.cards[i];
    return `<button type="button" class="pcard-btn" onclick="toggleCard(${i})" ${editable ? '' : 'disabled'} aria-label="${CARDS.cardSpoken(c)}, in ${state.low.has(i) ? 'two-card' : 'five-card'} hand. Tap to move.">${CARDS.cardHtml(c, { isNew: state.fresh })}</button>`;
  };
  const lowIdx = [...state.low].sort((a, b) => a - b);
  const highIdx = state.cards.map((_, i) => i).filter(i => !state.low.has(i));
  let lowName = '', highName = '';
  if (state.low.size === 2) {
    const s = currentSplit();
    lowName = PG_ENGINE.eval2(s.low).name;
    highName = PG_ENGINE.eval5(s.high).name;
  }
  const lowSlots = lowIdx.map(btn).concat(Array(2 - lowIdx.length).fill('<div class="pg-slot" aria-hidden="true"></div>'));
  el.innerHTML = `
    <div class="pg-row pg-low ${o ? 'r-' + o.cmp.lowResult : ''}">
      <div class="pg-row-head"><span class="pg-row-label">Two-card hand</span><span class="pg-row-name">${lowName || `${state.low.size}/2 cards`}</span>${o ? badge(o.cmp.lowResult) : ''}</div>
      <div class="hand pg-cards">${lowSlots.join('')}</div>
    </div>
    <div class="pg-row pg-high ${o ? 'r-' + o.cmp.highResult : ''}">
      <div class="pg-row-head"><span class="pg-row-label">${state.low.size === 2 ? 'Five-card hand' : `Your seven cards: tap ${2 - state.low.size} for the two-card hand`}</span><span class="pg-row-name">${highName}</span>${o ? badge(o.cmp.highResult) : ''}</div>
      <div class="hand pg-cards">${highIdx.map(btn).join('')}</div>
    </div>`;
}

function renderDealer() {
  const el = document.getElementById('dealerRows');
  if (!state.dealerCards.length) { el.innerHTML = `<div class="hand pg-cards">${'<div class="pcard-back is-ghost" aria-hidden="true"></div>'.repeat(7)}</div>`; return; }
  const ds = state.dealerSplit;
  if (!ds) {
    el.innerHTML = `<div class="hand pg-cards">${state.dealerCards.map(c => CARDS.cardHtml(c, { faceDown: true, isNew: state.fresh })).join('')}</div>`;
    return;
  }
  const fresh = state.fresh;
  const card = c => CARDS.cardHtml(c, { isNew: fresh });
  el.innerHTML =
    rowHtml('Five-card hand', ds.high, PG_ENGINE.eval5(ds.high).name, 'pg-high', card) +
    rowHtml('Two-card hand', ds.low, PG_ENGINE.eval2(ds.low).name, 'pg-low', card);
}

function renderStatus() {
  const el = document.getElementById('pgStatus');
  if (state.phase !== 'arrange') { el.textContent = ''; el.className = 'pg-status'; return; }
  if (state.low.size < 2) {
    el.textContent = state.low.size === 0 ? 'Tap two cards to make your two-card hand.' : 'Tap one more card for your two-card hand.';
    el.className = 'pg-status';
    return;
  }
  const s = currentSplit();
  const problem = PG_ENGINE.splitProblem(s.high, s.low);
  el.textContent = problem || 'Legal setting. Tap Set Hands when you\'re ready.';
  el.className = `pg-status ${problem ? 'is-bad' : 'is-ok'}`;
}

function renderResult() {
  const el = document.getElementById('pgResult');
  const o = state.outcome;
  if (!o) { el.textContent = state.phase === 'betting' ? 'Place your bet' : ''; el.className = 'round-result'; return; }
  if (o.cmp.outcome === 'win') { el.textContent = `You win both · +${fmt(o.money.net)}`; el.className = 'round-result is-win'; }
  else if (o.cmp.outcome === 'push') { el.textContent = 'Push · one each'; el.className = 'round-result is-push'; }
  else { el.textContent = `Dealer wins · −${fmt(o.bet)}`; el.className = 'round-result is-lose'; }
}

// ---------- init ----------
window.addEventListener('DOMContentLoaded', () => {
  state = newState(0);
  document.getElementById('betSpot').addEventListener('click', addBet);
  document.getElementById('clearBetBtn').addEventListener('click', clearBet);
  document.getElementById('rebetBtn').addEventListener('click', rebet);
  document.getElementById('dealBtn').addEventListener('click', deal);
  document.getElementById('autoBtn').addEventListener('click', autoArrange);
  document.getElementById('clearLowBtn').addEventListener('click', clearLow);
  document.getElementById('setBtn').addEventListener('click', setHands);
  document.getElementById('sameBetBtn').addEventListener('click', () => nextHand(true));
  document.getElementById('changeBetBtn').addEventListener('click', () => nextHand(false));
  document.getElementById('resetBtn').addEventListener('click', resetBankroll);
  document.getElementById('hintChk').addEventListener('change', render);
  TABLE_KIT.bindFastToggle('fastChk');

  showOverlay({
    title: 'Welcome to Pai Gow Poker',
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
