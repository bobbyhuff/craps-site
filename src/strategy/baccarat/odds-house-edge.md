---
title: "Baccarat Odds & House Edge"
seoTitle: "Baccarat Odds & House Edge: Banker vs Player vs Tie | 0stakes"
description: The exact house edge behind every baccarat bet — why Banker is the lowest, why casinos charge commission on it, and why Tie is mathematically poor despite the big payout.
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Baccarat
    url: /strategy/baccarat/
  - name: Odds & House Edge
    url: /strategy/baccarat/odds-house-edge/
---

Baccarat has exactly three bets, and their house edges aren't close to each other.

<p class="strategy-link"><a class="btn" href="/games/baccarat/">Practice on the free baccarat table →</a></p>

## House edge by bet

| Bet | Payout | House Edge |
|---|---|---|
| Banker | {{ baccaratOdds.payoutStr.banker }} (minus {{ baccaratOdds.bankerCommissionPct }}% commission on wins) | {{ baccaratOdds.houseEdge.banker }}% |
| Player | {{ baccaratOdds.payoutStr.player }} | {{ baccaratOdds.houseEdge.player }}% |
| Tie | {{ baccaratOdds.payoutStr.tie }} | {{ baccaratOdds.houseEdge.tie }}% |

## Why Banker has the lowest house edge

Banker acts second — its third-card rule is partly built around what Player already drew, which gives it a small structural advantage in how often it ends up with the winning hand. Uncorrected, that advantage would actually make Banker the mathematically strongest bet in the entire casino, not just at this table. The {{ baccaratOdds.bankerCommissionPct }}% commission exists specifically to claw enough of that edge back that the game stays profitable for the house — and even after the haircut, Banker still comes out ahead of Player.

## Why casinos charge commission on Banker wins

It's not a fee for the privilege of betting Banker — it's the mechanism that turns Banker's built-in statistical edge into a house edge instead of a player edge. Without the commission, Banker would actually beat the house over time. With it, Banker still wins more often than Player loses to it, just not by enough to overcome the {{ baccaratOdds.bankerCommissionPct }}% cut.

## Why Tie looks attractive but is mathematically poor

{{ baccaratOdds.payoutStr.tie }} is by far the biggest payout on the table, and that's exactly what makes it tempting — a big number is easy to fixate on. But Player and Banker landing on the exact same 0-9 total is genuinely rare, and the payout doesn't come close to compensating for how rare it is. That gap between "how often it wins" and "how much it pays when it does" is the whole story behind its {{ baccaratOdds.houseEdge.tie }}% house edge — more than ten times worse than Banker or Player.

## Probability vs payout vs house edge

These are three different numbers, and confusing them is the most common mistake in reading any casino odds table:

- **Probability** is how often a bet wins, on its own.
- **Payout** is what the bet pays when it wins.
- **House edge** is what's left over once you weigh the payout against the probability — the actual long-run cost of making that bet, expressed as a percentage of every dollar wagered.

A bet can have a huge payout and still be a bad bet (Tie), or a modest payout and still be one of the best bets in the building (Banker). Payout alone never tells you which.

## Expected loss per $100 wagered

- **Banker**: $100 × {{ baccaratOdds.houseEdge.banker }}% ≈ $1.06
- **Player**: $100 × {{ baccaratOdds.houseEdge.player }}% ≈ $1.24
- **Tie**: $100 × {{ baccaratOdds.houseEdge.tie }}% ≈ $14.36

This is long-run expected value, not a promise about any single hand — see the [full comparison](/strategy/baccarat/banker-vs-player-vs-tie/) for what that looks like scaled up, or the [house edge ranking](/strategy/house-edge/) for how baccarat compares to every other game on the site.

<p class="strategy-link"><a class="btn" href="/games/baccarat/">Try it on the free baccarat table →</a></p>
