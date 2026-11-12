// One engine, two rulesets. Standard craps reads ODDS (/games/craps/odds.js).
// The Crapless Craps page also loads /games/crapless-craps/odds.js, which
// defines CRAPLESS_ODDS (same shape, extra point numbers, different
// come-out rules), and this file uses it instead. Every rule difference
// between the two games comes from these data keys, not from forked code.
const RULES = (typeof CRAPLESS_ODDS !== 'undefined') ? CRAPLESS_ODDS : ODDS;
const NUMS = RULES.pointNumbers;
const HARD_NUMS = [4, 6, 8, 10];
const CHIPS = [1, 5, 10, 25, 50, 100, 250];
const DIE_FACE = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' };

// All payout/odds numbers come from RULES — see src/_data/odds.js and
// src/_data/craplessOdds.js, loaded via <script> tags before this file.

let state = null;

function freshNumberBox() {
  return {
    place: 0, placeOn: true,
    buy: 0, buyOn: true,
    comeAmt: 0, comeOdds: 0, comeOn: true,
    dcAmt: 0, dcOdds: 0, dcOn: true,
  };
}

function newState(bankroll) {
  globalThis.StakesWallet?.buyIn(bankroll);   // wallet bridge: a new session starts
  const numbers = {};
  NUMS.forEach(n => numbers[n] = freshNumberBox());
  return {
    bankroll, startBankroll: bankroll,
    chip: 10, numMode: 'place',
    // What happens to a winning Place/Buy/Hardway bet: 'down' = take it
    // down and collect everything, 'up' = leave the bet up and collect the
    // winnings, 'press' = add the winnings to the bet in whole units.
    afterWin: 'down',
    // Casino default: Place, Buy, Hardways and Come odds are OFF on the
    // come-out roll unless the player calls them working.
    comeOutWorking: false,
    lastLayout: null, // bets on the table at the last seven-out, for Rebet
    point: null,
    passLine: 0, passOdds: 0,
    dontPass: 0, dontPassOdds: 0,
    comeTransit: 0, dontComeTransit: 0,
    numbers,
    field: 0, anySeven: 0, anyCraps: 0,
    hard: { 4: 0, 6: 0, 8: 0, 10: 0 },
    rolls: 0,
    log: [],
    rollHistory: [],
    stats: freshStats(),
  };
}

function freshStats() {
  const totals = {};
  for (let t = 2; t <= 12; t++) totals[t] = 0;
  return { totals, pointsSet: 0, pointsMade: 0, sevenOuts: 0, naturals: 0, crapsOut: 0, handRolls: 0, longestHand: 0, hands: 0, startedAt: Date.now() };
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

// ---------- odds math ----------
function maxPassOdds(base, point) { return base * RULES.oddsMult[point]; }
function maxLayOdds(base, point) {
  const [n, d] = RULES.trueOdds[point];
  return base * RULES.oddsMult[point] * (n / d);
}
function layWin(amount, point) {
  const [n, d] = RULES.trueOdds[point];
  return amount * (d / n);
}

// ---------- click handlers ----------
function setChip(v) { state.chip = v; render(); }
function setNumMode(v) { state.numMode = v; render(); }

function clickPassLine() {
  if (state.point !== null) { notice("Pass Line can only be bet on the come-out."); return; }
  if (!spend(state.chip)) return;
  state.passLine += state.chip;
  render();
}
function clickDontPass() {
  if (!RULES.dontBets) return;
  if (state.point !== null) { notice("Don't Pass can only be bet on the come-out."); return; }
  if (!spend(state.chip)) return;
  state.dontPass += state.chip;
  render();
}
function removePassLine() {
  if (state.point !== null) return;
  credit(state.passLine); state.passLine = 0; render();
}
function removeDontPass() {
  if (state.point !== null) return;
  credit(state.dontPass); state.dontPass = 0; render();
}

function addPassOdds() {
  if (state.point === null || state.passLine <= 0) return;
  const max = maxPassOdds(state.passLine, state.point);
  const room = Math.round((max - state.passOdds) * 100) / 100;
  if (room <= 0) { notice("Max odds reached."); return; }
  const add = Math.min(state.chip, room);
  if (!spend(add)) return;
  state.passOdds += add; render();
}
function removePassOdds() { credit(state.passOdds); state.passOdds = 0; render(); }

function addDontPassOdds() {
  if (state.point === null || state.dontPass <= 0) return;
  const max = maxLayOdds(state.dontPass, state.point);
  const room = Math.round((max - state.dontPassOdds) * 100) / 100;
  if (room <= 0) { notice("Max lay odds reached."); return; }
  const add = Math.min(state.chip, room);
  if (!spend(add)) return;
  state.dontPassOdds += add; render();
}
function removeDontPassOdds() { credit(state.dontPassOdds); state.dontPassOdds = 0; render(); }

function clickCome() {
  if (state.point === null) { notice("Come bets need a point on."); return; }
  if (!spend(state.chip)) return;
  state.comeTransit += state.chip; render();
}
function clickDontCome() {
  if (!RULES.dontBets) return;
  if (state.point === null) { notice("Don't Come bets need a point on."); return; }
  if (!spend(state.chip)) return;
  state.dontComeTransit += state.chip; render();
}
function removeComeTransit() { credit(state.comeTransit); state.comeTransit = 0; render(); }
function removeDontComeTransit() { credit(state.dontComeTransit); state.dontComeTransit = 0; render(); }

function addComeOdds(n) {
  const box = state.numbers[n];
  if (box.comeAmt <= 0) return;
  const max = maxPassOdds(box.comeAmt, n);
  const room = Math.round((max - box.comeOdds) * 100) / 100;
  if (room <= 0) { notice("Max odds reached."); return; }
  const add = Math.min(state.chip, room);
  if (!spend(add)) return;
  box.comeOdds += add; render();
}
function removeComeOdds(n) { const box = state.numbers[n]; credit(box.comeOdds); box.comeOdds = 0; render(); }

function addDontComeOdds(n) {
  const box = state.numbers[n];
  if (box.dcAmt <= 0) return;
  const max = maxLayOdds(box.dcAmt, n);
  const room = Math.round((max - box.dcOdds) * 100) / 100;
  if (room <= 0) { notice("Max lay odds reached."); return; }
  const add = Math.min(state.chip, room);
  if (!spend(add)) return;
  box.dcOdds += add; render();
}
function removeDontComeOdds(n) { const box = state.numbers[n]; credit(box.dcOdds); box.dcOdds = 0; render(); }

function clickNumber(n) {
  const box = state.numbers[n];
  if (state.numMode === 'place') {
    if (!spend(state.chip)) return;
    box.place += state.chip;
  } else {
    if (!RULES.buyNumbers.includes(n)) { notice(`Buy bets aren't offered on ${n} at this table. Switch to Place to bet it.`); return; }
    const commission = Math.max(1, Math.ceil(state.chip * (RULES.buyCommissionPct / 100)));
    if (!spend(state.chip + commission)) { notice(`Need ${fmt(state.chip + commission)} including vig.`); return; }
    box.buy += state.chip;
  }
  render();
}

function toggleOn(n, field) {
  const box = state.numbers[n];
  box[field] = !box[field];
  render();
}

function removePlace(n) { const box = state.numbers[n]; credit(box.place); box.place = 0; render(); }
function removeBuy(n) { const box = state.numbers[n]; credit(box.buy); box.buy = 0; render(); } // vig forfeited

function clickField() { if (!spend(state.chip)) return; state.field += state.chip; render(); }
function clickAnySeven() { if (!spend(state.chip)) return; state.anySeven += state.chip; render(); }
function clickAnyCraps() { if (!spend(state.chip)) return; state.anyCraps += state.chip; render(); }
function removeField() { credit(state.field); state.field = 0; render(); }
function removeAnySeven() { credit(state.anySeven); state.anySeven = 0; render(); }
function removeAnyCraps() { credit(state.anyCraps); state.anyCraps = 0; render(); }

function clickHard(n) { if (!spend(state.chip)) return; state.hard[n] += state.chip; render(); }
function removeHard(n) { credit(state.hard[n]); state.hard[n] = 0; render(); }

function clearAllBets() {
  credit(state.passLine); state.passLine = 0;
  credit(state.passOdds); state.passOdds = 0;
  credit(state.dontPass); state.dontPass = 0;
  credit(state.dontPassOdds); state.dontPassOdds = 0;
  credit(state.comeTransit); state.comeTransit = 0;
  credit(state.dontComeTransit); state.dontComeTransit = 0;
  NUMS.forEach(n => {
    const box = state.numbers[n];
    credit(box.place); box.place = 0;
    credit(box.buy); box.buy = 0; // vig already forfeited, not refunded
    credit(box.comeAmt + box.comeOdds); box.comeAmt = 0; box.comeOdds = 0;
    credit(box.dcAmt + box.dcOdds); box.dcAmt = 0; box.dcOdds = 0;
  });
  credit(state.field); state.field = 0;
  credit(state.anySeven); state.anySeven = 0;
  credit(state.anyCraps); state.anyCraps = 0;
  HARD_NUMS.forEach(n => { credit(state.hard[n]); state.hard[n] = 0; });
  notice('All bets cleared.');
  render();
}

function anyWorkingBetsOn() {
  for (const n of NUMS) {
    const box = state.numbers[n];
    if (box.place > 0 && box.placeOn) return true;
    if (box.buy > 0 && box.buyOn) return true;
    if (box.comeAmt > 0 && box.comeOn) return true;
    if (box.dcAmt > 0 && box.dcOn) return true;
  }
  return false;
}

function toggleAllWorking() {
  const turnOn = !anyWorkingBetsOn();
  NUMS.forEach(n => {
    const box = state.numbers[n];
    if (box.place > 0) box.placeOn = turnOn;
    if (box.buy > 0) box.buyOn = turnOn;
    if (box.comeAmt > 0) box.comeOn = turnOn;
    if (box.dcAmt > 0) box.dcOn = turnOn;
  });
  render();
}

function resetBankroll() {
  showOverlay({
    title: "Reset Bankroll?",
    text: "This clears all current bets and starts a fresh session.",
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

function showOverlay({ title, text, defaultValue, showCancel, confirmLabel, onConfirm }) {
  const overlay = document.getElementById('setupOverlay');
  document.getElementById('overlayTitle').textContent = title;
  document.getElementById('overlayText').textContent = text;
  globalThis.StakesWallet?.paintOverlay();   // wallet bridge: chip count + Max
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

// ---------- roll resolution ----------
function rollDice() {
  notice('');
  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  const total = d1 + d2;
  resolveRoll(d1, d2, total);
}

function resolveRoll(d1, d2, total) {
  log(`Roll #${state.rolls + 1}: ${d1} + ${d2} = ${total}`, 'roll-header');
  const histEntry = { d1, d2, total, event: null };
  state.rollHistory.push(histEntry);
  const pointWasOn = state.point !== null;
  // On the come-out, Place/Buy/Hardways and Come odds sit out unless the
  // player turned on "work on the come-out".
  const offForComeOut = !pointWasOn && !state.comeOutWorking;
  if (pointWasOn && total === 7) snapshotLayout();
  recordStats(total, pointWasOn);

  resolveOneRoll(total);
  if (!offForComeOut) resolveHardways(d1, d2, total);
  else if (HARD_NUMS.some(n => state.hard[n] > 0) && (total === 7 || HARD_NUMS.includes(total))) log('Hardways are off on the come-out.', 'neutral');

  // come / don't-come point bets resolve every roll, independent of the pass line's phase
  for (const n of NUMS) {
    const box = state.numbers[n];
    if (box.comeAmt > 0 && box.comeOn) {
      if (total === n) winComePoint(n, offForComeOut);
      else if (total === 7) loseComePoint(n, offForComeOut);
    }
    if (box.dcAmt > 0 && box.dcOn) {
      if (total === n) loseDontComePoint(n);
      else if (total === 7) winDontComePoint(n);
    }
  }

  // place / buy bets resolve every roll if working; an off bet is refunded only when the shooter's hand truly ends
  for (const n of NUMS) {
    const box = state.numbers[n];
    if (offForComeOut && (box.place > 0 || box.buy > 0) && (total === n || total === 7)) {
      log(`${box.place > 0 ? 'Place' : 'Buy'} ${n} is off on the come-out.`, 'neutral');
      continue;
    }
    if (box.place > 0) {
      if (box.placeOn) {
        if (total === n) winPlace(n);
        else if (total === 7) losePlace(n);
      } else if (total === 7 && pointWasOn) {
        credit(box.place); box.place = 0;
      }
    }
    if (box.buy > 0) {
      if (box.buyOn) {
        if (total === n) winBuy(n);
        else if (total === 7) loseBuy(n);
      } else if (total === 7 && pointWasOn) {
        credit(box.buy); box.buy = 0; // vig stays forfeited
      }
    }
  }

  migrateTransit(total);

  if (state.point === null) {
    if (RULES.comeOutNaturals.includes(total)) { histEntry.event = 'natural'; resolvePassLineComeOut(total); }
    else if (RULES.comeOutCraps.includes(total)) { histEntry.event = 'craps'; resolvePassLineComeOut(total); }
    else { histEntry.event = 'point'; state.point = total; state.stats.pointsSet++; log(`Point is now ${total}.`, 'neutral'); }
  } else {
    if (total === 7) {
      histEntry.event = 'sevenOut';
      state.stats.sevenOuts++;
      resolveSevenOut(state.point);
      state.point = null;
      endHand();
    } else if (total === state.point) {
      histEntry.event = 'made';
      state.stats.pointsMade++;
      resolvePassLinePointMade(state.point);
      state.point = null;
    }
  }

  state.rolls++;
  render();
}

// ---------- session roll stats ----------
function recordStats(total, pointWasOn) {
  const st = state.stats;
  st.totals[total]++;
  st.handRolls++;
  if (!pointWasOn && RULES.comeOutNaturals.includes(total)) st.naturals++;
  if (!pointWasOn && RULES.comeOutCraps.includes(total)) st.crapsOut++;
}

function endHand() {
  const st = state.stats;
  st.hands++;
  st.longestHand = Math.max(st.longestHand, st.handRolls);
  st.handRolls = 0;
}

// ---------- after-win handling (take down / leave up / press) ----------
// `bet` is the amount riding, `win` the winnings. Returns the new bet size
// and credits the bankroll with whatever comes off the table. Press adds the
// winnings to the bet in whole `unit`s (never more than doubling it) and
// collects the remainder.
function settleWinner(bet, win, unit, canPress) {
  if (state.afterWin === 'down') { credit(bet + win); return { bet: 0, note: '' }; }
  if (state.afterWin === 'press' && canPress) {
    const inc = Math.min(bet, Math.floor((win + 1e-9) / unit) * unit);
    if (inc > 0) {
      credit(win - inc);
      return { bet: Math.round((bet + inc) * 100) / 100, note: ` Pressed to ${fmt(bet + inc)}${win - inc > 0.004 ? `, ${fmt(win - inc)} collected` : ''}.` };
    }
  }
  credit(win);
  return { bet, note: ' Bet stays up.' };
}

// ---------- Rebet: re-place the layout from before the last seven-out ----------
function snapshotLayout() {
  const snap = { place: {}, buy: {}, hard: {}, passLine: state.passLine, dontPass: state.dontPass };
  NUMS.forEach(n => { snap.place[n] = state.numbers[n].place; snap.buy[n] = state.numbers[n].buy; });
  HARD_NUMS.forEach(n => { snap.hard[n] = state.hard[n]; });
  const any = snap.passLine + snap.dontPass + NUMS.reduce((a, n) => a + snap.place[n] + snap.buy[n], 0) + HARD_NUMS.reduce((a, n) => a + snap.hard[n], 0);
  if (any > 0) state.lastLayout = snap;
}

function rebetPlan() {
  const snap = state.lastLayout;
  if (!snap) return null;
  const plan = { cost: 0, items: [] };
  const add = (kind, n, amt, cost) => { plan.items.push({ kind, n, amt }); plan.cost += cost; };
  if (state.point === null) {
    if (snap.passLine > state.passLine) add('passLine', null, snap.passLine - state.passLine, snap.passLine - state.passLine);
    if (RULES.dontBets && snap.dontPass > state.dontPass) add('dontPass', null, snap.dontPass - state.dontPass, snap.dontPass - state.dontPass);
  }
  NUMS.forEach(n => {
    const box = state.numbers[n];
    if (snap.place[n] > box.place) add('place', n, snap.place[n] - box.place, snap.place[n] - box.place);
    if (snap.buy[n] > box.buy) {
      const amt = snap.buy[n] - box.buy;
      add('buy', n, amt, amt + Math.max(1, Math.ceil(amt * (RULES.buyCommissionPct / 100))));
    }
  });
  HARD_NUMS.forEach(n => { if (snap.hard[n] > state.hard[n]) add('hard', n, snap.hard[n] - state.hard[n], snap.hard[n] - state.hard[n]); });
  plan.cost = Math.round(plan.cost * 100) / 100;
  return plan.items.length ? plan : null;
}

function rebetLayout() {
  const plan = rebetPlan();
  if (!plan) return;
  if (plan.cost > state.bankroll + 1e-9) { notice(`Rebet needs ${fmt(plan.cost)}.`); return; }
  spend(plan.cost);
  for (const it of plan.items) {
    if (it.kind === 'passLine') state.passLine += it.amt;
    else if (it.kind === 'dontPass') state.dontPass += it.amt;
    else if (it.kind === 'place') { state.numbers[it.n].place += it.amt; state.numbers[it.n].placeOn = true; }
    else if (it.kind === 'buy') { state.numbers[it.n].buy += it.amt; state.numbers[it.n].buyOn = true; }
    else if (it.kind === 'hard') state.hard[it.n] += it.amt;
  }
  log(`Rebet: your previous layout is back up (${fmt(plan.cost)}).`, 'neutral');
  notice('');
  render();
}

// ---------- presets ----------
// Sized off the selected chip: one "unit" is $5 per $5 of chip ($6 on 6/8,
// since Place 6/8 pays 7:6), minimum one unit. A preset only tops bets up to
// its target, so clicking it twice never doubles your action.
function unitScale() { return Math.max(1, Math.round(state.chip / 5)); }
function placeUnitFor(n) { return RULES.placeUnit[n] || 5; }

const PRESETS = {
  place68: { label: 'Place 6 & 8', place: [6, 8] },
  inside: { label: 'Inside (5, 6, 8, 9)', place: [5, 6, 8, 9] },
  ironCross: { label: 'Iron Cross', place: [5, 6, 8], field: true },
};

function applyPreset(key) {
  const p = PRESETS[key];
  const k = unitScale();
  const items = [];
  let cost = 0;
  for (const n of p.place) {
    const target = placeUnitFor(n) * k;
    const box = state.numbers[n];
    if (box.place < target) { items.push(['place', n, target - box.place]); cost += target - box.place; }
  }
  if (p.field) {
    const target = 5 * k;
    if (state.field < target) { items.push(['field', null, target - state.field]); cost += target - state.field; }
  }
  if (!items.length) { notice(`${p.label} is already on the table.`); return; }
  if (cost > state.bankroll + 1e-9) { notice(`${p.label} needs ${fmt(cost)}.`); return; }
  spend(cost);
  for (const [kind, n, amt] of items) {
    if (kind === 'place') { state.numbers[n].place += amt; state.numbers[n].placeOn = true; }
    else state.field += amt;
  }
  notice('');
  log(`${p.label}: ${fmt(cost)} placed.${state.point === null && !state.comeOutWorking ? ' Place bets are off until a point is set.' : ''}`, 'neutral');
  render();
}

// Three-Point Molly, one step per click: Pass Line on the come-out; once a
// point is on, max odds behind it, then Come bets (with max odds) until
// three numbers are working.
function mollyStep() {
  const unit = 5 * unitScale();
  const actions = [];
  let cost = 0;
  if (state.point === null) {
    if (state.passLine < unit) { actions.push(() => { state.passLine += unit - state.passLine; }); cost += unit - state.passLine; }
  } else {
    if (state.passLine > 0) {
      const room = Math.round((maxPassOdds(state.passLine, state.point) - state.passOdds) * 100) / 100;
      if (room > 0) { actions.push(() => { state.passOdds += room; }); cost += room; }
    }
    NUMS.forEach(n => {
      const box = state.numbers[n];
      if (box.comeAmt > 0) {
        const room = Math.round((maxPassOdds(box.comeAmt, n) - box.comeOdds) * 100) / 100;
        if (room > 0) { actions.push(() => { box.comeOdds += room; }); cost += room; }
      }
    });
    const working = (state.passLine > 0 ? 1 : 0) + NUMS.filter(n => state.numbers[n].comeAmt > 0).length;
    if (working < 3 && state.comeTransit === 0) { actions.push(() => { state.comeTransit += unit; }); cost += unit; }
  }
  cost = Math.round(cost * 100) / 100;
  if (!actions.length) { notice('Three-Point Molly is fully set: three numbers working with max odds.'); return; }
  if (cost > state.bankroll + 1e-9) { notice(`The next Molly step needs ${fmt(cost)}.`); return; }
  spend(cost);
  actions.forEach(a => a());
  notice('');
  log(`3-Point Molly step: ${fmt(cost)} added.`, 'neutral');
  render();
}

// Press / Regress a Place bet by one unit from the bet sheet.
function pressPlace(n) {
  const u = placeUnitFor(n) * unitScale();
  if (!spend(u)) return;
  state.numbers[n].place = Math.round((state.numbers[n].place + u) * 100) / 100;
  render();
}
function regressPlace(n) {
  const box = state.numbers[n];
  const u = placeUnitFor(n) * unitScale();
  const take = Math.min(u, box.place);
  credit(take);
  box.place = Math.round((box.place - take) * 100) / 100;
  render();
}

function resolveOneRoll(total) {
  if (state.field > 0) {
    if (total === 2) { const w = payout(state.field, RULES.fieldPay[2]); credit(state.field + w); log(`Field wins ${fmt(w)} (2 pays double).`, 'win'); }
    else if (total === 12) { const w = payout(state.field, RULES.fieldPay[12]); credit(state.field + w); log(`Field wins ${fmt(w)} (12 pays triple).`, 'win'); }
    else if ([3, 4, 9, 10, 11].includes(total)) { credit(state.field * 2); log(`Field wins ${fmt(state.field)}.`, 'win'); }
    else { log(`Field loses ${fmt(state.field)}.`, 'lose'); }
    state.field = 0;
  }
  if (state.anySeven > 0) {
    if (total === 7) { const w = payout(state.anySeven, RULES.anySevenPay); credit(state.anySeven + w); log(`Any Seven wins ${fmt(w)}!`, 'win'); }
    else { log(`Any Seven loses ${fmt(state.anySeven)}.`, 'lose'); }
    state.anySeven = 0;
  }
  if (state.anyCraps > 0) {
    if ([2, 3, 12].includes(total)) { const w = payout(state.anyCraps, RULES.anyCrapsPay); credit(state.anyCraps + w); log(`Any Craps wins ${fmt(w)}!`, 'win'); }
    else { log(`Any Craps loses ${fmt(state.anyCraps)}.`, 'lose'); }
    state.anyCraps = 0;
  }
}

function resolveHardways(d1, d2, total) {
  for (const n of HARD_NUMS) {
    const amt = state.hard[n];
    if (amt <= 0) continue;
    if (total === 7) { log(`Hard ${n} loses ${fmt(amt)} (seven).`, 'lose'); state.hard[n] = 0; }
    else if (total === n && d1 === d2) {
      const w = amt * RULES.hardPay[n];
      const r = settleWinner(amt, w, 1, true);
      state.hard[n] = r.bet;
      log(`Hard ${n} wins ${fmt(w)}!${r.note}`, 'win');
    }
    else if (total === n && d1 !== d2) { log(`Hard ${n} loses ${fmt(amt)} (easy ${n}).`, 'lose'); state.hard[n] = 0; }
  }
}

// oddsOff: on the come-out the Come odds don't work by default, so they
// are simply returned whichever way the flat bet goes.
function winComePoint(n, oddsOff) {
  const box = state.numbers[n];
  const amt = box.comeAmt;
  credit(amt * 2);
  let extra = 0;
  if (box.comeOdds > 0) {
    if (oddsOff) credit(box.comeOdds);
    else { extra = payout(box.comeOdds, RULES.trueOdds[n]); credit(box.comeOdds + extra); }
  }
  log(`Come ${n} wins ${fmt(amt)}${extra ? ` + odds ${fmt(extra)}` : ''}${oddsOff && box.comeOdds > 0 ? ' (odds were off on the come-out and are returned)' : ''}.`, 'win');
  box.comeAmt = 0; box.comeOdds = 0;
}
function loseComePoint(n, oddsOff) {
  const box = state.numbers[n];
  if (oddsOff && box.comeOdds > 0) {
    credit(box.comeOdds);
    log(`Come ${n} loses ${fmt(box.comeAmt)}. Its odds were off on the come-out and are returned.`, 'lose');
  } else {
    log(`Come ${n} loses ${fmt(box.comeAmt + box.comeOdds)}.`, 'lose');
  }
  box.comeAmt = 0; box.comeOdds = 0;
}
function winDontComePoint(n) {
  const box = state.numbers[n];
  credit(box.dcAmt * 2);
  let extra = 0;
  if (box.dcOdds > 0) { extra = layWin(box.dcOdds, n); credit(box.dcOdds + extra); }
  log(`Don't Come ${n} wins ${fmt(box.dcAmt)}${extra ? ` + odds ${fmt(extra)}` : ''}.`, 'win');
  box.dcAmt = 0; box.dcOdds = 0;
}
function loseDontComePoint(n) {
  const box = state.numbers[n];
  log(`Don't Come ${n} loses ${fmt(box.dcAmt + box.dcOdds)}.`, 'lose');
  box.dcAmt = 0; box.dcOdds = 0;
}

function winPlace(n) {
  const box = state.numbers[n];
  const w = Math.round(payout(box.place, RULES.placeOdds[n]) * 100) / 100;
  const r = settleWinner(box.place, w, placeUnitFor(n), true);
  box.place = r.bet;
  log(`Place ${n} wins ${fmt(w)}.${r.note}`, 'win');
}
function losePlace(n) { const box = state.numbers[n]; log(`Place ${n} loses ${fmt(box.place)}.`, 'lose'); box.place = 0; }
function winBuy(n) {
  const box = state.numbers[n];
  const w = Math.round(payout(box.buy, RULES.trueOdds[n]) * 100) / 100;
  // Pressing a Buy bet would need fresh commission, so Press leaves it up.
  const r = settleWinner(box.buy, w, 1, false);
  box.buy = r.bet;
  log(`Buy ${n} wins ${fmt(w)}.${r.note}`, 'win');
}
function loseBuy(n) { const box = state.numbers[n]; log(`Buy ${n} loses ${fmt(box.buy)}.`, 'lose'); box.buy = 0; }

function migrateTransit(total) {
  if (state.comeTransit > 0) {
    if (RULES.comeOutNaturals.includes(total)) { credit(state.comeTransit * 2); log(`Come bet wins ${fmt(state.comeTransit)} (${total}).`, 'win'); state.comeTransit = 0; }
    else if (RULES.comeOutCraps.includes(total)) { log(`Come bet loses (${total}).`, 'lose'); state.comeTransit = 0; }
    else if (NUMS.includes(total)) {
      state.numbers[total].comeAmt += state.comeTransit;
      state.numbers[total].comeOn = true;
      log(`Come bet moves to ${total}.`, 'neutral');
      state.comeTransit = 0;
    }
  }
  if (state.dontComeTransit > 0) {
    if (total === 7 || total === 11) { log(`Don't Come loses (${total}).`, 'lose'); state.dontComeTransit = 0; }
    else if (total === 2 || total === 3) { credit(state.dontComeTransit * 2); log(`Don't Come wins ${fmt(state.dontComeTransit)} (${total}).`, 'win'); state.dontComeTransit = 0; }
    else if (total === 12) { credit(state.dontComeTransit); log(`Don't Come pushes (bar 12).`, 'neutral'); state.dontComeTransit = 0; }
    else if (NUMS.includes(total)) {
      state.numbers[total].dcAmt += state.dontComeTransit;
      state.numbers[total].dcOn = true;
      log(`Don't Come bet moves to ${total}.`, 'neutral');
      state.dontComeTransit = 0;
    }
  }
}

function resolvePassLineComeOut(total) {
  if (RULES.comeOutNaturals.includes(total)) {
    if (state.passLine > 0) { credit(state.passLine * 2); log(`Pass Line wins ${fmt(state.passLine)} (${total}).`, 'win'); state.passLine = 0; }
    if (state.dontPass > 0) { log(`Don't Pass loses ${fmt(state.dontPass)}.`, 'lose'); state.dontPass = 0; }
  } else {
    if (state.passLine > 0) { log(`Pass Line loses ${fmt(state.passLine)} (craps ${total}).`, 'lose'); state.passLine = 0; }
    if (state.dontPass > 0) {
      if (total === 12) { credit(state.dontPass); log(`Don't Pass pushes (bar 12).`, 'neutral'); state.dontPass = 0; }
      else { credit(state.dontPass * 2); log(`Don't Pass wins ${fmt(state.dontPass)}.`, 'win'); state.dontPass = 0; }
    }
  }
}

function resolvePassLinePointMade(point) {
  if (state.passLine > 0) { credit(state.passLine * 2); log(`Pass Line wins ${fmt(state.passLine)}! Point ${point} made.`, 'win'); state.passLine = 0; }
  if (state.passOdds > 0) { const w = payout(state.passOdds, RULES.trueOdds[point]); credit(state.passOdds + w); log(`Odds win ${fmt(w)}.`, 'win'); state.passOdds = 0; }
  if (state.dontPass > 0) { log(`Don't Pass loses ${fmt(state.dontPass)}.`, 'lose'); state.dontPass = 0; }
  if (state.dontPassOdds > 0) { log(`Lay odds lose ${fmt(state.dontPassOdds)}.`, 'lose'); state.dontPassOdds = 0; }
}

function resolveSevenOut(point) {
  log(`Seven out.`, 'lose');
  if (state.passLine > 0) { log(`Pass Line loses ${fmt(state.passLine)}.`, 'lose'); state.passLine = 0; }
  if (state.passOdds > 0) { log(`Odds lose ${fmt(state.passOdds)}.`, 'lose'); state.passOdds = 0; }
  if (state.dontPass > 0) { credit(state.dontPass * 2); log(`Don't Pass wins ${fmt(state.dontPass)}!`, 'win'); state.dontPass = 0; }
  if (state.dontPassOdds > 0) { const w = layWin(state.dontPassOdds, point); credit(state.dontPassOdds + w); log(`Lay odds win ${fmt(w)}.`, 'win'); state.dontPassOdds = 0; }
}

// ---------- rendering ----------
function render() {
  globalThis.StakesWallet?.sync(state.bankroll);   // wallet bridge: report net result
  document.getElementById('bankroll').textContent = fmt(state.bankroll);
  const net = Math.round((state.bankroll - state.startBankroll) * 100) / 100;
  const netEl = document.getElementById('net');
  netEl.textContent = fmt(net);
  netEl.className = net >= 0 ? 'positive' : 'negative';
  document.getElementById('pointDisplay').textContent = state.point ?? 'OFF';
  document.getElementById('pointDisplay').closest('.sb-cell').classList.toggle('is-on', state.point !== null);

  renderRollDisplay();
  renderChips();
  renderLines();
  renderNumbers();
  renderOnetime();
  renderHardways();
  renderLog();
  renderBetSheet();
  renderStats();

  document.querySelector(`input[name=numMode][value=${state.numMode}]`).checked = true;
  document.getElementById('afterWin').value = state.afterWin;
  document.getElementById('comeOutWorking').checked = state.comeOutWorking;
  if (typeof window.paintTableSettings === 'function') window.paintTableSettings();
  document.getElementById('toggleWorkingBtn').textContent = anyWorkingBetsOn() ? 'Bets Off' : 'Bets On';
  const rb = document.getElementById('rebetBtn');
  const plan = rebetPlan();
  rb.disabled = !plan;
  rb.textContent = plan ? `Rebet ${fmt(plan.cost)}` : 'Rebet';
}

const EVENT_LABEL = { natural: 'come-out winner', craps: 'craps', point: 'point set', made: 'point made', sevenOut: 'seven out' };

function renderStats() {
  const el = document.getElementById('rollStats');
  if (!el) return;
  const st = state.stats;
  const n = state.rolls;
  const WAYS = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };
  const maxPct = 100 * 6 / 36;
  const rows = [];
  for (let t = 2; t <= 12; t++) {
    const pct = n ? 100 * st.totals[t] / n : 0;
    const exp = 100 * WAYS[t] / 36;
    rows.push(`<div class="st-row${t === 7 ? ' is-seven' : ''}">
      <span class="st-num">${t}</span>
      <span class="st-bar"><span class="st-fill" style="width:${Math.min(100, pct / (maxPct * 1.5) * 100).toFixed(1)}%"></span><span class="st-exp" style="left:${(exp / (maxPct * 1.5) * 100).toFixed(1)}%"></span></span>
      <span class="st-val">${st.totals[t]}</span>
      <span class="st-pct">${n ? pct.toFixed(1) + '%' : '—'}</span>
    </div>`);
  }
  const hands = st.hands + (st.handRolls > 0 ? 1 : 0);
  el.innerHTML = `
    <div class="st-summary">
      <div><span class="sb-k">Rolls</span><b>${n}</b></div>
      <div><span class="sb-k">Points made</span><b>${st.pointsMade}/${st.pointsSet}</b></div>
      <div><span class="sb-k">Seven-outs</span><b>${st.sevenOuts}</b></div>
      <div><span class="sb-k">Longest hand</span><b>${Math.max(st.longestHand, st.handRolls)} rolls</b></div>
    </div>
    <div class="st-head"><span>Total</span><span>How often it's come up (marker = expected)</span><span>Rolls</span><span>%</span></div>
    ${rows.join('')}
    <p class="st-note">Expected share is fixed by the dice: a 7 has 6 of 36 ways (16.7%), a 6 or 8 has 5 ways (13.9%), down to 1 way (2.8%) for a 2 or 12. Short sessions drift far from it; nothing that already rolled changes the next roll.${hands ? '' : ''}</p>`;
}

function renderRollDisplay() {
  const last = state.rollHistory[state.rollHistory.length - 1];
  document.getElementById('die1').textContent = last ? DIE_FACE[last.d1] : '-';
  document.getElementById('die2').textContent = last ? DIE_FACE[last.d2] : '-';
  document.getElementById('rollTotal').textContent = last ? `Total: ${last.total}` : 'Roll the dice to begin';

  const hist = document.getElementById('rollHistory');
  hist.innerHTML = state.rollHistory.slice(-20).reverse().map(r =>
    `<div class="roll-chip ${r.total === 7 ? 'seven' : ''} ${r.event ? 'ev-' + r.event : ''}" title="${r.d1} + ${r.d2}${r.event ? ' · ' + EVENT_LABEL[r.event] : ''}">${r.total}</div>`
  ).join('');
  const die1 = document.getElementById('die1'), die2 = document.getElementById('die2');
  if (last && state.lastAnimatedRoll !== state.rollHistory.length) {
    state.lastAnimatedRoll = state.rollHistory.length;
    [die1, die2].forEach(d => { d.classList.remove('is-rolling'); void d.offsetWidth; d.classList.add('is-rolling'); });
  }
  document.getElementById('rollTotal').textContent = last ? `Total: ${last.total}${last.event ? ` · ${EVENT_LABEL[last.event]}` : ''}` : 'Roll the dice to begin';
}

function renderChips() {
  const c = document.getElementById('chipSelector');
  c.innerHTML = CHIPS.map(v =>
    `<button class="chip-btn ${v === state.chip ? 'selected' : ''}" onclick="setChip(${v})">$${v}</button>`
  ).join('');
}

function renderLines() {
  const pass = document.getElementById('passLine');
  const removable = state.point === null && state.passLine > 0;
  pass.innerHTML = `
    <div class="title"><span>PASS LINE</span>${removable ? `<span class="mini-btn" onclick="event.stopPropagation();removePassLine()">X</span>` : ''}</div>
    <div class="amt-line"><span>${fmt(state.passLine)}</span></div>
    ${state.point !== null && state.passLine > 0 ? `
      <div class="amt-line">
        <span>Odds ${fmt(state.passOdds)} (max ${fmt(maxPassOdds(state.passLine, state.point))})</span>
        <span class="buttons">
          <span class="mini-btn" onclick="event.stopPropagation();addPassOdds()">+O</span>
          <span class="mini-btn" onclick="event.stopPropagation();removePassOdds()">-O</span>
        </span>
      </div>` : ''}
  `;
  pass.onclick = clickPassLine;

  const dont = document.getElementById('dontPass');
  if (dont) {
  const dremovable = state.point === null && state.dontPass > 0;
  dont.innerHTML = `
    <div class="title"><span>DON'T PASS</span>${dremovable ? `<span class="mini-btn" onclick="event.stopPropagation();removeDontPass()">X</span>` : ''}</div>
    <div class="amt-line"><span>${fmt(state.dontPass)}</span></div>
    ${state.point !== null && state.dontPass > 0 ? `
      <div class="amt-line">
        <span>Lay Odds ${fmt(state.dontPassOdds)} (max ${fmt(maxLayOdds(state.dontPass, state.point))})</span>
        <span class="buttons">
          <span class="mini-btn" onclick="event.stopPropagation();addDontPassOdds()">+O</span>
          <span class="mini-btn" onclick="event.stopPropagation();removeDontPassOdds()">-O</span>
        </span>
      </div>` : ''}
  `;
  dont.onclick = clickDontPass;
  }

  const come = document.getElementById('comeStrip');
  const comeRemovable = state.comeTransit > 0;
  come.innerHTML = `
    <div class="title"><span>COME</span>${comeRemovable ? `<span class="mini-btn" onclick="event.stopPropagation();removeComeTransit()">X</span>` : ''}</div>
    <div class="amt-line"><span>${fmt(state.comeTransit)}</span></div>
  `;
  come.onclick = clickCome;

  const dcome = document.getElementById('dontComeStrip');
  if (!dcome) return;
  const dcomeRemovable = state.dontComeTransit > 0;
  dcome.innerHTML = `
    <div class="title"><span>DON'T COME</span>${dcomeRemovable ? `<span class="mini-btn" onclick="event.stopPropagation();removeDontComeTransit()">X</span>` : ''}</div>
    <div class="amt-line"><span>${fmt(state.dontComeTransit)}</span></div>
  `;
  dcome.onclick = clickDontCome;
}

// Compact, read-only summary of one bet. Editing happens in the bet sheet so the
// controls can be full size instead of 17px wide.
function summaryLine(label, amount, working) {
  return `<div class="bet-line ${working ? '' : 'is-off'}">
    <span class="label">${label}</span><span class="val">${fmt(amount)}</span>
  </div>`;
}

function renderNumbers() {
  const row = document.getElementById('numberRow');
  row.classList.toggle('numbers-10', NUMS.length > 6);
  row.innerHTML = NUMS.map(n => {
    const box = state.numbers[n];
    const lines = [];
    const live = state.point !== null || state.comeOutWorking;
    if (box.place > 0) lines.push(summaryLine('Place', box.place, box.placeOn && live));
    if (box.buy > 0) lines.push(summaryLine('Buy', box.buy, box.buyOn && live));
    if (box.comeAmt > 0) lines.push(summaryLine('Come', box.comeAmt + box.comeOdds, box.comeOn));
    if (box.dcAmt > 0) lines.push(summaryLine('D.Come', box.dcAmt + box.dcOdds, box.dcOn));

    const isPoint = n === state.point;
    const body = lines.length
      ? `<div class="num-bets">${lines.join('')}</div>
         <button class="num-edit" onclick="event.stopPropagation();openBetSheet(${n})">EDIT</button>`
      : `<div class="num-empty">tap to bet</div>`;

    return `<div class="num-box ${isPoint ? 'is-point' : ''}">
      <button type="button" class="num-head" onclick="clickNumber(${n})" aria-label="Bet ${state.numMode === 'place' ? 'Place' : 'Buy'} ${n}, ${fmt(state.chip)}">${n}</button>
      ${isPoint ? `<div class="point-tag">POINT</div>` : ''}
      ${body}
    </div>`;
  }).join('');
}

// ---------- bet sheet ----------
let sheetNum = null;

function openBetSheet(n) {
  sheetNum = n;
  document.getElementById('betSheet').classList.remove('hidden');
  document.body.classList.add('sheet-open');
  renderBetSheet();
}

function closeBetSheet() {
  sheetNum = null;
  document.getElementById('betSheet').classList.add('hidden');
  document.body.classList.remove('sheet-open');
}

function sheetBet(name, amount, meta, actions) {
  return `<div class="sheet-bet">
    <div class="sheet-bet-head">
      <span class="sheet-bet-name">${name}</span>
      <span class="sheet-bet-amt">${fmt(amount)}</span>
    </div>
    ${meta ? `<div class="sheet-bet-meta">${meta}</div>` : ''}
    <div class="sheet-actions">${actions}</div>
  </div>`;
}

function workingBtn(n, field, on) {
  return `<button class="sheet-btn ${on ? 'on' : 'off'}" onclick="toggleOn(${n},'${field}')">${on ? 'WORKING' : 'OFF'}</button>`;
}

function renderBetSheet() {
  if (sheetNum === null) return;
  const n = sheetNum;
  const box = state.numbers[n];

  document.getElementById('sheetTitle').textContent =
    `Number ${n}${n === state.point ? ' — Point' : ''}`;

  const parts = [];

  if (box.place > 0) {
    const u = placeUnitFor(n) * unitScale();
    parts.push(sheetBet('Place', box.place, `Pays ${RULES.placeOddsStr[n]}. Press/Regress move it ${fmt(u)} at a time.`, `
      ${workingBtn(n, 'placeOn', box.placeOn)}
      <button class="sheet-btn" onclick="pressPlace(${n})">Press +${fmt(u)}</button>
      <button class="sheet-btn" onclick="regressPlace(${n})">Regress −${fmt(Math.min(u, box.place))}</button>
      <button class="sheet-btn danger" onclick="removePlace(${n})">Take down</button>`));
  }

  if (box.buy > 0) {
    parts.push(sheetBet('Buy', box.buy, 'Commission already paid — not refunded.', `
      ${workingBtn(n, 'buyOn', box.buyOn)}
      <button class="sheet-btn danger" onclick="removeBuy(${n})">Take down</button>`));
  }

  if (box.comeAmt > 0) {
    const max = maxPassOdds(box.comeAmt, n);
    parts.push(sheetBet('Come', box.comeAmt + box.comeOdds,
      `Base ${fmt(box.comeAmt)} · Odds ${fmt(box.comeOdds)} of ${fmt(max)} max`, `
      ${workingBtn(n, 'comeOn', box.comeOn)}
      <button class="sheet-btn" onclick="addComeOdds(${n})">+ Odds</button>
      <button class="sheet-btn" onclick="removeComeOdds(${n})" ${box.comeOdds > 0 ? '' : 'disabled'}>− Odds</button>`));
  }

  if (box.dcAmt > 0) {
    const max = maxLayOdds(box.dcAmt, n);
    parts.push(sheetBet("Don't Come", box.dcAmt + box.dcOdds,
      `Base ${fmt(box.dcAmt)} · Lay ${fmt(box.dcOdds)} of ${fmt(max)} max`, `
      ${workingBtn(n, 'dcOn', box.dcOn)}
      <button class="sheet-btn" onclick="addDontComeOdds(${n})">+ Lay</button>
      <button class="sheet-btn" onclick="removeDontComeOdds(${n})" ${box.dcOdds > 0 ? '' : 'disabled'}>− Lay</button>`));
  }

  if (!parts.length) parts.push(`<p class="sheet-empty">No bets on ${n} yet.</p>`);

  const mode = state.numMode === 'place' ? 'Place' : 'Buy';
  parts.push(`<div class="sheet-add">
    <div class="sheet-actions">
      <button class="sheet-btn" onclick="clickNumber(${n})">Add ${mode} ${fmt(state.chip)}</button>
    </div>
  </div>`);

  document.getElementById('sheetBody').innerHTML = parts.join('');
}

function renderOnetime() {
  const field = document.getElementById('field');
  field.innerHTML = `<div class="title">FIELD</div><div class="payline">2 pays ${RULES.fieldPayStr[2]}<br>12 pays ${RULES.fieldPayStr[12]}</div>
    <div class="amt">${fmt(state.field)}</div>
    ${state.field > 0 ? `<span class="mini-btn" onclick="event.stopPropagation();removeField()">X</span>` : ''}`;
  field.onclick = clickField;

  const seven = document.getElementById('anySeven');
  seven.innerHTML = `<div class="title">ANY SEVEN</div><div class="payline">pays ${RULES.anySevenPayStr}</div>
    <div class="amt">${fmt(state.anySeven)}</div>
    ${state.anySeven > 0 ? `<span class="mini-btn" onclick="event.stopPropagation();removeAnySeven()">X</span>` : ''}`;
  seven.onclick = clickAnySeven;

  const craps = document.getElementById('anyCraps');
  craps.innerHTML = `<div class="title">ANY CRAPS</div><div class="payline">pays ${RULES.anyCrapsPayStr}</div>
    <div class="amt">${fmt(state.anyCraps)}</div>
    ${state.anyCraps > 0 ? `<span class="mini-btn" onclick="event.stopPropagation();removeAnyCraps()">X</span>` : ''}`;
  craps.onclick = clickAnyCraps;
}

function renderHardways() {
  const row = document.getElementById('hardRow');
  row.innerHTML = HARD_NUMS.map(n => `
    <div class="bet-box" onclick="clickHard(${n})">
      <div class="title">HARD ${n}</div>
      <div class="payline">pays ${RULES.hardPay[n]}:1</div>
      <div class="amt">${fmt(state.hard[n])}</div>
      ${state.hard[n] > 0 ? `<span class="mini-btn" onclick="event.stopPropagation();removeHard(${n})">X</span>` : ''}
    </div>
  `).join('');
}

function renderLog() {
  const log = document.getElementById('log');
  log.innerHTML = state.log.slice().reverse().slice(0, 80).map(e =>
    `<div class="${e.cls}">${e.msg}</div>`
  ).join('');
}

// ---------- init ----------
window.addEventListener('DOMContentLoaded', () => {
  state = newState(0);

  document.getElementById('rollBtn').addEventListener('click', rollDice);
  document.getElementById('resetBtn').addEventListener('click', resetBankroll);
  document.getElementById('clearBetsBtn').addEventListener('click', clearAllBets);
  document.getElementById('toggleWorkingBtn').addEventListener('click', toggleAllWorking);
  document.querySelectorAll('input[name=numMode]').forEach(r => r.addEventListener('change', e => setNumMode(e.target.value)));
  document.getElementById('afterWin').addEventListener('change', e => { state.afterWin = e.target.value; });
  document.getElementById('comeOutWorking').addEventListener('change', e => { state.comeOutWorking = e.target.checked; render(); });
  document.getElementById('rebetBtn').addEventListener('click', rebetLayout);
  document.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => applyPreset(b.dataset.preset)));
  const molly = document.getElementById('mollyBtn');
  if (molly) molly.addEventListener('click', mollyStep);

  document.getElementById('sheetClose').addEventListener('click', closeBetSheet);
  document.getElementById('sheetBackdrop').addEventListener('click', closeBetSheet);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheetNum !== null) closeBetSheet(); });

  // Swipe the sheet down to dismiss
  const sheet = document.querySelector('#betSheet .sheet');
  let touchStartY = null;
  sheet.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchend', e => {
    if (touchStartY !== null && e.changedTouches[0].clientY - touchStartY > 70) closeBetSheet();
    touchStartY = null;
  }, { passive: true });

  showOverlay({
    title: `Welcome to ${RULES.gameName}`,
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
