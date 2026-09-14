"use client";

import Badge from "@/components/ui/bootstrap/badge";

interface TechnologyBadgesProps {
  technologies?: string[] | null;
  limit?: number;
  className?: string;
}

export default function TechnologyBadges({
  technologies,
  limit = 3,
  className = "d-flex flex-wrap gap-1 mt-auto",
}: TechnologyBadgesProps) {
  if (!technologies || technologies.length === 0) return null;

  const visible = technologies.slice(0, limit);
  const remaining = technologies.length - limit;

  return (
    <div className={className}>
      {visible.map((tech, idx) => (
        <Badge
          key={idx}
          pill
          className="bg-body-secondary text-body-secondary border"
        >
          {tech}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge pill className="bg-body-tertiary text-muted border">
          +{remaining}
        </Badge>
      )}
    </div>
  );
}
