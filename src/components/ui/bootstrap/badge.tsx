"use client";

import React from "react";

export interface BadgeProps {
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
  pill?: boolean;
  rounded?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function Badge({
  color,
  pill,
  rounded,
  className = "",
  style,
  children,
}: BadgeProps) {
  // If color is specified, use bg-{color}. If omitted, only default to bg-primary if no custom bg-* exists in className.
  const hasCustomBg = /\bbg-/.test(className);
  const resolvedColor = color ?? (hasCustomBg ? undefined : "primary");
  const bgClass = resolvedColor ? `bg-${resolvedColor}` : "";
  const shapeClass = pill ? "rounded-pill" : rounded ? "rounded" : "";

  const badgeClasses = `badge ${bgClass} ${shapeClass} ${className}`
    .trim()
    .replace(/\s+/g, " ");

  return (
    <span className={badgeClasses} style={style}>
      {children}
    </span>
  );
}
