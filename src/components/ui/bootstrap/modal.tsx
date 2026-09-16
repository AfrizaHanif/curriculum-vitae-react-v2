"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import ReactDOM from "react-dom";
import type { Modal as BootstrapModal } from "bootstrap";
import Button, { ButtonProps } from "./button";

export interface ModalButtonItem {
  label?: React.ReactNode;
  custom?: React.ReactNode;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  color?: ButtonProps["color"];
  size?: "sm" | "lg";
  disabled?: boolean;
  rounded?: boolean;
  dismiss?: boolean;
  className?: string;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
}

export interface ModalProps {
  id: string;
  /** Controls the visibility of the modal */
  show?: boolean;
  /** Callback triggered when the modal is closed */
  onClose?: () => void;
  /** Modal header title */
  title: string;
  /** Sizing class for the modal dialog */
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  buttonItems?: ModalButtonItem[];
  /** Custom footer content that takes precedence over buttonItems */
  footer?: React.ReactNode;
  /** Additional custom class names for the modal footer */
  footerClassName?: string;
  /** Modal body content */
  children: React.ReactNode;
  /** Enable fade animations */
  animation?: boolean;
  /** Enable static backdrop (no closing by clicking backdrop or pressing escape) */
  isStatic?: boolean;
  /** Make the modal vertically scrollable */
  scrollable?: boolean;
  /** Vertically center the modal */
  centered?: boolean;
  noHeader?: boolean;
  noFooter?: boolean;
  /** Additional custom class names for the outer modal container */
  className?: string;
  /** Additional custom class names for the modal body */
  bodyClassName?: string;
  /** Additional custom class names for the modal content wrapper */
  contentClassName?: string;
  style?: React.CSSProperties;
  /** Automatically reset modal and modal body scroll position when closed */
  resetScrollOnClose?: boolean;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Modal({
  id,
  show = false,
  onClose,
  title,
  size = "md",
  buttonItems,
  footer,
  footerClassName = "",
  children,
  animation = true,
  isStatic = false,
  scrollable = false,
  centered = false,
  noHeader = false,
  noFooter = false,
  className = "",
  bodyClassName = "",
  contentClassName = "",
  style,
  resetScrollOnClose = true,
}: ModalProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalInstanceRef = useRef<BootstrapModal | null>(null);

  // Synchronize modal state with Bootstrap JS API
  useEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    if (show) {
      // Dynamically import Bootstrap to avoid SSR errors in Next.js
      import("bootstrap").then((bootstrap) => {
        if (!document.body.contains(node)) return;

        const modalInstance =
          bootstrap.Modal.getInstance(node) ||
          new bootstrap.Modal(node, {
            backdrop: isStatic ? "static" : true,
            keyboard: !isStatic,
            focus: true,
          });
        modalInstanceRef.current = modalInstance;
        modalInstance.show();
      });
    } else {
      modalInstanceRef.current?.hide();
    }
  }, [show, isStatic]);

  // Handle hidden.bs.modal event fired by Bootstrap (including backdrop clicks & Esc)
  useEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    const handleHidden = () => {
      if (resetScrollOnClose) {
        node.scrollTop = 0;
        const modalBody = node.querySelector(".modal-body");
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
      }
      onClose?.();
    };

    node.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      node.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [onClose, resetScrollOnClose]);

  // Clean up modal instance and any leftover backdrop on unmount
  useEffect(() => {
    const currentInstance = modalInstanceRef.current;
    return () => {
      try {
        currentInstance?.hide();
        currentInstance?.dispose();
      } catch {}
      // Remove any lingering backdrops
      document
        .querySelectorAll(".modal-backdrop")
        .forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
    };
  }, []);

  // Synchronize backdrop z-index when a custom z-index is set
  useEffect(() => {
    const node = modalRef.current;
    if (!node) return;

    const handleShown = () => {
      if (style?.zIndex) {
        const customZ = Number(style.zIndex);
        const backdrops =
          document.querySelectorAll<HTMLElement>(".modal-backdrop");
        const lastBackdrop = backdrops[backdrops.length - 1];
        if (lastBackdrop) {
          lastBackdrop.style.zIndex = String(customZ - 5);
        }
      }
    };

    node.addEventListener("shown.bs.modal", handleShown);
    return () => {
      node.removeEventListener("shown.bs.modal", handleShown);
    };
  }, [style?.zIndex]);

  const sizeMap: Record<string, string> = {
    sm: "modal-sm",
    md: "",
    lg: "modal-lg",
    xl: "modal-xl",
    fullscreen: "modal-fullscreen",
  };
  const modalClass = sizeMap[size] || "";

  const modalElement = (
    <div
      ref={modalRef}
      id={id}
      className={`modal ${animation ? "fade" : ""} ${className}`}
      style={style}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={!noHeader ? `${id}-title` : undefined}
      data-bs-backdrop={isStatic ? "static" : "true"}
      data-bs-keyboard={!isStatic}
      aria-hidden={!show}
    >
      <div
        className={`modal-dialog ${modalClass} ${
          scrollable ? "modal-dialog-scrollable" : ""
        } ${centered ? "modal-dialog-centered" : ""}`}
      >
        <div className={`modal-content ${contentClassName}`}>
          {!noHeader && (
            <div className="modal-header">
              <h5 className="modal-title" id={`${id}-title`}>
                {title}
              </h5>
              <Button
                className="btn-close"
                dataBsDismiss="modal"
                aria-label="Close"
              />
            </div>
          )}
          <div className={`modal-body ${bodyClassName}`}>{children}</div>
          {!noFooter && (
            <div className={`modal-footer ${footerClassName}`}>
              {footer ? (
                footer
              ) : buttonItems ? (
                buttonItems.map((item, index) => {
                  if (item.custom) {
                    return (
                      <React.Fragment key={index}>
                        {item.custom}
                      </React.Fragment>
                    );
                  }

                  return (
                    <Button
                      key={index}
                      as={item.as}
                      href={item.href}
                      target={item.target}
                      rel={item.rel}
                      type={item.type}
                      color={item.color}
                      size={item.size}
                      disabled={item.disabled}
                      rounded={item.rounded}
                      className={item.className}
                      onClick={item.onClick}
                      dataBsDismiss={item.dismiss ? "modal" : undefined}
                    >
                      {item.label}
                    </Button>
                  );
                })
              ) : (
                <Button
                  color="secondary"
                  dataBsDismiss="modal"
                >
                  Close
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return ReactDOM.createPortal(modalElement, document.body);
}
