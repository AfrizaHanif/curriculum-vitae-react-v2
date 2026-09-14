/**
 * Formats an ISO date string (e.g., "2022-01-01") into a readable text format.
 * Defaults to Indonesian locale (id-ID) for localized date names.
 * 
 * @param dateString The date string to format
 * @param locale The locale to format the date (default: 'id-ID')
 * @returns The formatted date string
 */
export function formatDate(dateString: string, locale: string = "id-ID"): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Extracts just the 4-digit year from a date string (e.g. "2023-01-01" -> "2023").
 */
export function getYear(dateString: string): string {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.getFullYear().toString();
}

/**
 * Formats a date string into "Month Year" (e.g. "Jan 2023").
 */
export function formatMonthYear(
  dateString?: string | null,
  locale: string = "en-US",
  presentText: string = "Present"
): string {
  if (!dateString) return presentText;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(date);
}

export interface PeriodItem {
  start_period: string;
  finish_period?: string | null;
}

/**
 * Sorts items with a date period (start_period, finish_period) in reverse chronological order (latest to oldest).
 * - Items with no finish_period (ongoing / 'Present') are placed at the top.
 * - Compares finish_period first; if equal or both ongoing, compares start_period.
 */
export function sortByLatestPeriod<T extends PeriodItem>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const endA = a.finish_period ? new Date(a.finish_period).getTime() : Infinity;
    const endB = b.finish_period ? new Date(b.finish_period).getTime() : Infinity;

    const safeEndA = isNaN(endA) ? 0 : endA;
    const safeEndB = isNaN(endB) ? 0 : endB;

    if (safeEndB !== safeEndA) {
      return safeEndB - safeEndA;
    }

    const startA = new Date(a.start_period).getTime();
    const startB = new Date(b.start_period).getTime();
    const safeStartA = isNaN(startA) ? 0 : startA;
    const safeStartB = isNaN(startB) ? 0 : startB;

    return safeStartB - safeStartA;
  });
}

