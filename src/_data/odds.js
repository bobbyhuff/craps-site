// Single source of truth for every payout, odds, and house-edge number on the
// site. Loaded two ways, deliberately kept in one file so they can never drift:
//
//   1. Eleventy's data cascade (Node, at build time) — available in any
//      template as `odds`, e.g. {{ odds.trueOdds[6][0] }}.
//   2. A plain <script> tag on the game page, copied verbatim to
//      /games/craps/odds.js by the passthrough copy in .eleventy.js — the
//      browser gets the exact same object as `window.ODDS`, and craps.js
//      reads it directly (no bundler/import in this project, so this file
//      has to work unmodified in both a CommonJS `require` and a raw
//      <script> load).
//
// Ratios are stored as [numerator, denominator] pairs — the same shape
// craps.js's payout(amount, ratio) helper already expects — so game logic
// and display strings both derive from one array instead of a hand-typed
// "n:d" string living next to it.

const ODDS = {
  // True odds behind Pass/Don't Pass/Come/Don't Come. Zero house edge.
  trueOdds: { 4: [2, 1], 10: [2, 1], 5: [3, 2], 9: [3, 2], 6: [6, 5], 8: [6, 5] },

  // Place-bet payouts (no vig).
  placeOdds: { 4: [9, 5], 10: [9, 5], 5: [7, 5], 9: [7, 5], 6: [7, 6], 8: [7, 6] },

  // Standard "3-4-5x" table max-odds multipliers.
  oddsMult: { 4: 3, 10: 3, 5: 4, 9: 4, 6: 5, 8: 5 },

  // Hardways: bare multiplier (amount * hardPay[n]), matches how the rest of
  // craps.js already consumes it.
  hardPay: { 4: 7, 6: 9, 8: 9, 10: 7 },

  // Field: only 2 and 12 pay above even money; everything else in the field
  // (3,4,9,10,11) is a straight even-money win, handled inline in craps.js.
  fieldPay: { 2: [2, 1], 12: [3, 1] },

  anySevenPay: [4, 1],
  anyCrapsPay: [7, 1],

  // Buy bets pay true odds (trueOdds above) minus this commission, charged
  // up front on the flat bet amount.
  buyCommissionPct: 5,

  // Pre-verified standard house-edge figures. These are derived stats (odds
  // + the 36-combination dice distribution + any vig), not something craps.js
  // needs at runtime — stored directly rather than computed, to avoid adding
  // a probability engine for numbers that are already checked against
  // published references.
  houseEdge: {
    passLineFullOdds: 0.37,
    passLineSingleOdds: 0.85,
    dontPass: 1.36,
    passLine: 1.41,
    place6or8: 1.52,
    place5or9: 4.00,
    buy4or10: 4.76,
    place4or10: 6.67,
    field: 5.56,
    anyCraps: 11.11,
    hard6or8: 9.09,
    hard4or10: 11.11,
    anySeven: 16.67,
  },
};

// Display-string versions, derived from the ratio pairs above rather than
// typed separately, so a template can do {{ odds.trueOddsStr[6] }} → "6:5"
// without a second, independently-maintained copy of the same numbers.
function ratioStr(pair) { return `${pair[0]}:${pair[1]}`; }
function mapRatios(obj) {
  const out = {};
  for (const k in obj) out[k] = ratioStr(obj[k]);
  return out;
}

ODDS.trueOddsStr = mapRatios(ODDS.trueOdds);
ODDS.placeOddsStr = mapRatios(ODDS.placeOdds);
ODDS.fieldPayStr = mapRatios(ODDS.fieldPay);
ODDS.anySevenPayStr = ratioStr(ODDS.anySevenPay);
ODDS.anyCrapsPayStr = ratioStr(ODDS.anyCrapsPay);

if (typeof module !== 'undefined') module.exports = ODDS;
if (typeof window !== 'undefined') window.ODDS = ODDS;
