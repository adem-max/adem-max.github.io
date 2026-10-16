// @ts-check
import { defineConfig } from "astro/config";

// Served from the GitHub user site (repo adem-max.github.io), so there is no base path.
export default defineConfig({
  site: "https://adem-max.github.io",
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
});
