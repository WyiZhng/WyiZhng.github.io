const WORDS_PER_MINUTE = 220;
const CJK_CHARACTERS_PER_MINUTE = 400;

export function getReadingMinutes(content: string) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~\[\]()-]/g, " ");

  const cjkCharacters =
    plainText.match(/[\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0;
  const latinWords =
    plainText
      .replace(/[\u3400-\u9fff\uf900-\ufaff]/g, " ")
      .match(/[\p{L}\p{N}]+/gu)?.length ?? 0;

  return Math.max(
    1,
    Math.ceil(
      cjkCharacters / CJK_CHARACTERS_PER_MINUTE + latinWords / WORDS_PER_MINUTE
    )
  );
}
