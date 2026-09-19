"use client";

import Dropdown, { DropdownItem } from "./ui/bootstrap/dropdown";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  //
  const { theme, setTheme } = useTheme();

  //
  const items: DropdownItem[] = [
    {
      label: "Light",
      icon: "bi bi-sun-fill",
      active: theme === "light",
      onClick: () => setTheme("light"),
    },
    {
      label: "Dark",
      icon: "bi bi-moon-stars-fill",
      active: theme === "dark",
      onClick: () => setTheme("dark"),
    },
    {
      label: "Auto",
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
      aria-label={`Current theme: ${theme}. Change theme`}
    >
      <span className="text-body lh-1 d-inline-flex align-items-center">
        {getThemeIcon()}
      </span>
    </Dropdown>
  );
}
