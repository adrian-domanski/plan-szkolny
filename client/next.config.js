const withPlugins = require("next-compose-plugins");
const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const withImages = require("next-images");
const withTM = require("next-transpile-modules")(["next-with-apollo"]);
const withPWA = require("next-pwa");

module.exports = withPlugins([
  withTM,
  withCSS,
  withSass,
  withImages,
  withPWA,
  {
    pwa: {
      dest: "public",
      cleanupOutdatedCaches: true,
    },
  },
]);
