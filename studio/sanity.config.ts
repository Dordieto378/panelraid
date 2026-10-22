import { defineConfig, type DocumentActionComponent } from "sanity";
import { structureTool } from "sanity/structure";
import { TopPublishLayout } from "./components/TopPublishLayout";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "k3trq9dt";
if (!projectId)
  throw new Error(
    "Set SANITY_STUDIO_PROJECT_ID in studio/.env before launching the Studio.",
  );

const topActionCache = new WeakMap<
  DocumentActionComponent,
  DocumentActionComponent
>();

function movePublishToTop(
  publishAction: DocumentActionComponent,
): DocumentActionComponent {
  const cached = topActionCache.get(publishAction);
  if (cached) return cached;

  const PublishAtTop: DocumentActionComponent = (props) => {
    const action = publishAction(props);
    return action ? { ...action, group: ["paneActions"] } : null;
  };
  PublishAtTop.action = publishAction.action;
  PublishAtTop.displayName = "PublishAtTop";
  topActionCache.set(publishAction, PublishAtTop);
  return PublishAtTop;
}

export default defineConfig({
  name: "panelraid",
  title: "Panelraid Editorial",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  basePath: "/",
  plugins: [structureTool()],
  document: {
    actions: (previousActions) =>
      previousActions.map((action) =>
        action.action === "publish" ? movePublishToTop(action) : action,
      ),
    components: {
      unstable_layout: TopPublishLayout,
    },
  },
  schema: { types: schemaTypes },
});
