"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import "@/components/layouts/home/header.css";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { ProfileApiResponse } from "@/types/profile";
import fallbackProfiles from "@/data/jsons/profiles.json";
import Image from "next/image";
import logoWhite from "@/assets/images/logo/logo-only-white.png";
import logoBlack from "@/assets/images/logo/logo-only-black.png";

export default function ErrorHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch API Data
  const { data } = useFetch<ProfileApiResponse>(
    `https://api.afrizahanif.com/api/profiles`,
    { fallbackData: { data: fallbackProfiles } },
  );
  const profile = data?.data?.[0];

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
      className={`smart-header sticky-top border-bottom ${
        isVisible ? "header-visible" : "header-hidden"
      } ${isScrolled ? "shadow-sm scrolled" : ""} d-print-none`}
    >
      <div className="container d-flex align-items-center justify-content-between py-2 py-md-3">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="d-flex align-items-center link-body-emphasis text-decoration-none min-w-0 me-2"
        >
          <Image
            src={logoWhite}
            alt="Logo"
            width={36}
            height={36}
            className="me-2 flex-shrink-0 object-fit-contain logo-light"
            priority
          />
          <Image
            src={logoBlack}
            alt="Logo"
            width={36}
            height={36}
            className="me-2 flex-shrink-0 object-fit-contain logo-dark"
            priority
          />
          <span className="fs-5 fs-md-4 fw-bold text-truncate d-none d-sm-inline">
            {profile?.fullname || "Muhammad Afriza Hanif"}
          </span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
