import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const entries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/entries" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sourceDate: z.coerce.date(),
    category: z.enum(["client-work", "tools-you-can-steal", "new-possible", "business-plays"]),
    tools: z.array(z.string()),
    disciplines: z.array(z.string()),
    thumbnail: z.string().nullable(),
    score: z.number(),
    hoverWhat: z.string(),
    hoverWhy: z.string(),
    modelVersions: z.string().nullable(),
    source: z.object({
      permalink: z.string(),
      outboundUrl: z.string().nullable(),
      author: z.string(),
      subreddit: z.string(),
    }),
    supersededBy: z.string().nullable(),
    fixture: z.boolean().default(false),
  }),
});

export const collections = { entries };
