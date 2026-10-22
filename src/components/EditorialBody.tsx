import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Article } from "../lib/types";
import { imageSrcSet } from "../lib/images";

function BodyImage({ value }: { value: Record<string, unknown> }) {
  const url = value.url as string | undefined;
  const alt = value.alt as string | undefined;
  const caption = value.caption as string | undefined;
  const width = value.width as number | undefined;
  const height = value.height as number | undefined;

  return url ? (
    <figure className="portable-figure">
      <img
        className="portable-image"
        src={url}
        srcSet={imageSrcSet(url)}
        sizes="(max-width: 800px) 92vw, 740px"
        alt={alt || ""}
        width={width || 1200}
        height={height || 675}
        loading="lazy"
        decoding="async"
      />
      {caption ? (
        <figcaption className="portable-caption">{caption}</figcaption>
      ) : null}
    </figure>
  ) : null;
}

const components: Partial<PortableTextComponents> = {
  types: {
    image: ({ value }) => <BodyImage value={value} />,
    articleImage: ({ value }) => <BodyImage value={value} />,
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href as string | undefined;
      if (!href || !/^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href))
        return <>{children}</>;
      return (
        <a
          href={href}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export default function EditorialBody({ body }: { body: Article["body"] }) {
  return <PortableText value={body} components={components} />;
}
