import React from "react";
import './section.css';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  minFullHeight?: boolean; // toggle min-vh-100
  centered?: boolean; // toggle flex center alignment
  container?: boolean; // auto wrap inside <div className="container">
  children: React.ReactNode;
  className?: string;
  overflow?: "hidden" | "visible" | "clip" | "auto";
}

export default function Section({
  id,
  minFullHeight,
  centered = true,
  container = true,
  children,
  className = "",
  overflow = "hidden",
  style,
  ...props
}: SectionProps) {
  const sectionClasses = [
    "position-relative",
    overflow === "hidden" ? "overflow-hidden" : "",
    "w-100",
    minFullHeight ? "min-vh-100" : "",
    centered && "d-flex align-items-center justify-content-center",
    "px-2 px-sm-3 py-4 py-md-5", // baseline responsive padding protection
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={id}
      className={sectionClasses}
      style={{
        ...(overflow !== "hidden" ? { overflow } : {}),
        ...style,
      }}
      {...props}
    >
      {container ? <div className="container">{children}</div> : children}
    </section>
  );
}
