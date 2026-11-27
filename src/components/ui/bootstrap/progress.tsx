"use client";

import React from "react";

/**
 * Props for the {@link Progress} bar component.
 */
export interface ProgressProps {
  /** Numeric progress percentage between 0 and 100. */
  value: number;

  /** Contextual background color for the progress bar. Defaults to `"primary"`. */
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

  /** Applies striped pattern styling to the progress bar (`progress-bar-striped`). */
  striped?: boolean;

  /** Animates the striped pattern (`progress-bar-animated`). */
  animated?: boolean;

  /** Fixed height for the progress container (e.g. `"8px"`, `12`). */
  height?: string | number;

  /** Additional CSS class names applied to the outer `.progress` container. */
  className?: string;

  /** Additional CSS class names applied to the inner `.progress-bar` fill element. */
  barClassName?: string;

  /** Inline CSS styles. */
  style?: React.CSSProperties;

  /** Label or text content rendered inside the progress bar. */
  children?: React.ReactNode;
}

/**
 * Bootstrap progress bar component for displaying completion ratios, skill percentages,
 * and loading progress with support for stripes and animation.
 */
export default function Progress({
  value,
  color,
  striped = false,
  animated = false,
  height,
  className = "",
  barClassName = "",
  style,
  children,
}: ProgressProps) {
  // Normalize value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));

  const hasCustomBg = /\bbg-/.test(barClassName);
  const resolvedColor = color ?? (hasCustomBg ? undefined : "primary");
  const bgClass = resolvedColor ? `bg-${resolvedColor}` : "";
  const stripedClass = striped ? "progress-bar-striped" : "";
  const animatedClass = animated ? "progress-bar-animated" : "";

  const progressClasses = `progress ${className}`.trim().replace(/\s+/g, " ");
  const progressBarClasses =
    `progress-bar ${bgClass} ${stripedClass} ${animatedClass} ${barClassName}`
      .trim()
      .replace(/\s+/g, " ");

  return (
    <div
      className={progressClasses}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ height, ...style }}
    >
      <div
        className={progressBarClasses}
        style={{
          width: `${normalizedValue}%`,
          transition: "width 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
