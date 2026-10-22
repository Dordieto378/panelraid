import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import type { SanityDocumentStub } from "@sanity/client";
import { getCliClient } from "sanity/cli";
import { sampleArticles } from "../../src/data/articles.ts";

const client = getCliClient({ apiVersion: "2026-10-01" });

const documentId = (prefix: string, value: string) =>
  `${prefix}-${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

const slugs = sampleArticles.map((article) => article.slug);
const existing = await client.fetch<Array<{ slug: string }>>(
  '*[_type == "article" && slug.current in $slugs]{"slug": slug.current}',
  { slugs },
);
const existingSlugs = new Set(existing.map((document) => document.slug));
const articlesToCreate = sampleArticles.filter(
  (article) => !existingSlugs.has(article.slug),
);

if (!articlesToCreate.length) {
  console.log("All Panelraid sample stories already exist. Nothing to import.");
  process.exit(0);
}

const authors = [...new Set(articlesToCreate.map((article) => article.author))];
await Promise.all(
  authors.map((name) =>
    client.createIfNotExists({
      _id: documentId("panelraid-author", name),
      _type: "author",
      name,
      bio: `A member of the Panelraid editorial team covering anime, manga, games, and fandom culture.`,
    }),
  ),
);

const uploadedImages = new Map<string, string>();
let created = 0;

for (const article of articlesToCreate) {
  let assetId = uploadedImages.get(article.image);
  if (!assetId) {
    const filename = article.image.split("/").at(-1);
    if (!filename) throw new Error(`Invalid image path: ${article.image}`);

    const asset = await client.assets.upload(
      "image",
      createReadStream(resolve("..", "public", "images", filename)),
      { filename },
    );
    assetId = asset._id;
    uploadedImages.set(article.image, assetId);
  }

  const document: SanityDocumentStub = {
    _id: documentId("panelraid-sample", article.slug),
    _type: "article",
    title: article.title,
    topic: article.topic,
    slug: { _type: "slug", current: article.slug },
    excerpt: article.excerpt,
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
      alt: article.imageAlt,
    },
    author: {
      _type: "reference",
      _ref: documentId("panelraid-author", article.author),
    },
    publishedAt: article.publishedAt,
    readingMinutes: article.readingMinutes,
    featured: article.featured ?? false,
    body: article.body,
    category: article.category,
  };
  await client.create(document);

  created += 1;
  console.log(`Created ${created}/${articlesToCreate.length}: ${article.title}`);
}

console.log(
  `Import complete: ${created} stories created, ${existingSlugs.size} existing stories skipped.`,
);
