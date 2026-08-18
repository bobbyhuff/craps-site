---
title: "Martingale vs Fibonacci vs Flat Betting: 1 Million Roulette Spins"
seoTitle: "Martingale vs Fibonacci vs Flat Betting: 1 Million Spins | 0stakes"
description: We ran Martingale, Fibonacci, and flat betting through the same roughly 1 million American roulette spins to see which one actually changes the outcome.
date: 2026-08-18T11:00:00
game: roulette
ogType: article
breadcrumb:
  - name: The Pit
    url: /the-pit/
  - name: Roulette Betting Systems, Simulated
    url: /the-pit/roulette-betting-systems-simulated/
---

## Question

Do progressive betting systems like Martingale or Fibonacci actually change roulette's outcome, or just how the same loss arrives?

## Rules & assumptions

American roulette, {{ rouletteOdds.houseEdge.standard }}% house edge on red/black. All three systems share identical parameters: $5 base wager on red, $500 starting bankroll, $500 table limit, 24,700 sessions of up to 50 spins each, seed 43 (each system replays the same seed, so all three see identical spin sequences per session). A session ends at 50 spins or the moment the bankroll can't cover the next required bet, whichever comes first.

* **Martingale:** double the bet after every loss, reset to $5 after a win.
* **Fibonacci:** move one step forward in the sequence 1,1,2,3,5,8,13,21… after a loss; move two steps back after a win.
* **Flat:** always bet $5.

## The experiment

Roughly 1,000,000 total spins across 24,700 sessions per system (exact spin counts vary by system since sessions that bust end early).

## Results

| Metric | Martingale | Fibonacci | Flat |
|---|---:|---:|---:|
| Total spins | 999,551 | 1,165,531 | 1,235,000 |
| Total wagered | $16,205,915 | $14,356,250 | $6,175,000 |
| Net result | -$876,985 | -$805,480 | -$334,060 |
| ROI | -5.412% | -5.611% | -5.410% |
| Profitable sessions | 59.5% | 74.8% | 29.8% |
| Bust rate | 38.6% | 13.6% | 0.0% |
| Longest losing streak | 7 | 9 | 20 |
| Largest bet required | $320 | $170 | $5 |
| Worst single-session drawdown | $635 | $440 | $155 |

All three ROIs land within a few tenths of a percentage point of the same {{ rouletteOdds.houseEdge.standard }}% house edge, whether the system wagers $5 a spin the whole way or escalates to $320. Where the systems actually differ is the shape of the outcome: Fibonacci produces the highest rate of profitable sessions (74.8%) and the lowest bust rate of the two progressive systems, because it climbs more slowly than Martingale and gives back ground more slowly too. Martingale busts more than a third of its sessions outright. Flat betting almost never busts a $500 bankroll at $5 a spin in 50 spins, but it's also profitable in barely three sessions out of ten, since it has no mechanism for turning a short losing patch back into a win the way the progressive systems do.

## Why it happens

Every spin still carries the same {{ rouletteOdds.houseEdge.standard }}% edge regardless of bet size, so no sequence of bet sizing can shift the long-run average away from that number — it can only move money around within sessions. Progressive systems concentrate small, frequent wins into more sessions ending positive, funded by a smaller number of sessions that lose big when a losing streak outruns the bankroll or the table limit. Flat betting spreads the same expected loss evenly across every session instead, so it neither wins as often nor loses as dramatically.

## Verdict

**Bet sizing changes volatility and how losses arrive. It does not remove roulette's {{ rouletteOdds.houseEdge.standard }}% house edge.** Fibonacci is a gentler ride than Martingale, busting less often for a similar edge, but "gentler" isn't the same as "better priced" — every version of this experiment loses money at close to the same rate per dollar wagered.

*Simulation and analysis by 0Stakes. Full methodology at [/methodology/](/methodology/).*

## Related

* [Martingale Roulette, Simulated](/the-pit/martingale-roulette-simulated/)
* [Roulette Odds & Payouts](/strategy/roulette/odds-payouts/)
* [American vs European Roulette](/strategy/roulette/american-vs-european/)
* [Play free Roulette](/games/roulette/)
* [Methodology](/methodology/)
