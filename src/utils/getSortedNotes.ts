import type { CollectionEntry } from "astro:content";

export function getSortedNotes(notes: CollectionEntry<"notes">[]) {
  return notes
    .filter(({ data }) => !data.draft)
    .sort(
      (noteA, noteB) =>
        noteB.data.pubDatetime.getTime() - noteA.data.pubDatetime.getTime()
    );
}
