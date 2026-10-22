// @ts-check
import { defineConfig } from "astro/config";

// Served from the GitHub user site (repo adem-max.github.io), so there is no base path.
export default defineConfig({
  site: "https://adem-max.github.io",
  trailingSlash: "ignore",
  // dz-cod was renamed DafterDZ on 22 Oct 2026; keep the old links working.
  redirects: {
    "/work/dz-cod": "/work/dafterdz",
    "/fr/work/dz-cod": "/fr/work/dafterdz",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: { prefixDefaultLocale: false },
  },
});
