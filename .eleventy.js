module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  });

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/games/craps/craps.css");
  eleventyConfig.addPassthroughCopy("src/games/craps/craps.js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addCollection("strategy", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/strategy/*.md")
  );
  eleventyConfig.addCollection("blog", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
