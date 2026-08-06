---
title: "Craps House Edge by Bet, Ranked (Best to Worst)"
description: Every craps bet ranked by house edge, from Pass Line with full odds (0.37%) down to Any Seven (16.67%) — the numbers that should actually drive your strategy.
date: 2026-08-05
---

Every bet on a craps table has a fixed, published house edge — none of it is hidden or negotiable. Knowing the actual numbers is the fastest way to tell a good bet from a bad one, regardless of how it "feels" at the table.

## The full ranking

| Bet | House Edge |
|---|---|
| Pass Line / Come, with {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x Odds | {{ odds.houseEdge.passLineFullOdds }}% |
| Pass Line / Come, with single Odds | {{ odds.houseEdge.passLineSingleOdds }}% |
| Don't Pass / Don't Come | {{ odds.houseEdge.dontPass }}% |
| Pass Line / Come (no odds) | {{ odds.houseEdge.passLine }}% |
| Place 6 or 8 | {{ odds.houseEdge.place6or8 }}% |
| Place 5 or 9 | {{ odds.houseEdge.place5or9 }}% |
| Buy 4 or 10 ({{ odds.buyCommissionPct }}% vig) | {{ odds.houseEdge.buy4or10 }}% |
| Place 4 or 10 | {{ odds.houseEdge.place4or10 }}% |
| Field | {{ odds.houseEdge.field }}% |
| Any Craps | {{ odds.houseEdge.anyCraps }}% |
| Hard 6 or 8 | {{ odds.houseEdge.hard6or8 }}% |
| Hard 4 or 10 | {{ odds.houseEdge.hard4or10 }}% |
| Any Seven | {{ odds.houseEdge.anySeven }}% |

## What actually stands out

**Odds bets are the only bet in the casino with zero house edge.** They don't appear in the table above on their own because they can't be made alone — but stacked behind a Pass Line bet, they pull the *blended* edge down to {{ odds.houseEdge.passLineFullOdds }}% on a standard {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x table. Nothing else on the layout comes close.

**Place 6 and 8 are quietly excellent.** At {{ odds.houseEdge.place6or8 }}%, they're barely worse than a bare Pass Line bet, and unlike Pass Line, you can bet them anytime without waiting for a new come-out roll.

**Buy bets only make sense on 4 and 10.** The {{ odds.buyCommissionPct }}% commission is a flat tax, so it hurts most on numbers with the worst payout odds otherwise. On 4/10 it actually beats the equivalent Place bet ({{ odds.houseEdge.buy4or10 }}% vs {{ odds.houseEdge.place4or10 }}%); on 6/8 it's strictly worse than just Placing them.

**Any Seven is the worst bet on the table.** A {{ odds.houseEdge.anySeven }}% edge means the casino keeps roughly a sixth of every dollar wagered on it, long-run. It's tempting because 7 is the single most common roll — but that's exactly why the payout is priced so badly against you.

## The takeaway

If you're optimizing purely for the lowest cost of play: Pass Line (or Come) with max Odds, plus Place bets on 6 and 8, covers the low-edge side of the table almost completely. Everything below 4% edge is worth considering; everything above it is paying for excitement, not value.

Read more on the [Pass Line and Odds](/strategy/craps/pass-line-and-odds/) specifically, or practice sizing these bets on the [free craps table](/games/craps/).
