---
title: "Craps Odds & Payouts Chart (2026)"
seoTitle: "Craps Odds & Payouts Chart (2026): Every Bet, Payout & House Edge | 0stakes"
description: Every craps bet's true odds, casino payout, and house edge in one chart — Pass Line, Come, Odds, Place, Field, hardways, and props — plus a free payout calculator.
extraCss: /games/craps/craps.css
breadcrumb:
  - name: Strategy
    url: /strategy/
  - name: Craps
    url: /strategy/craps/
  - name: Odds & Payouts Chart
    url: /strategy/craps/house-edge/
---

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What bet has the best odds in craps?","acceptedAnswer":{"@type":"Answer","text":"Pass Line or Come bets backed with max Odds, at a {{ odds.houseEdgeStr.passLineFullOdds }}% house edge on a standard {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x table. The Odds bet itself carries zero house edge, the only bet in the casino where that's true."}},
{"@type":"Question","name":"What is the house edge on the Pass Line?","acceptedAnswer":{"@type":"Answer","text":"{{ odds.houseEdgeStr.passLine }}% with no Odds behind it, dropping to {{ odds.houseEdgeStr.passLineFullOdds }}% blended with max Odds on a {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x table."}},
{"@type":"Question","name":"Do Odds bets really have a 0% house edge?","acceptedAnswer":{"@type":"Answer","text":"Yes. Odds bets behind the Pass Line, Don't Pass, Come, or Don't Come pay exactly true odds based on how likely the point is to repeat before a 7, with no built-in casino advantage. It's the only bet on a craps table priced that way."}},
{"@type":"Question","name":"What does 3-4-5x Odds mean?","acceptedAnswer":{"@type":"Answer","text":"The maximum Odds bet a table allows relative to your flat Pass Line or Come bet, based on the point: {{ odds.oddsMult[4] }}x on a point of 4 or 10, {{ odds.oddsMult[5] }}x on 5 or 9, and {{ odds.oddsMult[6] }}x on 6 or 8. It's structured so the dollar risk comes out roughly even across all three point pairs."}},
{"@type":"Question","name":"What are the worst bets in craps?","acceptedAnswer":{"@type":"Answer","text":"Any Seven at {{ odds.houseEdgeStr.anySeven }}% and Hard 4 or Hard 10 at {{ odds.houseEdgeStr.hard4or10 }}% are the worst bets on the layout. Both are one-roll or narrow-resolution proposition bets that pay well below their true odds."}},
{"@type":"Question","name":"How much does a $10 craps bet pay?","acceptedAnswer":{"@type":"Answer","text":"It depends entirely on which bet. A $10 Pass Line bet wins $10 (even money). $10 in Odds on a point of 6 or 8 wins $12. A $10 Any Seven bet wins $40. The full chart on this page has the exact payout for every bet on the table."}}
]}
</script>

Every bet on a craps table has a fixed, published payout, and every payout implies a fixed house edge once you compare it to the *true* odds of that bet winning. None of it is hidden or negotiable. This page is the full craps odds and payouts chart — every bet in the free [craps simulator](/games/craps/), what it actually pays, and how that payout compares to the true mathematical odds.

<p class="strategy-link"><a class="btn" href="/games/craps/">Practice these bets on the free craps simulator →</a></p>

<h2 id="craps-odds-and-payouts-chart">Craps odds and payouts chart</h2>

"True Odds" below is the fair payout with zero house edge — what the bet *should* pay if the casino took no cut. "Casino Payout" is what the table actually pays. The gap between the two is where the house edge comes from. Example payouts assume a flat $10 bet, rounded to the nearest cent; a few bets (Place 6/8, Place 5/9, Place 4/10) are normally sized in $6 or $5 multiples at a real table to avoid the rounding, noted where it applies.

| Bet | True Odds | Casino Payout | House Edge | Example Payout ($10 bet) |
|---|---|---|---|---|
| Pass Line | — | 1:1 (even money) | {{ odds.houseEdgeStr.passLine }}% | Wins $10 |
| Don't Pass | — | 1:1 (pushes on 12) | {{ odds.houseEdgeStr.dontPass }}% | Wins $10 (push if 12) |
| Come | — | 1:1 (even money) | {{ odds.houseEdgeStr.passLine }}% | Wins $10 |
| Don't Come | — | 1:1 (pushes on 12) | {{ odds.houseEdgeStr.dontPass }}% | Wins $10 (push if 12) |
| Odds on 4 or 10 | {{ odds.trueOddsStr[4] }} | {{ odds.trueOddsStr[4] }} | 0.00% | Wins $20 |
| Odds on 5 or 9 | {{ odds.trueOddsStr[5] }} | {{ odds.trueOddsStr[5] }} | 0.00% | Wins $15 |
| Odds on 6 or 8 | {{ odds.trueOddsStr[6] }} | {{ odds.trueOddsStr[6] }} | 0.00% | Wins $12 |
| Place 4 | {{ odds.trueOddsStr[4] }} | {{ odds.placeOddsStr[4] }} | {{ odds.houseEdgeStr.place4or10 }}% | Wins $18 |
| Place 5 | {{ odds.trueOddsStr[5] }} | {{ odds.placeOddsStr[5] }} | {{ odds.houseEdgeStr.place5or9 }}% | Wins $14 |
| Place 6 | {{ odds.trueOddsStr[6] }} | {{ odds.placeOddsStr[6] }} | {{ odds.houseEdgeStr.place6or8 }}% | Wins $11.67 (bet $6 for a clean $7) |
| Place 8 | {{ odds.trueOddsStr[6] }} | {{ odds.placeOddsStr[8] }} | {{ odds.houseEdgeStr.place6or8 }}% | Wins $11.67 (bet $6 for a clean $7) |
| Place 9 | {{ odds.trueOddsStr[5] }} | {{ odds.placeOddsStr[9] }} | {{ odds.houseEdgeStr.place5or9 }}% | Wins $14 |
| Place 10 | {{ odds.trueOddsStr[4] }} | {{ odds.placeOddsStr[10] }} | {{ odds.houseEdgeStr.place4or10 }}% | Wins $18 |
| Buy 4 or 10 | {{ odds.trueOddsStr[4] }} | {{ odds.trueOddsStr[4] }} minus {{ odds.buyCommissionPct }}% vig | {{ odds.houseEdgeStr.buy4or10 }}% | $10 bet + $1 vig, wins $20 ($19 net) |
| Field | 16 of 36 rolls win | Even money (2 pays {{ odds.fieldPayStr[2] }}, 12 pays {{ odds.fieldPayStr[12] }}) | {{ odds.houseEdgeStr.field }}% | Wins $10 (2 pays $20, 12 pays $30) |
| Any Seven | {{ odds.trueOddsAgainstStr.anySeven }} | {{ odds.anySevenPayStr }} | {{ odds.houseEdgeStr.anySeven }}% | Wins $40 |
| Any Craps | {{ odds.trueOddsAgainstStr.anyCraps }} | {{ odds.anyCrapsPayStr }} | {{ odds.houseEdgeStr.anyCraps }}% | Wins $70 |
| Hard 4 | {{ odds.trueOddsAgainstStr.hard4or10 }} | {{ odds.hardPay[4] }}:1 | {{ odds.houseEdgeStr.hard4or10 }}% | Wins $70 |
| Hard 6 | {{ odds.trueOddsAgainstStr.hard6or8 }} | {{ odds.hardPay[6] }}:1 | {{ odds.houseEdgeStr.hard6or8 }}% | Wins $90 |
| Hard 8 | {{ odds.trueOddsAgainstStr.hard6or8 }} | {{ odds.hardPay[8] }}:1 | {{ odds.houseEdgeStr.hard6or8 }}% | Wins $90 |
| Hard 10 | {{ odds.trueOddsAgainstStr.hard4or10 }} | {{ odds.hardPay[10] }}:1 | {{ odds.houseEdgeStr.hard4or10 }}% | Wins $70 |

Pass Line, Don't Pass, Come, and Don't Come don't get a clean "true odds" ratio in the table above — unlike a Place or Odds bet on a single number, they resolve across the whole come-out-then-point sequence, so there's no single fair-payout ratio to quote against the 1:1 they actually pay. Their house edge (verified against published references) captures that whole sequence instead.

## Craps odds vs payouts

"True odds" is what a bet would pay with no house edge at all — purely a function of how many of the 36 dice combinations make it win versus lose. "Casino payout" is what the table actually pays. Every casino game needs a gap between those two numbers somewhere, or the house makes nothing. Craps is unusual because that gap isn't spread evenly across the layout — it's concentrated almost entirely in a handful of bets, while others (the Odds bet specifically) carry no gap whatsoever.

That's the whole reason a house-edge chart is more useful than a payout chart alone. A payout of "7:6" on Place 6 sounds fine in isolation. Compared against the true odds of {{ odds.trueOddsStr[6] }}, it's clearly a discount, and the size of that discount is exactly the {{ odds.houseEdgeStr.place6or8 }}% house edge in the row above.

## Best bets in craps

Pass Line, Don't Pass, Come, and Don't Come sit at the top of the chart for a reason: they're the bets closest to true odds before you even add Odds behind them. Stack max Odds on top and the blended edge drops to {{ odds.houseEdgeStr.passLineFullOdds }}% (Pass Line/Come) or {{ odds.houseEdgeStr.dontPass }}%-adjacent territory (Don't Pass/Don't Come with lay odds) — about as close to a fair coin flip as a casino game gets.

Place 6 and Place 8 belong in the same conversation. At {{ odds.houseEdgeStr.place6or8 }}%, they're barely worse than a bare Pass Line bet, and unlike Pass Line you can make them any time, not just on a come-out roll. For players who want a bet with low edge but more flexibility than Pass Line, Place 6/8 is the closest thing craps has to a second foundation bet.

Read more on the [Pass Line and Odds](/strategy/craps/pass-line-and-odds/) specifically, or see how a strategy built around several of these bets at once plays out in [3 Point Molly, explained](/the-pit/3-point-molly-craps-strategy/).

## Worst bets in craps

Proposition bets — Any Seven, Any Craps, and the hardways — cluster at the bottom of the chart, all north of 9% house edge. They're priced badly for a structural reason, not a random one: they resolve in a single roll (or a narrow set of rolls, for hardways), so the casino has far less exposure per bet and can afford to pay well below true odds while still filling the table. Any Seven is the single worst bet on the layout at {{ odds.houseEdgeStr.anySeven }}%, which is a strange result given 7 is also the single most common roll — the payout of {{ odds.anySevenPayStr }} just doesn't come close to compensating for how often the *other* five outcomes eat the bet.

Buy 4 and Buy 10 are worth calling out as a partial exception: the {{ odds.buyCommissionPct }}% commission is a flat tax on the bet, so it only makes sense on the numbers where Place pays the least. On 4 and 10 it actually beats Place ({{ odds.houseEdgeStr.buy4or10 }}% vs {{ odds.houseEdgeStr.place4or10 }}%); as a commission-paying bet on any other number it would be worse than Place, which is why the free simulator only exposes it as a trade worth making on 4 and 10.

## How craps odds bets work

Odds bets are the one part of the layout with a 0% house edge — the casino makes no structural profit on the Odds portion of a bet, full stop. You can't make an Odds bet by itself; it only exists as a backup behind an existing Pass Line, Don't Pass, Come, or Don't Come bet, once a point is established.

The payout is set entirely by how likely that point is to repeat before a 7 shows: {{ odds.trueOddsStr[4] }} on a point of 4 or 10, {{ odds.trueOddsStr[5] }} on 5 or 9, {{ odds.trueOddsStr[6] }} on 6 or 8. Those exact ratios are the true odds, which is why the edge is zero — the casino pays exactly what the bet is worth, no discount.

Tables cap how much Odds you can add relative to your flat bet, and "3-4-5x" is the standard cap: up to {{ odds.oddsMult[4] }}x your flat bet on a point of 4 or 10, {{ odds.oddsMult[5] }}x on 5 or 9, {{ odds.oddsMult[6] }}x on 6 or 8. It looks uneven at first, but it's built that way so the dollar risk comes out close to level across all three point pairs, regardless of which one gets set. The bigger the Odds bet relative to the flat portion, the more the *combined* bet blends toward that 0% edge — which is the entire argument for keeping the flat bet modest and putting real money behind the Odds instead.

<p class="strategy-link"><a class="btn" href="/games/craps/">Try Odds bets on the free craps simulator →</a></p>

<h2 id="craps-payout-calculator">Craps payout calculator</h2>

Pick a bet and an amount to see exactly what it pays. Every number below comes from the same odds data that drives the free craps simulator, not a separate estimate.

<div class="calc-card" id="payoutCalc">
  <div class="calc-row">
    <label for="calcBet">Bet type</label>
    <select id="calcBet">
      <option value="pass">Pass Line (1:1)</option>
      <option value="come">Come (1:1)</option>
      <option value="dontpass">Don't Pass (1:1, pushes on 12)</option>
      <option value="dontcome">Don't Come (1:1, pushes on 12)</option>
      <option value="odds4">Odds on 4 or 10 (2:1)</option>
      <option value="odds5">Odds on 5 or 9 (3:2)</option>
      <option value="odds6">Odds on 6 or 8 (6:5)</option>
      <option value="place4">Place 4 (9:5)</option>
      <option value="place5">Place 5 (7:5)</option>
      <option value="place6">Place 6 (7:6)</option>
      <option value="place8">Place 8 (7:6)</option>
      <option value="place9">Place 9 (7:5)</option>
      <option value="place10">Place 10 (9:5)</option>
      <option value="buy410">Buy 4 or 10 (2:1 minus 5% vig)</option>
      <option value="field">Field (even money, 2 and 12 pay more)</option>
      <option value="any7">Any Seven (4:1)</option>
      <option value="anycraps">Any Craps (7:1)</option>
      <option value="hard4">Hard 4 (7:1)</option>
      <option value="hard6">Hard 6 (9:1)</option>
      <option value="hard8">Hard 8 (9:1)</option>
      <option value="hard10">Hard 10 (7:1)</option>
    </select>
  </div>
  <div class="calc-row">
    <label for="calcAmt">Bet amount ($)</label>
    <input id="calcAmt" type="number" min="1" step="1" value="10" inputmode="numeric">
  </div>
  <div class="calc-result" id="calcResult" aria-live="polite"></div>
</div>

<script src="/games/craps/odds.js"></script>
<script>
(function () {
  function fmt(n) { return '$' + n.toFixed(2); }

  var DEFS = {
    pass:     { ratio: [1, 1], edge: 'passLine', note: "Wins on 7 or 11 on the come-out, or the point again before a 7." },
    come:     { ratio: [1, 1], edge: 'passLine', note: "Same bet as Pass Line, made after a point is already on." },
    dontpass: { ratio: [1, 1], edge: 'dontPass', note: "Wins when Pass Line loses. Pushes (bet returned) if the come-out rolls 12." },
    dontcome: { ratio: [1, 1], edge: 'dontPass', note: "Same bet as Don't Pass, made after a point is already on." },
    odds4:    { ratio: ODDS.trueOdds[4], edge: null, note: "Backs a point of 4 or 10 at true odds. Zero house edge." },
    odds5:    { ratio: ODDS.trueOdds[5], edge: null, note: "Backs a point of 5 or 9 at true odds. Zero house edge." },
    odds6:    { ratio: ODDS.trueOdds[6], edge: null, note: "Backs a point of 6 or 8 at true odds. Zero house edge." },
    place4:   { ratio: ODDS.placeOdds[4], edge: 'place4or10', note: "Bet the 4 directly. Wins if it repeats before a 7." },
    place5:   { ratio: ODDS.placeOdds[5], edge: 'place5or9', note: "Bet the 5 directly. Wins if it repeats before a 7." },
    place6:   { ratio: ODDS.placeOdds[6], edge: 'place6or8', note: "Bet the 6 directly. Wins if it repeats before a 7." },
    place8:   { ratio: ODDS.placeOdds[8], edge: 'place6or8', note: "Bet the 8 directly. Wins if it repeats before a 7." },
    place9:   { ratio: ODDS.placeOdds[9], edge: 'place5or9', note: "Bet the 9 directly. Wins if it repeats before a 7." },
    place10:  { ratio: ODDS.placeOdds[10], edge: 'place4or10', note: "Bet the 10 directly. Wins if it repeats before a 7." },
    buy410:   { ratio: ODDS.trueOdds[4], buy: true, edge: 'buy4or10', note: "Pays true odds in exchange for a commission paid up front, not refunded if the bet loses." },
    field:    { ratio: [1, 1], edge: 'field', note: "One roll only. Shown here is the even-money case (3, 4, 9, 10, 11); 2 pays double and 12 pays triple." },
    any7:     { ratio: ODDS.anySevenPay, edge: 'anySeven', note: "One roll, wins only on 7. The worst bet on the layout." },
    anycraps: { ratio: ODDS.anyCrapsPay, edge: 'anyCraps', note: "One roll, wins on 2, 3, or 12." },
    hard4:    { ratio: [ODDS.hardPay[4], 1], edge: 'hard4or10', note: "Wins if 4 rolls as 2-2 before a 7 or an easy 4." },
    hard6:    { ratio: [ODDS.hardPay[6], 1], edge: 'hard6or8', note: "Wins if 6 rolls as 3-3 before a 7 or an easy 6." },
    hard8:    { ratio: [ODDS.hardPay[8], 1], edge: 'hard6or8', note: "Wins if 8 rolls as 4-4 before a 7 or an easy 8." },
    hard10:   { ratio: [ODDS.hardPay[10], 1], edge: 'hard4or10', note: "Wins if 10 rolls as 5-5 before a 7 or an easy 10." }
  };

  function render() {
    var key = document.getElementById('calcBet').value;
    var amt = parseFloat(document.getElementById('calcAmt').value);
    var out = document.getElementById('calcResult');
    if (!amt || amt <= 0) { out.innerHTML = '<p class="calc-note">Enter a bet amount above $0.</p>'; return; }

    var def = DEFS[key];
    var win = amt * def.ratio[0] / def.ratio[1];
    var total = amt + win;
    var edgeStr = def.edge ? ODDS.houseEdgeStr[def.edge] + '%' : '0.00%';

    var lines = [];
    if (def.buy) {
      var vig = Math.max(1, Math.ceil(amt * ODDS.buyCommissionPct / 100));
      lines.push('<div class="calc-line"><span>Commission (paid up front, not refunded)</span><b>' + fmt(vig) + '</b></div>');
    }
    lines.push('<div class="calc-line"><span>Winning payout</span><b>' + fmt(win) + '</b></div>');
    lines.push('<div class="calc-line"><span>Total returned if it wins</span><b>' + fmt(total) + '</b></div>');
    lines.push('<div class="calc-line"><span>House edge</span><b>' + edgeStr + '</b></div>');

    out.innerHTML = lines.join('') + '<p class="calc-note">' + def.note + '</p>';
  }

  document.getElementById('calcBet').addEventListener('change', render);
  document.getElementById('calcAmt').addEventListener('input', render);
  render();
})();
</script>

## FAQ

**What bet has the best odds in craps?**
Pass Line or Come backed with max Odds, at a {{ odds.houseEdgeStr.passLineFullOdds }}% blended house edge on a {{ odds.oddsMult[4] }}-{{ odds.oddsMult[5] }}-{{ odds.oddsMult[6] }}x table. The Odds portion by itself carries no house edge at all.

**What is the house edge on the Pass Line?**
{{ odds.houseEdgeStr.passLine }}% with no Odds behind it. Add max Odds and the blended edge drops to {{ odds.houseEdgeStr.passLineFullOdds }}%.

**Do Odds bets really have a 0% house edge?**
Yes. Odds behind the Pass Line, Don't Pass, Come, or Don't Come pay exactly the true odds of the point repeating before a 7 — {{ odds.trueOddsStr[4] }} on 4 or 10, {{ odds.trueOddsStr[5] }} on 5 or 9, {{ odds.trueOddsStr[6] }} on 6 or 8 — with nothing held back. It's the one bet in the building priced with zero house advantage.

**What does 3-4-5x Odds mean?**
The maximum Odds bet allowed relative to your flat bet, keyed to the point: {{ odds.oddsMult[4] }}x on 4 or 10, {{ odds.oddsMult[5] }}x on 5 or 9, {{ odds.oddsMult[6] }}x on 6 or 8. It's the standard cap most tables use, and it's uneven across points on purpose so the dollar risk stays roughly level.

**What are the worst bets in craps?**
Any Seven ({{ odds.houseEdgeStr.anySeven }}%) and Hard 4 or Hard 10 ({{ odds.houseEdgeStr.hard4or10 }}%) sit at the bottom of the chart above. All of the worst bets are one-roll or narrow-resolution propositions in the center of the table.

**How much does a $10 craps bet pay?**
It depends entirely on which bet — see the full [chart](#craps-odds-and-payouts-chart) above or use the [calculator](#craps-payout-calculator). A $10 Pass Line bet wins $10; $10 in Odds on 6 or 8 wins $12; $10 on Any Seven wins $40.

## The takeaway

If you're optimizing purely for the lowest cost of play: Pass Line or Come with max Odds, Don't Pass or Don't Come, and Place bets on 6 and 8 are the low-cost side of this chart. Everything below about 4% is paying for excitement, not value — that's a fine trade to make on purpose, just not one to make by accident.

For the mechanics behind any of these, see [how to play craps](/strategy/craps/how-to-play/) or the [craps glossary](/strategy/craps/glossary/). For a full strategy built from several of the low-edge bets above running at once, read [3 Point Molly: what the math actually says](/the-pit/3-point-molly-craps-strategy/).

<p class="strategy-link"><a class="btn" href="/games/craps/">Practice free on the craps simulator →</a></p>
