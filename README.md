# Panelraid

A light, blue-accented anime and manga publication inspired by the editorial structure of Crunchyroll News. Built with **Astro, TypeScript, React islands, Tailwind CSS, and Sanity**, with a static **Netlify** deployment configuration.

## Run locally

Use Node **22.19 or newer** (Node 22 LTS recommended).

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321`. The complete sample site runs without external credentials.

### Laragon: panelraid.test

The root `.htaccess` serves the built site from `dist/` at `http://panelraid.test/`, including article pages and assets. Apache must allow overrides and have `mod_rewrite` enabled (Laragon's default configuration does). No Node server needs to stay running for this built preview.

Run `npm run build` after editing the source to update `panelraid.test`. For live updates while developing, use `npm run dev` and open `http://127.0.0.1:4321` instead. These local Apache rules do not change the Netlify deployment.

```sh
npm run check       # Astro + TypeScript, including CMS schemas
npm run build       # Static site in dist; Studio included when configured
npm run preview     # Preview the production build
npm run test:smoke  # Browser and static-route checks against the running preview
npm run test:a11y   # WCAG A/AA audit of key pages and the search modal
```

On Windows, browser checks use installed Microsoft Edge. On other platforms, install Playwright Chromium with `npx playwright install chromium` first. Use `TEST_URL` to override the default preview URL. QA screenshots are written to `.cache/screenshots/`.

## What’s included

- Responsive front page with a featured story grid, trending topics, latest stories, most-read sidebar, and reviews.
- Sixteen fictional articles, full article pages, and five category archives.
- React search with a keyboard-accessible modal, category filters, pagination, browser-local saved stories, and copy-link sharing.
- Sanity Studio schemas for articles, reviews, authors, and affiliate products. Published Sanity content replaces the sample content when configured.
- The Loot recommendations page with affiliate link attributes and disclosure.
- Newsletter form prepared for Netlify Forms, confirmation route, honeypot, and native email validation.
- Canonical URLs, Open Graph/Twitter metadata, article JSON-LD, XML sitemap, RSS, robots.txt, and a custom 404.
- Local WebP images with responsive variants, self-hosted fonts, minimal React islands, deferred below-fold images, and cache headers.

## Connect Sanity

1. Create a Sanity project and a `production` dataset in [Sanity Manage](https://www.sanity.io/manage). A public dataset needs no read token. For a private dataset, provide a read-only token as `SANITY_API_READ_TOKEN` in the build environment only.
2. Copy `.env.example` to `.env`. Set `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, and your real `SITE_URL`. Set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` to the same values.
3. For local Studio development, copy `studio/.env.studio.example` to `studio/.env` and set the same project and dataset. Run `npm run studio`, then visit `http://localhost:3333/studio`.
4. Add `http://localhost:3333`, `http://127.0.0.1:3333`, and your production origin to the project’s CORS origins as appropriate. Allow credentials for Studio origins that require Sanity login.
5. Create an author, then an article or review. Give it a unique slug, cover image with alt text, excerpt, publication date, body, and reading time. Enable **Feature on homepage** for lead stories. The **Short topic name** powers the trending bar.
6. Publish and rebuild. Configured CMS fetch failures fail the build; they never silently replace real content with samples. A configured, empty dataset displays an empty publication.

When the Sanity environment variables are available, `npm run build` includes the authenticated Studio at `/studio/`. Its authentication and permissions are enforced by Sanity. No write token is embedded in the site.

## Deploy to Netlify

1. Push this project to your Git provider and import that repository into Netlify.
2. Keep the settings from `netlify.toml`: build `npm run check && npm run build`, publish `dist`, Node 22.
3. Set `SITE_URL` to the final HTTPS site URL. Add the Sanity environment variables from above. Netlify’s `URL` environment variable is also used when `SITE_URL` is absent.
4. Enable Netlify Forms detection before deploying if you want newsletter submissions. Submissions appear in Netlify Forms. Connect an email provider or export subscribers to send newsletters; this project does not send mail by itself.
5. Enable automatic Git deployments. Create a Netlify build hook and register it as a Sanity webhook for **create, update, and delete** events with this filter:

   ```groq
   _type in ["article", "review", "affiliateProduct", "author"] && !(_id in path("drafts.**"))
   ```

   Use the generated build-hook URL as the webhook URL and POST as the method. Keep this URL private. Sanity publish events then rebuild the static site. Future-dated stories also need a build at or after the scheduled time; configure a scheduled Netlify build separately if needed.

The repository is prepared for Netlify; no remote Sanity project, Git repository, Netlify account, or deployment has been created by this build.

## Before the live editorial launch

- Add real published CMS content. Sample mode deliberately sends `noindex` and disallows crawlers; configuring Sanity switches to indexable published content.
- Use a real production `SITE_URL`; the `.example` fallback is intentionally a placeholder.
- Replace or license demonstration promotional artwork and review the source credits in [design research](docs/design-research.md).
- Supply your organization’s final privacy notice, subscriber handling process, editorial contacts, and legal information before collecting email addresses.
- Studio validates that slugs are unique across articles and reviews. Treat published slugs as stable; add Netlify redirects if they change.

## Structure

```text
src/components/       Static Astro pieces and small React islands
src/data/             Fictional sample content
src/layouts/          Site shell and SEO metadata
src/lib/              Shared types, CMS queries, image helpers
src/pages/            Statically generated routes and feeds
src/styles/           Tailwind theme and editorial design system
studio/               Sanity Studio configuration and document schemas
public/images/        Optimized local demonstration assets
scripts/              Studio build, image preparation, browser checks
```

See [design-research.md](docs/design-research.md) for the reference study and design decisions.
