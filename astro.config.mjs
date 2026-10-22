import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.SITE_URL || "https://panelraid.com",
  output: "static",
  trailingSlash: "always",
  integrations: [
    react(),
    sitemap({ filter: (page) => !page.includes("/newsletter/success/") }),
  ],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
