module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  });

  // ISO 8601 date for structured data (schema.org datePublished).
  eleventyConfig.addFilter("dateToISO", (dateObj) => {
    if (!dateObj) return "";
    return new Date(dateObj).toISOString().slice(0, 10);
  });

  // Horizontal bar chart for Pit articles. Body is JSON:
  //   {% barchart %}{"title": "...", "caption": "...", "rows": [{"label": "...", "value": 5.41, "text": "-5.41%", "tone": "lose"}]}{% endbarchart %}
  // Bars scale to the largest |value| (or "max" if given). Every value is also printed as
  // text, so the bars are decorative and the chart reads fine in a screen reader.
  // Output has no indentation or blank lines so Markdown passes it through as raw HTML.
  eleventyConfig.addPairedShortcode("barchart", (body) => {
    const spec = JSON.parse(body);
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const max = spec.max || Math.max(...spec.rows.map((r) => Math.abs(r.value)));
    const rows = spec.rows.map((r) => {
      const pct = max && r.value ? Math.max(0.5, (Math.abs(r.value) / max) * 100) : 0;
      const tone = r.tone ? ` pc-bar-${esc(r.tone)}` : "";
      return `<div class="pc-row"><span class="pc-label">${esc(r.label)}</span><span class="pc-track" aria-hidden="true"><span class="pc-bar${tone}" style="width:${pct.toFixed(1)}%"></span></span><span class="pc-val">${esc(r.text != null ? r.text : r.value)}</span></div>`;
    }).join("");
    const cap = spec.caption ? `<figcaption>${esc(spec.caption)}</figcaption>` : "";
    return `<figure class="pit-chart"><div class="pc-title">${esc(spec.title)}</div>${rows}${cap}</figure>`;
  });

  // --- Related-article helpers -------------------------------------------------------
  // Every article belongs to one group: a game ("craps", "video-poker", ...), "industry",
  // or "general". Pit posts say so in frontmatter (`game:` / `topic:`); strategy pages get
  // it from their folder (/strategy/<game>/<slug>/). Used by post.njk ("Keep reading"),
  // the game pages and the strategy hubs, so a new article is linked from everywhere that
  // should link it without hand-editing lists.
  const groupOf = (item) => {
    const d = item.data || {};
    if (d.game) return d.game;
    if (d.topic) return d.topic;
    const m = /^\/strategy\/([^/]+)\/[^/]+\/$/.exec(item.url || "");
    return m ? m[1] : "general";
  };
  const isPit = (item) => (item.url || "").startsWith("/the-pit/");
  const newestFirst = (a, b) => (b.data.updated || b.date) - (a.data.updated || a.date);

  // Articles in the same group as `url`, excluding itself. Strategy guides first, then Pit
  // posts, newest first within each. Falls back to the newest Pit posts so no article is a
  // dead end.
  eleventyConfig.addFilter("relatedArticles", (items, url, limit = 6) => {
    const self = items.find((i) => i.url === url);
    if (!self) return [];
    const group = groupOf(self);
    const others = items.filter((i) => i.url !== url && !i.data.redirectTo);
    let same = others.filter((i) => groupOf(i) === group);
    same = same.filter((i) => !isPit(i)).sort(newestFirst).concat(same.filter(isPit).sort(newestFirst));
    if (same.length < 3) {
      const fill = others.filter((i) => isPit(i) && !same.includes(i)).sort(newestFirst);
      same = same.concat(fill);
    }
    return same.slice(0, limit);
  });

  // Every article for one game key, split for the game pages and strategy hubs.
  eleventyConfig.addFilter("gameArticles", (items, game, kind) =>
    items
      .filter((i) => groupOf(i) === game && !i.data.redirectTo && (kind === "pit" ? isPit(i) : !isPit(i)))
      .sort(newestFirst)
  );

  // Group key of the page at `url` ("" when it has none or is "general").
  eleventyConfig.addFilter("articleGroup", (items, url) => {
    const self = items.find((i) => i.url === url);
    const g = self ? groupOf(self) : "";
    return g === "general" ? "" : g;
  });

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");
  // Accounts + wallet. supabase-js is self-hosted from node_modules (same no-third-party
  // stance as the fonts), not loaded from a CDN.
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({ "node_modules/@supabase/supabase-js/dist/umd/supabase.js": "js/supabase.js" });
  eleventyConfig.addPassthroughCopy("src/games/craps/craps.css");
  eleventyConfig.addPassthroughCopy("src/games/craps/craps.js");
  // Same file Eleventy reads as the `odds` global data object, also published
  // as a plain script so craps.js can load the identical numbers in the browser.
  eleventyConfig.addPassthroughCopy({ "src/_data/odds.js": "games/craps/odds.js" });
  eleventyConfig.addPassthroughCopy("src/games/blackjack/blackjack.css");
  eleventyConfig.addPassthroughCopy("src/games/blackjack/blackjack.js");
  eleventyConfig.addPassthroughCopy({ "src/_data/blackjackOdds.js": "games/blackjack/odds.js" });
  eleventyConfig.addPassthroughCopy("src/games/blackjack/trainer.js");
  // Same file Eleventy reads as the `blackjackStrategy` global data object
  // (basic-strategy.njk), also published as a plain script so the trainer's
  // client-side JS reads the identical decision table -- one source of truth.
  eleventyConfig.addPassthroughCopy({ "src/_data/blackjackStrategy.js": "games/blackjack/strategy.js" });
  eleventyConfig.addPassthroughCopy("src/games/roulette/roulette.css");
  eleventyConfig.addPassthroughCopy("src/games/roulette/roulette.js");
  eleventyConfig.addPassthroughCopy({ "src/_data/rouletteOdds.js": "games/roulette/odds.js" });
  eleventyConfig.addPassthroughCopy("src/games/baccarat/baccarat.css");
  eleventyConfig.addPassthroughCopy("src/games/baccarat/baccarat.js");
  eleventyConfig.addPassthroughCopy({ "src/_data/baccaratOdds.js": "games/baccarat/odds.js" });
  // Crapless Craps reuses craps.js/craps.css; only its odds file is new.
  // craplessOdds.js builds on odds.js, so the page loads both.
  eleventyConfig.addPassthroughCopy({ "src/_data/craplessOdds.js": "games/crapless-craps/odds.js" });
  // Shared card-game assets (video poker, three card poker, pai gow).
  eleventyConfig.addPassthroughCopy("src/games/shared");
  eleventyConfig.addPassthroughCopy("src/games/video-poker/video-poker.css");
  eleventyConfig.addPassthroughCopy("src/games/video-poker/video-poker.js");
  eleventyConfig.addPassthroughCopy("src/games/video-poker/vp-engine.js");
  eleventyConfig.addPassthroughCopy({ "src/_data/videoPokerOdds.js": "games/video-poker/odds.js" });
  eleventyConfig.addPassthroughCopy("src/games/three-card-poker/three-card-poker.css");
  eleventyConfig.addPassthroughCopy("src/games/three-card-poker/three-card-poker.js");
  eleventyConfig.addPassthroughCopy("src/games/three-card-poker/tcp-engine.js");
  eleventyConfig.addPassthroughCopy({ "src/_data/threeCardPokerOdds.js": "games/three-card-poker/odds.js" });
  eleventyConfig.addPassthroughCopy("src/games/pai-gow-poker/pai-gow-poker.css");
  eleventyConfig.addPassthroughCopy("src/games/pai-gow-poker/pai-gow-poker.js");
  eleventyConfig.addPassthroughCopy("src/games/pai-gow-poker/pg-engine.js");
  eleventyConfig.addPassthroughCopy({ "src/_data/paiGowOdds.js": "games/pai-gow-poker/odds.js" });
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-64.png");
  eleventyConfig.addPassthroughCopy("src/icon-512.png");
  eleventyConfig.addPassthroughCopy("src/og-image.png");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  eleventyConfig.addCollection("strategy", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/strategy/**/*.md")
  );
  eleventyConfig.addCollection("pit", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/the-pit/*.md").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("games", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/games/*/index.njk")
      .filter(p => (p.data.tags || []).includes("game"))
      .sort((a, b) => a.data.order - b.data.order)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
