---
title: "Crapless Craps Odds and Payouts Chart"
seoTitle: "Crapless Craps Odds & Payouts Chart: Every Point | 0stakes"
description: "Crapless Craps odds chart: ways to roll every point, true odds from 6:1 on 2 and 12 to 6:5 on 6 and 8, Place payouts and house edges, with bet-size examples."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Crapless Craps
    url: /strategy/crapless-craps/
  - name: Odds and Payouts
    url: /strategy/crapless-craps/odds-payouts/
---
**Quick answer:** In Crapless Craps every total except 7 can be a point. The Odds bet pays true odds on all ten: **{{ craplessOdds.trueOddsStr[2] }} on 2 or 12, {{ craplessOdds.trueOddsStr[3] }} on 3 or 11, {{ craplessOdds.trueOddsStr[4] }} on 4 or 10, {{ craplessOdds.trueOddsStr[5] }} on 5 or 9, {{ craplessOdds.trueOddsStr[6] }} on 6 or 8**. Place bets pay less than true odds, and the extreme numbers are the most expensive to place.

Every number on this page comes from the same data file that runs the [free Crapless Craps table](/games/crapless-craps/).

## Where every point probability comes from

Two dice have 36 equally likely combinations. A point wins if it rolls again before a 7, and 7 has 6 combinations. Every other roll is ignored. So the chance of making a point with *w* combinations is simply **w ÷ (w + 6)**.

| Point | Combinations | Ways to roll | Chance to make it before a 7 |
|---|---|---:|---:|
| 2 | 1-1 | 1 | 1 in 7 (14.3%) |
| 3 | 1-2, 2-1 | 2 | 1 in 4 (25.0%) |
| 4 | 1-3, 2-2, 3-1 | 3 | 1 in 3 (33.3%) |
| 5 | 1-4, 2-3, 3-2, 4-1 | 4 | 2 in 5 (40.0%) |
| 6 | 1-5, 2-4, 3-3, 4-2, 5-1 | 5 | 5 in 11 (45.5%) |
| 8 | 2-6, 3-5, 4-4, 5-3, 6-2 | 5 | 5 in 11 (45.5%) |
| 9 | 3-6, 4-5, 5-4, 6-3 | 4 | 2 in 5 (40.0%) |
| 10 | 4-6, 5-5, 6-4 | 3 | 1 in 3 (33.3%) |
| 11 | 5-6, 6-5 | 2 | 1 in 4 (25.0%) |
| 12 | 6-6 | 1 | 1 in 7 (14.3%) |

## True odds payout table

The Odds bet pays the ratio of losing ways to winning ways: 6 ways to roll a 7 against *w* ways to roll the point. That's why it has no house edge.

| Point | True odds | Odds pay | Max odds (0stakes) |
|---|---|---:|---:|
| 2 or 12 | 6 to 1 | {{ craplessOdds.trueOddsStr[2] }} | {{ craplessOdds.oddsMult[2] }}x |
| 3 or 11 | 6 to 2 | {{ craplessOdds.trueOddsStr[3] }} | {{ craplessOdds.oddsMult[3] }}x |
| 4 or 10 | 6 to 3 | {{ craplessOdds.trueOddsStr[4] }} | {{ craplessOdds.oddsMult[4] }}x |
| 5 or 9 | 6 to 4 | {{ craplessOdds.trueOddsStr[5] }} | {{ craplessOdds.oddsMult[5] }}x |
| 6 or 8 | 6 to 5 | {{ craplessOdds.trueOddsStr[6] }} | {{ craplessOdds.oddsMult[6] }}x |

Max odds limits vary by casino. The 0stakes table allows {{ craplessOdds.oddsMult[2] }}x on 2, 3, 4, 10, 11 and 12, {{ craplessOdds.oddsMult[5] }}x on 5 and 9, and {{ craplessOdds.oddsMult[6] }}x on 6 and 8.

## Place bet payouts

Place bets let you bet a number directly, any time. They pay less than true odds, and the gap is the house edge:

| Number | True odds | Place pays | House edge | Clean bet unit |
|---|---:|---:|---:|---|
| 2 or 12 | {{ craplessOdds.trueOddsStr[2] }} | {{ craplessOdds.placeOddsStr[2] }} | {{ craplessOdds.houseEdgeStr.place2or12 }}% | multiples of $2 |
| 3 or 11 | {{ craplessOdds.trueOddsStr[3] }} | {{ craplessOdds.placeOddsStr[3] }} | {{ craplessOdds.houseEdgeStr.place3or11 }}% | multiples of $4 |
| 4 or 10 | {{ craplessOdds.trueOddsStr[4] }} | {{ craplessOdds.placeOddsStr[4] }} | {{ craplessOdds.houseEdgeStr.place4or10 }}% | multiples of $5 |
| 5 or 9 | {{ craplessOdds.trueOddsStr[5] }} | {{ craplessOdds.placeOddsStr[5] }} | {{ craplessOdds.houseEdgeStr.place5or9 }}% | multiples of $5 |
| 6 or 8 | {{ craplessOdds.trueOddsStr[6] }} | {{ craplessOdds.placeOddsStr[6] }} | {{ craplessOdds.houseEdgeStr.place6or8 }}% | multiples of $6 |

Where the house edge comes from, using Place 2 as an example: you win 1 time in 7 and get paid 5.5 units, and lose 6 times in 7. Average result = (5.5 − 6) ÷ 7 ≈ −0.0714, the {{ craplessOdds.houseEdgeStr.place2or12 }}% edge. True odds would pay 6 units, and the half unit the casino keeps is the whole edge.

The 0stakes table books Buy bets (true odds minus a {{ craplessOdds.buyCommissionPct }}% commission) on 4, 5, 6, 8, 9 and 10 only, not on the four extreme numbers. Some casinos do allow buying 2, 3, 11 and 12.

## Odds payouts vs. house edge

These two get confused all the time:

- **A payout** is what a winning bet pays: {{ craplessOdds.trueOddsStr[2] }} on an odds bet behind the 2.
- **A house edge** is the average share of each bet the casino keeps over time.

A huge payout can come with a large edge (Place 2 at {{ craplessOdds.placeOddsStr[2] }}, {{ craplessOdds.houseEdgeStr.place2or12 }}%) or none at all (Odds on 2 at {{ craplessOdds.trueOddsStr[2] }}, 0%). The payout only tells you how much you win when you win. The edge is what it costs.

And remember the Odds bet sits behind a Pass Line or Come bet, which in Crapless carries a {{ craplessOdds.houseEdgeStr.passLine }}% edge. You can't make the zero-edge bet without the expensive one.

## Examples for common bet sizes

**Odds bets** (winnings, not counting the bet itself):

| Point | $5 odds | $10 odds | $25 odds |
|---|---:|---:|---:|
| 2 or 12 | $30 | $60 | $150 |
| 3 or 11 | $15 | $30 | $75 |
| 4 or 10 | $10 | $20 | $50 |
| 5 or 9 | $7.50 | $15 | $37.50 |
| 6 or 8 | $6 | $12 | $30 |

On 5 and 9, bet odds in even amounts so the 3:2 payout comes out in whole dollars.

**Place bets:**

- $10 on the 2 (or 12) wins $55.
- $4 on the 3 (or 11) wins $11. $5 wins $13.75, which a live table may round down.
- $10 on the 4 (or 10) wins $18.
- $10 on the 5 (or 9) wins $14.
- $12 on the 6 (or 8) wins $14.

## The extreme points: 2, 3, 11 and 12

These four numbers are what make Crapless different, and they behave very differently from the rest:

- **They're rare.** Together they come up 6 times in 36 rolls. A 2 or 12 point is made only about 14% of the time.
- **When they hit, they pay a lot.** Pass Line plus 3x odds on a point of 12 is $10 + $30 behind it, paying $10 + $180 = $190 on a win.
- **Most of the time they lose.** On a 2 or 12 point you'll lose the Pass Line and odds about 6 times in 7.
- **Placing them is expensive.** Place 2 or 12 at {{ craplessOdds.houseEdgeStr.place2or12 }}% costs more than any Place bet in regular craps, where the worst is Place 4 or 10 at {{ odds.houseEdgeStr.place4or10 }}%. Place 3 or 11 at {{ craplessOdds.houseEdgeStr.place3or11 }}% is only slightly cheaper than that.

Taking odds on an extreme point is mathematically fair (0% edge) but very volatile. It doesn't fix the Pass Line edge underneath.

## Comparison with regular craps

| | Regular craps | Crapless Craps |
|---|---|---|
| Point numbers | 4, 5, 6, 8, 9, 10 | 2 through 12, except 7 |
| Odds on 4 through 10 | Same | Same |
| Odds on 2, 3, 11, 12 | Not possible | {{ craplessOdds.trueOddsStr[2] }} / {{ craplessOdds.trueOddsStr[3] }} |
| Place 6 or 8 | {{ odds.placeOddsStr[6] }}, {{ odds.houseEdgeStr.place6or8 }}% | {{ craplessOdds.placeOddsStr[6] }}, {{ craplessOdds.houseEdgeStr.place6or8 }}% |
| Place 2/12, 3/11 | Not offered | {{ craplessOdds.houseEdgeStr.place2or12 }}% / {{ craplessOdds.houseEdgeStr.place3or11 }}% |
| Pass Line edge | {{ odds.houseEdgeStr.passLine }}% | {{ craplessOdds.houseEdgeStr.passLine }}% |

The full comparison, including why the Pass Line gets so much worse, is in [Crapless Craps vs. regular craps](/strategy/crapless-craps/crapless-vs-regular-craps/). Regular craps' complete chart is the [craps odds and payouts chart](/strategy/craps/house-edge/).

## FAQ

### What are the odds on a 2 or 12 in Crapless Craps?

The point is made 1 time in 7. The Odds bet pays {{ craplessOdds.trueOddsStr[2] }}. A Place bet pays {{ craplessOdds.placeOddsStr[2] }}.

### What does Place 3 or 11 pay in Crapless?

{{ craplessOdds.placeOddsStr[3] }}, a {{ craplessOdds.houseEdgeStr.place3or11 }}% house edge. Bet in $4 units for whole-dollar payouts.

### What's the best bet in Crapless Craps?

The Odds bet (0% edge), which requires a Pass Line or Come bet first. After that, Place 6 or 8 at {{ craplessOdds.houseEdgeStr.place6or8 }}%.

### Are the odds payouts different from regular craps?

Not on 4, 5, 6, 8, 9 and 10. Crapless adds {{ craplessOdds.trueOddsStr[2] }} odds on 2 and 12 and {{ craplessOdds.trueOddsStr[3] }} on 3 and 11.

<p class="strategy-link"><a class="btn" href="/games/crapless-craps/">Try every point free on Crapless Craps →</a></p>
<p class="strategy-link"><a href="/games/craps/">Or play standard craps →</a></p>

## Related

- [How to Play Crapless Craps](/strategy/crapless-craps/how-to-play/)
- [Crapless Craps vs. Regular Craps](/strategy/crapless-craps/crapless-vs-regular-craps/)
- [Craps Odds and Payouts Chart](/strategy/craps/house-edge/)
