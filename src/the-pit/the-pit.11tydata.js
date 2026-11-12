// Directory data for every page in src/the-pit/ (replaces the old the-pit.json).
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  layout: "post.njk",
  eleventyComputed: {
    // Per-article share image from tools/make_og_images.py, when one has been generated.
    // base.njk and post.njk fall back to the site-wide /og-image.png otherwise.
    ogImage: (data) => {
      if (data.ogImage) return data.ogImage;
      const slug = data.page && data.page.fileSlug;
      if (!slug) return undefined;
      const file = path.join(__dirname, "..", "img", "og", slug + ".png");
      return fs.existsSync(file) ? "/img/og/" + slug + ".png" : undefined;
    },
  },
};
