"use client";

import React, { useId, useState } from "react";

/**
 * Represents a single tab and its associated content pane in {@link NavTab}.
 */
export interface NavTabItem {
  /** Optional custom ID for tab pane DOM elements. */
  id?: string;

  /** Title label or React node displayed in the tab header button. */
  title: React.ReactNode;

  /** Tab pane body content. Pass `null` if using NavTab purely as a navigation switcher. */
  content: React.ReactNode;

  /** Disables click interaction on this tab. */
  disabled?: boolean;
}

/**
 * Props for the {@link NavTab} navigation tabs component.
 */
export interface NavTabProps {
  /** Optional HTML element ID prefix. */
  id?: string;

  /** Array of tab items with title and content definitions. */
  items: NavTabItem[];

  /** Bootstrap nav variant style: `"tabs"`, `"pills"`, or `"underline"`. Defaults to `"tabs"`. */
  variant?: "tabs" | "pills" | "underline";

  /** Proportionally fills the available horizontal width (`nav-fill`). */
  fill?: boolean;

  /** Equal-width justified tabs (`nav-justified`). */
  justify?: boolean;

  /** Container class names. */
  className?: string;

  /** Class names applied to the `<ul>` nav bar. */
  navClassName?: string;

  /** Class names applied to the tab content wrapper. */
  contentClassName?: string;

  /** Class names applied to the tab header row. */
  headerClassName?: string;

  /** Action buttons rendered on the right side of the tab header row. */
  headerActions?: React.ReactNode;

  /** Optional sub-header slot rendered directly beneath the tabs. */
  headerBottomSlot?: React.ReactNode;

  /** Initial 0-indexed active tab when uncontrolled. Defaults to 0. */
  defaultActiveIndex?: number;

  /** Controlled 0-indexed active tab index. */
  activeIndex?: number;

  /** Callback fired when a tab is clicked with the newly selected index. */
  onTabChange?: (index: number) => void;
}

/**
 * Bootstrap tabbed navigation component with support for tabs, pills, and underline variants,
 * controlled or uncontrolled active index, and extra header action slots.
 */
export default function NavTab({
  id,
  items,
  variant = "tabs",
  fill = false,
  justify = false,
  className = "",
  navClassName = "",
  contentClassName = "",
  headerClassName = "",
  headerActions,
  headerBottomSlot,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onTabChange,
}: NavTabProps) {
  const generatedId = useId();
  const tabId = id || `nav-tab-${generatedId.replace(/:/g, "")}`;
  const [internalActiveIndex, setInternalActiveIndex] =
    useState(defaultActiveIndex);
  const activeIndex =
    controlledActiveIndex !== undefined
      ? controlledActiveIndex
      : internalActiveIndex;

  const handleTabClick = (index: number) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onTabChange?.(index);
  };

  if (!items || items.length === 0) {
    return (
      <div className={`text-center py-3 text-muted ${className}`}>
        No tabs items provided.
      </div>
    );
  }

  // Construct class names for the nav element
  const navClasses = [
    "nav",
    `nav-${variant}`,
    fill ? "nav-fill" : "",
    justify ? "nav-justified" : "",
    navClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const navList = (
    <ul className={navClasses} id={tabId} role="tablist">
      {items.map((item, index) => {
        const itemTabId = item.id || `${tabId}-tab-${index}`;
        const itemPaneId = `${itemTabId}-pane`;
        const isActive = index === activeIndex;

        return (
          <li className="nav-item" role="presentation" key={index}>
            <button
              className={`nav-link ${isActive ? "active" : ""}`}
              id={itemTabId}
              data-bs-toggle="tab"
              data-bs-target={`#${itemPaneId}`}
              type="button"
              role="tab"
              aria-controls={itemPaneId}
              aria-selected={isActive ? "true" : "false"}
              disabled={item.disabled}
              onClick={() => handleTabClick(index)}
            >
              {item.title}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={className}>
      {headerActions ? (
        <div
          className={`d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 ${headerClassName}`}
        >
          {navList}
          <div className="tab-header-actions ms-auto">{headerActions}</div>
        </div>
      ) : (
        navList
      )}
      {headerBottomSlot && (
        <div className="tab-header-bottom mt-2 mb-3">{headerBottomSlot}</div>
      )}
      <div
        className={`tab-content ${headerActions || headerBottomSlot ? "" : "mt-3"} ${contentClassName}`}
        id={`${tabId}-content`}
      >
        {items.map((item, index) => {
          const itemTabId = item.id || `${tabId}-tab-${index}`;
          const itemPaneId = `${itemTabId}-pane`;
          const isActive = index === activeIndex;

          return (
            <div
              className={`tab-pane fade ${isActive ? "show active" : ""}`}
              id={itemPaneId}
              role="tabpanel"
              aria-labelledby={itemTabId}
              tabIndex={0}
              key={index}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
