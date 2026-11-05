// Crapless Craps payouts and rules. Builds on odds.js instead of copying it,
// so every bet the two games share (Field, Any Seven, Any Craps, Hardways,
// Buy commission, point-number payouts) can never drift between them.
//
// Isomorphic like every other _data file:
//   1. Eleventy: available in templates as `craplessOdds`. require() pulls in
//      odds.js for the shared numbers.
//   2. Browser: /games/crapless-craps/index.njk loads /games/craps/odds.js
//      first (the global ODDS object), then this file as
//      /games/crapless-craps/odds.js, which exposes window.CRAPLESS_ODDS.
//      craps.js uses CRAPLESS_ODDS when it is present, ODDS otherwise.
//
// The ruleset 0stakes implements (the common "Never Ever Craps" version):
//   - Come-out: only 7 wins. Every other total (2, 3, 4, 5, 6, 8, 9, 10, 11,
//     12) becomes the point, so the Pass Line can never lose on the come-out.
//   - 11 is a point, not a winner. Giving up the come-out 11 is the main
//     reason the Pass Line edge jumps from 1.41% to 5.38%.
//   - No Don't Pass / Don't Come: there are no craps numbers to win on.
//   - Place bets on all ten numbers; Buy bets on 4, 5, 6, 8, 9, 10 only.

const CRAPLESS_BASE = (typeof module !== 'undefined' && typeof require === 'function')
  ? require('./odds.js')
  : ODDS; // the standard craps global, loaded first

function craplessRatioStr(pair) { return `${pair[0]}:${pair[1]}`; }
function craplessMapRatios(obj) {
  const out = {};
  for (const k in obj) out[k] = craplessRatioStr(obj[k]);
  return out;
}

const CRAPLESS_ODDS = Object.assign({}, CRAPLESS_BASE, {
  variant: 'crapless',
  gameName: 'Crapless Craps',
  pointNumbers: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12],
  comeOutNaturals: [7],
  comeOutCraps: [],
  dontBets: false,
  buyNumbers: [4, 5, 6, 8, 9, 10],

  // True odds for the four extra points: 2/12 have 1 way vs. 6 ways to roll
  // a 7 (6:1); 3/11 have 2 ways vs. 6 (3:1).
  trueOdds: Object.assign({}, CRAPLESS_BASE.trueOdds, { 2: [6, 1], 12: [6, 1], 3: [3, 1], 11: [3, 1] }),

  // Standard crapless Place payouts on the extra numbers.
  placeOdds: Object.assign({}, CRAPLESS_BASE.placeOdds, { 2: [11, 2], 12: [11, 2], 3: [11, 4], 11: [11, 4] }),

  // Max odds: 3x on 2, 3, 4, 10, 11, 12; 4x on 5/9; 5x on 6/8.
  oddsMult: Object.assign({}, CRAPLESS_BASE.oddsMult, { 2: 3, 12: 3, 3: 3, 11: 3 }),

  placeUnit: Object.assign({}, CRAPLESS_BASE.placeUnit, { 2: 5, 12: 5, 3: 5, 11: 5 }),

  // Exact figures for these rules (verified in tests/crapless-craps.test.js
  // from the 36-combination dice distribution).
  houseEdge: Object.assign({}, CRAPLESS_BASE.houseEdge, {
    passLine: 5.38,
    passLineFullOdds: 1.26, // per total wagered, flat + max odds above
    place2or12: 7.14,
    place3or11: 6.25,
  }),
});

CRAPLESS_ODDS.trueOddsStr = craplessMapRatios(CRAPLESS_ODDS.trueOdds);
CRAPLESS_ODDS.placeOddsStr = craplessMapRatios(CRAPLESS_ODDS.placeOdds);
CRAPLESS_ODDS.houseEdgeStr = {};
for (const k in CRAPLESS_ODDS.houseEdge) CRAPLESS_ODDS.houseEdgeStr[k] = CRAPLESS_ODDS.houseEdge[k].toFixed(2);

if (typeof module !== 'undefined') module.exports = CRAPLESS_ODDS;
if (typeof window !== 'undefined') window.CRAPLESS_ODDS = CRAPLESS_ODDS;
