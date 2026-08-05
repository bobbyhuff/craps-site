const NUMS = [4, 5, 6, 8, 9, 10];
const CHIPS = [1, 5, 10, 25, 50, 100, 250];

// true-odds win ratios [num,den] and place-bet ratios (no vig)
const TRUE_ODDS = { 4: [2, 1], 10: [2, 1], 5: [3, 2], 9: [3, 2], 6: [6, 5], 8: [6, 5] };
const PLACE_ODDS = { 4: [9, 5], 10: [9, 5], 5: [7, 5], 9: [7, 5], 6: [7, 6], 8: [7, 6] };
// standard "3-4-5x" table max-odds multipliers
const ODDS_MULT = { 4: 3, 10: 3, 5: 4, 9: 4, 6: 5, 8: 5 };
const HARD_PAY = { 4: 7, 6: 9, 8: 9, 10: 7 };
const DIE_FACE = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' };

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
  const numbers = {};
  NUMS.forEach(n => numbers[n] = freshNumberBox());
  return {
    bankroll, startBankroll: bankroll,
    chip: 10, numMode: 'place', letItRide: false,
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

// ---------- odds math ----------
function maxPassOdds(base, point) { return base * ODDS_MULT[point]; }
function maxLayOdds(base, point) {
  const [n, d] = TRUE_ODDS[point];
  return base * ODDS_MULT[point] * (n / d);
}
function layWin(amount, point) {
  const [n, d] = TRUE_ODDS[point];
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
    const commission = Math.max(1, Math.ceil(state.chip * 0.05));
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
  [4, 6, 8, 10].forEach(n => { credit(state.hard[n]); state.hard[n] = 0; });
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
  state.rollHistory.push({ d1, d2, total });
  const pointWasOn = state.point !== null;

  resolveOneRoll(total);
  resolveHardways(d1, d2, total);

  // come / don't-come point bets resolve every roll, independent of the pass line's phase
  for (const n of NUMS) {
    const box = state.numbers[n];
    if (box.comeAmt > 0 && box.comeOn) {
      if (total === n) winComePoint(n);
      else if (total === 7) loseComePoint(n);
    }
    if (box.dcAmt > 0 && box.dcOn) {
      if (total === n) loseDontComePoint(n);
      else if (total === 7) winDontComePoint(n);
    }
  }

  // place / buy bets resolve every roll if working; an off bet is refunded only when the shooter's hand truly ends
  for (const n of NUMS) {
    const box = state.numbers[n];
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
    if (total === 7 || total === 11) resolvePassLineComeOut(total);
    else if ([2, 3, 12].includes(total)) resolvePassLineComeOut(total);
    else { state.point = total; log(`Point is now ${total}.`, 'neutral'); }
  } else {
    if (total === 7) {
      resolveSevenOut(state.point);
      state.point = null;
    } else if (total === state.point) {
      resolvePassLinePointMade(state.point);
      state.point = null;
    }
  }

  state.rolls++;
  render();
}

function resolveOneRoll(total) {
  if (state.field > 0) {
    if (total === 2) { const w = state.field * 2; credit(state.field + w); log(`Field wins ${fmt(w)} (2 pays double).`, 'win'); }
    else if (total === 12) { const w = state.field * 3; credit(state.field + w); log(`Field wins ${fmt(w)} (12 pays triple).`, 'win'); }
    else if ([3, 4, 9, 10, 11].includes(total)) { credit(state.field * 2); log(`Field wins ${fmt(state.field)}.`, 'win'); }
    else { log(`Field loses ${fmt(state.field)}.`, 'lose'); }
    state.field = 0;
  }
  if (state.anySeven > 0) {
    if (total === 7) { const w = state.anySeven * 4; credit(state.anySeven + w); log(`Any Seven wins ${fmt(w)}!`, 'win'); }
    else { log(`Any Seven loses ${fmt(state.anySeven)}.`, 'lose'); }
    state.anySeven = 0;
  }
  if (state.anyCraps > 0) {
    if ([2, 3, 12].includes(total)) { const w = state.anyCraps * 7; credit(state.anyCraps + w); log(`Any Craps wins ${fmt(w)}!`, 'win'); }
    else { log(`Any Craps loses ${fmt(state.anyCraps)}.`, 'lose'); }
    state.anyCraps = 0;
  }
}

function resolveHardways(d1, d2, total) {
  for (const n of [4, 6, 8, 10]) {
    const amt = state.hard[n];
    if (amt <= 0) continue;
    if (total === 7) { log(`Hard ${n} loses ${fmt(amt)} (seven).`, 'lose'); state.hard[n] = 0; }
    else if (total === n && d1 === d2) {
      const w = amt * HARD_PAY[n]; credit(amt + w); log(`Hard ${n} wins ${fmt(w)}!`, 'win');
      if (!state.letItRide) state.hard[n] = 0;
    }
    else if (total === n && d1 !== d2) { log(`Hard ${n} loses ${fmt(amt)} (easy ${n}).`, 'lose'); state.hard[n] = 0; }
  }
}

function winComePoint(n) {
  const box = state.numbers[n];
  const amt = box.comeAmt;
  credit(amt * 2);
  let extra = 0;
  if (box.comeOdds > 0) { extra = payout(box.comeOdds, TRUE_ODDS[n]); credit(box.comeOdds + extra); }
  log(`Come ${n} wins ${fmt(amt)}${extra ? ` + odds ${fmt(extra)}` : ''}.`, 'win');
  box.comeAmt = 0; box.comeOdds = 0;
}
function loseComePoint(n) {
  const box = state.numbers[n];
  log(`Come ${n} loses ${fmt(box.comeAmt + box.comeOdds)}.`, 'lose');
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
  const box = state.numbers[n]; const w = payout(box.place, PLACE_ODDS[n]); credit(box.place + w);
  log(`Place ${n} wins ${fmt(w)}.`, 'win');
  if (!state.letItRide) box.place = 0;
}
function losePlace(n) { const box = state.numbers[n]; log(`Place ${n} loses ${fmt(box.place)}.`, 'lose'); box.place = 0; }
function winBuy(n) {
  const box = state.numbers[n]; const w = payout(box.buy, TRUE_ODDS[n]); credit(box.buy + w);
  log(`Buy ${n} wins ${fmt(w)}.`, 'win');
  if (!state.letItRide) box.buy = 0;
}
function loseBuy(n) { const box = state.numbers[n]; log(`Buy ${n} loses ${fmt(box.buy)}.`, 'lose'); box.buy = 0; }

function migrateTransit(total) {
  if (state.comeTransit > 0) {
    if (total === 7 || total === 11) { credit(state.comeTransit * 2); log(`Come bet wins ${fmt(state.comeTransit)} (${total}).`, 'win'); state.comeTransit = 0; }
    else if ([2, 3, 12].includes(total)) { log(`Come bet loses (${total}).`, 'lose'); state.comeTransit = 0; }
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
  if (total === 7 || total === 11) {
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
  if (state.passOdds > 0) { const w = payout(state.passOdds, TRUE_ODDS[point]); credit(state.passOdds + w); log(`Odds win ${fmt(w)}.`, 'win'); state.passOdds = 0; }
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
  document.getElementById('bankroll').textContent = fmt(state.bankroll);
  const net = Math.round((state.bankroll - state.startBankroll) * 100) / 100;
  const netEl = document.getElementById('net');
  netEl.textContent = fmt(net);
  netEl.className = net >= 0 ? 'positive' : 'negative';
  document.getElementById('pointDisplay').textContent = state.point ?? 'OFF (come-out)';

  renderRollDisplay();
  renderChips();
  renderLines();
  renderNumbers();
  renderOnetime();
  renderHardways();
  renderLog();
  renderBetSheet();

  document.querySelector(`input[name=numMode][value=${state.numMode}]`).checked = true;
  document.getElementById('letItRide').checked = state.letItRide;
  document.getElementById('toggleWorkingBtn').textContent = anyWorkingBetsOn() ? 'Bets Off' : 'Bets On';
}

function renderRollDisplay() {
  const last = state.rollHistory[state.rollHistory.length - 1];
  document.getElementById('die1').textContent = last ? DIE_FACE[last.d1] : '-';
  document.getElementById('die2').textContent = last ? DIE_FACE[last.d2] : '-';
  document.getElementById('rollTotal').textContent = last ? `Total: ${last.total}` : 'Roll the dice to begin';

  const hist = document.getElementById('rollHistory');
  hist.innerHTML = state.rollHistory.slice(-10).reverse().map(r =>
    `<div class="roll-chip ${r.total === 7 ? 'seven' : ''}">${r.total}</div>`
  ).join('');
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

  const come = document.getElementById('comeStrip');
  const comeRemovable = state.comeTransit > 0;
  come.innerHTML = `
    <div class="title"><span>COME</span>${comeRemovable ? `<span class="mini-btn" onclick="event.stopPropagation();removeComeTransit()">X</span>` : ''}</div>
    <div class="amt-line"><span>${fmt(state.comeTransit)}</span></div>
  `;
  come.onclick = clickCome;

  const dcome = document.getElementById('dontComeStrip');
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
  row.innerHTML = NUMS.map(n => {
    const box = state.numbers[n];
    const lines = [];
    if (box.place > 0) lines.push(summaryLine('Place', box.place, box.placeOn));
    if (box.buy > 0) lines.push(summaryLine('Buy', box.buy, box.buyOn));
    if (box.comeAmt > 0) lines.push(summaryLine('Come', box.comeAmt + box.comeOdds, box.comeOn));
    if (box.dcAmt > 0) lines.push(summaryLine('D.Come', box.dcAmt + box.dcOdds, box.dcOn));

    const isPoint = n === state.point;
    const body = lines.length
      ? `<div class="num-bets">${lines.join('')}</div>
         <button class="num-edit" onclick="event.stopPropagation();openBetSheet(${n})">EDIT</button>`
      : `<div class="num-empty">tap to bet</div>`;

    return `<div class="num-box ${isPoint ? 'is-point' : ''}">
      <div class="num-head" onclick="clickNumber(${n})">${n}</div>
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
    parts.push(sheetBet('Place', box.place, null, `
      ${workingBtn(n, 'placeOn', box.placeOn)}
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
  field.innerHTML = `<div class="title">FIELD</div><div class="payline">2 pays 2:1, 12 pays 3:1</div>
    <div class="amt">${fmt(state.field)}</div>
    ${state.field > 0 ? `<span class="mini-btn" onclick="event.stopPropagation();removeField()">X</span>` : ''}`;
  field.onclick = clickField;

  const seven = document.getElementById('anySeven');
  seven.innerHTML = `<div class="title">ANY SEVEN</div><div class="payline">pays 4:1</div>
    <div class="amt">${fmt(state.anySeven)}</div>
    ${state.anySeven > 0 ? `<span class="mini-btn" onclick="event.stopPropagation();removeAnySeven()">X</span>` : ''}`;
  seven.onclick = clickAnySeven;

  const craps = document.getElementById('anyCraps');
  craps.innerHTML = `<div class="title">ANY CRAPS</div><div class="payline">pays 7:1</div>
    <div class="amt">${fmt(state.anyCraps)}</div>
    ${state.anyCraps > 0 ? `<span class="mini-btn" onclick="event.stopPropagation();removeAnyCraps()">X</span>` : ''}`;
  craps.onclick = clickAnyCraps;
}

function renderHardways() {
  const row = document.getElementById('hardRow');
  row.innerHTML = [4, 6, 8, 10].map(n => `
    <div class="bet-box" onclick="clickHard(${n})">
      <div class="title">HARD ${n}</div>
      <div class="payline">pays ${HARD_PAY[n]}:1</div>
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
  document.getElementById('rollBtnTop').addEventListener('click', rollDice);
  document.getElementById('resetBtn').addEventListener('click', resetBankroll);
  document.getElementById('clearBetsBtn').addEventListener('click', clearAllBets);
  document.getElementById('toggleWorkingBtn').addEventListener('click', toggleAllWorking);
  document.querySelectorAll('input[name=numMode]').forEach(r => r.addEventListener('change', e => setNumMode(e.target.value)));
  document.getElementById('letItRide').addEventListener('change', e => { state.letItRide = e.target.checked; });

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
    title: "Welcome to Craps",
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
