"use client";

import { useEffect, useState } from "react";
import Spinner from "../bootstrap/spinner";

import { useLanguage } from "@/context/LanguageContext";

interface PageLoaderProps {
  minDuration?: number; // Minimum time in ms to prevent jarring flash
}

export default function PageLoader({ minDuration = 400 }: PageLoaderProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    let completeTimer: ReturnType<typeof setTimeout> | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const handleComplete = () => {
      completeTimer = setTimeout(() => {
        setIsVisible(false);
      }, minDuration);
    };

    if (document.readyState === "complete") {
      handleComplete();
    } else {
      window.addEventListener("load", handleComplete);
      fallbackTimer = setTimeout(handleComplete, 2500);
    }

    return () => {
      window.removeEventListener("load", handleComplete);
      if (completeTimer) clearTimeout(completeTimer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [minDuration]);

  if (!isRendered) return null;

  return (
    <div
      onTransitionEnd={() => {
        if (!isVisible) {
          setIsRendered(false);
        }
      }}
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(var(--bs-body-bg-rgb, 255, 255, 255), 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "all" : "none",
        transition:
          "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.4s ease",
      }}
      aria-hidden={!isVisible}
    >
      <div className="text-center">
        <Spinner variant="border" color="primary" size="lg" className="mb-3" />
        <p className="text-body-secondary small fw-medium mb-0">
          {t.ui.pageLoader}
        </p>
      </div>
    </div>
  );
}
