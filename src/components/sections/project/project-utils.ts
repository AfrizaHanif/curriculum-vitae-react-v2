/**
 * Utility functions for Project and Portfolio sections
 */

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
