import { LocalizedContent } from "@/types/api";

/**
 * Returns raw localized content (string or array of strings)
 */
export function getLocalizedContent<T = string | string[]>(
  field: LocalizedContent<T> | null | undefined,
  lang: "en" | "id" = "id",
): T | undefined {
  if (!field) return undefined;
  if (typeof field === "string" || Array.isArray(field)) {
    return field as T;
  }
  const obj = field as { en?: T; id?: T };
  return obj[lang] ?? obj.id ?? obj.en;
}

/**
 * Always returns a clean string safe to render in JSX
 */
export function getLocalizedText(
  field: LocalizedContent | null | undefined,
  lang: "en" | "id" = "id",
): string {
  const content = getLocalizedContent(field, lang);
  if (!content) return "";
  if (Array.isArray(content)) return content.join("\n");
  return String(content);
}
