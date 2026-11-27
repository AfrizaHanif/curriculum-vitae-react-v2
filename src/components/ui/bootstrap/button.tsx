"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import Tooltip from "./tooltip";
import Popover from "./popover";

/**
 * Props for the {@link Button} component, extending standard ARIA attributes.
 */
export interface ButtonProps extends React.AriaAttributes {
  /** Optional HTML element ID. */
  id?: string;

  /** HTML tab index for keyboard navigation. */
  tabIndex?: number;

  /** Standard tooltip/hover text title attribute. */
  title?: string;

  /** Render element tag: `"button"` for `<button>` or `"a"` for Next.js `<Link>`. Defaults to `"button"`. */
  as?: "button" | "a";

  /** Bootstrap button color or outline variant (e.g. `"primary"`, `"outline-secondary"`). */
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "link"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-warning"
    | "outline-info"
    | "outline-light"
    | "outline-dark"
    | (string & {});

  /** Bootstrap button size: `"sm"` (small) or `"lg"` (large). */
  size?: "sm" | "lg";

  /** HTML button type attribute (`"button"` | `"submit"` | `"reset"`). */
  type?: "button" | "submit" | "reset";

  /** Associated HTML form ID when button resides outside `<form>`. */
  form?: string;

  /** Disables click interactions and applies disabled styling. */
  disabled?: boolean;

  /** Suppress React hydration mismatch warnings on the button element (useful for dynamic client states like loading). */
  suppressHydrationWarning?: boolean;

  /** URL destination when `as="a"`, rendered using Next.js `Link`. */
  href?: string;

  /** Next.js Link scroll behavior flag. */
  scroll?: boolean;

  /** Link target attribute (e.g. `"_blank"`). */
  target?: string;

  /** Link relationship attribute (e.g. `"noopener noreferrer"`). */
  rel?: string;

  /** Expands button to 100% width (`w-100`). */
  fullWidth?: boolean;

  /** Applies pill rounded borders (`rounded-pill`). */
  rounded?: boolean;

  /** Bootstrap data toggle action. */
  dataBsToggle?: "tooltip" | "modal" | "popover" | "offcanvas" | "dropdown";

  /** Target modal, offcanvas, or collapse selector (e.g. `"#my-modal"`). */
  dataBsTarget?: string;

  /** Custom tracking or categorization subject. */
  dataBsSubject?: string;

  /** Tooltip or popover placement direction. */
  dataBsPlacement?: "top" | "bottom" | "left" | "right";

  /** Title text for Bootstrap tooltip or popover. */
  dataBsTitle?: string;

  /** Body content for Bootstrap popover. */
  dataBsContent?: string | React.ReactNode;

  /** Trigger event for popover (`"hover"` | `"focus"` | `"click"`). */
  dataBsTrigger?: "hover" | "focus" | "click";

  /** Bootstrap dismiss target (`"modal"` | `"offcanvas"`). */
  dataBsDismiss?: "modal" | "offcanvas";

  /** Custom CSS class applied to Bootstrap popover/tooltip element. */
  dataBsCustomClass?: string;

  /** Click event handler. */
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;

  /** Inline CSS styles. */
  style?: React.CSSProperties;

  /** Additional CSS class names. */
  className?: string;

  /** Button label or nested icon/elements. */
  children?: React.ReactNode;
}

/**
 * Polymorphic Bootstrap button component.
 * Can render either as a native `<button>` or a Next.js `<Link>` with integrated
 * tooltips, popovers, and Bootstrap modal toggles.
 */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      as = "button",
      color,
      size,
      type = "button",
      form,
      disabled = false,
      suppressHydrationWarning = true,
      href,
      scroll,
      target,
      rel,
      fullWidth = false,
      rounded = false,
      dataBsToggle,
      dataBsTarget,
      dataBsSubject,
      dataBsTitle,
      dataBsPlacement,
      dataBsContent,
      dataBsTrigger,
      dataBsDismiss,
      dataBsCustomClass,
      onClick,
      style,
      className = "",
      children,
      id,
      tabIndex,
      title,
      ...ariaProps
    },
    ref,
  ) {
    const hasCustomBtn = /\bbtn-/.test(className);
    const resolvedColor = color ?? (hasCustomBtn ? undefined : "primary");
    const colorClass = resolvedColor ? `btn-${resolvedColor}` : "";
    const sizeClass = size ? `btn-${size}` : "";
    const roundedClass = rounded ? "rounded-pill" : "";
    const fullWidthClass = fullWidth ? "w-100" : "";
    const disabledClass = disabled ? "disabled" : "";

    const combinedClasses =
      `btn ${colorClass} ${sizeClass} ${roundedClass} ${fullWidthClass} ${disabledClass} ${className}`
        .trim()
        .replace(/\s+/g, " ");

    const content =
      as === "a" || href ? (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          id={id}
          tabIndex={tabIndex}
          title={title}
          href={href || "#"}
          scroll={scroll}
          target={target}
          rel={rel}
          className={combinedClasses}
          style={disabled ? { ...style, pointerEvents: "none" } : style}
          data-bs-toggle={dataBsToggle}
          data-bs-target={dataBsTarget}
          data-bs-title={dataBsTitle}
          data-bs-trigger={dataBsTrigger}
          data-bs-dismiss={dataBsDismiss}
          suppressHydrationWarning={suppressHydrationWarning}
          {...ariaProps}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              return;
            }
            if (dataBsToggle === "modal" && dataBsSubject) {
              window.dispatchEvent(
                new CustomEvent("set-lead-modal-subject", {
                  detail: dataBsSubject,
                }),
              );
            }
            if (onClick) onClick(e);
          }}
        >
          {children}
        </Link>
      ) : (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          id={id}
          tabIndex={tabIndex}
          title={title}
          className={combinedClasses}
          style={disabled ? { ...style, pointerEvents: "none" } : style}
          type={type}
          form={form}
          disabled={disabled}
          suppressHydrationWarning={suppressHydrationWarning}
          data-bs-toggle={dataBsToggle}
          data-bs-target={dataBsTarget}
          data-bs-title={dataBsTitle}
          data-bs-trigger={dataBsTrigger}
          data-bs-dismiss={dataBsDismiss}
          {...ariaProps}
          onClick={(e) => {
            if (dataBsToggle === "modal" && dataBsSubject) {
              window.dispatchEvent(
                new CustomEvent("set-lead-modal-subject", {
                  detail: dataBsSubject,
                }),
              );
            }
            if (onClick) onClick(e);
          }}
        >
          {children}
        </button>
      );

    if (dataBsToggle === "tooltip") {
      if (disabled) {
        return (
          <Tooltip
            title={dataBsTitle as string}
            placement={dataBsPlacement}
            customClass={dataBsCustomClass}
          >
            <span
              className="d-inline-block"
              style={{ cursor: "not-allowed", pointerEvents: "auto" }}
            >
              {content}
            </span>
          </Tooltip>
        );
      }

      return (
        <Tooltip
          title={dataBsTitle as string}
          placement={dataBsPlacement}
          customClass={dataBsCustomClass}
        >
          {content}
        </Tooltip>
      );
    }

    if (dataBsToggle === "popover") {
      const popoverContent = dataBsContent || "";
      const popoverTrigger = dataBsTrigger || "click";

      if (disabled) {
        return (
          <Popover
            title={dataBsTitle}
            content={popoverContent}
            placement={dataBsPlacement}
            trigger={popoverTrigger}
          >
            <span
              className="d-inline-block"
              style={{ cursor: "not-allowed", pointerEvents: "auto" }}
            >
              {content}
            </span>
          </Popover>
        );
      }

      return (
        <Popover
          title={dataBsTitle}
          content={popoverContent}
          placement={dataBsPlacement}
          trigger={popoverTrigger}
        >
          {content}
        </Popover>
      );
    }

    return content;
  },
);

/**
 * Props for the {@link ButtonGroup} component.
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bootstrap button group size: `"sm"` or `"lg"`. */
  size?: "sm" | "lg";

  /** Renders buttons vertically stacked (`btn-group-vertical`). Defaults to `false`. */
  vertical?: boolean;

  /** ARIA role for the group. Defaults to `"group"`. */
  role?: string;

  /** Accessibility label for the group. */
  "aria-label"?: string;

  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * Bootstrap button group component (`btn-group` or `btn-group-vertical`)
 * for grouping a series of buttons, checkboxes, or radio toggle buttons.
 */
export function ButtonGroup({
  size,
  vertical = false,
  role = "group",
  className = "",
  children,
  ...rest
}: ButtonGroupProps) {
  const baseClass = vertical ? "btn-group-vertical" : "btn-group";
  const sizeClass = size ? `btn-group-${size}` : "";

  return (
    <div
      role={role}
      className={[baseClass, sizeClass, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

// Attach ButtonGroup as static property for Button.Group usage pattern
type ButtonComponent = typeof Button & {
  Group: typeof ButtonGroup;
};

(Button as ButtonComponent).Group = ButtonGroup;

export default Button as ButtonComponent;
