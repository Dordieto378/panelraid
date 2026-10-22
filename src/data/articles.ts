import type { PortableTextBlock } from "@portabletext/react";
import type { Article, Category } from "../lib/types";

function block(
  text: string,
  index: number,
  style = "normal",
): PortableTextBlock {
  return {
    _type: "block",
    _key: `block-${index}`,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `span-${index}`, text, marks: [] }],
  };
}

function body(
  title: string,
  excerpt: string,
  category: Category,
): PortableTextBlock[] {
  return [
    block(excerpt, 0),
    block("A closer look", 1, "h2"),
    block(
      `Some stories stay with you long after the credits roll. ${title.replace(/[.!?]$/, "")} is the kind of conversation we love having at Panelraid: one that starts with a small detail and opens up an entirely new way to look at a familiar world.`,
      2,
    ),
    block(
      "The little things make the difference. A quiet pause between scenes, a carefully composed panel, or a soundtrack that knows when to step back can say more than the biggest set piece. That attention to detail is what keeps us coming back.",
      3,
    ),
    block("Why it belongs on your radar", 4, "h2"),
    block(
      `Whether you have been following ${category === "Gaming" ? "the game" : "the series"} for years or are looking for a place to start, there is something here to get excited about. Longtime fans will find plenty to talk about, while newcomers can enjoy the adventure without needing to know every corner of the lore.`,
      5,
    ),
    block(
      "Our advice? Go in with an open mind, give the characters time to surprise you, and save a little room for the unexpected. Sometimes your next favorite is the one you never saw coming.",
      6,
    ),
    block("The Panelraid take", 7, "h2"),
    block(
      "We are here for the stories that spark a conversation. Bring your theories, your favorite moments, and your wildly specific recommendations. There is always room for one more obsession.",
      8,
    ),
    block(
      "This is a fictional sample editorial created for the Panelraid website demonstration.",
      9,
    ),
  ];
}

type Seed = Omit<
  Article,
  "id" | "body" | "publishedAt" | "author" | "readingMinutes"
> & { author?: string; readingMinutes?: number };

const seeds: Seed[] = [
  {
    slug: "frieren-the-journey-is-far-from-over",
    title: "Frieren’s next chapter is everything we’ve been waiting for",
    excerpt:
      "New places, familiar faces, and a little more magic. Here’s why we’re ready to hit the road with Frieren again.",
    category: "Anime",
    image: "/images/frieren.webp",
    imageAlt:
      "Frieren and her companions in a sunlit, flower-filled fantasy landscape",
    imagePosition: "62% center",
    featured: true,
    author: "Hana Mori",
    readingMinutes: 5,
  },
  {
    slug: "solo-leveling-the-shadow-monarch-rises",
    title: "Solo Leveling is about to take things to another level",
    excerpt:
      "The shadow army is growing. We dive into the moments that made Jinwoo’s journey impossible to put down.",
    category: "Anime",
    image: "/images/solo-leveling.webp",
    imageAlt: "Sung Jinwoo surrounded by a luminous purple shadow army",
    imagePosition: "center 32%",
    featured: true,
    author: "Kai Anderson",
  },
  {
    slug: "one-piece-a-new-adventure-awaits",
    title: "One Piece sets sail for its most ambitious adventure yet",
    excerpt:
      "Big dreams and even bigger adventures. The Straw Hats remind us why the journey is the best part.",
    category: "Anime",
    image: "/images/one-piece.webp",
    imageAlt:
      "Luffy and the Straw Hat crew in colorful One Piece promotional artwork",
    imagePosition: "center 27%",
    author: "Alex Chen",
  },
  {
    slug: "dandadan-beautifully-weird",
    title: "DAN DA DAN embraces the weird. And we’re here for it.",
    excerpt:
      "Ghosts, aliens, and a surprising amount of heart. This supernatural adventure never plays it safe.",
    category: "Anime",
    image: "/images/dandadan.webp",
    imageAlt: "Momo and Okarun race through a chaotic supernatural city",
    imagePosition: "center 35%",
    author: "Hana Mori",
  },
  {
    slug: "manga-that-deserve-a-spot-on-your-shelf",
    title: "6 manga that deserve a spot on your shelf this month",
    excerpt:
      "From cozy fantasy to page-turning mysteries, meet your next late-night read.",
    category: "Manga",
    image: "/images/manga.webp",
    imageAlt: "A colorful collection of manga volumes arranged on a bookshelf",
    author: "Sophie Park",
    readingMinutes: 7,
  },
  {
    slug: "demon-slayer-infinity-castle-craft",
    title: "Inside the breathtaking world of the Infinity Castle",
    excerpt:
      "A closer look at the impossible architecture and extraordinary artistry of Demon Slayer.",
    category: "Anime",
    image: "/images/demon-slayer.webp",
    imageAlt:
      "A glowing, intricate labyrinth of rooms inside the Infinity Castle",
    author: "Kai Anderson",
  },
  {
    slug: "next-cozy-game-obsession",
    title: "Your next cozy gaming obsession might surprise you",
    excerpt:
      "Put the quest log down. These slower adventures make space for a different kind of magic.",
    category: "Gaming",
    image: "/images/gaming.webp",
    imageAlt: "A colorful fantasy game landscape with mountains and open skies",
    author: "Alex Chen",
    readingMinutes: 6,
  },
  {
    slug: "jujutsu-kaisen-animation-details",
    title: "The tiny details that make Jujutsu Kaisen hit different",
    excerpt:
      "Breaking down the visual storytelling behind some of our favorite scenes.",
    category: "Anime",
    image: "/images/jujutsu-kaisen.webp",
    imageAlt: "Gojo and Geto amid blue skies and shards of glass",
    imagePosition: "center 24%",
    author: "Sophie Park",
    readingMinutes: 8,
  },
  {
    slug: "weekend-anime-watchlist",
    title: "The weekend watchlist: 5 worlds worth getting lost in",
    excerpt:
      "Clear your schedule. These adventures are worth giving your full attention.",
    category: "Anime",
    image: "/images/apothecary.webp",
    imageAlt: "Maomao in a vibrant historical fantasy garden",
    author: "Sophie Park",
  },
  {
    slug: "art-of-the-manga-panel",
    title: "One perfect panel: how manga makes time stand still",
    excerpt:
      "Sometimes a single page can tell you everything you need to know.",
    category: "Manga",
    image: "/images/manga.webp",
    imageAlt: "Manga books with illustrated spines on a shelf",
    author: "Hana Mori",
    readingMinutes: 6,
  },
  {
    slug: "fantasy-rpg-worlds-to-explore",
    title: "Fantasy RPG worlds we’d happily spend another 100 hours in",
    excerpt:
      "For the explorers, completionists, and people who always take the scenic route.",
    category: "Gaming",
    image: "/images/gaming.webp",
    imageAlt: "An expansive fantasy game world beneath a blue sky",
    author: "Alex Chen",
  },
  {
    slug: "the-art-of-anime-soundtracks",
    title: "Beyond the opening: the anime soundtracks on repeat",
    excerpt: "The music that turns a great scene into an unforgettable one.",
    category: "Anime",
    image: "/images/jujutsu-kaisen.webp",
    imageAlt: "Jujutsu Kaisen characters against a bright blue sky",
    author: "Sophie Park",
  },
];

export const sampleArticles: Article[] = seeds.map((seed, index) => ({
  ...seed,
  topic: (
    {
      "/images/frieren.webp": "Frieren",
      "/images/solo-leveling.webp": "Solo Leveling",
      "/images/apothecary.webp": "The Apothecary Diaries",
      "/images/one-piece.webp": "One Piece",
      "/images/dandadan.webp": "DAN DA DAN",
    } as Record<string, string>
  )[seed.image],
  id: `sample-${index + 1}`,
  author: seed.author || "Hana Mori",
  readingMinutes: seed.readingMinutes || 4,
  publishedAt: new Date(
    Date.UTC(2026, 9, 19, 10, 0) - index * 2 * 3600000,
  ).toISOString(),
  body: body(seed.title, seed.excerpt, seed.category),
}));

