"""
Craps Monte Carlo engine for 0stakes.
Rules match the 0stakes table: 3-4-5x odds, Field pays 2:1 on the 2 and 3:1 on the 12.
"""
import numpy as np

SEED = 42

# ---------- dice ----------
def dice_stream(n, rng):
    return rng.integers(1, 7, size=n) + rng.integers(1, 7, size=n)

# ---------- payout tables ----------
ODDS_MULT = {4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3}          # 3-4-5x caps
ODDS_PAY  = {4: 2.0, 10: 2.0, 5: 1.5, 9: 1.5, 6: 6/5, 8: 6/5}
PLACE_PAY = {4: 9/5, 10: 9/5, 5: 7/5, 9: 7/5, 6: 7/6, 8: 7/6}

def field_pay(total):
    if total == 2:  return 2.0
    if total == 12: return 3.0
    if total in (3, 4, 9, 10, 11): return 1.0
    return None  # loses


# ---------- Study 1: Pass Line vs Don't Pass, flat and with odds ----------
def line_bets(n_rounds, flat=10, rng=None):
    """Returns net result per round for four strategies."""
    rng = rng or np.random.default_rng(SEED)
    res = {k: [] for k in ("pass_flat", "pass_odds", "dont_flat", "dont_odds")}
    buf, bi = dice_stream(2_000_000, rng), 0

    for _ in range(n_rounds):
        if bi >= len(buf):
            buf, bi = dice_stream(2_000_000, rng), 0
        t = buf[bi]; bi += 1

        # come-out
        if t in (7, 11):
            res["pass_flat"].append(flat);  res["pass_odds"].append(flat)
            res["dont_flat"].append(-flat); res["dont_odds"].append(-flat)
            continue
        if t in (2, 3):
            res["pass_flat"].append(-flat); res["pass_odds"].append(-flat)
            res["dont_flat"].append(flat);  res["dont_odds"].append(flat)
            continue
        if t == 12:
            res["pass_flat"].append(-flat); res["pass_odds"].append(-flat)
            res["dont_flat"].append(0);     res["dont_odds"].append(0)   # push
            continue

        point = t
        take = flat * ODDS_MULT[point]                 # max take odds
        # Matches craps.js's maxLayOdds() exactly: risk is capped at
        # flat * oddsMult[point] * (trueOdds.n/trueOdds.d), which algebraically
        # reduces to a flat 6x the flat bet for all three point pairs (4/10,
        # 5/9, 6/8). Win is oddsMult[point] * flat -- the same 3-4-5x used for
        # taking odds, not a flat multiple.
        lay_risk = flat * 6
        lay_win = flat * ODDS_MULT[point]

        while True:
            if bi >= len(buf):
                buf, bi = dice_stream(2_000_000, rng), 0
            r = buf[bi]; bi += 1
            if r == point:
                res["pass_flat"].append(flat)
                res["pass_odds"].append(flat + take * ODDS_PAY[point])
                res["dont_flat"].append(-flat)
                res["dont_odds"].append(-flat - lay_risk)
                break
            if r == 7:
                res["pass_flat"].append(-flat)
                res["pass_odds"].append(-flat - take)
                res["dont_flat"].append(flat)
                res["dont_odds"].append(flat + lay_win)
                break

    return {k: np.array(v, dtype=float) for k, v in res.items()}


# ---------- Study 2: Iron Cross ----------
def iron_cross(n_rounds, unit=5, rng=None):
    """
    Iron Cross: after a point is set, Field + Place 5 + Place 6 + Place 8.
    Field = unit, Place 5 = unit, Place 6 / 8 = unit*1.2 (multiples of 6).
    Wins something on every roll except a 7. Bets come down on the seven-out.
    Compared against Pass Line + full odds over the same rolls.
    """
    rng = rng or np.random.default_rng(SEED + 1)
    f, p5, p68 = unit, unit, unit * 1.2
    at_risk = f + p5 + 2 * p68

    per_round, rolls_per_round = [], []
    buf, bi = dice_stream(2_000_000, rng), 0

    for _ in range(n_rounds):
        if bi >= len(buf):
            buf, bi = dice_stream(2_000_000, rng), 0
        t = buf[bi]; bi += 1
        if t in (2, 3, 7, 11, 12):
            per_round.append(0.0); rolls_per_round.append(1)
            continue

        point, net, nrolls = t, 0.0, 1
        while True:
            if bi >= len(buf):
                buf, bi = dice_stream(2_000_000, rng), 0
            r = buf[bi]; bi += 1; nrolls += 1

            if r == 7:
                net -= at_risk
                break
            fp = field_pay(r)
            if fp is not None:
                net += f * fp
            else:
                net -= f
            if r == 5:  net += p5 * PLACE_PAY[5]
            elif r in (6, 8): net += p68 * PLACE_PAY[r]

            if r == point:
                break   # point made, take bets down and reset
        per_round.append(net); rolls_per_round.append(nrolls)

    return np.array(per_round), np.array(rolls_per_round), at_risk


if __name__ == "__main__":
    import sys, time
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 200_000

    t0 = time.time()
    r = line_bets(n)
    print(f"=== LINE BETS: {n:,} rounds, $10 flat, seed {SEED} ===")
    for k, v in r.items():
        handle = 10 * len(v)
        print(f"{k:10s}  net ${v.sum():>12,.0f}   edge/flat-bet {-v.sum()/handle*100:6.3f}%   "
              f"win% {(v>0).mean()*100:5.2f}  push% {(v==0).mean()*100:5.2f}")
    print(f"({time.time()-t0:.1f}s)")
