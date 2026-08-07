# craps-site

A free, no-account, no-ads craps practice table plus strategy content. Static site built
with [Eleventy](https://www.11ty.dev/), deployed to Cloudflare Workers at
https://craps-site.redclayreserve.workers.dev/.

## Stack

Plain Eleventy + vanilla CSS/JS. **No bundler, no framework, no test runner, no linter** —
`package.json` has exactly one dependency (`@11ty/eleventy`). Client-side game code
(`craps.js`) is a plain `<script>` tag, not a module — it can't `import`/`require` anything,
which shapes how shared data gets to it (see "Payout data" below).

```bash
npm run build   # writes to _site/
npm run serve   # eleventy --serve, local dev
```

## File structure

```
src/
  _includes/       base.njk (layout: nav/footer, one copy, never duplicated per page),
                    post.njk (blog/strategy article layout)
  _data/           odds.js — see "Payout data" below
  css/site.css     global design tokens + marketing-page styles
  games/<name>/    one folder per game: index.njk + <name>.css + <name>.js
  strategy/*.md    flat files, frontmatter + prose, rendered via post.njk
  blog/*.md        same pattern as strategy/
  fonts/           self-hosted woff2, passthrough-copied
```

**Adding a new game** (blackjack, roulette, etc.): copy the `src/games/craps/` pattern —
`src/games/<name>/{index.njk, <name>.css, <name>.js}`, each asset added to
`.eleventy.js`'s `addPassthroughCopy` calls same as craps's. If the game has its own
payout/odds numbers, give it its own `src/_data/<name>Odds.js` following the same
isomorphic pattern as `odds.js` (below) — don't hardcode payouts into prose again.
**Name it camelCase, not hyphenated** (`blackjackOdds.js`, not `blackjack-odds.js`):
Eleventy's global data key is the literal filename with no case conversion, so a
hyphenated filename produces a key that's silently unreachable via `{{ blackjackOdds.x }}`
dot notation in templates (Nunjucks/Liquid just render it as empty, no build error —
learned this the hard way wiring up blackjack's odds file).

**Adding content pages**: flat `.md` file in `src/strategy/` or `src/blog/`, frontmatter
`title` + `description` (+ `date` for blog), body is normal Markdown. Both directories are
already wired as Eleventy collections in `.eleventy.js` and list themselves automatically on
their `/strategy/` and `/blog/` index pages — no manual link-adding needed.

`src/games/index.njk` (the Games listing) is NOT collection-driven — it hardcodes the one
Craps card directly. Fine at one game; switch it to loop an Eleventy collection once a second
game ships, so both games list pages work the same way.

## Payout data — always sourced from `src/_data/odds.js`

**Every payout ratio, odds multiplier, and house-edge percentage on the entire site comes
from `src/_data/odds.js`. Never hardcode a number like `9:5`, `7:6`, or `1.41%` directly into
a template, a content page, or craps.js again.**

This file is isomorphic on purpose — `craps.js` runs as a plain browser script (no bundler),
while content pages render via Eleventy in Node, so the same numbers need to reach both:

- Eleventy's data cascade picks it up automatically (it's in `_data/`) and exposes it to
  every template as `odds` — e.g. `{{ odds.trueOddsStr[6] }}` → `"6:5"`. This works in both
  `.njk` files (Nunjucks) and `.md` files (Liquid, Eleventy's default markdown template
  engine) — confirmed working in both.
- `.eleventy.js` also passthrough-copies the exact same file to `/games/craps/odds.js`, and
  `index.njk` loads it as a plain `<script>` tag *before* `craps.js`, so the browser gets
  `window.ODDS` with the identical object. `craps.js` reads `ODDS.trueOdds`, `ODDS.hardPay`,
  etc. directly — no local copies of these constants.

Ratios are stored as `[numerator, denominator]` pairs (matching the shape `craps.js`'s
`payout(amount, ratio)` helper already expects), plus derived `*Str` display versions
(`trueOddsStr`, `placeOddsStr`, `fieldPayStr`, …) computed once from those same arrays — so a
"6:5" string can never drift from the `[6, 5]` array it's actually printed from.

House-edge percentages (`odds.houseEdge.*`) are pre-verified standard figures stored directly
rather than derived from a live probability calculation — they're checked against published
references, and computing them at build time would add real complexity for no accuracy gain.

If you add a new bet type or change a payout, change it once in `odds.js`. Everything else —
the game's own win/loss math, the Bet Reference legend, the how-to-play guide, the strategy
pages, the house-edge blog post — reads from it and updates automatically on the next build.

## Design tokens

Real values from `src/css/site.css` — this is the site's own palette, not any external brand.

**Type**: `DM Serif Display` (headings, self-hosted woff2) + `Inter` (UI/body, self-hosted
variable woff2). No Google Fonts CDN — self-hosted to keep the "no ads, no tracking"
positioning honest.

**Color** (`:root` custom properties):
| Token | Value | Use |
|---|---|---|
| `--bg` / `--bg-deep` | `#0d2117` / `#081810` | page background |
| `--felt` / `--felt-raised` / `--felt-well` | `#14432b` / `#1b4d31` / `#0f3320` | table/card surfaces, light→dark |
| `--gold` / `--gold-bright` / `--gold-deep` | `#caa53c` / `#e6c76b` / `#a8862b` | accent, hover, structural |
| `--gold-grad` | gradient, `#ddb85a → #c8a24a → #a8862b` | primary buttons |
| `--cream` / `--text` / `--text-muted` / `--text-dim` | `#f4eee0` / `#e8e2d2` / `#a8b5a8` / `#7f8f80` | text, light→muted |
| `--win` / `--lose` / `--dont` | `#6fdc8c` / `#ff8a80` / `#d98c5f` | semantic states |

Don't reach for a different palette or an unrelated brand's colors — extend these tokens.

## Voice and tone (content pages)

Match the existing strategy pages (`pass-line-and-odds.md`, `bankroll-management.md`) and the
how-to-play guide: **direct, math-first, no fluff.** Lead with the number or the mechanic, not
a scene-setting intro. Short paragraphs. No hedging ("might," "could potentially") on facts
that are just fixed math — state the house edge, the payout, the rule. Practical takeaway at
the end of every article, usually linking back to the game to practice what was just
explained.

## Deployment

Cloudflare Workers, deployed from `main`. `npm run build` output (`_site/`) is what ships;
`_site/` and `node_modules/` are gitignored, not committed. No CI/test step currently — verify
changes locally (`npm run serve` + a manual playtest) before pushing.
