// Three Card Poker rules engine: hand ranking, dealer qualification, the
// optimal play/fold rule, and full round settlement. No DOM access -- the
// browser loads it as window.TCP_ENGINE, Node tests require() it.
//
// Three-card rankings differ from five-card poker: with only three cards a
// straight is rarer than a flush, so it ranks higher. Order, best first:
// Straight Flush, Three of a Kind, Straight, Flush, Pair, High Card.
// Ace plays high (Q-K-A) or low (A-2-3, the lowest straight), never both
// (K-A-2 is not a straight).

(function () {
  const CAT = { high: 0, pair: 1, flush: 2, straight: 3, trips: 4, straightFlush: 5 };
  const CAT_KEYS = ['high', 'pair', 'flush', 'straight', 'trips', 'straightFlush'];
  const CAT_NAMES = ['High Card', 'Pair', 'Flush', 'Straight', 'Three of a Kind', 'Straight Flush'];

  // Returns { cat, key, name, ranks, score }. `ranks` are the tie-break
  // values best first; `score` packs category + ranks into one comparable
  // integer so hands compare with plain < and >.
  function evaluate(cards) {
    if (cards.length !== 3) throw new Error('Three Card Poker hands are exactly three cards.');
    const r = cards.map(c => c.rank).sort((a, b) => b - a);
    const flush = cards[0].suit === cards[1].suit && cards[1].suit === cards[2].suit;
    const distinct = new Set(r).size;
    let straightHigh = 0;
    if (distinct === 3) {
      if (r[0] - r[2] === 2) straightHigh = r[0];
      else if (r[0] === 14 && r[1] === 3 && r[2] === 2) straightHigh = 3; // A-2-3
    }

    let cat, ranks;
    if (straightHigh && flush) { cat = CAT.straightFlush; ranks = [straightHigh]; }
    else if (distinct === 1) { cat = CAT.trips; ranks = [r[0]]; }
    else if (straightHigh) { cat = CAT.straight; ranks = [straightHigh]; }
    else if (flush) { cat = CAT.flush; ranks = r; }
    else if (distinct === 2) {
      const pair = r[0] === r[1] ? r[0] : r[1];
      const kicker = r[0] === r[1] ? r[2] : r[0];
      cat = CAT.pair; ranks = [pair, kicker];
    } else { cat = CAT.high; ranks = r; }

    let score = cat;
    for (let i = 0; i < 3; i++) score = score * 16 + (ranks[i] || 0);
    return { cat, key: CAT_KEYS[cat], name: CAT_NAMES[cat], ranks, score };
  }

  function describe(ev) {
    const R = { 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' };
    const nm = v => R[v] || String(v);
    if (ev.cat === CAT.high || ev.cat === CAT.flush) return `${ev.name}, ${nm(ev.ranks[0])}-high`;
    if (ev.cat === CAT.pair) return `Pair of ${nm(ev.ranks[0])}s`;
    if (ev.cat === CAT.trips) return `Three ${nm(ev.ranks[0])}s`;
    return `${ev.name}, ${nm(ev.ranks[0])}-high`;
  }

  // Dealer qualifies with Queen-high or better.
  function dealerQualifies(ev, odds) {
    return ev.cat > CAT.high || ev.ranks[0] >= odds.dealerQualifyRank;
  }

  // The optimal Ante strategy: play Q-6-4 or better, fold anything worse.
  // Exact enumeration (see tests) shows this threshold is the EV-maximizing
  // decision for every one of the 22,100 possible player hands.
  function shouldPlay(ev, odds) {
    if (ev.cat > CAT.high) return true;
    const t = odds.playThreshold;
    for (let i = 0; i < 3; i++) {
      if (ev.ranks[i] > t[i]) return true;
      if (ev.ranks[i] < t[i]) return false;
    }
    return true; // exactly Q-6-4
  }

  function pay(amount, ratio) { return Math.round(amount * ratio[0] / ratio[1] * 100) / 100; }

  // Settles a finished round. Inputs:
  //   ante, pairPlus: amounts wagered (either may be 0, not both)
  //   folded: true if the player folded (only meaningful with an Ante)
  //   player, dealer: evaluate() results
  // Returns line items per wager plus totals. `returned` is everything that
  // goes back to the player's bankroll (stakes on wins/pushes + winnings);
  // `net` is returned minus total staked.
  //
  // Fold rule: folding surrenders the hand, so the Ante and any Pair Plus
  // wager are both lost (standard casino procedure). A Pair Plus-only bet
  // (no Ante) has no fold decision and is settled purely on the pay table.
  function settle({ ante, pairPlus, folded, player, dealer }, odds) {
    const lines = [];
    const play = ante > 0 && !folded ? ante : 0;
    const qualifies = dealerQualifies(dealer, odds);
    let main = null;

    if (ante > 0) {
      if (folded) {
        lines.push({ bet: 'Ante', stake: ante, result: 'lose', win: 0, note: 'Folded' });
      } else {
        if (!qualifies) {
          main = 'noQualify';
          lines.push({ bet: 'Ante', stake: ante, result: 'win', win: pay(ante, odds.antePlay), note: 'Dealer does not qualify' });
          lines.push({ bet: 'Play', stake: play, result: 'push', win: 0, note: 'Dealer does not qualify' });
        } else if (player.score > dealer.score) {
          main = 'win';
          lines.push({ bet: 'Ante', stake: ante, result: 'win', win: pay(ante, odds.antePlay) });
          lines.push({ bet: 'Play', stake: play, result: 'win', win: pay(play, odds.antePlay) });
        } else if (player.score < dealer.score) {
          main = 'lose';
          lines.push({ bet: 'Ante', stake: ante, result: 'lose', win: 0 });
          lines.push({ bet: 'Play', stake: play, result: 'lose', win: 0 });
        } else {
          main = 'tie';
          lines.push({ bet: 'Ante', stake: ante, result: 'push', win: 0, note: 'Tie' });
          lines.push({ bet: 'Play', stake: play, result: 'push', win: 0, note: 'Tie' });
        }
        const bonusRatio = odds.anteBonus[player.key];
        if (bonusRatio) {
          // Bonus is paid on top of the Ante result; its stake is the Ante
          // itself, so it adds winnings only (stake 0 on this line).
          lines.push({ bet: 'Ante Bonus', stake: 0, result: 'win', win: pay(ante, bonusRatio), bonus: true, note: player.name });
        }
      }
    }

    if (pairPlus > 0) {
      const ratio = odds.pairPlus.pays[player.key];
      if (ante > 0 && folded) {
        lines.push({ bet: 'Pair Plus', stake: pairPlus, result: 'lose', win: 0, bonus: true, note: 'Folded' });
      } else if (ratio) {
        lines.push({ bet: 'Pair Plus', stake: pairPlus, result: 'win', win: pay(pairPlus, ratio), bonus: true, note: player.name });
      } else {
        lines.push({ bet: 'Pair Plus', stake: pairPlus, result: 'lose', win: 0, bonus: true });
      }
    }

    let staked = 0, returned = 0;
    for (const l of lines) {
      staked += l.stake;
      if (l.result === 'win') returned += l.stake + l.win;
      else if (l.result === 'push') returned += l.stake;
    }
    staked = Math.round(staked * 100) / 100;
    returned = Math.round(returned * 100) / 100;
    return { lines, staked, returned, net: Math.round((returned - staked) * 100) / 100, qualifies, main };
  }

  const TCP_ENGINE = { CAT, CAT_KEYS, CAT_NAMES, evaluate, describe, dealerQualifies, shouldPlay, settle };

  if (typeof module !== 'undefined') module.exports = TCP_ENGINE;
  if (typeof window !== 'undefined') window.TCP_ENGINE = TCP_ENGINE;
})();
