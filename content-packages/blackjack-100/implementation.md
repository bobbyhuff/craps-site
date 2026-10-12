# Instructions for Claude Code

## Scope
Build ONE article page from article.md; preserve the full, factual copy. Use the existing 0stakes website components, routing, SEO helpers, and The Pit article design. Implement the two specified charts from simulation.json (no fabricated points). Keep it lightweight, accessible, responsive, and fast.

## Required steps
1. Check the repository structure and existing The Pit articles. Determine the correct route and metadata pattern. Avoid scanning irrelevant files.
2. Check that the requested internal links really exist and **correct them** to existing routes (especially the 3:2 vs. 6:5 article and trainer). Do not leave broken links.
3. Integrate `article.md` as actual page content. Render chart-description paragraphs as charts rather than displaying those instructions verbatim to readers. Use content from the source article, not generated rewrites.
4. Create a two-series survival comparison bar and an ending-bankroll histogram from `simulation.json`. Ensure labels and units are accurate and clearly distinguish the base wager. Use existing chart primitives or simple accessible CSS/SVG if available; do not add a heavy chart dependency just for this page.
5. Add article metadata, canonical, social tags, breadcrumbs, and JSON-LD only where existing conventions permit; use real publication date.
6. Add a link to the new article on the existing The Pit index and contextual links where relevant, but avoid other navigation changes.
7. Run the minimal relevant build/tests. Confirm no route breakage, layout overflow, and no incorrect results. Only commit/push the files associated with this request. If pushing triggers production deployment, use the repository's already-approved deployment workflow; otherwise report what needs approval instead of improvising new deployment steps.

## Guardrails
- No content rewrite except fixing a proven error, typo, dead link, or page-design-specific formatting.
- No generated simulation numbers, no unverified house-edge claims, no fabricated timestamps or citations.
- Do not expose simulation Python source on the public site unless project patterns make an explicit methodology/source link appropriate. Keep reproducible source in repo if consistent with conventions.
- `$5` or `$10` is the *initial* wager. Doubles and splits require additional bankroll and are incorporated in simulate.py.
- The stopping threshold is bankroll **below** base wager, not necessarily a balance of zero.
- Do not equate rounds with hours or imply the house edge is measured from these results.
- If repository blackjack rules conflict with our standalone simulation, **preserve disclosed simulation assumptions** and don't suggest it's the identical production game engine.
- Do not make unrelated refactors or install dependencies unless unavoidable.

## Acceptance criteria
- Page works at canonical /the-pit/... route (or existing canonical path conventions if different).
- The Pit index links to it.
- Both charts display exact `simulation.json` values and have text alternatives.
- Headings, tables, FAQ, source notes and responsible-play notice are legible on desktop/mobile.
- Search metadata, links, build/tests pass.
