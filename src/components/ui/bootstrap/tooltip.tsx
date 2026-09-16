"use client";

import React, { useEffect, useRef } from "react";
import type { Tooltip as BootstrapTooltip } from "bootstrap";

interface TooltipProps {
  children: React.ReactElement;
  title: string;
  placement?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  children,
  title,
  placement = "top",
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipInstanceRef = useRef<BootstrapTooltip | null>(null);

  const child = React.Children.only(children) as React.ReactElement<{
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    ref?: React.Ref<HTMLElement>;
  }>;

  const isDisabled =
    child.props.disabled ||
    (typeof child.props.className === "string" &&
      child.props.className.split(" ").includes("disabled"));

  useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    let active = true;
    let tooltipInstance: BootstrapTooltip | null = null;

    // Dynamically import Bootstrap to prevent SSR errors
    import("bootstrap").then((bootstrap) => {
      if (!active) return;
      // Check if node is still connected/rendered
      if (!document.body.contains(node)) return;

      // Dispose of any existing instance on this node to prevent duplicates
      const existing = bootstrap.Tooltip.getInstance(node);
      if (existing) {
        existing.dispose();
      }

      tooltipInstance = new bootstrap.Tooltip(node, {
        title,
        placement,
        trigger: "hover focus",
      });
      tooltipInstanceRef.current = tooltipInstance;
    });

    return () => {
      active = false;
      if (tooltipInstance) {
        tooltipInstance.dispose();
      }
      if (tooltipInstanceRef.current === tooltipInstance) {
        tooltipInstanceRef.current = null;
      }
    };
  }, [title, placement, isDisabled]);

  const wrappedChild = React.cloneElement(child, {
    style: {
      ...child.props.style,
      // ...(isDisabled ? { pointerEvents: "none" } : {}),
    },
  });

  return (
    <span
      ref={triggerRef as React.Ref<HTMLSpanElement>}
      className="d-inline-block"
      // style={{ cursor: isDisabled ? "not-allowed" : "default" }}
    >
      {wrappedChild}
    </span>
  );
}
