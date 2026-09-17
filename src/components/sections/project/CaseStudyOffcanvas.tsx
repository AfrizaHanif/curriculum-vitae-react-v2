"use client";

import { useMemo } from "react";
import NextImage from "@/components/ui/react/image";
import { getShimmerDataUrl } from "@/lib/shimmer";
import { CaseStudy, DiagramCS, SolutionCS } from "@/types/case-study";
import Offcanvas from "@/components/ui/bootstrap/offcanvas";
import Button from "@/components/ui/bootstrap/button";
import Badge from "@/components/ui/bootstrap/badge";
import { useLanguage } from "@/context/LanguageContext";

interface CaseStudyOffcanvasProps {
  show: boolean;
  caseStudy: CaseStudy | null;
  portfolioTitle?: string;
  diagram?: DiagramCS | null;
  solutions?: SolutionCS[];
  onClose: () => void;
}

function getYouTubeEmbedUrl(urlStr: string): string | null {
  try {
    const parsed = new URL(urlStr);
    let videoId = "";
    const hostname = parsed.hostname.toLowerCase();

    if (hostname === "youtu.be" || hostname.endsWith(".youtu.be")) {
      videoId = parsed.pathname.slice(1).split("/")[0];
    } else if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v") || "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "").split("/")[0];
      }
    }

    if (videoId && /^[a-zA-Z0-9_-]+$/.test(videoId)) {
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function CaseStudyOffcanvas({
  show,
  caseStudy,
  portfolioTitle,
  diagram,
  solutions = [],
  onClose,
}: CaseStudyOffcanvasProps) {
  const { t } = useLanguage();
  const youtubeEmbedUrl = caseStudy?.video
    ? getYouTubeEmbedUrl(caseStudy.video)
    : null;

  const diagramItems = useMemo(() => {
    if (!diagram) return [];
    const items: { label: string; src: string; icon: string }[] = [];
    if (diagram.context) {
      items.push({
        label: "Context Diagram",
        src: diagram.context,
        icon: "bi-diagram-3",
      });
    }
    if (diagram.dfd_0) {
      items.push({
        label: "Data Flow Diagram (Level 0)",
        src: diagram.dfd_0,
        icon: "bi-diagram-2",
      });
    }
    if (diagram.pdm) {
      items.push({
        label: "Physical Data Model (PDM)",
        src: diagram.pdm,
        icon: "bi-database",
      });
    }
    return items;
  }, [diagram]);

  return (
    <Offcanvas
      id="case-study-offcanvas"
      show={show}
      onClose={onClose}
      placement="end"
      style={{ width: "min(92vw, 680px)" }}
      title={
        <div
          className="d-flex align-items-center gap-2 text-truncate"
          style={{ minWidth: 0 }}
        >
          {/*  */}
          <Badge
            pill
            className="bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 flex-shrink-0"
          >
            <i className="bi bi-journal-code me-1" />
            {t.sections.projects.caseStudy.badge}
          </Badge>

          {/*  */}
          <span
            className="text-truncate small text-muted fw-normal flex-grow-1"
            title={portfolioTitle}
          >
            {portfolioTitle}
          </span>
        </div>
      }
    >
      {caseStudy && (
        <div className="d-flex flex-column gap-4 py-2">
          {/* Role Banner */}
          {caseStudy.role && (
            <div className="p-3 bg-body-tertiary rounded-3 border">
              <div className="text-muted small text-uppercase fw-semibold">
                {t.sections.projects.caseStudy.role}
              </div>
              <div className="fw-bold text-primary fs-6">
                <i className="bi bi-person-workspace me-2" />
                {caseStudy.role}
              </div>
            </div>
          )}

          {/* Video Walkthrough (if available) */}
          {caseStudy.video && (
            <div>
              <h6 className="fw-bold text-uppercase small text-body-secondary mb-2">
                {t.sections.projects.caseStudy.walkthrough}
              </h6>
              {youtubeEmbedUrl ? (
                <div className="ratio ratio-16x9 rounded-3 overflow-hidden border shadow-sm">
                  <iframe
                    src={youtubeEmbedUrl}
                    title="Case Study Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                  />
                </div>
              ) : (
                <Button
                  as="a"
                  href={caseStudy.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="outline-danger"
                  size="sm"
                  rounded
                  className="px-3 d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-play-circle-fill" />
                  <span>{t.sections.projects.caseStudy.watchVideo}</span>
                  <i className="bi bi-box-arrow-up-right small" />
                </Button>
              )}
            </div>
          )}

          {/* Goal & Objectives */}
          {caseStudy.goal && caseStudy.goal.length > 0 && (
            <div className="border-start border-primary border-3 ps-3">
              <h6 className="fw-bold text-uppercase small text-body-secondary mb-2">
                {t.sections.projects.caseStudy.goal}
              </h6>
              <ul className="mb-0 ps-3 text-body small">
                {caseStudy.goal.map((g, idx) => (
                  <li key={idx} className="mb-1">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Problems & Pain Points */}
          {caseStudy.problems && caseStudy.problems.length > 0 && (
            <div className="p-3 rounded-3 bg-danger-subtle text-danger-emphasis border border-danger-subtle">
              <h6 className="fw-bold text-uppercase small mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-octagon-fill text-danger" />
                {t.sections.projects.caseStudy.problems}
              </h6>
              <ul className="mb-0 ps-3 small">
                {caseStudy.problems.map((p, idx) => (
                  <li key={idx} className="mb-1">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Implemented Solutions */}
          {solutions && solutions.length > 0 && (
            <div>
              <h6 className="fw-bold text-uppercase small text-body-secondary mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-lightbulb-fill text-warning" />
                {t.sections.projects.caseStudy.solutions}
              </h6>
              <div className="d-flex flex-column gap-3">
                {solutions.map((sol) => (
                  <div
                    key={sol.id}
                    className="p-3 rounded-3 bg-body-tertiary border"
                  >
                    <div className="fw-semibold text-body mb-1 d-flex align-items-center gap-2">
                      <i className="bi bi-check2-circle text-success flex-shrink-0" />
                      <span>{sol.title}</span>
                    </div>
                    <p
                      className="text-muted small mb-0 ps-4"
                      style={{ lineHeight: "1.6" }}
                    >
                      {sol.context}
                    </p>
                    {sol.visual && (
                      <div className="mt-2 ps-4">
                        <a
                          href={sol.visual}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-inline-block"
                        >
                          <NextImage
                            src={sol.visual}
                            alt={sol.title}
                            width={600}
                            height={300}
                            placeholder="blur"
                            blurDataURL={getShimmerDataUrl(600, 300)}
                            className="img-fluid rounded border shadow-sm"
                            style={{ maxHeight: "180px", objectFit: "contain" }}
                          />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {caseStudy.responsibles && caseStudy.responsibles.length > 0 && (
            <div>
              <h6 className="fw-bold text-uppercase small text-body-secondary mb-2">
                {t.sections.projects.caseStudy.responsibilities}
              </h6>
              <ul className="list-group list-group-flush rounded-3 border">
                {caseStudy.responsibles.map((r, idx) => (
                  <li key={idx} className="list-group-item small text-body">
                    <i className="bi bi-check2-circle text-primary me-2" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Methodology & Progress */}
          {caseStudy.progress && caseStudy.progress.length > 0 && (
            <div>
              <h6 className="fw-bold text-uppercase small text-body-secondary mb-2">
                {t.sections.projects.caseStudy.process}
              </h6>
              <div className="d-flex flex-column gap-2">
                {caseStudy.progress.map((prog, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-3 bg-body-secondary border small d-flex align-items-start gap-2"
                  >
                    <Badge
                      color="primary"
                      className="text-white rounded-circle px-2 py-1"
                    >
                      {idx + 1}
                    </Badge>
                    <div className="flex-grow-1">{prog}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Architecture & Diagrams */}
          {diagramItems.length > 0 && (
            <div>
              <h6 className="fw-bold text-uppercase small text-body-secondary mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-diagram-3-fill text-primary" />
                {t.sections.projects.caseStudy.architecture}
              </h6>
              <div className="d-flex flex-column gap-3">
                {diagramItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="border rounded-3 overflow-hidden bg-body-tertiary"
                  >
                    <div className="p-2 px-3 border-bottom d-flex justify-content-between align-items-center bg-body-secondary">
                      <span className="small fw-semibold d-flex align-items-center gap-2">
                        <i className={`bi ${item.icon} text-primary`} />
                        {item.label}
                      </span>
                      <Button
                        as="a"
                        href={item.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="outline-secondary"
                        size="sm"
                        className="py-0 px-2 small d-inline-flex align-items-center gap-1"
                      >
                        <span>{t.sections.projects.caseStudy.fullImage}</span>
                        <i className="bi bi-box-arrow-up-right small" />
                      </Button>
                    </div>
                    <div className="p-2 text-center bg-white">
                      <a
                        href={item.src}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <NextImage
                          src={item.src}
                          alt={item.label}
                          width={800}
                          height={500}
                          placeholder="blur"
                          blurDataURL={getShimmerDataUrl(800, 500)}
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "260px",
                            objectFit: "contain",
                            width: "auto",
                          }}
                          loading="lazy"
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges & Lessons */}
          {((caseStudy.challenges && caseStudy.challenges.length > 0) ||
            (caseStudy.lessons && caseStudy.lessons.length > 0)) && (
            <div className="d-flex flex-column gap-3">
              {caseStudy.challenges && caseStudy.challenges.length > 0 && (
                <div className="p-3 rounded-3 bg-warning-subtle text-warning-emphasis border border-warning-subtle">
                  <h6 className="fw-bold text-uppercase small mb-2 d-flex align-items-center gap-2">
                    <i className="bi bi-lightning-charge-fill" />
                    {t.sections.projects.caseStudy.challenges}
                  </h6>
                  <ul className="mb-0 ps-3 small">
                    {caseStudy.challenges.map((c, idx) => (
                      <li key={idx} className="mb-1">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {caseStudy.lessons && caseStudy.lessons.length > 0 && (
                <div className="p-3 rounded-3 bg-info-subtle text-info-emphasis border border-info-subtle">
                  <h6 className="fw-bold text-uppercase small mb-2 d-flex align-items-center gap-2">
                    <i className="bi bi-lightbulb-fill" />
                    {t.sections.projects.caseStudy.lessons}
                  </h6>
                  <ul className="mb-0 ps-3 small">
                    {caseStudy.lessons.map((l, idx) => (
                      <li key={idx} className="mb-1">
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Benefits & Impact */}
          {caseStudy.benefits && caseStudy.benefits.length > 0 && (
            <div>
              <h6 className="fw-bold text-uppercase small text-body-secondary mb-2">
                {t.sections.projects.caseStudy.benefits}
              </h6>
              <ul className="list-group list-group-flush rounded-3 border">
                {caseStudy.benefits.map((b, idx) => (
                  <li key={idx} className="list-group-item small text-body">
                    <i className="bi bi-arrow-up-right-circle text-success me-2" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Results & Outcomes */}
          {caseStudy.results && caseStudy.results.length > 0 && (
            <div className="p-3 rounded-3 bg-success-subtle text-success-emphasis border border-success-subtle">
              <h6 className="fw-bold text-uppercase small mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-trophy-fill text-success" />
                {t.sections.projects.caseStudy.results}
              </h6>
              <ul className="mb-0 ps-3 small">
                {caseStudy.results.map((res, idx) => (
                  <li key={idx} className="mb-1">
                    {res}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Offcanvas>
  );
}
