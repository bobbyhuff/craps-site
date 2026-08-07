# 0stakes

A free, no-account, no-ads craps and blackjack practice site plus strategy content. Static
site built with [Eleventy](https://www.11ty.dev/). Production domain is `0stakes.com`
(`src/_data/site.js`), registered and pointed at this Cloudflare project. The Workers deploy
itself still serves from the old `craps-site.redclayreserve.workers.dev` host name — see
"Redirects and the domain move" below.

## Stack

Plain Eleventy + vanilla CSS/JS. **No bundler, no framework, no test runner, no linter** —
`package.json` has exactly one dependency (`@11ty/eleventy`). Client-side game code
(`craps.js`, `blackjack.js`) is a plain `<script>` tag, not a module — it can't
`import`/`require` anything, which shapes how shared data gets to it (see "Payout data" below).

```bash
npm run build   # writes to _site/
npm run serve   # eleventy --serve, local dev
```

## File structure

```
src/
  _includes/       base.njk (layout: nav/footer/head, one copy, never duplicated per page),
                    post.njk (Pit/strategy article layout, adds Article schema when `date` is set)
  _data/           odds.js, blackjackOdds.js — see "Payout data" below
  css/site.css     global design tokens + marketing-page styles
  games/<name>/    one folder per game: index.njk + <name>.css + <name>.js
  strategy/*.md    flat files or per-game subfolders, frontmatter + prose, rendered via post.njk
  the-pit/*.md     blog posts, same pattern as strategy/ (renamed from blog/ — see below)
  blog/            redirect stubs only, real posts live in the-pit/ now
  fonts/           self-hosted woff2, passthrough-copied
  favicon.svg, favicon-64.png, icon-512.png, og-image.png — brand assets, passthrough-copied
  _redirects       Cloudflare Pages-format redirect rules, passthrough-copied to _site/_redirects
```

**Adding a new game** (roulette, etc.): copy the `src/games/craps/` pattern —
`src/games/<name>/{index.njk, <name>.css, <name>.js}`, each asset added to
`.eleventy.js`'s `addPassthroughCopy` calls same as craps's/blackjack's. Add
`tags: ["game"]`, `order: <n>`, `cardBlurb`, `status: "live"` to its frontmatter — `games`
is an Eleventy collection (tag-filtered, sorted by `order`), and both `src/games/index.njk`
and the homepage loop it, so a new game's card appears everywhere automatically once tagged.
If the game has its own payout/odds numbers, give it its own `src/_data/<name>Odds.js`
following the same isomorphic pattern as `odds.js` (below) — don't hardcode payouts into
prose again. **Name it camelCase, not hyphenated** (`blackjackOdds.js`, not
`blackjack-odds.js`): Eleventy's global data key is the literal filename with no case
conversion, so a hyphenated filename produces a key that's silently unreachable via
`{{ blackjackOdds.x }}` dot notation in templates (Nunjucks/Liquid just render it as empty,
no build error — learned this the hard way wiring up blackjack's odds file).

**Adding content pages**: flat `.md` file (or nested under a game's `strategy/<game>/`
folder) with frontmatter `title`, `seoTitle`, `description` (+ `date` for Pit posts, +
`breadcrumb` if nested 2+ levels deep — see "SEO frontmatter" below), body is normal
Markdown. `strategy` (recursive) and `pit` are Eleventy collections in `.eleventy.js`.
The top-level `/strategy/` and `/strategy/<game>/` hub pages are hand-authored card/list
links, not collection loops — update them directly when adding an article. `/the-pit/`
does loop its collection automatically.

## SEO frontmatter

Every page needs `seoTitle` (full keyword-first string, e.g. `"Play Free Craps Online: Full
Table with True Odds | 0stakes"`) — this is what actually renders in `<title>`/`og:title`/
`twitter:title`. It's deliberately separate from `title` (the short form, still used for
on-page `<h1>` on pages using `post.njk`) so a long SEO string never leaks into a visible
page heading. `base.njk` does **not** auto-append a brand suffix — every page supplies its
full `seoTitle` string.

`breadcrumb: [{name, url}, ...]` is optional, only needed on pages 2+ levels deep — `base.njk`
renders it as `BreadcrumbList` JSON-LD (always prepending "Home"), gated on the field being
present. `ogType: article` on Pit posts (`post.njk` reads `date` to add `Article` JSON-LD
automatically, no extra field needed for that part). `og:image`/`twitter:image` always point
at `/og-image.png` site-wide — there's no per-page override mechanism, add one if a page
ever needs a distinct share image.

## Payout data — always sourced from `src/_data/odds.js` / `blackjackOdds.js`

**Every payout ratio, odds multiplier, and house-edge percentage on the entire site comes
from the relevant game's odds data file. Never hardcode a number like `9:5`, `7:6`, or
`1.41%` directly into a template, a content page, or a game's `.js` file again.**

These files are isomorphic on purpose — each game's `.js` runs as a plain browser script (no
bundler), while content pages render via Eleventy in Node, so the same numbers need to reach
both:

- Eleventy's data cascade picks each one up automatically (they're in `_data/`) and exposes
  them to every template by filename — `odds.js` → `{{ odds.trueOddsStr[6] }}` → `"6:5"`,
  `blackjackOdds.js` → `{{ blackjackOdds.blackjackPayoutStr }}`. Works in both `.njk`
  (Nunjucks) and `.md` (Liquid) files.
- `.eleventy.js` also passthrough-copies each file to `/games/<name>/odds.js`, and each
  game's `index.njk` loads it as a plain `<script>` tag *before* the game's own script, so
  the browser gets `window.ODDS` with the identical object. Both games' JS reads
  `ODDS.trueOdds`, `ODDS.hardPay`, etc. directly — no local copies of these constants. Reusing
  the same `window.ODDS` global name across games is safe since only one game's script loads
  per page.

Ratios are stored as `[numerator, denominator]` pairs (matching the shape each game's
`payout(amount, ratio)` helper already expects), plus derived `*Str` display versions
computed once from those same arrays — so a "6:5" string can never drift from the `[6, 5]`
array it's actually printed from.

House-edge percentages (`odds.houseEdge.*`) are pre-verified standard figures stored directly
rather than derived from a live probability calculation — they're checked against published
references, and computing them at build time would add real complexity for no accuracy gain.

If you add a new bet type or change a payout, change it once in the relevant odds file.
Everything else — the game's own win/loss math, the Bet Reference legend, the how-to-play
guide, the strategy pages, the house-edge Pit post — reads from it and updates automatically
on the next build.

## Design tokens

Real values from `src/css/site.css` — this is the site's own palette, not any external brand.

**Type**: `DM Serif Display` (headings, self-hosted woff2) + `Inter` (UI/body, self-hosted
variable woff2, also the nav wordmark). No Google Fonts CDN — self-hosted to keep the
"no ads, no tracking" positioning honest.

**Color** (`:root` custom properties):
| Token | Value | Use |
|---|---|---|
| `--bg` / `--bg-deep` / `--felt` / `--felt-raised` / `--felt-well` | `#081810` / `#081810` / `#0e2419` / `#0e2419` / `#081810` | page background, table/card surfaces. `--bg`/`--bg-deep` and `--felt`/`--felt-raised` are intentionally identical pairs — every gradient built from them renders flat automatically |
| `--mint` / `--mint-bright` / `--mint-deep` / `--mint-dim` / `--mint-faint` | `#35d07a` / `#56db92` / `#279c5f` / `rgba(53,208,122,.30)` / `rgba(53,208,122,.12)` | the one accent color — links, primary buttons (flat fill, not a gradient), wins, hover/structural states. Don't introduce a second bright accent |
| `--bone` / `--text` / `--text-muted` / `--text-dim` | `#edf2ee` / `#dce6df` / `#9fb0a6` / `#77887e` | text, light→muted |
| `--win` | `= var(--mint)` | reuses the accent directly, not a separate green |
| `--lose` | `#ff8a80` | the only remaining non-Mint/Bone/Felt color, kept for loss states |
| `--rail` / `--edge` / `--edge-mint` | `#1c4a30` / `rgba(255,255,255,.09)` / `rgba(53,208,122,.30)` | borders/table lines |

Don't reach for a different palette or an unrelated brand's colors — extend these tokens.
Button/chip text on a Mint fill uses `#081810` (Felt), not black — check contrast in-browser
if you add a new filled component. Playing-card ink (`blackjack.css`'s `--pcard-ink-black`,
`#1a1206`) is a deliberate exception — it's card-stock ink, not a UI color, and stays
near-black regardless of the brand accent.

**Brand mark**: the ring/chip icon (two circles, one dashed to form radiating ticks — see
`base.njk`'s inlined nav SVG) doubles as the "0" in "0stakes"; the nav renders it next to
"STAKES" text, not the literal digit. Everywhere the brand appears as plain text (titles,
meta, prose, the domain itself) uses the literal string "0stakes" — the icon substitution is
visual-only, never spelled out as "0STAKES" in running text.

## Voice and tone (content pages)

Match the existing strategy pages (`pass-line-and-odds.md`, `bankroll-management.md`) and the
how-to-play guide: **direct, math-first, no fluff.** Lead with the number or the mechanic, not
a scene-setting intro. Short paragraphs. No hedging ("might," "could potentially") on facts
that are just fixed math — state the house edge, the payout, the rule. Practical takeaway at
the end of every article, usually linking back to the game to practice what was just
explained. No em dashes in generated copy (an explicit standing preference for this project).

## Redirects and the domain move

`src/_redirects` (Cloudflare `_redirects` syntax, one rule per line) is passthrough-copied to
`_site/_redirects`. **Confirmed working**: this deploys as a Cloudflare Workers project (via
Wrangler, `workers/scripts/craps-site`) with static assets, and Wrangler validates
`_redirects` at deploy time — strictly. It hard-fails the whole deploy on any duplicate source
path (learned this shipping the domain-migration rules: had intentionally overlapping
same-host and cross-host rules for the same 4 paths as "harmless," which isn't true — deploy
just rejects it outright with `code: 100324`). **Every source path in this file must be
unique**, no exceptions, no "first rule wins" leniency to lean on.

`0stakes.com` is registered and pointed at this same Cloudflare project (confirmed, not
hypothetical) — meaning **both the old host and 0stakes.com serve this exact same
`_redirects` file, and rules match on path only, with no way to condition on which hostname
the request came in on.** Learned this the hard way: an earlier version of this file had a
rule for every URL shaped `/games/craps/ -> https://0stakes.com/games/craps/`, intended to
migrate old-host visitors to the new domain. Once 0stakes.com started serving the same file,
those rules matched 0stakes.com's own requests too — a request to
`https://0stakes.com/games/craps/` matched the rule and got redirected to
`https://0stakes.com/games/craps/`, the exact URL it was already on. Infinite redirect loop,
on production, immediately.

**The fix, and the rule going forward: only add a redirect whose destination path differs
from its source path.** `/blog/ -> https://0stakes.com/the-pit/` is safe on any host that
serves this file, because `/the-pit/` is never itself a redirect source — it's real content,
so the chain always terminates in one hop regardless of which domain served the request.
`/games/craps/ -> https://0stakes.com/games/craps/` is never safe here, on any host, because
the moment both hostnames point at the same deployment (as they do now) it becomes a
same-path loop on the new domain. A real cross-host "migrate every URL to the new domain"
redirect needs to be host-conditional, which the shared `_redirects` file cannot express —
that has to be a Cloudflare dashboard-level Redirect Rule scoped to the old hostname
specifically, not something this repo can encode.

Also: **do not add a redirect rule for a path that also has a real page in this same
build** (e.g. `/about/`) — Cloudflare applies `_redirects` before serving static assets, so a
same-path redirect rule silently hijacks the real page regardless of the loop question above.

`base.njk`'s `redirectTo` frontmatter mechanism (client-side meta-refresh + its own canonical
tag) still exists as a fallback on 4 stub pages (`src/blog/index.njk` and its two post stubs,
`src/strategy/pass-line-and-odds.njk`) in case `_redirects` ever stops being honored. Now that
`_redirects` is confirmed live and correct, these are redundant — safe to delete along with
the `redirectTo` conditional in `base.njk` in a follow-up pass; not urgent since they don't
conflict with anything.

## Deployment

Cloudflare Workers (`workers/scripts/craps-site`), deployed from `main` via Wrangler, with
`0stakes.com` registered and pointed at the same project. `npm run build` output (`_site/`)
is what ships, including `_redirects` — Wrangler validates it strictly at deploy time (see
"Redirects and the domain move"), so a bad `_redirects` line fails the whole deploy, not just
the redirect. `_site/` and `node_modules/` are gitignored, not committed. No CI/test step
currently — verify changes locally (`npm run serve` + a manual playtest) before pushing.
