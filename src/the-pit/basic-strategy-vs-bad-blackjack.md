---
title: "Basic Strategy vs Bad Blackjack Strategy: 1 Million Hands"
seoTitle: "Basic Strategy vs Bad Blackjack: 1 Million Hands Simulated | 0stakes"
description: How much do common beginner mistakes actually cost at blackjack? We simulated 1 million hands each of correct basic strategy and a deliberately bad strategy to find out.
date: 2026-08-18T09:00:00
game: blackjack
ogType: article
breadcrumb:
  - name: The Pit
    url: /the-pit/
  - name: Basic Strategy vs Bad Blackjack
    url: /the-pit/basic-strategy-vs-bad-blackjack/
---

## Question

How much does playing badly actually cost at blackjack, in dollars, compared to playing every hand by the book?

## Rules & assumptions

Both players face identical rules: 6 decks, dealer stands on soft 17, blackjack pays {{ blackjackOdds.blackjackPayoutStr }}, double on any first two cards including after a split, one split per hand (no resplitting), split aces get one card only. $10 flat bet every hand. Cards are drawn from an effectively infinite 6-deck-composition shoe (reshuffled conceptually every hand), so shoe-depletion effects between hands aren't modeled. Seed 43.

**Player A** plays correct basic strategy for these exact rules — the same chart on [0stakes' basic strategy page](/strategy/blackjack/basic-strategy/).

**Player B** plays a deliberately common set of beginner mistakes, applied consistently:

* Stands on any hard 12-16, regardless of the dealer's upcard.
* Never doubles down, even when basic strategy calls for it.
* Never splits pairs, playing them as a single hand instead.
* Takes insurance every time the dealer shows an Ace.

Soft hands and totals outside 12-16 aren't part of the tested mistakes, so Player B plays those normally (hit soft hands below 18, stand 17 and under on hard totals, stand hard 17+) to isolate the four mistakes above as the only real difference between the two players.

## The experiment

1,000,000 hands simulated for each player.

## Results

| Metric | Player A (basic strategy) | Player B (bad strategy) |
|---|---:|---:|
| Hands | 1,000,000 | 1,000,000 |
| Total wagered | $11,288,340 | $10,384,130 |
| Net result | -$54,700 | -$625,305 |
| ROI (house edge) | -0.485% | -6.022% |
| Dealer blackjack rate | 4.714% | 4.721% |

Player A's simulated edge, -0.485%, lands right where it should: the site's own [house edge ranking](/strategy/house-edge/) cites roughly 0.5% for perfect basic strategy under these exact rules. Player B's edge is more than 12 times steeper, at just over 6%. Player B also wagered less in total, since standing early and never doubling means fewer chips ever go on the table — and still lost more than eleven times as much money.

## Why it happens

Every one of Player B's habits removes a specific tool that exists to fight the dealer's advantage. Doubling down turns a strong hand (an 11 against a weak dealer upcard, for instance) into double the winnings exactly when the odds favor it most; skipping it caps the upside on the best hands in the game. Splitting turns a bad hand like a pair of 8s (a stiff 16) into two hands starting from a much stronger position; skipping it means playing that bad 16 as-is, over and over. Standing on 12-16 against a dealer showing a strong card (7 through Ace) gives up completely: a dealer with a 7 up will make a hand more often than not, and refusing to hit a 12 or 13 against it just concedes hands basic strategy would fight for. Insurance is its own separate losing bet, covered in full in [Blackjack Insurance, Simulated](/the-pit/blackjack-insurance-simulated/) — taking it every time the dealer shows an Ace adds a steady drip of extra loss on top of everything else.

None of these mistakes are exotic. They're the default instincts of a player who's never seen a strategy chart: stand when a hand feels risky, don't put more money on the table, don't break up a pair. Each one quietly hands more of the game to the house.

## Verdict

**Basic strategy doesn't guarantee a winning session, but it's the difference between a roughly 0.5% game and a roughly 6% game.** That gap compounds fast: over the same amount of action, a player making these four common mistakes loses on the order of ten times more than one playing correctly, without ever placing a single bet the "bad" player didn't also place.

*Simulation and analysis by 0Stakes. Full methodology at [/methodology/](/methodology/).*

## Related

* [Blackjack Basic Strategy Chart](/strategy/blackjack/basic-strategy/)
* [Blackjack Strategy Trainer](/games/blackjack/trainer/)
* [Methodology](/methodology/)
