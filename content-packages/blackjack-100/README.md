# 0stakes blackjack $100 article delivery

This package is ready to give Claude Code for integration. `article.md` is final editorial copy, `metadata.json` SEO data, `simulation.json` the fixed validated scenario aggregates, `simulate.py` a deterministic stdlib-only simulation, `implementation.md` a narrow build specification.

To reproduce: `python simulate.py` from inside this folder. It rewrites `simulation.json` deterministically. The experiments are standalone and not a production-site engine audit. Scenarios are 10,000 sessions each, 100-round cap, initial bankroll $100, base wagers $5 and $10.

Suggested destination in your site's repository: `content-packages/blackjack-100/`.
