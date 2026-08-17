// Single source of truth for every payout/odds/rule number the roulette
// game uses. Same isomorphic pattern as odds.js/blackjackOdds.js:
//
//   1. Eleventy's data cascade (Node, at build time) -- available in any
//      template as `rouletteOdds`.
//   2. A plain <script> tag on the game page, copied verbatim to
//      /games/roulette/odds.js by the passthrough copy in .eleventy.js --
//      the browser gets the exact same object as `window.ODDS`, and
//      roulette.js reads it directly (no bundler/import in this project).
//
// American (double-zero) wheel: 38 pockets, numbers 1-36 plus 0 and 00.
// Payout ratios are stored as [numerator, denominator] pairs, matching the
// same payout(amount, ratio) helper every other game already uses.

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// Physical pocket order around the wheel, clockwise from 0 -- the standard
// American double-zero sequence, used only for the spin animation (which
// pocket sits where). Betting math never depends on this order.
const WHEEL_ORDER = [
  '0', '28', '9', '26', '30', '11', '7', '20', '32', '17', '5', '22', '34', '15', '3', '24', '36', '13', '1',
  '00', '27', '10', '25', '29', '12', '8', '19', '31', '18', '6', '21', '33', '16', '4', '23', '35', '14', '2',
];

// Payout ratios ("pays X:1" -- net win per 1 unit bet). Every standard bet
// (anything that doesn't involve 0 or 00) is priced off 36 numbers, giving
// a flat 5.26% house edge on an American wheel regardless of how many
// numbers the bet covers -- see houseEdge below for the one exception.
const PAYOUTS = {
  straightUp: [35, 1],   // 1 number
  split: [17, 1],        // 2 numbers
  street: [11, 1],       // 3 numbers (one row)
  corner: [8, 1],        // 4 numbers (2x2 block)
  sixLine: [5, 1],       // 6 numbers (two adjacent rows)
  topLine: [6, 1],       // 5 numbers: 0, 00, 1, 2, 3 -- American-only
  column: [2, 1],        // 12 numbers
  dozen: [2, 1],         // 12 numbers
  outside: [1, 1],       // 18 numbers: red/black, odd/even, 1-18/19-36
};

// Pre-verified house-edge figures, derived directly from PAYOUTS above and
// the fixed 38-pocket wheel -- not something roulette.js needs at runtime,
// stored for content pages the same way odds.js/blackjackOdds.js do it.
// Every standard bet: edge = (38 - 36) / 38 = 2/38. The 5-number top line
// is the one bet priced worse than the rest: edge = 3/38.
const HOUSE_EDGE = {
  standard: 5.26,   // straight, split, street, corner, six line, column, dozen, outside
  topLine: 7.89,    // the 0-00-1-2-3 five-number bet -- worst bet on the table
};

const ROULETTE_ODDS = {
  wheelType: 'american',
  pocketCount: 38,
  redNumbers: RED_NUMBERS,
  blackNumbers: BLACK_NUMBERS,
  wheelOrder: WHEEL_ORDER,
  payouts: PAYOUTS,
  houseEdge: HOUSE_EDGE,
};

if (typeof module !== 'undefined') module.exports = ROULETTE_ODDS;
if (typeof window !== 'undefined') window.ODDS = ROULETTE_ODDS;
