"use client";

import { useEffect, useState } from "react";
import Button from "../bootstrap/button";
import { useLanguage } from "@/context/LanguageContext";

export default function ScrollToTop() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 350);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const tooltipText = t.ui.scrollToTop;

  return (
    <div
      className="position-fixed bottom-0 end-0 m-3 m-md-4"
      style={{
        zIndex: 1040,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.8)",
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Button
        color="primary"
        onClick={scrollToTop}
        className="rounded-circle shadow-lg d-flex align-items-center justify-content-center p-0 border border-2 border-white"
        style={{
          width: "44px",
          height: "44px",
          backdropFilter: "blur(8px)",
        }}
        dataBsToggle="tooltip"
        dataBsPlacement="left"
        dataBsTitle={tooltipText}
        aria-label={tooltipText}
      >
        <i className="bi bi-arrow-up fs-5" />
      </Button>
    </div>
  );
}
