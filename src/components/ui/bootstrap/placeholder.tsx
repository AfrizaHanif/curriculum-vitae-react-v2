"use client";

import React from "react";

export type PlaceholderSize = "xs" | "sm" | "lg";
export type PlaceholderAnimation = "glow" | "wave";
export type PlaceholderCol = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface PlaceholderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The underlying HTML element to render.
   * Defaults to "span".
   */
  as?: React.ElementType;
  /**
   * Column width span (1-12) corresponding to Bootstrap's .col-* utility.
   */
  col?: PlaceholderCol;
  /**
   * Predefined placeholder size.
   */
  size?: PlaceholderSize;
  /**
   * Bootstrap contextual background color or utility.
   * Defaults to "secondary" for a neutral skeleton look in light and dark modes.
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
    | "body-secondary"
    | "body-tertiary"
    | (string & {});
  /**
   * Animation style. If provided directly on the placeholder, applies animation.
   */
  animation?: PlaceholderAnimation;
  /**
   * Border radius helper (rounded pill, circle, or standard rounded sizes).
   */
  rounded?: boolean | "pill" | "circle" | 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * Custom width style, e.g. "75%", 120.
   */
  width?: string | number;
  /**
   * Custom height style, e.g. "2rem", 32.
   */
  height?: string | number;
}

export interface PlaceholderContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  animation?: PlaceholderAnimation;
  children: React.ReactNode;
}

/**
 * Container component that provides the animated glow or wave effect to child placeholders.
 */
export function PlaceholderContainer({
  as: Component = "div",
  animation = "glow",
  className = "",
  children,
  ...rest
}: PlaceholderContainerProps) {
  const animClass = animation ? `placeholder-${animation}` : "";
  return (
    <Component
      className={`${animClass} ${className}`.trim()}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Fundamental Bootstrap 5 Placeholder component for skeleton loading states.
 */
export default function Placeholder({
  as: Component = "span",
  col,
  size,
  color = "secondary",
  animation,
  rounded,
  width,
  height,
  className = "",
  style,
  children,
  ...rest
}: PlaceholderProps) {
  const colClass = col ? `col-${col}` : "";
  const sizeClass = size ? `placeholder-${size}` : "";
  const bgClass = color ? (color.startsWith("bg-") ? color : `bg-${color}`) : "";
  const animClass = animation ? `placeholder-${animation}` : "";

  let roundedClass = "";
  if (rounded === true) roundedClass = "rounded";
  else if (rounded === "pill") roundedClass = "rounded-pill";
  else if (rounded === "circle") roundedClass = "rounded-circle";
  else if (typeof rounded === "number") roundedClass = `rounded-${rounded}`;

  const customStyle: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...style,
  };

  const combinedClasses =
    `placeholder ${colClass} ${sizeClass} ${bgClass} ${animClass} ${roundedClass} ${className}`
      .trim()
      .replace(/\s+/g, " ");

  return (
    <Component
      className={combinedClasses}
      style={customStyle}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </Component>
  );
}

Placeholder.displayName = "Placeholder";
PlaceholderContainer.displayName = "PlaceholderContainer";

export function PlaceholderGlow(
  props: Omit<PlaceholderContainerProps, "animation">,
) {
  return <PlaceholderContainer animation="glow" {...props} />;
}
PlaceholderGlow.displayName = "PlaceholderGlow";

export function PlaceholderWave(
  props: Omit<PlaceholderContainerProps, "animation">,
) {
  return <PlaceholderContainer animation="wave" {...props} />;
}
PlaceholderWave.displayName = "PlaceholderWave";

Placeholder.Container = PlaceholderContainer;
Placeholder.Glow = PlaceholderGlow;
Placeholder.Wave = PlaceholderWave;
