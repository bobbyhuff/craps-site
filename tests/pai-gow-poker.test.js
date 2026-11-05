// Pai Gow Poker engine tests. Run with `npm test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const CARDS = require('../src/games/shared/cards.js');
const PG = require('../src/games/pai-gow-poker/pg-engine.js');
const ODDS = require('../src/_data/paiGowOdds.js');

const P = s => CARDS.parseCards(s);
const e5 = s => PG.eval5(P(s));
const e2 = s => PG.eval2(P(s));
const C = PG.CAT;

test('53-card deck with exactly one joker; seven-card hands never share cards', () => {
  const rng = CARDS.seededRng(99);
  for (let i = 0; i < 500; i++) {
    const deck = CARDS.shuffledDeck({ jokers: 1 }, rng);
    assert.equal(deck.length, 53);
    const player = deck.slice(0, 7), dealer = deck.slice(7, 14);
    const ids = player.concat(dealer).map(c => (c.joker ? 'JK' : `${c.rank}-${c.suit}`));
    assert.equal(new Set(ids).size, 14);
    assert.equal(deck.filter(c => c.joker).length, 1);
  }
});

test('joker completes straights, flushes and straight flushes', () => {
  assert.equal(e5('Jk 9c Td Jh Qs').cat, C.straight);
  assert.equal(e5('Jk 9c Td Jh Qs').ranks[0], 13); // K-high: joker fills the top
  assert.equal(e5('Jk 2h 7h 9h Kh').cat, C.flush);
  assert.deepEqual(e5('Jk 2h 7h 9h Kh').ranks.slice(0, 2), [14, 13]); // joker = Ace of hearts
  assert.deepEqual(e5('Jk Ah 7h 9h Kh').ranks.slice(0, 3), [14, 13, 12]); // Ace held: joker = Queen
  assert.equal(e5('Jk 5s 6s 7s 8s').cat, C.straightFlush);
});

test('joker is otherwise an Ace, never fully wild', () => {
  const twoPair = e5('Jk Kc Kd Qh Qs');
  assert.equal(twoPair.cat, C.twoPair); // not a full house
  assert.deepEqual(twoPair.ranks, [13, 12, 14]); // Ace kicker
  assert.equal(e5('Jk Ac 7d 4h 2s').cat, C.pair); // pair of Aces
  assert.equal(e5('Jk Kc Kd Ks 2s').cat, C.trips);  // not quads: kings + Ace kicker
  assert.equal(e5('Jk Ac Ad As 2s').cat, C.quads);  // four Aces
  assert.equal(e5('Jk Ac Ad As Ah').cat, C.fiveAces);
  assert.equal(e2('Jk Ac').cat, C.pair);
  assert.deepEqual(e2('Jk 9c').ranks, [14, 9]);
});

test('five aces beats a royal flush; wheel is the second-highest straight', () => {
  assert.ok(e5('Jk Ac Ad As Ah').score > e5('As Ks Qs Js Ts').score);
  const broadway = e5('Ac Kd Qh Js Tc').score, wheel = e5('Ac 2d 3h 4s 5c').score, kHigh = e5('Kc Qd Jh Ts 9c').score;
  assert.ok(broadway > wheel && wheel > kHigh);
  assert.ok(e5('As 2s 3s 4s 5s').score > e5('Ks Qs Js Ts 9s').score);
});

test('high/low validation', () => {
  assert.equal(PG.isValidSplit(P('Kc 9d 7h 5s 3c'), P('Ac 2d')), false); // ace low, king high
  assert.equal(PG.isValidSplit(P('Ac 9d 7h 5s 3c'), P('Kc 2d')), true);
  assert.equal(PG.isValidSplit(P('8c 8d 7h 5s 3c'), P('9c 9d')), false); // higher pair low
  assert.equal(PG.isValidSplit(P('9h 9s 7h 5s 3c'), P('9c 9d')), true);  // equal pairs are legal
  assert.equal(PG.isValidSplit(P('Ac Kd 7h 5s 3c'), P('2c 2d')), false); // pair low, no pair high
  assert.equal(PG.isValidSplit(P('Ac Kd Qh 5s 3c'), P('Ah Kh')), true);  // ties on two cards: five-card hand is higher
  assert.ok(/five-card hand/.test(PG.splitProblem(P('Kc 9d 7h 5s 3c'), P('Ac 2d'))));
});

test('house way is deterministic, always legal, and uses all seven cards', () => {
  const rng = CARDS.seededRng(2024);
  for (let i = 0; i < 20000; i++) {
    const hand = CARDS.shuffledDeck({ jokers: 1 }, rng).slice(0, 7);
    const a = PG.houseWay(hand), b = PG.houseWay(hand.slice());
    assert.ok(PG.isValidSplit(a.high, a.low), `foul: ${hand.map(CARDS.cardLabel).join(' ')}`);
    assert.ok(!a.rule.startsWith('Fallback'));
    assert.equal(a.high.length + a.low.length, 7);
    assert.deepEqual(a.low.map(CARDS.cardLabel).sort(), b.low.map(CARDS.cardLabel).sort());
  }
});

test('house way: specific rules', () => {
  const low = s => PG.houseWay(P(s)).low.map(c => (c.joker ? 'Jk' : CARDS.RANK_LABEL[c.rank])).sort().join(' ');
  assert.equal(low('Ac Kd 9h 7s 5c 3d 2h'), '9 K');      // no pair: 2nd and 3rd highest low
  assert.equal(low('8c 8d Kh 9s 6c 4d 2h'), '9 K');      // one pair stays high
  assert.equal(low('Kc Kd 4h 4s 9c 7d 2h'), '4 4');      // two pair: split
  assert.equal(low('9c 9d 4h 4s Ac 7d 2h'), '7 A');      // two low pair + ace: keep together
  assert.equal(low('Kc Kd 9h 9s 4c 4d 2h'), 'K K');      // three pair: highest low
  assert.equal(low('Ac Ad Ah 9s 6c 4d 2h'), '9 A');      // three aces
  assert.equal(low('7c 7d 7h Ks Kc 4d 2h'), 'K K');      // full house: pair low
  assert.equal(low('Jc Jd Jh Js 9c 6d 2h'), 'J J');      // high quads: split
  assert.equal(low('4c 4d 4h 4s Kc 9d 2h'), '9 K');      // low quads: together
  assert.equal(low('2h 6h 9h Jh Kh Ac Qd'), 'A Q');      // flush high, A-Q low
});

test('every hand-comparison combination, with copies going to the banker', () => {
  // Build fixed hands so each side's result is known.
  const strongHigh = P('Ac Ad 9h 7s 5c'), weakHigh = P('Kc Qd 9s 7c 4d');
  const strongLow = P('Kh Ks'), weakLow = P('Qh 3s');
  const mk = (h, l) => ({ high: h, low: l });
  const cases = [
    // [player high, player low, dealer high, dealer low, expected outcome]
    [strongHigh, strongLow, weakHigh, weakLow, 'win'],     // win / win
    [strongHigh, weakLow, weakHigh, strongLow, 'push'],    // win / lose
    [strongHigh, strongLow, strongHigh, weakLow, 'push'],  // copy / win -> loss + win
    [strongHigh, weakLow, weakHigh, weakLow, 'push'],      // win / copy -> push, not a win
    [weakHigh, weakLow, strongHigh, strongLow, 'lose'],    // lose / lose
    [weakHigh, weakLow, weakHigh, strongLow, 'lose'],      // copy / lose
    [weakHigh, strongLow, strongHigh, strongLow, 'lose'],  // lose / copy
    [weakHigh, weakLow, weakHigh, weakLow, 'lose'],        // copy / copy
    [weakHigh, strongLow, strongHigh, weakLow, 'push'],    // lose / win
  ];
  for (const [ph, pl, dh, dl, want] of cases) {
    assert.equal(PG.compare(mk(ph, pl), mk(dh, dl)).outcome, want);
  }
});

test('5% commission on wins only', () => {
  assert.deepEqual(PG.settle(100, 'win', ODDS), { returned: 195, net: 95, commission: 5 });
  assert.deepEqual(PG.settle(10, 'win', ODDS), { returned: 19.5, net: 9.5, commission: 0.5 });
  assert.deepEqual(PG.settle(25, 'push', ODDS), { returned: 25, net: 0, commission: 0 });
  assert.deepEqual(PG.settle(25, 'lose', ODDS), { returned: 0, net: -25, commission: 0 });
});

test('simulation sanity check: house edge and push rate near published figures', () => {
  // Small seeded run so `npm test` stays fast. The 1,000,000-hand figure in
  // paiGowOdds.js came from the same loop at full size.
  const rng = CARDS.seededRng(31337);
  const N = 20000;
  let net = 0, push = 0;
  for (let i = 0; i < N; i++) {
    const d = CARDS.shuffledDeck({ jokers: 1 }, rng);
    const r = PG.compare(PG.houseWay(d.slice(0, 7)), PG.houseWay(d.slice(7, 14)));
    if (r.outcome === 'win') net += 0.95; else if (r.outcome === 'lose') net -= 1; else push++;
  }
  const edge = -net / N * 100;
  assert.ok(edge > 1 && edge < 4.5, `edge ${edge}`);            // ~2.7% +/- sampling noise
  assert.ok(Math.abs(push / N * 100 - ODDS.pushPct) < 2, `push ${push / N}`);
});
