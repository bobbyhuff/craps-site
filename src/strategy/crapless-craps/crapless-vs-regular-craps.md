---
title: "Crapless Craps vs. Regular Craps: House Edge Compared"
seoTitle: "Crapless Craps vs Regular Craps: House Edge Compared | 0stakes"
description: "Crapless vs regular craps side by side: come-out rules, points, odds, available bets, and why the Pass Line edge jumps from 1.41% to 5.38%, with dollar examples."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Crapless Craps
    url: /strategy/crapless-craps/
  - name: Crapless vs. Regular Craps
    url: /strategy/crapless-craps/crapless-vs-regular-craps/
---
**Quick answer:** Regular craps is the better game mathematically. The Pass Line costs **{{ odds.houseEdgeStr.passLine }}%** in regular craps and **{{ craplessOdds.houseEdgeStr.passLine }}%** in Crapless, almost four times as much. Crapless removes the come-out losses on 2, 3 and 12, but it also takes away the instant win on 11, and that loss is bigger than the gain.

Both games run on the same engine at 0stakes: [regular craps](/games/craps/) and [Crapless Craps](/games/crapless-craps/).

## Side-by-side comparison

| | Regular craps | Crapless Craps |
|---|---|---|
| Come-out winners | 7, 11 | 7 only |
| Come-out losers | 2, 3, 12 | None |
| Point numbers | 4, 5, 6, 8, 9, 10 | 2, 3, 4, 5, 6, 8, 9, 10, 11, 12 |
| Pass Line wins | 49.3% of decisions | 47.3% of decisions |
| Pass Line house edge | {{ odds.houseEdgeStr.passLine }}% | {{ craplessOdds.houseEdgeStr.passLine }}% |
| Pass Line + max odds (per total wagered) | {{ odds.houseEdgeStr.passLineFullOdds }}% | {{ craplessOdds.houseEdgeStr.passLineFullOdds }}% |
| Don't Pass / Don't Come | Offered ({{ odds.houseEdgeStr.dontPass }}%) | Not offered |
| Place numbers | 4, 5, 6, 8, 9, 10 | All ten |
| Field, hardways, one-roll props | Same | Same |
| Average rolls per Pass Line decision | about 3.4 | about 4.2 |

The max-odds rows assume the 0stakes limits: {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x in regular craps, and {{ craplessOdds.oddsMult[2] }}x on 2, 3, 11 and 12 in Crapless.

## Come-out rules

This is the only real rule change.

- **Regular:** 7 or 11 wins (8 of 36 combinations). 2, 3 or 12 loses (4 of 36). Anything else is a point (24 of 36).
- **Crapless:** 7 wins (6 of 36). Everything else is a point (30 of 36).

## Point numbers and odds payouts

Every point pays its true odds on the Odds bet in both games. Crapless just has four more of them.

| Point | Odds pay | In regular craps? |
|---|---:|---|
| 2 or 12 | {{ craplessOdds.trueOddsStr[2] }} | No |
| 3 or 11 | {{ craplessOdds.trueOddsStr[3] }} | No |
| 4 or 10 | {{ odds.trueOddsStr[4] }} | Yes |
| 5 or 9 | {{ odds.trueOddsStr[5] }} | Yes |
| 6 or 8 | {{ odds.trueOddsStr[6] }} | Yes |

## Why the Crapless Pass Line costs more

Track what happens to the four numbers that changed, per Pass Line bet of 1 unit:

**2, 3 and 12 (4 combinations out of 36).** In regular craps they lose 1 unit immediately. In Crapless they become points you sometimes make: 2 and 12 win 1 time in 7, and 3 wins 1 time in 4. That gives back about **4.4 percentage points** of house edge.

**11 (2 combinations out of 36).** In regular craps it wins 1 unit immediately. In Crapless it becomes a point that wins only 1 time in 4, so on average it's worth −0.5 units instead of +1. That costs about **8.3 percentage points**.

Net: 8.3 − 4.4 ≈ **3.97 points worse**. Add that to regular craps' {{ odds.houseEdgeStr.passLine }}% and you get Crapless's {{ craplessOdds.houseEdgeStr.passLine }}%. 0stakes recomputes both edges exactly from the 36 dice combinations in its test suite, and simulates the Crapless win rate through the actual game engine.

The trade feels good at the table because craps on the come-out is common and memorable, while the lost 11 is easy to forget. The math doesn't care how it feels.

## Available bets

**Same in both:** Pass Line, Come, Odds, Field, Any Seven, Any Craps, hardways, Place 4 through 10, Buy bets on 4 through 10 (at 0stakes).

**Only in regular craps:** Don't Pass and Don't Come. They're among the cheapest bets in the casino, so losing them hurts. With max lay odds, Don't Pass costs just {{ odds.houseEdgeStr.dontPassFullOdds }}%.

**Only in Crapless:** Place bets on 2, 3, 11 and 12, at {{ craplessOdds.houseEdgeStr.place2or12 }}% and {{ craplessOdds.houseEdgeStr.place3or11 }}%. Those are expensive bets, worse than Place 4 or 10.

## House edge comparison

| Bet | Regular craps | Crapless Craps |
|---|---:|---:|
| Pass Line / Come | {{ odds.houseEdgeStr.passLine }}% | {{ craplessOdds.houseEdgeStr.passLine }}% |
| Pass Line + max odds | {{ odds.houseEdgeStr.passLineFullOdds }}% | {{ craplessOdds.houseEdgeStr.passLineFullOdds }}% |
| Don't Pass | {{ odds.houseEdgeStr.dontPass }}% | not offered |
| Place 6 or 8 | {{ odds.houseEdgeStr.place6or8 }}% | {{ craplessOdds.houseEdgeStr.place6or8 }}% |
| Place 5 or 9 | {{ odds.houseEdgeStr.place5or9 }}% | {{ craplessOdds.houseEdgeStr.place5or9 }}% |
| Place 4 or 10 | {{ odds.houseEdgeStr.place4or10 }}% | {{ craplessOdds.houseEdgeStr.place4or10 }}% |
| Place 3 or 11 | not offered | {{ craplessOdds.houseEdgeStr.place3or11 }}% |
| Place 2 or 12 | not offered | {{ craplessOdds.houseEdgeStr.place2or12 }}% |
| Field | {{ odds.houseEdgeStr.field }}% | {{ craplessOdds.houseEdgeStr.field }}% |

Place 6 and 8 cost exactly the same in both games, and at {{ craplessOdds.houseEdgeStr.place6or8 }}% they're the cheapest bet on a Crapless table after the Odds.

## Base Pass Line vs. Pass Line plus odds

Two numbers get mixed up here, so it's worth separating them.

- **House edge on the base Pass Line bet:** {{ odds.houseEdgeStr.passLine }}% vs. {{ craplessOdds.houseEdgeStr.passLine }}%. This is the cost of the flat bet itself.
- **Combined edge with max odds:** {{ odds.houseEdgeStr.passLineFullOdds }}% vs. {{ craplessOdds.houseEdgeStr.passLineFullOdds }}%. This divides the same dollar loss by a bigger total wager, because the odds bet adds money at zero edge.

Adding odds **doesn't reduce your dollar loss**. It increases the amount you wager without adding cost. The combined figure is useful for comparing how efficiently your money is working, but your expected loss per decision is still the flat bet times the base edge.

## Example: same bankroll, same bet

You play $10 on the Pass Line for 100 decisions in each game.

| | Regular craps | Crapless Craps |
|---|---:|---:|
| Expected loss, flat bet only | $14.14 | $53.82 |
| Expected loss with max odds behind every point | $14.14 | $53.82 |
| Average total wagered per decision with max odds | about $37.80 | about $42.80 |
| Rolls to get through 100 decisions | about 340 | about 420 |

With a $300 bankroll, the $40 difference in expected loss is more than 13% of your buy-in. These are long-run averages; 100 decisions is a short session, and actual results will vary widely around them.

## Which version is more favorable?

Regular craps, on every comparable bet that changes. The Pass Line and Come are cheaper, the Don't side exists, and the extra Place numbers in Crapless are expensive. The bets that don't change (Place 6 and 8, Field, props) cost the same in both.

Crapless is still a fine game to play for fun if you like having more numbers in action. Just play it knowing the Pass Line costs almost four times as much, and lean on Place 6 and 8 and the odds if you want to keep the cost down.

## FAQ

### What is the house edge on Crapless Craps?

{{ craplessOdds.houseEdgeStr.passLine }}% on the Pass Line, or {{ craplessOdds.houseEdgeStr.passLineFullOdds }}% of total wagered with max odds on the 0stakes table.

### Is Crapless Craps better than regular craps?

No. The Pass Line edge is {{ craplessOdds.houseEdgeStr.passLine }}% vs. {{ odds.houseEdgeStr.passLine }}% in regular craps.

### Why is the Crapless Pass Line so much worse if you can't lose on the come-out?

Because 11 stops being an instant winner. Losing that win costs more than turning 2, 3 and 12 into points gives back.

### Do odds bets fix the difference?

They lower the edge as a share of total money wagered, but your dollar loss on the Pass Line stays the same.

<p class="strategy-link"><a class="btn" href="/games/craps/">Play regular craps free →</a></p>
<p class="strategy-link"><a class="btn" href="/games/crapless-craps/">Play Crapless Craps free →</a></p>

## Related

- [How to Play Crapless Craps](/strategy/crapless-craps/how-to-play/)
- [Crapless Craps Odds and Payouts Chart](/strategy/crapless-craps/odds-payouts/)
- [What Is the Best Bet in Craps?](/strategy/craps/best-bets/)
