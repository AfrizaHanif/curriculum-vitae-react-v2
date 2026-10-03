"use client";

import { Project } from "@/types/project";
import Card from "@/components/ui/bootstrap/card";
import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import { formatMonthYear } from "@/utils/date";
import TechnologyBadges from "./TechnologyBadges";
import { getProjectStatusColor } from "./project-utils";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/utils/formatters";

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onOpenDetails,
}: ProjectCardProps) {
  const { t, lang } = useLanguage();
  const dateLocale = lang === "id" ? "id-ID" : "en-US";

  // Normalize and translate status
  const rawStatus = project.status || project.status_label || "";
  const normalizedStatusKey = rawStatus
    .toLowerCase()
    .replace(/[\s-]+/g, "_") as keyof typeof t.sections.projects.statuses;
  const statusLabel =
    (normalizedStatusKey &&
      t.sections.projects.statuses?.[normalizedStatusKey]) ||
    project.status_label ||
    project.status ||
    t.sections.projects.card.ongoing;

  return (
    <Card
      key={project.id}
      imgSrc={project.image ?? undefined}
      imgAlt={getLocalizedText(project.title, lang)}
      imgWidth={1920}
      imgHeight={1080}
      imgStyle={{
        aspectRatio: "16 / 9",
        objectFit: "cover",
        objectPosition: "top",
      }}
      className="shadow-sm rounded-4 border transition-all h-100"
      fullHeight
      onClick={() => onOpenDetails(project)}
      header={
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          {/* Category badge */}
          <Badge
            pill
            color="info"
            subtle
            className="px-2 py-1 d-inline-flex align-items-center"
            style={{ maxWidth: "60%" }}
          >
            <i className="bi bi-briefcase me-1 flex-shrink-0" />
            <span className="text-truncate">
              {project.category || project.type || "Experience"}
            </span>
          </Badge>

          {/* Status badge */}
          <Badge
            pill
            color={getProjectStatusColor(normalizedStatusKey || rawStatus)}
            subtle
            className="px-2 py-1 flex-shrink-0"
          >
            {statusLabel}
          </Badge>
        </div>
      }
      footer={
        <div className="d-flex justify-content-between align-items-center">
          {/* Source or private badge */}
          <span className="text-muted small">
            {project.is_private ? (
              <span>
                <i className="bi bi-lock-fill me-1 text-secondary" />
                {t.sections.projects.card.private}
              </span>
            ) : project.sourcecode ? (
              <span>
                <i className="bi bi-github me-1" />
                {t.sections.projects.card.source}
              </span>
            ) : (
              <span>
                <i className="bi bi-code-square me-1" />
                {project.subcategory || "Project"}
              </span>
            )}
          </span>
          {/*  */}
          <Button
            as="button"
            color="primary"
            rounded
            size="sm"
            className="px-3 d-inline-flex align-items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(project);
            }}
          >
            <span>{t.sections.projects.card.details}</span>
            <i className="bi bi-arrow-right-short" />
          </Button>
        </div>
      }
    >
      <h5 className="card-title fw-bold mb-2">
        {getLocalizedText(project.title, lang)}
      </h5>
      <div className="text-muted small mb-2">
        <i className="bi bi-calendar3 me-1" />
        <time dateTime={project.start_period}>
          {formatMonthYear(project.start_period, dateLocale, t.common.present)}
        </time>{" "}
        &mdash;{" "}
        {project.finish_period ? (
          <time dateTime={project.finish_period}>
            {formatMonthYear(
              project.finish_period,
              dateLocale,
              t.common.present,
            )}
          </time>
        ) : (
          formatMonthYear(project.finish_period, dateLocale, t.common.present)
        )}
      </div>
      <p
        className="card-text text-muted small mb-3"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {getLocalizedText(project.description, lang)}
      </p>
      <TechnologyBadges technologies={project.technology} />
    </Card>
  );
}
