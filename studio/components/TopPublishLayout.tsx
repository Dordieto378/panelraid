import { PublishIcon } from "@sanity/icons";
import { Button, Card, Flex } from "@sanity/ui";
import { type DocumentLayoutProps, useDocumentOperation } from "sanity";
import { useDocumentPane } from "sanity/structure";

export function TopPublishLayout(props: DocumentLayoutProps) {
  const { documentId, documentType, renderDefault } = props;
  const { publish } = useDocumentOperation(documentId, documentType);
  const { connectionState, validation } = useDocumentPane();
  const hasErrors = validation.some((marker) => marker.level === "error");
  const disabled =
    connectionState !== "connected" || hasErrors || publish.disabled !== false;

  const title = hasErrors
    ? "Fix validation errors before publishing"
    : connectionState !== "connected"
      ? "Waiting for Sanity to connect"
      : publish.disabled === "NO_CHANGES" ||
          publish.disabled === "ALREADY_PUBLISHED"
        ? "This document is already published"
        : "Publish this document";

  return (
    <>
      <Card
        borderBottom
        padding={3}
        style={{ position: "sticky", top: 0, zIndex: 10 }}
      >
        <Flex justify="flex-end">
          <Button
            aria-label="Publish document"
            disabled={disabled}
            icon={PublishIcon}
            onClick={() => publish.execute()}
            text="Publish"
            title={title}
            tone="primary"
          />
        </Flex>
      </Card>
      {renderDefault(props)}
    </>
  );
}
