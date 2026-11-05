// Single source of truth for every payout/rule number in 0stakes' Three Card
// Poker. Same isomorphic pattern as the other _data odds files: templates
// read it as `threeCardPokerOdds`, and it is passthrough-copied to
// /games/three-card-poker/odds.js for the browser (window.ODDS).
//
// Ratios are [numerator, denominator] pairs, the same payout(amount, ratio)
// shape every other 0stakes game uses.

const TCP_ODDS = {
  // Ante and Play pay even money when the player beats a qualifying dealer.
  antePlay: [1, 1],
  // Ante also pays even money (and Play pushes) when the dealer fails to
  // qualify. The dealer needs Queen-high or better (rank 12) to qualify.
  dealerQualifyRank: 12,

  // Ante Bonus: paid on the Ante for these player hands whenever the player
  // did not fold, win or lose against the dealer.
  anteBonus: {
    straightFlush: [5, 1],
    trips: [4, 1],
    straight: [1, 1],
  },

  // Pair Plus pay tables. `pairPlusTable` selects which one the game uses;
  // only one is ever live at a time so schedules can never be mixed. Change
  // the selection here and every payout, label and house-edge figure on the
  // site follows.
  pairPlusTables: {
    // The schedule 0stakes plays. Very common on Las Vegas Strip tables.
    '40-30-6-3-1': {
      label: '40-30-6-3-1',
      pays: { straightFlush: [40, 1], trips: [30, 1], straight: [6, 1], flush: [3, 1], pair: [1, 1] },
      houseEdge: 7.28,
    },
    // The original, more generous schedule (flush pays 4:1).
    '40-30-6-4-1': {
      label: '40-30-6-4-1',
      pays: { straightFlush: [40, 1], trips: [30, 1], straight: [6, 1], flush: [4, 1], pair: [1, 1] },
      houseEdge: 2.32,
    },
  },
  pairPlusTable: '40-30-6-3-1',

  // Optimal Ante/Play strategy: play Q-6-4 or better, fold anything worse.
  playThreshold: [12, 6, 4],

  // Pre-verified figures (exact enumeration in tests/three-card-poker.test.js
  // confirms them for these exact rules).
  houseEdge: {
    ante: 3.37,          // per Ante wagered, with Q-6-4 strategy
    elementOfRisk: 2.01, // per total amount wagered (Ante + Play)
  },
};

function tcpRatioStr(pair) { return `${pair[0]}:${pair[1]}`; }

TCP_ODDS.pairPlus = TCP_ODDS.pairPlusTables[TCP_ODDS.pairPlusTable];
TCP_ODDS.pairPlusStr = {};
for (const k in TCP_ODDS.pairPlus.pays) TCP_ODDS.pairPlusStr[k] = tcpRatioStr(TCP_ODDS.pairPlus.pays[k]);
TCP_ODDS.anteBonusStr = {};
for (const k in TCP_ODDS.anteBonus) TCP_ODDS.anteBonusStr[k] = tcpRatioStr(TCP_ODDS.anteBonus[k]);
TCP_ODDS.houseEdge.pairPlus = TCP_ODDS.pairPlus.houseEdge;

if (typeof module !== 'undefined') module.exports = TCP_ODDS;
if (typeof window !== 'undefined') window.ODDS = TCP_ODDS;
