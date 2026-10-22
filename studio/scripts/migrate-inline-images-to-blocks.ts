import { getCliClient } from "sanity/cli";

type BodyItem = {
  _key: string;
  _type: string;
  asset?: { _type: "reference"; _ref: string };
  crop?: Record<string, number>;
  hotspot?: Record<string, number>;
  alt?: string;
  caption?: string;
  [key: string]: unknown;
};

const client = getCliClient({ apiVersion: "2026-10-01" });
const documents = await client.fetch<
  Array<{ _id: string; title: string; body: BodyItem[] }>
>(
  '*[_type == "article" && count(body[_type == "image"]) > 0]{_id, title, body}',
);

if (!documents.length) {
  console.log("No legacy inline images need migration.");
  process.exit(0);
}

for (const document of documents) {
  const body = document.body.map((item) => {
    if (item._type !== "image" || !item.asset) return item;

    return {
      _key: item._key,
      _type: "articleImage",
      image: {
        _type: "image",
        asset: item.asset,
        ...(item.crop ? { crop: item.crop } : {}),
        ...(item.hotspot ? { hotspot: item.hotspot } : {}),
      },
      alt: item.alt || document.title,
      ...(item.caption ? { caption: item.caption } : {}),
    };
  });

  await client.patch(document._id).set({ body }).commit();
  console.log(`Migrated inline images: ${document.title}`);
}

console.log(
  `Migration complete (${documents.length} document${documents.length === 1 ? "" : "s"}).`,
);
