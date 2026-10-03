"use client";

import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import Spinner from "@/components/ui/bootstrap/spinner";
import { formatMonthYear, getYear } from "@/utils/date";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedContent } from "@/utils/formatters";
import type { LocalizedContent } from "@/types/api";

export interface TimelineItemData {
  id: string | number;
  title: string;
  location?: string;
  start_period: string;
  finish_period?: string | null;
  status?: string | null;
  address?: string | null;
  gpa?: number | null;
  type?: string | null;
  description?: LocalizedContent | null;
  latitude?: string | null;
  longitude?: string | null;
}

interface TimelineItemProps {
  item: TimelineItemData;
  icon: string;
  locationIcon: string;
  onViewMap?: (item: TimelineItemData) => void;
}

function getTimelineStatusColor(
  status?: string | null,
): "success" | "warning" | "secondary" {
  if (!status) return "secondary";

  const normalized = status.toLowerCase().replace(/[\s-]+/g, "_");

  switch (normalized) {
    case "graduated":
    case "finished":
    case "completed":
      return "success";
    case "ongoing":
    case "in_progress":
    case "active":
      return "warning";
    default:
      return "secondary";
  }
}

export default function TimelineItem({
  item,
  icon,
  locationIcon,
  onViewMap,
}: TimelineItemProps) {
  // Get language and date locale
  const { t, lang } = useLanguage();
  const dateLocale = lang === "id" ? "id-ID" : "en-US";
  const descContent = getLocalizedContent(item.description, lang);

  // Get year from start and finish period
  const startYear = getYear(item.start_period);
  const finishYear = item.finish_period
    ? getYear(item.finish_period)
    : t.sections.eduExp.timeline.present;
  const isSameYear = startYear === finishYear;
  const yearLabel = isSameYear ? startYear : `${startYear} — ${finishYear}`;

  // Check if coordinates are valid
  const hasCoordinates = Boolean(
    item.latitude &&
    item.longitude &&
    !isNaN(parseFloat(item.latitude)) &&
    !isNaN(parseFloat(item.longitude)),
  );

  // Normalize and translate status label
  const rawStatus = item.status?.trim() || "";
  const normalizedStatusKey = rawStatus
    .toLowerCase()
    .replace(
      /[\s-]+/g,
      "_",
    ) as keyof typeof t.sections.eduExp.timeline.statuses;
  const statusLabel =
    (normalizedStatusKey &&
      t.sections.eduExp.timeline.statuses?.[normalizedStatusKey]) ||
    item.status;

  // Normalize and translate type label
  const rawType = item.type?.trim() || "";
  const normalizedTypeKey = rawType
    .toLowerCase()
    .replace(/[\s-]+/g, "_") as keyof typeof t.sections.eduExp.timeline.types;
  const typeLabel =
    (normalizedTypeKey &&
      t.sections.eduExp.timeline.types?.[normalizedTypeKey]) ||
    item.type;

  return (
    <li className="timeline-item">
      {/* Circle marker */}
      <div className="timeline-dot" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </div>

      {/* Content Card */}
      <article className="timeline-card">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
          {/* Year Badge */}
          <Badge
            pill
            color="primary"
            subtle
            className="px-3 py-1 timeline-year-badge"
          >
            <i className="bi bi-calendar-event me-1" />
            {yearLabel}
          </Badge>

          {/* GPA, Type, and Status Badges */}
          <div className="d-flex flex-wrap align-items-center gap-1 gap-sm-2">
            {item.gpa !== undefined && item.gpa !== null && (
              <Badge color="success" subtle className="px-2 py-1">
                {t.sections.eduExp.timeline.gpa} {item.gpa.toFixed(2)}
              </Badge>
            )}
            {typeLabel && (
              <Badge
                pill
                className="bg-body-tertiary text-muted border border-secondary-subtle px-2 py-1"
              >
                {typeLabel}
              </Badge>
            )}
            {statusLabel && (
              <Badge
                color={getTimelineStatusColor(
                  normalizedStatusKey || item.status,
                )}
                subtle
                className="px-2 py-1 d-inline-flex align-items-center gap-1"
              >
                {(normalizedStatusKey === "ongoing" ||
                  normalizedStatusKey === "active") && (
                  <Spinner
                    variant="grow"
                    size="sm"
                    color="warning"
                    style={{ width: "6px", height: "6px" }}
                  />
                )}
                {statusLabel}
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="h5 fw-bold mb-1">{item.title}</h3>

        {/* Location, Time, and Map Trigger */}
        <div className="text-muted small mb-3 d-flex flex-wrap align-items-center gap-3">
          <span>
            <i className={`bi ${locationIcon} me-1`} />
            <strong>{item.location}</strong>
          </span>
          <span>
            <i className="bi bi-clock-history me-1" />
            <time dateTime={item.start_period}>
              {formatMonthYear(
                item.start_period,
                dateLocale,
                t.sections.eduExp.timeline.present,
              )}
            </time>{" "}
            &mdash;{" "}
            {item.finish_period ? (
              <time dateTime={item.finish_period}>
                {formatMonthYear(
                  item.finish_period,
                  dateLocale,
                  t.sections.eduExp.timeline.present,
                )}
              </time>
            ) : (
              t.sections.eduExp.timeline.present
            )}
          </span>
          {item.address && (
            <address className="d-inline fst-normal mb-0" title={item.address}>
              <i className="bi bi-geo-alt me-1" />
              {item.address}
            </address>
          )}
          {hasCoordinates && (
            <Button
              color=""
              className="timeline-map-btn d-inline-flex align-items-center gap-1 border-0"
              onClick={() => onViewMap?.(item)}
              dataBsToggle="tooltip"
              dataBsTitle={t.sections.eduExp.timeline.viewOnMap}
              aria-label={`View ${item.location} on map`}
            >
              <i className="bi bi-pin-map-fill text-danger" />
              <span>{t.sections.eduExp.timeline.viewOnMap}</span>
            </Button>
          )}
        </div>

        {/* Description */}
        {Array.isArray(descContent) ? (
          <ul className="mb-0 ps-3">
            {descContent.map((desc, idx) => (
              <li key={idx} className="mb-1 text-secondary">
                {desc}
              </li>
            ))}
          </ul>
        ) : descContent ? (
          <p className="mb-0 text-secondary">{descContent}</p>
        ) : null}
      </article>
    </li>
  );
}
