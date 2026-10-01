"use client";

import { useMemo } from "react";
import NextImage from "@/components/ui/react/image";
import { getShimmerDataUrl } from "@/lib/shimmer";
import { Portfolio, Feature, Repository } from "@/types/portfolio";
import { Project, FeatureProjectItem } from "@/types/project";
import { CaseStudy } from "@/types/case-study";
import Modal from "@/components/ui/bootstrap/modal";
import Carousel from "@/components/ui/bootstrap/carousel";
import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import Dropdown from "@/components/ui/bootstrap/dropdown";
import Alert from "@/components/ui/bootstrap/alert";
import Progress from "@/components/ui/bootstrap/progress";
import { formatMonthYear } from "@/utils/date";
import { getProjectStatusColor } from "./project-utils";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/utils/formatters";
import { getYouTubeEmbedUrl } from "@/utils/youtube";

interface ProjectDetailModalProps {
  show: boolean;
  item: Portfolio | Project | null;
  type: "portfolio" | "project" | null;
  caseStudy?: CaseStudy | null;
  features?: Feature[];
  featureProjects?: FeatureProjectItem[];
  repositories?: Repository[];
  onClose: () => void;
  onOpenCaseStudy: (caseStudy: CaseStudy, portfolioTitle: string) => void;
}

export default function ProjectDetailModal({
  show,
  item,
  type,
  caseStudy,
  features = [],
  featureProjects = [],
  repositories = [],
  onClose,
  onOpenCaseStudy,
}: ProjectDetailModalProps) {
  const { t, lang } = useLanguage();
  const dateLocale = lang === "id" ? "id-ID" : "en-US";
  const isPortfolio = type === "portfolio";
  const projectItem = !isPortfolio && item ? (item as Project) : null;

  // Normalize and translate project status
  const rawStatus = projectItem?.status || projectItem?.status_label || "";
  const normalizedStatusKey = rawStatus
    .toLowerCase()
    .replace(/[\s-]+/g, "_") as keyof typeof t.sections.projects.statuses;
  const projectStatusLabel =
    (normalizedStatusKey &&
      t.sections.projects.statuses?.[normalizedStatusKey]) ||
    projectItem?.status_label ||
    projectItem?.status;

  // Get YouTube embed URL
  const youtubeEmbedUrl = item?.video ? getYouTubeEmbedUrl(item.video) : null;

  // Extract gallery images for active modal item
  const galleryImages = useMemo(() => {
    if (!item) return [];
    const images: string[] = [];
    if (item.image) {
      images.push(item.image);
    }
    if (Array.isArray(item.gallery)) {
      item.gallery.forEach((img) => {
        if (img && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    return images;
  }, [item]);

  const validRepositories = useMemo(
    () =>
      repositories.filter(
        (repo) => (repo.url || repo.href || "").trim().length > 0,
      ),
    [repositories],
  );

  //
  if (!item) return null;

  return (
    <Modal
      id="project-detail-modal"
      show={show}
      onClose={onClose}
      title={
        getLocalizedText(item.title, lang) ||
        t.sections.projects.modal.titleDefault
      }
      size="lg"
      scrollable
      centered
      buttonItems={[
        //
        ...(isPortfolio && caseStudy
          ? [
              {
                label: (
                  <span className="d-inline-flex align-items-center gap-2">
                    <i className="bi bi-journal-richtext" />
                    <span>{t.sections.projects.modal.viewCaseStudy}</span>
                  </span>
                ),
                color: "success" as const,
                size: "sm" as const,
                // rounded: true,
                className: "px-3",
                onClick: () => {
                  onOpenCaseStudy(
                    caseStudy,
                    getLocalizedText(item.title, lang),
                  );
                },
              },
            ]
          : []),
        //
        ...(isPortfolio && validRepositories.length === 1
          ? [
              {
                label: (
                  <span className="d-inline-flex align-items-center gap-2">
                    <i
                      className={
                        validRepositories[0].icon
                          ? validRepositories[0].icon.startsWith("bi-") ||
                            validRepositories[0].icon.startsWith("bi ")
                            ? validRepositories[0].icon
                            : `bi bi-${validRepositories[0].icon}`
                          : "bi bi-link-45deg"
                      }
                    />
                    <span>
                      {validRepositories[0].name ||
                        validRepositories[0].label ||
                        "Repository"}
                    </span>
                    <i className="bi bi-box-arrow-up-right small" />
                  </span>
                ),
                as: "a" as const,
                href:
                  validRepositories[0].url || validRepositories[0].href || "#",
                target: "_blank",
                rel: "noopener noreferrer",
                color: "outline-secondary" as const,
                size: "sm" as const,
                // rounded: true,
                className: "px-3",
              },
            ]
          : []),
        //
        ...(isPortfolio && validRepositories.length > 1
          ? [
              {
                custom: (
                  <Dropdown
                    direction="up"
                    size="sm"
                    buttonColor="outline-secondary"
                    buttonClass="px-3 d-inline-flex align-items-center gap-2"
                    items={validRepositories.map((repo) => {
                      const iconClass = repo.icon
                        ? repo.icon.startsWith("bi-") ||
                          repo.icon.startsWith("bi ")
                          ? repo.icon
                          : `bi bi-${repo.icon}`
                        : "bi bi-link-45deg";

                      return {
                        label: repo.name || repo.label || "Repository",
                        icon: iconClass,
                        href: repo.url || repo.href || "#",
                        hrefType: "external",
                        newTab: true,
                      };
                    })}
                  >
                    <i className="bi bi-github" />
                    <span>
                      {t.sections.projects.modal.repositories.replace(
                        "{count}",
                        validRepositories.length.toString(),
                      )}
                    </span>
                  </Dropdown>
                ),
              },
            ]
          : []),
        //
        ...(projectItem?.is_private
          ? [
              {
                label: (
                  <span className="d-inline-flex align-items-center gap-1">
                    <i className="bi bi-lock-fill me-1" />
                    <span>{t.sections.projects.modal.privateRepo}</span>
                  </span>
                ),
                color: "outline-secondary" as const,
                size: "sm" as const,
                // rounded: true,
                disabled: true,
                className: "px-3",
              },
            ]
          : projectItem?.sourcecode
            ? [
                {
                  label: (
                    <span className="d-inline-flex align-items-center gap-2">
                      <i className="bi bi-github" />
                      <span>{t.sections.projects.modal.viewSourceCode}</span>
                      <i className="bi bi-box-arrow-up-right small" />
                    </span>
                  ),
                  as: "a" as const,
                  href: projectItem.sourcecode,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  color: "outline-dark" as const,
                  size: "sm" as const,
                  // rounded: true,
                  className: "px-3",
                },
              ]
            : []),
        //
        ...(item?.demo_url
          ? [
              {
                label: (
                  <span className="d-inline-flex align-items-center gap-2">
                    <i className="bi bi-play-circle-fill" />
                    <span>{t.sections.projects.modal.viewDemo}</span>
                    <i className="bi bi-box-arrow-up-right small" />
                  </span>
                ),
                as: "a" as const,
                href: item.demo_url,
                target: "_blank",
                rel: "noopener noreferrer",
                color: "outline-dark" as const,
                size: "sm" as const,
                // rounded: true,
                className: "px-3",
              },
            ]
          : []),
        {
          label: t.common.close,
          color: "secondary" as const,
          size: "sm" as const,
          // rounded: true,
          className: "px-4 ms-auto",
          dismiss: true,
        },
      ]}
    >
      <div className="p-1">
        {/* Visual Media Showcase */}
        {galleryImages.length > 1 ? (
          <Carousel
            id="project-detail-carousel"
            items={galleryImages.map((img, idx) => ({
              image: img,
              alt: `${item.title} screenshot ${idx + 1}`,
            }))}
            width={1200}
            height={675}
            className="rounded-3 overflow-hidden mb-4 shadow-sm controls-inset"
            hoverControlsOnly
            showSpinner
            showSkeleton
            enableZoom
            placeholder="blur"
            blurDataURL={getShimmerDataUrl(1200, 675)}
          />
        ) : galleryImages.length === 1 ? (
          <div className="position-relative rounded-3 overflow-hidden mb-4 shadow-sm border bg-body-secondary bg-opacity-25">
            <NextImage
              src={galleryImages[0]}
              alt={getLocalizedText(item.title, lang)}
              width={1200}
              height={675}
              placeholder="blur"
              blurDataURL={getShimmerDataUrl(1200, 675)}
              className="w-100 h-auto"
              style={{
                aspectRatio: "16 / 9",
                objectFit: "cover",
                objectPosition: "top",
              }}
              loading="lazy"
              showSpinner
              showSkeleton
              wrapperClassName="w-100"
              enableZoom
              modalTitle={`${item.title} - Screenshot Preview`}
            />
          </div>
        ) : null}

        {/* Badges & Meta Info Row */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          {item.category && (
            <Badge
              pill
              className="bg-primary-subtle text-primary border border-primary-subtle px-3 py-1"
            >
              <i className="bi bi-tag-fill me-1" />
              {item.category}
            </Badge>
          )}

          {item.type && (
            <Badge pill color="secondary" subtle className="px-3 py-1">
              {item.type}
            </Badge>
          )}

          {projectStatusLabel && (
            <Badge
              pill
              color={getProjectStatusColor(normalizedStatusKey || rawStatus)}
              subtle
              className="px-3 py-1"
            >
              <i className="bi bi-circle-fill me-1 small" />
              {projectStatusLabel}
            </Badge>
          )}

          <Badge
            pill
            className="bg-body-tertiary text-muted border px-3 py-1 ms-auto"
          >
            <i className="bi bi-calendar3 me-1" />
            <time dateTime={item.start_period}>
              {formatMonthYear(item.start_period, dateLocale, t.common.present)}
            </time>{" "}
            &mdash;{" "}
            {item.finish_period ? (
              <time dateTime={item.finish_period}>
                {formatMonthYear(
                  item.finish_period,
                  dateLocale,
                  t.common.present,
                )}
              </time>
            ) : (
              formatMonthYear(item.finish_period, dateLocale, t.common.present)
            )}
          </Badge>
        </div>

        {/* Delay Warning if applicable */}
        {projectItem?.delay_reason && (
          <Alert
            color="warning"
            className="d-flex align-items-start gap-2 mb-4 py-2 px-3 rounded-3"
          >
            <i className="bi bi-exclamation-triangle-fill mt-1 text-warning" />
            <div>
              <div className="fw-semibold small">
                {t.sections.projects.modal.timelineNote}
              </div>
              <div className="small">{projectItem.delay_reason}</div>
              {projectItem.resume_date && (
                <div className="small text-muted mt-1">
                  {t.sections.projects.modal.expectedResumption.replace(
                    "{date}",
                    formatMonthYear(
                      projectItem.resume_date,
                      dateLocale,
                      t.common.present,
                    ),
                  )}
                </div>
              )}
            </div>
          </Alert>
        )}

        {/* Description */}
        <div className="mb-4">
          <h6 className="fw-bold text-body-secondary text-uppercase small mb-2">
            {t.sections.projects.modal.overview}
          </h6>
          <p
            className="text-body"
            style={{
              whiteSpace: "pre-line",
              lineHeight: "1.7",
            }}
          >
            {getLocalizedText(item.description, lang)}
          </p>
        </div>

        {/* Video Walkthrough (if available) */}
        {item.video && (
          <div className="mb-4">
            <h6 className="fw-bold text-body-secondary text-uppercase small mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-camera-video-fill text-danger" />
              {t.sections.projects.modal.walkthrough}
            </h6>
            {youtubeEmbedUrl ? (
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden border shadow-sm">
                <iframe
                  src={youtubeEmbedUrl}
                  title={`${getLocalizedText(item.title, lang)} Video Walkthrough`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              </div>
            ) : (
              <Button
                as="a"
                href={item.video}
                target="_blank"
                rel="noopener noreferrer"
                color="outline-danger"
                size="sm"
                rounded
                className="px-3 d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-play-circle-fill" />
                <span>{t.sections.projects.modal.watchVideo}</span>
                <i className="bi bi-box-arrow-up-right small" />
              </Button>
            )}
          </div>
        )}

        {/* Technologies */}
        {item.technology && item.technology.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold text-body-secondary text-uppercase small mb-2">
              {t.sections.projects.modal.technologies}
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {item.technology.map((tech, idx) => (
                <Badge
                  key={idx}
                  pill
                  className="bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fw-normal"
                >
                  <i className="bi bi-code-slash me-1" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Key Features */}
        {isPortfolio && features.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold text-body-secondary text-uppercase small mb-2">
              {t.sections.projects.modal.keyFeatures}
            </h6>
            <ul className="list-group list-group-flush rounded-3 border ps-0 mb-0">
              {features.map((feat) => (
                <li
                  key={feat.id}
                  className="list-group-item bg-transparent py-2"
                >
                  <div className="fw-semibold small d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success" />
                    {getLocalizedText(feat.title, lang)}
                  </div>
                  {feat.description && (
                    <div className="text-muted small ps-4 mt-1">
                      {getLocalizedText(feat.description, lang)}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Project Feature Progress */}
        {!isPortfolio && featureProjects.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold text-body-secondary text-uppercase small mb-2">
              {t.sections.projects.modal.featureProgress}
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {featureProjects.map((fp) => (
                <li
                  key={fp.id}
                  className="p-3 border rounded-3 bg-body-tertiary"
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold small">
                      {getLocalizedText(fp.title, lang)}
                    </span>
                    <Badge
                      pill
                      className="bg-primary-subtle text-primary border border-primary-subtle"
                    >
                      {fp.progress}%
                    </Badge>
                  </div>
                  {fp.description && (
                    <div className="text-muted small mb-2">
                      {getLocalizedText(fp.description, lang)}
                    </div>
                  )}
                  <Progress
                    value={fp.progress ?? 0}
                    color="primary"
                    height="6px"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold text-body-secondary text-uppercase small mb-2">
              {t.sections.projects.modal.tags}
            </h6>
            <div className="d-flex flex-wrap gap-1">
              {item.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  pill
                  className="bg-body-tertiary text-muted border px-2 py-1 small"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
