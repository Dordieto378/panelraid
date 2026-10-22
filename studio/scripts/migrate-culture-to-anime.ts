import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-10-01" });
const documents = await client.fetch<Array<{ _id: string; title: string }>>(
  '*[_type == "article" && category == "Culture"]{_id, title}',
);

if (!documents.length) {
  console.log("No Culture articles need migration.");
  process.exit(0);
}

for (const document of documents) {
  await client.patch(document._id).set({ category: "Anime" }).commit();
  console.log(`Moved to Anime: ${document.title}`);
}

console.log(
  `Migration complete (${documents.length} article${documents.length === 1 ? "" : "s"}).`,
);
