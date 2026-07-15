import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getSortedNotes } from "@/utils/getSortedNotes";
import { getPostUrl } from "@/utils/getPostPaths";
import { getNoteUrl } from "@/utils/getNoteUrl";
import config from "@/config";

export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);
  const notes = getSortedNotes(await getCollection("notes"));
  const items = [
    ...sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, config.site.lang),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.pubDatetime),
      categories: data.tags,
      author: data.author,
    })),
    ...notes.map(({ data, id }) => ({
      link: getNoteUrl(id, config.site.lang),
      title: data.title,
      description: data.summary,
      pubDate: new Date(data.pubDatetime),
      categories: data.tags,
      author: config.site.author,
    })),
  ].sort((itemA, itemB) => itemB.pubDate.valueOf() - itemA.pubDate.valueOf());

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    customData: `<language>${config.site.lang}</language>`,
    items,
  });
}
