import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";

const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const baseURL = process.env.TEST_URL || "http://127.0.0.1:4321";
const reports = [];
try {
  for (const route of [
    "/",
    "/category/reviews/",
    "/articles/frieren-the-journey-is-far-from-over/",
    "/newsletter/",
    "/the-loot/",
  ]) {
    await page.goto(baseURL + route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    reports.push({ route, violations: results.violations });
  }
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Search articles", exact: true })
    .click();
  reports.push({
    route: "/ (search dialog)",
    violations: (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  });
  await mkdir(".cache", { recursive: true });
  await writeFile(
    ".cache/accessibility-report.json",
    JSON.stringify(reports, null, 2),
  );
  let count = 0;
  for (const report of reports) {
    console.log(report.route);
    for (const violation of report.violations) {
      count += violation.nodes.length;
      console.log(
        `  ${violation.id}: ${violation.nodes.length} affected elements`,
      );
      for (const node of violation.nodes.slice(0, 8))
        console.log(`    ${node.target.join(" ")}: ${node.failureSummary}`);
    }
  }
  console.log(
    `${count} WCAG A/AA violations across ${reports.length} page states. Automated checks do not replace manual accessibility review.`,
  );
  process.exitCode = count > 0 ? 1 : 0;
} finally {
  await browser.close();
}
