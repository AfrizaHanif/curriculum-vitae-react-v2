"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface SectionConfigItem {
  id: string;
  icon: string;
}

export const SECTION_CONFIG: readonly SectionConfigItem[] = [
  { id: "hero", icon: "bi-house-door" },
  { id: "about", icon: "bi-person" },
  { id: "skills", icon: "bi-tools" },
  { id: "projects", icon: "bi-code-square" },
  { id: "edu-exp", icon: "bi-briefcase" },
  { id: "certifications", icon: "bi-award" },
  { id: "testimonials", icon: "bi-chat-quote" },
  { id: "contact", icon: "bi-envelope" },
] as const;

export const SECTION_IDS = SECTION_CONFIG.map((s) => s.id);

interface NavigationContextType {
  activeSection: string;
  availableSections: string[];
  sectionConfig: readonly SectionConfigItem[];
  scrollToSection: (id: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [availableSections, setAvailableSections] = useState<string[]>([]);

  // Dynamically observe which sections actually exist in the DOM with debounce
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

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

    updateAvailable();

    const debouncedUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateAvailable, 150);
    };

    const mainEl = document.querySelector("main") || document.body;
    const observer = new MutationObserver(debouncedUpdate);
    observer.observe(mainEl, { childList: true, subtree: true });

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const targetIds =
      availableSections.length > 0 ? availableSections : [...SECTION_IDS];

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    targetIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      targetIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [availableSections]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // --- Option B (Active): Update URL hash for deep-linking & browser history ---
    // if (window.location.hash !== `#${id}`) {
    //   window.history.pushState(null, "", `#${id}`);
    // }

    // --- Option A (Clean URL): If recruiter/client wants to hide '#' from the URL:
    // 1. Comment out the window.history.pushState block above.
    // 2. (Optional) Uncomment the line below to strip any remaining hash:
    if (window.location.hash)
      window.history.replaceState(null, "", window.location.pathname);

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
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && document.getElementById(hash)) {
        scrollToSection(hash);
      }
    };

    if (window.location.hash) {
      const timer = setTimeout(handleHashChange, 200);
      return () => clearTimeout(timer);
    }

    window.addEventListener("popstate", handleHashChange);
    return () => window.removeEventListener("popstate", handleHashChange);
  }, [scrollToSection]);

  const value = React.useMemo(
    () => ({
      activeSection,
      availableSections,
      sectionConfig: SECTION_CONFIG,
      scrollToSection,
    }),
    [activeSection, availableSections, scrollToSection],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
