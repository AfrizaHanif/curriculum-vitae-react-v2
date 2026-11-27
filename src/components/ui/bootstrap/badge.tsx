"use client";

import React from "react";

/**
 * Props for the {@link Badge} indicator component.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Bootstrap contextual theme color (`"primary"`, `"secondary"`, `"success"`, etc.). */
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | (string & {});

  /** Renders subtle pastel background with emphasized text (e.g. `bg-primary-subtle text-primary-emphasis`). */
  subtle?: boolean;

  /** Applies pill borders (`rounded-pill`). */
  pill?: boolean;

  /** Alias for `pill`. */
  rounded?: boolean;

  /** Additional CSS class names. */
  className?: string;

  /** Inline CSS styles. */
  style?: React.CSSProperties;

  /** Badge content label or count. */
  children: React.ReactNode;
}

/**
 * Bootstrap badge component for counters, status indicators, and category labels.
 */
export default function Badge({
  color,
  subtle = false,
  pill,
  rounded,
  className = "",
  style,
  children,
  ...rest
}: BadgeProps) {
  // If color is specified, use bg-{color}. If omitted, only default to bg-primary if no custom bg-* exists in className.
  const hasCustomBg = /\bbg-/.test(className);
  const resolvedColor = color ?? (hasCustomBg ? undefined : "primary");

  let colorClasses = "";
  if (resolvedColor) {
    if (subtle) {
      colorClasses = `bg-${resolvedColor}-subtle text-${resolvedColor}-emphasis border border-${resolvedColor}-subtle`;
    } else {
      colorClasses = `bg-${resolvedColor}`;
    }
  }

  const shapeClass = pill ? "rounded-pill" : rounded ? "rounded" : "";

  const badgeClasses = `badge ${colorClasses} ${shapeClass} ${className}`
    .trim()
    .replace(/\s+/g, " ");

  return (
    <span className={badgeClasses} style={style} {...rest}>
      {children}
    </span>
  );
}
