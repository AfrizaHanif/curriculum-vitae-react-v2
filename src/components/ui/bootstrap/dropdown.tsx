"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import type { Dropdown as BootstrapDropdown } from "bootstrap";
import Button, { ButtonProps } from "./button";
import Link from "next/link";

export type DropdownItem =
  | { type: "divider"; label?: string }
  | {
      label?: string;
      icon?: string;
      active?: boolean;
      href?: string;
      hrefType?: "external" | "internal";
      newTab?: boolean;
      type?: "item";
      dataBsToggle?: "modal" | "offcanvas";
      dataBsTarget?: string;
      onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
      render?: (item: DropdownItem) => React.ReactNode;
    };

export type DropdownDataSource =
  | { items: DropdownItem[]; content?: never }
  | { items?: never; content: ReactNode };

export type DropdownProps = DropdownDataSource & {
  /** The wrapper container contents (containing the toggle and menu) */
  size?: "sm" | "lg";
  direction?: "up" | "down" | "start" | "end";
  centered?: boolean;
  footer?: React.ReactNode;
  dropdownStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  buttonClass?: string;
  buttonColor?: ButtonProps["color"];
  menuClass?: string;
  showCaret?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  /** Bootstrap container class (e.g., 'dropdown', 'btn-group', 'dropup') */
  className?: string;
  /** How the dropdown closes when elements are clicked */
  autoClose?: boolean | "inside" | "outside";
  /** Overflow constraint boundary */
  boundary?: Element | Element[] | "clippingParents";
  /** Reference element for positioning */
  reference?:
    | "toggle"
    | "parent"
    | Element
    | { width: number; height: number; x: number; y: number };
  /** Offset of the dropdown menu relative to its target */
  offset?: [number, number] | string | (() => [number, number]);
};

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(
    {
      items = [],
      content,
      size,
      direction = "down",
      centered = false,
      footer,
      dropdownStyle,
      buttonStyle,
      buttonClass,
      buttonColor = "secondary",
      menuClass,
      showCaret = true,
      children,
      disabled = false,
      className,
      autoClose = true,
      boundary = "clippingParents",
      reference = "toggle",
      offset = [0, 2],
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const dropdownInstanceRef = useRef<BootstrapDropdown | null>(null);

    // Merge forwarded ref and local containerRef
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Find the toggle element with data-bs-toggle attribute inside the container
      const toggleEl = container.querySelector('[data-bs-toggle="dropdown"]');
      if (!toggleEl) return;

      let dropdownInstance: BootstrapDropdown | null = null;

      // Dynamically import Bootstrap to prevent SSR errors in Next.js
      import("bootstrap").then((bootstrap) => {
        if (!document.body.contains(toggleEl)) return;

        // Clean up any existing instances on this element
        const existing = bootstrap.Dropdown.getInstance(toggleEl);
        if (existing) {
          existing.dispose();
        }

        dropdownInstance = new bootstrap.Dropdown(toggleEl, {
          autoClose,
          boundary,
          reference,
          offset,
        });
        dropdownInstanceRef.current = dropdownInstance;
      });

      return () => {
        if (dropdownInstance) {
          dropdownInstance.dispose();
        }
        if (dropdownInstanceRef.current === dropdownInstance) {
          dropdownInstanceRef.current = null;
        }
      };
    }, [autoClose, boundary, reference, offset]);

    return (
      <div
        ref={setRefs}
        className={`${
          direction === "up"
            ? "dropup"
            : direction === "down"
              ? "dropdown"
              : direction === "start"
                ? "dropstart"
                : "dropend"
        } ${centered ? "dropdown-center" : ""} ${className || ""}`}
        style={dropdownStyle}
      >
        <Button
          color={buttonColor}
          size={size}
          className={`${showCaret ? "dropdown-toggle" : ""} ${buttonClass || ""}`}
          dataBsToggle="dropdown"
          aria-expanded="false"
          style={buttonStyle}
          disabled={disabled}
        >
          {children}
        </Button>
        <ul className={`dropdown-menu ${menuClass || ""}`}>
          {content
            ? content
            : items.map((item: DropdownItem, index: number) => {
                if (item.type === "divider") {
                  return <li key={index} className="dropdown-divider"></li>;
                }
                if (item.render) {
                  return <li key={index}>{item.render(item)}</li>;
                }
                return (
                  <li key={index}>
                    {item.onClick ? (
                      <button
                        type="button"
                        className={`dropdown-item d-flex align-items-center ${item.active ? "active" : ""}`}
                        onClick={item.onClick}
                      >
                        {item.icon && <i className={`${item.icon} me-2`}></i>}
                        <span className="flex-grow-1">{item.label}</span>
                        {item.active && <i className="bi bi-check2 ms-2"></i>}
                      </button>
                    ) : item.hrefType === "external" ? (
                      <a
                        className={`dropdown-item d-flex align-items-center ${item.active ? "active" : ""}`}
                        href={item.href ?? "#"}
                        data-bs-toggle={item.dataBsToggle}
                        data-bs-target={`#${item.dataBsTarget}`}
                        {...(item.newTab && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        {item.icon && <i className={`${item.icon} me-2`}></i>}
                        <span className="flex-grow-1">{item.label}</span>
                        {item.active && <i className="bi bi-check2 ms-2"></i>}
                      </a>
                    ) : (
                      <Link
                        className={`dropdown-item d-flex align-items-center ${item.active ? "active" : ""}`}
                        href={item.href ?? ""}
                      >
                        {item.icon && <i className={`${item.icon} me-2`}></i>}
                        <span className="flex-grow-1">{item.label}</span>
                        {item.active && <i className="bi bi-check2 ms-2"></i>}
                      </Link>
                    )}
                  </li>
                );
              })}
          {footer && (
            <>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>{footer}</li>
            </>
          )}
        </ul>
      </div>
    );
  },
);

export default Dropdown;
