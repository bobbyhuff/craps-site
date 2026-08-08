import numpy as np, time
from craps_sim import line_bets, iron_cross, dice_stream, SEED

FLAT = 10

def pct(x): return f"{x*100:.3f}%"

print("=" * 68)
print("STUDY A — Pass Line vs Don't Pass, 1,000,000 rounds, $10 flat, seed 42")
print("=" * 68)

r = line_bets(1_000_000)
n = len(r["pass_flat"])

# total handle differs per strategy because odds add wagered money
handles = {
    "pass_flat": FLAT * n,
    "dont_flat": FLAT * n,
}
# recompute handle for odds versions by re-running with tracking
# simpler: derive analytically from the sim's own bet sizing
# pass_odds handle = flat*n + sum(odds actually placed)
# rebuild quickly:
rng = np.random.default_rng(SEED)
buf, bi = dice_stream(2_000_000, rng), 0
ODDS_MULT = {4:3,5:4,6:5,8:5,9:4,10:3}
h_pass_odds = h_dont_odds = 0.0
for _ in range(n):
    if bi >= len(buf): buf, bi = dice_stream(2_000_000, rng), 0
    t = buf[bi]; bi += 1
    h_pass_odds += FLAT; h_dont_odds += FLAT
    if t in (2,3,7,11,12): continue
    point = t
    h_pass_odds += FLAT * ODDS_MULT[point]
    h_dont_odds += FLAT * 6   # lay risk is a flat 6x, matching craps.js's maxLayOdds()
    while True:
        if bi >= len(buf): buf, bi = dice_stream(2_000_000, rng), 0
        rr = buf[bi]; bi += 1
        if rr == point or rr == 7: break
handles["pass_odds"] = h_pass_odds
handles["dont_odds"] = h_dont_odds

labels = {
    "pass_flat": "Pass Line, no odds",
    "pass_odds": "Pass Line + max odds",
    "dont_flat": "Don't Pass, no odds",
    "dont_odds": "Don't Pass + max lay",
}
print(f"{'strategy':24s} {'edge on handle':>15s} {'loss/round':>12s} {'win%':>7s} {'push%':>7s} {'std/round':>10s}")
for k in ("pass_flat","pass_odds","dont_flat","dont_odds"):
    v = r[k]
    print(f"{labels[k]:24s} {pct(-v.sum()/handles[k]):>15s} "
          f"{'$'+format(-v.mean(),'.4f'):>12s} {(v>0).mean()*100:6.2f}% "
          f"{(v==0).mean()*100:6.2f}% {'$'+format(v.std(),'.2f'):>10s}")

print("\nKEY POINT: expected loss per ROUND is identical with and without odds")
print(f"  Pass flat:      ${-r['pass_flat'].mean():.4f}/round")
print(f"  Pass + odds:    ${-r['pass_odds'].mean():.4f}/round")
print("  Odds lower the edge as a % of money wagered, not the dollars you lose.")
print(f"  What they DO change: swing per round goes ${r['pass_flat'].std():.2f} -> ${r['pass_odds'].std():.2f}")

# 100-round session outcomes
for k in ("pass_flat","pass_odds","dont_flat","dont_odds"):
    v = r[k][: (n // 100) * 100].reshape(-1, 100).sum(axis=1)
    print(f"  {labels[k]:24s} 100-round session: median ${np.median(v):+7.0f}  "
          f"ahead {100*(v>0).mean():5.1f}%  worse than -$300 {100*(v<-300).mean():5.1f}%")

print()
print("=" * 68)
print("STUDY B — Iron Cross, 1,000,000 rounds, $5 unit ($22 at risk), seed 43")
print("=" * 68)
t0 = time.time()
ic, rolls, at_risk = iron_cross(1_000_000)
active = rolls > 1
print(f"at risk once a point is on: ${at_risk:.2f}")
print(f"rounds where the bet was live (point established): {active.mean()*100:.1f}%")
print(f"net over all rounds: ${ic.sum():,.0f}")
print(f"average per round:   ${ic.mean():+.4f}")
print(f"average per LIVE round: ${ic[active].mean():+.4f}")
print(f"total rolls simulated: {rolls.sum():,}")
print(f"loss per roll of the dice: ${-ic.sum()/rolls.sum():.4f}")
print(f"edge per dollar at risk per live round: {pct(-ic[active].sum()/(at_risk*active.sum()))}")
print(f"live rounds ending positive: {100*(ic[active]>0).mean():.1f}%")
print(f"worst single round: ${ic.min():,.0f}   best: ${ic.max():,.0f}")

sess = ic[:(1_000_000//100)*100].reshape(-1,100).sum(axis=1)
print(f"100-round session: median ${np.median(sess):+.0f}  ahead {100*(sess>0).mean():.1f}%  "
      f"worse than -$300 {100*(sess<-300).mean():.1f}%")
print(f"({time.time()-t0:.1f}s)")
