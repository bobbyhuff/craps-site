---
title: "Is Three Card Poker a Good Bet? House Edge Explained"
seoTitle: "Three Card Poker House Edge: Ante vs Pair Plus Odds | 0stakes"
description: "Three Card Poker's house edge explained: 3.37% per Ante, 2.01% of total action, and 7.28% on Pair Plus. What each number means and what bad strategy costs."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Three Card Poker
    url: /strategy/three-card-poker/
  - name: House Edge
    url: /strategy/three-card-poker/house-edge/
---
**Quick answer:** With correct play, the Ante and Play cost **{{ threeCardPokerOdds.houseEdge.ante }}% of your Ante**, which works out to **{{ threeCardPokerOdds.houseEdge.elementOfRisk }}% of all the money you put on the table**. Pair Plus on a {{ threeCardPokerOdds.pairPlus.label }} table costs **{{ threeCardPokerOdds.houseEdge.pairPlus }}%**. That makes the Ante a middle-of-the-pack table bet and Pair Plus an expensive one.

Every figure on this page is exact for the rules in the [0stakes Three Card Poker game](/games/three-card-poker/), computed by enumerating every player hand against every dealer hand. Other casinos' rules can differ, mostly in the Pair Plus and Ante Bonus tables.

## How the house edge works here

House edge is the casino's average profit, as a percentage of some amount of money bet, over a very large number of hands. In most games "some amount" is obvious: you bet $10, the edge is a share of $10.

Three Card Poker makes it less obvious, because your total bet isn't fixed. You put up an Ante, then either fold (total bet = one Ante) or play (total bet = two Antes). So there are two honest ways to state the same edge.

## Two numbers, one game

| Measure | Divide the average loss by | Value |
|---|---|---:|
| **House edge per Ante** | The Ante only | {{ threeCardPokerOdds.houseEdge.ante }}% |
| **Element of risk** | Everything wagered (Ante + Play when played) | {{ threeCardPokerOdds.houseEdge.elementOfRisk }}% |

The average dollar loss is identical in both: about **$0.34 per hand on a $10 Ante**. The per-Ante figure is easier to plan with, because it's tied to the unit you choose. The element of risk is better for comparing against games where you always bet the same amount, like roulette or baccarat.

Whenever you see a single Three Card Poker house edge quoted, check which one it is. Quoting 2.01% next to roulette's per-bet edge without saying so flatters the game.

## Ante and Play with correct strategy

Correct strategy is the [Q-6-4 rule](/strategy/three-card-poker/play-or-fold-strategy/): play Queen-6-4 or better, fold the rest. The pieces that make up the edge:

- **Folding** about {{ threeCardPokerOdds.foldPct }}% of hands, losing one Ante each time.
- **Dealer qualification.** The dealer qualifies with Queen-high or better about {{ threeCardPokerOdds.dealerQualifiesPct }}% of the time. When the dealer doesn't, your Ante wins even money and your Play pushes, even with a weak hand.
- **The Ante Bonus** ({{ threeCardPokerOdds.anteBonusStr.straightFlush }} straight flush, {{ threeCardPokerOdds.anteBonusStr.trips }} trips, {{ threeCardPokerOdds.anteBonusStr.straight }} straight), paid whenever you play those hands, win or lose.

Without the Ante Bonus, the game would be noticeably worse for the player. Without folding, it would be much worse.

## The cost of the wrong strategy

| How you play the Ante | House edge per Ante | Average loss per $10 Ante |
|---|---:|---:|
| Q-6-4 rule | {{ threeCardPokerOdds.houseEdge.ante }}% | $0.34 |
| Play any Queen-high or better | {{ threeCardPokerOdds.houseEdge.mimicDealer }}% | $0.35 |
| Play King-high or better only | {{ threeCardPokerOdds.houseEdge.kingHigh }}% | $0.50 |
| Never fold | {{ threeCardPokerOdds.houseEdge.alwaysPlay }}% | $0.77 |

Getting the Queen-high details slightly wrong is cheap. Folding too much or never folding is not: never folding more than doubles what the game costs.

## Pair Plus: payouts and house edge

Pair Plus pays on your three cards alone. Its edge depends entirely on the paytable, and casinos use several. The two most common, with exact house edges:

| Hand | Probability | {{ threeCardPokerOdds.pairPlusTables['40-30-6-4-1'].label }} | {{ threeCardPokerOdds.pairPlusTables['40-30-6-3-1'].label }} (0stakes) |
|---|---:|---:|---:|
| Straight Flush | 0.22% | 40:1 | {{ threeCardPokerOdds.pairPlusStr.straightFlush }} |
| Three of a Kind | 0.24% | 30:1 | {{ threeCardPokerOdds.pairPlusStr.trips }} |
| Straight | 3.26% | 6:1 | {{ threeCardPokerOdds.pairPlusStr.straight }} |
| Flush | 4.96% | 4:1 | {{ threeCardPokerOdds.pairPlusStr.flush }} |
| Pair | 16.94% | 1:1 | {{ threeCardPokerOdds.pairPlusStr.pair }} |
| **House edge** | | **{{ threeCardPokerOdds.pairPlusTables['40-30-6-4-1'].houseEdge }}%** | **{{ threeCardPokerOdds.pairPlusTables['40-30-6-3-1'].houseEdge }}%** |

## Why side bet paytables matter so much

The only difference between those two tables is the flush: 4:1 versus 3:1. A flush shows up on about 4.96% of hands, so cutting its payout by one unit takes about 4.96% off the bet's return. That one line triples the house edge, from {{ threeCardPokerOdds.pairPlusTables['40-30-6-4-1'].houseEdge }}% to {{ threeCardPokerOdds.pairPlusTables['40-30-6-3-1'].houseEdge }}%.

It's the same pattern as [video poker's 9/6 vs. 8/5 paytables](/strategy/video-poker/paytables/): a change to a common, mid-sized payout costs far more than it looks like, while the big headline payouts stay the same. Check the flush line before betting Pair Plus anywhere.

## Worked examples

Assume 60 hands per hour (a typical full-table pace).

**$10 Ante only, Q-6-4 strategy.**
Expected loss = 60 × $10 × {{ threeCardPokerOdds.houseEdge.ante }}% ≈ **$20 per hour**.

**$10 Ante plus $10 Pair Plus (0stakes table).**
Ante: ≈ $20. Pair Plus: 60 × $10 × {{ threeCardPokerOdds.houseEdge.pairPlus }}% ≈ $44. **Total ≈ $64 per hour.** Pair Plus is now more than two thirds of your cost.

**$10 Ante, never folding.**
60 × $10 × {{ threeCardPokerOdds.houseEdge.alwaysPlay }}% ≈ **$46 per hour**, before any Pair Plus.

These are long-run averages. One hour of Three Card Poker can easily finish well above or below them.

## How it compares with other table games

Using the edges published across 0stakes (each one per unit bet unless noted):

| Bet | House edge |
|---|---:|
| Craps Pass Line | {{ odds.houseEdgeStr.passLine }}% |
| Baccarat Banker | {{ baccaratOdds.houseEdge.banker }}% |
| Pai Gow Poker, house way | about {{ paiGowOdds.houseEdge }}% |
| Three Card Poker Ante (per Ante) | {{ threeCardPokerOdds.houseEdge.ante }}% |
| American Roulette | {{ rouletteOdds.houseEdge.standard }}% |
| Three Card Poker Pair Plus ({{ threeCardPokerOdds.pairPlus.label }}) | {{ threeCardPokerOdds.houseEdge.pairPlus }}% |

The full list, including blackjack and video poker, is on the [casino house edge chart](/strategy/house-edge/).

## Is Three Card Poker a good bet?

The Ante with Q-6-4 strategy is a reasonable bet by casino standards: cheaper than American roulette, more expensive than the craps Pass Line or baccarat Banker. It's simple to play correctly, which helps.

Pair Plus is a fun side bet with a high price. On a 40-30-6-4-1 table it's a much more reasonable {{ threeCardPokerOdds.pairPlusTables['40-30-6-4-1'].houseEdge }}%; on {{ threeCardPokerOdds.pairPlus.label }} it's one of the more expensive bets at a typical table.

No strategy makes either bet positive. The Q-6-4 rule makes the Ante as cheap as it can be.

## FAQ

### What is the house edge on Three Card Poker?

{{ threeCardPokerOdds.houseEdge.ante }}% of the Ante with optimal Q-6-4 strategy, or {{ threeCardPokerOdds.houseEdge.elementOfRisk }}% of total money wagered. Pair Plus is separate: {{ threeCardPokerOdds.houseEdge.pairPlus }}% on a {{ threeCardPokerOdds.pairPlus.label }} table.

### What is the RTP of Three Card Poker?

RTP is 100% minus the house edge, so about {{ threeCardPokerOdds.houseEdge.ante | minus: 100 | times: -1 | round: 2 }}% of the Ante with correct play. State which denominator you're using when you quote it.

### What are the Pair Plus odds?

You get a pair or better on about 25.6% of hands. The most common paying hand is a pair (16.94%). A straight flush comes about once in 460 hands.

### Is Pair Plus worth betting?

On the 40-30-6-4-1 table, it's comparable to a lot of table bets at {{ threeCardPokerOdds.pairPlusTables['40-30-6-4-1'].houseEdge }}%. On the {{ threeCardPokerOdds.pairPlus.label }} table, it costs more than double the Ante.

<p class="strategy-link"><a class="btn" href="/games/three-card-poker/">Play Three Card Poker free →</a></p>

## Related

- [How to Play Three Card Poker](/strategy/three-card-poker/how-to-play/)
- [Three Card Poker Strategy: When to Play or Fold](/strategy/three-card-poker/play-or-fold-strategy/)
- [Safest Casino Table Game](/strategy/safest-casino-table-game/)
