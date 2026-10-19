import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Article } from "../lib/types";

const components: Partial<PortableTextComponents> = {
  types: {
    image: ({ value }) =>
      value.url ? (
        <figure>
          <img
            className="portable-image"
            src={value.url}
            alt={value.alt || ""}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ) : null,
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
