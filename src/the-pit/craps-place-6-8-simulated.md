---
title: "Place 6 & 8 in Craps: 1 Million Rolls Simulated"
seoTitle: "Craps Place 6 & 8 Strategy: 1 Million Rolls Simulated | 0stakes"
description: Placing 6 and 8 is one of the most commonly recommended craps bets after the Pass Line. We simulated 1 million rolls to show exactly what it pays and what it costs.
date: 2026-08-18T13:00:00
game: craps
ogType: article
breadcrumb:
  - name: The Pit
    url: /the-pit/
  - name: Place 6 & 8, Simulated
    url: /the-pit/craps-place-6-8-simulated/
---

## Question

How does placing 6 and 8 actually perform over a large number of rolls, and how much of an edge does the house keep on it?

## Rules & assumptions

$6 placed on 6 and $6 placed on 8 ({{ odds.placeOdds[6][0] }}:{{ odds.placeOdds[6][1] }} payout on each), true two-dice probabilities (36 combinations), seed 43. Both bets go up the moment a point is established and stay working continuously: every roll of 6 pays the Place 6 bet, every roll of 8 pays the Place 8 bet, and both bets ride again immediately after a win. A seven-out takes both bets down as a loss and ends the shooter's point. If the point itself repeats, the round ends normally (a pass line resolution) and the place bets are simply returned, no win or loss. Place bets are off during the come-out roll, matching how they're actually offered at a real table.

## The experiment

1,000,000 rolls simulated while Place 6 and Place 8 were active (rolls during come-out attempts before a point is established aren't counted, since the bets aren't live yet).

## Results

| Metric | Value |
|---|---:|
| Rolls while bets were active | 1,000,000 |
| Place 6 wins | 138,616 |
| Place 8 wins | 139,516 |
| Seven-outs | 166,651 |
| Total wagered | $3,668,604 |
| Net result | -$52,888 |
| ROI (house edge) | -1.442% |

The simulated edge, -1.442%, lands close to the theoretical {{ odds.houseEdgeStr.place6or8 }}% house edge for Place 6 or Place 8, the normal amount of drift expected at this trial count. For comparison, the [Iron Cross](/the-pit/iron-cross-simulated/) loses about 4.235% of every dollar at risk per live round, and a flat Pass Line bet loses {{ odds.houseEdgeStr.passLine }}%. Place 6 and 8 sit clearly between those two: a real edge, but a much smaller one than most other bets on the table.

## Why it happens

6 and 8 are each made by 5 of the 36 dice combinations, the second-most-common totals after 7 (6 combinations). A "fair" payout for a bet resolving 5 times for every 6 times a 7 shows up would need to pay 6:5; the house pays {{ odds.placeOdds[6][0] }}:{{ odds.placeOdds[6][1] }} instead, a slightly worse ratio that's where the entire house edge on this bet lives. It's a small gap compared to bets made on rarer numbers, which is exactly why 6 and 8 show up again and again as one of the better-regarded bets on the layout: the payout is close to fair, not exactly fair.

## Verdict

**Place 6 and 8 are among the better common bets in craps, but they still carry a real house edge.** They resolve often enough (5 ways each out of 36) to feel active, and the {{ odds.houseEdgeStr.place6or8 }}% cost per resolution is a fraction of what worse bets on the table charge, but "better than most other bets" is not the same as "even money." The house still wins this argument over enough rolls.

*Simulation and analysis by 0Stakes. Full methodology at [/methodology/](/methodology/).*

## Related

* [Craps Odds & Payouts Chart + Payout Calculator](/strategy/craps/house-edge/)
* [Casino House Edge Rankings](/strategy/house-edge/)
* [Play free Craps](/games/craps/)
* [Methodology](/methodology/)
