"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import "./header.css";
import ThemeToggle from "../ThemeToggle";
import LanguageToggle from "../LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigation } from "@/context/NavigationContext";
import { useFetch } from "@/hooks/useFetch";
import fallbackProfiles from "@/data/jsons/profiles.json";
import { ProfileApiResponse } from "@/types/profile";
import Offcanvas from "../ui/bootstrap/offcanvas";
import Image from "next/image";
import Button from "../ui/bootstrap/button";
import logoWhite from "@/assets/images/logo/logo-only-white.png";
import logoBlack from "@/assets/images/logo/logo-only-black.png";

export default function Header() {
  const { t } = useLanguage();
  const { activeSection, availableSections, sectionConfig, scrollToSection } =
    useNavigation();

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data } = useFetch<ProfileApiResponse>(
    `https://api.afrizahanif.com/api/profiles`,
    { fallbackData: { data: fallbackProfiles } },
  );
  const profile = data?.data?.[0];

  useEffect(() => {
    if (!headerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const height =
          entry.borderBoxSize?.[0]?.blockSize ?? entry.target.clientHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`,
        );
      }
    });

    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const HIDE_THRESHOLD = 80;

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

  const handleNavClick = (id: string) => {
    setShowOffcanvas(false);
    scrollToSection(id);
  };

  const visibleMenuItems = sectionConfig.filter((cfg) =>
    availableSections.length > 0 ? availableSections.includes(cfg.id) : true,
  );

  return (
    <>
      <div
        ref={headerRef}
        className={`smart-header fixed-top ${
          isVisible ? "header-visible" : "header-hidden"
        } ${isScrolled ? "shadow-sm scrolled" : ""}`}
      >
        <div className="container">
          <header className="d-flex align-items-center justify-content-between py-3">
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

            {/* Desktop Navigation (Screens >= 1200px / xl) */}
            <div className="d-none d-xl-flex align-items-center gap-2">
              {profile?.resume && (
                <Button
                  as="a"
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="outline-secondary"
                  rounded
                  className="px-3"
                >
                  {t.header.viewCv}
                </Button>
              )}
              <Button
                type="button"
                color="primary"
                rounded
                className="px-3"
                onClick={() => scrollToSection("contact")}
              >
                {t.header.contactMe}
              </Button>
              <ThemeToggle />
              <LanguageToggle />
            </div>

            {/* Mobile & Tablet Toggle Bar (Screens < 1200px) */}
            <div className="d-flex d-xl-none align-items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <LanguageToggle />
              <Button
                type="button"
                color="outline-secondary"
                className="p-2 d-inline-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
                onClick={() => setShowOffcanvas(true)}
                aria-label="Open navigation menu"
                rounded
              >
                <i className="bi bi-list fs-4" />
              </Button>
            </div>
          </header>
        </div>
      </div>

      {/* Offcanvas Drawer for Mobile, Tablet & Small Laptops */}
      <Offcanvas
        id="mobile-nav-offcanvas"
        show={showOffcanvas}
        onClose={() => setShowOffcanvas(false)}
        placement="end"
        style={{ width: "min(85vw, 340px)" }}
        title={
          <div className="d-flex align-items-center gap-2 min-w-0">
            <Image
              src={logoWhite}
              alt="Logo"
              width={24}
              height={24}
              className="me-2 flex-shrink-0 object-fit-contain logo-light"
            />
            <Image
              src={logoBlack}
              alt="Logo"
              width={24}
              height={24}
              className="me-2 flex-shrink-0 object-fit-contain logo-dark"
            />
            <span className="fw-bold text-truncate small">
              {profile?.fullname || "Menu"}
            </span>
          </div>
        }
      >
        <div className="d-flex flex-column h-100 py-2">
          {/* Navigation Links (Synced with side-nav) */}
          <div className="list-group list-group-flush mb-4">
            {visibleMenuItems.map((item) => {
              const label =
                t.sideNav[item.id as keyof typeof t.sideNav] || item.id;
              const isActive = activeSection === item.id;
              return (
                <Button
                  key={item.id}
                  type="button"
                  className={`list-group-item list-group-item-action py-3 px-3 d-flex align-items-center gap-3 border-0 rounded-3 text-body ${
                    isActive ? "bg-primary-subtle text-primary fw-bold" : ""
                  }`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <i className={`bi ${item.icon} fs-5 text-primary`} />
                  <span className="fw-semibold">{label}</span>
                  <i className="bi bi-chevron-right ms-auto text-body-tertiary small" />
                </Button>
              );
            })}
          </div>

          {/* Action Buttons in Offcanvas */}
          <div className="d-flex flex-column gap-2 mt-auto pt-3 border-top">
            {profile?.resume && (
              <Button
                as="a"
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                color="outline-primary"
                rounded
                className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-file-earmark-person-fill" />
                <span>{t.header.viewCv}</span>
                <i className="bi bi-box-arrow-up-right small" />
              </Button>
            )}
            <Button
              type="button"
              color="primary"
              rounded
              className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              onClick={() => handleNavClick("contact")}
            >
              <i className="bi bi-chat-dots-fill" />
              <span>{t.header.contactMe}</span>
            </Button>
          </div>
        </div>
      </Offcanvas>
    </>
  );
}
