/**
 * Utility functions for Project and Portfolio sections
 */

export type ProjectStatusColor =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

// Get project status semantic color for Badge component
export function getProjectStatusColor(
  status?: string | null,
): ProjectStatusColor {
  if (!status) return "secondary";

  const normalized = status.toLowerCase().replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "completed":
    case "finished":
      return "success";
    case "active":
    case "ongoing":
    case "in_progress":
      return "warning";
    case "delayed":
      return "danger";
    case "planning":
      return "info";
    default:
      return "secondary";
  }
}

// Get project status badge class
export function getProjectStatusBadgeClass(status?: string | null): string {
  const color = getProjectStatusColor(status);
  return `bg-${color}-subtle text-${color}-emphasis border border-${color}-subtle`;
}

// Match category for portfolio and project
export function matchCategory(
  item: {
    category?: string | null;
    type?: string | null;
  },
  activeCategory: string,
): boolean {
  if (!activeCategory || activeCategory.toLowerCase() === "all") return true;

  const target = activeCategory.toLowerCase().trim();
  const normalize = (s?: string | null) =>
    (s || "").toLowerCase().replace(/[\s-_]+/g, "");

  const cleanTarget = normalize(target);
  const cleanCat = normalize(item.category);
  const cleanType = normalize(item.type);

  if (cleanTarget === "backend") {
    return (
      cleanType.includes("backend") ||
      cleanType.includes("api") ||
      cleanCat.includes("backend") ||
      cleanCat.includes("api")
    );
  }

  if (cleanTarget === "frontend") {
    return cleanType.includes("frontend") || cleanCat.includes("frontend");
  }

  if (cleanTarget === "fullstack") {
    return cleanType.includes("fullstack") || cleanCat.includes("fullstack");
  }

  if (cleanTarget === "mobile") {
    return cleanType.includes("mobile") || cleanCat.includes("mobile");
  }

  if (cleanTarget === "web") {
    return cleanType.includes("web") || cleanCat.includes("web");
  }

  return (
    cleanCat.includes(cleanTarget) ||
    cleanType.includes(cleanTarget) ||
    (item.category || "").toLowerCase().includes(target) ||
    (item.type || "").toLowerCase().includes(target)
  );
}

// Match technology for portfolio and project
export function matchTechnology(
  item: { technology?: string[] | null },
  activeTech: string,
): boolean {
  if (!activeTech) return true;
  const target = activeTech.toLowerCase().trim();
  return (item.technology || []).some(
    (tech) => tech.toLowerCase().trim() === target,
  );
}

// Match tag for portfolio and project
export function matchTag(
  item: { tags?: string[] | null },
  activeTag: string,
): boolean {
  if (!activeTag) return true;
  const target = activeTag.toLowerCase().trim();
  return (item.tags || []).some((tag) => tag.toLowerCase().trim() === target);
}
