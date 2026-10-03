"use client";

import React from "react";
import Button from "@/components/ui/bootstrap/button";
import { ProjectActiveFilterChipsProps } from "./types";

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
  const isCategoryFiltered = Boolean(activeCategory && activeCategory !== "all");
  const isTechFiltered = Boolean(activeTech);
  const isTagFiltered = Boolean(activeTag);
  const isFiltered = isCategoryFiltered || isTechFiltered || isTagFiltered;

  if (!isFiltered) return null;

  const categoryLabel =
    categories.find((c) => c.key.toLowerCase() === activeCategory.toLowerCase())
      ?.label || activeCategory;

  return (
    <div
      className={`project-active-filter-chips d-flex flex-wrap align-items-center gap-2 p-2 px-3 rounded-4 bg-body-tertiary border small text-muted ${className}`}
    >
      <span className="fw-medium me-1">
        Found <strong>{totalFiltered}</strong> of {totalAll}:
      </span>

      {isCategoryFiltered && (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill d-inline-flex align-items-center gap-1 py-1 px-2">
          <span>
            Category:{" "}
            <strong className="text-capitalize">{categoryLabel}</strong>
          </span>
          <button
            type="button"
            className="btn-close btn-close-sm"
            style={{ fontSize: "0.55rem" }}
            aria-label="Remove category filter"
            onClick={onClearCategory}
          />
        </span>
      )}

      {isTechFiltered && (
        <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill d-inline-flex align-items-center gap-1 py-1 px-2">
          <span>
            Tech: <strong className="text-capitalize">{activeTech}</strong>
          </span>
          <button
            type="button"
            className="btn-close btn-close-sm"
            style={{ fontSize: "0.55rem" }}
            aria-label="Remove technology filter"
            onClick={onClearTech}
          />
        </span>
      )}

      {isTagFiltered && onClearTag && (
        <span className="badge bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle rounded-pill d-inline-flex align-items-center gap-1 py-1 px-2">
          <span>
            Tag: <strong className="text-capitalize">{activeTag}</strong>
          </span>
          <button
            type="button"
            className="btn-close btn-close-sm"
            style={{ fontSize: "0.55rem" }}
            aria-label="Remove tag filter"
            onClick={onClearTag}
          />
        </span>
      )}

      <Button
        color="link"
        size="sm"
        className="text-danger text-decoration-none p-0 ms-auto small fw-semibold"
        onClick={onReset}
      >
        Clear all
      </Button>
    </div>
  );
}

export { ProjectActiveFilterChips };
