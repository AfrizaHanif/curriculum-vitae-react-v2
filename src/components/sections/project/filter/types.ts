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
