---
title: "Prediction Market Prices, Explained as Odds"
seoTitle: "Prediction Market Odds Explained: Kalshi Prices to Probability | 0stakes"
description: A prediction market contract that costs 60 cents is a bet at -150 odds. Here is how to convert any price to probability and American odds, and what the built-in cost really is.
date: 2026-11-10T09:00:00
updated: 2026-11-10
topic: industry
ogType: article
breadcrumb:
  - name: The Pit
    url: /the-pit/
  - name: Prediction Market Prices, Explained as Odds
    url: /the-pit/prediction-market-odds-explained/
---

A prediction market contract that costs 60 cents is a bet at -150 odds. The price is the
probability, written in cents. Once you can convert one into the other, you can compare any
prediction market to any sportsbook and see what each one actually charges you.

![A one dollar contract split into a 60 cent YES share and a 40 cent NO share. Buying YES at 60 cents risks 60 cents to win 40 cents, which is American odds of -150.](/img/pit/price-is-probability.svg)

## How the contract works

Platforms like Kalshi and Polymarket sell contracts on a yes or no question, such as "Will
this team win?" Each contract pays **$1.00 if the answer is yes** and **$0 if it is no**. You
can buy either side, and the two sides always add up to $1.00 at fair value.

* Buy YES at 60 cents. If yes happens, you collect $1.00, a profit of 40 cents.
* If no happens, you lose the 60 cents.
* Buying NO at 40 cents is the mirror image.

## Price is implied probability

If you pay 60 cents for something that pays $1.00, you break even only if it happens 60% of
the time. So the price is the market's probability: 60 cents means 60%.

The conversion to odds takes two lines of arithmetic:

* **Favorite (price above 50 cents):** American odds = -(price / (1 - price)) x 100. At 60
  cents: -(0.60 / 0.40) x 100 = **-150**.
* **Underdog (price below 50 cents):** American odds = +((1 - price) / price) x 100. At 40
  cents: +(0.60 / 0.40) x 100 = **+150**.
* **Decimal odds** are 1 divided by the price. At 40 cents that is 2.50.

![A ladder converting contract prices of 20, 40, 50, 60 and 80 cents into implied probabilities and American odds of +400, +150, +100, -150 and -400.](/img/pit/price-to-odds.svg)

## Where the cost hides

A fair market would let you buy YES and NO for exactly $1.00 combined. Real markets do not.
There is a gap between what buyers pay and what sellers accept, plus a platform fee on top.

Say YES costs 52 cents and NO costs 52 cents. Together that is $1.04 for something that pays
$1.00.

* Paying 52 cents to win 48 is odds of **-108**, and you need to win 52% of the time to break
  even on each side.
* The 4 cent gap works out to a built-in cost of about **3.8%**.

A standard sportsbook line of -110 on both sides works the same way. Each side implies 52.38%,
the two add up to 104.76%, and the book's hold is about **4.5%**. The labels differ. The
mechanism is the same: you are always paying more than the true chance to get a payout.
Prediction markets often have a tighter gap on popular markets and a wider one on thin ones,
and fees vary by platform and market, so check the current fee schedule before you compare.

## What an edge looks like

Expected value per contract is your true probability minus the price you pay. If you believe
an outcome is 55% likely and the contract costs 52 cents:

* EV = 0.55 x $1.00 - $0.52 = **+$0.03** per contract, or about 5.8% of the amount risked.
* A 1 cent fee on that trade cuts the edge by a third.

The catch is the first number. The market price is already the crowd's estimate, so you only
profit if your 55% is better than theirs. Most people are not better than the market, which
is why most traders lose after costs, just as most sportsbook bettors do.

## Longshots are the expensive end

Cheap contracts feel like a bargain. A 5 cent contract that pays $1.00 looks like a 20 to 1
shot. But a 1 cent fee on a 5 cent contract is a 20% surcharge on the price. Research on
betting markets has repeatedly found that longshots are overpriced relative to how often they
win, while favorites are priced closer to their true chance.

## Where the law stands (November 2026)

Two federal appeals courts have given opposite answers on whether Kalshi's sports contracts
are gambling under state law. The Third Circuit said federal law protects them. The Ninth
Circuit said Nevada can enforce its gambling laws. The rules depend on where you live, and
the Supreme Court may step in. Read the full breakdown in
[Is Kalshi Sports Betting Legal? The Court Fight, Explained](/the-pit/kalshi-sports-contracts-court-fight-explained/).

## The takeaway

Convert every price to a probability first. Then ask two questions: is my estimate better than
the market's, and is the gap bigger than the cost to trade? If you cannot answer yes to both,
you are paying the house edge under a different name.

To see how those costs add up over time, read the [house edge guide](/strategy/house-edge/) and
the [bankroll management guide](/strategy/bankroll-management/), then practice with free
chips in the [0stakes games](/games/). Prediction markets involve real money and are not
available to everyone. If gambling is a problem for you, call 1-800-GAMBLER.
