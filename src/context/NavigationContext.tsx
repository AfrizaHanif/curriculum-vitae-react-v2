"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { siteConfig, type SectionConfigItem } from "@/config/siteConfig";
export type { SectionConfigItem };

export const SECTION_CONFIG: readonly SectionConfigItem[] =
  siteConfig.navigation.sections;

export const SECTION_IDS = SECTION_CONFIG.map((s) => s.id);

interface NavigationContextType {
  activeSection: string;
  availableSections: string[];
  sectionConfig: readonly SectionConfigItem[];
  scrollToSection: (id: string) => void;
}

// Create Navigation Context
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

// Navigation Provider
export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Active section
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [availableSections, setAvailableSections] = useState<string[]>([]);

  // Dynamically observe which sections actually exist in the DOM with debounce
  useEffect(() => {
    // Debounce timer
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Update available sections
    const updateAvailable = () => {
      const existing = SECTION_IDS.filter((id) =>
        Boolean(document.getElementById(id)),
      );
      setAvailableSections((prev) => {
        if (
          prev.length === existing.length &&
          prev.every((val, index) => val === existing[index])
        ) {
          return prev;
        }
        return existing;
      });
    };

    // Update available sections
    updateAvailable();

    // Debounced update
    const debouncedUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateAvailable, 150);
    };

    // Observer
    const mainEl = document.querySelector("main") || document.body;
    const observer = new MutationObserver(debouncedUpdate);
    observer.observe(mainEl, { childList: true, subtree: true });

    // Clean up
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    // Target ids
    const targetIds =
      availableSections.length > 0 ? availableSections : [...SECTION_IDS];

    // Observer options
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    // Observer callback
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    // IntersectionObserver
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe target ids
    targetIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Clean up
    return () => {
      targetIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [availableSections]);

  // Scroll to section
  const scrollToSection = useCallback((id: string) => {
    // Find element
    const element = document.getElementById(id);
    if (!element) return;

    // Update URL hash or keep clean URL based on siteConfig.navigation.updateUrlHash
    if (siteConfig.navigation.updateUrlHash) {
      if (window.location.hash !== `#${id}`) {
        window.history.pushState(null, "", `#${id}`);
      }
    } else if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }

    // Current scrollY
    const currentScrollY = window.scrollY;
    const targetY = element.getBoundingClientRect().top + currentScrollY;

    // Scrolling UP (previous section): offset by header height so header doesn't cover top
    if (targetY < currentScrollY - 10) {
      const header = document.querySelector(
        ".smart-header",
      ) as HTMLElement | null;
      const headerHeight = header ? header.offsetHeight : 72;

      window.scrollTo({
        top: Math.max(0, targetY - headerHeight),
        behavior: "smooth",
      });
    } else {
      // Scrolling DOWN (next section): header auto-hides, so scroll flush to section top
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  }, []);

  // Support initial hash on page load and browser back/forward buttons (Option B)
  useEffect(() => {
    // Handle hash change
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && document.getElementById(hash)) {
        scrollToSection(hash);
      }
    };

    // Handle hash change on page load
    if (window.location.hash) {
      const timer = setTimeout(handleHashChange, 200);
      return () => clearTimeout(timer);
    }

    // Handle hash change on back/forward buttons
    window.addEventListener("popstate", handleHashChange);
    return () => window.removeEventListener("popstate", handleHashChange);
  }, [scrollToSection]);

  // Create context value
  const value = React.useMemo(
    () => ({
      activeSection,
      availableSections,
      sectionConfig: SECTION_CONFIG,
      scrollToSection,
    }),
    [activeSection, availableSections, scrollToSection],
  );

  // Render Navigation Context Provider
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

// Hook to get current navigation
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
