"use client";

import Tooltip from "../bootstrap/tooltip";
import "./side-nav.css";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigation } from "@/context/NavigationContext";

interface Section {
  id: string;
  label: string;
}

export default function SideNav() {
  const { t } = useLanguage();
  const { activeSection, availableSections, scrollToSection } = useNavigation();

  const sectionItems: Section[] = [
    { id: "hero", label: t.sideNav.hero },
    { id: "about", label: t.sideNav.about },
    { id: "skills", label: t.sideNav.skills },
    { id: "projects", label: t.sideNav.projects },
    { id: "edu-exp", label: t.sideNav["edu-exp"] },
    { id: "certifications", label: t.sideNav.certifications },
    { id: "testimonials", label: t.sideNav.testimonials },
    { id: "contact", label: t.sideNav.contact },
  ];

  const visibleItems =
    availableSections.length > 0
      ? sectionItems.filter((s) => availableSections.includes(s.id))
      : sectionItems;

  return (
    <nav
      className="side-nav-container d-none d-xl-flex"
      aria-label="Section Navigation"
    >
      <ul className="side-nav-list list-unstyled">
        {visibleItems.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <li key={section.id} className="side-nav-item">
              <Tooltip title={section.label} placement="left">
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={`side-nav-dot-btn ${isActive ? "active" : ""}`}
                  aria-label={`Scroll to ${section.label}`}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span className="side-nav-dot"></span>
                </button>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
