export type PostContentFormat = "RICH" | "MARKDOWN";

const RICH_CONTENT_MAX = 20000;
const MARKDOWN_CONTENT_MAX = 200000;

export function validatePostContent(
  contentFormat: PostContentFormat,
  content: string,
): string | null {
  const max =
    contentFormat === "MARKDOWN" ? MARKDOWN_CONTENT_MAX : RICH_CONTENT_MAX;
  if (content.length > max) {
    return `Content is too long (max ${max} characters).`;
  }
  return null;
}

export function normalizePostContentFormat(
  value: unknown,
): PostContentFormat {
  return value === "MARKDOWN" ? "MARKDOWN" : "RICH";
}
