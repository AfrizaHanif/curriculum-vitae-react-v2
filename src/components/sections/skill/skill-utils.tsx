import {
  ReactIcon,
  NextJsIcon,
  TypeScriptIcon,
  TailwindIcon,
} from "@/components/ui/react/icons";

export function renderSkillIcon(name: string) {
  const n = name.toLowerCase();

  // Using custom SVG icons for some technologies
  if (n.includes("react")) {
    return <ReactIcon width={24} height={24} className="text-info" />;
  }
  if (n.includes("next")) {
    return <NextJsIcon width={24} height={24} className="text-body" />;
  }
  if (n.includes("tailwind")) {
    return <TailwindIcon width={24} height={24} className="text-info" />;
  }
  if (n.includes("typescript") || /\bts\b/i.test(n)) {
    return <TypeScriptIcon width={24} height={24} className="text-primary" />;
  }

  // Using Bootstrap Icons for other technologies
  let biClass = "bi-code-slash text-secondary";
  if (n.includes("bootstrap")) biClass = "bi-bootstrap-fill text-primary";
  else if (n.includes("laravel")) biClass = "bi-layers-fill text-danger";
  else if (n.includes("mysql") || n.includes("sql") || n.includes("database"))
    biClass = "bi-database-fill text-primary";
  else if (n.includes("php")) biClass = "bi-filetype-php text-primary";
  else if (n.includes("html")) biClass = "bi-filetype-html text-warning";
  else if (n.includes("javascript") || /\bjs\b/i.test(n))
    biClass = "bi-filetype-js text-warning";
  else if (n.includes("angular")) biClass = "bi-shield-shaded text-danger";
  else if (n.includes("vue")) biClass = "bi-triangle-fill text-success";
  else if (n.includes("git") || n.includes("github"))
    biClass = "bi-git text-danger";
  else if (n.includes("ai") || n.includes("prompt"))
    biClass = "bi-stars text-warning";

  return <i className={`bi ${biClass} fs-4`} />;
}

export function getLevelConfig(level: string) {
  const l = level.toLowerCase();
  if (l === "mahir" || l === "expert" || l === "advanced") {
    return {
      badgeClass: "bg-primary-subtle text-primary border border-primary-subtle",
    };
  }
  if (l === "menengah" || l === "intermediate") {
    return {
      badgeClass: "bg-info-subtle text-info-emphasis border border-info-subtle",
    };
  }
  return {
    badgeClass:
      "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle",
  };
}
