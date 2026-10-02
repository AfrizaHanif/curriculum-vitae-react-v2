import {
  ReactIcon,
  NextJsIcon,
  TypeScriptIcon,
  TailwindIcon,
  LaravelIcon,
  MySQLIcon,
  PostmanIcon,
  DockerIcon,
  NodeJsIcon,
  HTMLIcon,
  CSSIcon,
  JavaScriptIcon,
} from "@/components/ui/react/icons";

export function renderSkillIcon(name: string) {
  const n = name.toLowerCase();

  // Using custom SVG icons for some technologies
  if (n.includes("react")) {
    return <ReactIcon width={24} height={24} className="text-info" />;
  }
  if (n.includes("html")) {
    return <HTMLIcon width={24} height={24} className="text-info" />;
  }
  if (n.includes("css") || n.includes("sass") || n.includes("scss")) {
    return <CSSIcon width={24} height={24} className="text-info" />;
  }
  if (n.includes("javascript") || /\bjs\b/i.test(n)) {
    return <JavaScriptIcon width={24} height={24} className="text-warning" />;
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
  if (n.includes("laravel")) {
    return <LaravelIcon width={24} height={24} className="text-primary" />;
  }
  if (n.includes("mysql") || n.includes("sql")) {
    return <MySQLIcon width={24} height={24} className="text-primary" />;
  }
  if (n.includes("postman")) {
    return <PostmanIcon width={24} height={24} className="text-primary" />;
  }
  if (n.includes("docker")) {
    return <DockerIcon width={24} height={24} className="text-primary" />;
  }
  if (n.includes("node")) {
    return <NodeJsIcon width={24} height={24} className="text-success" />;
  }

  // Using Bootstrap Icons for other technologies
  let biClass = "bi-code-slash text-secondary";
  if (n.includes("bootstrap")) biClass = "bi-bootstrap-fill text-primary";
  else if (n.includes("database")) biClass = "bi-database-fill text-primary";
  else if (n.includes("php")) biClass = "bi-filetype-php text-primary";
  // else if (n.includes("html")) biClass = "bi-filetype-html text-warning";
  // else if (n.includes("css") || n.includes("sass") || n.includes("scss"))
  //   biClass = "bi-filetype-css text-info";
  // else if (n.includes("javascript") || /\bjs\b/i.test(n))
  //   biClass = "bi-filetype-js text-warning";
  else if (n.includes("angular")) biClass = "bi-shield-shaded text-danger";
  else if (n.includes("vue")) biClass = "bi-triangle-fill text-success";
  else if (n.includes("python") || /\bpy\b/i.test(n))
    biClass = "bi-filetype-py text-info";
  else if (n.includes("github")) biClass = "bi-github text-body";
  else if (/\bgit\b/i.test(n) || n === "git") biClass = "bi-git text-danger";
  else if (n.includes("api") || n.includes("rest"))
    biClass = "bi-braces-asterisk text-primary";
  else if (n.includes("linux") || n.includes("bash") || n.includes("terminal"))
    biClass = "bi-terminal-fill text-body";
  else if (n.includes("ai") || n.includes("prompt"))
    biClass = "bi-stars text-warning";

  return <i className={`bi ${biClass} fs-4`} />;
}

export function getLevelConfig(level?: string | null) {
  const l = level ? level.toLowerCase() : "";
  if (
    l === "mahir" ||
    l === "expert" ||
    l === "advanced" ||
    l.includes("front")
  ) {
    return {
      badgeClass: "bg-primary-subtle text-primary border border-primary-subtle",
    };
  }
  if (l === "menengah" || l === "intermediate" || l.includes("back")) {
    return {
      badgeClass: "bg-info-subtle text-info-emphasis border border-info-subtle",
    };
  }
  if (l.includes("data")) {
    return {
      badgeClass:
        "bg-warning-subtle text-warning-emphasis border border-warning-subtle",
    };
  }
  return {
    badgeClass:
      "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle",
  };
}
