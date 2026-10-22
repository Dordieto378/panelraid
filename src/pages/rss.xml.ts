import type { APIRoute } from "astro";
import { getArticles } from "../lib/content";
import { articleUrl } from "../lib/types";
const escape = (value: string) =>
  value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );

export const GET: APIRoute = async ({ site }) => {
  const articles = await getArticles();
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Panelraid</title><link>${site}</link><description>Reviews, opinions, analysis, and discussion about anime, manga, and gaming.</description><language>en</language>${articles.map((a) => `<item><title>${escape(a.title)}</title><description>${escape(a.excerpt)}</description><link>${new URL(articleUrl(a), site)}</link><guid isPermaLink="true">${new URL(articleUrl(a), site)}</guid><pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate></item>`).join("")}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
