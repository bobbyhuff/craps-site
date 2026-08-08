import numpy as np, time
from bj_sim import Shoe, play_hand, bs_action, never_bust_action, SEED

def run(strategy, n, seed, insurance=False, bet=10):
    rng = np.random.default_rng(seed)
    shoe = Shoe(rng)
    out = np.empty(n); ins = np.empty(n)
    for k in range(n):
        shoe.maybe_shuffle()
        a, b = play_hand(shoe, strategy, bet=bet, take_insurance=insurance)
        out[k] = a; ins[k] = b
    return out, ins

N = 2_000_000
print("="*68); print(f"STUDY C — Basic strategy vs 'never bust', {N:,} hands each, $10, seed 44")
print("6 decks, dealer stands soft 17, DAS, one split, no surrender, BJ pays 3:2"); print("="*68)

t0=time.time()
bs,_  = run(bs_action, N, SEED)
nb,_  = run(never_bust_action, N, SEED)
for name, v in (("Basic strategy", bs), ("Never bust (stand 12+)", nb)):
    print(f"{name:24s} edge {-v.sum()/(10*N)*100:6.3f}%   $/hand {-v.mean():+.4f}   "
          f"win {100*(v>0).mean():5.2f}%  push {100*(v==0).mean():5.2f}%  lose {100*(v<0).mean():5.2f}%")
gap = (nb.mean()-bs.mean())
print(f"\ncost of never-busting: ${-gap:.4f} per hand")
print(f"at 80 hands/hr, $10 bets: ${-gap*80:.2f}/hr extra    over a 4-hr session: ${-gap*320:.2f}")
print(f"({time.time()-t0:.0f}s)")

print(); print("="*68); print(f"STUDY D — Insurance, {N:,} hands, seed 45"); print("="*68)
_, ins = run(bs_action, N, SEED+1, insurance=True)
taken = ins != 0
won = ins > 0
print(f"hands where dealer showed an Ace: {taken.sum():,} ({100*taken.mean():.2f}%)")
print(f"of those, dealer had blackjack: {won.sum():,} ({100*won.sum()/taken.sum():.2f}%)  [theory: 30.87%]")
print(f"insurance net: ${ins.sum():,.0f} on ${5*taken.sum():,.0f} wagered  ->  edge {-ins.sum()/(5*taken.sum())*100:.3f}%  [theory: 7.40%]")
print(f"cost per insurance bet taken: ${-ins[taken].mean():.4f}")
