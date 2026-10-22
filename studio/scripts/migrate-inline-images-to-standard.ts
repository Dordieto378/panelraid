import { getCliClient } from "sanity/cli";

type BodyItem = {
  _key: string;
  _type: string;
  image?: {
    asset?: { _type: "reference"; _ref: string };
    crop?: Record<string, number>;
    hotspot?: Record<string, number>;
  };
  alt?: string;
  caption?: string;
  [key: string]: unknown;
};

const client = getCliClient({ apiVersion: "2026-10-01" });
const documents = await client.fetch<
  Array<{ _id: string; title: string; body: BodyItem[] }>
>(
  '*[_type == "article" && count(body[_type == "articleImage"]) > 0]{_id, title, body}',
);

if (!documents.length) {
  console.log("No custom inline images need migration.");
  process.exit(0);
}

for (const document of documents) {
  const body = document.body.map((item) => {
    if (item._type !== "articleImage" || !item.image?.asset) return item;

    return {
      _key: item._key,
      _type: "image",
      asset: item.image.asset,
      ...(item.image.crop ? { crop: item.image.crop } : {}),
      ...(item.image.hotspot ? { hotspot: item.image.hotspot } : {}),
      ...(item.alt ? { alt: item.alt } : {}),
      ...(item.caption ? { caption: item.caption } : {}),
    };
  });

  await client.patch(document._id).set({ body }).commit();
  console.log(`Restored standard images: ${document.title}`);
}

console.log(
  `Migration complete (${documents.length} document${documents.length === 1 ? "" : "s"}).`,
);
