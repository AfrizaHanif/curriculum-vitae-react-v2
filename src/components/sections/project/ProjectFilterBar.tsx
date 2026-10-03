"use client";

import React from "react";
import Button from "@/components/ui/bootstrap/button";
import Badge from "@/components/ui/bootstrap/badge";
import Dropdown from "@/components/ui/bootstrap/dropdown";
import InputSelect from "@/components/forms/input-select";

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
  resetLabel = "Reset",
  className = "",
}: ProjectFilterBarProps) {
  const activeCount =
    (activeCategory && activeCategory !== "all" ? 1 : 0) +
    (activeTech ? 1 : 0) +
    (activeTag ? 1 : 0);

  const isFiltered = activeCount > 0;

  const dropdownContent = (
    <div className="project-filter-dropdown-content" style={{ minWidth: "270px" }}>
      {/* Dropdown Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-funnel-fill text-primary" />
          <span className="fw-bold small text-uppercase tracking-wider">
            Filter Projects
          </span>
        </div>
        {isFiltered && (
          <Button
            color="link"
            size="sm"
            className="text-danger text-decoration-none p-0 small fw-semibold"
            onClick={onReset}
            title="Reset all filters"
          >
            <i className="bi bi-x-circle me-1" />
            {resetLabel}
          </Button>
        )}
      </div>

      {/* Filter Form Controls */}
      <div className="d-flex flex-column gap-3">
        {/* Category Select */}
        <div>
          <label
            htmlFor="dropdown-category-filter"
            className="form-label small fw-semibold text-muted mb-1 d-flex align-items-center gap-1"
          >
            <i className="bi bi-grid text-primary small" />
            <span>Category</span>
          </label>
          <InputSelect
            name="categoryFilter"
            id="dropdown-category-filter"
            size="sm"
            className="border-secondary-subtle text-capitalize rounded-3"
            value={activeCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            options={[
              { value: "all", label: filterAllLabel },
              ...categories
                .filter((c) => c.key !== "all")
                .map((cat) => ({
                  value: cat.key.toLowerCase(),
                  label: `${cat.label} ${cat.count !== undefined ? `(${cat.count})` : ""}`.trim(),
                })),
            ]}
          />
        </div>

        {/* Technology Select */}
        <div>
          <label
            htmlFor="dropdown-tech-filter"
            className="form-label small fw-semibold text-muted mb-1 d-flex align-items-center gap-1"
          >
            <i className="bi bi-code-slash text-primary small" />
            <span>Technology</span>
          </label>
          <InputSelect
            name="techFilter"
            id="dropdown-tech-filter"
            size="sm"
            className="border-secondary-subtle rounded-3"
            value={activeTech}
            onChange={(e) => onSelectTech(e.target.value)}
            options={[
              { value: "", label: allTechLabel },
              ...availableTechs.map((tech) => ({
                value: tech.toLowerCase(),
                label: tech,
              })),
            ]}
          />
        </div>

        {/* Tag Select (if tags available) */}
        {availableTags.length > 0 && onSelectTag && (
          <div>
            <label
              htmlFor="dropdown-tag-filter"
              className="form-label small fw-semibold text-muted mb-1 d-flex align-items-center gap-1"
            >
              <i className="bi bi-tag text-primary small" />
              <span>Tag</span>
            </label>
            <InputSelect
              name="tagFilter"
              id="dropdown-tag-filter"
              size="sm"
              className="border-secondary-subtle rounded-3"
              value={activeTag}
              onChange={(e) => onSelectTag(e.target.value)}
              options={[
                { value: "", label: allTagsLabel },
                ...availableTags.map((tag) => ({
                  value: tag.toLowerCase(),
                  label: tag,
                })),
              ]}
            />
          </div>
        )}
      </div>

      {/* Dropdown Footer */}
      <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top border-secondary-subtle small text-muted">
        <span>
          Found <strong>{totalFiltered}</strong> of {totalAll}
        </span>
        {isFiltered && (
          <Button
            color="link"
            size="sm"
            className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill text-decoration-none cursor-pointer py-1 px-2"
            onClick={onReset}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`project-filter-dropdown-container ${className}`}>
      <Dropdown
        direction="down"
        autoClose="outside"
        showCaret={false}
        buttonColor={isFiltered ? "primary" : "outline-secondary"}
        size="sm"
        buttonClass="d-inline-flex align-items-center gap-2 px-3 py-1-5 rounded-pill shadow-sm"
        menuClass="dropdown-menu-end p-3 shadow-lg border rounded-4"
        menuStyle={{ width: "320px", maxWidth: "90vw" }}
        content={dropdownContent}
      >
        <i className="bi bi-funnel-fill" />
        <span className="fw-semibold">Filter</span>
        {activeCount > 0 && (
          <Badge
            pill
            className={
              isFiltered ? "bg-white text-primary" : "bg-primary text-white"
            }
          >
            {activeCount}
          </Badge>
        )}
        <i className="bi bi-chevron-down small opacity-75" />
      </Dropdown>
    </div>
  );
}

export interface ProjectActiveFilterChipsProps {
  categories: FilterCategoryOption[];
  activeCategory: string;
  onClearCategory: () => void;
  activeTech: string;
  onClearTech: () => void;
  activeTag?: string;
  onClearTag?: () => void;
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
  className?: string;
}

export function ProjectActiveFilterChips({
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

export function ProjectFilterToolbar({
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
  resetLabel = "Reset",
  className = "",
}: ProjectFilterBarProps) {
  const isCategoryFiltered = Boolean(activeCategory && activeCategory !== "all");
  const isTechFiltered = Boolean(activeTech);
  const isTagFiltered = Boolean(activeTag);
  const isFiltered = isCategoryFiltered || isTechFiltered || isTagFiltered;

  return (
    <div
      className={`project-filter-toolbar d-flex flex-wrap align-items-center justify-content-between gap-2 ${className}`}
    >
      {/* Left side: Active filter chips or subtle item counter */}
      <div className="d-flex flex-wrap align-items-center gap-2">
        {isFiltered ? (
          <ProjectActiveFilterChips
            categories={categories}
            activeCategory={activeCategory}
            onClearCategory={() => onSelectCategory("all")}
            activeTech={activeTech}
            onClearTech={() => onSelectTech("")}
            activeTag={activeTag}
            onClearTag={onSelectTag ? () => onSelectTag("") : undefined}
            onReset={onReset}
            totalFiltered={totalFiltered}
            totalAll={totalAll}
          />
        ) : (
          <span className="text-muted small d-inline-flex align-items-center gap-1">
            <i className="bi bi-collection opacity-75" />
            <span>
              Showing <strong>{totalAll}</strong> {totalAll === 1 ? "item" : "items"}
            </span>
          </span>
        )}
      </div>

      {/* Right side: Dropdown filter button */}
      <div className="ms-auto">
        <ProjectFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          availableTechs={availableTechs}
          activeTech={activeTech}
          onSelectTech={onSelectTech}
          availableTags={availableTags}
          activeTag={activeTag}
          onSelectTag={onSelectTag}
          onReset={onReset}
          totalFiltered={totalFiltered}
          totalAll={totalAll}
          filterAllLabel={filterAllLabel}
          allTechLabel={allTechLabel}
          allTagsLabel={allTagsLabel}
          resetLabel={resetLabel}
        />
      </div>
    </div>
  );
}

