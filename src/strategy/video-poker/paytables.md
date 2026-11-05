---
title: "Video Poker Paytables Explained: 9/6 vs. 8/5 Jacks or Better"
seoTitle: "Video Poker Paytables Explained: 9/6 vs 8/5 Jacks | 0stakes"
description: "How to read a video poker paytable, why 9/6 Jacks or Better returns 99.54% and 8/5 only 97.30%, and what the difference costs per hour of play."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Video Poker
    url: /strategy/video-poker/
  - name: Paytables Explained
    url: /strategy/video-poker/paytables/
---
**Quick answer:** In Jacks or Better, the two numbers that matter are what a Full House and a Flush pay per coin. "9/6" pays 9 and 6 and returns **{{ videoPokerOdds.comparisonTables[0].returnPct }}%** with perfect play. "8/5" pays 8 and 5 and returns **{{ videoPokerOdds.comparisonTables[1].returnPct }}%**. Everything else on the glass can be identical, and the 8/5 machine still costs about six times as much to play.

The [0stakes video poker game](/games/video-poker/) plays the 9/6 table only. The other tables on this page are here for comparison, so you can recognize them on a real machine.

## How a paytable works

A video poker paytable lists every paying hand and how many coins it returns for each number of coins bet. The machine's cards are dealt from a fair simulated deck, so the probability of every final hand is fixed by the rules of poker and your strategy. Multiply each payout by its probability, add them up, and you have the game's return.

That's the reason video poker is unusual among machine games: you can read the paytable and know the return before you put money in. A slot machine's return depends on internal reel settings you can't see.

### Coins and denominations

Payouts are listed in coins, not dollars. The coin value (the denomination) converts coins to money:

- 5 coins at $0.25 = a $1.25 bet. A Full House on 9/6 returns 45 coins = $11.25.
- 5 coins at $1 = a $5 bet. The same Full House returns $45.

Changing the denomination scales every payout equally. It doesn't change the return percentage. Changing the **number of coins** can, because of the Royal Flush.

### The Royal Flush bonus at max coins

On almost every Jacks or Better machine, the Royal Flush pays 250 per coin for 1 to 4 coins and jumps to 4,000 coins (800 per coin) at 5 coins. Every other line is linear.

| Royal Flush payout | 1 coin | 2 coins | 3 coins | 4 coins | 5 coins |
|---|---:|---:|---:|---:|---:|
| Coins returned | {{ videoPokerOdds.pays.royal[0] }} | {{ videoPokerOdds.pays.royal[1] }} | {{ videoPokerOdds.pays.royal[2] }} | {{ videoPokerOdds.pays.royal[3] }} | {{ videoPokerOdds.pays.royal[4] }} |

On 9/6, perfect play returns {{ videoPokerOdds.returnPct }}% at 5 coins and {{ videoPokerOdds.returnPctUnderMaxCoins }}% at 1 to 4 coins. If you want a smaller bet, lower the denomination and keep playing 5 coins.

## 9/6 vs. 8/5 vs. the rest

Every Jacks or Better paytable below is identical except for the Full House and Flush rows. Returns assume perfect strategy for that exact table and 5 coins.

| Paytable | Full House pays | Flush pays | Return | House edge |
|---|---:|---:|---:|---:|
{% for t in videoPokerOdds.comparisonTables %}| {{ t.label }}{% if t.label == videoPokerOdds.version %} (0stakes){% endif %} | {{ t.fullHouse }} | {{ t.flush }} | {{ t.returnPct }}% | {{ 100 | minus: t.returnPct | round: 2 }}% |
{% endfor %}

0stakes reproduced the 9/6 and 8/5 figures exactly by playing out all 2,598,960 possible deals with the best hold for each (the test that does it runs on every build), and the 7/5 and 6/5 figures with the same calculation. They match the long-published references for these games.

### Full-pay 9/6

"Full pay" means the most generous common version of a game. For Jacks or Better that's 9/6. At {{ videoPokerOdds.returnPct }}%, it has one of the lowest house edges of any game in a casino, close to blackjack with good rules and basic strategy.

### Short-pay 8/5 and below

8/5, 7/5 and 6/5 are often called "short pay". The machines look the same, and the full house and flush rows are easy to miss. The higher payouts are what most players look at, and those don't change.

## Why one coin on two lines costs so much

Under perfect play on 9/6, a Full House shows up on about 1.15% of hands and a Flush on about 1.10%. Cutting each of those payouts by one coin per coin bet removes about:

**1.15% + 1.10% ≈ 2.25 percentage points of return.**

That's almost exactly the gap between 9/6 and 8/5 ({{ videoPokerOdds.comparisonTables[0].returnPct }}% − {{ videoPokerOdds.comparisonTables[1].returnPct }}%). Strategy adjusts slightly on 8/5 and recovers a hundredth of a point, no more. A change that looks tiny on the glass is worth five times the house edge of the whole 9/6 game.

### What that costs per hour

House edge becomes money once you multiply it by how much you bet. Say you play $1 coins, 5 at a time ($5 per hand), at 600 hands per hour. That's $3,000 of total action per hour.

| Paytable | House edge | Expected cost per hour |
|---|---:|---:|
| 9/6 | 0.46% | $13.80 |
| 8/5 | 2.70% | $81.00 |
| 7/5 | 3.85% | $115.50 |
| 6/5 | 5.00% | $150.00 |

These are long-run averages, not predictions for any one hour. Video poker swings hard: you can lose much more than this in an hour, or hit a Full House streak and win. The averages only show up reliably over tens of thousands of hands.

## The assumptions behind every RTP figure

A published return is a theoretical number with conditions attached:

1. **Perfect strategy for that exact paytable.** Every hold has to be the highest-value hold. Using a simplified chart on 9/6 gets you about {{ videoPokerOdds.simpleStrategyReturnPct }}%, and real mistakes cost more.
2. **Max coins.** Below 5 coins the Royal bonus disappears.
3. **A fair, random deal** from a single 52-card deck.
4. **An enormous number of hands.** The Royal Flush, worth about 2 percentage points of return, comes once every {{ videoPokerOdds.royalCycle }} hands on average.

RTP describes the game, not your result. It isn't a guarantee of what any player gets back from any session.

## Worked example: same session, two machines

You play 1,000 hands at $1.25 per hand (5 quarters) = $1,250 total action.

- **9/6, perfect play:** expected loss = $1,250 × 0.46% ≈ **$5.75**.
- **8/5, perfect play:** expected loss = $1,250 × 2.70% ≈ **$33.75**.

In 1,000 hands, you probably won't see a Royal either way, so your actual result will most likely land below both averages. The paytable still decides which machine is cheaper to sit at.

## How to check a machine in five seconds

1. Find the Full House line. On Jacks or Better, 9 per coin is full pay.
2. Find the Flush line. 6 per coin is full pay.
3. Check the Royal pays 4,000 at 5 coins.
4. Make sure the game is actually Jacks or Better. Bonus Poker, Double Bonus and others have different "full pay" tables, so 9/6 means something different on each.

## FAQ

### What does 9/6 mean in video poker?

The per-coin payout for a Full House (9) and a Flush (6) on a Jacks or Better machine. It's the full-pay version of the game.

### What is the RTP of 9/6 Jacks or Better?

{{ videoPokerOdds.returnPct }}% with perfect strategy at 5 coins. 0stakes verifies that figure exactly on every build.

### What is the RTP of 8/5 Jacks or Better?

{{ videoPokerOdds.comparisonTables[1].returnPct }}% with perfect 8/5 strategy at 5 coins.

### Does the coin size change the return?

No. Quarters, dollars and $5 coins all have the same return on the same paytable. The number of coins can, because of the max-coin Royal bonus.

### Which paytable does the 0stakes game use?

9/6 Jacks or Better, the table shown in the [free game](/games/video-poker/). The other tables here are for comparison only.

<p class="strategy-link"><a class="btn" href="/games/video-poker/">Play full-pay 9/6 free →</a></p>

## Related

- [How to Play Video Poker: Rules, Payouts and Strategy](/strategy/video-poker/how-to-play/)
- [Jacks or Better Strategy Chart](/strategy/video-poker/jacks-or-better-strategy-chart/)
- [Video Poker vs. Slots: Which Has Better Odds?](/strategy/video-poker/video-poker-vs-slots/)
- [Casino Cost Calculator](/tools/casino-cost-calculator/)
