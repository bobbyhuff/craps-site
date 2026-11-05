// Three Card Poker UI. Hand ranking, qualification, strategy and settlement
// live in tcp-engine.js; every payout in ODDS (src/_data/threeCardPokerOdds.js).

const { fmt, round2, pause, SessionStats, showOverlay, announce } = TABLE_KIT;
const CHIPS = [1, 5, 10, 25, 50, 100, 250];

let state = null;

function newState(bankroll) {
  return {
    bankroll, startBankroll: bankroll,
    chip: 10,
    phase: 'betting', // betting -> decide -> done
    ante: 0, pairPlus: 0, play: 0,
    last: null, // { ante, pairPlus }
    player: [], dealer: [],
    dealerRevealed: false,
    fresh: { player: new Set(), dealer: new Set() },
    outcome: null,
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

// ---------- betting ----------
function setChip(v) { state.chip = v; render(); }

function addBet(which) {
  if (state.phase !== 'betting' || state.busy) return;
  if (!spend(state.chip)) return;
  state[which] = round2(state[which] + state.chip);
  notice('');
  render();
}

function clearBets() {
  if (state.phase !== 'betting' || state.busy) return;
  credit(state.ante + state.pairPlus);
  state.ante = 0; state.pairPlus = 0;
  render();
}

function rebet() {
  if (state.phase !== 'betting' || state.busy || !state.last) return false;
  if (state.ante || state.pairPlus) return false;
  const need = state.last.ante + state.last.pairPlus;
  if (!spend(need)) return false;
  state.ante = state.last.ante; state.pairPlus = state.last.pairPlus;
  render();
  return true;
}

// ---------- round flow ----------
async function deal() {
  if (state.phase !== 'betting' || state.busy) return;
  if (state.ante <= 0 && state.pairPlus <= 0) { notice('Put a bet on the Ante or Pair Plus first.'); return; }
  notice('');
  state.last = { ante: state.ante, pairPlus: state.pairPlus };
  const deck = CARDS.shuffledDeck();
  state.player = []; state.dealer = []; state.dealerRevealed = false; state.outcome = null; state.play = 0;
  state.busy = true;
  state.phase = 'dealing';
  render();
  for (let i = 0; i < 3; i++) {
    state.player.push(deck.pop()); state.fresh.player.add(i); render(); await pause(150);
    state.dealer.push(deck.pop()); state.fresh.dealer.add(i); render(); await pause(150);
  }
  state.busy = false;
  if (state.ante > 0) {
    state.phase = 'decide';
    const ev = TCP_ENGINE.evaluate(state.player);
    announce(`You have ${TCP_ENGINE.describe(ev)}. Fold or Play?`);
    render();
    document.getElementById('playBtn').focus({ preventScroll: true });
  } else {
    await finish(false);
  }
}

async function playHand() {
  if (state.phase !== 'decide' || state.busy) return;
  if (!spend(state.ante)) { notice(`You need ${fmt(state.ante)} to Play. Fold, or reset your bankroll.`); return; }
  state.play = state.ante;
  await finish(false);
}

async function fold() {
  if (state.phase !== 'decide' || state.busy) return;
  await finish(true);
}

async function finish(folded) {
  state.busy = true;
  state.phase = 'reveal';
  render();
  await pause(250);
  state.dealerRevealed = true;
  render();
  await pause(350);

  const player = TCP_ENGINE.evaluate(state.player);
  const dealer = TCP_ENGINE.evaluate(state.dealer);
  const res = TCP_ENGINE.settle({ ante: state.ante, pairPlus: state.pairPlus, folded, player, dealer }, ODDS);
  credit(res.returned);
  state.stats.record(res.staked, res.returned);
  state.outcome = { folded, player, dealer, res };

  const pName = TCP_ENGINE.describe(player), dName = TCP_ENGINE.describe(dealer);
  log(`You: ${pName} (${state.player.map(CARDS.cardLabel).join(' ')}). Dealer: ${dName} (${state.dealer.map(CARDS.cardLabel).join(' ')}).`, 'roll-header');
  for (const l of res.lines) {
    if (l.result === 'win') log(`${l.bet} wins ${fmt(l.win)}${l.note ? ` (${l.note})` : ''}.`, 'win');
    else if (l.result === 'push') log(`${l.bet} pushes${l.note ? ` (${l.note})` : ''}.`, 'neutral');
    else log(`${l.bet} loses ${fmt(l.stake)}${l.note ? ` (${l.note})` : ''}.`, 'lose');
  }
  announce(`${resultHeadline()}. Net ${fmt(res.net)}.`);

  state.ante = 0; state.pairPlus = 0; state.play = 0;
  state.phase = 'done';
  state.busy = false;
  render();
}

function nextHand(sameBet) {
  if (state.phase !== 'done' || state.busy) return;
  state.phase = 'betting';
  state.player = []; state.dealer = []; state.outcome = null; state.dealerRevealed = false;
  notice('');
  if (sameBet) {
    if (rebet()) { deal(); return; }
    notice(`Not enough bankroll to repeat ${fmt(state.last.ante + state.last.pairPlus)}.`);
  }
  render();
}

function resetBankroll() {
  if (state.busy || state.phase === 'decide') { notice('Finish the current hand first.'); return; }
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
function resultHeadline() {
  const o = state.outcome;
  if (!o) return '';
  const net = o.res.net;
  if (o.folded) return 'You folded';
  if (state.last && state.last.ante === 0) return net > 0 ? 'Pair Plus wins' : 'Pair Plus loses';
  if (o.res.main === 'noQualify') return 'Dealer doesn\'t qualify';
  if (o.res.main === 'win') return 'You beat the dealer';
  if (o.res.main === 'lose') return 'Dealer wins';
  return 'Tie';
}

function render() {
  document.getElementById('bankroll').textContent = fmt(state.bankroll);
  const net = round2(state.bankroll - state.startBankroll);
  const netEl = document.getElementById('net');
  netEl.textContent = fmt(net);
  netEl.className = net >= 0 ? 'positive' : 'negative';
  document.getElementById('onTable').textContent = fmt(state.ante + state.pairPlus + state.play);
  document.getElementById('chipSelector').innerHTML = TABLE_KIT.chipsHtml(CHIPS, state.chip, 'setChip');

  renderHands();
  renderSpots();
  renderResult();
  renderStrategy();
  renderPaytableHighlight();

  const p = state.phase;
  document.getElementById('betArea').classList.toggle('hidden', !(p === 'betting' || p === 'dealing'));
  document.getElementById('decisionBar').classList.toggle('hidden', p !== 'decide');
  document.getElementById('newHandWrap').classList.toggle('hidden', p !== 'done');
  document.getElementById('dealBtn').disabled = state.busy || (state.ante <= 0 && state.pairPlus <= 0);
  document.getElementById('clearBetBtn').disabled = state.busy || p !== 'betting' || (state.ante <= 0 && state.pairPlus <= 0);
  document.getElementById('rebetBtn').disabled = state.busy || p !== 'betting' || !state.last || state.ante > 0 || state.pairPlus > 0;
  document.getElementById('spotAnte').disabled = p !== 'betting' || state.busy;
  document.getElementById('spotPairPlus').disabled = p !== 'betting' || state.busy;
  const playBtn = document.getElementById('playBtn');
  playBtn.textContent = `Play ${fmt(state.ante)}`;
  playBtn.disabled = state.busy;
  document.getElementById('foldBtn').disabled = state.busy;
  const same = document.getElementById('sameBetBtn');
  if (state.last) same.textContent = `Same Bet (${fmt(state.last.ante + state.last.pairPlus)}), Deal`;

  state.stats.render(document.getElementById('sessionStats'), 'Hands');
  document.getElementById('log').innerHTML = state.log.slice().reverse().slice(0, 80).map(e => `<div class="${e.cls}">${e.msg}</div>`).join('');
}

function renderHands() {
  const o = state.outcome;
  const pEl = document.getElementById('playerHand');
  const dEl = document.getElementById('dealerHand');
  pEl.innerHTML = state.player.map((c, i) => CARDS.cardHtml(c, { isNew: state.fresh.player.has(i) })).join('');
  dEl.innerHTML = state.dealer.map((c, i) => CARDS.cardHtml(c, {
    faceDown: !state.dealerRevealed,
    isNew: state.fresh.dealer.has(i) || (state.dealerRevealed && !o),
  })).join('');
  state.fresh.player.clear(); state.fresh.dealer.clear();

  const pT = document.getElementById('playerTotal');
  const dT = document.getElementById('dealerTotal');
  const dL = document.getElementById('dealerLabel');
  pT.textContent = state.player.length === 3 ? TCP_ENGINE.describe(TCP_ENGINE.evaluate(state.player)) : '';
  pT.className = 'hand-total';
  if (state.dealerRevealed && state.dealer.length === 3) {
    const ev = TCP_ENGINE.evaluate(state.dealer);
    const q = TCP_ENGINE.dealerQualifies(ev, ODDS);
    dT.textContent = `${TCP_ENGINE.describe(ev)} · ${q ? 'qualifies' : 'does not qualify'}`;
    dT.className = `hand-total ${q ? '' : 'is-lose'}`;
  } else { dT.textContent = ''; dT.className = 'hand-total'; }
  dL.textContent = 'Dealer';
  if (o && !o.folded && o.res.main) {
    if (o.res.main === 'win' || o.res.main === 'noQualify') pT.classList.add('is-win');
    else if (o.res.main === 'lose') pT.classList.add('is-lose');
  }
}

function renderSpots() {
  const set = (id, amt) => {
    document.getElementById(`amt${id}`).textContent = amt > 0 ? fmt(amt) : '—';
    document.getElementById(`spot${id}`).classList.toggle('is-selected', amt > 0);
  };
  set('Ante', state.ante);
  set('PairPlus', state.pairPlus);
  document.getElementById('amtPlay').textContent = state.ante > 0 ? `${fmt(state.ante)} later` : 'after you look';
}

function renderResult() {
  const el = document.getElementById('tcpResult');
  const bd = document.getElementById('tcpBreakdown');
  const o = state.outcome;
  if (state.phase === 'decide') {
    el.textContent = 'Fold or Play?'; el.className = 'round-result';
    bd.classList.add('hidden'); return;
  }
  if (!o) { el.textContent = state.phase === 'betting' ? 'Place your bets' : ''; el.className = 'round-result'; bd.classList.add('hidden'); return; }
  const net = o.res.net;
  el.textContent = `${resultHeadline()} · ${net > 0 ? '+' : ''}${fmt(net)}`;
  el.className = `round-result ${net > 0 ? 'is-win' : net < 0 ? 'is-lose' : 'is-push'}`;
  const main = o.res.lines.filter(l => !l.bonus);
  const bonus = o.res.lines.filter(l => l.bonus);
  const row = l => `<li class="r-${l.result}"><span>${l.bet}${l.note ? ` <i>${l.note}</i>` : ''}</span><b>${l.result === 'win' ? '+' + fmt(l.win) : l.result === 'push' ? 'push' : '−' + fmt(l.stake)}</b></li>`;
  bd.innerHTML = `${main.length ? `<div><h4>Main game</h4><ul>${main.map(row).join('')}</ul></div>` : ''}
    ${bonus.length ? `<div><h4>Bonus bets</h4><ul>${bonus.map(row).join('')}</ul></div>` : ''}`;
  bd.classList.remove('hidden');
}

function renderStrategy() {
  const el = document.getElementById('strategyHint');
  const on = document.getElementById('hintChk').checked;
  if (!on || state.phase !== 'decide') { el.classList.add('hidden'); return; }
  const ev = TCP_ENGINE.evaluate(state.player);
  const play = TCP_ENGINE.shouldPlay(ev, ODDS);
  el.innerHTML = play
    ? `Strategy: <b>Play</b>. ${ev.cat > 0 ? 'Any pair or better always plays.' : 'This hand is Q-6-4 or better.'}`
    : `Strategy: <b>Fold</b>. This hand is worse than Q-6-4.`;
  el.classList.remove('hidden');
}

function renderPaytableHighlight() {
  const o = state.outcome;
  const key = o ? o.player.key : null;
  document.querySelectorAll('#anteBonusTable tr').forEach(tr => tr.classList.toggle('is-hit', !!(o && !o.folded && state.last.ante > 0 && tr.dataset.key === key)));
  document.querySelectorAll('#pairPlusTable tr').forEach(tr => tr.classList.toggle('is-hit', !!(o && !o.folded && state.last.pairPlus > 0 && tr.dataset.key === key)));
}

// ---------- init ----------
window.addEventListener('DOMContentLoaded', () => {
  state = newState(0);
  document.getElementById('spotAnte').addEventListener('click', () => addBet('ante'));
  document.getElementById('spotPairPlus').addEventListener('click', () => addBet('pairPlus'));
  document.getElementById('clearBetBtn').addEventListener('click', clearBets);
  document.getElementById('rebetBtn').addEventListener('click', rebet);
  document.getElementById('dealBtn').addEventListener('click', deal);
  document.getElementById('playBtn').addEventListener('click', playHand);
  document.getElementById('foldBtn').addEventListener('click', fold);
  document.getElementById('sameBetBtn').addEventListener('click', () => nextHand(true));
  document.getElementById('changeBetBtn').addEventListener('click', () => nextHand(false));
  document.getElementById('resetBtn').addEventListener('click', resetBankroll);
  document.getElementById('hintChk').addEventListener('change', render);
  TABLE_KIT.bindFastToggle('fastChk');

  showOverlay({
    title: 'Welcome to Three Card Poker',
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
