// Three Card Poker engine tests. Run with `npm test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const CARDS = require('../src/games/shared/cards.js');
const TCP = require('../src/games/three-card-poker/tcp-engine.js');
const ODDS = require('../src/_data/threeCardPokerOdds.js');

const ev = s => TCP.evaluate(CARDS.parseCards(s));
const settle = (opts) => TCP.settle(Object.assign({ ante: 0, pairPlus: 0, folded: false }, opts, {
  player: ev(opts.player), dealer: ev(opts.dealer),
}), ODDS);

test('three-card ranking order: straight beats flush, trips beat straight', () => {
  const order = ['Qs Ks As', '5c 5d 5h', '4c 5d 6h', '2h 7h Jh', '9c 9d 2h', 'Ac Kd 9h'];
  const keys = order.map(s => ev(s).key);
  assert.deepEqual(keys, ['straightFlush', 'trips', 'straight', 'flush', 'pair', 'high']);
  for (let i = 1; i < order.length; i++) assert.ok(ev(order[i - 1]).score > ev(order[i]).score, order[i - 1]);
  assert.ok(ev('2c 3d 4h').score > ev('Ah Kh 9h').score); // weakest straight > best flush
});

test('ace high or low in straights, never wrap-around', () => {
  assert.equal(ev('Ac 2d 3h').key, 'straight');
  assert.equal(ev('Qc Kd Ah').key, 'straight');
  assert.equal(ev('Kc Ad 2h').key, 'high');
  assert.ok(ev('Ac 2d 3h').score < ev('2c 3d 4h').score); // A-2-3 is the lowest straight
});

test('tie-breaks within categories', () => {
  assert.ok(ev('9c 9d Kh').score > ev('9h 9s Qd').score); // kicker
  assert.ok(ev('Tc Td 2h').score > ev('9h 9s Ad').score);
  assert.equal(ev('Kc Qd 7h').score, ev('Kh Qs 7d').score);
});

test('dealer qualification: Queen-high or better', () => {
  assert.equal(TCP.dealerQualifies(ev('Qc 3d 2h'), ODDS), true);
  assert.equal(TCP.dealerQualifies(ev('Jc Td 8h'), ODDS), false);
  assert.equal(TCP.dealerQualifies(ev('2c 2d 3h'), ODDS), true);
});

test('Q-6-4 play rule', () => {
  assert.equal(TCP.shouldPlay(ev('Qc 6d 4h'), ODDS), true);
  assert.equal(TCP.shouldPlay(ev('Qc 6d 3h'), ODDS), false);
  assert.equal(TCP.shouldPlay(ev('Qc 7d 2h'), ODDS), true);
  assert.equal(TCP.shouldPlay(ev('Jc Td 8h'), ODDS), false);
  assert.equal(TCP.shouldPlay(ev('2c 2d 3h'), ODDS), true);
});

test('dealer does not qualify: Ante 1:1, Play pushes', () => {
  const r = settle({ ante: 10, player: '2c 4d 9h', dealer: 'Jc Td 8h' });
  assert.equal(r.qualifies, false);
  assert.deepEqual(r.lines.map(l => [l.bet, l.result, l.win]), [['Ante', 'win', 10], ['Play', 'push', 0]]);
  assert.equal(r.staked, 20); assert.equal(r.returned, 30); assert.equal(r.net, 10);
});

test('player beats qualifying dealer: Ante and Play 1:1', () => {
  const r = settle({ ante: 10, player: 'Kc Kd 2h', dealer: 'Qc Qd 9h' });
  assert.equal(r.net, 20);
});

test('player loses to qualifying dealer', () => {
  const r = settle({ ante: 10, player: 'Kc Jd 2h', dealer: 'Qc Qd 9h' });
  assert.equal(r.net, -20);
});

test('ties push Ante and Play', () => {
  const r = settle({ ante: 10, player: 'Kc Qd 7h', dealer: 'Kh Qs 7d' });
  assert.equal(r.main, 'tie');
  assert.equal(r.net, 0);
});

test('Ante Bonus pays even when the dealer wins', () => {
  // Player straight loses to dealer trips but still collects 1:1 Ante Bonus.
  const r = settle({ ante: 10, player: '4c 5d 6h', dealer: '2c 2d 2h' });
  const bonus = r.lines.find(l => l.bet === 'Ante Bonus');
  assert.equal(bonus.win, 10);
  assert.equal(r.net, -20 + 10);
  assert.equal(settle({ ante: 10, player: '4h 5h 6h', dealer: '2c 3d 9h' }).lines.find(l => l.bet === 'Ante Bonus').win, 50);
  assert.equal(settle({ ante: 10, player: '7c 7d 7h', dealer: '2c 3d 9h' }).lines.find(l => l.bet === 'Ante Bonus').win, 40);
  assert.equal(settle({ ante: 10, player: '2h 7h Jh', dealer: '2c 3d 9h' }).lines.find(l => l.bet === 'Ante Bonus'), undefined);
});

test('Pair Plus pays the selected table regardless of the dealer', () => {
  const pp = s => settle({ pairPlus: 10, player: s, dealer: 'Ac Ad Ah' }).net;
  assert.equal(pp('4h 5h 6h'), 400);
  assert.equal(pp('7c 7d 7s'), 300);
  assert.equal(pp('4c 5d 6h'), 60);
  assert.equal(pp('2h 7h Jh'), 30);
  assert.equal(pp('9c 9d 2h'), 10);
  assert.equal(pp('Kc Jd 2h'), -10);
  assert.equal(ODDS.pairPlus.label, '40-30-6-3-1');
});

test('folding forfeits the Ante and Pair Plus; no Play bet is made', () => {
  const r = settle({ ante: 10, pairPlus: 5, folded: true, player: '9c 9d 2h', dealer: 'Jc Td 8h' });
  assert.equal(r.staked, 15);
  assert.equal(r.returned, 0);
  assert.ok(!r.lines.some(l => l.bet === 'Play' || l.bet === 'Ante Bonus'));
});

test('exact enumeration confirms house edges and that Q-6-4 is optimal for every hand', () => {
  const deck = CARDS.makeDeck();
  const hands = [];
  for (let a = 0; a < 52; a++) for (let b = a + 1; b < 52; b++) for (let c = b + 1; c < 52; c++) {
    const e = TCP.evaluate([deck[a], deck[b], deck[c]]);
    hands.push({ a, b, c, e, q: TCP.dealerQualifies(e, ODDS) });
  }
  assert.equal(hands.length, 22100);

  for (const label in ODDS.pairPlusTables) {
    const pays = ODDS.pairPlusTables[label].pays;
    let s = 0;
    for (const h of hands) { const r = pays[h.e.key]; s += r ? r[0] / r[1] : -1; }
    assert.equal((-s / hands.length * 100).toFixed(2), ODDS.pairPlusTables[label].houseEdge.toFixed(2), label);
  }

  let total = 0, plays = 0, wrong = 0;
  for (const P of hands) {
    const bonusR = ODDS.anteBonus[P.e.key];
    const bonus = bonusR ? bonusR[0] / bonusR[1] : 0;
    let sum = 0, n = 0;
    for (const D of hands) {
      if (D.a === P.a || D.a === P.b || D.a === P.c || D.b === P.a || D.b === P.b || D.b === P.c || D.c === P.a || D.c === P.b || D.c === P.c) continue;
      n++;
      sum += bonus + (!D.q ? 1 : P.e.score > D.e.score ? 2 : P.e.score < D.e.score ? -2 : 0);
    }
    const evPlay = sum / n;
    const play = TCP.shouldPlay(P.e, ODDS);
    if ((evPlay > -1) !== play) wrong++;
    total += play ? evPlay : -1;
    if (play) plays++;
  }
  assert.equal(wrong, 0);
  const edge = -total / hands.length * 100;
  const eor = edge / (1 + plays / hands.length);
  assert.equal(edge.toFixed(2), ODDS.houseEdge.ante.toFixed(2));
  assert.equal(eor.toFixed(2), ODDS.houseEdge.elementOfRisk.toFixed(2));
});
