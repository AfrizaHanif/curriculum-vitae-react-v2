"use client";

import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import { ProjectActiveFilterChipsProps } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectActiveFilterChips({
  categories,
  activeCategory,
  onClearCategory,
  activeTech,
  onClearTech,
  activeTag = "",
  onClearTag,
  onReset,
  totalFiltered,
  totalAll,
  className = "",
}: ProjectActiveFilterChipsProps) {
  const { t } = useLanguage();
  const f = t.sections.projects.filter;
  // Determine which filters are active
  const isCategoryFiltered = Boolean(
    activeCategory && activeCategory !== "all",
  );
  const isTechFiltered = Boolean(activeTech);
  const isTagFiltered = Boolean(activeTag);
  const isFiltered = isCategoryFiltered || isTechFiltered || isTagFiltered;

  if (!isFiltered) return null;

  // Get the label for the active category
  const categoryLabel =
    categories.find((c) => c.key.toLowerCase() === activeCategory.toLowerCase())
      ?.label || activeCategory;

  return (
    <div
      className={`project-active-filter-chips d-flex flex-wrap align-items-center gap-2 p-2 px-3 rounded-4 bg-body-tertiary border small text-muted ${className}`}
    >
      {/* Filter Summary */}
      <span className="fw-medium me-1">
        {f.foundCount
          .replace("{filtered}", String(totalFiltered))
          .replace("{total}", String(totalAll))}
        :
      </span>

      {/* Active Filters */}
      {isCategoryFiltered && (
        <Badge
          color="primary"
          subtle
          pill
          className="d-inline-flex align-items-center gap-1 py-1 px-2"
        >
          <span>
            {f.categoryLabel}:{" "}
            <strong className="text-capitalize">{categoryLabel}</strong>
          </span>
          <button
            type="button"
            className="btn-close btn-close-sm"
            style={{ fontSize: "0.55rem" }}
            aria-label={f.removeCategoryAria}
            onClick={onClearCategory}
          />
        </Badge>
      )}

      {/* Technology Filter */}
      {isTechFiltered && (
        <Badge
          color="info"
          subtle
          pill
          className="d-inline-flex align-items-center gap-1 py-1 px-2"
        >
          <span>
            {f.techShort}:{" "}
            <strong className="text-capitalize">{activeTech}</strong>
          </span>
          <button
            type="button"
            className="btn-close btn-close-sm"
            style={{ fontSize: "0.55rem" }}
            aria-label={f.removeTechAria}
            onClick={onClearTech}
          />
        </Badge>
      )}

      {/* Tag Filter */}
      {isTagFiltered && onClearTag && (
        <Badge
          color="secondary"
          subtle
          pill
          className="d-inline-flex align-items-center gap-1 py-1 px-2"
        >
          <span>
            {f.tagLabel}:{" "}
            <strong className="text-capitalize">{activeTag}</strong>
          </span>
          <button
            type="button"
            className="btn-close btn-close-sm"
            style={{ fontSize: "0.55rem" }}
            aria-label={f.removeTagAria}
            onClick={onClearTag}
          />
        </Badge>
      )}

      {/* Clear All Button */}
      <Button
        color="link"
        size="sm"
        className="text-danger text-decoration-none p-0 ms-auto small fw-semibold"
        onClick={onReset}
      >
        {f.clearAll}
      </Button>
    </div>
  );
}

export { ProjectActiveFilterChips };
