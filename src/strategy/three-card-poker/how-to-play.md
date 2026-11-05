---
title: "How to Play Three Card Poker: Rules and Betting Guide"
seoTitle: "How to Play Three Card Poker: Rules & Betting Guide | 0stakes"
description: "Three Card Poker rules step by step: Ante, Play and Pair Plus, dealer qualification, hand rankings, the Ante Bonus, and every payout with worked hands."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Three Card Poker
    url: /strategy/three-card-poker/
  - name: How to Play
    url: /strategy/three-card-poker/how-to-play/
---
**Quick answer:** You and the dealer each get three cards. You can bet the **Ante** (your hand against the dealer's), **Pair Plus** (your hand against a paytable), or both. After looking at your cards you either fold or match your Ante with a **Play** bet. The dealer needs Queen-high or better to qualify. Straights beat flushes in this game.

<p class="strategy-link"><a class="btn" href="/games/three-card-poker/">Play Three Card Poker free →</a></p>

## What Three Card Poker is

Three Card Poker is a fast banked table game: you play against the dealer, not the other players. There's no draw and no bluffing. Each hand takes one decision, play or fold, and that decision has a simple correct answer.

It's really two games sharing one deal:

- **Ante and Play:** your hand against the dealer's.
- **Pair Plus:** your hand against a fixed paytable. The dealer's cards don't matter.

## The three bets

| Bet | When you make it | What it's about |
|---|---|---|
| **Ante** | Before the deal | Beating the dealer |
| **Play** | After seeing your cards, if you don't fold | Must equal your Ante |
| **Pair Plus** | Before the deal, optional | Getting a pair or better |

You can bet Ante only, Pair Plus only, or both. In the [0stakes game](/games/three-card-poker/), a Pair Plus-only hand has no fold decision: you just see whether your three cards pay.

## How a hand plays out

1. **Bet** the Ante, Pair Plus, or both.
2. **Deal.** You and the dealer each get three cards. Yours are face up to you; the dealer's stay face down.
3. **Decide.** If you have an Ante up, either **fold** (you lose the Ante) or **play** by adding a Play bet equal to the Ante.
4. **Dealer reveals** and checks whether the hand qualifies.
5. **Settle** the Ante and Play, the Ante Bonus, and Pair Plus.

**Folding forfeits the Ante and any Pair Plus bet.** That's standard casino procedure and it's how 0stakes plays. It costs nothing with correct strategy, because every hand that would win Pair Plus is a hand you should play anyway.

## Hand rankings

Three-card hands rank differently from five-card poker. With only three cards, a straight is harder to make than a flush, so it ranks higher. Out of 22,100 possible three-card hands:

| Rank | Hand | Example | Ways to make it | Probability |
|---:|---|---|---:|---:|
| 1 | Straight Flush | 7♠ 8♠ 9♠ | 48 | 0.22% |
| 2 | Three of a Kind | Q♣ Q♦ Q♥ | 52 | 0.24% |
| 3 | Straight | 4♦ 5♣ 6♥ | 720 | 3.26% |
| 4 | Flush | 2♥ 9♥ K♥ | 1,096 | 4.96% |
| 5 | Pair | 8♣ 8♦ K♠ | 3,744 | 16.94% |
| 6 | High Card | A♦ 9♣ 4♠ | 16,440 | 74.39% |

Aces play high (Q-K-A) or low (A-2-3, the lowest straight). K-A-2 is not a straight. Three of a kind (52 ways) is only slightly more common than a straight flush (48 ways), which is why it ranks second, above the straight.

## Dealer qualification

The dealer **qualifies with Queen-high or better**. That happens about {{ threeCardPokerOdds.dealerQualifiesPct }}% of the time.

- **Dealer doesn't qualify:** your Ante pays {{ threeCardPokerOdds.antePlay[0] }}:{{ threeCardPokerOdds.antePlay[1] }} and your Play bet is returned (a push), whatever you're holding.
- **Dealer qualifies:** compare hands. Win and both Ante and Play pay {{ threeCardPokerOdds.antePlay[0] }}:{{ threeCardPokerOdds.antePlay[1] }}. Lose and both lose. An exact tie pushes both.

## Payouts

### Ante Bonus

If you play your hand (don't fold) and hold a straight or better, the Ante Bonus pays on your Ante, **win or lose against the dealer**:

| Hand | Ante Bonus |
|---|---:|
| Straight Flush | {{ threeCardPokerOdds.anteBonusStr.straightFlush }} |
| Three of a Kind | {{ threeCardPokerOdds.anteBonusStr.trips }} |
| Straight | {{ threeCardPokerOdds.anteBonusStr.straight }} |

Ante Bonus schedules vary by casino. These are the payouts the 0stakes game uses.

### Pair Plus ({{ threeCardPokerOdds.pairPlus.label }} table)

| Hand | Pays |
|---|---:|
| Straight Flush | {{ threeCardPokerOdds.pairPlusStr.straightFlush }} |
| Three of a Kind | {{ threeCardPokerOdds.pairPlusStr.trips }} |
| Straight | {{ threeCardPokerOdds.pairPlusStr.straight }} |
| Flush | {{ threeCardPokerOdds.pairPlusStr.flush }} |
| Pair | {{ threeCardPokerOdds.pairPlusStr.pair }} |

Pair Plus pays on your hand alone. Casinos use several Pair Plus tables; the most important line to check is the Flush, which is 4:1 on the older, better table and 3:1 on this one.

## Example hands

All examples use a $10 Ante, plus a $10 Pair Plus bet where noted.

**1. Q♠ 7♦ 3♣ vs. dealer J♥ 9♣ 4♦.** Q-7-3 beats the Q-6-4 threshold, so you play ($10 more). The dealer has Jack-high and doesn't qualify. Ante wins $10, Play pushes. **Net +$10.**

**2. K♣ 8♦ 2♠ vs. dealer A♥ 5♣ 3♦.** You play. The dealer qualifies with Ace-high, which beats King-high. Ante and Play both lose. **Net −$20.**

**3. 7♥ 8♣ 9♦ with Pair Plus vs. dealer pair of 10s.** You play. The dealer's pair loses to your straight: Ante +$10, Play +$10, Ante Bonus +$10 ({{ threeCardPokerOdds.anteBonusStr.straight }}), Pair Plus +$60 ({{ threeCardPokerOdds.pairPlusStr.straight }}). **Net +$90.**

**4. J♦ 9♠ 5♣ with Pair Plus.** Jack-high is below Queen-6-4, so you fold. You lose the $10 Ante and the $10 Pair Plus. **Net −$20.** Pair Plus would have lost anyway: Jack-high isn't a paying hand.

**5. 4♥ 4♠ K♦ with Pair Plus vs. dealer straight.** You play. The dealer's straight beats your pair: Ante −$10, Play −$10. Pair Plus pays {{ threeCardPokerOdds.pairPlusStr.pair }} on your pair: +$10. **Net −$10.**

## Common beginner mistakes

- **Playing every hand.** Never folding raises the house edge on the Ante from {{ threeCardPokerOdds.houseEdge.ante }}% to {{ threeCardPokerOdds.houseEdge.alwaysPlay }}%.
- **Folding Queen-high hands that qualify.** Q-6-4 or better plays. See [Three Card Poker strategy](/strategy/three-card-poker/play-or-fold-strategy/).
- **Ranking a flush over a straight.** Not in this game.
- **Treating Pair Plus as the "smart" bet because it pays big.** On this table it carries a {{ threeCardPokerOdds.houseEdge.pairPlus }}% house edge, more than double the Ante. See [is Three Card Poker a good bet?](/strategy/three-card-poker/house-edge/)

## FAQ

### Does a straight beat a flush in Three Card Poker?

Yes. There are 720 three-card straights and 1,096 three-card flushes, so the straight is rarer and ranks higher.

### What does the dealer need to qualify?

Queen-high or better. If the dealer doesn't qualify, your Ante pays even money and your Play bet is returned.

### Can I bet only Pair Plus?

Yes. It's paid purely on your three cards, so there's no fold decision and the dealer's hand doesn't matter.

### Is the Ante Bonus paid if I lose to the dealer?

Yes, as long as you played the hand rather than folding.

### What happens on a tie?

If the dealer qualifies and your hand exactly ties theirs, the Ante and Play both push.

## Related

- [Three Card Poker Strategy: When to Play or Fold](/strategy/three-card-poker/play-or-fold-strategy/)
- [Is Three Card Poker a Good Bet? House Edge Explained](/strategy/three-card-poker/house-edge/)
- [Safest Casino Table Game](/strategy/safest-casino-table-game/)
