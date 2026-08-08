---
title: "Craps House Edge by Bet, Ranked (Best to Worst)"
seoTitle: "Craps House Edge by Bet, Ranked Best to Worst | 0stakes"
description: Every craps bet ranked by house edge, from Pass Line with full odds (0.37%) down to Any Seven (16.67%) — the numbers that should actually drive your strategy.
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Craps
    url: /strategy/craps/
  - name: House Edge by Bet
    url: /strategy/craps/house-edge/
---

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What's the best bet in craps?","acceptedAnswer":{"@type":"Answer","text":"Pass Line or Come bets backed with max Odds, at a {{ odds.houseEdgeStr.passLineFullOdds }}% house edge on a standard {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x table. The Odds portion itself carries no house edge at all."}},
{"@type":"Question","name":"What's the worst bet in craps?","acceptedAnswer":{"@type":"Answer","text":"Any Seven, at a {{ odds.houseEdgeStr.anySeven }}% house edge. It pays only {{ odds.anySevenPayStr }} on a bet that wins about one roll in six."}},
{"@type":"Question","name":"What's the house edge on the Pass Line?","acceptedAnswer":{"@type":"Answer","text":"{{ odds.houseEdgeStr.passLine }}% with no Odds behind it, dropping to {{ odds.houseEdgeStr.passLineFullOdds }}% with max Odds on a {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x table."}},
{"@type":"Question","name":"Does the Odds bet have a house edge?","acceptedAnswer":{"@type":"Answer","text":"No. Odds bets behind the Pass Line, Don't Pass, Come, or Don't Come pay true odds with zero house edge, the only bet in the casino where that's the case."}}
]}
</script>

Every bet on a craps table has a fixed, published house edge — none of it is hidden or negotiable. Knowing the actual numbers is the fastest way to tell a good bet from a bad one, regardless of how it "feels" at the table.

## The full ranking

| Bet | House Edge |
|---|---|
| Pass Line / Come, with {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x Odds | {{ odds.houseEdgeStr.passLineFullOdds }}% |
| Pass Line / Come, with single Odds | {{ odds.houseEdgeStr.passLineSingleOdds }}% |
| Don't Pass / Don't Come | {{ odds.houseEdgeStr.dontPass }}% |
| Pass Line / Come (no odds) | {{ odds.houseEdgeStr.passLine }}% |
| Place 6 or 8 | {{ odds.houseEdgeStr.place6or8 }}% |
| Field | {{ odds.houseEdgeStr.field }}% |
| Place 5 or 9 | {{ odds.houseEdgeStr.place5or9 }}% |
| Buy 4 or 10 ({{ odds.buyCommissionPct }}% vig) | {{ odds.houseEdgeStr.buy4or10 }}% |
| Place 4 or 10 | {{ odds.houseEdgeStr.place4or10 }}% |
| Hard 6 or 8 | {{ odds.houseEdgeStr.hard6or8 }}% |
| Any Craps | {{ odds.houseEdgeStr.anyCraps }}% |
| Hard 4 or 10 | {{ odds.houseEdgeStr.hard4or10 }}% |
| Any Seven | {{ odds.houseEdgeStr.anySeven }}% |

## What actually stands out

**Odds bets are the only bet in the casino with zero house edge.** They don't appear in the table above on their own because they can't be made alone — but stacked behind a Pass Line bet, they pull the *blended* edge down to {{ odds.houseEdgeStr.passLineFullOdds }}% on a standard {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x table. Nothing else on the layout comes close.

**Place 6 and 8 are quietly excellent.** At {{ odds.houseEdgeStr.place6or8 }}%, they're barely worse than a bare Pass Line bet, and unlike Pass Line, you can bet them anytime without waiting for a new come-out roll.

**The Field's 2.78% is the real number, not a typo.** Most craps sites quote the Field at 5.56%, which is correct only on tables where both 2 and 12 pay double. This table pays **triple on 12**, and that one change cuts the edge in half — down to {{ odds.houseEdgeStr.field }}%, better than a Place bet on 5 or 9. If you've seen the worse number elsewhere, this isn't a mistake — it's a better paytable.

**Buy bets only make sense on 4 and 10.** The {{ odds.buyCommissionPct }}% commission is a flat tax, so it hurts most on numbers with the worst payout odds otherwise. On 4/10 it actually beats the equivalent Place bet ({{ odds.houseEdgeStr.buy4or10 }}% vs {{ odds.houseEdgeStr.place4or10 }}%); on 6/8 it's strictly worse than just Placing them.

**Any Seven is the worst bet on the table.** A {{ odds.houseEdgeStr.anySeven }}% edge means the casino keeps roughly a sixth of every dollar wagered on it, long-run. It's tempting because 7 is the single most common roll — but that's exactly why the payout is priced so badly against you.

## The takeaway

If you're optimizing purely for the lowest cost of play: Pass Line (or Come) with max Odds, Don't Pass, Place bets on 6 and 8, and the Field are the low-cost side of the layout. Everything at 4% and above is paying for excitement, not value.

Read more on the [Pass Line and Odds](/strategy/craps/pass-line-and-odds/) specifically, or practice sizing these bets on the [free craps table](/games/craps/).
