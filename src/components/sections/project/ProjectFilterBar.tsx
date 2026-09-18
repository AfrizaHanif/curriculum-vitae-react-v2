"use client";

import React, { useState } from "react";

export interface FilterCategoryOption {
  key: string;
  label: string;
  count?: number;
}

export interface ProjectFilterBarProps {
  categories: FilterCategoryOption[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  availableTechs: string[];
  activeTech: string;
  onSelectTech: (tech: string) => void;
  availableTags?: string[];
  activeTag?: string;
  onSelectTag?: (tag: string) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
  filterAllLabel?: string;
  allTechLabel?: string;
  allTagsLabel?: string;
  resetLabel?: string;
  className?: string;
}

export default function ProjectFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  availableTechs,
  activeTech,
  onSelectTech,
  availableTags = [],
  activeTag = "",
  onSelectTag,
  onReset,
  totalFiltered,
  totalAll,
  filterAllLabel = "All Categories",
  allTechLabel = "All Technologies",
  allTagsLabel = "All Tags",
  resetLabel = "Reset Filter",
  className = "",
}: ProjectFilterBarProps) {
  const activeCount =
    (activeCategory && activeCategory !== "all" ? 1 : 0) +
    (activeTech ? 1 : 0) +
    (activeTag ? 1 : 0);

  const isFiltered = activeCount > 0;

  // Mobile / Tablet collapse state (auto-expanded if there are active filters, or follows user manual toggle)
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null);
  const isMobileOpen = userExpanded ?? isFiltered;

  return (
    <search
      className={`project-filter-bar bg-body-tertiary p-3 rounded-4 border shadow-sm ${className}`}
      role="search"
    >
      {/* Mobile / Tablet Toggle Header */}
      <div className="d-flex d-lg-none justify-content-between align-items-center">
        <button
          type="button"
          className={`btn btn-sm ${
            isFiltered ? "btn-primary" : "btn-outline-secondary"
          } d-flex align-items-center gap-2 rounded-pill px-3 py-1 transition-all`}
          onClick={() => setUserExpanded(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          aria-controls="project-filter-controls"
        >
          <i className="bi bi-funnel-fill" />
          <span className="fw-semibold">
            {isMobileOpen ? "Hide Filters" : "Filter Projects"}
          </span>
          {activeCount > 0 && (
            <span
              className={`badge rounded-pill ${
                isFiltered ? "bg-white text-primary" : "bg-primary text-white"
              }`}
            >
              {activeCount}
            </span>
          )}
          <i
            className={`bi bi-chevron-${isMobileOpen ? "up" : "down"} ms-1 small`}
          />
        </button>

        {/* Quick Reset on Mobile when filters active */}
        {isFiltered && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger rounded-pill d-inline-flex align-items-center gap-1 px-2 py-1"
            onClick={onReset}
            title="Reset all filters"
          >
            <i className="bi bi-x-circle" />
            <span className="small">{resetLabel}</span>
          </button>
        )}
      </div>

      {/* Filter Controls (Collapsible on mobile/tablet, always visible on desktop) */}
      <div
        id="project-filter-controls"
        className={`${isMobileOpen ? "d-block mt-3 mt-lg-0" : "d-none"} d-lg-block`}
      >
        <div className="row g-2 align-items-center">
          {/* Category Select Box */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-body text-muted border-secondary-subtle">
                <i className="bi bi-funnel" />
              </span>
              <select
                className="form-select form-select-sm border-secondary-subtle text-capitalize"
                value={activeCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                aria-label="Filter by Category"
              >
                <option value="all">{filterAllLabel}</option>
                {categories
                  .filter((c) => c.key !== "all")
                  .map((cat) => (
                    <option key={cat.key} value={cat.key.toLowerCase()}>
                      {cat.label}{" "}
                      {cat.count !== undefined ? `(${cat.count})` : ""}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Technology Select Box */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-body text-muted border-secondary-subtle">
                <i className="bi bi-code-slash" />
              </span>
              <select
                className="form-select form-select-sm border-secondary-subtle"
                value={activeTech}
                onChange={(e) => onSelectTech(e.target.value)}
                aria-label="Filter by Technology"
              >
                <option value="">{allTechLabel}</option>
                {availableTechs.map((tech) => (
                  <option key={tech} value={tech.toLowerCase()}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tag Select Box (if tags available) */}
          {availableTags.length > 0 && onSelectTag && (
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-body text-muted border-secondary-subtle">
                  <i className="bi bi-tag" />
                </span>
                <select
                  className="form-select form-select-sm border-secondary-subtle"
                  value={activeTag}
                  onChange={(e) => onSelectTag(e.target.value)}
                  aria-label="Filter by Tag"
                >
                  <option value="">{allTagsLabel}</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag.toLowerCase()}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Desktop Reset Button */}
          <div className="col-12 col-sm-6 col-lg d-none d-lg-flex justify-content-lg-end align-items-center gap-2">
            {isFiltered && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger rounded-pill d-inline-flex align-items-center gap-1 px-3 py-1"
                onClick={onReset}
                title="Reset all filters"
              >
                <i className="bi bi-x-circle" />
                <span>{resetLabel}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter status summary when active */}
        {isFiltered && (
          <div className="d-flex flex-wrap align-items-center justify-content-between mt-2 pt-2 border-top border-secondary-subtle small text-muted gap-2">
            <span>
              Found <strong>{totalFiltered}</strong> of {totalAll} items
              {activeCategory && activeCategory !== "all" && (
                <>
                  {" "}in category &ldquo;
                  <span className="text-capitalize fw-semibold">
                    {categories.find(
                      (c) =>
                        c.key.toLowerCase() === activeCategory.toLowerCase(),
                    )?.label || activeCategory}
                  </span>
                  &rdquo;
                </>
              )}
              {activeTech && (
                <>
                  {" "}with tech &ldquo;
                  <span className="text-capitalize fw-semibold">{activeTech}</span>
                  &rdquo;
                </>
              )}
              {activeTag && (
                <>
                  {" "}tagged &ldquo;
                  <span className="text-capitalize fw-semibold">{activeTag}</span>
                  &rdquo;
                </>
              )}
            </span>
            <button
              type="button"
              className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill cursor-pointer"
              onClick={onReset}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </search>
  );
}
