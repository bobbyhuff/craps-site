// Single source of truth for every payout/odds/rule number the baccarat game
// uses. Same isomorphic pattern as odds.js/blackjackOdds.js/rouletteOdds.js:
//
//   1. Eleventy's data cascade (Node, at build time) -- available in any
//      template as `baccaratOdds`, e.g. {{ baccaratOdds.payoutStr.tie }}.
//   2. A plain <script> tag on the game page, copied verbatim to
//      /games/baccarat/odds.js by the passthrough copy in .eleventy.js -- the
//      browser gets the exact same object as `window.ODDS`, and baccarat.js
//      reads it directly (no bundler/import in this project).
//
// Punto Banco (the standard casino version) -- not Chemin de Fer or another
// variant. Ratios are stored as [numerator, denominator] pairs, matching the
// same payout(amount, ratio) helper every other game already uses.

const BACCARAT_ODDS = {
  // Card values: 2-9 face value, 10/J/Q/K = 0, A = 1. Hand value is the sum
  // mod 10 (last digit only) -- handled in baccarat.js's handTotal(), not
  // stored here since it's fixed arithmetic, not a tunable number.

  payouts: {
    player: [1, 1],
    banker: [1, 1], // before commission -- see bankerCommissionPct below
    tie: [8, 1],    // the far more common real-world default (vs. the rarer 9:1)
  },

  // Charged only when a Banker bet wins, deducted from that win immediately
  // (never tracked as a running ledger across hands) -- same "settle it now,
  // don't carry a tab" spirit as the craps Buy-bet commission, applied at the
  // point baccarat actually charges it: on the win itself, not up front.
  bankerCommissionPct: 5,

  // A tie pushes Player/Banker bets (stake returned, no win/loss) unless the
  // bet itself was on Tie. Only a Tie bet resolves on a tie.

  // The standard tableau for Banker's third card. Naturals (8 or 9 on the
  // first two cards, either hand) end the round immediately -- no third
  // cards for anyone, so this table is only consulted when neither hand
  // has a natural.
  bankerThirdCardRule: {
    // Player stood (didn't draw a third card): Banker mirrors the Player's
    // own two-card rule -- draw on 0-5, stand on 6-7.
    playerStoodDrawTotals: [0, 1, 2, 3, 4, 5],

    // Player drew a third card: Banker's draw decision depends on Banker's
    // own two-card total *and* the value of Player's third card (0-9, where
    // 10/J/Q/K count as 0).
    drawsOnPlayerThird: {
      0: 'always',
      1: 'always',
      2: 'always',
      3: [0, 1, 2, 3, 4, 5, 6, 7, 9], // anything except 8
      4: [2, 3, 4, 5, 6, 7],
      5: [4, 5, 6, 7],
      6: [6, 7],
      7: [], // never draws -- always stands
    },
  },

  // Player's own third-card rule (identical regardless of what Banker holds):
  // draw on a two-card total of 0-5, stand on 6-7.
  playerDrawTotals: [0, 1, 2, 3, 4, 5],

  // Pre-verified standard house-edge figures, cross-checked against the
  // payouts above the same way every other game's houseEdge is -- not
  // derived at runtime.
  houseEdge: {
    banker: 1.06,
    player: 1.24,
    tie: 14.36, // at 8:1; the rarer 9:1 variant would be ~4.85%
  },
};

function ratioStr(pair) { return `${pair[0]}:${pair[1]}`; }

BACCARAT_ODDS.payoutStr = {
  player: ratioStr(BACCARAT_ODDS.payouts.player),
  banker: ratioStr(BACCARAT_ODDS.payouts.banker),
  tie: ratioStr(BACCARAT_ODDS.payouts.tie),
};

if (typeof module !== 'undefined') module.exports = BACCARAT_ODDS;
if (typeof window !== 'undefined') window.ODDS = BACCARAT_ODDS;
