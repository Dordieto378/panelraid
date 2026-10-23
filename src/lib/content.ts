import { createClient } from "@sanity/client";
import { sampleArticles } from "../data/articles";
import type { Article, Product } from "./types";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "k3trq9dt";
const client = projectId
  ? createClient({
      projectId,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
      apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || "2026-10-01",
      useCdn: false,
      perspective: "published",
      token: import.meta.env.SANITY_API_READ_TOKEN || undefined,
    })
  : null;

const articleQuery = `*[_type == "article" && category in ["Anime", "Manga", "Gaming"] && defined(slug.current) && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())] | order(publishedAt desc) {
  "id": _id, "slug": slug.current, title, topic, excerpt,
  category,
  "image": coalesce(mainImage.asset->url + "?w=1400&auto=format&fit=max&q=85", externalImageUrl),
  "imageAlt": coalesce(mainImage.alt, externalImageAlt),
  "imagePosition": select(defined(mainImage.hotspot) => string(mainImage.hotspot.x * 100) + "% " + string(mainImage.hotspot.y * 100) + "%", "center"),
  "author": coalesce(author->name, "Panelraid Editors"),
  "authorImage": select(defined(author->avatar.asset) => author->avatar.asset->url + "?w=96&h=96&fit=crop&crop=focalpoint&auto=format&q=85" + select(defined(author->avatar.hotspot) => "&fp-x=" + string(author->avatar.hotspot.x) + "&fp-y=" + string(author->avatar.hotspot.y), "")),
  publishedAt, readingMinutes, featured,
  "body": body[]{..., _type == "image" => {
    "url": asset->url + "?w=1200&auto=format&fit=max&q=85",
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }, _type == "articleImage" => {
    "url": image.asset->url + "?w=1200&auto=format&fit=max&q=85",
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }}
}`;

let articlesPromise: Promise<Article[]> | undefined;
export function getArticles(): Promise<Article[]> {
  // Fail a configured CMS build on errors; never silently publish samples over real content.
  return (articlesPromise ??= client
    ? client
        .fetch<Article[]>(articleQuery)
        .then((articles) =>
          articles.length
            ? articles
            : sampleArticles,
        )
    : Promise.resolve(sampleArticles));
}

export function isUsingSampleArticles(articles: Article[]): boolean {
  return articles.some((article) => article.id.startsWith("sample-"));
}

export async function getProducts(): Promise<Product[]> {
  if (!client) return [];
  const products = await client.fetch<
    Product[]
  >(`*[_type == "affiliateProduct" && active == true] | order(_createdAt desc) {
    "id": _id, name, description, "image": image.asset->url + "?w=600&auto=format", "imageAlt": image.alt,
    "url": affiliateUrl, priceLabel, label
  }`);
  return products;
}
