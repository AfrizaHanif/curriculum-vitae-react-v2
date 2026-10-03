"use client";

import React from "react";
import Button from "@/components/ui/bootstrap/button";
import Badge from "@/components/ui/bootstrap/badge";
import Dropdown from "@/components/ui/bootstrap/dropdown";
import InputSelect from "@/components/forms/input-select";
import { ProjectFilterBarProps } from "./types";

export default function ProjectFilterDropdown({
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
    <div className="project-filter-dropdown-content w-100" style={{ minWidth: 0 }}>
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
            className="text-danger text-decoration-none p-0 small fw-semibold flex-shrink-0"
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
        <span className="text-nowrap me-2">
          Found <strong>{totalFiltered}</strong> of {totalAll}
        </span>
        {isFiltered && (
          <Button
            color="link"
            size="sm"
            className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill text-decoration-none cursor-pointer py-1 px-2 flex-shrink-0"
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
        menuStyle={{
          width: "min(320px, calc(100vw - 24px))",
          maxWidth: "calc(100vw - 24px)",
        }}
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

export { ProjectFilterDropdown };
