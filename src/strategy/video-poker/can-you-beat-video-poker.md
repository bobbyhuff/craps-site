---
title: "Can You Beat Video Poker With Perfect Strategy?"
seoTitle: "Can You Beat Video Poker With Perfect Strategy? | 0stakes"
description: "Perfect strategy gets 9/6 Jacks or Better to 99.54%, not past 100%. What expected return means, why winning sessions prove nothing, and where promotions fit in."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Video Poker
    url: /strategy/video-poker/
  - name: Can You Beat Video Poker?
    url: /strategy/video-poker/can-you-beat-video-poker/
---
**Quick answer:** Not on standard 9/6 Jacks or Better. Perfect strategy gets you to a **{{ videoPokerOdds.returnPct }}%** long-run return, which still leaves the casino a {{ videoPokerOdds.houseEdge }}% edge. Perfect strategy makes video poker one of the cheapest games in the building. It doesn't make it a winning one. Anyone who says otherwise is leaving out cash back, promotions, or a rare paytable.

## What "perfect strategy" means

Every video poker hand has 32 ways to hold cards, from holding nothing to holding all five. For each one, the outcome of the draw is random, but its **expected value** is fixed: average the payout over every possible set of replacement cards and you get one number.

Perfect strategy means always choosing the hold with the highest expected value. It isn't a feel for the game or a hunch about what's "due". It's a calculation, and computers have done it completely for common paytables.

The [0stakes video poker game](/games/video-poker/) does that calculation live. Press Best Hold and it evaluates all 32 holds against every possible draw from the 47 unseen cards, more than 2.6 million final hands.

## Expected value of a single hold

Take A♥ K♥ Q♥ J♥ 9♥, a pat flush. At 5 coins on 9/6:

- **Keep the flush:** it pays 6 per coin, guaranteed. EV = 6.00.
- **Hold A-K-Q-J and draw one:** of the 47 unseen cards, the 10♥ makes a Royal (800 per coin), the 7 other hearts make a flush (6), the 3 other 10s make a straight (4), and the 12 remaining Aces, Kings, Queens and Jacks make a high pair (1). The other 24 cards pay nothing. EV = (800 + 42 + 12 + 12) ÷ 47 = 866 ÷ 47 ≈ **18.43** per coin.

That's three times the value of the flush you already have. Perfect strategy is just doing this for every hand, including the dull ones like whether to keep K-Q or K-Q-J.

## Why the paytable sets the ceiling

Strategy decides how close you get to the paytable's maximum. It can't raise the maximum. For Jacks or Better at 5 coins, with perfect play for each table:

| Paytable | Best possible return |
|---|---:|
{% for t in videoPokerOdds.comparisonTables %}| {{ t.label }} | {{ t.returnPct }}% |
{% endfor %}

0stakes verifies the 9/6 figure exactly, {{ videoPokerOdds.returnPct }}% (99.5439% to four places), by playing every one of the 2,598,960 possible deals with its best hold. That test runs on every build of this site. Perfect play on an 8/5 machine is worse than sloppy play on a 9/6 one.

## Optimal vs. simplified strategy

| Strategy on 9/6 at 5 coins | Long-run return |
|---|---:|
| Perfect (optimal hold every hand) | {{ videoPokerOdds.returnPct }}% |
| The [beginner strategy chart](/strategy/video-poker/jacks-or-better-strategy-chart/) | {{ videoPokerOdds.simpleStrategyReturnPct }}% |
| Perfect, but 1 to 4 coins | {{ videoPokerOdds.returnPctUnderMaxCoins }}% |

The simplified chart disagrees with perfect strategy on about 2.3% of deals and costs under a tenth of a percent. Playing short coins costs more than ten times that.

## What above or below 100% means

- **Below 100%:** for every $100 you bet, the game pays back less than $100 on average. On 9/6 with perfect play, $99.54. You can win any particular session, but the more you play, the more reliably you trend toward that average loss.
- **Exactly 100%:** a break-even game in the long run.
- **Above 100%:** the player has the edge in the long run. A handful of rare paytables for other video poker games (full-pay Deuces Wild is the famous example) have published optimal-play returns slightly over 100%. They're hard to find, usually low-limit, and their strategies are much more complex than Jacks or Better.

Standard 9/6 Jacks or Better is below 100%. No hold strategy changes that.

## Why winning doesn't prove you have an edge

Video poker has a big gap between its long-run average and what happens in a session. The variance of 9/6 Jacks or Better is about {{ videoPokerOdds.variance }} per hand, a standard deviation of about 4.4 bets per hand.

Over 10,000 hands with perfect play:

- **Expected result:** 10,000 × 0.46% ≈ a loss of **46 bets**.
- **Standard deviation:** 4.4 × √10,000 ≈ **440 bets**.

The spread is almost ten times the expected loss. A player 300 bets up after 10,000 hands is well within normal luck, not proof of skill or a hot machine. The Royal Flush makes this worse: it arrives once every {{ videoPokerOdds.royalCycle }} hands on average and accounts for about 2 percentage points of the return. One Royal can turn a losing year into a winning one, and the next year can go without one.

## Variance and bankroll

Because so much of the return sits in rare hands, video poker bankrolls are measured in hundreds of bets:

- At $1.25 per hand (5 quarters), 400 bets is $500.
- At $5 per hand (5 dollars), 400 bets is $2,000.

Even a bankroll that size can run out on a cold streak. Pick a coin size where the swings don't matter to you, and see [bankroll management](/strategy/bankroll-management/) for how to set limits.

## Promotions: the careful version

Players who make money from video poker over time almost always do it with something outside the paytable:

- **Cash back or points** paid as a percentage of coin-in.
- **Bonus point multiplier days.**
- **Free play, mailers and drawings.**

The arithmetic is simple. If a casino genuinely returned an extra 0.5% of your coin-in as cash, 9/6 at {{ videoPokerOdds.returnPct }}% would become roughly 100.04% in total. That's a hypothetical example, not a typical offer, and it comes with real qualifications:

- Many rewards are paid as free play or comps, not cash, and are worth less than face value.
- Rewards rates on full-pay games are often lower than on short-pay ones.
- The edge from a promotion is tiny, so variance dominates for a very long time.
- Taxes, travel, and time all cost something.
- If you make even small strategy errors, the margin disappears.

Promotions can change the effective return. Perfect strategy alone doesn't. And 0stakes is play money only, so none of this applies here: on this site, the paytable is the whole story.

## FAQ

### Can you beat video poker in the long run?

Not on standard games like 9/6 Jacks or Better with strategy alone. It returns {{ videoPokerOdds.returnPct }}% with perfect play. A small number of rare paytables, or meaningful cash promotions, can push the effective return above 100%.

### What is the expected return of 9/6 Jacks or Better?

{{ videoPokerOdds.returnPct }}% at 5 coins with optimal play, verified exactly by 0stakes.

### Is there a profitable video poker strategy?

Not from holds alone on a sub-100% paytable. Strategy minimizes the house edge. Profit, where it exists, comes from paytables over 100% or from promotions.

### I've been winning for months. Doesn't that mean I'm beating it?

Not necessarily. With a standard deviation of about 4.4 bets per hand, months of winning can easily be ordinary luck, especially if you hit a Royal.

## Practice perfect strategy for free

The [0stakes game](/games/video-poker/) grades every hold you make against perfect play with Strategy check turned on. It's the closest thing to the theoretical {{ videoPokerOdds.returnPct }}%, with nothing at stake.

<p class="strategy-link"><a class="btn" href="/games/video-poker/">Practice perfect strategy →</a></p>

## Related

- [Jacks or Better Strategy Chart](/strategy/video-poker/jacks-or-better-strategy-chart/)
- [Video Poker Paytables Explained: 9/6 vs. 8/5](/strategy/video-poker/paytables/)
- [Video Poker vs. Slots](/strategy/video-poker/video-poker-vs-slots/)
- [Can You Make Money Playing Blackjack?](/strategy/blackjack/can-you-make-money-playing-blackjack/)
