import type { APIRoute } from "astro";
import { usingSampleContent } from "../lib/content";

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\n${usingSampleContent ? "Disallow: /" : "Allow: /\nDisallow: /studio/\nDisallow: /newsletter/success/"}\n\nSitemap: ${new URL("sitemap-index.xml", site)}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
