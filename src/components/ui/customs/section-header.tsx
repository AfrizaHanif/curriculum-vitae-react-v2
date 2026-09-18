import { ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  children?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  className = "text-center mb-5",
  titleClassName = "fw-bold mb-2",
  subtitleClassName = "text-muted",
  children,
}: SectionHeaderProps) {
  return (
    <header className={className}>
      {typeof title === "string" ? (
        <h2 className={titleClassName}>{title}</h2>
      ) : (
        title
      )}
      {subtitle && (
        typeof subtitle === "string" ? (
          <p className={subtitleClassName}>{subtitle}</p>
        ) : (
          subtitle
        )
      )}
      {children}
    </header>
  );
}
