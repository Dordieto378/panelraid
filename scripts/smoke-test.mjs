import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.TEST_URL || "http://127.0.0.1:4321";
await mkdir(".cache/screenshots", { recursive: true });
const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1050 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

async function checkOverflow(width) {
  await page.setViewportSize({ width, height: 1000 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    `Horizontal overflow at ${width}px`,
  );
}

try {
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.screenshot({
    path: ".cache/screenshots/home-desktop.png",
    fullPage: true,
  });
  await page.locator(".feed").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      !document
        .querySelector(".feed")
        .closest("astro-island")
        ?.hasAttribute("ssr"),
  );
  assert.equal(await page.locator("h1").count(), 1);
  assert.match(await page.title(), /Panelraid/);
  assert.equal(
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Reviews", exact: true })
      .count(),
    0,
  );
  assert.equal(await page.locator(".featured-grid .feature-card").count(), 3);
  const featuredArticlePath = await page
    .locator(".featured-grid .feature-card a")
    .first()
    .getAttribute("href");
  assert.ok(featuredArticlePath);
  const initialFeedCount = await page.locator(".feed .article-card").count();
  assert.ok(initialFeedCount > 0 && initialFeedCount <= 6);
  await page.getByRole("button", { name: "Manga", exact: true }).click();
  assert.ok((await page.locator(".feed .article-card").count()) > 0);
  assert.ok(
    (await page.locator(".feed .category-label").allTextContents()).every(
      (c) => c === "Manga",
    ),
  );
  await page.getByRole("button", { name: "All stories", exact: true }).click();
  while (
    (await page.getByRole("button", { name: "Load more stories" }).count()) > 0
  )
    await page.getByRole("button", { name: "Load more stories" }).click();
  assert.ok(
    (await page.locator(".feed .article-card").count()) >= initialFeedCount,
  );
  await page
    .getByRole("button", { name: "Search articles", exact: true })
    .click();
  await page.getByRole("searchbox").fill("Anime");
  assert.ok((await page.locator(".search-results > a").count()) > 0);
  await page.getByRole("searchbox").fill("no-matches-12345");
  assert.ok(await page.locator(".empty-search").isVisible());
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  assert.ok(
    await page
      .getByRole("button", { name: "Search articles", exact: true })
      .evaluate((el) => el === document.activeElement),
  );
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.screenshot({
    path: ".cache/screenshots/home-desktop.png",
    fullPage: true,
  });
  for (const width of [1440, 1024, 768, 760, 390, 320])
    await checkOverflow(width);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: ".cache/screenshots/home-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Open navigation" }).click();
  assert.ok(
    await page.getByRole("navigation", { name: "Main navigation" }).isVisible(),
  );
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Manga", exact: true })
    .click();
  await page.waitForURL("**/category/manga/");
  assert.equal(await page.locator("h1").innerText(), "Manga.");
  await page.goto(`${baseURL}${featuredArticlePath}`, {
    waitUntil: "networkidle",
  });
  await page.locator(".article-tools").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      !document
        .querySelector(".article-tools")
        .closest("astro-island")
        ?.hasAttribute("ssr"),
  );
  await page.getByRole("button", { name: "Save story", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Saved", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".article-tools").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      document
        .querySelector(".article-tools button")
        ?.getAttribute("aria-pressed") === "true",
  );
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await page.screenshot({
    path: ".cache/screenshots/article-mobile.png",
    fullPage: true,
  });
  for (const width of [1440, 768, 390, 320]) await checkOverflow(width);
  await page.goto(`${baseURL}/newsletter/`, { waitUntil: "networkidle" });
  assert.equal(
    await page.locator('form[name="newsletter"]').getAttribute("data-netlify"),
    "true",
  );
  assert.equal(
    await page.getByLabel("Email address").getAttribute("type"),
    "email",
  );
  assert.ok(
    !(await page
      .getByLabel("Email address")
      .evaluate((el) => el.checkValidity())),
  );

  // Crawl the generated static pages and their local links, including CMS-independent routes.
  async function htmlFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const lists = await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? htmlFiles(path.join(directory, entry.name))
          : entry.name.endsWith(".html")
            ? [path.join(directory, entry.name)]
            : [],
      ),
    );
    return lists.flat();
  }
  const files = (await htmlFiles("dist")).filter(
    (file) => !file.includes(`${path.sep}studio${path.sep}`),
  );
  const links = new Set();
  for (const file of files) {
    const html = await readFile(file, "utf8");
    assert.equal(
      (html.match(/<h1(?:\s|>)/g) || []).length,
      1,
      `${file}: exactly one H1`,
    );
    assert.match(html, /rel="canonical"/, `${file}: canonical URL`);
    assert.match(html, /name="description"/, `${file}: meta description`);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g))
      links.add(href);
    for (const [, json] of html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
    ))
      JSON.parse(json);
  }
  for (const link of links) {
    const response = await context.request.get(`${baseURL}${link}`);
    assert.equal(response.status(), 200, `Broken local URL: ${link}`);
  }
  assert.equal(
    (
      await context.request.get(`${baseURL}/page-that-does-not-exist/`)
    ).status(),
    404,
  );
  assert.equal(
    (await context.request.get(`${baseURL}/category/reviews/`)).status(),
    404,
  );
  assert.equal(
    (await context.request.get(`${baseURL}/category/culture/`)).status(),
    404,
  );
  assert.equal(
    (await context.request.get(`${baseURL}/sitemap-index.xml`)).status(),
    200,
  );
  assert.match(
    await (await context.request.get(`${baseURL}/robots.txt`)).text(),
    /Disallow: \//,
  );
  assert.equal(errors.length, 0, `Browser errors: ${errors.join("; ")}`);
  console.log(
    `PASS: ${files.length} static pages, ${links.size} local resources, JSON-LD, responsive layouts, filters, pagination, search, mobile navigation, saved stories, newsletter validation, and 404 behavior.`,
  );
  console.log(
    "Screenshots: .cache/screenshots/home-desktop.png, home-mobile.png, article-mobile.png",
  );
} finally {
  await browser.close();
}
