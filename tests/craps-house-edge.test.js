// Recomputes every standard-craps house edge published in src/_data/odds.js
// from the 36-combination dice distribution, so a typo in the data file
// (which feeds the strategy pages) fails the build. Run with `npm test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const ODDS = require('../src/_data/odds.js');

const WAYS = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };
const p = n => WAYS[n] / 36;
const POINTS = [4, 5, 6, 8, 9, 10];
const pct = x => (x * 100).toFixed(2);
// P(point n repeats before a 7)
const make = n => WAYS[n] / (WAYS[n] + 6);

test('Pass Line, Don\'t Pass and their full-odds blends', () => {
  let passWin = p(7) + p(11);
  for (const n of POINTS) passWin += p(n) * make(n);
  const pass = 1 - 2 * passWin; // per bet
  assert.equal(pct(pass), ODDS.houseEdgeStr.passLine);

  // Don't Pass: wins on 2/3, pushes on 12, loses on 7/11, reverses points.
  let dpWin = p(2) + p(3), dpLose = p(7) + p(11);
  for (const n of POINTS) { dpWin += p(n) * (1 - make(n)); dpLose += p(n) * make(n); }
  const dp = dpLose - dpWin;
  assert.equal(pct(dp), ODDS.houseEdgeStr.dontPass);

  // Odds are taken only when a point is set; zero edge, so the blend is
  // flat-bet loss / average total wagered.
  let avgOdds = 0, avgSingle = 0;
  for (const n of POINTS) { avgOdds += p(n) * ODDS.oddsMult[n]; avgSingle += p(n); }
  assert.equal(pct(pass / (1 + avgOdds)), ODDS.houseEdgeStr.passLineFullOdds);
  assert.equal(pct(pass / (1 + avgSingle)), ODDS.houseEdgeStr.passLineSingleOdds);

  // Lay odds to win 3-4-5x the flat bet = lay 6x on every point.
  let avgLay = 0;
  for (const n of POINTS) {
    const [a, b] = ODDS.trueOdds[n];
    avgLay += p(n) * ODDS.oddsMult[n] * a / b;
  }
  assert.equal(pct(dp / (1 + avgLay)), ODDS.houseEdgeStr.dontPassFullOdds);
});

test('Place, Field, props and hardways', () => {
  const place = n => { const [a, b] = ODDS.placeOdds[n]; return (1 - make(n)) - make(n) * a / b; };
  assert.equal(pct(place(6)), ODDS.houseEdgeStr.place6or8);
  assert.equal(pct(place(5)), ODDS.houseEdgeStr.place5or9);
  assert.equal(pct(place(4)), ODDS.houseEdgeStr.place4or10);

  // Buy 4: true odds, 5% commission paid up front on the flat bet; edge per
  // total (bet + commission).
  const vig = ODDS.buyCommissionPct / 100;
  const buyEv = make(4) * 2 - (1 - make(4)) - vig;
  assert.equal(pct(-buyEv / (1 + vig)), ODDS.houseEdgeStr.buy4or10);

  let field = -(p(5) + p(6) + p(7) + p(8));
  for (const n of [3, 4, 9, 10, 11]) field += p(n);
  field += p(2) * ODDS.fieldPay[2][0] / ODDS.fieldPay[2][1] + p(12) * ODDS.fieldPay[12][0] / ODDS.fieldPay[12][1];
  assert.equal(pct(-field), ODDS.houseEdgeStr.field);

  const oneRoll = (pw, [a, b]) => -(pw * a / b - (1 - pw));
  assert.equal(pct(oneRoll(p(7), ODDS.anySevenPay)), ODDS.houseEdgeStr.anySeven);
  assert.equal(pct(oneRoll(p(2) + p(3) + p(12), ODDS.anyCrapsPay)), ODDS.houseEdgeStr.anyCraps);

  // Hardway n wins on the 1 hard combination, loses on 7 or an easy n.
  const hard = n => { const easy = WAYS[n] - 1; const pw = 1 / (1 + easy + 6); return -(pw * ODDS.hardPay[n] - (1 - pw)); };
  assert.equal(pct(hard(6)), ODDS.houseEdgeStr.hard6or8);
  assert.equal(pct(hard(4)), ODDS.houseEdgeStr.hard4or10);
});

test('reference bets the table does not offer', () => {
  const R = ODDS.referenceBets;
  // Big 6: even money on 6 before 7.
  assert.equal(pct(-(make(6) - (1 - make(6)))), R.big6or8.houseEdgeStr);
  const oneRoll = (pw, [a, b]) => -(pw * a / b - (1 - pw));
  assert.equal(pct(oneRoll(p(11), R.yo.pay)), R.yo.houseEdgeStr);
  assert.equal(pct(oneRoll(p(12), R.twoOrTwelve.pay)), R.twoOrTwelve.houseEdgeStr);
});
