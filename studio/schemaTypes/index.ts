import { defineArrayMember, defineField, defineType } from "sanity";

const image = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        validation: (rule) => rule.required(),
        description:
          "Describe the image for readers using assistive technology.",
      }),
    ],
    validation: (rule) => rule.required(),
  });

const editorialFields = [
  defineField({
    name: "title",
    type: "string",
    validation: (rule) => rule.required().max(120),
  }),
  defineField({
    name: "topic",
    title: "Short topic name",
    type: "string",
    description: "Used in the trending bar, for example Frieren.",
    validation: (rule) => rule.max(35),
  }),
  defineField({
    name: "slug",
    type: "slug",
    options: {
      source: "title",
      maxLength: 96,
      isUnique: async (slug, context) => {
        const id = context.document?._id.replace(/^drafts\./, "") || "";
        return context
          .getClient({ apiVersion: "2026-10-01" })
          .fetch<boolean>(
            'count(*[_type in ["article", "review"] && slug.current == $slug && !(_id in [$id, $draftId])]) == 0',
            { slug, id, draftId: `drafts.${id}` },
          );
      },
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "excerpt",
    type: "text",
    rows: 3,
    validation: (rule) => rule.required().max(250),
  }),
  image("mainImage", "Cover image"),
  defineField({
    name: "author",
    type: "reference",
    to: [{ type: "author" }],
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "publishedAt",
    title: "Publication date",
    type: "datetime",
    validation: (rule) => rule.required(),
    description:
      "Publishing a future date requires a Netlify rebuild at that time to appear.",
  }),
  defineField({
    name: "readingMinutes",
    title: "Reading time (minutes)",
    type: "number",
    initialValue: 4,
    validation: (rule) => rule.required().integer().min(1),
  }),
  defineField({
    name: "featured",
    title: "Feature on homepage",
    type: "boolean",
    initialValue: false,
  }),
  defineField({
    name: "body",
    type: "array",
    of: [
      defineArrayMember({ type: "block" }),
      defineArrayMember({
        type: "image",
        fields: [
          defineField({
            name: "alt",
            type: "string",
            validation: (rule) => rule.required(),
          }),
        ],
      }),
    ],
    validation: (rule) => rule.required().min(1),
  }),
];

export const schemaTypes = [
  defineType({
    name: "author",
    title: "Authors",
    type: "document",
    fields: [
      defineField({
        name: "name",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "bio", type: "text", rows: 3 }),
      defineField({
        name: "avatar",
        type: "image",
        options: { hotspot: true },
      }),
    ],
  }),
  defineType({
    name: "article",
    title: "Articles",
    type: "document",
    fields: [
      ...editorialFields,
      defineField({
        name: "category",
        type: "string",
        options: {
          list: ["Anime", "Manga", "Gaming", "Culture"],
          layout: "radio",
        },
        initialValue: "Anime",
        validation: (rule) => rule.required(),
      }),
    ],
    preview: {
      select: { title: "title", subtitle: "category", media: "mainImage" },
    },
  }),
  defineType({
    name: "review",
    title: "Reviews",
    type: "document",
    fields: [
      ...editorialFields,
      defineField({
        name: "score",
        title: "Score out of 10",
        type: "number",
        validation: (rule) => rule.required().min(0).max(10).precision(1),
      }),
    ],
    preview: { select: { title: "title", media: "mainImage" } },
  }),
  defineType({
    name: "affiliateProduct",
    title: "Affiliate products",
    type: "document",
    fields: [
      defineField({
        name: "name",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "description",
        type: "text",
        rows: 3,
        validation: (rule) => rule.required().max(300),
      }),
      image("image", "Product image"),
      defineField({
        name: "affiliateUrl",
        title: "Affiliate URL",
        type: "url",
        validation: (rule) => rule.required().uri({ scheme: ["https"] }),
      }),
      defineField({
        name: "priceLabel",
        title: "Link label",
        type: "string",
        initialValue: "Check current price",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "label",
        title: "Badge",
        type: "string",
        description: "For example: Editor’s pick or The manga edit.",
      }),
      defineField({
        name: "active",
        title: "Show on The Loot",
        type: "boolean",
        initialValue: true,
      }),
    ],
  }),
];
