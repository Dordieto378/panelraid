import { spawnSync } from "node:child_process";
import { finalizeStudio } from "./finalize-studio.mjs";

try {
  process.loadEnvFile(".env");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

if (
  !process.env.PUBLIC_SANITY_PROJECT_ID &&
  !process.env.SANITY_STUDIO_PROJECT_ID
) {
  console.log(
    "Sample mode: Sanity Studio build skipped. Set your Sanity project ID to enable the CMS.",
  );
  process.exit(0);
}
const env = {
  ...process.env,
  SANITY_STUDIO_PROJECT_ID:
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.PUBLIC_SANITY_PROJECT_ID,
  SANITY_STUDIO_DATASET:
    process.env.SANITY_STUDIO_DATASET ||
    process.env.PUBLIC_SANITY_DATASET ||
    "production",
};
const result = spawnSync(
  process.execPath,
  ["../node_modules/sanity/bin/sanity", "build", "../dist/studio"],
  { cwd: "studio", env, stdio: "inherit" },
);
if (result.status !== 0) process.exit(result.status ?? 1);
await finalizeStudio("dist/studio");
