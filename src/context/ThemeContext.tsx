"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Subscribe to theme changes
function subscribe(callback: () => void) {
  // Add event listeners
  window.addEventListener("storage", callback);
  window.addEventListener("theme-change", callback);
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);

  // Clean up
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("theme-change", callback);
    mediaQuery.removeEventListener("change", callback);
  };
}

// Get snapshot
function getSnapshot(): ThemeMode {
  return (localStorage.getItem("theme") as ThemeMode) || "auto";
}

// Get server snapshot
function getServerSnapshot(): ThemeMode {
  return "auto";
}

// Theme Provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get theme from localStorage
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Get resolved theme
  const getResolvedTheme = (): "light" | "dark" => {
    // Check if window is defined
    if (typeof window === "undefined") return "light";
    // Check theme
    if (theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  // Get resolved theme
  const resolvedTheme = getResolvedTheme();

  // Set theme to localStorage and dispatch event
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", resolvedTheme);
  }, [resolvedTheme]);

  // Set theme
  const setTheme = React.useCallback((newTheme: ThemeMode) => {
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("theme-change"));
  }, []);

  // Create context value
  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      isDark: resolvedTheme === "dark",
    }),
    [theme, resolvedTheme, setTheme],
  );

  // Render Theme Context Provider
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook to get current theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
