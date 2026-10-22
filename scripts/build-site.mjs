import { spawnSync } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  rename,
  rm,
} from "node:fs/promises";
import { join, resolve } from "node:path";

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

await mkdir(".cache", { recursive: true });
const temporaryDirectory = await mkdtemp(
  resolve(".cache", "studio-preserve-"),
);
const studioDirectory = resolve("dist", "studio");
const preservedStudio = join(temporaryDirectory, "studio");
const hadStudio = await exists(studioDirectory);

if (hadStudio) await rename(studioDirectory, preservedStudio);

let status = 1;
try {
  const result = spawnSync(
    process.execPath,
    [resolve("node_modules", "astro", "astro.js"), "build"],
    { env: process.env, stdio: "inherit" },
  );
  status = result.status ?? 1;
} finally {
  if (hadStudio && (await exists(preservedStudio))) {
    await mkdir(resolve("dist"), { recursive: true });
    await rm(studioDirectory, { recursive: true, force: true });
    await rename(preservedStudio, studioDirectory);
  }
  await rm(temporaryDirectory, { recursive: true, force: true });
}

process.exit(status);
