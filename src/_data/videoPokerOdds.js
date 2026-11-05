// Single source of truth for every payout/return number in 0stakes' Jacks or
// Better video poker. Same isomorphic pattern as odds.js/blackjackOdds.js:
//
//   1. Eleventy's data cascade -- available in templates as `videoPokerOdds`,
//      e.g. {{ videoPokerOdds.returnPct }}.
//   2. Passthrough-copied to /games/video-poker/odds.js and loaded as a plain
//      <script> before the game, so the browser gets the same object as
//      window.ODDS (video-poker.js and vp-engine.js read it directly).
//
// "9/6" Jacks or Better: the 9 and 6 are the per-coin Full House and Flush
// payouts, the two numbers casinos cut first on worse machines (8/5, 7/5...).
// Each `pays` array is the TOTAL coins returned for 1..5 coins bet, written
// out exactly as printed on the machine's glass. Every row is linear in coins
// except the Royal Flush, whose 5-coin payout jumps to 4000 (800 per coin
// instead of 250). That bonus is why full-coin play is the standard advice.

const VIDEO_POKER_ODDS = {
  game: 'Jacks or Better',
  version: '9/6',
  maxCoins: 5,
  // Coin values offered in the denomination picker.
  denominations: [0.25, 1, 5],
  defaultDenomination: 1,

  // Ordered best to worst. `key` is what vp-engine.js's evaluator returns.
  paytable: [
    { key: 'royal', name: 'Royal Flush', pays: [250, 500, 750, 1000, 4000] },
    { key: 'straightFlush', name: 'Straight Flush', pays: [50, 100, 150, 200, 250] },
    { key: 'quads', name: 'Four of a Kind', pays: [25, 50, 75, 100, 125] },
    { key: 'fullHouse', name: 'Full House', pays: [9, 18, 27, 36, 45] },
    { key: 'flush', name: 'Flush', pays: [6, 12, 18, 24, 30] },
    { key: 'straight', name: 'Straight', pays: [4, 8, 12, 16, 20] },
    { key: 'trips', name: 'Three of a Kind', pays: [3, 6, 9, 12, 15] },
    { key: 'twoPair', name: 'Two Pair', pays: [2, 4, 6, 8, 10] },
    { key: 'jacksOrBetter', name: 'Jacks or Better', pays: [1, 2, 3, 4, 5] },
  ],

  // Long-run return with mathematically optimal play at 5 coins. Published
  // standard figure for 9/6 Jacks or Better, and reproduced exactly by
  // tests/video-poker.test.js, which plays every one of the 2,598,960
  // possible deals with the best of its 32 holds (99.5439%).
  returnPct: 99.54,
  houseEdge: 0.46,
  // Same game and same optimal strategy, but with fewer than 5 coins the
  // royal pays 250 per coin instead of 800 (exact, same test).
  returnPctUnderMaxCoins: 98.37,
  // Variance per hand, in units of one coin bet squared (exact, optimal play).
  variance: 19.51,
  // Average hands between royal flushes with optimal 5-coin play (exact).
  royalCycle: 40391,
  // The simplified hold-priority list on the game page gives up a small
  // amount against perfect play; published figure for that list.
  simpleStrategyReturnPct: 99.46,

  // Other common Jacks or Better paytables, for the comparison content on
  // the strategy pages ONLY. The game itself always plays the 9/6 table
  // above. Every other row of these tables is identical to 9/6; only the
  // per-coin Full House and Flush payouts change. Returns are optimal-play,
  // 5-coin figures, verified exactly in tests/video-poker.test.js (the 9/6
  // and 8/5 rows) and matching published references for all four.
  comparisonTables: [
    { label: '9/6', fullHouse: 9, flush: 6, returnPct: 99.54 },
    { label: '8/5', fullHouse: 8, flush: 5, returnPct: 97.30 },
    { label: '7/5', fullHouse: 7, flush: 5, returnPct: 96.15 },
    { label: '6/5', fullHouse: 6, flush: 5, returnPct: 95.00 },
  ],
};

// Lookup by key: pays[key][coins - 1] -> total coins returned.
VIDEO_POKER_ODDS.pays = {};
VIDEO_POKER_ODDS.names = {};
for (const row of VIDEO_POKER_ODDS.paytable) {
  VIDEO_POKER_ODDS.pays[row.key] = row.pays;
  VIDEO_POKER_ODDS.names[row.key] = row.name;
}

if (typeof module !== 'undefined') module.exports = VIDEO_POKER_ODDS;
if (typeof window !== 'undefined') window.ODDS = VIDEO_POKER_ODDS;
