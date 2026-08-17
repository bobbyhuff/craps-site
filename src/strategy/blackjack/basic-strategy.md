---
title: "Blackjack Basic Strategy Chart: 6 Deck, Dealer Stands on Soft 17"
seoTitle: "Blackjack Basic Strategy Chart — 6 Deck S17 | 0stakes"
description: Use our free 6-deck blackjack basic strategy chart for games where the dealer stands on soft 17. Learn when to hit, stand, double, or split, then practice for free.
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Blackjack
    url: /strategy/blackjack/
  - name: Basic Strategy Chart
    url: /strategy/blackjack/basic-strategy/
---

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"Should I hit or stand on 16?","acceptedAnswer":{"@type":"Answer","text":"It depends on the dealer's upcard. Stand on a hard 16 against a dealer 2 through 6. Hit a hard 16 against a dealer 7 through Ace -- those are strong dealer cards, and standing on a weak 16 loses more often than hitting does."}},
{"@type":"Question","name":"Should I split 8s?","acceptedAnswer":{"@type":"Answer","text":"Yes, always. A pair of 8s is a weak hard 16, and splitting turns one bad hand into two hands that each start from a much stronger 8. Split 8s against every dealer upcard, including a dealer 10 or Ace."}},
{"@type":"Question","name":"Should I split 10s?","acceptedAnswer":{"@type":"Answer","text":"No. A pair of 10s is a hard 20, one of the strongest hands in the game. Splitting trades a near-guaranteed winner for two unknown hands. Basic strategy always stands on a pair of 10s."}},
{"@type":"Question","name":"Should I always split aces?","acceptedAnswer":{"@type":"Answer","text":"Yes, against every dealer upcard. Two aces make a weak soft 12 if you play them as one hand; split, each ace becomes the start of a hand that only needs a 10-value card for 21."}},
{"@type":"Question","name":"What does S17 mean in blackjack?","acceptedAnswer":{"@type":"Answer","text":"S17 means the dealer stands on soft 17 (a hand like Ace-6). It's the more player-favorable rule, the opposite of H17 (dealer hits soft 17). 0stakes deals S17, and this chart is built for that rule specifically."}},
{"@type":"Question","name":"Does basic strategy guarantee you win?","acceptedAnswer":{"@type":"Answer","text":"No. Basic strategy is the mathematically optimal decision for every hand against the house edge that already exists -- it minimizes your losses over time, it doesn't erase them. The house still keeps a small long-run edge even when every decision is played correctly."}}
]}
</script>

This chart matches the exact rules the [0stakes blackjack simulator](/games/blackjack/) deals: 6 decks, blackjack pays 3:2, dealer stands on soft 17, double down allowed on any first two cards (including after a split), and one split per hand. Every decision below is the mathematically correct play for that specific rule combination, not a generic chart borrowed from a different game.

<div class="btn-row">
  <a class="btn" href="/games/blackjack/">Practice Basic Strategy for Free →</a>
</div>

## Legend

**H** = Hit &nbsp;&middot;&nbsp; **S** = Stand &nbsp;&middot;&nbsp; **D** = Double &nbsp;&middot;&nbsp; **P** = Split

0stakes allows doubling down on any first two cards, including after a split, so every **D** below is unconditional -- there's no "double if allowed, otherwise hit" fallback to worry about the way there is on tables with restricted doubling.

## Hard hands

Hands with no ace, or an ace counted as 1 because counting it as 11 would bust.

<table>
<thead>
<tr><th>Hand</th>{% for c in blackjackStrategy.DEALER_UPCARDS %}<th>{{ c }}</th>{% endfor %}</tr>
</thead>
<tbody>
{% for row in blackjackStrategy.HARD_TOTALS %}
<tr><td>{{ row.hand }}</td>{% for d in row.dec %}<td>{{ d }}</td>{% endfor %}</tr>
{% endfor %}
</tbody>
</table>

## Soft hands

Hands with an ace counted as 11 -- an Ace-6, for example, is a "soft 17" because it can't bust on the next card.

<table>
<thead>
<tr><th>Hand</th>{% for c in blackjackStrategy.DEALER_UPCARDS %}<th>{{ c }}</th>{% endfor %}</tr>
</thead>
<tbody>
{% for row in blackjackStrategy.SOFT_TOTALS %}
<tr><td>{{ row.hand }}</td>{% for d in row.dec %}<td>{{ d }}</td>{% endfor %}</tr>
{% endfor %}
</tbody>
</table>

## Pairs

Whether to split a matching pair instead of playing it as a hard or soft total.

<table>
<thead>
<tr><th>Hand</th>{% for c in blackjackStrategy.DEALER_UPCARDS %}<th>{{ c }}</th>{% endfor %}</tr>
</thead>
<tbody>
{% for row in blackjackStrategy.PAIRS %}
<tr><td>{{ row.hand }}</td>{% for d in row.dec %}<td>{{ d }}</td>{% endfor %}</tr>
{% endfor %}
</tbody>
</table>

## How to use the blackjack strategy chart

Find your hand total in the left column, then read across to the column matching the dealer's upcard -- the single card the dealer is showing before you act. Where that row and column meet is the correct play. If you're holding a pair, check the Pairs table first; otherwise use Hard or Soft depending on whether an ace is counted as 11.

## What is blackjack basic strategy?

Basic strategy is the mathematically optimal decision -- hit, stand, double, or split -- for every possible hand against every possible dealer upcard, given a specific set of table rules. It's computed from the full probability of every outcome, not a hunch or a habit. Playing it perfectly doesn't turn the game in your favor; it simply minimizes how much of the house's edge you actually pay by avoiding the costly mistakes casual players make on close hands like a hard 16 or a stiff 12.

## Why blackjack rules matter

Basic strategy isn't one universal chart -- it changes with the specific rules a table deals. The decisions above depend on:

* **Number of decks** -- more decks slightly favor the dealer and shift a handful of borderline plays.
* **S17 vs. H17** -- whether the dealer stands or hits a soft 17 changes several doubling decisions, most notably soft 19 against a dealer 6.
* **Double-after-split rules** -- allowing doubling after a split changes when it's correct to split hands like 4,4 or 6,6.
* **Surrender rules** -- tables that allow surrender have extra correct plays on the very worst hands, like a hard 16 against a 10.
* **Blackjack payout** -- a 6:5 blackjack payout instead of 3:2 doesn't change *which* play is correct, but it does raise the house edge substantially.

This chart is built specifically for the 0stakes rules listed at the top of the page: 6 decks, blackjack pays 3:2, dealer stands on soft 17, double on any first two cards and after a split, one split per hand, no surrender. Using a chart built for different rules will occasionally give you the wrong answer here.

## Basic strategy FAQ

**Should I hit or stand on 16?**
It depends on the dealer's upcard. Stand on a hard 16 against a dealer 2 through 6. Hit against a dealer 7 through Ace.

**Should I split 8s?**
Yes, always, against every dealer upcard. A pair of 8s is a weak hard 16; splitting gives you two hands starting from a much stronger 8 instead.

**Should I split 10s?**
No. A pair of 10s is a hard 20, one of the strongest hands in the game. Basic strategy always stands on it.

**Should I always split aces?**
Yes, against every dealer upcard. Two aces played together are only a soft 12; split, each ace just needs a 10-value card for 21.

**What does S17 mean in blackjack?**
S17 means the dealer stands on soft 17 (like Ace-6), the more player-favorable rule. 0stakes deals S17, and this chart is built for that rule specifically -- an H17 chart (dealer hits soft 17) differs on a handful of cells.

**Does basic strategy guarantee you win?**
No. It's the mathematically optimal decision for the house edge that already exists, not a way to erase that edge. It minimizes losses over time; it doesn't guarantee any individual hand or session comes out ahead.

Think you've got it? [Practice on the free blackjack simulator](/games/blackjack/), or drill every hand until it's automatic on the [strategy trainer](/games/blackjack/trainer/).
