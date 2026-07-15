import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Tag = {
  tag: string;
  tagName: string;
  count: number;
};

/**
 * Builds a de-duplicated, sorted tag list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `tag` is the slug used in URLs; `tagName` is the original label for display
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 */
export function getUniqueTags(posts: CollectionEntry<"posts">[]) {
  const tagIndex = new Map<string, Tag>();

  for (const post of posts.filter(postFilter)) {
    for (const tagName of new Set(post.data.tags)) {
      const tag = slugifyStr(tagName);
      const current = tagIndex.get(tag);
      tagIndex.set(tag, {
        tag,
        tagName: current?.tagName ?? tagName,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  return Array.from(tagIndex.values()).sort((tagA, tagB) =>
    tagA.tag.localeCompare(tagB.tag)
  );
}
