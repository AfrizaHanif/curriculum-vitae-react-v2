"use client";

import Dropdown, { DropdownItem } from "./ui/bootstrap/dropdown";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ThemeToggle() {
  //
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const themeLabels = {
    light: t.ui.themeToggle.light,
    dark: t.ui.themeToggle.dark,
    auto: t.ui.themeToggle.auto,
  } as const;

  //
  const items: DropdownItem[] = [
    {
      label: themeLabels.light,
      icon: "bi bi-sun-fill",
      active: theme === "light",
      onClick: () => setTheme("light"),
    },
    {
      label: themeLabels.dark,
      icon: "bi bi-moon-stars-fill",
      active: theme === "dark",
      onClick: () => setTheme("dark"),
    },
    {
      label: themeLabels.auto,
      icon: "bi bi-circle-half",
      active: theme === "auto",
      onClick: () => setTheme("auto"),
    },
  ];

  //
  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <i className="bi bi-sun-fill fs-5"></i>;
      case "dark":
        return <i className="bi bi-moon-stars-fill fs-5"></i>;
      case "auto":
      default:
        return <i className="bi bi-circle-half fs-5"></i>;
    }
  };

  return (
    <Dropdown
      items={items}
      buttonColor="link"
      buttonClass="nav-link p-2 d-flex align-items-center"
      menuClass="dropdown-menu-end shadow"
      showCaret={false}
      aria-label={t.ui.themeToggle.ariaLabel.replace(
        "{theme}",
        themeLabels[theme as keyof typeof themeLabels] || theme,
      )}
    >
      <span className="text-body lh-1 d-inline-flex align-items-center">
        {getThemeIcon()}
      </span>
    </Dropdown>
  );
}
