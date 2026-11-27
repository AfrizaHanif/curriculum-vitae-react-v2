"use client";

import Button from "@/components/ui/bootstrap/button";
import Badge from "@/components/ui/bootstrap/badge";
import Dropdown from "@/components/ui/bootstrap/dropdown";
import InputSelect from "@/components/forms/input-select";
import { ProjectFilterBarProps } from "./types";
import { useLanguage } from "@/context/LanguageContext";

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
  filterAllLabel,
  allTechLabel,
  allTagsLabel,
  resetLabel,
  className = "",
}: ProjectFilterBarProps) {
  const { t } = useLanguage();
  const f = t.sections.projects.filter;
  const resolvedFilterAllLabel = filterAllLabel ?? f.allCategories;
  const resolvedAllTechLabel = allTechLabel ?? f.allTechnologies;
  const resolvedAllTagsLabel = allTagsLabel ?? f.allTags;
  const resolvedResetLabel = resetLabel ?? f.reset;
  // Determine the number of active filters
  const activeCount =
    (activeCategory && activeCategory !== "all" ? 1 : 0) +
    (activeTech ? 1 : 0) +
    (activeTag ? 1 : 0);

  const isFiltered = activeCount > 0;

  // Dropdown content for the filter options
  const dropdownContent = (
    <div
      className="project-filter-dropdown-content w-100"
      style={{ minWidth: 0 }}
    >
      {/* Dropdown Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        {/* Filter Summary */}
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-funnel-fill text-primary" />
          <span className="fw-bold small text-uppercase tracking-wider">
            {f.title}
          </span>
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <Button
            color="link"
            size="sm"
            className="text-danger text-decoration-none p-0 small fw-semibold flex-shrink-0"
            onClick={onReset}
            title={f.resetAll}
          >
            <i className="bi bi-x-circle me-1" />
            {resolvedResetLabel}
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
            <span>{f.categoryLabel}</span>
          </label>
          <InputSelect
            name="categoryFilter"
            id="dropdown-category-filter"
            size="sm"
            className="border-secondary-subtle text-capitalize rounded-3"
            value={activeCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            options={[
              { value: "all", label: resolvedFilterAllLabel },
              ...categories
                .filter((c) => c.key !== "all")
                .map((cat) => ({
                  value: cat.key.toLowerCase(),
                  label:
                    `${cat.label} ${cat.count !== undefined ? `(${cat.count})` : ""}`.trim(),
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
            <span>{f.techLabel}</span>
          </label>
          <InputSelect
            name="techFilter"
            id="dropdown-tech-filter"
            size="sm"
            className="border-secondary-subtle rounded-3"
            value={activeTech}
            onChange={(e) => onSelectTech(e.target.value)}
            options={[
              { value: "", label: resolvedAllTechLabel },
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
              <span>{f.tagLabel}</span>
            </label>
            <InputSelect
              name="tagFilter"
              id="dropdown-tag-filter"
              size="sm"
              className="border-secondary-subtle rounded-3"
              value={activeTag}
              onChange={(e) => onSelectTag(e.target.value)}
              options={[
                { value: "", label: resolvedAllTagsLabel },
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
        {/* Filter Summary */}
        <span className="text-nowrap me-2">
          {f.foundCount
            .replace("{filtered}", String(totalFiltered))
            .replace("{total}", String(totalAll))}
        </span>

        {/* Reset Button */}
        {isFiltered && (
          <Button
            color="outline-primary"
            size="sm"
            rounded
            className="py-0 px-2 flex-shrink-0"
            onClick={onReset}
          >
            {f.clearFilters}
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
        <span className="fw-semibold">{f.button}</span>
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
