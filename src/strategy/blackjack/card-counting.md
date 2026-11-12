---
title: "How Card Counting Works in Blackjack"
seoTitle: "How to Count Cards in Blackjack: Hi-Lo System Explained | 0stakes"
description: "The Hi-Lo card counting system step by step: card values, running count, true count, bet sizing, and what edge a counter can realistically expect in a six-deck game."
date: 2026-11-12T11:00:00
game: blackjack
ogType: article
breadcrumb:
  - name: "Strategy"
    url: /strategy/
  - name: "Blackjack"
    url: /strategy/blackjack/
  - name: "How Card Counting Works"
    url: /strategy/blackjack/card-counting/
---
**Quick answer:** Card counting tracks the ratio of high cards to low cards left in the shoe. When more tens and Aces remain, the player has the edge and bets more. When more small cards remain, the house has the edge and the counter bets the minimum. It does not require memorizing cards. It requires adding and subtracting 1.

## Why the remaining cards matter

Blackjack is not like roulette. Cards that have been dealt are gone until the shuffle, so the odds of the next hand change as the shoe is dealt.

A shoe rich in tens and Aces helps the player for three reasons:

* **Blackjacks pay {{ blackjackOdds.blackjackPayoutStr }} to the player and only even money to the dealer.** Both sides get more naturals, but only one side gets the bonus.
* **Doubles land better.** A double on 10 or 11 wants a ten.
* **The dealer must hit stiff hands.** A dealer 12 through 16 busts more often when the shoe is full of tens. You can stand on yours.

A shoe rich in small cards does the opposite. The dealer makes more hands, and the player's doubles and blackjacks dry up.

## The Hi-Lo count

Hi-Lo is the standard system. Every card gets one of three values:

| Cards | Count value |
|---|---|
| 2, 3, 4, 5, 6 | +1 |
| 7, 8, 9 | 0 |
| 10, J, Q, K, A | -1 |

Start at 0 after the shuffle. Add each card's value as it is turned face up. The total is the **running count**.

Example: the cards on the table are 5, K, 3, 9, 6, A, 4. That is +1, -1, +1, 0, +1, -1, +1. The running count is +2.

A positive count means small cards have left the shoe and high cards remain. A full deck has twenty +1 cards and twenty -1 cards, so the count always returns to 0 by the end of the shoe.

## Running count to true count

A running count of +6 means much more with one deck left than with five decks left. To correct for that, divide by the number of decks remaining:

**True count = running count ÷ decks remaining**

| Running count | Decks remaining | True count |
|---|---|---|
| +6 | 6 | +1 |
| +6 | 3 | +2 |
| +6 | 1.5 | +4 |
| -4 | 2 | -2 |

The true count is the number that drives every decision. Estimating decks remaining to the nearest half deck is accurate enough.

## What the count is worth

In a typical six-deck game, each +1 of true count moves the edge about 0.5% toward the player. Basic strategy starts the player roughly half a percent behind, so:

| True count | Approximate player edge |
|---|---|
| 0 or lower | House edge, about 0.5% or worse |
| +1 | Roughly even |
| +2 | About +0.5% |
| +3 | About +1% |
| +4 | About +1.5% |

These are approximations. The exact figures depend on the table's rules.

## Betting with the count

The count does nothing unless bets change with it. A counter bets the table minimum at a true count of +1 or lower and raises the bet as the count climbs. The ratio between the smallest and largest bet is the **bet spread**. A six-deck shoe usually needs a spread of at least 1 to 8 to overcome the many hands played at a disadvantage.

The count also changes a few playing decisions. The best known:

* **Insurance** becomes a winning bet at a true count of +3 or higher. Below that it is a losing bet, as the [insurance simulation](/the-pit/blackjack-insurance-simulated/) shows.
* **16 against a 10:** stand at a true count of 0 or higher, hit below it.
* **15 against a 10:** stand at +4 or higher.
* **12 against a 3:** stand at +2 or higher. **12 against a 2:** stand at +3 or higher.

## What counting does not do

* **It does not predict the next card.** It shifts the odds across many hands by a percent or so.
* **It does not win every session.** A good counter's overall edge is about 0.5% to 1%. At that margin, losing sessions and losing weeks are routine, and the bankroll has to be large enough to ride them out.
* **It does not work everywhere.** Continuous shuffling machines and shoes that are reshuffled early remove the advantage. So does a 6:5 blackjack payout, which costs more than counting earns. See [3:2 vs 6:5 blackjack](/the-pit/blackjack-3-2-vs-6-5/).
* **It is not the same as raising bets after losses.** That is a betting system, and it changes nothing about the next hand.

## Is card counting legal?

Counting in your head is legal. Using a device to do it is not. Casinos are still free to respond: they can shuffle early, limit your bets, or ask you to stop playing blackjack. The rules on what a casino may do vary by jurisdiction.

## Practice it for free

The [0stakes blackjack table](/games/blackjack/) deals from a real six-deck shoe and only reshuffles when the shoe runs low, so the count carries from hand to hand exactly as it would in a casino. The status bar shows how many cards are left, which gives you decks remaining for the true count.

A practical order to learn it:

1. Get [basic strategy](/strategy/blackjack/basic-strategy/) perfect first. Counting on top of bad basic strategy loses money. The [strategy trainer](/games/blackjack/trainer/) and the table's mistake flags will tell you when you are there.
2. Keep a running count through a full shoe without betting on it. You should land back near 0 when the shoe runs out.
3. Add the true count conversion.
4. Only then change your bets with the count.

## The takeaway

Card counting is real, legal, and simple to describe: +1 for small cards, -1 for tens and Aces, divide by decks remaining, bet more when the result is high. The edge it produces is small and takes thousands of hands to show. Whether it suits you is a question you can answer with play money first. For the bigger picture, see [can you make money playing blackjack](/strategy/blackjack/can-you-make-money-playing-blackjack/).
