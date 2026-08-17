---
title: "How to Play Baccarat: Beginner's Guide"
seoTitle: "How to Play Baccarat: Beginner's Guide to Rules & Payouts | 0stakes"
description: A beginner's guide to baccarat — Player, Banker, and Tie explained, how hands are scored, the third-card rules in plain language, and the best mathematical bet.
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Baccarat
    url: /strategy/baccarat/
  - name: How to Play
    url: /strategy/baccarat/how-to-play/
---

Baccarat looks intimidating at a real table, but it's one of the simplest games in the casino to actually play: two hands are dealt, you bet on which one wins (or that they'll tie), and every card decision after that is automatic. There's nothing to learn about hitting or standing — that part plays itself.

<p class="strategy-link"><a class="btn" href="/games/baccarat/">Practice on the free baccarat table →</a></p>

## Player, Banker, and Tie

These are the three bets, not two players sitting across from each other — "Player" and "Banker" are just the names of the two hands being compared. You can bet on either hand to win, or bet that they'll end up tied:

- **Player bet** — pays {{ baccaratOdds.payoutStr.player }}.
- **Banker bet** — pays {{ baccaratOdds.payoutStr.banker }}, minus a {{ baccaratOdds.bankerCommissionPct }}% commission on the win.
- **Tie bet** — pays {{ baccaratOdds.payoutStr.tie }}. Only wins if Player and Banker end up with the exact same total.

If you bet Player or Banker and the hands tie, your bet simply pushes (returned, no win or loss) — only a Tie bet actually resolves on a tie.

## Card values

Cards 2 through 9 are worth face value. 10, Jack, Queen, and King are all worth 0. Aces are worth 1. Suits don't matter at all.

## How hands are scored

Add up the value of both cards in a hand and keep only the last digit. A 7 and an 8 add up to 15 — that hand counts as 5, not 15. This is why every baccarat hand is worth somewhere between 0 and 9, no matter what cards make it up.

## Natural 8 or 9

If either hand's first two cards total 8 or 9, that's a "natural," and the round ends immediately — no third cards for either hand, whoever has the higher natural wins (or it's a tie if both do).

## The third-card rules, in plain language

If neither hand has a natural, up to one more card gets dealt to each hand automatically, following fixed rules:

- **Player** draws a third card on a two-card total of 0-5, and stands on 6 or 7.
- **Banker** follows a more complex rule that factors in both Banker's own total and whatever card Player just drew (if any) — but the short version is that Banker draws on low totals and stands on high ones, weighted to keep the game close to fair. You never have to calculate this yourself; it happens automatically every time.

Nobody at the table makes a decision here — it's the one part of baccarat with zero strategy involved, unlike blackjack's hit/stand calls.

## How payouts work

Bets settle the instant both hands are final. Player and Banker pay even money in either direction (Banker with the commission taken off the top); Tie pays {{ baccaratOdds.payoutStr.tie }} only when both hands land on the same number.

## Beginner mistakes

- **Betting Tie for the big payout** — {{ baccaratOdds.payoutStr.tie }} looks great until you check how rarely it actually happens. See the [odds and house edge breakdown](/strategy/baccarat/odds-house-edge/).
- **Assuming the commission makes Banker worse than Player** — it doesn't. Banker is still the better bet even after the commission; see why below.
- **Chasing "streaks"** — each hand is dealt from a fresh shuffle-adjusted shoe with no memory of the last hand. A string of Banker wins doesn't make Player "due."

## The best mathematical bet

**Banker.** Even after the {{ baccaratOdds.bankerCommissionPct }}% commission, it carries the lowest house edge of the three bets on the table. Full comparison on [Banker vs Player vs Tie](/strategy/baccarat/banker-vs-player-vs-tie/).

<p class="strategy-link"><a class="btn" href="/games/baccarat/">Try it on the free baccarat table →</a></p>
