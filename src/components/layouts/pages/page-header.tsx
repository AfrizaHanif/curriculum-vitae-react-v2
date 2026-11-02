"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/bootstrap/button";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import "@/components/layouts/home/header.css";
import Image from "next/image";
import logoWhite from "@/assets/images/logo/logo-only-white.png";
import logoBlack from "@/assets/images/logo/logo-only-black.png";

interface PageHeaderProps {
  withLogo?: boolean;
  fullname?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  withLogo = false,
  fullname,
  backHref = "/",
  backLabel,
  actions,
}: PageHeaderProps) {
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

  const backButton = (
    <Link href={backHref}>
      <Button color="outline-secondary" rounded>
        <i className="bi bi-arrow-left me-1" /> {backLabel || t.resume.back}
      </Button>
    </Link>
  );

  return (
    <header
      className={`smart-header fixed-top border-bottom ${
        isVisible ? "header-visible" : "header-hidden"
      } ${isScrolled ? "shadow-sm scrolled" : ""} d-print-none`}
    >
      <div className="container d-flex align-items-center justify-content-between py-2 py-md-3">
        {/* Left Side: Brand Logo and/or Back Button */}
        <div className="d-flex align-items-center gap-2 min-w-0">
          {withLogo && (
            <Link
              href="/"
              className="d-flex align-items-center link-body-emphasis text-decoration-none min-w-0"
            >
              <Image
                src={logoWhite}
                alt="Logo"
                width={36}
                height={36}
                className={`${fullname ? "me-2" : ""} flex-shrink-0 object-fit-contain logo-light`}
                priority
                suppressHydrationWarning
              />
              <Image
                src={logoBlack}
                alt="Logo"
                width={36}
                height={36}
                className={`${fullname ? "me-2" : ""} flex-shrink-0 object-fit-contain logo-dark`}
                priority
                suppressHydrationWarning
              />
              {fullname && (
                <span className="fs-5 fs-md-4 fw-bold text-truncate d-none d-sm-inline">
                  {fullname}
                </span>
              )}
            </Link>
          )}

          {/* Back button next to logo when no fullname, or on left when no logo */}
          {(!withLogo || !fullname) && backButton}
        </div>

        {/* Right Side: Back Button (if withLogo and fullname present) + Actions */}
        <div className="d-flex align-items-center gap-2">
          {withLogo && fullname && backButton}
          {actions}
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
