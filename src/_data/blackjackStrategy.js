// Single source of truth for 0stakes' blackjack basic strategy decisions --
// 6 decks, dealer stands on soft 17, double any first two cards, double
// after split allowed, one split per hand (no resplit), no surrender. Same
// isomorphic pattern as odds.js/blackjackOdds.js: Eleventy's data cascade
// exposes this at build time (`blackjackStrategy` in templates), and it's
// also passthrough-copied to a plain <script> tag so the strategy trainer's
// client-side JS reads the exact same table as the chart page renders --
// one source of truth, not two hand-typed copies that could drift apart.
//
// Every decision below is standard, independently-verifiable multi-deck
// S17/DAS/no-surrender basic strategy (the most widely published chart for
// this exact rule combination). H = Hit, S = Stand, D = Double, P = Split.
// Doubling is never conditional here -- 0stakes allows doubling on any
// first two cards, including after a split, so there's no "double if
// allowed, otherwise hit" fallback to represent; every D is unconditional.
//
// Each `dec` array is ordered to match DEALER_UPCARDS exactly (2,3,4,5,6,7,
// 8,9,10,A), so a template or script can zip them by position without any
// extra lookup. `cards`/`total` are a representative (non-pair, for hard/
// soft rows) starting hand used only for the trainer's scenario display --
// they don't affect the strategy math itself.

const DEALER_UPCARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

const HARD_TOTALS = [
  { hand: '8 or less', cards: '5 + 3', total: 8, dec: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '9', cards: '6 + 3', total: 9, dec: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '10', cards: '6 + 4', total: 10, dec: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
  { hand: '11', cards: '7 + 4', total: 11, dec: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'] },
  { hand: '12', cards: '10 + 2', total: 12, dec: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '13', cards: '10 + 3', total: 13, dec: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '14', cards: '10 + 4', total: 14, dec: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '15', cards: '10 + 5', total: 15, dec: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '16', cards: '10 + 6', total: 16, dec: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '17 or more', cards: '10 + 7', total: 17, dec: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
];

const SOFT_TOTALS = [
  { hand: 'A,2 (soft 13)', cards: 'A + 2', total: 13, dec: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { hand: 'A,3 (soft 14)', cards: 'A + 3', total: 14, dec: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { hand: 'A,4 (soft 15)', cards: 'A + 4', total: 15, dec: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { hand: 'A,5 (soft 16)', cards: 'A + 5', total: 16, dec: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { hand: 'A,6 (soft 17)', cards: 'A + 6', total: 17, dec: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { hand: 'A,7 (soft 18)', cards: 'A + 7', total: 18, dec: ['S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'] },
  { hand: 'A,8 (soft 19)', cards: 'A + 8', total: 19, dec: ['S', 'S', 'S', 'S', 'D', 'S', 'S', 'S', 'S', 'S'] },
  { hand: 'A,9 (soft 20)', cards: 'A + 9', total: 20, dec: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
];

// A,A is included here (not just conceptually a "soft 12") since it's a
// pair decision like the rest of this table -- basic strategy always
// splits it regardless of the dealer's upcard.
const PAIRS = [
  { hand: '2,2', cards: '2 + 2', total: 4, dec: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
  { hand: '3,3', cards: '3 + 3', total: 6, dec: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
  { hand: '4,4', cards: '4 + 4', total: 8, dec: ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '5,5', cards: '5 + 5', total: 10, dec: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
  { hand: '6,6', cards: '6 + 6', total: 12, dec: ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
  { hand: '7,7', cards: '7 + 7', total: 14, dec: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
  { hand: '8,8', cards: '8 + 8', total: 16, dec: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] },
  { hand: '9,9', cards: '9 + 9', total: 18, dec: ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'] },
  { hand: '10,10', cards: '10 + 10', total: 20, dec: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
  { hand: 'A,A', cards: 'A + A', total: 12, dec: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] },
];

const LEGEND = { H: 'Hit', S: 'Stand', D: 'Double', P: 'Split' };

const BJ_STRATEGY = { DEALER_UPCARDS, HARD_TOTALS, SOFT_TOTALS, PAIRS, LEGEND };

if (typeof module !== 'undefined') module.exports = BJ_STRATEGY;
if (typeof window !== 'undefined') window.BJ_STRATEGY = BJ_STRATEGY;
