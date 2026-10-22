import type { APIRoute } from "astro";
import { getArticles, isUsingSampleArticles } from "../lib/content";

export const GET: APIRoute = async ({ site }) => {
  const articles = await getArticles();
  const usingSampleContent = isUsingSampleArticles(articles);
  return new Response(
    `User-agent: *\n${usingSampleContent ? "Disallow: /" : "Allow: /\nDisallow: /studio/\nDisallow: /newsletter/success/"}\n\nSitemap: ${new URL("sitemap-index.xml", site)}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
