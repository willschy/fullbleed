import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const entries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/entries" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sourceDate: z.coerce.date(),
    category: z.enum(["tools", "automations", "models", "plugins-skills", "papers"]),
    tools: z.array(z.string()),
    disciplines: z.array(z.string()),
    thumbnail: z.string().nullable(),
    credit: z.string().nullable().default(null),
    score: z.number(),
    hoverWhat: z.string(),
    hoverWhy: z.string(),
    modelVersions: z.string().nullable(),
    source: z.object({
      origin: z.string(),
      permalink: z.string(),
      outboundUrl: z.string().nullable(),
      author: z.string(),
    }),
    supersededBy: z.string().nullable(),
    fixture: z.boolean().default(false),
  }),
});

export const collections = { entries };
