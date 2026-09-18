"use client";

import { Portfolio, Repository } from "@/types/portfolio";
import Card from "@/components/ui/bootstrap/card";
import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import Dropdown, { DropdownItem } from "@/components/ui/bootstrap/dropdown";
import { formatMonthYear } from "@/utils/date";
import TechnologyBadges from "./TechnologyBadges";
import { useLanguage } from "@/context/LanguageContext";

interface PortfolioCardProps {
  portfolio: Portfolio;
  repositories?: Repository[];
  onOpenDetails: (portfolio: Portfolio) => void;
}

export default function PortfolioCard({
  portfolio,
  repositories = [],
  onOpenDetails,
}: PortfolioCardProps) {
  const { t } = useLanguage();
  const repoDropdownItems: DropdownItem[] = repositories.map((repo) => {
    const iconClass = repo.icon
      ? repo.icon.startsWith("bi-") || repo.icon.startsWith("bi ")
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
  });

  return (
    <Card
      key={portfolio.id}
      imgSrc={portfolio.image}
      imgAlt={portfolio.title}
      imgWidth={1920}
      imgHeight={1080}
      imgStyle={{
        aspectRatio: "16 / 9",
        objectFit: "cover",
        objectPosition: "top",
      }}
      className="shadow-sm rounded-4 border transition-all h-100"
      fullHeight
      onClick={() => onOpenDetails(portfolio)}
      header={
        <div className="d-flex justify-content-between align-items-center">
          <Badge
            pill
            className="bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"
          >
            <i className="bi bi-folder2 me-1" />
            {portfolio.category || portfolio.type || "Portfolio"}
          </Badge>
          <small className="text-muted">
            <i className="bi bi-calendar3 me-1" />
            <time dateTime={portfolio.start_period}>
              {formatMonthYear(portfolio.start_period)}
            </time>
          </small>
        </div>
      }
      footer={
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted small">
            {portfolio.gallery && portfolio.gallery.length > 0 ? (
              <span>
                <i className="bi bi-images me-1" />
                {t.sections.projects.card.photos.replace(
                  "{count}",
                  portfolio.gallery.length.toString(),
                )}
              </span>
            ) : (
              <span>
                <i className="bi bi-layers me-1" />
                {portfolio.subcategory || "Project"}
              </span>
            )}
          </span>
          <div className="d-flex align-items-center gap-2">
            {repoDropdownItems.length > 0 && (
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown
                  size="sm"
                  direction="up"
                  buttonColor="outline-secondary"
                  buttonClass="px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                  showCaret={repoDropdownItems.length > 1}
                  items={repoDropdownItems}
                >
                  <i className="bi bi-box-arrow-up-right" />
                  <span className="small d-none d-sm-inline">
                    {t.sections.projects.card.links}
                  </span>
                </Dropdown>
              </div>
            )}

            <Button
              as="button"
              color="outline-primary"
              rounded
              size="sm"
              className="px-3 d-inline-flex align-items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(portfolio);
              }}
            >
              <span>{t.sections.projects.card.details}</span>
              <i className="bi bi-arrow-right-short" />
            </Button>
          </div>
        </div>
      }
    >
      <h5 className="card-title fw-bold mb-2">{portfolio.title}</h5>
      <p
        className="card-text text-muted small mb-3"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {portfolio.description}
      </p>
      <TechnologyBadges technologies={portfolio.technology} />
    </Card>
  );
}
