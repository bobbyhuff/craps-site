// Standard craps regression tests for the shared engine, including the
// fixes and features added alongside Crapless: after-win handling (the old
// "let it ride" double-credit bug), Press, come-out-off defaults, presets
// and Rebet. Run with `npm test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadCraps, DICE, HARD } = require('./craps-harness.js');

function setPoint(g, n) { g.roll(...DICE[n]); assert.equal(g.state.point, n); }

test('standard come-out: 7/11 win, 2/3/12 lose, Don\'t Pass bars 12', () => {
  for (const [n, delta] of [[7, 10], [11, 10], [2, -10], [3, -10], [12, -10]]) {
    const g = loadCraps('standard');
    g.run('state.chip = 10; clickPassLine();');
    g.roll(...DICE[n]);
    assert.equal(g.state.bankroll, 1000 + delta, `come-out ${n}`);
    assert.equal(g.state.point, null);
  }
  const g = loadCraps('standard');
  g.run('state.chip = 10; clickDontPass();');
  g.roll(6, 6);
  assert.equal(g.state.bankroll, 1000); // push
});

test('standard ruleset keeps its six point numbers and Don\'t bets', () => {
  const g = loadCraps('standard');
  assert.deepEqual(Array.from(g.rules.pointNumbers), [4, 5, 6, 8, 9, 10]);
  assert.equal(g.rules.dontBets, true);
  assert.equal(g.rules.variant, 'standard');
});

test('after a win, "leave up" credits only the winnings (no double-credit)', () => {
  const g = loadCraps('standard');
  g.run("state.afterWin = 'up'; state.chip = 6; clickNumber(6);");
  setPoint(g, 4);
  g.roll(...DICE[6]);
  assert.equal(g.state.numbers[6].place, 6, 'bet stays up');
  assert.equal(g.state.bankroll, 1000 - 6 + 7, 'only the $7 win is credited');
  g.run('clearAllBets();');
  assert.equal(g.state.bankroll, 1007);
});

test('"take down" returns bet plus winnings', () => {
  const g = loadCraps('standard');
  g.run('state.chip = 6; clickNumber(8);');
  setPoint(g, 4);
  g.roll(...DICE[8]);
  assert.equal(g.state.numbers[8].place, 0);
  assert.equal(g.state.bankroll, 1007);
});

test('press adds winnings in whole units, never more than doubling', () => {
  const g = loadCraps('standard');
  g.run("state.afterWin = 'press'; state.chip = 6; clickNumber(6);");
  setPoint(g, 4);
  g.roll(...DICE[6]); // wins $7: press $6, collect $1
  assert.equal(g.state.numbers[6].place, 12);
  assert.equal(g.state.bankroll, 1000 - 6 + 1);

  const h = loadCraps('standard');
  h.run("state.afterWin = 'press'; state.chip = 5; clickHard(8);");
  setPoint(h, 4);
  h.roll(...HARD[8]); // hard 8 wins $45: press to $10, collect $40
  assert.equal(h.state.hard[8], 10);
  assert.equal(h.state.bankroll, 1000 - 5 + 40);
});

test('Place, Buy and Hardways are off on the come-out by default', () => {
  const g = loadCraps('standard');
  g.run('state.chip = 6; clickNumber(6); clickNumber(8); state.chip = 5; clickHard(4);');
  g.roll(3, 4); // come-out 7: nothing comes down
  assert.equal(g.state.numbers[6].place, 6);
  assert.equal(g.state.hard[4], 5);
  assert.equal(g.state.bankroll, 983);
  g.roll(...DICE[6]); // come-out 6: sets the point, place 6 not paid
  assert.equal(g.state.bankroll, 983);
  g.roll(...DICE[8]); // point is on now: Place 8 pays
  assert.equal(g.state.bankroll, 983 + 6 + 7);
});

test('calling bets working on the come-out', () => {
  const g = loadCraps('standard');
  g.run('state.comeOutWorking = true; state.chip = 6; clickNumber(6);');
  g.roll(3, 4);
  assert.equal(g.state.numbers[6].place, 0);
  assert.equal(g.state.bankroll, 994);
});

test('Come odds are returned when a come-out 7 takes the flat bet', () => {
  const g = loadCraps('standard');
  g.run('state.chip = 10; clickPassLine();');
  setPoint(g, 4);
  g.run('clickCome();');
  g.roll(...DICE[5]); // come moves to 5
  g.run('addComeOdds(5);');
  g.roll(...DICE[4]); // point made, back to come-out
  const before = g.state.bankroll;
  g.roll(3, 4); // come-out 7: come flat loses, odds ($10) returned
  assert.equal(g.state.bankroll, before + 10);
});

test('presets top up to one unit and never double up', () => {
  const g = loadCraps('standard');
  g.run("state.chip = 5; applyPreset('inside'); applyPreset('inside');");
  const s = g.state;
  assert.deepEqual([5, 6, 8, 9].map(n => s.numbers[n].place), [5, 6, 6, 5]);
  assert.equal(s.bankroll, 978);
  g.run("state.chip = 25; applyPreset('place68');");
  assert.equal(g.state.numbers[6].place, 30);
  g.run("applyPreset('ironCross');");
  assert.equal(g.state.field, 25);
});

test('Three-Point Molly step builds Pass + max odds + two Come bets', () => {
  const g = loadCraps('standard');
  g.run('state.chip = 5; mollyStep();');
  assert.equal(g.state.passLine, 5);
  setPoint(g, 6);
  g.run('mollyStep();');
  assert.equal(g.state.passOdds, 25);
  assert.equal(g.state.comeTransit, 5);
  g.roll(...DICE[9]);
  g.run('mollyStep();');
  assert.equal(g.state.numbers[9].comeOdds, 20);
  assert.equal(g.state.comeTransit, 5);
});

test('Rebet restores the layout from before the seven-out', () => {
  const g = loadCraps('standard');
  g.run('state.chip = 10; clickPassLine(); state.chip = 6; clickNumber(6); clickNumber(8);');
  setPoint(g, 5);
  g.roll(3, 4); // seven out
  assert.equal(g.state.numbers[6].place, 0);
  const plan = g.run('rebetPlan()');
  assert.equal(plan.cost, 22);
  g.run('rebetLayout();');
  assert.equal(g.state.passLine, 10);
  assert.equal(g.state.numbers[8].place, 6);
});

test('simulation: dice totals follow the 36-way distribution', () => {
  const g = loadCraps('standard', 12345);
  const counts = g.run(`
    state.bankroll = 0;
    const c = {}; for (let t = 2; t <= 12; t++) c[t] = 0;
    for (let i = 0; i < 72000; i++) { rollDice(); }
    state.stats.totals;`);
  const WAYS = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };
  for (let t = 2; t <= 12; t++) {
    const expected = 72000 * WAYS[t] / 36;
    assert.ok(Math.abs(counts[t] - expected) < 5 * Math.sqrt(expected), `total ${t}: ${counts[t]} vs ${expected}`);
  }
});
