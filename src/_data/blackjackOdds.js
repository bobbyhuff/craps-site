// Single source of truth for every payout/odds/rule number the blackjack game
// uses. Loaded two ways, same isomorphic pattern as src/_data/odds.js:
//
//   1. Eleventy's data cascade (Node, at build time) — available in any
//      template as `blackjackOdds`, e.g. {{ blackjackOdds.blackjackPayoutStr }}.
//   2. A plain <script> tag on the game page, copied verbatim to
//      /games/blackjack/odds.js by the passthrough copy in .eleventy.js — the
//      browser gets the exact same object as `window.ODDS` (reusing the same
//      global name craps.js's odds.js uses is safe since craps and blackjack
//      never load on the same page), and blackjack.js reads it directly.
//
// Ratios are stored as [numerator, denominator] pairs, matching the shape
// blackjack.js's payout(amount, ratio) helper expects (identical to craps.js's).

const BLACKJACK_ODDS = {
  // Natural 21 on the first two cards. 3:2 is the standard, player-fair rate —
  // some real tables pay the worse 6:5, which this site deliberately doesn't.
  blackjackPayout: [3, 2],

  // Insurance side bet, offered only when the dealer's up-card is an Ace.
  // Pays 2:1 if the dealer has blackjack; fixed at half the original bet.
  insurancePayout: [2, 1],
  insuranceMaxFraction: 0.5,

  // Dealer stands on all totals of 17, including soft 17 ("S17") — the more
  // player-favorable and more commonly taught default.
  dealerHitSoft17: false,

  // Double down allowed on any first two cards (no 9-11 restriction), and
  // after splitting.
  doubleAnyTwo: true,
  doubleAfterSplit: true,

  // Split pairs: identical rank only (e.g. two Kings — not any two 10-value
  // cards). One split allowed per hand, no resplitting: max 2 hands. Split
  // aces get exactly one card each and can't be hit again.
  splitRequiresEqualRank: true,
  maxSplitHands: 2,
  resplitAcesAllowed: false,
  splitAcesOneCardOnly: true,

  // 21 built by hitting (not on the first two cards) is just "21" and pays
  // even money — only a natural first-two-card 21 is a "blackjack."
  blackjackOnlyOnInitialTwo: true,
};

function ratioStr(pair) { return `${pair[0]}:${pair[1]}`; }

BLACKJACK_ODDS.blackjackPayoutStr = ratioStr(BLACKJACK_ODDS.blackjackPayout);
BLACKJACK_ODDS.insurancePayoutStr = ratioStr(BLACKJACK_ODDS.insurancePayout);

if (typeof module !== 'undefined') module.exports = BLACKJACK_ODDS;
if (typeof window !== 'undefined') window.ODDS = BLACKJACK_ODDS;
