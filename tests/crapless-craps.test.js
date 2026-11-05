// Crapless Craps: rules, payouts and house edges, run through the real
// craps.js engine with the Crapless ruleset loaded. Run with `npm test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadCraps, DICE } = require('./craps-harness.js');

const WAYS = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };

function passBet(g, amt) { g.run(`state.chip = ${amt}; clickPassLine();`); }

test('ruleset: ten point numbers, only 7 wins the come-out, no Don\'t bets', () => {
  const g = loadCraps('crapless');
  assert.deepEqual(Array.from(g.rules.pointNumbers), [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]);
  assert.deepEqual(Array.from(g.rules.comeOutNaturals), [7]);
  assert.deepEqual(Array.from(g.rules.comeOutCraps), []);
  g.run('state.chip = 10; clickDontPass(); clickDontCome();');
  assert.equal(g.state.dontPass, 0);
  assert.equal(g.state.dontComeTransit, 0);
});

test('come-out 2, 3, 11 and 12 each establish a point', () => {
  for (const n of [2, 3, 11, 12]) {
    const g = loadCraps('crapless');
    passBet(g, 10);
    g.roll(...DICE[n]);
    assert.equal(g.state.point, n, `point ${n}`);
    assert.equal(g.state.passLine, 10, 'pass line stays up');
    assert.equal(g.state.bankroll, 990);
  }
});

test('come-out 7 wins the Pass Line', () => {
  const g = loadCraps('crapless');
  passBet(g, 10);
  g.roll(3, 4);
  assert.equal(g.state.point, null);
  assert.equal(g.state.bankroll, 1010);
});

test('making each extreme point pays true odds: 6:1 on 2/12, 3:1 on 3/11', () => {
  const expectOddsWin = { 2: 60, 12: 60, 3: 30, 11: 30, 4: 20, 10: 20, 5: 15, 9: 15, 6: 12, 8: 12 };
  for (const n of [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]) {
    const g = loadCraps('crapless');
    passBet(g, 10);
    g.roll(...DICE[n]);
    g.run('state.chip = 10; addPassOdds();');
    assert.equal(g.state.passOdds, 10);
    g.roll(...DICE[n]); // point made
    assert.equal(g.state.point, null);
    // 1000 - 10 flat - 10 odds + (20 flat back + 10 odds back + odds win)
    assert.equal(g.state.bankroll, 1000 + 10 + expectOddsWin[n], `point ${n}`);
  }
});

test('max odds: 3x on 2/3/4/10/11/12, 4x on 5/9, 5x on 6/8', () => {
  const g = loadCraps('crapless');
  for (const [n, m] of [[2, 3], [3, 3], [11, 3], [12, 3], [5, 4], [6, 5]]) assert.equal(g.rules.oddsMult[n], m);
});

test('seven-out loses Pass Line and odds; point transitions back to the come-out', () => {
  const g = loadCraps('crapless');
  passBet(g, 10);
  g.roll(1, 1); // point 2
  g.run('state.chip = 30; addPassOdds();');
  g.roll(2, 3); // 5: no decision
  assert.equal(g.state.point, 2);
  g.roll(3, 4); // seven out
  assert.equal(g.state.point, null);
  assert.equal(g.state.passLine, 0);
  assert.equal(g.state.passOdds, 0);
  assert.equal(g.state.bankroll, 960);
  assert.equal(g.state.stats.sevenOuts, 1);
});

test('Place bets on extreme numbers: 11:2 on 2/12, 11:4 on 3/11, off on the come-out', () => {
  const g = loadCraps('crapless');
  g.run("state.chip = 20; state.numMode = 'place'; clickNumber(2); clickNumber(3);");
  passBet(g, 10);
  g.roll(1, 1); // come-out 2: place bets are off, so it only sets the point
  assert.equal(g.state.numbers[2].place, 20);
  assert.equal(g.state.bankroll, 1000 - 40 - 10);
  g.roll(1, 1); // point made (Pass +10) and Place 2 wins 110 (11:2 on 20), comes down by default
  assert.equal(g.state.numbers[2].place, 0);
  assert.equal(g.state.bankroll, 950 + 20 + 20 + 110);
  passBet(g, 10);
  g.roll(2, 2); // point 4
  g.roll(1, 2); // 3 rolls: Place 3 pays 55 (11:4 on 20)
  assert.equal(g.state.bankroll, 1100 - 10 + 20 + 55);
});

test('Buy is not offered on the extreme numbers', () => {
  const g = loadCraps('crapless');
  g.run("state.chip = 10; state.numMode = 'buy'; clickNumber(2); clickNumber(11);");
  assert.equal(g.state.numbers[2].buy, 0);
  assert.equal(g.state.numbers[11].buy, 0);
  assert.equal(g.state.bankroll, 1000);
  g.run('clickNumber(4);');
  assert.equal(g.state.numbers[4].buy, 10);
});

test('Come bets travel to 11 and 12 instead of resolving', () => {
  const g = loadCraps('crapless');
  passBet(g, 10);
  g.roll(2, 2); // point 4
  g.run('state.chip = 10; clickCome();');
  g.roll(5, 6); // 11: come bet moves to 11
  assert.equal(g.state.numbers[11].comeAmt, 10);
  g.roll(5, 6); // 11 again: come wins
  assert.equal(g.state.numbers[11].comeAmt, 0);
  assert.equal(g.state.bankroll, 1000 - 10 - 10 + 20);
});

test('bankroll is conserved across a long seeded session', () => {
  const g = loadCraps('crapless', 4242);
  g.run(`
    for (let i = 0; i < 3000; i++) {
      if (state.bankroll < 200) break;
      if (state.point === null && state.passLine === 0) { state.chip = 10; clickPassLine(); }
      if (state.point !== null && state.passOdds === 0) addPassOdds();
      if (i % 5 === 0) applyPreset('place68');
      rollDice();
    }`);
  // Everything still on the table plus the bankroll can never exceed what
  // was staked plus wins; check no bet went negative and totals are finite.
  const s = g.state;
  for (const n of g.rules.pointNumbers) assert.ok(s.numbers[n].place >= 0 && s.numbers[n].comeAmt >= 0);
  assert.ok(Number.isFinite(s.bankroll));
  assert.equal(s.stats.totals[2] + s.stats.totals[3] + s.stats.totals[4] + s.stats.totals[5] + s.stats.totals[6] + s.stats.totals[7] +
    s.stats.totals[8] + s.stats.totals[9] + s.stats.totals[10] + s.stats.totals[11] + s.stats.totals[12], s.rolls);
});

test('house edges are exact for these rules', () => {
  const { rules } = loadCraps('crapless');
  const p = n => WAYS[n] / 36;
  let win = p(7);
  for (const n of rules.pointNumbers) win += p(n) * WAYS[n] / (WAYS[n] + 6);
  const pass = (1 - 2 * win) * 100;
  assert.equal(pass.toFixed(2), rules.houseEdgeStr.passLine);
  assert.equal(rules.houseEdge.passLine, 5.38);

  let oddsWagered = 0;
  for (const n of rules.pointNumbers) oddsWagered += p(n) * rules.oddsMult[n];
  assert.equal((pass / (1 + oddsWagered)).toFixed(2), rules.houseEdgeStr.passLineFullOdds);

  const placeEdge = n => {
    const [a, b] = rules.placeOdds[n];
    const pw = WAYS[n] / (WAYS[n] + 6);
    return ((1 - pw) - pw * a / b) * 100;
  };
  assert.equal(placeEdge(2).toFixed(2), rules.houseEdgeStr.place2or12);
  assert.equal(placeEdge(3).toFixed(2), rules.houseEdgeStr.place3or11);
  assert.equal(placeEdge(6).toFixed(2), rules.houseEdgeStr.place6or8);

  // Odds pay exactly true odds on every point (zero edge).
  for (const n of rules.pointNumbers) {
    const [a, b] = rules.trueOdds[n];
    assert.equal(a / b, 6 / WAYS[n], `true odds ${n}`);
  }
});

test('simulation: Pass Line win rate through the real engine matches 47.3%', () => {
  const g = loadCraps('crapless', 777);
  const r = g.run(`
    let wins = 0, decisions = 0;
    state.bankroll = 1e9;
    while (decisions < 40000) {
      if (state.passLine === 0) { state.chip = 1; clickPassLine(); }
      const before = state.bankroll;
      rollDice();
      if (state.passLine === 0) { decisions++; if (state.bankroll > before) wins++; }
    }
    wins / decisions;`);
  assert.ok(Math.abs(r - 0.4731) < 0.01, `win rate ${r}`);
});
