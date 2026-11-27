"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

/**
 * Props for the {@link Alert} notification component.
 */
export interface AlertProps {
  /** Bootstrap alert contextual color (`"primary"`, `"danger"`, `"success"`, etc.). */
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

  /** Optional icon prefix (Bootstrap icon class name e.g. `"bi-check-circle"` or a custom React node). */
  icon?: string | React.ReactNode;

  /** Allows the user to close the alert with an 'X' button. */
  dismissable?: boolean;

  /** Alias for `dismissable`. */
  dismissible?: boolean;

  /** Enables fade out animation on dismiss. Defaults to `true`. */
  fade?: boolean;

  /** Alias for `fade`. */
  animation?: boolean;

  /** Controlled open visibility flag. Defaults to `true`. */
  show?: boolean;

  /** Alert message or inner elements. */
  children: React.ReactNode;

  /** Additional CSS class names. */
  className?: string;

  /** Inline CSS styles. */
  style?: React.CSSProperties;

  /** Callback fired after the alert is closed. */
  onClose?: () => void;
}

/**
 * Reusable Bootstrap alert banner component.
 * Supports dismissal animations, icons, and contextual color themes.
 */
export default function Alert({
  color,
  dismissable = false,
  dismissible,
  fade = true,
  animation,
  show = true,
  icon,
  children,
  className = "",
  style,
  onClose,
}: AlertProps) {
  const isDismissible = dismissable || dismissible || false;
  const isAnimated = animation ?? fade ?? true;

  const [isClosing, setIsClosing] = useState(false);
  const [isClosed, setIsClosed] = useState(!show);
  const [prevProps, setPrevProps] = useState({ show, children });
  const alertRef = useRef<HTMLDivElement | null>(null);

  // Adjust state directly during render when props change (avoids cascading effect renders)
  if (prevProps.show !== show || prevProps.children !== children) {
    setPrevProps({ show, children });
    setIsClosing(false);
    setIsClosed(!show);
  }

  const handleClose = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (isClosing || isClosed) return;

      const node = alertRef.current;
      if (node) {
        const closeEvent = new CustomEvent("close.bs.alert", {
          bubbles: true,
          cancelable: true,
        });
        node.dispatchEvent(closeEvent);
        if (closeEvent.defaultPrevented) return;
      }

      if (!isAnimated) {
        if (node) {
          node.dispatchEvent(
            new CustomEvent("closed.bs.alert", { bubbles: true }),
          );
        }
        setIsClosed(true);
        onClose?.();
        return;
      }

      setIsClosing(true);
    },
    [isAnimated, isClosing, isClosed, onClose],
  );

  useEffect(() => {
    if (!isClosing) return;

    const node = alertRef.current;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (node) {
        node.dispatchEvent(
          new CustomEvent("closed.bs.alert", { bubbles: true }),
        );
      }
      setIsClosed(true);
      onClose?.();
    };

    if (!node) {
      finish();
      return;
    }

    // Determine transition duration from computed styles or fallback to 150ms
    const styles = window.getComputedStyle(node);
    const duration = parseFloat(styles.transitionDuration) || 0;
    const delay = parseFloat(styles.transitionDelay) || 0;
    const totalMs = (duration + delay) * 1000 || 150;

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target === node && e.propertyName === "opacity") {
        finish();
      }
    };

    node.addEventListener("transitionend", handleTransitionEnd);
    const timer = setTimeout(finish, totalMs + 50);

    return () => {
      node.removeEventListener("transitionend", handleTransitionEnd);
      clearTimeout(timer);
    };
  }, [isClosing, onClose]);

  if (isClosed) {
    return null;
  }

  const hasCustomAlert = /\balert-/.test(className);
  const resolvedColor = color ?? (hasCustomAlert ? undefined : "primary");
  const colorClass = resolvedColor ? `alert-${resolvedColor}` : "";

  const alertClasses = [
    "alert",
    colorClass,
    isDismissible ? "alert-dismissible" : "",
    isAnimated ? "fade" : "",
    !isClosing ? "show" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "string") {
      if (icon.startsWith("bi-")) {
        return <i className={`bi ${icon} flex-shrink-0 me-2`} />;
      }
      return (
        <svg className="bi flex-shrink-0 me-2" role="img" aria-label={icon}>
          <use xlinkHref={icon} />
        </svg>
      );
    }
    return <span className="flex-shrink-0 me-2 d-inline-flex">{icon}</span>;
  };

  return (
    <div ref={alertRef} className={alertClasses} style={style} role="alert">
      {renderIcon()}
      {children}
      {isDismissible && (
        <button
          suppressHydrationWarning
          type="button"
          className="btn-close"
          onClick={handleClose}
          aria-label="Close"
        />
      )}
    </div>
  );
}
