"""
Bankroll survival study for 0stakes (spec task 0c).

Reuses the payout constants and per-round/per-hand resolution logic from
craps_sim.py and bj_sim.py rather than reimplementing the math -- this file
only adds the session-level bankroll bookkeeping (bust/double/1-hour
snapshot) on top of those existing engines.

Methodology: for each (game, strategy, unit, starting bankroll) cell, run
N_SESSIONS independent sessions, flat betting the fixed unit every round/hand
(bet size never scales with bankroll). A session "busts" the first time its
bankroll drops below one unit (can no longer place the flat bet); busted
bankroll is held constant afterward, not reduced further. A session "doubles"
the first time its bankroll reaches 2x its starting value; doubling does not
stop play. Every session also gets a snapshot of its bankroll at the 1-hour
mark (100 craps rolls or 80 blackjack hands elapsed), taken once and held
even if the session busts later.

Sessions are capped at ROUND_CAP rounds/hands (craps) or HAND_CAP hands
(blackjack) -- chosen generously relative to the bankroll:unit ratios studied
here (at most 200 units) so that unresolved sessions at the cap are rare; any
that remain are reported as "still active" and excluded from the bust-length
median rather than silently treated as bust or non-bust.
"""
import sys, time
import numpy as np

from craps_sim import ODDS_MULT, ODDS_PAY, PLACE_PAY

SEED = 46
N_SESSIONS = 100_000
ROUND_CAP = 4_000     # craps rounds (generous vs. <=200 units at risk per bankroll/unit pair)
HAND_CAP = 4_000      # blackjack hands
HOUR_ROLLS = 100       # craps rolls/hour assumption from the spec
HOUR_HANDS = 80        # blackjack hands/hour assumption from the spec

BANKROLLS = [100, 200, 300, 500, 1000]


# ---------- one-round-at-a-time craps outcome generators (vectorized across
#             however many sessions are still active this round) ----------
def pass_flat_round(n, unit, rng):
    """Returns (net, rolls) for n independent Pass Line flat-bet rounds."""
    net = np.empty(n); rolls = np.ones(n, dtype=np.int64)
    t = rng.integers(1, 7, n) + rng.integers(1, 7, n)
    win_now = np.isin(t, (7, 11))
    lose_now = np.isin(t, (2, 3, 12))
    net[win_now] = unit
    net[lose_now] = -unit
    pending = ~(win_now | lose_now)
    idx = np.where(pending)[0]
    point = t[idx]
    resolved = np.zeros(len(idx), dtype=bool)
    while not resolved.all():
        live = np.where(~resolved)[0]
        r = rng.integers(1, 7, len(live)) + rng.integers(1, 7, len(live))
        rolls[idx[live]] += 1
        made = r == point[live]
        seven = r == 7
        net[idx[live[made]]] = unit
        net[idx[live[seven]]] = -unit
        resolved[live[made | seven]] = True
    return net, rolls


def pass_odds_round(n, unit, rng):
    """Pass Line + max odds. Win/lose the flat bet same as pass_flat_round,
    plus the odds bet resolves the same way it's actually decided on the
    table -- win/lose together with the flat bet, at ODDS_PAY[point]."""
    net = np.empty(n); rolls = np.ones(n, dtype=np.int64)
    t = rng.integers(1, 7, n) + rng.integers(1, 7, n)
    win_now = np.isin(t, (7, 11))
    lose_now = np.isin(t, (2, 3, 12))
    net[win_now] = unit
    net[lose_now] = -unit
    pending = ~(win_now | lose_now)
    idx = np.where(pending)[0]
    point = t[idx]
    take = unit * np.array([ODDS_MULT[p] for p in point])
    pay = np.array([ODDS_PAY[p] for p in point])
    resolved = np.zeros(len(idx), dtype=bool)
    while not resolved.all():
        live = np.where(~resolved)[0]
        r = rng.integers(1, 7, len(live)) + rng.integers(1, 7, len(live))
        rolls[idx[live]] += 1
        made = r == point[live]
        seven = r == 7
        won = live[made]
        lost = live[seven]
        net[idx[won]] = unit + take[won] * pay[won]
        net[idx[lost]] = -unit - take[lost]
        resolved[live[made | seven]] = True
    return net, rolls


def iron_cross_round(n, unit, rng):
    """Field=unit, Place5=unit, Place6/8=unit*1.2. Matches craps_sim.iron_cross,
    vectorized (no per-session Python loop) for bankroll-study throughput."""
    f, p5, p68 = unit, unit, unit * 1.2
    at_risk = f + p5 + 2 * p68
    net = np.zeros(n); rolls = np.ones(n, dtype=np.int64)
    t = rng.integers(1, 7, n) + rng.integers(1, 7, n)
    pending = ~np.isin(t, (2, 3, 7, 11, 12))
    idx = np.where(pending)[0]
    point = t[idx]
    live_net = np.zeros(len(idx))
    resolved = np.zeros(len(idx), dtype=bool)
    while not resolved.all():
        live = np.where(~resolved)[0]
        r = rng.integers(1, 7, len(live)) + rng.integers(1, 7, len(live))
        rolls[idx[live]] += 1
        seven = r == 7

        pay = np.zeros(len(live))
        pay[r == 2] += f * 2.0
        pay[np.isin(r, (3, 4, 9, 10, 11))] += f * 1.0
        pay[r == 12] += f * 3.0
        pay[np.isin(r, (5, 6, 8))] -= f          # field loses on the Place numbers
        pay[r == 5] += p5 * PLACE_PAY[5]
        pay[np.isin(r, (6, 8))] += p68 * PLACE_PAY[6]   # PLACE_PAY[6] == PLACE_PAY[8]
        live_net[live] += pay

        made_point = r == point[live]
        live_net[live[seven]] -= at_risk
        resolved[live[seven | made_point]] = True
    net[idx] = live_net
    return net, rolls


CRAPS_STRATEGIES = {
    "pass_flat": pass_flat_round,
    "pass_odds": pass_odds_round,
    "iron_cross": iron_cross_round,
}


def simulate_craps_bankroll(strategy_fn, unit, bankroll0, n_sessions, rng):
    bankroll = np.full(n_sessions, float(bankroll0))
    active = np.ones(n_sessions, dtype=bool)
    busted_at = np.full(n_sessions, -1, dtype=np.int64)
    doubled_at = np.full(n_sessions, -1, dtype=np.int64)
    rolls_elapsed = np.zeros(n_sessions, dtype=np.int64)
    hour_recorded = np.zeros(n_sessions, dtype=bool)
    bankroll_at_hour = np.full(n_sessions, np.nan)
    target = 2 * bankroll0

    for rnd in range(ROUND_CAP):
        if not active.any():
            break
        idx = np.where(active)[0]
        net, rolls = strategy_fn(len(idx), unit, rng)
        bankroll[idx] += net
        rolls_elapsed[idx] += rolls

        crossing = idx[(rolls_elapsed[idx] >= HOUR_ROLLS) & (~hour_recorded[idx])]
        bankroll_at_hour[crossing] = bankroll[crossing]
        hour_recorded[crossing] = True

        newly_doubled = idx[(bankroll[idx] >= target) & (doubled_at[idx] == -1)]
        doubled_at[newly_doubled] = rnd

        newly_busted = idx[bankroll[idx] < unit]
        busted_at[newly_busted] = rnd
        active[newly_busted] = False

    # sessions still active or still under an hour at the cap: snapshot now
    unresolved_hour = ~hour_recorded
    bankroll_at_hour[unresolved_hour] = bankroll[unresolved_hour]

    return {
        "busted": busted_at >= 0,
        "busted_at_round": busted_at,
        "doubled_before_bust": (doubled_at >= 0) & ((busted_at == -1) | (doubled_at <= busted_at)),
        "bankroll_at_hour": bankroll_at_hour,
        "still_active_at_cap": active,
    }


# ---------- blackjack: reuse play_hand/bs_action directly, one hand at a
#             time across whichever sessions are still active ----------
def simulate_blackjack_bankroll(unit, bankroll0, n_sessions, rng):
    from bj_sim import Shoe, play_hand, bs_action

    shoe = Shoe(rng)
    bankroll = np.full(n_sessions, float(bankroll0))
    active = np.ones(n_sessions, dtype=bool)
    busted_at = np.full(n_sessions, -1, dtype=np.int64)
    doubled_at = np.full(n_sessions, -1, dtype=np.int64)
    hands_elapsed = np.zeros(n_sessions, dtype=np.int64)
    hour_recorded = np.zeros(n_sessions, dtype=bool)
    bankroll_at_hour = np.full(n_sessions, np.nan)
    target = 2 * bankroll0

    for hnd in range(HAND_CAP):
        if not active.any():
            break
        idx = np.where(active)[0]
        for i in idx:
            shoe.maybe_shuffle()
            net, _ = play_hand(shoe, bs_action, bet=unit, take_insurance=False)
            bankroll[i] += net
        hands_elapsed[idx] += 1

        crossing = idx[(hands_elapsed[idx] >= HOUR_HANDS) & (~hour_recorded[idx])]
        bankroll_at_hour[crossing] = bankroll[crossing]
        hour_recorded[crossing] = True

        newly_doubled = idx[(bankroll[idx] >= target) & (doubled_at[idx] == -1)]
        doubled_at[newly_doubled] = hnd

        newly_busted = idx[bankroll[idx] < unit]
        busted_at[newly_busted] = hnd
        active[newly_busted] = False

    unresolved_hour = ~hour_recorded
    bankroll_at_hour[unresolved_hour] = bankroll[unresolved_hour]

    return {
        "busted": busted_at >= 0,
        "busted_at_round": busted_at,
        "doubled_before_bust": (doubled_at >= 0) & ((busted_at == -1) | (doubled_at <= busted_at)),
        "bankroll_at_hour": bankroll_at_hour,
        "still_active_at_cap": active,
    }


def summarize(label, unit, bankroll0, result):
    busted = result["busted"]
    lengths = result["busted_at_round"][busted]
    median_len = int(np.median(lengths)) if len(lengths) else None
    p_survive_hour = float(np.mean(result["bankroll_at_hour"] >= unit))
    p_double = float(np.mean(result["doubled_before_bust"]))
    median_end = float(np.median(result["bankroll_at_hour"]))
    still_active = int(result["still_active_at_cap"].sum())
    print(f"{label:28s} bankroll ${bankroll0:<5d} unit ${unit:<3d}  "
          f"median rounds-to-bust {str(median_len):>6s}  "
          f"P(survive 1hr) {p_survive_hour*100:6.2f}%  "
          f"P(double before bust) {p_double*100:6.2f}%  "
          f"median $ after 1hr {median_end:8.2f}  "
          f"unresolved-at-cap {still_active}")


if __name__ == "__main__":
    t0 = time.time()
    print("=" * 100)
    print(f"BANKROLL SURVIVAL STUDY -- {N_SESSIONS:,} sessions/cell, seed {SEED}, "
          f"round cap {ROUND_CAP:,} (craps) / {HAND_CAP:,} hands (blackjack)")
    print("Craps rules: 3-4-5x odds, Field 2:1/3:1. Blackjack rules: 6D, S17, DAS, "
          "no resplit, no surrender, BJ pays 3:2.")
    print("=" * 100)

    print("\n--- CRAPS ---")
    for strat_name, strat_fn in CRAPS_STRATEGIES.items():
        for unit in (5, 10):
            for b0 in BANKROLLS:
                rng = np.random.default_rng(SEED)
                res = simulate_craps_bankroll(strat_fn, unit, b0, N_SESSIONS, rng)
                summarize(f"craps/{strat_name}", unit, b0, res)

    print("\n--- BLACKJACK (basic strategy) ---")
    for unit in (5, 10, 25):
        for b0 in BANKROLLS:
            rng = np.random.default_rng(SEED)
            res = simulate_blackjack_bankroll(unit, b0, N_SESSIONS, rng)
            summarize("blackjack/basic_strategy", unit, b0, res)

    print(f"\n({time.time()-t0:.0f}s)")
