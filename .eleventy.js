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

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
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
