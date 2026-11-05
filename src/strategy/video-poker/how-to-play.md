---
title: "How to Play Video Poker: Rules, Payouts and Strategy"
seoTitle: "How to Play Video Poker: Rules, Payouts & Strategy | 0stakes"
description: "How video poker works, step by step: the deal, holding cards, the draw, and how the Jacks or Better paytable pays. With example hands and beginner mistakes."
date: 2026-11-05
ogType: article
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Video Poker
    url: /strategy/video-poker/
  - name: How to Play
    url: /strategy/video-poker/how-to-play/
---
**Quick answer:** Video poker deals you five cards. You choose which to keep, the machine replaces the rest once, and your final hand is paid from the table printed on the screen. There's no opponent and no dealer hand to beat. In {{ videoPokerOdds.version }} {{ videoPokerOdds.game }}, the lowest paying hand is a pair of Jacks, and the game returns {{ videoPokerOdds.returnPct }}% with perfect play.

That last number is why video poker is worth learning properly. It's one of the few casino games where your decisions change the return, and the correct decisions are fully known.

<p class="strategy-link"><a class="btn" href="/games/video-poker/">Play free Jacks or Better →</a></p>

## What video poker is

Video poker is a single-player machine game built on five-card draw poker. Each hand uses a freshly shuffled 52-card deck. You bet, get dealt five cards, pick which ones to hold, and draw replacements for the rest. The machine then checks what poker hand you made and pays it at a fixed rate.

It is not a slot machine with card pictures on it. On a fair machine the cards are dealt from a real simulated deck, so the probability of every outcome is the same as with a physical deck. That's why the return of a game can be calculated exactly from its paytable, and why the strategy can be worked out down to the last card.

## How it differs from poker at a table

| | Poker at a table | Video poker |
|---|---|---|
| Opponents | Other players | None |
| What you need to win | Better hand than the others, or make them fold | Any hand on the paytable |
| Bluffing | Central | Impossible |
| Draws | Depends on the variant | Exactly one |
| Payouts | The pot | Fixed multiples of your bet |
| House's cut | Rake from the pot | Built into the paytable |

The practical difference: in table poker a pair of 8s might win the pot. In Jacks or Better, a pair of 8s pays nothing. You aren't trying to beat anyone, only to finish with a hand the paytable rewards.

## How a hand works, step by step

1. **Choose your bet.** Pick a coin value (0stakes offers $0.25, $1 and $5) and 1 to {{ videoPokerOdds.maxCoins }} coins. Five $1 coins is a $5 bet.
2. **Deal.** You get five cards face up.
3. **Hold.** Tap each card you want to keep. You can hold all five, none, or anything in between.
4. **Draw.** Every card you didn't hold is replaced with a new card from the same deck. The cards you threw away don't come back.
5. **Get paid.** Your final five cards are checked against the paytable. A paying hand returns the amount shown for your coin count. Anything else loses the bet.

There's only one decision per hand, the hold, and it's where the whole game is won or lost.

## The paytable

This is the exact table the [0stakes video poker game](/games/video-poker/) pays. Numbers are total coins returned, including your bet.

| Hand | 1 coin | 2 coins | 3 coins | 4 coins | 5 coins |
|---|---:|---:|---:|---:|---:|
{% for row in videoPokerOdds.paytable %}| {{ row.name }} | {{ row.pays[0] }} | {{ row.pays[1] }} | {{ row.pays[2] }} | {{ row.pays[3] }} | {{ row.pays[4] }} |
{% endfor %}

A few things to notice:

- **"Jacks or Better" means a pair of Jacks, Queens, Kings or Aces.** It returns your bet, so it's a push in practice, not a profit. Lower pairs pay nothing.
- **Every row is linear except the Royal Flush.** It pays {{ videoPokerOdds.pays.royal[0] }} per coin for 1 to 4 coins, then jumps to {{ videoPokerOdds.pays.royal[4] }} for 5 coins. That's {{ videoPokerOdds.pays.royal[4] | divided_by: 5 }} per coin.
- **The Full House and Flush rows give the game its name.** This is "{{ videoPokerOdds.version }}" Jacks or Better because a Full House pays {{ videoPokerOdds.pays.fullHouse[0] }} and a Flush pays {{ videoPokerOdds.pays.flush[0] }} per coin. Machines that look identical often pay less on those two rows, which is covered in [video poker paytables explained](/strategy/video-poker/paytables/).

### Why you should play 5 coins

The Royal Flush bonus is worth real money over time. With perfect play, 9/6 Jacks or Better returns {{ videoPokerOdds.returnPct }}% at 5 coins but only {{ videoPokerOdds.returnPctUnderMaxCoins }}% at 1 to 4 coins. If 5 coins is too big a bet, drop to a smaller coin value instead of playing fewer coins.

## How often each hand comes up

These are the exact frequencies for 9/6 Jacks or Better when every hand is held perfectly at 5 coins, computed by 0stakes by playing out all 2,598,960 possible deals.

| Final hand | How often |
|---|---|
| Royal Flush | about 1 in {{ videoPokerOdds.royalCycle }} hands |
| Straight Flush | about 1 in 9,150 |
| Four of a Kind | about 1 in 423 |
| Full House | about 1 in 87 |
| Flush | about 1 in 91 |
| Straight | about 1 in 89 |
| Three of a Kind | about 1 in 13 |
| Two Pair | about 1 in 8 |
| Jacks or Better | about 1 in 5 |
| Nothing | about 55% of hands |

More than half of all hands lose. Two pair, trips and the high pair do most of the work keeping your credits alive, while the Royal Flush is rare but contributes about 2 percentage points of the total return on its own.

## Common video poker variations

Jacks or Better is the base game most other versions are built on. The common ones:

- **Bonus Poker and Double Bonus Poker** pay extra for certain four-of-a-kinds (usually Aces, then 2s through 4s) and take some of that back from two pair or the full house and flush.
- **Double Double Bonus** adds even bigger four-of-a-kind payouts when the right kicker comes with them. High volatility.
- **Deuces Wild** makes every 2 a wild card. The lowest paying hand becomes three of a kind, and the strategy is completely different.
- **Joker Poker** adds a joker to the deck as a wild card.

Each one has its own paytable and its own strategy. A strategy chart for Jacks or Better is wrong for Deuces Wild, and the return of one game tells you nothing about another. 0stakes currently plays 9/6 Jacks or Better only.

## Basic strategy principles

You don't need to memorize anything to start. These principles cover most hands:

1. **Never break up a paying hand** unless you're one card from a Royal Flush.
2. **Keep any pair.** Even a low pair (2s through 10s) beats holding high cards or drawing to a straight.
3. **Hold high cards over nothing.** A Jack, Queen, King or Ace can pair up into a paying hand.
4. **Don't keep a kicker.** With a pair, throw away the other three cards, even if one of them is an Ace.
5. **Draw five when you have nothing.** No pair, no high cards, no four-card draw: throw everything away.

For the full ranked hold order, see the [Jacks or Better strategy chart](/strategy/video-poker/jacks-or-better-strategy-chart/).

## Example hands

The numbers below are the exact expected return per coin bet at 5 coins for each choice, from the same calculation the game's Best Hold button uses. 1.00 means you get your bet back on average.

**A♥ K♥ Q♥ J♥ 9♥.** You've been dealt a flush, which pays 6 per coin. Holding the four cards to the Royal Flush and drawing one is worth **18.43 per coin** on average, because one card in 47 makes the Royal. Break the flush. This is the one time breaking a paying hand is right.

**4♣ 4♦ A♥ K♠ 9♣.** Hold the pair of 4s (**0.82**). Holding A-K (0.48) feels stronger, but the low pair already has a head start on two pair, trips, full house and quads.

**J♣ J♦ A♥ 7♠ 2♦.** Hold only the Jacks (**1.54**). Keeping the Ace as a kicker drops it to 1.42, because the Ace takes a draw away from you without adding a paying combination.

**2♣ 3♦ 6♥ 8♠ 9♥.** Nothing worth keeping. Draw five new cards (**0.36**). Holding any single card here is worse.

## Common beginner mistakes

- **Playing fewer than 5 coins.** It costs about 1.2 percentage points of return on this game. Use a smaller coin size instead.
- **Holding a kicker.** It feels like insurance. It's a pure cost.
- **Keeping one high card over a low pair.** A pair of 3s beats a lone Ace.
- **Chasing inside straights.** Four cards with a gap in the middle (like 5-6-8-9) can only be completed by four cards. Most of the time you're better off with a high card or a fresh draw.
- **Assuming every machine is the same game.** Check the Full House and Flush payouts first.

## Practice it

The [free video poker game](/games/video-poker/) shows the paytable above, and its **Best Hold** button computes the optimal hold for the exact hand on screen. Turn on **Strategy check** and it tells you after every draw whether your hold matched, and what a mistake cost.

<p class="strategy-link"><a class="btn" href="/games/video-poker/">Practice video poker free →</a></p>

## FAQ

### What is the lowest winning hand in Jacks or Better?

A pair of Jacks. Queens, Kings and Aces count too. It returns your bet, so it breaks even. A pair of 10s or lower loses.

### Is video poker random?

On a legitimate machine, yes. Each hand is dealt from a shuffled 52-card deck, so every card has the same chance of showing up as with a real deck. Your past hands don't affect the next one.

### How many cards can you hold?

Any number from zero to five. Holding all five means you keep the hand as dealt. Holding none means five new cards.

### Can you win at video poker?

You can win sessions, and plenty of players do. Over the long run, 9/6 Jacks or Better returns {{ videoPokerOdds.returnPct }}% with perfect play, which is still slightly less than 100%. See [can you beat video poker?](/strategy/video-poker/can-you-beat-video-poker/) for what that means in practice.

### Is video poker better than slots?

On a known paytable with good play, video poker usually has a lower and more transparent house edge than slots, but that isn't automatic. See [video poker vs. slots](/strategy/video-poker/video-poker-vs-slots/).

## Related

- [Jacks or Better Strategy Chart: What Cards Should You Hold?](/strategy/video-poker/jacks-or-better-strategy-chart/)
- [Video Poker Paytables Explained: 9/6 vs. 8/5](/strategy/video-poker/paytables/)
- [Can You Beat Video Poker With Perfect Strategy?](/strategy/video-poker/can-you-beat-video-poker/)
- [Casino house edge, every game ranked](/strategy/house-edge/)
