---
title: "The Iron Cross, Simulated: What It Actually Costs"
seoTitle: "Iron Cross Craps Strategy Simulated: Does It Work? | 0stakes"
description: The Iron Cross wins on almost every roll and still loses money faster than any other common craps strategy. One million simulated rounds show exactly why.
date: 2026-08-09
ogType: article
breadcrumb:
  - name: The Pit
    url: /the-pit/
  - name: Iron Cross, Simulated
    url: /the-pit/iron-cross-simulated/
extraCss: /games/craps/craps.css
---

The Iron Cross is the strategy that looks like it beat craps. Cover the right numbers and it
wins on almost every roll that isn't a 7. New players see it work three, five, ten times in a
row and assume they've found the exception. They haven't, and the reason they haven't is
visible only once you run the bet through enough rolls to see what's actually happening
underneath the streak. This is what one million simulated rounds show it costs, roll by roll,
not opinion, not a hunch from a good night at the table.

## What it is, and why it's seductive

Once a point is established, an Iron Cross bettor covers the Field, plus Place bets on 5, 6,
and 8. Between the Field's 2, 3, 4, 9, 10, 11, and 12, and the Place numbers 5, 6, and 8,
every possible total is covered except one: 7. Roll anything but a 7 and something on the
table pays. Roll a 7 and everything on the table dies at once. It feels like you've built a
machine that only loses on the least useful number in the game to lose on, since 7 already
ends the round for the Pass Line anyway and everyone at the table is used to fearing it.

The name comes from the shape the bets make on the layout: Field across the bottom, the three
Place numbers running up the middle like the arms of a cross. It's one of the most commonly
suggested "systems" for players who find the Pass Line boring, precisely because it produces
visible action almost constantly instead of the long stretches of nothing a single flat bet
can produce between resolutions.

## Methodology

1,000,000 simulated rounds, seed 43, $5 base unit: Field $5, Place 5 $5, Place 6 $6, Place 8
$6, for $22 total at risk once a point is set. Bets come down automatically on the seven-out,
matching how the bet is actually played at a real table. Every number below comes directly
from that simulation's printed output, not from memory or a generic reference table.

## The trap

Across every round where the bet was actually live (a point established, 66.7% of all
rounds), it ended positive **49.7% of the time**. Close to a coin flip, and it feels even
better than that in the moment because most of the losing rounds still paid something on the
way down; only the final seven-out roll of a losing round is a clean loss. A bettor watching
their stack grow on roll after roll has no visual cue that anything is wrong until the round
actually ends. The bet is built to feel like it's winning even in the rounds it eventually
loses, since every non-seven roll along the way genuinely did pay out real chips.

That's the entire mechanism behind why the Iron Cross has a reputation for "working." Reputation
gets built from what a bet feels like across a session, and a bet that wins something on two
rolls out of every three feels completely different from a bet that only resolves once. The
underlying math doesn't care about that difference at all.

## What it actually costs

The number that matters is loss per roll of the dice, not per round, since rounds vary
wildly in length and a round that lasts 20 rolls exposes far more money to the house edge
than one that lasts 2. Across 3,373,744 total rolls simulated, the Iron Cross lost **$0.1841
per roll**, or 4.235% of the $22 at risk on every live round. Compare that to a Pass Line bet
backed with max Odds, which loses about $0.042 per roll (from $0.1402 lost per round over an
average 3.37 rolls per round, the same math applies whether or not Odds are added, see [Pass
Line vs Don't Pass](/the-pit/pass-line-vs-dont-pass/) for why). The Iron Cross costs roughly
**4.4x more per roll of the dice** than the best bet on the table, for a bet that many players
consider a downgrade from the Pass Line, not a step up from it.

Per-roll cost is the fair way to compare bets with completely different payout shapes, since
both bets are actually governed by the same underlying process: roll until the point repeats
or a 7 shows, averaging 3.37 rolls either way. The difference isn't how long a round lasts.
It's how much action, and how much house edge, gets packed into each roll along the way.

<figure class="learn-figure">
  <svg viewBox="0 0 320 160" role="img" aria-labelledby="icTitle icDesc" class="dgm">
    <title id="icTitle">Loss per roll of the dice, by strategy</title>
    <desc id="icDesc">Pass Line flat loses about 4.2 cents per roll. Pass Line with max odds
      loses the same 4.2 cents per roll, since odds don't change the dollars lost, only the
      ratio. The Iron Cross loses about 18.4 cents per roll, roughly 4.4 times more.</desc>
    <text x="0" y="10" class="dgm-axis">STRATEGY</text>
    <text x="150" y="10" class="dgm-axis">LOSS PER ROLL</text>
    <text x="36" y="38" class="dgm-rowlab" text-anchor="end">Pass Line</text>
    <path d="M40 26 H95 a4 4 0 0 1 4 4 V38 a4 4 0 0 1 -4 4 H40 Z" class="bar"/>
    <text x="107" y="38" class="dgm-val">$0.042</text>
    <text x="36" y="78" class="dgm-rowlab" text-anchor="end">Pass + Odds</text>
    <path d="M40 66 H95 a4 4 0 0 1 4 4 V78 a4 4 0 0 1 -4 4 H40 Z" class="bar"/>
    <text x="107" y="78" class="dgm-val">$0.042</text>
    <text x="36" y="118" class="dgm-rowlab-hi" text-anchor="end">Iron Cross</text>
    <path d="M40 106 H276 a4 4 0 0 1 4 4 V118 a4 4 0 0 1 -4 4 H40 Z" class="bar-hi"/>
    <text x="288" y="118" class="dgm-val-hi">$0.184</text>
    <path d="M40 132 H300" class="dgm-rule"/>
    <text x="40" y="150" class="dgm-foot">Same axis, same roll of the dice, 4.4x the cost.</text>
  </svg>
  <figcaption>
    Odds bets don't move the Pass Line's bar at all. That's the whole finding in <a
    href="/the-pit/pass-line-vs-dont-pass/">piece two</a>.
  </figcaption>
</figure>

## Session reality

Over 100-round sessions, the Iron Cross posts a median result of **-$64**, finishes ahead
only **33.6%** of the time, and drops below -$300 in **5.5%** of sessions. The worst single
round observed was -$22, the full amount at risk, a seven-out on the very first roll after
the point was set. The best was +$172, a long roll where nearly every number hit before the
eventual seven-out. Both are real outcomes from the same bet; the difference is which one is
typical, and typical here means a session that's behind by the end more often than not.

Compare that 33.6% ahead-rate over 100 rounds to Pass Line with max Odds, which finishes
ahead 47.2% of the time over the same span despite carrying real per-round variance of its
own. The Iron Cross doesn't just cost more per roll. It also wins the session less often,
which is the opposite of what its constant-action feel would suggest.

## Why the illusion works

Every losing round still pays out along the way. A shooter who rolls a 6, a 9, an 8, and a 4
before sevening out just handed the Iron Cross bettor four small wins before the one loss
that erases all of them and part of the buy-in besides. Humans remember the four wins more
vividly than the one loss, especially when the loss is a single fast event at the very end of
a streak that felt good the whole way through. The math doesn't care how the wins and losses
are distributed across the round. Only the total at the end does, and the total is negative
4.235% of every dollar at risk, every single live round, without exception.

## What to do instead

A single Pass Line bet with max Odds costs roughly a quarter of what the Iron Cross costs per
roll of the dice, with no illusion of constant action to fight against, just a bet that either
resolves or doesn't. If the appeal of the Iron Cross is having something ride on every roll
instead of waiting on a single point, Place bets on 6 and 8 alone get closer to that feeling
for a fraction of the cost, without the Field and Place 5 legs that do most of the damage;
6 and 8 combined still hit on more than half of all rolls, just without the extra numbers
tacked on for the sake of covering everything.

Neither replacement is as exciting to watch as four bets settling at once. Both keep more of
your money in your stack after the same number of rolls, which is the only comparison that
actually determines how long a bankroll lasts at the table.

The Iron Cross isn't a scam and it isn't rigged against you any more than any other bet on
the layout; it's simply priced for how it feels rather than for how it pays. Every casino
game has at least one bet like that, a version of the action that trades real cost for
constant motion. Craps happens to make its version unusually easy to spot once the numbers
are actually run.

Read the full [craps house edge ranking](/strategy/craps/house-edge/) for how every bet on
the table compares, or see it happen for yourself on the free [craps
table](/games/craps/), where you can run a hundred Iron Cross rounds without risking anything
real.
