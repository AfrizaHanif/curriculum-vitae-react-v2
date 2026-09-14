"use client";

import React from "react";

export interface SpinnerProps {
  /**
   * The animation style of the spinner.
   * Defaults to "border".
   */
  variant?: "border" | "grow";
  /**
   * Bootstrap contextual color.
   * Defaults to "primary".
   */
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
  /**
   * Predefined spinner size.
   * "sm" uses Bootstrap's -sm class (1rem).
   * "lg" expands to 3rem for prominent loading states.
   * "md" is the Bootstrap default (2rem).
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional custom CSS class.
   */
  className?: string;
  /**
   * Optional custom inline styles.
   */
  style?: React.CSSProperties;
  /**
   * Accessibility text for screen readers.
   * Defaults to "Loading...".
   */
  label?: string;
}

export default function Spinner({
  variant = "border",
  color,
  size,
  className = "",
  style,
  label = "Loading...",
}: SpinnerProps) {
  const hasCustomText = /\btext-/.test(className);
  const resolvedColor = color ?? (hasCustomText ? undefined : "primary");

  const spinnerBaseClass = variant === "grow" ? "spinner-grow" : "spinner-border";
  const colorClass = resolvedColor ? `text-${resolvedColor}` : "";
  const sizeClass = size === "sm" ? `${spinnerBaseClass}-sm` : "";

  const customStyle: React.CSSProperties = {
    ...(size === "lg" ? { width: "3rem", height: "3rem" } : {}),
    ...style,
  };

  const combinedClasses = `${spinnerBaseClass} ${colorClass} ${sizeClass} ${className}`
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div
      className={combinedClasses}
      role="status"
      style={customStyle}
    >
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
