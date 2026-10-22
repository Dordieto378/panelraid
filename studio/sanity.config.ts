import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "k3trq9dt";
if (!projectId)
  throw new Error(
    "Set SANITY_STUDIO_PROJECT_ID in studio/.env before launching the Studio.",
  );

export default defineConfig({
  name: "panelraid",
  title: "Panelraid Editorial",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  basePath: "/",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
