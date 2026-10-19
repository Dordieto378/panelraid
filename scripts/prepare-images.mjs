import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

// Demo image sources; see docs/design-research.md for attribution and release notes.
const images = {
  frieren:
    "https://media.hoy.cr/wp-content/uploads/2023/09/Portada-Frieren.png",
  "solo-leveling": "https://pbs.twimg.com/media/GXkdjufaEAAqPpm.jpg",
  apothecary:
    "https://assets.ln-news.com/images/medias/d5ece59c01a6439a94c34f5935eeea5b.jpg",
  "one-piece": "https://cdn-origin.cool-style.com.tw/cool/2024/12/image56.png",
  dandadan: "https://static.animecorner.me/2024/03/1710521884-25497.jpg",
  "demon-slayer":
    "https://gamingtrend.com/content/images/2025/10/Screenshot-2025-10-01-042702.png",
  manga:
    "https://images.unsplash.com/photo-1601639426179-45168809390a?w=1200&q=85",
  gaming:
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg",
  "jujutsu-kaisen": "https://img.league-funny.com/imgur/167965899921_o.png",
};

await mkdir("public/images", { recursive: true });
await Promise.all(
  Object.entries(images).map(async ([name, url]) => {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    const output = await sharp(data)
      .rotate()
      .resize({
        width: name === "frieren" ? 1600 : 1000,
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer();
    await writeFile(`public/images/${name}.webp`, output);
    for (const width of [420, 800]) {
      const responsive = await sharp(data)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 76 })
        .toBuffer();
      await writeFile(`public/images/${name}-${width}.webp`, responsive);
    }
    console.log(`${name}: ${Math.round(output.length / 1024)} KB`);
  }),
);
