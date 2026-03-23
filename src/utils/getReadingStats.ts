type ReadingStats = {
  wordCount: number;
  readingMinutes: number;
};

const CODE_BLOCK_RE = /```[\s\S]*?```/g;
const INLINE_CODE_RE = /`[^`]+`/g;
const HAN_RE = /[\p{Script=Han}]/gu;
const LATIN_RE = /[A-Za-z0-9]+(?:['’_-][A-Za-z0-9]+)*/g;

export default function getReadingStats(content: string): ReadingStats {
  const plainText = content
    .replace(CODE_BLOCK_RE, " ")
    .replace(INLINE_CODE_RE, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/[#>*_\-]/g, " ");

  const hanCount = plainText.match(HAN_RE)?.length ?? 0;
  const latinCount = plainText.match(LATIN_RE)?.length ?? 0;
  const wordCount = hanCount + latinCount;
  const readingMinutes = Math.max(
    1,
    Math.ceil(hanCount / 320 + latinCount / 200)
  );

  return {
    wordCount,
    readingMinutes,
  };
}
