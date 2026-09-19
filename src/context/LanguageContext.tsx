"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { translations, Language } from "@/data/locales";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof translations)["en"];
}

// Create Language Context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Subscribe to language changes (localStorage, custom event, dan browser back/forward URL)
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("language-change", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("language-change", callback);
    window.removeEventListener("popstate", callback);
  };
}

// Get snapshot of current language
function getSnapshot(): Language {
  if (typeof window !== "undefined") {
    // 1. Prioritaskan parameter dari URL (?lang=id atau ?lang=en)
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang === "id" || urlLang === "en") {
      return urlLang;
    }
  }

  // 2. Fallback ke preferensi yang tersimpan di localStorage
  const savedLang = localStorage.getItem("preferred_lang");
  return savedLang === "id" || savedLang === "en" ? savedLang : "en";
}

// Get snapshot of current language for server
function getServerSnapshot(): Language {
  return "en";
}

// Language Provider
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get current language
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Set lang attribute to <html> and sync to localStorage
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("preferred_lang", lang);
  }, [lang]);

  // Set lang to localStorage and update URL query param
  const setLang = React.useCallback((newLang: Language) => {
    localStorage.setItem("preferred_lang", newLang);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", newLang);
      window.history.replaceState({}, "", url.toString());
    }

    window.dispatchEvent(new Event("language-change"));
  }, []);

  // Create context value
  const value = React.useMemo(
    () => ({
      lang,
      setLang,
      t: translations[lang],
    }),
    [lang, setLang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to get current language
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
