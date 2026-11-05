// Jacks or Better engine tests. Run with `npm test`.
const test = require('node:test');
const assert = require('node:assert/strict');
const CARDS = require('../src/games/shared/cards.js');
const VP = require('../src/games/video-poker/vp-engine.js');
const ODDS = require('../src/_data/videoPokerOdds.js');

const ev = s => VP.evaluate(CARDS.parseCards(s));

test('royal flush detection (any order, any suit)', () => {
  assert.equal(ev('As Ks Qs Js Ts'), 'royal');
  assert.equal(ev('Th Ah Jh Kh Qh'), 'royal');
  assert.equal(ev('Ks Qs Js Ts 9s'), 'straightFlush');
  assert.equal(ev('As Ks Qs Js Th'), 'straight'); // broadway, not suited
});

test('ace-low straights and no wrap-around', () => {
  assert.equal(ev('Ad 2c 3h 4s 5d'), 'straight');
  assert.equal(ev('As 2s 3s 4s 5s'), 'straightFlush');
  assert.equal(ev('Qd Kc Ah 2s 3d'), 'nothing');
});

test('every made hand category', () => {
  assert.equal(ev('9c 9d 9h 9s 2d'), 'quads');
  assert.equal(ev('9c 9d 9h 2s 2d'), 'fullHouse');
  assert.equal(ev('2h 7h 9h Jh Kh'), 'flush');
  assert.equal(ev('7c 7d 7h Ks 2d'), 'trips');
  assert.equal(ev('7c 7d Kh Ks 2d'), 'twoPair');
  assert.equal(ev('2c 2d 3h 3s 4d'), 'twoPair'); // low two pair still pays
});

test('Jacks or Better qualification', () => {
  assert.equal(ev('Jc Jd 2h 5s 9d'), 'jacksOrBetter');
  assert.equal(ev('Ac Ad 2h 5s 9d'), 'jacksOrBetter');
  assert.equal(ev('Tc Td 2h 5s 9d'), 'nothing');
  assert.equal(ev('2c 2d 7h 5s 9d'), 'nothing');
  assert.equal(ev('2c 4d 7h 9s Jd'), 'nothing');
});

test('all paytable payouts, including the 5-coin royal', () => {
  const expected = {
    royal: [250, 500, 750, 1000, 4000],
    straightFlush: [50, 100, 150, 200, 250],
    quads: [25, 50, 75, 100, 125],
    fullHouse: [9, 18, 27, 36, 45],
    flush: [6, 12, 18, 24, 30],
    straight: [4, 8, 12, 16, 20],
    trips: [3, 6, 9, 12, 15],
    twoPair: [2, 4, 6, 8, 10],
    jacksOrBetter: [1, 2, 3, 4, 5],
  };
  for (const key in expected) {
    for (let coins = 1; coins <= 5; coins++) {
      assert.equal(VP.payoutCoins(key, coins, ODDS), expected[key][coins - 1], `${key} x${coins}`);
    }
  }
  for (let coins = 1; coins <= 5; coins++) assert.equal(VP.payoutCoins('nothing', coins, ODDS), 0);
  assert.throws(() => VP.payoutCoins('flush', 6, ODDS));
});

test('exhaustive count of all 2,598,960 five-card hands matches combinatorics', () => {
  const counts = new Array(10).fill(0);
  for (let a = 0; a < 52; a++) for (let b = a + 1; b < 52; b++) for (let c = b + 1; c < 52; c++)
    for (let d = c + 1; d < 52; d++) for (let e = d + 1; e < 52; e++) counts[VP.evalIds(a, b, c, d, e)]++;
  const byKey = Object.fromEntries(VP.HAND_KEYS.map((k, i) => [k, counts[i]]));
  assert.deepEqual(byKey, {
    nothing: 2062860, jacksOrBetter: 337920, twoPair: 123552, trips: 54912, straight: 10200,
    flush: 5108, fullHouse: 3744, quads: 624, straightFlush: 36, royal: 4,
  });
});

test('a dealt deck never contains duplicate cards', () => {
  const rng = CARDS.seededRng(7);
  for (let i = 0; i < 200; i++) {
    const deck = CARDS.shuffledDeck(null, rng);
    assert.equal(deck.length, 52);
    assert.equal(new Set(deck.map(c => `${c.rank}${c.suit}`)).size, 52);
  }
});

test('exact hold advisor: known expected values', () => {
  // 4 to a royal: (1 royal x 800 + 8 flushes x 6 + 3 straights x 4 + 12 high pairs x 1) / 47
  const r = VP.analyzeHolds(CARDS.parseCards('As Ks Qs Js 3d'), 5, ODDS);
  assert.deepEqual(r[0].held, [0, 1, 2, 3]);
  // At 5 coins: (4000 + 8*30 + 3*20 + 12*5) / 47 coins = 872/47 per coin.
  assert.ok(Math.abs(r[0].ev - 4360 / 47) < 1e-9);
  assert.ok(Math.abs(r[0].evPerCoin - 872 / 47) < 1e-9);
  // Pat royal: hold everything, 4000 coins at 5 coins
  const pat = VP.analyzeHolds(CARDS.parseCards('As Ks Qs Js Ts'), 5, ODDS);
  assert.equal(pat[0].held.length, 5);
  assert.equal(pat[0].ev, 4000);
});

test('exact hold advisor: textbook strategy decisions', () => {
  const best = (s, coins = 5) => VP.analyzeHolds(CARDS.parseCards(s), coins, ODDS)[0].held;
  assert.deepEqual(best('3c 3d 8h Js Kd'), [0, 1]);          // low pair beats two high cards
  assert.deepEqual(best('Ah Kh Qh Jh 9h'), [0, 1, 2, 3]);     // 4 to a royal over a pat flush
  assert.deepEqual(best('Jc Jd 4h 4s 9d'), [0, 1, 2, 3]);     // two pair: keep both pairs, no kicker
  assert.deepEqual(best('Jc Jd Ah 7s 2d'), [0, 1]);           // high pair, drop the ace kicker
  assert.deepEqual(best('2c 3d 6h 8s 9h'), []);               // garbage: draw five
});
