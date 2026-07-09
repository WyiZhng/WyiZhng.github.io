import { cp, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, "dist/pagefind");
const target = resolve(root, "public/pagefind");

await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });
