/**
 * Utility functions for Project and Portfolio sections
 */

// Get project status badge class
export function getProjectStatusBadgeClass(status?: string | null): string {
  if (!status) {
    return "bg-secondary-subtle text-secondary border border-secondary-subtle";
  }

  const normalized = status.toLowerCase();
  if (normalized === "completed" || normalized === "finished") {
    return "bg-success-subtle text-success border border-success-subtle";
  }

  if (normalized === "in progress" || normalized === "ongoing") {
    return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
  }

  return "bg-secondary-subtle text-secondary border border-secondary-subtle";
}

// Match category for portfolio and portfolio
export function matchCategory(
  item: {
    category?: string | null;
    subcategory?: string | null;
    type?: string | null;
  },
  activeCategory: string,
): boolean {
  if (!activeCategory || activeCategory.toLowerCase() === "all") return true;

  const target = activeCategory.toLowerCase().trim();
  const subcat = (item.subcategory || "").toLowerCase();
  const cat = (item.category || "").toLowerCase();
  const type = (item.type || "").toLowerCase();

  if (target === "backend" || target === "back-end") {
    return (
      subcat.includes("backend") ||
      type.includes("api") ||
      type.includes("backend") ||
      cat.includes("backend")
    );
  }

  if (target === "frontend" || target === "front-end") {
    return (
      subcat.includes("frontend") ||
      subcat.includes("front-end") ||
      type.includes("frontend") ||
      cat.includes("frontend")
    );
  }

  if (target === "fullstack" || target === "full-stack") {
    return (
      subcat.includes("full-stack") ||
      subcat.includes("fullstack") ||
      type.includes("fullstack") ||
      cat.includes("fullstack")
    );
  }

  if (target === "mobile") {
    return (
      subcat.includes("mobile") ||
      type.includes("mobile") ||
      cat.includes("mobile")
    );
  }

  if (target === "web") {
    return (
      type.includes("web") || subcat.includes("web") || cat.includes("web")
    );
  }

  return (
    subcat.includes(target) || cat.includes(target) || type.includes(target)
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
