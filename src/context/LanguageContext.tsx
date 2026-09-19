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

// Subscribe to language changes
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("language-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("language-change", callback);
  };
}

// Get snapshot of current language
function getSnapshot(): Language {
  const savedLang = localStorage.getItem("preferred_lang");
  return savedLang === "id" || savedLang === "en" ? savedLang : "en";
}

// Get snapshot of current language for server
function getServerSnapshot(): Language {
  return "en";
}

// Language Provider
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get current language from localStorage
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Set lang to html
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Set lang to localStorage
  const setLang = React.useCallback((newLang: Language) => {
    localStorage.setItem("preferred_lang", newLang);
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
