"use client";

import React from "react";

export interface ProgressProps {
  value: number; // 0 to 100
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
  striped?: boolean;
  animated?: boolean;
  height?: string | number;
  className?: string;
  barClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

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
  const progressBarClasses = `progress-bar ${bgClass} ${stripedClass} ${animatedClass} ${barClassName}`
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
        style={{ width: `${normalizedValue}%`, transition: "width 0.2s ease-out" }}
      >
        {children}
      </div>
    </div>
  );
}
