import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-10-01" });
const documents = await client.fetch<
  Array<{
    _id: string;
    title: string;
    externalImageUrl: string;
    externalImageAlt?: string;
  }>
>(`*[
  _type == "article" &&
  defined(externalImageUrl) &&
  !defined(mainImage.asset)
]{_id, title, externalImageUrl, externalImageAlt}`);

if (!documents.length) {
  console.log("No external cover images need migration.");
  process.exit(0);
}

for (const document of documents) {
  const response = await fetch(document.externalImageUrl, {
    headers: {
      Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      "User-Agent": "Mozilla/5.0 (compatible; Panelraid/1.0)",
    },
    redirect: "follow",
  });
  if (!response.ok)
    throw new Error(
      `Could not download ${document.externalImageUrl} (${response.status}).`,
    );

  const pathname = new URL(response.url).pathname;
  const filename = pathname.split("/").at(-1) || "article-cover";
  const asset = await client.assets.upload(
    "image",
    Buffer.from(await response.arrayBuffer()),
    {
      filename,
      contentType: response.headers.get("content-type") || undefined,
    },
  );

  await client
    .patch(document._id)
    .set({
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: document.externalImageAlt || document.title,
      },
    })
    .unset(["externalImageUrl", "externalImageAlt"])
    .commit();

  console.log(`Migrated cover image: ${document.title}`);
}

console.log(`Migration complete (${documents.length} cover image${documents.length === 1 ? "" : "s"}).`);
