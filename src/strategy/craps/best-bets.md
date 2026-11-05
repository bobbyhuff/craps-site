---
title: "What Is the Best Bet in Craps? Ranked by House Edge"
seoTitle: "Best Bets in Craps: Every Bet Ranked by House Edge | 0stakes"
description: "The best bets in craps, ranked by house edge: Odds, Don't Pass, Pass Line, Place 6 and 8, the Field and props, with the dollar cost behind each."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Craps
    url: /strategy/craps/
  - name: Best Bets in Craps
    url: /strategy/craps/best-bets/
---
**Quick answer:** The best bet in craps is the **Odds** bet, at 0% house edge, but you can only make it behind a Pass Line, Don't Pass, Come or Don't Come bet. Of the bets you can make on their own, **Don't Pass / Don't Come ({{ odds.houseEdgeStr.dontPass }}%)**, **Pass Line / Come ({{ odds.houseEdgeStr.passLine }}%)** and **Place 6 or 8 ({{ odds.houseEdgeStr.place6or8 }}%)** are the best. Everything in the middle of the table is much worse, and **Any Seven ({{ odds.houseEdgeStr.anySeven }}%)** is the worst.

No bet on the table has a player edge, and no combination or progression of them creates one.

## What makes one bet better than another

A craps bet is "better" when it gives back more of what you wager over the long run. That's measured by **house edge**: the casino's average profit as a percentage of the bet. Every craps bet's edge comes from comparing its payout to the true odds of the dice, and the dice never change: 36 combinations, 6 of them a 7.

A lower house edge means a cheaper bet. It doesn't mean a safer session. Every bet can lose many times in a row.

## Winning often is not the same as winning value

Players often pick bets by how often they win. That's a different question.

- **Place 6** and **Big 6** both win when a 6 rolls before a 7, which happens 5 times in 11. Place 6 pays {{ odds.placeOddsStr[6] }}; Big 6 pays {{ odds.referenceBets.big6or8.payStr }}. Same win rate, but {{ odds.houseEdgeStr.place6or8 }}% vs. {{ odds.referenceBets.big6or8.houseEdgeStr }}%.
- **The Field** wins on 16 of 36 rolls, about 44%. **Any Craps** wins on 4 of 36, about 11%. Their edges are {{ odds.houseEdgeStr.field }}% and {{ odds.houseEdgeStr.anyCraps }}%.
- **Don't Pass** wins slightly less often than Pass Line and still has the lower edge, because a come-out 12 is a push rather than a loss.

What matters is win probability **and** payout together. That's what house edge captures.

## The rules behind every number

All figures below assume the standard rules used at 0stakes and most casinos:

- Pass Line: 7 or 11 wins on the come-out, 2, 3, 12 lose, any other total is the point.
- Don't Pass: 2 or 3 wins on the come-out, **12 pushes**, 7 or 11 loses.
- Odds pay true odds: {{ odds.trueOddsStr[4] }} on 4/10, {{ odds.trueOddsStr[5] }} on 5/9, {{ odds.trueOddsStr[6] }} on 6/8, with {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x maximum odds.
- Place pays {{ odds.placeOddsStr[6] }} on 6/8, {{ odds.placeOddsStr[5] }} on 5/9, {{ odds.placeOddsStr[4] }} on 4/10.
- Field: 3, 4, 9, 10, 11 pay even money, 2 pays {{ odds.fieldPayStr[2] }}, **12 pays {{ odds.fieldPayStr[12] }}**. Some casinos pay only 2:1 on 12, which doubles the edge.
- Buy 4/10: {{ odds.buyCommissionPct }}% commission charged up front.

Each house edge is the average loss per **resolved bet**. 0stakes recomputes every one from the 36 dice combinations in its test suite.

## Every craps bet ranked by house edge

| Bet (best to worst) | Pays | House edge |
|---|---|---:|
| Odds (behind Pass, Come, Don't Pass, Don't Come) | True odds | 0.00% |
| Don't Pass + 3-4-5x lay odds (combined) | | {{ odds.houseEdgeStr.dontPassFullOdds }}% |
| Pass Line + 3-4-5x odds (combined) | | {{ odds.houseEdgeStr.passLineFullOdds }}% |
| Don't Pass / Don't Come | 1:1 | {{ odds.houseEdgeStr.dontPass }}% |
| Pass Line / Come | 1:1 | {{ odds.houseEdgeStr.passLine }}% |
| Place 6 or 8 | {{ odds.placeOddsStr[6] }} | {{ odds.houseEdgeStr.place6or8 }}% |
| Field (12 pays {{ odds.fieldPayStr[12] }}) | 1:1, 2:1, 3:1 | {{ odds.houseEdgeStr.field }}% |
| Place 5 or 9 | {{ odds.placeOddsStr[5] }} | {{ odds.houseEdgeStr.place5or9 }}% |
| Buy 4 or 10 | {{ odds.trueOddsStr[4] }} minus {{ odds.buyCommissionPct }}% | {{ odds.houseEdgeStr.buy4or10 }}% |
| Place 4 or 10 | {{ odds.placeOddsStr[4] }} | {{ odds.houseEdgeStr.place4or10 }}% |
| Hard 6 or 8 | {{ odds.hardPay[6] }}:1 | {{ odds.houseEdgeStr.hard6or8 }}% |
| Big 6 or Big 8* | {{ odds.referenceBets.big6or8.payStr }} | {{ odds.referenceBets.big6or8.houseEdgeStr }}% |
| Hard 4 or 10 | {{ odds.hardPay[4] }}:1 | {{ odds.houseEdgeStr.hard4or10 }}% |
| Any Craps | {{ odds.anyCrapsPayStr }} | {{ odds.houseEdgeStr.anyCraps }}% |
| Yo (11), one roll* | {{ odds.referenceBets.yo.payStr }} | {{ odds.referenceBets.yo.houseEdgeStr }}% |
| Aces (2) or Boxcars (12), one roll* | {{ odds.referenceBets.twoOrTwelve.payStr }} | {{ odds.referenceBets.twoOrTwelve.houseEdgeStr }}% |
| Any Seven | {{ odds.anySevenPayStr }} | {{ odds.houseEdgeStr.anySeven }}% |

\*Not offered on the 0stakes table; listed for reference because many casino layouts have them. The full payout reference for every bet the 0stakes table offers is the [craps odds and payouts chart](/strategy/craps/house-edge/).

## Pass Line and Don't Pass

The two foundation bets. Pass Line ({{ odds.houseEdgeStr.passLine }}%) bets with the shooter; Don't Pass ({{ odds.houseEdgeStr.dontPass }}%) bets against. Don't Pass is slightly cheaper because the come-out 12 is a push instead of a win for the Don't side. That's the only thing that keeps it from being a player-favored bet.

Pick whichever you enjoy. The 0.05-point difference is too small to matter in a session. Details: [the Pass Line and why Odds matter](/strategy/craps/pass-line-and-odds/).

## Come and Don't Come

Mathematically identical to Pass and Don't Pass, made after a point is set. Each Come bet gets its own point. They let you have more numbers working at the same low edge, at the cost of more money exposed to a single 7.

## Odds bets: zero edge, with a catch

The Odds bet pays exactly true odds, so it's the only bet in the casino with no house edge. But **it doesn't exist on its own**. You must first have a Pass, Come, Don't Pass or Don't Come bet, and that bet carries its edge.

Odds reduce the edge as a **share of everything you wager**: Pass Line with full 3-4-5x odds is {{ odds.houseEdgeStr.passLineFullOdds }}% of the total. They do **not** reduce your dollar loss. Your expected cost per decision is still the flat bet times {{ odds.houseEdgeStr.passLine }}%. Odds add a fair bet and more volatility.

## Place 6 and 8

At {{ odds.houseEdgeStr.place6or8 }}%, Place 6 and 8 are the best bets you can make at any moment without waiting for a come-out. Bet in $6 units so the {{ odds.placeOddsStr[6] }} payout is clean: $12 wins $14. Full guide: [6/8 craps strategy](/strategy/craps/place-6-and-8-strategy/).

## Place 5 and 9

{{ odds.houseEdgeStr.place5or9 }}%, a big step down. Place 5 and 9 pay {{ odds.placeOddsStr[5] }} against true odds of {{ odds.trueOddsStr[5] }}. Still better than anything in the center of the table.

## The Field

The Field looks cheap at {{ odds.houseEdgeStr.field }}%, and per resolved bet it is. But it resolves on **every roll**. A Pass Line bet takes about 3.4 rolls to resolve. So $10 in the Field every roll costs far more per hour than $10 on the Pass Line, as the table below shows. Check the 12 payout: at 2:1 instead of 3:1, the Field edge doubles.

## Proposition bets

Any Seven, Any Craps, the hardways, Yo, Aces and Boxcars all live in the center of the table, and all carry edges between {{ odds.houseEdgeStr.hard6or8 }}% and {{ odds.houseEdgeStr.anySeven }}%. They pay big numbers like 15:1 and 30:1, but always well below their true odds. Any Seven is the most expensive bet on the layout despite 7 being the most common roll.

## Examples: what $10 actually costs

House edge is per bet. Bets resolve at different speeds. To compare them fairly, here's the average cost of keeping **$10 in action on every roll** for 100 rolls (re-betting as each resolves, Place bets working every roll):

| Bet ($10 in action) | Expected cost per 100 rolls |
|---|---:|
| Don't Pass | $4.04 |
| Pass Line | $4.19 |
| Pass Line + max odds (only the flat $10 costs anything) | $4.19 |
| Place 6 or 8 | $4.63 |
| Place 5 or 9 | $11.11 |
| Place 4 or 10 | $16.67 |
| Field | $27.78 |
| Hard 6 | $27.78 |
| Any Craps | $111.11 |
| Any Seven | $166.67 |

Two surprises here. The Field, with a {{ odds.houseEdgeStr.field }}% edge, costs exactly as much per roll as Hard 6 at {{ odds.houseEdgeStr.hard6or8 }}%, because the Field resolves every roll. And full odds behind the Pass Line cost nothing extra in dollars, even though it puts far more money on the table.

These are long-run averages. 100 rolls is a short session, and actual results will swing widely around them.

## Common misconceptions

- **"A bet that wins often is a good bet."** Big 6 wins as often as Place 6 at six times the edge.
- **"Odds bets lower my losses."** They lower the edge as a percentage. Your dollar loss is set by the flat bet.
- **"The Field is a low-edge bet, so it's cheap."** Per roll, it's one of the more expensive ways to play.
- **"Covering every number guarantees a hit."** It guarantees frequent small wins and a large loss every 7. See the [Iron Cross simulation](/the-pit/iron-cross-simulated/).
- **"A progression can beat the edge."** Pressing, doubling after losses, or any other system changes the size and timing of bets, not their expected value. Every craps bet is negative expectation, and no combination of negative-expectation bets guarantees profit.

## Which bets should you make?

If cost is your priority: Pass Line or Don't Pass, odds as big as your bankroll comfortably allows, and Place 6 and 8 if you want more action. That set is the cheapest way to play the game, and you can practice it with play money on the [free craps table](/games/craps/). If you're new, [best craps strategies for beginners](/strategy/craps/best-strategies-for-beginners/) walks through these bets in order.

<p class="strategy-link"><a class="btn" href="/games/craps/">Practice the best bets free →</a></p>

## FAQ

### What is the single best bet in craps?

The Odds bet, at 0% house edge. It has to sit behind a Pass, Come, Don't Pass or Don't Come bet.

### What is the best bet in craps on its own?

Don't Pass or Don't Come at {{ odds.houseEdgeStr.dontPass }}%, then Pass Line or Come at {{ odds.houseEdgeStr.passLine }}%, then Place 6 or 8 at {{ odds.houseEdgeStr.place6or8 }}%.

### What is the worst bet in craps?

Any Seven, at {{ odds.houseEdgeStr.anySeven }}%.

### What is the safest bet in craps?

No bet is safe in the sense of protecting you from losing streaks. The bets with the lowest house edge, Pass/Don't Pass with odds and Place 6 or 8, are the cheapest over time.

### Is Place 6 and 8 better than the Pass Line?

Slightly more expensive per bet ({{ odds.houseEdgeStr.place6or8 }}% vs. {{ odds.houseEdgeStr.passLine }}%), but available any time. Both are among the best bets on the table.

### Is there a craps strategy that guarantees profit?

No. Every bet has a house edge or, for Odds, no edge at all. Combining them can't produce a positive one.

## Related

- [Craps Odds and Payouts Chart](/strategy/craps/house-edge/)
- [Best Craps Strategies for Beginners](/strategy/craps/best-strategies-for-beginners/)
- [6/8 Craps Strategy Explained](/strategy/craps/place-6-and-8-strategy/)
- [Crapless Craps vs. Regular Craps](/strategy/crapless-craps/crapless-vs-regular-craps/)
- [Simulated: Placing 6 and 8 for 1 million rolls](/the-pit/craps-place-6-8-simulated/)
