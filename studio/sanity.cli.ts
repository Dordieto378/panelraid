import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  project: { basePath: "/studio" },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "k3trq9dt",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});
