/**
 * General formatting utilities
 */

/**
 * Formats city and province into a clean location string.
 * Example: "Jakarta Selatan, DKI Jakarta" or "Bandung"
 */
export function formatLocation(
  city?: string | null,
  province?: string | null,
): string {
  if (city && province) {
    return `${city}, ${province}`;
  }
  return city || province || "";
}
