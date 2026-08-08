---
title: The Pass Line and Why Odds Bets Matter
seoTitle: "Pass Line and Odds Bets: How Craps Odds Work | 0stakes"
description: Why the Pass Line is craps' foundation bet, and how stacking Odds behind it lowers the house edge closer to zero than any other bet on the table.
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Craps
    url: /strategy/craps/
  - name: Pass Line and Odds
    url: /strategy/craps/pass-line-and-odds/
---

The Pass Line is the bet almost everyone at a craps table has action on, and it's a good default for a reason: it's simple, it pays even money, and the house edge is a modest {{ odds.houseEdge.passLine }}% — low compared to most casino games.

## How it works

On the come-out roll, a Pass Line bet wins on 7 or 11 and loses on 2, 3, or 12. Any other total (4, 5, 6, 8, 9, or 10) becomes "the point." Once a point is set, the bet just waits: roll the point again before a 7 shows up, and it wins. Roll a 7 first — a "seven-out" — and it loses.

## Where Odds come in

Once a point is established, you can back your Pass Line bet with an **Odds bet** — a side bet that pays *true odds*, meaning zero house edge. It's the only bet on the entire table where the casino makes no money off you mathematically.

Odds pay based on how likely the point is to repeat before a 7:

- **Point 4 or 10** — pays {{ odds.trueOddsStr[4] }}
- **Point 5 or 9** — pays {{ odds.trueOddsStr[5] }}
- **Point 6 or 8** — pays {{ odds.trueOddsStr[6] }}

Most tables cap how much you can bet in Odds relative to your Pass Line bet — commonly "{{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x," meaning up to {{ odds.oddsMult[4] }}x on points of 4/10, {{ odds.oddsMult[5] }}x on 5/9, and {{ odds.oddsMult[6] }}x on 6/8. The bigger the Odds bet relative to your flat bet, the more your *overall* bet blends toward that 0% edge.

## The practical takeaway

A $10 Pass Line bet alone carries a {{ odds.houseEdge.passLine }}% house edge. Add max Odds on a {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x table and your blended edge drops to roughly {{ odds.houseEdge.passLineFullOdds }}% — one of the best bets available anywhere in a casino. If you're optimizing for the lowest possible cost of play, Pass Line + max Odds is the combination to build a strategy around.

The free [craps table](/games/craps/) shows your max Odds live based on the current point, so you can practice sizing these bets correctly before it matters.

For how every other bet on the table compares, see the full [house edge ranking](/strategy/craps/house-edge/).

<p><a href="/strategy/craps/">Back to craps strategy →</a></p>
<p><a href="/strategy/craps/how-to-play/">Read the full how-to-play guide →</a></p>
