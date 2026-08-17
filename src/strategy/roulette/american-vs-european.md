---
title: "American vs European Roulette: What's the Difference?"
seoTitle: "American vs European Roulette: House Edge Compared | 0stakes"
description: One extra pocket is the whole difference between American and European roulette — and it nearly doubles the house edge. Here's the math side by side.
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Roulette
    url: /strategy/roulette/
  - name: American vs European
    url: /strategy/roulette/american-vs-european/
---

The entire difference between American and European roulette comes down to one pocket. Everything else — the numbers, the layout, the bet types, the payouts — is identical.

## 0 vs 0 and 00

A European wheel has a single green 0. An American wheel has a 0 *and* a 00. That's 37 pockets versus 38. Every payout on the table is still priced as if there were only 36 numbers to land on, so the extra pocket on the American wheel is pure house advantage that European wheels don't have.

## House edge, side by side

| | European (single zero) | American (double zero) |
|---|---|---|
| Pockets | 37 | {{ rouletteOdds.pocketCount }} |
| Zeros | 0 only | 0 and 00 |
| Standard bet house edge | 2.70% | {{ rouletteOdds.houseEdge.standard }}% |
| Expected loss per $100 wagered | ~$2.70 | ~${{ rouletteOdds.houseEdge.standard }} |

The European number comes from the same math as the American one: house edge = (number of zero pockets) ÷ (total pockets). One zero out of 37 is 1/37 ≈ 2.70%. Two zeros out of 38 is 2/38 ≈ 5.26% — almost exactly double.

## Why European roulette is mathematically better

Fewer zero pockets means a smaller gap between what a bet pays and what it would need to pay to be fair. A European red/black bet still pays even money and still wins 18 times out of 37 — worse odds than a true coin flip, but meaningfully better than 18 out of 38. Some European tables add rules like *la partage* or *en prison* that return half your even-money bet (or push it to the next spin) when 0 hits, which lowers the effective edge on those specific bets even further. Neither rule exists on an American wheel.

## Example: expected loss per $100 wagered

Spread $100 across even-money bets on each wheel type, and the long-run difference is stark:

- **European**: $100 × 2.70% ≈ **$2.70** expected loss
- **American**: $100 × {{ rouletteOdds.houseEdge.standard }}% ≈ **${{ rouletteOdds.houseEdge.standard }}** expected loss

Nearly double the cost of play for the same bets, same payouts, same amount wagered — the only thing that changed is which wheel you sat down at.

## The takeaway

If you ever have a choice between the two, a single-zero European wheel is the better bet, full stop — there's no scenario where the extra 00 pocket works in your favor. 0stakes deals an American wheel, matching the more common setup at U.S. casinos, so every number on the [odds and payouts chart](/strategy/roulette/odds-payouts/) reflects the {{ rouletteOdds.houseEdge.standard }}% figure above. See how roulette stacks up against every other game on the site on the [house edge ranking](/strategy/house-edge/).

<p class="strategy-link"><a class="btn" href="/games/roulette/">Practice on the free roulette wheel →</a></p>
