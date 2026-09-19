"use client";

import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import { formatMonthYear, getYear } from "@/utils/date";
import { useLanguage } from "@/context/LanguageContext";

export interface TimelineItemData {
  id: string | number;
  title: string;
  location: string;
  start_period: string;
  finish_period?: string | null;
  status?: string | null;
  address?: string | null;
  gpa?: number | null;
  description?: string | string[] | null;
  latitude?: string | null;
  longitude?: string | null;
}

interface TimelineItemProps {
  item: TimelineItemData;
  icon: string;
  locationIcon: string;
  onViewMap?: (item: TimelineItemData) => void;
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
            className="bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 timeline-year-badge"
          >
            <i className="bi bi-calendar-event me-1" />
            {yearLabel}
          </Badge>

          {/* GPA and Status Badges */}
          <div className="d-flex align-items-center gap-2">
            {item.gpa !== undefined && item.gpa !== null && (
              <Badge className="bg-success-subtle text-success-emphasis border border-success-subtle px-2 py-1">
                {t.sections.eduExp.timeline.gpa} {item.gpa.toFixed(2)}
              </Badge>
            )}
            {item.status && (
              <Badge className="bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle px-2 py-1">
                {item.status}
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
        {Array.isArray(item.description) ? (
          <ul className="mb-0 ps-3">
            {item.description.map((desc, idx) => (
              <li key={idx} className="mb-1 text-secondary">
                {desc}
              </li>
            ))}
          </ul>
        ) : item.description ? (
          <p className="mb-0 text-secondary">{item.description}</p>
        ) : null}
      </article>
    </li>
  );
}
