import type { PortableTextBlock } from "@portabletext/react";

export const categories = [
  "All",
  "Anime",
  "Manga",
  "Gaming",
] as const;
export type Category = Exclude<(typeof categories)[number], "All">;

export interface Article {
  id: string;
  slug: string;
  title: string;
  topic?: string;
  excerpt: string;
  category: Category;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  author: string;
  authorImage?: string;
  publishedAt: string;
  readingMinutes: number;
  featured?: boolean;
  body: PortableTextBlock[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  url: string;
  priceLabel: string;
  label?: string;
}

export type ArticleSummary = Omit<Article, "body">;
export function articleSummaries(articles: Article[]): ArticleSummary[] {
  return articles.map(({ body: _body, ...summary }) => summary);
}

export function articleUrl(article: Pick<Article, "slug">) {
  return `/articles/${article.slug}/`;
}

export function shortDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(date));
}
