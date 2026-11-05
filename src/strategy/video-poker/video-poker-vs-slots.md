---
title: "Video Poker vs. Slots: Which Has Better Odds?"
seoTitle: "Video Poker vs Slots: Which Has Better Odds? | 0stakes"
description: "Video poker vs slots compared on RTP, skill, transparency and volatility. Why a known video poker paytable often beats a slot, and when it doesn't."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Video Poker
    url: /strategy/video-poker/
  - name: Video Poker vs. Slots
    url: /strategy/video-poker/video-poker-vs-slots/
---
**Quick answer:** A good video poker paytable played well usually gives you better odds than a slot machine, and you can verify it. Full-pay 9/6 Jacks or Better returns {{ videoPokerOdds.returnPct }}% with perfect strategy. A slot's return is set inside the machine and isn't printed anywhere you can check. But "video poker" isn't automatically better: a short-pay machine played badly can return less than some slots.

## The fundamental difference

Both games live on the same casino floor and take the same bills, but they work in completely different ways.

| | Video poker | Slots |
|---|---|---|
| How outcomes are decided | Cards dealt from a simulated 52-card deck | A random number generator mapped to reel symbols by the game's internal settings |
| Can you calculate the return? | Yes, from the paytable | No, not from what's on screen |
| Player decisions | Which cards to hold, every hand | None that affect the return |
| Does skill matter? | Yes | No |
| Same-looking games, different returns? | Yes, but the paytable shows it | Yes, and nothing on screen shows it |

## Skill vs. chance

A slot spin has no decisions in it. Betting more lines or a different amount doesn't change the long-run return of the game unless the machine's rules say so. The outcome is entirely chance.

Video poker is chance plus one decision per hand. The cards you're dealt are random, but which ones you hold isn't. That decision moves the return. On 9/6 Jacks or Better:

| How you play 9/6 Jacks or Better at 5 coins | Long-run return |
|---|---:|
| Perfect strategy | {{ videoPokerOdds.returnPct }}% |
| A simplified beginner chart | {{ videoPokerOdds.simpleStrategyReturnPct }}% |
| Perfect strategy at 1 to 4 coins | {{ videoPokerOdds.returnPctUnderMaxCoins }}% |

Holding the wrong cards habitually, like keeping kickers or lone high cards over low pairs, pushes the return lower still. How much lower depends entirely on which mistakes and how often.

## How RTP works on each

**RTP (return to player)** is the long-run percentage of money wagered that a game pays back. It's 100% minus the house edge.

**Video poker RTP** follows directly from the paytable and the strategy. The probabilities come from a real deck, so anyone can calculate them. 0stakes does it on every build by playing out every possible deal of its 9/6 game.

**Slot RTP** is set by the game's design and configuration. The same title can often be installed at several different return settings, and a player can't tell which one is in the cabinet. Regulators set floors, not typical values: Nevada's Regulation 14 requires a theoretical return of at least 75% on each wager, and New Jersey's rules require at least 83%. Actual slot returns are generally well above those minimums, but you can't confirm a specific machine's number by looking at it.

Some jurisdictions publish what slots actually held across a whole market. In Nevada, the Gaming Control Board's monthly revenue reports break slot win down by denomination. Those are averages across thousands of machines, not the setting of the one in front of you.

## Paytables matter in both, but you can only see one

Video poker paytables vary, and the difference is large:

| Jacks or Better paytable | Return with perfect play |
|---|---:|
{% for t in videoPokerOdds.comparisonTables %}| {{ t.label }} | {{ t.returnPct }}% |
{% endfor %}

The 8/5 machine is about six times as expensive as 9/6, and on a 6/5 machine the house edge is over ten times larger. The difference between a good video poker machine and a bad one can be bigger than the difference between video poker and slots in general. The advantage of video poker is that the paytable tells you which one you're on. See [video poker paytables explained](/strategy/video-poker/paytables/).

## Volatility and bankroll

Return tells you the average. Volatility tells you how far you swing around it.

9/6 Jacks or Better has a variance of about {{ videoPokerOdds.variance }} per hand (in units of the bet squared), which is a standard deviation of roughly 4.4 bets per hand. About 55% of hands lose, around 21% just return the bet, and a big share of the return is locked up in rare hands: the Royal Flush alone, once every {{ videoPokerOdds.royalCycle }} hands on average, is worth about 2 percentage points. Most sessions without a Royal finish below the game's long-run return.

Slots range from low-volatility games that pay small amounts often to high-volatility games built around rare jackpots. Progressive jackpots in particular push a large share of the return into prizes most players never see.

Both games are volatile enough that a short session tells you almost nothing about the underlying odds. A bankroll that's comfortable for one session of either should be measured in hundreds of bets, not dozens.

## Examples of theoretical returns

Suppose you put $3,000 of total action through a machine (for example 600 hands or spins at $5).

- **9/6 Jacks or Better, perfect play ({{ videoPokerOdds.returnPct }}%):** expected loss $13.80.
- **8/5 Jacks or Better, perfect play ({{ videoPokerOdds.comparisonTables[1].returnPct }}%):** expected loss $81.
- **A hypothetical slot set at 92%:** expected loss $240.
- **The same hypothetical slot set at 96%:** expected loss $120.

The two slot rows are illustrations, not measured figures for any real game, because the real setting of a given slot isn't public. The point is the math: at a typical slot return, even a short-pay video poker machine played well can compare favorably. A badly played short-pay machine may not.

## Common misconceptions

- **"All video poker beats all slots."** No. Paytable and play both matter, and some slots are configured more generously than some video poker machines played badly.
- **"Video poker is due to hit."** Each hand is a fresh deck. Past hands don't change the next deal.
- **"Max bet raises the odds on a slot."** Only if that slot's rules say so. On video poker, 5 coins genuinely matters because of the Royal bonus.
- **"A machine that just paid a jackpot is cold."** Results are independent. Neither game remembers.
- **"Perfect video poker strategy guarantees a profit."** It doesn't on standard games. 9/6 Jacks or Better is still below 100%. See [can you beat video poker?](/strategy/video-poker/can-you-beat-video-poker/)

## Practice the skill part

The [free video poker game](/games/video-poker/) shows its full 9/6 paytable and has a Best Hold button that calculates the optimal play for every hand, so you can learn the decisions without risking anything.

<p class="strategy-link"><a class="btn" href="/games/video-poker/">Play free video poker →</a></p>

## FAQ

### Does video poker have better odds than slots?

Usually, when you compare a good video poker paytable played well against a typical slot. Not always. A short-pay machine played poorly can be worse than some slots.

### What is the RTP of video poker?

It depends on the game and paytable. 9/6 Jacks or Better returns {{ videoPokerOdds.returnPct }}% with perfect play; 8/5 returns {{ videoPokerOdds.comparisonTables[1].returnPct }}%.

### Is video poker skill or luck?

Both. The deal is luck. The hold is skill, and it changes the long-run return.

### Can I find out a slot machine's RTP?

Usually not for a specific machine on a casino floor. Some online games publish an RTP in their help screens; land-based machines generally don't show it.

## Related

- [How to Play Video Poker](/strategy/video-poker/how-to-play/)
- [Video Poker Paytables Explained: 9/6 vs. 8/5](/strategy/video-poker/paytables/)
- [Why the Casino Always Wins in the Long Run](/strategy/why-casino-wins-long-run/)
- [Casino house edge, every game ranked](/strategy/house-edge/)
