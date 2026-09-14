"use client";

import React, { useId } from "react";

export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  show?: boolean;
}

export interface AccordionProps {
  id?: string;
  title?: string;
  className?: string;
  item: AccordionItemProps[];
}

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
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${itemCollapseId}`}
                  aria-expanded="false"
                  aria-controls={itemCollapseId}
                >
                  {accordionItem.title}
                </button>
              </h2>
              <div
                id={itemCollapseId}
                className={`accordion-collapse collapse ${accordionItem.show && "show"}`}
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
