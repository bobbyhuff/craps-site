// Jacks or Better rules engine: hand evaluation, payouts, and an exact
// expected-value hold advisor. No DOM access, so it runs unchanged in the
// browser (window.VP_ENGINE) and in Node tests (module.exports).
//
// Internally cards are integer ids 0..51: id = (rank - 2) * 4 + suit, so
// rank index = id >> 2 (0 = deuce .. 12 = ace) and suit = id & 3. Integer
// ids keep the evaluator fast enough to score every one of the 32 possible
// holds exactly (about 2.6 million five-card hands) in a fraction of a second.

(function () {
  // Index into this list is what evalIds() returns.
  const HAND_KEYS = ['nothing', 'jacksOrBetter', 'twoPair', 'trips', 'straight', 'flush', 'fullHouse', 'quads', 'straightFlush', 'royal'];

  const POP = new Uint8Array(1 << 13);
  for (let i = 1; i < POP.length; i++) POP[i] = POP[i >> 1] + (i & 1);

  const ROYAL_MASK = 0x1F00; // T J Q K A
  const WHEEL_MASK = 0x100F; // A 2 3 4 5 (ace plays low)

  const cnt = new Uint8Array(13);

  function toId(card) { return (card.rank - 2) * 4 + card.suit; }
  function fromId(id) { return { rank: (id >> 2) + 2, suit: id & 3 }; }

  // Returns an index into HAND_KEYS.
  function evalIds(a, b, c, d, e) {
    const ra = a >> 2, rb = b >> 2, rc = c >> 2, rd = d >> 2, re = e >> 2;
    const mask = (1 << ra) | (1 << rb) | (1 << rc) | (1 << rd) | (1 << re);
    const distinct = POP[mask];

    if (distinct === 5) {
      const s = a & 3;
      const flush = (b & 3) === s && (c & 3) === s && (d & 3) === s && (e & 3) === s;
      const low = mask & -mask;
      const straight = mask === low * 31 || mask === WHEEL_MASK;
      if (straight && flush) return mask === ROYAL_MASK ? 9 : 8;
      if (flush) return 5;
      if (straight) return 4;
      return 0;
    }

    cnt[ra]++; cnt[rb]++; cnt[rc]++; cnt[rd]++; cnt[re]++;
    let res;
    if (distinct === 4) {
      // Exactly one pair. If none of the first three cards is paired, the
      // pair must be the last two cards.
      const pr = cnt[ra] === 2 ? ra : cnt[rb] === 2 ? rb : cnt[rc] === 2 ? rc : rd;
      res = pr >= 9 ? 1 : 0; // rank index 9 = Jack
    } else if (distinct === 3) {
      res = (cnt[ra] === 3 || cnt[rb] === 3 || cnt[rc] === 3) ? 3 : 2;
    } else {
      res = (cnt[ra] === 4 || cnt[rb] === 4) ? 7 : 6;
    }
    cnt[ra] = 0; cnt[rb] = 0; cnt[rc] = 0; cnt[rd] = 0; cnt[re] = 0;
    return res;
  }

  function evaluate(cards) {
    if (cards.length !== 5) throw new Error('Video poker hands are exactly five cards.');
    const ids = cards.map(toId);
    return HAND_KEYS[evalIds(ids[0], ids[1], ids[2], ids[3], ids[4])];
  }

  // Total coins returned for a final hand at a given coin level (1-5),
  // straight off the paytable. 0 for a losing hand.
  function payoutCoins(handKey, coins, odds) {
    if (handKey === 'nothing') return 0;
    if (!(coins >= 1 && coins <= odds.maxCoins)) throw new Error('Bet 1 to 5 coins.');
    return odds.pays[handKey][coins - 1];
  }

  // Which of the five cards make up the paying combination, for on-screen
  // highlighting. Pairs/trips/quads highlight the matched ranks; straights,
  // flushes and full houses use all five.
  function winningCardIndexes(cards, handKey) {
    if (handKey === 'nothing') return [];
    if (['royal', 'straightFlush', 'flush', 'straight', 'fullHouse'].includes(handKey)) return [0, 1, 2, 3, 4];
    const counts = {};
    cards.forEach(c => { counts[c.rank] = (counts[c.rank] || 0) + 1; });
    return cards.map((c, i) => (counts[c.rank] >= 2 ? i : -1)).filter(i => i >= 0);
  }

  // ---------- exact hold analysis ----------
  // For each of the 32 hold patterns, enumerate every possible draw from the
  // 47 unseen cards and average the paytable return. This is the true
  // expected value, not a rule-of-thumb, so the top result is the
  // mathematically optimal hold for the coin level being played.
  function analyzeHolds(cards, coins, odds) {
    const ids = cards.map(toId);
    const payIdx = HAND_KEYS.map(k => (k === 'nothing' ? 0 : odds.pays[k][coins - 1]));
    const used = new Set(ids);
    const rest = [];
    for (let id = 0; id < 52; id++) if (!used.has(id)) rest.push(id);

    const results = [];
    for (let mask = 0; mask < 32; mask++) {
      const held = [];
      for (let i = 0; i < 5; i++) if (mask & (1 << i)) held.push(ids[i]);
      const ev = holdEv(held, rest, payIdx);
      results.push({ mask, held: [0, 1, 2, 3, 4].filter(i => mask & (1 << i)), ev, evPerCoin: ev / coins });
    }
    // Highest EV first; on an exact tie keep more cards (fewer draws), then
    // the lower mask, so the advice is deterministic.
    results.sort((x, y) => (y.ev - x.ev) || (y.held.length - x.held.length) || (x.mask - y.mask));
    return results;
  }

  function holdEv(held, rest, pay) {
    const n = rest.length;
    const k = 5 - held.length;
    let total = 0, count = 0;
    const h0 = held[0], h1 = held[1], h2 = held[2], h3 = held[3], h4 = held[4];
    if (k === 0) return pay[evalIds(h0, h1, h2, h3, h4)];
    if (k === 1) {
      for (let i = 0; i < n; i++) { total += pay[evalIds(h0, h1, h2, h3, rest[i])]; count++; }
    } else if (k === 2) {
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        total += pay[evalIds(h0, h1, h2, rest[i], rest[j])]; count++;
      }
    } else if (k === 3) {
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let l = j + 1; l < n; l++) {
        total += pay[evalIds(h0, h1, rest[i], rest[j], rest[l])]; count++;
      }
    } else if (k === 4) {
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let l = j + 1; l < n; l++) {
        const ri = rest[i], rj = rest[j], rl = rest[l];
        for (let m = l + 1; m < n; m++) { total += pay[evalIds(h0, ri, rj, rl, rest[m])]; count++; }
      }
    } else {
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let l = j + 1; l < n; l++) {
        const ri = rest[i], rj = rest[j], rl = rest[l];
        for (let m = l + 1; m < n; m++) {
          const rm = rest[m];
          for (let o = m + 1; o < n; o++) { total += pay[evalIds(ri, rj, rl, rm, rest[o])]; count++; }
        }
      }
    }
    return total / count;
  }

  const VP_ENGINE = { HAND_KEYS, toId, fromId, evalIds, evaluate, payoutCoins, winningCardIndexes, analyzeHolds };

  if (typeof module !== 'undefined') module.exports = VP_ENGINE;
  if (typeof window !== 'undefined') window.VP_ENGINE = VP_ENGINE;
})();
