module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  });

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/games/craps/craps.css");
  eleventyConfig.addPassthroughCopy("src/games/craps/craps.js");
  // Same file Eleventy reads as the `odds` global data object, also published
  // as a plain script so craps.js can load the identical numbers in the browser.
  eleventyConfig.addPassthroughCopy({ "src/_data/odds.js": "games/craps/odds.js" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addCollection("strategy", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/strategy/**/*.md")
  );
  eleventyConfig.addCollection("pit", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/the-pit/*.md").sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
