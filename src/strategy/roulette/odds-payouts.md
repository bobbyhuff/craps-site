---
title: "Roulette Odds & Payouts Chart"
seoTitle: "Roulette Odds & Payouts Chart: Every Bet & House Edge | 0stakes"
description: Every roulette bet's payout, win probability, and house edge in one chart — straight up, split, street, corner, six line, column, dozen, and the outside bets.
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Roulette
    url: /strategy/roulette/
  - name: Odds & Payouts Chart
    url: /strategy/roulette/odds-payouts/
---

American roulette deals from a wheel with {{ rouletteOdds.pocketCount }} pockets — numbers 1 through 36 plus 0 and 00. Every standard bet is priced off 36 numbers, which is what creates the house edge: the wheel has {{ rouletteOdds.pocketCount }} pockets to land on, but payouts only account for 36 of them. That gap is constant at {{ rouletteOdds.houseEdge.standard }}% across nearly every bet on the layout, straight up or otherwise — one of the few games where the size of your bet doesn't change your odds of losing over time.

<p class="strategy-link"><a class="btn" href="/games/roulette/">Practice these bets on the free roulette wheel →</a></p>

## Roulette odds and payouts chart

"Numbers Covered" is how many of the 38 pockets win the bet. "Probability" is numbers covered divided by 38. Example payouts assume a flat $10 bet.

| Bet | Numbers Covered | Payout | Probability | House Edge | Example ($10 bet) |
|---|---|---|---|---|---|
| Straight Up | 1 | {{ rouletteOdds.payouts.straightUp[0] }}:{{ rouletteOdds.payouts.straightUp[1] }} | 1/38 (2.63%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $350 |
| Split | 2 | {{ rouletteOdds.payouts.split[0] }}:{{ rouletteOdds.payouts.split[1] }} | 2/38 (5.26%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $170 |
| Street | 3 | {{ rouletteOdds.payouts.street[0] }}:{{ rouletteOdds.payouts.street[1] }} | 3/38 (7.89%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $110 |
| Corner | 4 | {{ rouletteOdds.payouts.corner[0] }}:{{ rouletteOdds.payouts.corner[1] }} | 4/38 (10.53%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $80 |
| Six Line | 6 | {{ rouletteOdds.payouts.sixLine[0] }}:{{ rouletteOdds.payouts.sixLine[1] }} | 6/38 (15.79%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $50 |
| Column | 12 | {{ rouletteOdds.payouts.column[0] }}:{{ rouletteOdds.payouts.column[1] }} | 12/38 (31.58%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $20 |
| Dozen | 12 | {{ rouletteOdds.payouts.dozen[0] }}:{{ rouletteOdds.payouts.dozen[1] }} | 12/38 (31.58%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $20 |
| Red or Black | 18 | {{ rouletteOdds.payouts.outside[0] }}:{{ rouletteOdds.payouts.outside[1] }} | 18/38 (47.37%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $10 |
| Odd or Even | 18 | {{ rouletteOdds.payouts.outside[0] }}:{{ rouletteOdds.payouts.outside[1] }} | 18/38 (47.37%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $10 |
| 1-18 or 19-36 | 18 | {{ rouletteOdds.payouts.outside[0] }}:{{ rouletteOdds.payouts.outside[1] }} | 18/38 (47.37%) | {{ rouletteOdds.houseEdge.standard }}% | Wins $10 |
| Top Line (0-00-1-2-3) | 5 | {{ rouletteOdds.payouts.topLine[0] }}:{{ rouletteOdds.payouts.topLine[1] }} | 5/38 (13.16%) | {{ rouletteOdds.houseEdge.topLine }}% | Wins $60 |

## Why every bet has (almost) the same house edge

A straight-up number pays 35:1 but only wins 1 time in 38. A red/black bet pays even money but wins nearly half the time. Different payouts, wildly different win rates — and yet both carry the exact same {{ rouletteOdds.houseEdge.standard }}% house edge. That's not a coincidence: every standard bet is priced as if the wheel only had 36 pockets, so the two extra pockets (0 and 00) are what the casino keeps, no matter how you spread your money across the layout.

The **top line** bet (0, 00, 1, 2, 3) is the one exception. It covers 5 numbers but only pays 6:1 — true odds for 5 out of 38 pockets would be closer to 6.6:1 — which pushes its house edge up to {{ rouletteOdds.houseEdge.topLine }}%, the worst bet on an American table.

## The takeaway

Bet size and bet type don't change your long-run cost of play on a standard roulette bet — {{ rouletteOdds.houseEdge.standard }}% is {{ rouletteOdds.houseEdge.standard }}% whether you're covering 1 number or 18. The only bet actually worth avoiding on purpose is the top line. Everything else is a question of how much variance you want, not which bet is "smarter" mathematically.

For why the American wheel itself is worse than the alternative, see [American vs European roulette](/strategy/roulette/american-vs-european/). For how every game on the site compares, see the [house edge ranking](/strategy/house-edge/).

<p class="strategy-link"><a class="btn" href="/games/roulette/">Try these bets on the free roulette wheel →</a></p>
