"use client";

import React, { useId, useState } from "react";

export interface NavTabItem {
  id?: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface NavTabProps {
  id?: string;
  items: NavTabItem[];
  variant?: "tabs" | "pills" | "underline";
  fill?: boolean;
  justify?: boolean;
  className?: string;
  navClassName?: string;
  contentClassName?: string;
  defaultActiveIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
}

export default function NavTab({
  id,
  items,
  variant = "tabs",
  fill = false,
  justify = false,
  className = "",
  navClassName = "",
  contentClassName = "",
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

  return (
    <div className={className}>
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
      <div
        className={`tab-content mt-3 ${contentClassName}`}
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
