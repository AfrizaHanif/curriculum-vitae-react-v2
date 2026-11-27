"use client";

import React, { useId } from "react";

/**
 * Configuration for an individual accordion panel item.
 */
export interface AccordionItemProps {
  /** Unique ID for the accordion collapsible panel. */
  id: string;

  /** Title or header node displayed in the accordion toggle button. */
  title: React.ReactNode;

  /** Content rendered inside `<div className="accordion-body">`. */
  content: React.ReactNode;

  /** Initial expanded state. Defaults to false (collapsed). */
  show?: boolean;
}

/**
 * Props for the {@link Accordion} component.
 */
export interface AccordionProps {
  /** Optional HTML element ID for the accordion container. */
  id?: string;

  /** Optional heading title displayed above the accordion. */
  title?: string;

  /** Additional CSS class names. */
  className?: string;

  /** Array of accordion items to render. */
  item: AccordionItemProps[];
}

/**
 * Bootstrap accordion component rendering collapsible content panels
 * with synchronized single-panel expansion (`data-bs-parent`).
 */
export default function Accordion({
  id,
  title,
  className,
  item,
}: AccordionProps) {
  const generatedId = useId();
  // Safe element ID (removing colons from useId for HTML compatibility)
  const accordionId = id || `accordion-${generatedId.replace(/:/g, "")}`;

  return (
    <div className={`accordion ${className || ""}`} id={accordionId}>
      {title && <h3 className="accordion-title mb-3">{title}</h3>}
      {item && item.length > 0 ? (
        item.map((accordionItem, index) => {
          const itemCollapseId =
            accordionItem.id || `${accordionId}-collapse-${index}`;

          return (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${!accordionItem.show ? "collapsed" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${itemCollapseId}`}
                  aria-expanded={accordionItem.show ? "true" : "false"}
                  aria-controls={itemCollapseId}
                >
                  {accordionItem.title}
                </button>
              </h2>
              <div
                id={itemCollapseId}
                className={`accordion-collapse collapse ${accordionItem.show ? "show" : ""}`}
                data-bs-parent={`#${accordionId}`}
              >
                <div className="accordion-body">{accordionItem.content}</div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-muted text-center py-3">
          No accordion items provided.
        </p>
      )}
    </div>
  );
}
