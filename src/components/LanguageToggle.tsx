"use client";

import Dropdown, { DropdownItem } from "./ui/bootstrap/dropdown";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  const items: DropdownItem[] = [
    {
      label: "English (EN)",
      active: lang === "en",
      onClick: () => setLang("en"),
    },
    {
      label: "Indonesia (ID)",
      active: lang === "id",
      onClick: () => setLang("id"),
    },
  ];

  return (
    <Dropdown
      items={items}
      buttonColor="link"
      buttonClass="nav-link p-2 d-flex align-items-center fw-semibold text-uppercase"
      menuClass="dropdown-menu-end shadow"
      showCaret={false}
      aria-label={`Current language: ${lang === "en" ? "English" : "Bahasa Indonesia"}. Change language`}
    >
      <span className="text-body lh-1 d-inline-flex align-items-center gap-1">
        <i className="bi bi-translate fs-5" aria-hidden="true"></i>
        <span className="small">{lang}</span>
      </span>
    </Dropdown>
  );
}
