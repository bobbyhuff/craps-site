// Pai Gow Poker rules engine: five- and two-card evaluation with the joker
// ("bug") rules, hand-setting validation, the documented house way used by
// the dealer and by Auto Arrange, and round settlement. No DOM access: the
// browser loads it as window.PG_ENGINE, Node tests require() it.
//
// Cards: { rank: 2..14, suit: 0..3 }, joker = { joker: true }.

(function () {
  const CAT = { high: 0, pair: 1, twoPair: 2, trips: 3, straight: 4, flush: 5, fullHouse: 6, quads: 7, straightFlush: 8, fiveAces: 9 };
  const CAT_NAMES = ['High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Five Aces'];
  const RN = { 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' };
  const RP = { 2: 'Twos', 3: 'Threes', 4: 'Fours', 5: 'Fives', 6: 'Sixes', 7: 'Sevens', 8: 'Eights', 9: 'Nines', 10: 'Tens', 11: 'Jacks', 12: 'Queens', 13: 'Kings', 14: 'Aces' };

  function packScore(cat, ranks) {
    let s = cat;
    for (let i = 0; i < 5; i++) s = s * 16 + (ranks[i] || 0);
    return s;
  }

  // Straight value for tie-breaks: A-K-Q-J-10 = 15, A-2-3-4-5 (the wheel) =
  // 14, so the wheel sits second-highest; every other straight uses its top
  // card (K-high = 13 ... 6-high = 6).
  function straightValue(sortedDistinctDesc) {
    const r = sortedDistinctDesc;
    if (r.length !== 5) return 0;
    if (r[0] - r[4] === 4) return r[0] === 14 ? 15 : r[0];
    if (r[0] === 14 && r[1] === 5 && r[2] === 4 && r[3] === 3 && r[4] === 2) return 14;
    return 0;
  }

  // Five natural cards (an ace may appear five times only when the joker
  // was substituted as a duplicate ace, which is how five aces is scored).
  function evalPlain5(cards) {
    const counts = {};
    for (const c of cards) counts[c.rank] = (counts[c.rank] || 0) + 1;
    const groups = Object.keys(counts).map(Number)
      .sort((a, b) => (counts[b] - counts[a]) || (b - a));
    const shape = groups.map(r => counts[r]);
    const flush = cards.every(c => c.suit === cards[0].suit);
    const sv = straightValue(groups.length === 5 ? groups : []);

    let cat, ranks;
    if (shape[0] === 5) { cat = CAT.fiveAces; ranks = [14]; }
    else if (sv && flush) { cat = CAT.straightFlush; ranks = [sv]; }
    else if (shape[0] === 4) { cat = CAT.quads; ranks = groups; }
    else if (shape[0] === 3 && shape[1] === 2) { cat = CAT.fullHouse; ranks = groups; }
    else if (flush) { cat = CAT.flush; ranks = groups; }
    else if (sv) { cat = CAT.straight; ranks = [sv]; }
    else if (shape[0] === 3) { cat = CAT.trips; ranks = groups; }
    else if (shape[0] === 2 && shape[1] === 2) { cat = CAT.twoPair; ranks = groups; }
    else if (shape[0] === 2) { cat = CAT.pair; ranks = groups; }
    else { cat = CAT.high; ranks = groups; }
    return { cat, ranks, score: packScore(cat, ranks) };
  }

  // Five-card hand with the joker rules: the joker may stand in for any
  // missing card only if that completes a straight, flush or straight
  // flush; otherwise it is an ace. Trying every legal substitution and
  // keeping the best is exactly that rule.
  function eval5(cards) {
    if (cards.length !== 5) throw new Error('High hand must be five cards.');
    const ji = cards.findIndex(c => c.joker);
    if (ji < 0) return finish(evalPlain5(cards), cards, null);
    const others = cards.filter((_, i) => i !== ji);
    if (others.some(c => c.joker)) throw new Error('Only one joker in the deck.');
    const have = new Set(others.map(c => c.rank * 4 + c.suit));
    const aces = others.filter(c => c.rank === 14).length;
    let best = null, bestSub = null;
    if (aces === 4) {
      best = evalPlain5(others.concat([{ rank: 14, suit: 0 }])); // five aces
      bestSub = { rank: 14, suit: -1 };
    }
    for (let r = 2; r <= 14; r++) {
      for (let s = 0; s < 4; s++) {
        if (have.has(r * 4 + s)) continue;
        const ev = evalPlain5(others.concat([{ rank: r, suit: s }]));
        const allowed = r === 14 || ev.cat === CAT.straight || ev.cat === CAT.flush || ev.cat === CAT.straightFlush;
        if (allowed && (!best || ev.score > best.score)) { best = ev; bestSub = { rank: r, suit: s }; }
      }
    }
    return finish(best, cards, bestSub);
  }

  // Two-card hand: pair or high card; the joker is always an ace here.
  function eval2(cards) {
    if (cards.length !== 2) throw new Error('Low hand must be two cards.');
    const r = cards.map(c => (c.joker ? 14 : c.rank)).sort((a, b) => b - a);
    const cat = r[0] === r[1] ? CAT.pair : CAT.high;
    const ranks = cat === CAT.pair ? [r[0]] : r;
    return { cat, ranks, score: packScore(cat, ranks), name: cat === CAT.pair ? `Pair of ${RP[r[0]]}` : `${RN[r[0]]}-${RN[r[1]]}`, short: cat === CAT.pair ? `Pair of ${RP[r[0]]}` : `${RN[r[0]]} high` };
  }

  function finish(ev, cards, jokerAs) {
    ev.jokerAs = jokerAs;
    ev.name = describe5(ev);
    return ev;
  }

  function describe5(ev) {
    const r = ev.ranks;
    switch (ev.cat) {
      case CAT.fiveAces: return 'Five Aces';
      case CAT.straightFlush: return r[0] === 15 ? 'Royal Flush' : (r[0] === 14 ? 'Straight Flush, 5-high (wheel)' : `Straight Flush, ${RN[r[0]]}-high`);
      case CAT.quads: return `Four ${RP[r[0]]}`;
      case CAT.fullHouse: return `Full House, ${RP[r[0]]} over ${RP[r[1]]}`;
      case CAT.flush: return `Flush, ${RN[r[0]]}-high`;
      case CAT.straight: return r[0] === 15 ? 'Straight, Ace-high' : (r[0] === 14 ? 'Straight, 5-high (wheel)' : `Straight, ${RN[r[0]]}-high`);
      case CAT.trips: return `Three ${RP[r[0]]}`;
      case CAT.twoPair: return `Two Pair, ${RP[r[0]]} and ${RP[r[1]]}`;
      case CAT.pair: return `Pair of ${RP[r[0]]}`;
      default: return `${RN[r[0]]} high`;
    }
  }

  // The five-card hand must rank at least as high as the two-card hand.
  // A two-card hand can only be a pair or high card, so compare on those.
  function splitProblem(high, low) {
    const h = eval5(high), l = eval2(low);
    if (h.cat >= CAT.twoPair) return null;
    if (h.cat === CAT.pair) {
      if (l.cat === CAT.high || h.ranks[0] >= l.ranks[0]) return null;
      return `Your two-card hand (${l.name}) beats your five-card hand (${h.name}). Move the higher pair to the five-card hand.`;
    }
    if (l.cat === CAT.pair) return `Your two-card hand has a pair but your five-card hand doesn't. Move the pair to the five-card hand, or split it up.`;
    if (h.ranks[0] > l.ranks[0] || (h.ranks[0] === l.ranks[0] && h.ranks[1] >= l.ranks[1])) return null;
    return `Your highest card must be in the five-card hand. Swap your ${RN[l.ranks[0]]} into the five-card hand.`;
  }

  function isValidSplit(high, low) { return splitProblem(high, low) === null; }

  function allSplits(cards) {
    const out = [];
    for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) {
      out.push({ low: [cards[i], cards[j]], high: cards.filter((_, k) => k !== i && k !== j) });
    }
    return out;
  }

  // ---------- house way ----------
  // Deterministic and documented on the game page. Grouping treats the
  // joker as an ace; straights/flushes are found by full evaluation so the
  // joker's straight/flush role is respected.
  function houseWay(cards) {
    if (cards.length !== 7) throw new Error('Pai gow hands are seven cards.');
    const groups = {};
    for (const c of cards) {
      const r = c.joker ? 14 : c.rank;
      (groups[r] = groups[r] || []).push(c);
    }
    for (const r in groups) groups[r].sort((a, b) => (a.joker ? 1 : 0) - (b.joker ? 1 : 0)); // real cards first
    const ranksBy = n => Object.keys(groups).map(Number).filter(r => groups[r].length === n).sort((a, b) => b - a);
    const fives = ranksBy(5), quads = ranksBy(4), trips = ranksBy(3), pairs = ranksBy(2), singles = ranksBy(1);
    const single = i => groups[singles[i]][0];

    const lowFrom = (low, rule) => {
      const set = new Set(low);
      return { high: cards.filter(c => !set.has(c)), low, rule };
    };
    const sf = bestStraightFlushSplit(cards);

    let pick;
    if (fives.length) {
      pick = pairs.includes(13)
        ? lowFrom(groups[13].slice(0, 2), 'Five aces with a pair of kings: keep the aces together, kings in the low hand.')
        : lowFrom(groups[14].slice(0, 2), 'Five aces: split off a pair of aces for the low hand.');
    } else if (quads.length) {
      const q = quads[0];
      if (trips.length || pairs.length) {
        const p = trips.length ? trips[0] : pairs[0];
        pick = lowFrom(groups[p].slice(0, 2), 'Four of a kind with a pair: keep the four together, pair in the low hand.');
      } else if (q <= 6) {
        pick = lowFrom([single(0), single(1)], 'Four of a kind (6s or lower): keep together.');
      } else if (q <= 10 && singles[0] === 14) {
        pick = lowFrom([single(0), single(1)], 'Four of a kind (7s to 10s) with an ace: keep together, ace in the low hand.');
      } else {
        pick = lowFrom(groups[q].slice(0, 2), 'Four of a kind: split into two pairs.');
      }
    } else if (trips.length >= 2) {
      pick = lowFrom(groups[trips[0]].slice(0, 2), 'Two three-of-a-kinds: split the higher set, pair in the low hand.');
    } else if (trips.length && pairs.length) {
      if (pairs[0] === 2 && singles.includes(14) && singles.includes(13)) {
        pick = lowFrom([groups[14][0], groups[13][0]], 'Full house with deuces and an A-K: keep the full house, A-K low.');
      } else {
        pick = lowFrom(groups[pairs[0]].slice(0, 2), 'Full house: split it, the pair goes in the low hand.');
      }
    } else if (trips.length) {
      const t = trips[0];
      if (t === 14) {
        pick = lowFrom([groups[14][0], single(0)], 'Three aces: pair of aces high, ace plus next-highest card low.');
      } else if (sf && sf.lowEv.cat === CAT.pair) {
        pick = { high: sf.high, low: sf.low, rule: 'Three of a kind with a straight or flush that leaves a pair: play the straight/flush, pair low.' };
      } else {
        pick = lowFrom([single(0), single(1)], 'Three of a kind: keep it in the high hand, two highest cards low.');
      }
    } else if (pairs.length >= 3) {
      pick = lowFrom(groups[pairs[0]].slice(0, 2), 'Three pair: highest pair goes in the low hand.');
    } else if (pairs.length === 2) {
      const [p1, p2] = pairs;
      if (p1 !== 14 && p1 <= 10 && singles[0] === 14) {
        pick = lowFrom([single(0), single(1)], 'Two pair (10s or lower) with an ace: keep both pairs high, ace low.');
      } else {
        pick = lowFrom(groups[p2].slice(0, 2), 'Two pair: split them, the lower pair goes in the low hand.');
      }
    } else if (sf) {
      pick = { high: sf.high, low: sf.low, rule: 'Straight or flush: play it in the high hand with the best two cards left over in the low hand.' };
    } else if (pairs.length === 1) {
      pick = lowFrom([single(0), single(1)], 'One pair: pair in the high hand, two highest other cards low.');
    } else {
      pick = lowFrom([single(1), single(2)], 'No pair: highest card in the high hand, second and third highest low.');
    }

    if (!isValidSplit(pick.high, pick.low)) {
      // Defensive fallback; the rules above never foul (tests check this).
      const valid = allSplits(cards).filter(s => isValidSplit(s.high, s.low));
      valid.sort((a, b) => eval5(b.high).score - eval5(a.high).score);
      pick = { high: valid[0].high, low: valid[0].low, rule: 'Fallback: strongest legal high hand.' };
    }
    return pick;
  }

  // Among legal splits whose five-card hand is a straight, flush or straight
  // flush, the one with the strongest two-card hand (then strongest high).
  function bestStraightFlushSplit(cards) {
    let best = null;
    for (const s of allSplits(cards)) {
      const h = eval5(s.high);
      if (h.cat !== CAT.straight && h.cat !== CAT.flush && h.cat !== CAT.straightFlush) continue;
      if (!isValidSplit(s.high, s.low)) continue;
      const l = eval2(s.low);
      if (!best || l.score > best.lowEv.score || (l.score === best.lowEv.score && h.score > best.highEv.score)) {
        best = { high: s.high, low: s.low, highEv: h, lowEv: l };
      }
    }
    return best;
  }

  // ---------- settlement ----------
  // A player hand wins only by being strictly better; identical hands
  // (copies) go to the banker. Win both = win (even money minus
  // commission), win one = push, otherwise the bet loses.
  function compare(player, dealer) {
    const ph = eval5(player.high), pl = eval2(player.low);
    const dh = eval5(dealer.high), dl = eval2(dealer.low);
    const highResult = ph.score > dh.score ? 'player' : (ph.score < dh.score ? 'dealer' : 'copy');
    const lowResult = pl.score > dl.score ? 'player' : (pl.score < dl.score ? 'dealer' : 'copy');
    const playerWins = (highResult === 'player') + (lowResult === 'player');
    const outcome = playerWins === 2 ? 'win' : (playerWins === 1 ? 'push' : 'lose');
    return { outcome, highResult, lowResult, ph, pl, dh, dl };
  }

  function settle(bet, outcome, odds) {
    if (outcome === 'win') {
      const gross = bet * odds.winPays[0] / odds.winPays[1];
      const commission = Math.round(gross * odds.commissionRate * 100) / 100;
      const net = Math.round((gross - commission) * 100) / 100;
      return { returned: Math.round((bet + net) * 100) / 100, net, commission };
    }
    if (outcome === 'push') return { returned: bet, net: 0, commission: 0 };
    return { returned: 0, net: -bet, commission: 0 };
  }

  const PG_ENGINE = { CAT, CAT_NAMES, eval5, eval2, splitProblem, isValidSplit, allSplits, houseWay, bestStraightFlushSplit, compare, settle };

  if (typeof module !== 'undefined') module.exports = PG_ENGINE;
  if (typeof window !== 'undefined') window.PG_ENGINE = PG_ENGINE;
})();
