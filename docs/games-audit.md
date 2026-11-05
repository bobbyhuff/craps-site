# Casino games audit and expansion notes

What shipped in the four-new-games pass, what the audit of every game found, and what is
left. Numbers quoted here come from the `src/_data/*Odds.js` files and the tests that verify them.

## New games

| Game | URL | Engine | Verified by |
|---|---|---|---|
| Video Poker (9/6 Jacks or Better) | `/games/video-poker/` | `vp-engine.js` | full 2,598,960-hand enumeration; exact hold EVs |
| Three Card Poker | `/games/three-card-poker/` | `tcp-engine.js` | exact enumeration of all player/dealer deals |
| Pai Gow Poker | `/games/pai-gow-poker/` | `pg-engine.js` | rule unit tests; 1,000,000-hand simulation |
| Crapless Craps | `/games/crapless-craps/` | `craps.js` + `craplessOdds.js` | real engine in a VM; exact edge math; simulation |

### Ruleset decisions

- **Crapless come-out 11.** The request listed "7 or 11 wins" on the come-out but also asked for
  11 as a point and quoted a 5.38% edge. The 5.38% figure only exists when 11 is a point (the
  standard ruleset), so that's what's implemented. With 11 as a come-out winner *and* 2/3/12 as points, the Pass Line would win 51.5% of the time, a 2.95% edge for the player, which no casino offers.
- **Crapless odds:** 3x on 2/3/4/10/11/12, 4x on 5/9, 5x on 6/8. Place 2/12 at 11:2 (7.14%),
  3/11 at 11:4 (6.25%). Buy on 4-10 only. No Don't Pass / Don't Come. Field, props and
  hardways are unchanged from standard craps.
- **Three Card Poker fold:** folding forfeits the Ante *and* Pair Plus (standard casino
  procedure). Pair Plus-only bets are allowed and have no fold decision. Pair Plus table is
  40-30-6-3-1 (7.28%); the 40-30-6-4-1 table (2.32%) is defined and selectable in the data file.
- **Pai Gow:** copies go to the banker; wheel is the second-highest straight; the joker completes
  straights/flushes/straight flushes (as the highest missing card in a flush) and is otherwise an
  Ace; five aces is the top hand. The house way is published on the page and drives both the
  dealer and Auto Arrange. Player banking and bonus side bets aren't offered.
- **Video poker advisor** is exact (enumerates every draw), not a heuristic. The memorizable
  list on the page is labeled as a simplified strategy (99.46% vs 99.54%).

## Bugs found and fixed

1. **Craps "Let it ride" double credit.** A winning Place, Buy or Hardway bet with Let it ride on
   paid back the stake *and* left it on the table, so the bankroll grew by the stake every win.
   Replaced by an "After a win" control (take down / leave up / press) that credits only the
   winnings when the bet stays up. Covered by `tests/craps.test.js`.
2. **Craps come-out realism.** Place, Buy, Hardways and Come odds used to act on the come-out
   roll, so a come-out 7 took down place bets. They're now off on the come-out (casino default)
   with a "Bets work on the come-out" opt-in.

## Improvements made to existing games

**Craps (and Crapless):** quick-bet presets (6 & 8, Inside, Iron Cross, 3-Point Molly step),
Press/Regress buttons in the number sheet, auto-press after a win, Rebet (re-places the layout
from before the last seven-out), 20-roll history with point/natural/seven-out markers, session
roll stats with expected-frequency markers, dice tumble animation (respects reduced motion),
Standard/Crapless switch, number heads as real buttons, live regions for results.

**Blackjack:** optional basic-strategy hint (from the same `blackjackStrategy.js` table as the
chart and trainer, adjusted for what's legal right now), optional mistake flags with a running
accuracy score, keyboard shortcuts (H/S/D/P, Enter).

**Roulette:** Double button, winning pocket and winning outside bets stay highlighted until the
next spin, per-spin net result, session red/black/green count.

**Baccarat:** "Same Bet, Deal" one-tap redeal, plain-English third-card explanations in the log,
bead-plate scoreboard with a clear "past results don't predict" note.

**Cross-game:** `aria-live` on notices and results everywhere; new games add a visually hidden
announcer, keyboard shortcuts, Fast play (remembered per browser; bankrolls are never stored),
collapsible session stats (hands, wagered, returned, net, biggest win, time).

## Audit notes not acted on (and why)

- **Bankroll persistence.** Every game asks for a bankroll on load and forgets it on refresh.
  localStorage persistence would help returning players, but it changes every game's start flow
  and needs a "reset" story, so it's a recommendation, not a drive-by change.
- **Sound.** None of the games have sound; adding it means new assets or WebAudio code across
  every game. Recommended as an opt-in, off by default.
- **Session stats on the older games.** The shared `SessionStats` in `games/shared/table-kit.js`
  could be wired into blackjack/roulette/baccarat with a few lines each.
- **Craps status bar** shows "OFF (come-out)" which wraps on 360px phones (pre-existing).
- **`/strategy/craps/` hub** lists "Best Craps Strategies for Beginners" and "6/8 Craps Strategy
  Explained" twice each (pre-existing duplicate cards).

## Top recommendations

1. Optional localStorage bankroll that carries across games, with an explicit "start over".
2. Wire `SessionStats` into blackjack, roulette and baccarat for consistent session summaries.
3. A strategy hub page per new game (`/strategy/video-poker/` etc.) with a full 9/6 strategy chart.
4. Roulette: a European single-zero table toggle (the content already compares the two).
5. Opt-in sound effects (deal, dice, win) with one site-wide on/off preference.

## Not testable here

Real devices (iOS Safari, Android Chrome) and screen readers weren't available; checks ran in
headless Chromium at 320/360/390/1280px widths. Production deploy (Wrangler `_redirects`
validation) wasn't run; `_redirects` was not changed.
