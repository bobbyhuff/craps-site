---
title: "3 Point Molly Craps Strategy: What the Math Actually Says"
seoTitle: "3 Point Molly Craps Strategy: What the Math Actually Says | 0stakes"
description: What the 3 Point Molly craps strategy actually is, how to play it step by step, and what the math says about a strategy built from mostly low-house-edge bets.
date: 2026-08-16
ogType: article
breadcrumb:
  - name: The Pit
    url: /the-pit/
  - name: 3 Point Molly
    url: /the-pit/3-point-molly-craps-strategy/
extraCss: /games/craps/craps.css
---

The 3 Point Molly is one of the most recommended craps strategies that isn't just a Pass Line bet with Odds. It's popular for a specific reason: it keeps three numbers working at once, mostly through bets that are already near the top of the [house-edge chart](/strategy/craps/house-edge/), instead of through the high-edge proposition bets a strategy like the Iron Cross leans on. Here's exactly what it is, how to play it, and what the math actually says about it.

## What is the 3 Point Molly?

The 3 Point Molly is a Pass Line bet backed with Odds, plus two Come bets, each also backed with Odds once they land on a number. Once all three are established, you have three different point numbers "working" at the same time, each carrying the same bet structure: a flat portion at a low, fixed house edge, and an Odds portion behind it at zero house edge.

The name comes directly from the mechanic — three points, each one part of the same "family" of bet (Pass Line and Come are mathematically identical, just started at different times), run at once. It isn't a system that beats the house edge; nothing is. It's a way of getting more simultaneous action out of bets that are already some of the cheapest on the table, rather than reaching for the Field and hardways the way the Iron Cross does.

## How to play the 3 Point Molly

1. **Make a Pass Line bet** on the come-out roll, same as any other round.
2. **Take Odds once a point is established.** Back the Pass Line with Odds up to the table's max (standard {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x).
3. **Make a Come bet.** It travels to whatever number the next roll lands on, the same way a Pass Line bet becomes a point.
4. **Continue until three numbers are working.** Repeat the Come bet until you have the original Pass Line point plus two Come points running simultaneously — three numbers "on" at once, which is where the strategy gets its name.
5. **Take Odds behind each Come bet** once it lands on a number, the same way you took Odds behind the Pass Line.

From there you just let all three ride: each number wins if it repeats before a 7, and loses (along with the other two) the moment a 7 shows, since a seven-out ends every working bet on the table at once, not just one of them.

<p class="strategy-link"><a class="btn" href="/games/craps/">Try the 3 Point Molly on our free craps simulator →</a></p>

## Example round

Starting bankroll: $500.

1. **$10 Pass Line.** Come-out roll: <span class="pips">&#9859;&#9857;</span> = 6. Not 7, 11, or craps, so **6 becomes the point**.
2. **Take $50 in Odds** behind the 6 ({{ odds.oddsMult[6] }}x max on a point of 6). $60 now working on that number.
3. **$10 Come bet.** Next roll: <span class="pips">&#9857;&#9857;</span> = 4. Not the point and not a 7, so this roll doesn't touch the Pass Line — but the Come bet moves to the 4. Take $30 in Odds behind it ({{ odds.oddsMult[4] }}x on a point of 4). Two numbers now working: 6 and 4.
4. **Another $10 Come bet.** Next roll: <span class="pips">&#9858;&#9860;</span> = 8. The Come bet moves to the 8. Take $50 in Odds behind it ({{ odds.oddsMult[6] }}x on a point of 8, same cap as 6). **Three numbers now working: 6, 4, and 8** — the "3 Point Molly" in full.
5. **Roll: <span class="pips">&#9861;&#9857;</span> = 8.** The 8 repeats. Come-8 wins: $10 even money plus {{ odds.trueOddsStr[6] }} on the $50 Odds, which is $60. **Total win: $70.**

Total at risk at the moment all three numbers were working: $10 + $50 (Pass Line + Odds) + $10 + $30 (Come 4 + Odds) + $10 + $50 (Come 8 + Odds) = **$160**. The player could make a new $10 Come bet to replace the resolved 8 and keep three numbers running, or stop there.

## Why players like it

A single Pass Line bet with Odds is quiet. Most rolls do nothing to it at all — the shooter can go five or six rolls without a single result on your one working number. The 3 Point Molly fixes that by having three numbers live simultaneously, so far more rolls actually resolve something. It has the same appeal as the [Iron Cross](/the-pit/iron-cross-simulated/) — constant action instead of long stretches of nothing — but built from bets that are structurally much cheaper: Pass Line, Come, and Odds, rather than the Field and Place 5 the Iron Cross adds on top.

## The math behind the strategy

No betting system changes the house edge on any individual bet. The 3 Point Molly doesn't either — it's still a Pass Line bet, two Come bets, and three Odds bets, each priced exactly the way it's priced everywhere else on the table: {{ odds.houseEdge.passLine }}% on every flat portion, 0% on every Odds portion.

What actually changes is exposure, not edge. Expected loss scales with how much money is in action, not with how many different numbers it's spread across — three $10 flat bets working at once expose $30 to the {{ odds.houseEdge.passLine }}% edge instead of $10, and three Odds bets expose that much more money to the zero-edge portion too. The 3 Point Molly doesn't cost more *per dollar wagered* than a single Pass Line bet with Odds. It costs more *per round*, because there's more total money working, and it swings harder in both directions for the same reason — more can be won on a hot roll, and more is lost the moment a 7 shows and clears all three numbers at once.

This site hasn't run a dedicated simulation of the 3 Point Molly the way it has for the [Iron Cross](/the-pit/iron-cross-simulated/), so the specific session-level numbers (win rate, median result, bust risk) aren't published here yet — this page sticks to what's verifiable from the underlying bet math rather than inventing session statistics that haven't actually been run.

## 3 Point Molly vs Pass Line + Odds

Pass Line with max Odds alone is the more conservative version of the same idea: one number working, lower total exposure, lower variance, and the full {{ odds.houseEdgeStr.passLineFullOdds }}% blended edge on whatever you have riding. The 3 Point Molly is the same bet type run three times over — same per-dollar edge on each of the three, but roughly three times the money in action at any given moment, which means roughly three times the expected loss per round and a much wider spread of possible outcomes.

Neither approach beats the other mathematically; they're the same bet at different scale. The choice comes down to how much action you want relative to how much you're comfortable risking at once, not which one is "smarter." For a full breakdown of how the Iron Cross compares on the higher-edge end of that same tradeoff, see [the Iron Cross, simulated](/the-pit/iron-cross-simulated/).

## Bankroll considerations

Three simultaneous flat bets plus three simultaneous Odds bets means the 3 Point Molly needs a meaningfully larger bankroll than a single Pass Line bet with Odds, especially once all three numbers are established at once. In the example above, $160 was at risk simultaneously from a starting bankroll of $500 — before any of the three Come bets have even resolved once. Sizing the flat bet too aggressively relative to your bankroll is the fastest way to turn a strategy built from low-edge bets into a strategy that busts you on ordinary variance rather than bad luck. See [bankroll management](/strategy/bankroll-management/) for how to size flat bets and Odds against a starting bankroll before trying this at the table.

## Is the 3 Point Molly a good strategy?

As a way to get more action without reaching for high-edge proposition bets, yes — the 3 Point Molly keeps every dollar on bets that are already near the top of the [house-edge chart](/strategy/craps/house-edge/), which is a real advantage over strategies like the Iron Cross that fill the same "always have something working" craving with much worse-priced bets. As a way to beat the house edge, no — it can't, and no combination of Pass Line, Come, and Odds bets ever will, because none of those individual bets change based on how many others are running alongside them.

If the appeal is having more than one number working without paying for it with a worse house edge, the 3 Point Molly is a mathematically sound way to do that, provided the bankroll actually supports three bets running at once. If the appeal is simplicity, a single Pass Line bet with max Odds gets the same {{ odds.houseEdgeStr.passLineFullOdds }}% edge with a third of the exposure and none of the bookkeeping.

Read [how to play craps](/strategy/craps/how-to-play/) for the mechanics behind every bet used here, the [Pass Line and Odds guide](/strategy/craps/pass-line-and-odds/) for why Odds specifically matter, or the [craps glossary](/strategy/craps/glossary/) for any term along the way. Then try building three points at once on the free simulator, without risking anything real.

<p class="strategy-link"><a class="btn" href="/games/craps/">Try the 3 Point Molly on our free craps simulator →</a></p>
