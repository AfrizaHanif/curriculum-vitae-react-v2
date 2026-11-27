"use client";

import ProjectFilterDropdown from "./ProjectFilterDropdown";
import ProjectActiveFilterChips from "./ProjectActiveFilterChips";
import { ProjectFilterBarProps } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectFilterToolbar({
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
  // Determine which filters are active
  const isCategoryFiltered = Boolean(
    activeCategory && activeCategory !== "all",
  );
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
              {(totalAll === 1 ? f.showingItem : f.showingItems).replace(
                "{count}",
                String(totalAll),
              )}
            </span>
          </span>
        )}
      </div>

      {/* Right side: Dropdown filter button */}
      <div className="ms-auto">
        <ProjectFilterDropdown
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
          filterAllLabel={resolvedFilterAllLabel}
          allTechLabel={resolvedAllTechLabel}
          allTagsLabel={resolvedAllTagsLabel}
          resetLabel={resolvedResetLabel}
        />
      </div>
    </div>
  );
}

export { ProjectFilterToolbar };
