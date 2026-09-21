"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/bootstrap/button";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import "@/components/layouts/home/header.css";

interface ResumeHeaderProps {
  fullname?: string;
  originalPdfUrl?: string | null;
  onPrint: () => void;
}

export default function PageHeader({
  originalPdfUrl,
  onPrint,
}: ResumeHeaderProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll Effect (Auto-Hide Header)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const HIDE_THRESHOLD = 50;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 20);

          if (currentScrollY < HIDE_THRESHOLD) {
            setIsVisible(true);
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`smart-header fixed-top border-bottom ${
        isVisible ? "header-visible" : "header-hidden"
      } ${isScrolled ? "shadow-sm scrolled" : ""} d-print-none`}
    >
      <div className="container d-flex align-items-center justify-content-between py-2 py-md-3">
        {/* Back Button */}
        <Link href="/">
          <Button color="outline-secondary" rounded>
            <i className="bi bi-arrow-left me-1" /> {t.resume.back}
          </Button>
        </Link>

        {/* Actions */}
        <div className="d-flex align-items-center gap-2">
          {originalPdfUrl && (
            <Button
              as="a"
              href={originalPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="outline-secondary"
              className="d-none d-md-flex align-items-center gap-1"
              rounded
            >
              <i className="bi bi-file-earmark-arrow-down" />
              <span>{t.resume.originalPdf}</span>
            </Button>
          )}
          <Button color="primary" rounded onClick={onPrint}>
            <i className="bi bi-printer me-1" /> {t.resume.printPdf}
          </Button>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
