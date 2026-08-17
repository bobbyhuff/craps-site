---
title: "Casino House Edge: Table Games Ranked From Best to Worst"
seoTitle: "Casino House Edge Chart: Every Table Game Ranked | 0stakes"
description: Every table game's house edge, from the 0% craps Odds bet to a 14.36% baccarat Tie — ranked, explained, and shown as expected loss per $100 and $1,000 wagered.
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Casino House Edge
    url: /strategy/house-edge/
---

Every bet in a casino has a fixed, publishable house edge — a percentage of every dollar wagered that the casino expects to keep over the long run. None of it is hidden, and none of it is negotiable once you know where to look. This page ranks every bet available on 0stakes from best to worst.

## What house edge means

House edge is the casino's expected profit, as a percentage of total money wagered, if a bet were made an enormous number of times. A 5% house edge doesn't mean you lose 5% of your bankroll every time you play — it means that across millions of dollars in bets, the casino nets roughly 5 cents of every dollar wagered (not per bet placed once, but per dollar bet in total, since most bets get wagered again and again over a session).

## House edge vs RTP

RTP ("return to player") is just the flip side of the same number: RTP = 100% − house edge. A bet with a 5.26% house edge has a 94.74% RTP. They describe the identical math from two directions — house edge frames it as the casino's cut, RTP frames it as what comes back to you.

## House edge vs chance of winning

These are not the same thing, and mixing them up is the most common mistake in reading casino odds. A red/black bet in roulette wins close to half the time (18 of 38 numbers) but still carries a 5.26% house edge. A single-number straight-up bet wins only 1 time in 38 but carries that exact same 5.26% edge, because it pays enough more (35:1) to compensate for winning so much less often. High chance of winning and low house edge are two separate properties of a bet, and a bet can have either without the other.

## Expected loss vs one session

House edge is a long-run average, computed over a huge number of bets — it says almost nothing about what happens in one evening. Short sessions swing far above or below the expected value purely from variance; a low house-edge bet can still lose money in a single session, and a high house-edge bet can still win. The edge only reliably shows up once volume is large enough to smooth out the swings — which is exactly why casinos, who take that same bet millions of times a day across every table, can run the math as a business while any one player's single session stays unpredictable.

<p class="strategy-link"><a class="btn" href="/games/craps/">Try the math yourself, free →</a></p>

## House edge ranking: every bet on 0stakes

| Game / Bet | House Edge |
|---|---|
| [Craps Odds Bet](/strategy/craps/pass-line-and-odds/) | 0% |
| [Baccarat Banker](/strategy/baccarat/odds-house-edge/) | ~{{ baccaratOdds.houseEdge.banker }}% |
| [Baccarat Player](/strategy/baccarat/odds-house-edge/) | ~{{ baccaratOdds.houseEdge.player }}% |
| [Craps Don't Pass](/strategy/craps/house-edge/) | ~{{ odds.houseEdgeStr.dontPass }}% |
| [Craps Pass Line](/strategy/craps/house-edge/) | ~{{ odds.houseEdgeStr.passLine }}% |
| [Blackjack, correct basic strategy](/strategy/blackjack/basic-strategy/) | ~0.5% (rule-dependent — see below) |
| [European Roulette](/strategy/roulette/american-vs-european/) | 2.70% |
| [American Roulette](/strategy/roulette/odds-payouts/) | {{ rouletteOdds.houseEdge.standard }}% |
| [American Roulette Five-Number Bet](/strategy/roulette/odds-payouts/) | {{ rouletteOdds.houseEdge.topLine }}% |
| [Baccarat Tie](/strategy/baccarat/odds-house-edge/) | ~{{ baccaratOdds.houseEdge.tie }}% |

Craps' Odds bet sits at the top for a structural reason, not luck: it's the one bet in this entire chart priced at exactly true odds, with no built-in casino advantage at all. Nothing else on the list can say that.

### A note on the blackjack number

Unlike every other row above, blackjack doesn't have one universal house edge — it depends on the specific table rules: number of decks, whether the dealer hits or stands on soft 17, double-down restrictions, and the blackjack payout itself (3:2 vs the worse 6:5). Playing perfect basic strategy against 0stakes' own rules (6 decks, dealer stands on soft 17, double any two cards including after a split, blackjack pays 3:2) lands around 0.5% — a commonly cited approximate figure for this rule set, not an exact universal constant the way "5.26%" is for American roulette. See the [full basic strategy chart](/strategy/blackjack/basic-strategy/) for the rule-by-rule breakdown of why it moves.

## Expected cost example

House edge turns into a dollar figure once you multiply it by how much you actually wager:

**5.26% house edge × $1,000 wagered ≈ $52.60** theoretical expected loss.

Scaled down, the same American roulette bet over $100 wagered comes out to about $5.26. A baccarat Tie bet over that same $1,000 would cost roughly $143.60; the craps Odds bet, at a 0% edge, costs nothing in the long run no matter how much is wagered on it.

**This is long-run expected value, not a prediction of any one session.** A single night at any of these games can land well above or below its expected cost purely from variance — the house edge is what the math converges toward over enough repetitions, not a guarantee for tonight.

## Try it yourself

Every bet in the chart above is playable for free, with the same odds data driving both the games and this page:

<div class="card-grid">
  <div class="card">
    <h3><a href="/games/craps/">Craps</a></h3>
    <p>Pass Line, Odds, Place, Field, and every proposition bet on the layout.</p>
  </div>
  <div class="card">
    <h3><a href="/games/blackjack/">Blackjack</a></h3>
    <p>A real 6-deck shoe, dealer stands on soft 17, blackjack pays 3:2.</p>
  </div>
  <div class="card">
    <h3><a href="/games/roulette/">Roulette</a></h3>
    <p>A full American wheel — every inside and outside bet.</p>
  </div>
  <div class="card">
    <h3><a href="/games/baccarat/">Baccarat</a></h3>
    <p>Player, Banker, and Tie against a real 8-deck shoe.</p>
  </div>
</div>
