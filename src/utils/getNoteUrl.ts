import { getRelativeLocaleUrl } from "astro:i18n";
import { slugifyStr } from "./slugify";

export function getNoteUrl(id: string, locale: string) {
  return getRelativeLocaleUrl(locale, `notes/${slugifyStr(id)}/`);
}
