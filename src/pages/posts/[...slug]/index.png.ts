import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { getPostSlug } from "@/utils/getPostPaths";
import config from "@/config";

const WIDTH = 1200;
const HEIGHT = 630;

const regularFontPath = fileURLToPath(
  import.meta
    .resolve("@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff")
);
const boldFontPath = fileURLToPath(
  import.meta
    .resolve("@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff")
);

function escapePango(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createTextLayer({
  text,
  color,
  fontSize,
  fontfile,
  width,
  height,
  left,
  top,
  align = "left",
}: {
  text: string;
  color: string;
  fontSize: number;
  fontfile: string;
  width: number;
  height: number;
  left: number;
  top: number;
  align?: "left" | "center" | "right";
}): sharp.OverlayOptions {
  return {
    input: {
      text: {
        text: `<span foreground="${color}">${escapePango(text)}</span>`,
        font: `Noto Sans SC ${fontSize}`,
        fontfile,
        width,
        height,
        align,
        rgba: true,
        wrap: "word-char",
      },
    },
    left,
    top,
  };
}

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) return [];

  const posts = await getCollection("posts").then(entries =>
    entries.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const post = props as CollectionEntry<"posts">;
  const { title, description, pubDatetime, tags } = post.data;
  const date = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: config.site.timezone,
  })
    .format(pubDatetime)
    .replaceAll("/", ".");
  const tagLine = tags
    .slice(0, 3)
    .map(tag => `#${tag}`)
    .join("   ");

  const frame = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#fcfcfb" />
      <rect x="64" y="56" width="1072" height="518" rx="8" fill="none" stroke="#dfe1e4" stroke-width="2" />
      <rect x="64" y="56" width="1072" height="8" fill="#245da8" />
      <line x1="90" y1="500" x2="1110" y2="500" stroke="#dfe1e4" stroke-width="2" />
    </svg>
  `);

  const pngBuffer = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: "#fcfcfb",
    },
  })
    .composite([
      { input: frame, left: 0, top: 0 },
      createTextLayer({
        text: "YI'S BLOG / RESEARCH NOTE",
        color: "#245da8",
        fontSize: 18,
        fontfile: regularFontPath,
        width: 900,
        height: 40,
        left: 90,
        top: 94,
      }),
      createTextLayer({
        text: title,
        color: "#1b1d21",
        fontSize: 58,
        fontfile: boldFontPath,
        width: 1020,
        height: 225,
        left: 90,
        top: 145,
      }),
      createTextLayer({
        text: description,
        color: "#646a73",
        fontSize: 21,
        fontfile: regularFontPath,
        width: 960,
        height: 82,
        left: 90,
        top: 395,
      }),
      createTextLayer({
        text: tagLine || "#研究笔记",
        color: "#646a73",
        fontSize: 17,
        fontfile: regularFontPath,
        width: 760,
        height: 38,
        left: 90,
        top: 526,
      }),
      createTextLayer({
        text: date,
        color: "#1b1d21",
        fontSize: 17,
        fontfile: regularFontPath,
        width: 220,
        height: 38,
        left: 890,
        top: 526,
        align: "right",
      }),
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
