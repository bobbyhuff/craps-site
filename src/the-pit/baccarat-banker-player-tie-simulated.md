---
title: "Banker vs Player vs Tie in Baccarat: 1 Million Hands Simulated"
seoTitle: "Baccarat Banker vs Player vs Tie: 1 Million Hands Simulated | 0stakes"
description: We simulated 1 million baccarat hands to see how Banker, Player, and Tie actually compare when someone bets the same side every single hand.
date: 2026-08-18T10:00:00
game: baccarat
ogType: article
breadcrumb:
  - name: The Pit
    url: /the-pit/
  - name: Banker vs Player vs Tie, Simulated
    url: /the-pit/baccarat-banker-player-tie-simulated/
---

## Question

Which side of the baccarat table actually costs the least over time: Banker, Player, or Tie?

## Rules & assumptions

Standard baccarat drawing rules on a real 8-deck shoe (reshuffled when fewer than 20 cards remain, matching real cut-card practice), $10 flat bet, seed 43. Banker wins pay 1:1 minus the standard 5% commission; Player wins pay 1:1; Tie pays 8:1 and pushes both Banker and Player bets. Three separate trackers run over the same 1,000,000 hands, one for a bettor who always bets Banker, one who always bets Player, one who always bets Tie — all watching the identical sequence of hands.

## The experiment

1,000,000 baccarat hands simulated.

## Results

| Metric | Banker | Player | Tie |
|---|---:|---:|---:|
| Win frequency | 45.864% | 44.640% | 9.495% |
| Total wagered | $10,000,000 | $10,000,000 | $10,000,000 |
| Net result | -$106,892 | -$122,430 | -$1,454,050 |
| ROI (house edge) | -1.069% | -1.224% | -14.541% |

The simulated edges land almost exactly on the published theoretical numbers for standard 8-deck baccarat: Banker at {{ baccaratOdds.houseEdge.banker }}%, Player at {{ baccaratOdds.houseEdge.player }}%, Tie at {{ baccaratOdds.houseEdge.tie }}%. The small gaps between simulated and theoretical are normal sampling variance at this trial count, most visible on Tie since it only resolves on about 1 in 10 hands.

## Why it happens

Banker wins slightly more often than Player because of baccarat's fixed drawing rules, which are built to favor the hand that acts second — but the casino claws most of that advantage back with the 5% commission on Banker wins, landing Banker just ahead of Player rather than dramatically ahead. Tie is a different kind of bet entirely: it resolves rarely (under 10% of hands) and pays 8:1 when it does, and that payout doesn't come close to compensating for how rarely a tie actually lands. A "fair" 8:1 bet on a roughly 9.5%-probability event would need to pay closer to 9.5:1 to break even; paying 8:1 instead is where nearly all of Tie's edge lives.

## Verdict

**Banker is the strongest standard baccarat wager, Player is close behind it, and Tie is dramatically worse than both.** Betting Tie loses money about 13-14 times faster than betting Banker on the same amount of action, for a bet that "feels" like a bonus side option rather than the worst price at the table.

*Simulation and analysis by 0Stakes. Full methodology at [/methodology/](/methodology/).*

## Related

* [Banker vs Player vs Tie strategy](/strategy/baccarat/banker-vs-player-vs-tie/)
* [Baccarat Odds & House Edge](/strategy/baccarat/odds-house-edge/)
* [Play free Baccarat](/games/baccarat/)
* [Methodology](/methodology/)
