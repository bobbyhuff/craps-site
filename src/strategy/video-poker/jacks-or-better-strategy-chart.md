---
title: "Jacks or Better Strategy Chart: What Cards Should You Hold?"
seoTitle: "Jacks or Better Strategy Chart: What Cards to Hold | 0stakes"
description: "A beginner-friendly 9/6 Jacks or Better strategy chart, ranked by hold priority, with worked examples and the exact cost of using it instead of perfect play."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Video Poker
    url: /strategy/video-poker/
  - name: Jacks or Better Strategy Chart
    url: /strategy/video-poker/jacks-or-better-strategy-chart/
---
**Quick answer:** Look down the chart below and hold the first line your hand matches. Played this way, {{ videoPokerOdds.version }} Jacks or Better returns about **{{ videoPokerOdds.simpleStrategyReturnPct }}%**. Perfect play returns {{ videoPokerOdds.returnPct }}%. The chart is a simplified beginner strategy, not perfect strategy, and that gap is the price of fitting it on one screen.

## Why the hold matters

In video poker, the only thing you control is which cards you keep. Every possible hold has an exact expected value: the average payout across every card the draw could bring. The right hold is simply the one with the highest average.

The differences are often large. Holding four cards to a Royal Flush instead of a pat flush is worth roughly three times as much. Keeping a pair of 4s instead of A-K is worth about 70% more. Small leaks repeated over thousands of hands are how players turn a {{ videoPokerOdds.returnPct }}% game into a much worse one.

## The strategy depends on the paytable

A strategy chart is built for one specific paytable. This one is for the 9/6 table in the [free video poker game](/games/video-poker/):

| Hand | Pays per coin (5 coins) |
|---|---:|
{% for row in videoPokerOdds.paytable %}| {{ row.name }} | {{ row.pays[4] | divided_by: 5.0 }} |
{% endfor %}

When the paytable changes, the value of every draw changes with it. On an 8/5 machine, a four-card flush draw is worth less because the flush pays less. In the hands 0stakes tested, the 9/6 chart still pointed to the right hold on 8/5, but close decisions can flip on other games, and a Jacks or Better chart is useless for Deuces Wild or Double Bonus. See [video poker paytables explained](/strategy/video-poker/paytables/) for what the different tables cost.

## The beginner strategy chart (9/6 Jacks or Better, 5 coins)

Start at the top. Hold the first line that matches your hand and discard everything else.

| Priority | Hold |
|---:|---|
| 1 | Royal Flush, Straight Flush, Four of a Kind (pat hands) |
| 2 | 4 cards to a Royal Flush |
| 3 | Full House, Flush, Straight, Three of a Kind |
| 4 | 4 cards to a Straight Flush |
| 5 | Two Pair |
| 6 | High pair (Jacks, Queens, Kings or Aces) |
| 7 | 3 cards to a Royal Flush |
| 8 | 4 cards to a Flush |
| 9 | Low pair (2s through 10s) |
| 10 | 4 cards to an open-ended straight (like 6-7-8-9) |
| 11 | 2 suited high cards |
| 12 | 3 cards to a Straight Flush |
| 13 | 2 unsuited high cards (with three, keep the lowest two) |
| 14 | 10 with a suited Jack, Queen or King |
| 15 | 1 high card |
| 16 | Nothing: draw five new cards |

"High cards" are Jacks, Queens, Kings and Aces, the ranks that can pair into a paying hand. With three of a kind, hold the three and discard the other two. With two pair, hold both pairs and discard the fifth card.

### How good is it?

0stakes checked this chart against every one of the 2,598,960 possible deals. It returns **99.46%**, and it picks a different hold from perfect strategy on about 2.3% of deals. Those disagreements are almost all close calls, which is why the total cost is under a tenth of a percent.

So the chart is accurate for the hands it was designed for, but it is **not mathematically optimal**. Perfect strategy has dozens of lines and exceptions (penalty cards, specific inside straights, suited combinations with 10s). If you want the exact best hold for any hand, the game's Best Hold button calculates it directly.

## Worked examples

Each number is the exact expected return per coin at 5 coins, computed by enumerating every possible draw. Higher is better.

**K♥ Q♥ J♥ 7♥ 2♣: three to a Royal or four to a Flush?**
Hold K-Q-J (**1.48**). The four-card flush is worth 1.34. Line 7 beats line 8.

**J♥ J♣ 4♥ 7♥ 9♥: high pair or four to a Flush?**
Hold the Jacks (**1.54**). The flush draw is worth 1.19. A paying pair you already have beats a draw you'll miss about four times in five.

**5♥ 5♣ 8♥ K♥ 2♥: low pair or four to a Flush?**
Hold the four hearts (**1.21**). The pair of 5s is worth 0.82. Unlike Jacks, a low pair pays nothing as it stands.

**6♣ 6♦ 7♥ 8♠ 9♣: low pair or an open-ended straight?**
Hold the 6s (**0.82**). The straight draw is worth 0.68.

**9♠ 10♠ J♠ Q♠ 2♦: four to a Straight Flush.**
Hold the four spades (**3.66**). Dropping the 9 for a three-card Royal draw is worth only 1.38.

**5♥ 6♥ 7♥ K♣ Q♦: three to a Straight Flush or two high cards?**
Hold 5-6-7 suited (**0.63**). K-Q unsuited is worth 0.49.

**A♣ K♦ Q♥ 6♠ 3♣: three unsuited high cards.**
Hold K-Q (**0.48**), the lowest two. A-K and A-Q are each worth 0.47, and all three together only 0.46. The Ace is the weakest high card to keep here because it can only make a straight one way.

**10♥ J♥ 4♣ 7♦ 2♠: suited J-10 or the Jack alone?**
Hold J-10 (**0.51**). The Jack by itself is worth 0.47.

**3♣ 3♦ 3♥ 9♠ 2♦: three of a kind.**
Hold the three 3s (**4.30**). Keeping a kicker drops it to 3.85, because you lose a draw at four of a kind.

## The mistakes that cost the most

- **Keeping a kicker** with a pair or trips. It never helps in Jacks or Better.
- **Holding a single high card over a low pair.** Line 9 is above line 15 by a wide margin.
- **Keeping a pat flush or straight when you hold four to a Royal.** Hold the four.
- **Holding three high cards.** Keep the lowest two.
- **Holding four to an inside straight** instead of high cards or a fresh draw. It isn't on the chart for a reason.

## How strategy affects the return

A chart doesn't change the paytable. It only decides how close you get to the return the paytable allows:

| How you play 9/6 Jacks or Better at 5 coins | Long-run return |
|---|---:|
| Perfect strategy (every hold optimal) | {{ videoPokerOdds.returnPct }}% |
| The beginner chart on this page | {{ videoPokerOdds.simpleStrategyReturnPct }}% |
| Perfect strategy, but 1 to 4 coins | {{ videoPokerOdds.returnPctUnderMaxCoins }}% |

Errors outside the chart, like keeping kickers or holding a lone Ace over a low pair, cost more than the gap between the first two rows. Even perfect play stays below 100%, so the chart is a way to lose less, not a way to win. [Can you beat video poker?](/strategy/video-poker/can-you-beat-video-poker/) goes into that.

## Practice the chart

The [free video poker game](/games/video-poker/) has a **Strategy check** option that grades every hold you make against perfect play and tells you the cost of each mistake. It's the fastest way to learn which lines you're getting wrong.

<p class="strategy-link"><a class="btn" href="/games/video-poker/">Practice with Strategy check →</a></p>

## FAQ

### Is this the optimal Jacks or Better strategy?

No. It's a simplified chart that returns {{ videoPokerOdds.simpleStrategyReturnPct }}% against {{ videoPokerOdds.returnPct }}% for perfect strategy on 9/6. Perfect strategy needs a longer list with exceptions. The Best Hold button in the game computes the exact optimal hold for any hand.

### Should I hold a high card kicker with a pair?

No. In Jacks or Better a kicker never improves your expected return. Hold the pair alone.

### Do I hold a low pair or two high cards?

The low pair. A pair of 2s through 10s is worth noticeably more than any two high cards.

### Does the chart work on 8/5 Jacks or Better?

It's built for 9/6. Most decisions are the same on 8/5, but the game returns about 2.2 percentage points less however well you play. See [9/6 vs. 8/5 paytables](/strategy/video-poker/paytables/).

### Does the chart work on Deuces Wild or Double Bonus?

No. Different paytables and wild cards change the strategy completely.

## Related

- [How to Play Video Poker: Rules, Payouts and Strategy](/strategy/video-poker/how-to-play/)
- [Video Poker Paytables Explained: 9/6 vs. 8/5](/strategy/video-poker/paytables/)
- [Can You Beat Video Poker With Perfect Strategy?](/strategy/video-poker/can-you-beat-video-poker/)
