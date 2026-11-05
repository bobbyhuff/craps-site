// Single source of truth for every payout/rule number in 0stakes' Pai Gow
// Poker. Same isomorphic pattern as the other _data odds files: templates
// read it as `paiGowOdds`; passthrough-copied to /games/pai-gow-poker/odds.js
// for the browser (window.ODDS).

const PAI_GOW_ODDS = {
  // A winning bet (player wins BOTH hands) pays even money...
  winPays: [1, 1],
  // ...minus this commission on the win, charged when the win is paid.
  commissionPct: 5,

  deckSize: 53, // 52 cards plus one joker

  // House rules 0stakes implements (fixed; the player never banks):
  rules: {
    // Identical hands ("copies") go to the banker. A tied hand counts as a
    // player loss, so win + copy = push, lose + copy = loss.
    copiesToBanker: true,
    // A-2-3-4-5 ranks as the second-highest straight (below A-K-Q-J-10,
    // above K-Q-J-10-9). Standard in Nevada and California pai gow.
    wheelIsSecondHighest: true,
    // The joker is a semi-wild "bug": it completes a straight, flush or
    // straight flush in the five-card hand, otherwise it is an ace. In the
    // two-card hand it is always an ace. When it completes a flush it
    // counts as the highest card of that suit not already in the hand.
    joker: 'bug',
    // Five aces (four aces plus the joker) is the top hand.
    fiveAces: true,
  },

  // Approximate house edge per hand for a player who sets every hand the
  // same way the house does (0stakes' Auto Arrange). Estimated from 1,000,000
  // simulated hands (standard error 0.08%) by 0stakes'
  // own simulation of this exact engine; see tests/pai-gow-poker.test.js
  // and the methodology note on the game page.
  houseEdge: 2.73,
  // Share of hands that push (one hand won, one lost). Same simulation.
  pushPct: 41.0,
};

PAI_GOW_ODDS.commissionRate = PAI_GOW_ODDS.commissionPct / 100;

if (typeof module !== 'undefined') module.exports = PAI_GOW_ODDS;
if (typeof window !== 'undefined') window.ODDS = PAI_GOW_ODDS;
