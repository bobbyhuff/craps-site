---
title: "Pai Gow Poker House Way: How to Set Your Hands"
seoTitle: "Pai Gow Poker House Way: How to Set Every Hand | 0stakes"
description: "The exact Pai Gow Poker house way, hand type by hand type, with example settings and simulated results showing when it is and isn't the best play."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Pai Gow Poker
    url: /strategy/pai-gow-poker/
  - name: House Way
    url: /strategy/pai-gow-poker/house-way/
---
**Quick answer:** The house way is the fixed set of rules a Pai Gow Poker dealer must use to split seven cards into a five-card and a two-card hand. Copying it is a sound strategy for players too: it's simple, it never fouls, and it's close to the best setting on most hands. It's not perfect, and every casino's version is a little different.

This page describes the exact house way used by the dealer in the [0stakes Pai Gow Poker game](/games/pai-gow-poker/), which is also what the game's **Auto Arrange** button does for you.

## What house way means

In Pai Gow Poker the dealer doesn't make judgment calls. When the dealer (or a player acting as banker) sets a hand, they follow a written procedure posted by the casino. That procedure is the house way. It exists so the dealer plays consistently and can't favor or punish anyone.

Players can set their hands however they like, as long as the setting is legal. But the house way is a good reference, because casinos write it to perform well against the field.

## Why splitting correctly matters

You win only by beating the dealer with **both** hands. So every split is a trade-off:

- Put too much strength in the five-card hand and your two-card hand loses, which turns wins into pushes.
- Put too much in the two-card hand and your five-card hand loses, which turns pushes into losses.

The right answer depends on the hand, and the house way is a hand-by-hand list of those trade-offs.

## The 0stakes house way, by hand type

Apply the first rule that fits. The joker counts as an Ace when grouping pairs, and completes a straight or flush where it can.

### No pair
Highest card in the five-card hand. **Second and third highest cards** go in the two-card hand.

### One pair
Pair in the five-card hand. The **two highest other cards** go in the two-card hand.

### Two pair
Split them: **higher pair high, lower pair low**.
Exception: if the higher pair is 10s or lower and you have a single Ace, keep both pairs in the five-card hand and put the Ace (with your next highest card) low.

### Three pair
**Highest pair goes low.** The other two pairs stay in the five-card hand.

### Three of a kind
Keep the set in the five-card hand and put your two highest other cards low.
Three Aces: split them. A pair of Aces stays high, and one Ace plus your next highest card goes low.
If you also have a straight or flush that lets you put a pair low, play the straight or flush instead.

### Two three-of-a-kinds
Split the **higher** set: a pair from it goes low, everything else stays high.

### Straight or flush
Play it in the five-card hand, choosing the version that leaves the **strongest two-card hand**. With 7 cards you can often make the straight or flush several ways. (If you also hold two pair or better, those rules come first.)

### Full house
**Split it:** three of a kind high, pair low.
Exception: a pair of 2s with an Ace and a King on the side. Keep the full house together and put A-K low.

### Four of a kind
- With a pair or three of a kind on the side: keep the four together and put the pair low.
- 2s through 6s: keep together.
- 7s through 10s: keep together if an Ace can go low; otherwise split into two pairs.
- Jacks or higher: split into two pairs.

### Five Aces
Split off a pair of Aces for the two-card hand, unless you also hold a pair of Kings. Then the Kings go low.

## Examples from the game engine

These are the settings the 0stakes engine produces for each hand.

| Seven cards | Five-card hand | Two-card hand | Rule |
|---|---|---|---|
| A♥ J♦ 9♣ 7♠ 5♥ 4♦ 2♣ | A-7-5-4-2 | J-9 | No pair |
| A♥ K♦ Q♣ J♠ 9♥ 3♦ 3♣ | 3-3-Q-J-9 | A-K | One pair |
| K♥ K♦ 9♣ 9♠ 7♥ 4♦ 2♣ | K-K-7-4-2 | 9-9 | Two pair, split |
| A♥ 9♦ 9♣ 4♠ 4♥ J♦ 2♣ | 9-9-4-4-2 | A-J | Two pair, 10s or lower with an Ace |
| 9♥ 9♦ 6♣ 6♠ 3♥ 3♦ A♣ | 6-6-3-3-A | 9-9 | Three pair |
| Q♥ Q♦ Q♣ 9♠ 6♥ 4♦ 2♣ | Q-Q-Q-4-2 | 9-6 | Three of a kind |
| Joker 8♦ 9♣ 10♠ J♥ 3♦ 3♣ | 8-9-10-J-Joker | 3-3 | Straight, pair low |
| Joker A♥ 7♥ 4♥ 2♥ K♦ Q♣ | Joker-A♥-7♥-4♥-2♥ | K-Q | Flush |
| 8♥ 8♦ 8♣ 3♠ 3♥ K♦ 2♣ | 8-8-8-K-2 | 3-3 | Full house, split |
| 7♥ 7♦ 7♣ 7♠ K♥ 4♦ 2♣ | 7-7-K-4-2 | 7-7 | Four 7s, no Ace: split |

## High hand vs. low hand: what the trade-off looks like

0stakes ran some of these hands through its own engine, playing every legal setting against the same dealer hands set the house way, with copies to the dealer and a {{ paiGowOdds.commissionPct }}% commission. Results are average result per unit bet (+0.50 means you average half a unit of profit). Each hand was tested against 60,000 random dealer hands (250,000 for the no-pair hand), so the last digit is uncertain by about ±0.003.

**K♥ K♦ 9♣ 9♠ 7♥ 4♦ 2♣**
- House way, split (K-K high, 9-9 low): **+0.53**
- Both pairs high, 7-4 low: −0.16

Keeping both pairs high almost never wins, because a 7-high two-card hand rarely beats the dealer. Splitting wins about 62% of the time here.

**A♥ 9♦ 9♣ 4♠ 4♥ J♦ 2♣**
- House way, both pairs high with A-J low: **+0.36**
- Split (9-9 high, 4-4 low): +0.22

With small pairs and an Ace, the A-J two-card hand is strong enough to keep the five-card hand at two pair.

**A♥ K♦ Q♣ J♠ 9♥ 3♦ 3♣**
- House way, pair high with A-K low: **−0.11**
- Next best (A-Q low): −0.16

## Is the house way optimal?

No, and casinos don't claim it is. It's designed to be simple to follow and good against the field, not to find the best setting for every one of millions of hands.

The 0stakes simulation found a clear example. With **A♥ J♦ 9♣ 7♠ 5♥ 4♦ 2♣**:

- House way (A-7-5-4-2 high, J-9 low): **−0.79**
- A-9-7-5-2 high, J-4 low: **−0.77**

Keeping the 9 in the five-card hand made the high hand win more often, which mattered more than the stronger low hand. The difference is small (about 2% of your bet), and it's specific to this hand against this dealer; it isn't a general rule that no-pair hands should be set differently. But it shows that the house way is a good approximation, not a proof.

Expert players use more detailed strategies that beat the house way on some hands. The gains are small: the house edge of about {{ paiGowOdds.houseEdge }}% that 0stakes measured with both sides using the house way doesn't move much. Getting the big decisions right, especially two pair, matters far more.

## House ways vary by casino

Every casino writes its own house way, and the details differ: when to split two pair, what to do with three pair, how to play four of a kind, how to handle a straight with a pair. The 0stakes version is a common-sense standard set, published in full on the [game page](/games/pai-gow-poker/). If you play in a casino, ask the dealer for a copy; most will show you.

## Common mistakes

- **Never splitting two pair.** Usually the biggest single leak for new players.
- **Splitting a full house the wrong way.** The pair goes low, not the trips.
- **Breaking a straight or flush you don't need to,** when it leaves a pair for the low hand.
- **Fouling the hand** by putting a higher pair low than the five-card hand holds.
- **Assuming the house way is always optimal.** It's a solid default, not a law.

## FAQ

### What is the house way in Pai Gow Poker?

The fixed rules the dealer follows to set their hand. Players can copy it, and the 0stakes Auto Arrange button does.

### Should I always play the house way?

It's a strong, simple default and avoids fouls. It isn't optimal on every hand, but deviations rarely gain much.

### Should I split two pair?

Usually. The house way splits two pair unless the higher pair is 10s or lower and you hold an Ace to play low.

### Is the house way the same in every casino?

No. Each casino writes its own, and the details vary.

<p class="strategy-link"><a class="btn" href="/games/pai-gow-poker/">Try Auto Arrange in the free game →</a></p>

## Related

- [How to Play Pai Gow Poker](/strategy/pai-gow-poker/how-to-play/)
- [Pai Gow Poker Joker Rules Explained](/strategy/pai-gow-poker/joker-rules/)
- [Safest Casino Table Game](/strategy/safest-casino-table-game/)
