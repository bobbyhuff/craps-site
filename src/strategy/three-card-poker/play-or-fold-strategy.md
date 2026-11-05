---
title: "Three Card Poker Strategy: When to Play or Fold"
seoTitle: "Three Card Poker Strategy: Q-6-4 Play or Fold Rule | 0stakes"
description: "The Q-6-4 rule for Three Card Poker: play Queen-6-4 or better, fold the rest. Worked hands, why it works, what mistakes cost, and where Pair Plus fits."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Three Card Poker
    url: /strategy/three-card-poker/
  - name: Play or Fold Strategy
    url: /strategy/three-card-poker/play-or-fold-strategy/
---
**Quick answer:** Play any hand that's **Queen-6-4 or better**. Fold anything worse. Any pair or better always plays. With standard Ante and Play rules, this one rule is the optimal strategy, and it holds the house edge to {{ threeCardPokerOdds.houseEdge.ante }}% of your Ante.

## Why strategy matters

Three Card Poker has exactly one decision: after seeing your three cards, fold (and lose your Ante) or play (and put up a Play bet equal to your Ante). That decision is the only thing you control, and it moves the house edge a lot.

| Strategy | House edge per Ante |
|---|---:|
| **Q-6-4 rule** | **{{ threeCardPokerOdds.houseEdge.ante }}%** |
| Play any Queen-high or better ("mimic the dealer") | {{ threeCardPokerOdds.houseEdge.mimicDealer }}% |
| Play only King-high or better | {{ threeCardPokerOdds.houseEdge.kingHigh }}% |
| Never fold | {{ threeCardPokerOdds.houseEdge.alwaysPlay }}% |

Never folding more than doubles the cost of the game. 0stakes computed every row by enumerating all 22,100 player hands against every possible dealer hand, under the [0stakes game's](/games/three-card-poker/) exact rules, and the build tests re-check them.

## The Q-6-4 rule, explained

Sort your three cards from highest to lowest and compare them to Q-6-4, one card at a time:

1. **Any pair, flush, straight, trips or straight flush:** play.
2. **King-high or Ace-high:** play.
3. **Jack-high or lower:** fold.
4. **Queen-high:** look at your second card.
   - Higher than 6 → play.
   - Lower than 6 → fold.
   - Exactly 6 → look at your third card. 4 or higher → play. 3 or 2 → fold.

That's the whole strategy. It means folding about {{ threeCardPokerOdds.foldPct }}% of hands.

## Why Q-6-4 is the line

When you play, you add a second bet equal to your Ante. That's worth it only if your expected result from playing beats the certain loss of one Ante from folding.

Two things make weak hands worth playing at all:

- **The dealer fails to qualify** about {{ threeCardPokerOdds.dealerQualifiesPct | minus: 100 | times: -1 | round: 2 }}% of the time. Then your Ante wins even money and your Play bet comes back, no matter what you hold.
- **When the dealer does qualify,** they have at least Queen-high, so a Queen-high hand of yours only wins if its lower cards beat the dealer's.

Below Q-6-4, the hands that qualify against you beat you so often that the extra Play bet loses more than the fold costs. Above it, playing loses less than folding. Q-6-4 is where those two lines cross.

## Worked examples

The numbers below are the exact expected result of **playing** each hand, in Antes, enumerated over every possible dealer hand (Ante Bonus included). Folding is always exactly −1.00.

| Your hand | Expected result if you play | Decision |
|---|---:|---|
| A♥ 4♦ 2♣ | +0.09 | Play |
| K♥ 3♦ 2♣ | −0.55 | Play |
| Q♥ 7♦ 2♣ | −0.98 | Play |
| Q♥ 6♦ 5♣ | −0.99 | Play |
| **Q♥ 6♦ 4♣** | **−0.993** | **Play (barely)** |
| Q♥ 6♦ 3♣ | −1.003 | Fold (barely) |
| Q♥ 5♦ 4♣ | −1.02 | Fold |
| J♥ 10♦ 8♣ | −1.14 | Fold |
| 2♥ 2♦ 3♣ | +0.68 | Play |

Look at the threshold: Q-6-4 plays at −0.993, Q-6-3 folds because playing would be −1.003. The decisions right at the line are worth less than a penny on a $10 Ante. Getting the big ones right, like playing every King-high and folding every Jack-high, is what matters.

Notice also that playing Q-7-2 is a losing proposition (−0.98 Antes). You play it because folding loses slightly more, not because it's a good hand.

## How dealer qualification shapes the game

Dealer qualification is why you can profitably play hands that are usually behind. Under the Q-6-4 strategy, every hand dealt ends in one of these outcomes:

| Outcome | Share of all hands |
|---|---:|
| You fold | 32.6% |
| Dealer doesn't qualify (Ante wins, Play pushes) | 21.0% |
| You beat a qualifying dealer | 23.9% |
| A qualifying dealer beats you | 22.4% |
| Tie | 0.07% |

The 21% of non-qualifying dealer hands is free money on the Ante, and it's what lets marginal Queen-high hands play.

## Does Pair Plus change the play or fold decision?

No. Treat Pair Plus as a separate bet.

Pair Plus pays only on a pair or better. Every hand that ranks below Q-6-4 is a high-card hand, and high-card hands never pay on Pair Plus. So in the 0stakes game, where folding also forfeits the Pair Plus bet, folding a sub-Q-6-4 hand never throws away a Pair Plus win. And every hand that Pair Plus does pay on is a pair or better, which you play anyway.

The decision you make about Pair Plus is whether to bet it at all, before the deal. On the {{ threeCardPokerOdds.pairPlus.label }} table it has a {{ threeCardPokerOdds.houseEdge.pairPlus }}% house edge, more than double the Ante. See [Three Card Poker house edge](/strategy/three-card-poker/house-edge/).

## House edge with correct play

With Q-6-4 strategy:

- **{{ threeCardPokerOdds.houseEdge.ante }}% per Ante.** On a $10 Ante, an average cost of about $0.34 per hand.
- **{{ threeCardPokerOdds.houseEdge.elementOfRisk }}% of total money wagered,** because you also put up a Play bet on about two thirds of hands.

Both numbers describe the same game. They just divide by different things. The [house edge guide](/strategy/three-card-poker/house-edge/) explains which one to use when.

## Common betting misconceptions

- **"Mimic the dealer: play Queen-high or better."** Close, but it costs {{ threeCardPokerOdds.houseEdge.mimicDealer }}% instead of {{ threeCardPokerOdds.houseEdge.ante }}% because it plays Q-5-x and Q-6-3, which are folds.
- **"Fold more to lose less."** Folding King-high hands is expensive. Play-only-King-or-better costs {{ threeCardPokerOdds.houseEdge.kingHigh }}%.
- **"The Ante Bonus makes playing everything worth it."** It doesn't; never folding is the most expensive strategy in the table above.
- **"You're due a good hand after folding a few."** Each hand is a fresh shuffle.
- **"A big Pair Plus win means the strategy works."** Pair Plus results say nothing about your Ante decisions.

## FAQ

### What is the Q-6-4 rule?

Play any hand that's Queen-6-4 or better and fold anything worse. Compare highest card first, then the second, then the third.

### Should I play Queen-high in Three Card Poker?

Only if it's Q-6-4 or better. Q-7-2 plays. Q-6-3 and Q-5-4 fold.

### Is Q-6-4 really optimal?

For the standard rules used by 0stakes (dealer qualifies with Queen-high, Ante and Play pay 1:1, Ante Bonus {{ threeCardPokerOdds.anteBonusStr.straightFlush }}/{{ threeCardPokerOdds.anteBonusStr.trips }}/{{ threeCardPokerOdds.anteBonusStr.straight }}), yes: exact enumeration confirms it makes the best decision on every one of the 22,100 hands. Different house rules could move the line slightly.

### Should I fold a pair?

Never. Any pair or better always plays.

### Does Pair Plus change when I should fold?

No. The Ante decision is the same whether or not you bet Pair Plus.

<p class="strategy-link"><a class="btn" href="/games/three-card-poker/">Practice the Q-6-4 rule free →</a></p>

## Related

- [How to Play Three Card Poker](/strategy/three-card-poker/how-to-play/)
- [Is Three Card Poker a Good Bet? House Edge Explained](/strategy/three-card-poker/house-edge/)
- [Casino house edge, every game ranked](/strategy/house-edge/)
