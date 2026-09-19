"use client";

import Badge from "@/components/ui/bootstrap/badge";
import { siteConfig } from "@/config/siteConfig";

interface TechnologyBadgesProps {
  technologies?: string[] | null;
  limit?: number;
  className?: string;
}

export default function TechnologyBadges({
  technologies,
  limit = siteConfig.projects.technologyBadgesLimit,
  className = "d-flex flex-wrap gap-1 mt-auto",
}: TechnologyBadgesProps) {
  // Check if technologies is null or empty array
  if (!technologies || technologies.length === 0) return null;

  // Slicing the technologies array
  const visible = technologies.slice(0, limit);
  const remaining = technologies.length - limit;

  return (
    <div className={className}>
      {/* Showing visible technologies */}
      {visible.map((tech, idx) => (
        <Badge
          key={idx}
          pill
          className="bg-body-secondary text-body-secondary border"
        >
          {tech}
        </Badge>
      ))}
      {/* Showing remaining technologies */}
      {remaining > 0 && (
        <Badge pill className="bg-body-tertiary text-muted border">
          +{remaining}
        </Badge>
      )}
    </div>
  );
}
