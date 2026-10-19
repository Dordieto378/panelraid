# Panelraid design study

Reference: [Crunchyroll News](https://www.crunchyroll.com/news), [Latest News](https://www.crunchyroll.com/news/latest), and [Features](https://www.crunchyroll.com/news/features), consulted October 19, 2026. The reference pages’ indexed content includes category labels, image-led stories, bylines, publication dates, a latest-news feed, and a Top Stories collection. These informed the information hierarchy; Panelraid is an original implementation, not a pixel-identical reproduction.

## Adaptation

| Editorial pattern | Panelraid treatment |
| --- | --- |
| Dense, image-led discovery | One large lead story and two supporting stories |
| Category-oriented browsing | Main navigation, filter buttons, and individual static category pages |
| Latest news plus top stories | Three-column latest feed and a numbered Most read sidebar |
| Clear article context | Category labels, dates, bylines, reading times, full story pages |
| Recognizable publication identity | Original panel-inspired monogram and condensed Panelraid wordmark |

The visual system uses white backgrounds, navy `#14345a`, blue `#2374c9`, and sky `#a8dcff`. Pale blue strips, fine dividers, compact labels, and a restrained corner radius keep the page feeling like an editorial publication. DM Sans provides article and interface text; Barlow Condensed gives the masthead a manga-influenced identity. Fonts are self-hosted.

At wide widths the front page pairs the story feed with a sidebar. The feed drops from three to two columns on smaller screens. Tablet stacks the featured lead above two supporting cards; phones use a collapsible navigation and horizontally scrollable trending topics and filters. Native links and forms work normally; React hydrates search and visible interactive feeds.

## Demo imagery and credits

Anime artwork is existing promotional material used to demonstrate the editorial layout. Rights remain with the relevant creators, publishers, studios, and production committees. Its inclusion does not establish permission for a commercial launch; replace or obtain appropriate rights before publishing a live commercial edition.

| Local image | Source |
| --- | --- |
| `frieren.webp` | [CRHoy, Frieren promotional art](https://crhoy.com/frieren-mas-alla-del-final-del-viaje-el-anime-que-profundiza-la-soledad-y-la-amistad/) |
| `solo-leveling.webp` | [Anime News And Facts, Solo Leveling promotional visual](https://x.com/AniNewsAndFacts/status/1835530825817022506) |
| `apothecary.webp` | [LN News, The Apothecary Diaries visual](https://ln-news.com/articles/120833) |
| `one-piece.webp` | [Cool Style, One Piece promotional visual](https://www.cool-style.com.tw/wd2/archives/1139250) |
| `dandadan.webp` | [Anime Corner, DAN DA DAN visual](https://animecorner.me/dandadan-anime-reveals-new-key-visual-and-trailer/) |
| `demon-slayer.webp` | [GamingTrend, Infinity Castle image](https://gamingtrend.com/reviews/demon-slayer-kimetsu-no-yaiba-infinity-castle-review-gorgeous-garbage/) |
| `jujutsu-kaisen.webp` | [League Funny, Jujutsu Kaisen promotional visual](https://www.league-funny.com/acg/article-251942) |
| `gaming.webp` | [Stardew Valley on Steam, ConcernedApe](https://store.steampowered.com/app/413150/Stardew_Valley/) |
| `manga.webp` | [Senad Palic on Unsplash](https://unsplash.com/photos/books-on-black-wooden-shelf-HkpXmncGReQ), used under the Unsplash license |

`scripts/prepare-images.mjs` downloads and converts these references to WebP and generates 420px and 800px variants. The front page prioritizes the lead image; other images use responsive sizes and deferred loading where appropriate. No image host is contacted by site visitors for the local demo assets.

## Implementation references

- [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro styling and Tailwind](https://docs.astro.build/en/guides/styling/)
- [Sanity JavaScript libraries](https://www.sanity.io/docs/libraries)
- [Sanity Studio subpath hosting](https://www.sanity.io/docs/studio/deployment)
- [Astro static deployment on Netlify](https://docs.astro.build/en/guides/deploy/netlify/)
