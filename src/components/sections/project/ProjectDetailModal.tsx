"use client";

import { useMemo } from "react";
import NextImage from "@/components/ui/react/image";
import { Portfolio, Feature, Repository } from "@/types/portfolio";
import { Project, FeatureProjectItem } from "@/types/project";
import { CaseStudy } from "@/types/case-study";
import Modal from "@/components/ui/bootstrap/modal";
import Carousel from "@/components/ui/bootstrap/carousel";
import Badge from "@/components/ui/bootstrap/badge";
import Dropdown from "@/components/ui/bootstrap/dropdown";
import Alert from "@/components/ui/bootstrap/alert";
import Progress from "@/components/ui/bootstrap/progress";
import { formatMonthYear } from "@/utils/date";
import { getProjectStatusBadgeClass } from "./project-utils";
import { useLanguage } from "@/context/LanguageContext";

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

  if (!item) return null;

  return (
    <Modal
      id="project-detail-modal"
      show={show}
      onClose={onClose}
      title={item.title || t.sections.projects.modal.titleDefault}
      size="lg"
      scrollable
      centered
      buttonItems={[
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
                  onOpenCaseStudy(caseStudy, item.title);
                },
              },
            ]
          : []),

        ...(isPortfolio && repositories.length === 1
          ? [
              {
                label: (
                  <span className="d-inline-flex align-items-center gap-2">
                    <i
                      className={
                        repositories[0].icon
                          ? repositories[0].icon.startsWith("bi-") ||
                            repositories[0].icon.startsWith("bi ")
                            ? repositories[0].icon
                            : `bi bi-${repositories[0].icon}`
                          : "bi bi-link-45deg"
                      }
                    />
                    <span>{repositories[0].label}</span>
                    <i className="bi bi-box-arrow-up-right small" />
                  </span>
                ),
                as: "a" as const,
                href: repositories[0].href,
                target: "_blank",
                rel: "noopener noreferrer",
                color: "outline-secondary" as const,
                size: "sm" as const,
                // rounded: true,
                className: "px-3",
              },
            ]
          : []),

        ...(isPortfolio && repositories.length > 1
          ? [
              {
                custom: (
                  <Dropdown
                    direction="up"
                    size="sm"
                    buttonColor="outline-secondary"
                    buttonClass="px-3 d-inline-flex align-items-center gap-2"
                    items={repositories.map((repo) => {
                      const iconClass = repo.icon
                        ? repo.icon.startsWith("bi-") ||
                          repo.icon.startsWith("bi ")
                          ? repo.icon
                          : `bi bi-${repo.icon}`
                        : "bi bi-link-45deg";

                      return {
                        label: repo.label,
                        icon: iconClass,
                        href: repo.href,
                        hrefType: "external",
                        newTab: true,
                      };
                    })}
                  >
                    <i className="bi bi-github" />
                    <span>
                      {t.sections.projects.modal.repositories.replace(
                        "{count}",
                        repositories.length.toString(),
                      )}
                    </span>
                  </Dropdown>
                ),
              },
            ]
          : []),

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
          />
        ) : galleryImages.length === 1 ? (
          <div className="position-relative rounded-3 overflow-hidden mb-4 shadow-sm border bg-body-secondary bg-opacity-25">
            <NextImage
              src={galleryImages[0]}
              alt={item.title}
              width={1200}
              height={675}
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

          {item.subcategory && (
            <Badge
              pill
              className="bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle px-3 py-1"
            >
              {item.subcategory}
            </Badge>
          )}

          {projectItem?.status && (
            <Badge
              pill
              className={`px-3 py-1 ${getProjectStatusBadgeClass(projectItem.status)}`}
            >
              <i className="bi bi-circle-fill me-1 small" />
              {projectItem.status}
            </Badge>
          )}

          <Badge
            pill
            className="bg-body-tertiary text-muted border px-3 py-1 ms-auto"
          >
            <i className="bi bi-calendar3 me-1" />
            {formatMonthYear(
              item.start_period,
              dateLocale,
              t.common.present,
            )}{" "}
            &mdash;{" "}
            {formatMonthYear(item.finish_period, dateLocale, t.common.present)}
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
            {item.description}
          </p>
        </div>

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
            <div className="list-group list-group-flush rounded-3 border">
              {features.map((feat) => (
                <div
                  key={feat.id}
                  className="list-group-item bg-transparent py-2"
                >
                  <div className="fw-semibold small d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success" />
                    {feat.title}
                  </div>
                  {feat.description && (
                    <div className="text-muted small ps-4 mt-1">
                      {feat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Feature Progress */}
        {!isPortfolio && featureProjects.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold text-body-secondary text-uppercase small mb-2">
              {t.sections.projects.modal.featureProgress}
            </h6>
            <div className="d-flex flex-column gap-2">
              {featureProjects.map((fp) => (
                <div
                  key={fp.id}
                  className="p-3 border rounded-3 bg-body-tertiary"
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold small">{fp.title}</span>
                    <Badge
                      pill
                      className="bg-primary-subtle text-primary border border-primary-subtle"
                    >
                      {fp.progress}%
                    </Badge>
                  </div>
                  {fp.description && (
                    <div className="text-muted small mb-2">
                      {fp.description}
                    </div>
                  )}
                  <Progress value={fp.progress} color="primary" height="6px" />
                </div>
              ))}
            </div>
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
