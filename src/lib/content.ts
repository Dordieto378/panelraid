import { createClient } from "@sanity/client";
import { sampleArticles, sampleProducts } from "../data/articles";
import type { Article, Product } from "./types";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
export const usingSampleContent = !projectId;
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

const articleQuery = `*[_type in ["article", "review"] && defined(slug.current) && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now())] | order(publishedAt desc) {
  "id": _id, "slug": slug.current, title, topic, excerpt,
  "category": select(_type == "review" => "Reviews", category),
  "image": mainImage.asset->url + "?w=1400&auto=format&fit=max&q=85",
  "imageAlt": mainImage.alt,
  "imagePosition": select(defined(mainImage.hotspot) => string(mainImage.hotspot.x * 100) + "% " + string(mainImage.hotspot.y * 100) + "%", "center"),
  "author": coalesce(author->name, "Panelraid Editors"),
  publishedAt, readingMinutes, featured, defined(score) => {score},
  "body": body[]{..., _type == "image" => {"url": asset->url + "?w=1200&auto=format&fit=max"}}
}`;

let articlesPromise: Promise<Article[]> | undefined;
export function getArticles(): Promise<Article[]> {
  // Fail a configured CMS build on errors; never silently publish samples over real content.
  return (articlesPromise ??= client
    ? client.fetch<Article[]>(articleQuery)
    : Promise.resolve(sampleArticles));
}

export async function getProducts(): Promise<Product[]> {
  if (!client) return sampleProducts;
  return client.fetch<
    Product[]
  >(`*[_type == "affiliateProduct" && active == true] | order(_createdAt desc) {
    "id": _id, name, description, "image": image.asset->url + "?w=600&auto=format", "imageAlt": image.alt,
    "url": affiliateUrl, priceLabel, label
  }`);
}
