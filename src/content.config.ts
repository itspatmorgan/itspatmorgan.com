import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { LAYER_COLORS } from "./lab/editorial-art/themes";

// The words on a case study page (src/pages/work/<id>.astro). The page places the visuals and the
// order of slides; this holds what they say.
const caseStudy = z.object({
  company: z.object({ name: z.string(), logo: z.string() }),
  subline: z.string(),
  // The search and share description, when it differs from the subline.
  shareDescription: z.string().optional(),
  shareImage: z.string(),
  brief: z.object({ when: z.string(), role: z.string(), team: z.string(), outcome: z.string() }),
  slides: z.record(z.string(), z.object({ title: z.string(), line: z.string().optional() })),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    type: z.enum(["professional", "experiment"]),
    description: z.string(),
    skills: z.array(z.string()),
    // Optional for a case study whose cards show its live demo instead (see ProjectDemo).
    thumbnail: z.string().optional(),
    thumbnailDark: z.string().optional(),
    thumbnailWide: z.string().optional(),
    thumbnailWideDark: z.string().optional(),
    heroImage: z.string().optional(),
    sortOrder: z.number(),
    draft: z.boolean().default(false),
    // The project card summary on the homepage; the Work page uses `description`.
    summary: z.string().optional(),
    caseStudy: caseStudy.optional(),
  }),
});

const layerColor = z.enum(LAYER_COLORS);

const visualGenerator = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("flow-field"),
    seed: z.number(),
    density: z.number(),
    steps: z.number(),
    scale: z.number(),
    curl: z.number(),
    strokeWidth: z.number(),
    opacity: z.number(),
    color: layerColor,
  }),
  z.object({
    type: z.literal("dot-grid"),
    seed: z.number(),
    spacing: z.number(),
    scale: z.number(),
    dotSize: z.number(),
    opacity: z.number(),
    color: layerColor,
  }),
  z.object({
    type: z.literal("isoline"),
    seed: z.number(),
    levels: z.number(),
    scale: z.number(),
    strokeWidth: z.number(),
    opacity: z.number(),
    color: layerColor,
  }),
  z.object({
    type: z.literal("voronoi"),
    seed: z.number(),
    count: z.number(),
    jitter: z.number(),
    strokeWidth: z.number(),
    opacity: z.number(),
    color: layerColor,
  }),
  z.object({
    type: z.literal("strange-attractor"),
    seed: z.number(),
    opacity: z.number(),
    color: layerColor,
  }),
]);

const visualLightMode = z.object({
  color: layerColor,
  opacity: z.number(),
  strokeWidth: z.number().optional(),
});

const writingVisual = z.object({
  version: z.literal(1),
  theme: z.string(),
  background: z.string(),
  generator: visualGenerator,
  lightMode: visualLightMode.optional(),
  texture: z.number(),
  grain: z.number(),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    theme: z.string().optional(),
    tags: z.array(z.string()).default([]),
    visual: writingVisual.optional(),
    image: z.string().optional(),
    canonicalUrl: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/lab" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    preview: z.string(),
    experience: z.enum(["app", "demo"]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing, lab };
