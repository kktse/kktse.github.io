import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * Posts live in one collection so `.md` and `.mdx` share frontmatter, routing
 * and metadata. `slug` is explicit on every entry: canonical URLs never depend
 * on the source filename or a title-derived algorithm, so files can be renamed
 * without breaking `/posts/<slug>/`. The route generator rejects duplicates.
 */
const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    modifiedDate: z.coerce.date().optional(),
    author: z.string().min(1).optional(),
    categories: z.array(z.string().min(1)).default([]),
    slug: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'slug must be lowercase words separated by single hyphens'
      ),
    description: z.string().min(1).optional(),
  }),
});

export const collections = { posts };
