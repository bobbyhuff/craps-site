---
title: "How to Play Crapless Craps: Rules and Differences"
seoTitle: "How to Play Crapless Craps: Rules & Differences | 0stakes"
description: "Crapless Craps rules explained: only 7 wins the come-out, 2, 3, 11 and 12 become points, extra Place bets, odds, and why no craps doesn't mean better odds."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Crapless Craps
    url: /strategy/crapless-craps/
  - name: How to Play
    url: /strategy/crapless-craps/how-to-play/
---
**Quick answer:** Crapless Craps is craps where the Pass Line can't lose on the come-out roll. A 7 wins, and **every other number, including 2, 3, 11 and 12, becomes the point**. After that it plays exactly like regular craps: make the point before a 7 to win. The catch is that 11 no longer wins instantly, which is why the Pass Line house edge rises from {{ odds.houseEdgeStr.passLine }}% to **{{ craplessOdds.houseEdgeStr.passLine }}%**.

So "crapless" is not a better deal. It's a different trade, and on the Pass Line it's a worse one.

<p class="strategy-link"><a class="btn" href="/games/crapless-craps/">Play Crapless Craps free →</a></p>

## What Crapless Craps is

Crapless Craps (also sold as "Never Ever Craps") uses the same dice, the same table crew and mostly the same bets as standard craps. It changes one thing: the come-out roll. In standard craps, a come-out 2, 3 or 12 ("craps") loses the Pass Line. In Crapless, those numbers can't hurt you on the come-out. They become points instead.

If you've never played regular craps, the [standard how-to-play guide](/strategy/craps/how-to-play/) covers the table, the shooter and the basic flow. Everything below focuses on what's different.

## Crapless vs. regular craps at a glance

| | Regular craps | Crapless Craps |
|---|---|---|
| Come-out 7 | Pass Line wins | Pass Line wins |
| Come-out 11 | Pass Line **wins** | Becomes the **point** |
| Come-out 2, 3, 12 | Pass Line **loses** | Become the **point** |
| Point numbers | 4, 5, 6, 8, 9, 10 | 2, 3, 4, 5, 6, 8, 9, 10, 11, 12 |
| Don't Pass / Don't Come | Offered | Not offered |
| Place bets | 6 numbers | All 10 numbers |
| Pass Line house edge | {{ odds.houseEdgeStr.passLine }}% | {{ craplessOdds.houseEdgeStr.passLine }}% |

A side-by-side cost comparison is in [Crapless Craps vs. regular craps](/strategy/crapless-craps/crapless-vs-regular-craps/).

## The come-out roll

The come-out is the first roll of a new round, when no point is set. In Crapless:

- **7 wins** the Pass Line, even money. That's 6 of the 36 dice combinations, about 16.7% of come-outs.
- **Anything else becomes the point.** That's the other 30 combinations.

There is no come-out roll that loses the Pass Line. That's the whole appeal, and it's real. The cost shows up later.

## How points are established

Whatever number rolls on the come-out (other than 7) becomes the point, marked with the puck. Now you need that number again before a 7.

How likely that is depends on how many ways the dice can make it:

| Point | Ways to roll | Chance to make it before a 7 |
|---|---:|---:|
| 6 or 8 | 5 | 45.5% |
| 5 or 9 | 4 | 40.0% |
| 4 or 10 | 3 | 33.3% |
| 3 or 11 | 2 | 25.0% |
| 2 or 12 | 1 | 14.3% |

## How 2, 3, 11 and 12 become points

These four "extreme" points are the new part of the game.

- **2 or 12:** only one way to roll it, six ways to roll a 7. You make it about 1 time in 7.
- **3 or 11:** two ways vs. six. You make it 1 time in 4.

So when a 2 or 12 comes out, your Pass Line bet has survived the come-out but is now a long shot. That's still better than losing outright, which is what happens in regular craps. The 11 is the opposite story: in regular craps it's an instant winner, and here you only win it 1 time in 4.

## How the Pass Line works

1. Bet the Pass Line before the come-out.
2. Come-out 7: you win even money and the next roll is a new come-out.
3. Anything else: that's the point.
4. Point rolls again before a 7: you win even money.
5. 7 rolls first: **seven-out**, the Pass Line loses, and the dice pass to the next shooter.

Over the long run the Pass Line wins about 47.3% of the time in Crapless, against 49.3% in regular craps.

## Odds bets

Once a point is set you can back your Pass Line with an **Odds** bet. It pays true odds, so it has no house edge:

| Point | Odds pay | Max odds on the 0stakes table |
|---|---:|---:|
| 2 or 12 | {{ craplessOdds.trueOddsStr[2] }} | {{ craplessOdds.oddsMult[2] }}x |
| 3 or 11 | {{ craplessOdds.trueOddsStr[3] }} | {{ craplessOdds.oddsMult[3] }}x |
| 4 or 10 | {{ craplessOdds.trueOddsStr[4] }} | {{ craplessOdds.oddsMult[4] }}x |
| 5 or 9 | {{ craplessOdds.trueOddsStr[5] }} | {{ craplessOdds.oddsMult[5] }}x |
| 6 or 8 | {{ craplessOdds.trueOddsStr[6] }} | {{ craplessOdds.oddsMult[6] }}x |

Odds don't change the dollar cost of your Pass Line bet. They add a fair bet next to it, which lowers the edge as a share of everything you wager. Maximum odds limits vary by casino.

## Place bets

You can place any of the ten point numbers in Crapless, including the four that aren't available in regular craps:

| Number | Place pays | House edge |
|---|---:|---:|
| 6 or 8 | {{ craplessOdds.placeOddsStr[6] }} | {{ craplessOdds.houseEdgeStr.place6or8 }}% |
| 5 or 9 | {{ craplessOdds.placeOddsStr[5] }} | {{ craplessOdds.houseEdgeStr.place5or9 }}% |
| 4 or 10 | {{ craplessOdds.placeOddsStr[4] }} | {{ craplessOdds.houseEdgeStr.place4or10 }}% |
| 3 or 11 | {{ craplessOdds.placeOddsStr[3] }} | {{ craplessOdds.houseEdgeStr.place3or11 }}% |
| 2 or 12 | {{ craplessOdds.placeOddsStr[2] }} | {{ craplessOdds.houseEdgeStr.place2or12 }}% |

Place bets are off on the come-out unless you call them working, same as regular craps. Full payout tables are in [Crapless Craps odds and payouts](/strategy/crapless-craps/odds-payouts/).

## Seven-out rules

A seven-out works exactly as in regular craps: when a point is on and a 7 rolls, the Pass Line, its odds, and every working Place bet lose. With more numbers that can become the point, there are more rounds where a long-shot point like 2 or 12 is on the table, and those rounds usually end in a seven-out.

## Example rounds

All examples use a $10 Pass Line bet.

**Round 1.** Come-out: 7. Pass Line wins $10. New come-out.

**Round 2.** Come-out: 11. In regular craps you'd win $10 now. Here, 11 is the point. You add $20 odds ({{ craplessOdds.trueOddsStr[11] }} pays $60). The shooter rolls 6, 9, then 7. Seven-out: you lose $30.

**Round 3.** Come-out: 2. Regular craps would take your $10. Here, 2 is the point. You skip the odds. Rolls: 5, 8, 2. You win $10.

**Round 4.** Come-out: 6. You add $50 in odds (5x). Rolls: 4, 6. Pass Line wins $10, odds win $60 ({{ craplessOdds.trueOddsStr[6] }}). Total +$70.

## Common misconceptions

- **"No craps means better odds."** It means the come-out can't lose, not that the bet is better. The Pass Line edge is almost four times higher.
- **"11 still wins on the come-out."** Not in standard Crapless. A version where 11 also wins would be a player-favored game no casino deals.
- **"2 and 12 points are free rolls."** You'll lose most of them. You just lose them later instead of immediately.
- **"You can bet the Don't side."** Not in Crapless. With no come-out craps, there's nothing for Don't Pass to win on.
- **"Field and prop bets change too."** They don't. One-roll bets don't depend on the come-out rules.

## FAQ

### What's the main difference between Crapless Craps and regular craps?

Only 7 wins on the come-out, and 2, 3, 11 and 12 become points instead of winning or losing immediately.

### Is Crapless Craps better for the player?

Not on the Pass Line. It costs {{ craplessOdds.houseEdgeStr.passLine }}% vs. {{ odds.houseEdgeStr.passLine }}% in regular craps. Place 6 and 8 cost the same in both games.

### Can you lose on the come-out in Crapless Craps?

Not on the Pass Line. A come-out 7 wins and everything else becomes a point.

### Can you bet Don't Pass in Crapless Craps?

No. The Don't side isn't offered.

### What do odds pay on a point of 2 or 12?

{{ craplessOdds.trueOddsStr[2] }}, the true odds. There's one way to roll a 2 and six ways to roll a 7.

<p class="strategy-link"><a class="btn" href="/games/crapless-craps/">Play Crapless Craps free →</a></p>
<p class="strategy-link"><a href="/games/craps/">Or compare it with standard craps →</a></p>

## Related

- [Crapless Craps vs. Regular Craps: House Edge Compared](/strategy/crapless-craps/crapless-vs-regular-craps/)
- [Crapless Craps Odds and Payouts Chart](/strategy/crapless-craps/odds-payouts/)
- [The Pass Line and Why Odds Bets Matter](/strategy/craps/pass-line-and-odds/)
