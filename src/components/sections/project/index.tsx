"use client";

import { useMemo, useState, useCallback, Suspense, ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import { FeatureProjectItem, Project } from "@/types/project";
import { ApiResponse } from "@/types/api";
import { Feature, Portfolio, Repository } from "@/types/portfolio";
import { CaseStudy, DiagramCS, SolutionCS } from "@/types/case-study";
import NavTab, { NavTabItem } from "@/components/ui/bootstrap/nav-tab";
import { CardGrid } from "@/components/ui/bootstrap/card";
import ContentCarousel from "@/components/ui/customs/content-carousel";
import Alert from "@/components/ui/bootstrap/alert";
import { useResponsiveItemsPerPage } from "@/hooks/useResponsiveItemsPerPage";

import dynamic from "next/dynamic";
import PortfolioCard from "./PortfolioCard";
import ProjectCard from "./ProjectCard";
import ProjectGridSkeleton from "./ProjectCardSkeleton";
import ProjectFilterToolbar from "./filter/ProjectFilterToolbar";
import { matchCategory, matchTechnology, matchTag } from "./project-utils";
const CaseStudyOffcanvas = dynamic(() => import("./CaseStudyOffcanvas"), {
  ssr: false,
});
const ProjectDetailModal = dynamic(() => import("./ProjectDetailModal"), {
  ssr: false,
});
import "./project.css";
import { sortByLatestPeriod } from "@/utils/date";
import { useLanguage } from "@/context/LanguageContext";
import fallbackPortfolios from "@/data/jsons/portfolios.json";
import fallbackFeatures from "@/data/jsons/features.json";
import fallbackProjects from "@/data/jsons/projects.json";
import fallbackCaseStudies from "@/data/jsons/case-studies.json";
import { getApiUrl, siteConfig } from "@/config/siteConfig";
import { chunkArray } from "@/utils/array";

interface ShowcaseTabContentProps<T extends { id: string | number }> {
  carouselId: string;
  items: T[];
  chunks: T[][];
  itemsPerPage: number;
  isLoading: boolean;
  error: Error | null;
  loadingLabel?: string;
  errorLabel: string;
  emptyLabel: string;
  renderCard: (item: T) => ReactNode;
}

// Showcase Tab Content
function ShowcaseTabContent<T extends { id: string | number }>({
  carouselId,
  items,
  chunks,
  itemsPerPage,
  isLoading,
  error,
  errorLabel,
  emptyLabel,
  renderCard,
}: ShowcaseTabContentProps<T>) {
  if (isLoading) {
    return <ProjectGridSkeleton count={itemsPerPage || 3} />;
  }

  if (error) {
    return (
      <Alert color="danger" className="mx-auto" style={{ maxWidth: "600px" }}>
        {errorLabel}: {error.message}
      </Alert>
    );
  }

  if (items.length === 0) {
    return <p className="text-center text-muted">{emptyLabel}</p>;
  }

  if (items.length <= itemsPerPage) {
    return (
      <CardGrid xxlCols={4} xlCols={3} lgCols={3} mdCols={2} smCols={1}>
        {items.map((item) => renderCard(item))}
      </CardGrid>
    );
  }

  return (
    <ContentCarousel
      id={carouselId}
      className="carousel-dark"
      autoPlay={false}
      withIndicators
      withControls
      controlsPosition="bottom"
    >
      {chunks.map((chunk, slideIdx) => (
        <div key={slideIdx} className="px-1 py-2">
          <CardGrid xxlCols={4} xlCols={3} lgCols={3} mdCols={2} smCols={1}>
            {chunk.map((item) => renderCard(item))}
          </CardGrid>
        </div>
      ))}
    </ContentCarousel>
  );
}

// Project Section Content
function ProjectSectionContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL query params
  const currentCategory = (searchParams.get("category") || "all").toLowerCase();
  const currentTech = (searchParams.get("tech") || "").toLowerCase();
  const currentTag = (searchParams.get("tag") || "").toLowerCase();

  // Set filter param
  const setFilterParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value.toLowerCase() === "all") {
        params.delete(name);
      } else {
        params.set(name, value.toLowerCase());
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("tech");
    params.delete("tag");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  // Fetch API Data
  const {
    data: dataPortfolio,
    isLoading: isLoadingPortfolio,
    error: errorPortfolio,
  } = useFetch<ApiResponse<Portfolio[]>>(
    getApiUrl("portfolios"),
    { fallbackData: { data: fallbackPortfolios } },
  );
  const { data: dataFeaturePortfolio } = useFetch<ApiResponse<Feature[]>>(
    getApiUrl("features"),
    { fallbackData: { data: fallbackFeatures } },
  );
  const {
    data: dataProject,
    isLoading: isLoadingProject,
    error: errorProject,
  } = useFetch<ApiResponse<Project[]>>(
    getApiUrl("projects"),
    { fallbackData: { data: fallbackProjects } },
  );
  const { data: dataCaseStudy } = useFetch<ApiResponse<CaseStudy[]>>(
    getApiUrl("caseStudies"),
    { fallbackData: { data: fallbackCaseStudies } },
  );

  // Data Processing
  const portfolios = useMemo(
    () => sortByLatestPeriod(dataPortfolio?.data ?? []),
    [dataPortfolio],
  );
  const featurePortfolios = useMemo(
    () => dataFeaturePortfolio?.data ?? [],
    [dataFeaturePortfolio],
  );
  const projects = useMemo(
    () => sortByLatestPeriod(dataProject?.data ?? []),
    [dataProject],
  );
  const caseStudies = useMemo(() => dataCaseStudy?.data ?? [], [dataCaseStudy]);

  const caseStudyMap = useMemo(() => {
    const map = new Map<string, CaseStudy>();
    caseStudies.forEach((cs) => {
      if (cs.portfolio_id) {
        map.set(cs.portfolio_id, cs);
      }
    });
    portfolios.forEach((p) => {
      if (p.case_studies && p.case_studies.length > 0) {
        map.set(p.id, p.case_studies[0]);
      }
    });
    return map;
  }, [caseStudies, portfolios]);

  const diagramMap = useMemo(() => {
    const map = new Map<string, DiagramCS>();
    caseStudies.forEach((cs) => {
      if (cs.diagrams && cs.diagrams.length > 0) {
        const first = cs.diagrams[0];
        map.set(cs.id, {
          case_study_id: cs.id,
          name: first.name,
          images: first.images,
          ...first,
        });
      }
    });
    return map;
  }, [caseStudies]);

  const solutionMap = useMemo(() => {
    const map = new Map<string, SolutionCS[]>();
    caseStudies.forEach((cs) => {
      if (cs.solutions && cs.solutions.length > 0) {
        map.set(cs.id, cs.solutions as SolutionCS[]);
      }
    });
    return map;
  }, [caseStudies]);

  const featurePortfolioMap = useMemo(() => {
    const map = new Map<string, Feature[]>();
    featurePortfolios.forEach((feat) => {
      const key =
        feat.portfolio_id ||
        (feat.featureable_type?.includes("Portfolio")
          ? feat.featureable_id
          : undefined);
      if (key) {
        const list = map.get(key) ?? [];
        list.push(feat);
        map.set(key, list);
      }
    });
    portfolios.forEach((p) => {
      if (p.features && p.features.length > 0) {
        map.set(p.id, p.features);
      }
    });
    return map;
  }, [featurePortfolios, portfolios]);

  const repositoryMap = useMemo(() => {
    const map = new Map<string, Repository[]>();
    portfolios.forEach((p) => {
      if (p.repositories && p.repositories.length > 0) {
        map.set(p.id, p.repositories);
      }
    });
    return map;
  }, [portfolios]);

  const featureProjectMap = useMemo(() => {
    const map = new Map<string, FeatureProjectItem[]>();
    featurePortfolios.forEach((feat) => {
      if (feat.featureable_type?.includes("Project") && feat.featureable_id) {
        const list = map.get(feat.featureable_id) ?? [];
        if (!list.some((item) => item.id === feat.id)) {
          list.push(feat);
          map.set(feat.featureable_id, list);
        }
      }
    });
    projects.forEach((prj) => {
      if (prj.features && prj.features.length > 0) {
        map.set(prj.id, prj.features);
      }
    });
    return map;
  }, [featurePortfolios, projects]);

  // Selected item for Case Study Offcanvas
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<{
    caseStudy: CaseStudy;
    portfolioTitle: string;
  } | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);

  // Open case study
  const openCaseStudy = (caseStudy: CaseStudy, portfolioTitle: string) => {
    setSelectedCaseStudy({ caseStudy, portfolioTitle });
    setShowCaseStudy(true);
  };

  // Items per page
  const itemsPerPage = useResponsiveItemsPerPage(
    siteConfig.projects.itemsPerPage,
  );

  // Available technologies across portfolios and projects
  const availableTechs = useMemo(() => {
    const techSet = new Set<string>();
    portfolios.forEach((p) => p.technology?.forEach((t) => techSet.add(t)));
    projects.forEach((p) => p.technology?.forEach((t) => techSet.add(t)));
    return Array.from(techSet).sort((a, b) => a.localeCompare(b));
  }, [portfolios, projects]);

  // Available tags across portfolios and projects
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    portfolios.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    projects.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [portfolios, projects]);

  // Filtered lists based on URL query params
  const filteredPortfolios = useMemo(() => {
    return portfolios.filter(
      (item) =>
        matchCategory(item, currentCategory) &&
        matchTechnology(item, currentTech) &&
        matchTag(item, currentTag),
    );
  }, [portfolios, currentCategory, currentTech, currentTag]);

  // Filtered projects based on URL query params
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (item) =>
        matchCategory(item, currentCategory) &&
        matchTechnology(item, currentTech) &&
        matchTag(item, currentTag),
    );
  }, [projects, currentCategory, currentTech, currentTag]);

  // Dynamic category options with counts
  const categoryOptions = useMemo(() => {
    const combined = [...portfolios, ...projects];
    const baseCategories = [
      { key: "all", label: "All", count: combined.length },
      {
        key: "fullstack",
        label: "Full-Stack",
        count: combined.filter((item) => matchCategory(item, "fullstack"))
          .length,
      },
      {
        key: "backend",
        label: "Backend / API",
        count: combined.filter((item) => matchCategory(item, "backend")).length,
      },
      {
        key: "frontend",
        label: "Front-End",
        count: combined.filter((item) => matchCategory(item, "frontend"))
          .length,
      },
      {
        key: "mobile",
        label: "Mobile",
        count: combined.filter((item) => matchCategory(item, "mobile")).length,
      },
    ];

    // Dynamically discover any additional categories present in items
    const extraCategories: { key: string; label: string; count: number }[] = [];
    combined.forEach((item) => {
      const rawCat = item.category?.trim();
      if (!rawCat) return;
      const isBase = ["fullstack", "backend", "frontend", "mobile"].some(
        (baseKey) => matchCategory(item, baseKey),
      );
      if (!isBase) {
        const existing = extraCategories.find(
          (c) => c.key.toLowerCase() === rawCat.toLowerCase(),
        );
        if (existing) {
          existing.count += 1;
        } else {
          extraCategories.push({
            key: rawCat.toLowerCase(),
            label: rawCat,
            count: 1,
          });
        }
      }
    });

    const activeList = [
      ...baseCategories.filter((c) => c.key === "all" || c.count > 0),
      ...extraCategories,
    ];

    if (
      currentCategory !== "all" &&
      !activeList.some((c) => c.key === currentCategory)
    ) {
      activeList.push({
        key: currentCategory,
        label: currentCategory,
        count: combined.filter((item) => matchCategory(item, currentCategory))
          .length,
      });
    }

    return activeList;
  }, [portfolios, projects, currentCategory]);

  // Portfolio chunks based on URL query params
  const portfolioChunks = useMemo(
    () => chunkArray(filteredPortfolios, itemsPerPage),
    [filteredPortfolios, itemsPerPage],
  );

  // Project chunks based on URL query params
  const projectChunks = useMemo(
    () => chunkArray(filteredProjects, itemsPerPage),
    [filteredProjects, itemsPerPage],
  );

  // Selected item for Dynamic Detail Modal
  const [selectedItem, setSelectedItem] = useState<{
    item: Portfolio | Project;
    type: "portfolio" | "project";
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Open detail modal
  const openDetailModal = (
    item: Portfolio | Project,
    type: "portfolio" | "project",
  ) => {
    setSelectedItem({ item, type });
    setShowModal(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // Tab items
  const tabItems: NavTabItem[] = [
    {
      id: "portfolio-tab",
      title: t.sections.projects.tabs.portfolio,
      content: (
        <ShowcaseTabContent
          carouselId="portfolio-content-carousel"
          items={filteredPortfolios}
          chunks={portfolioChunks}
          itemsPerPage={itemsPerPage}
          isLoading={isLoadingPortfolio}
          error={errorPortfolio}
          loadingLabel={t.sections.projects.loadingPortfolio}
          errorLabel={t.sections.projects.errorPortfolio}
          emptyLabel={t.sections.projects.emptyPortfolio}
          renderCard={(portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              repositories={repositoryMap.get(portfolio.id) ?? []}
              onOpenDetails={(p) => openDetailModal(p, "portfolio")}
            />
          )}
        />
      ),
    },
    {
      id: "project-tab",
      title: t.sections.projects.tabs.project,
      content: (
        <ShowcaseTabContent
          carouselId="project-content-carousel"
          items={filteredProjects}
          chunks={projectChunks}
          itemsPerPage={itemsPerPage}
          isLoading={isLoadingProject}
          error={errorProject}
          loadingLabel={t.sections.projects.loadingProject}
          errorLabel={t.sections.projects.errorProject}
          emptyLabel={t.sections.projects.emptyProject}
          renderCard={(project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetails={(p) => openDetailModal(p, "project")}
            />
          )}
        />
      ),
    },
  ];

  return (
    <Section id="projects" minFullHeight overflow="visible">
      {/* Section Header */}
      <SectionHeader
        title={t.sections.projects.title}
        subtitle={t.sections.projects.subtitle}
      />

      <div className="mt-4">
        <NavTab
          id="projects-tabs"
          items={tabItems}
          variant="pills"
          className="timeline-pills-container"
          navClassName="justify-content-center gap-1"
          defaultActiveIndex={0}
          headerBottomSlot={
            <ProjectFilterToolbar
              categories={categoryOptions}
              activeCategory={currentCategory}
              onSelectCategory={(cat) => setFilterParam("category", cat)}
              availableTechs={availableTechs}
              activeTech={currentTech}
              onSelectTech={(tech) => setFilterParam("tech", tech)}
              availableTags={availableTags}
              activeTag={currentTag}
              onSelectTag={(tag) => setFilterParam("tag", tag)}
              onReset={resetFilters}
              totalFiltered={filteredPortfolios.length + filteredProjects.length}
              totalAll={portfolios.length + projects.length}
              filterAllLabel={
                t.sections.skills.filterAll
                  ? `${t.sections.skills.filterAll} Categories`
                  : "All Categories"
              }
            />
          }
        />
      </div>

      {/* Dynamic Detail Modal */}
      <ProjectDetailModal
        show={showModal}
        item={selectedItem?.item ?? null}
        type={selectedItem?.type ?? null}
        caseStudy={
          selectedItem?.item
            ? (caseStudyMap.get(selectedItem.item.id) ?? null)
            : null
        }
        features={
          selectedItem?.type === "portfolio" && selectedItem?.item
            ? (featurePortfolioMap.get(selectedItem.item.id) ?? [])
            : []
        }
        featureProjects={
          selectedItem?.type === "project" && selectedItem?.item
            ? (featureProjectMap.get(selectedItem.item.id) ?? [])
            : []
        }
        repositories={
          selectedItem?.type === "portfolio" && selectedItem?.item
            ? (repositoryMap.get(selectedItem.item.id) ?? [])
            : []
        }
        onClose={closeDetailModal}
        onOpenCaseStudy={openCaseStudy}
      />

      {/* Case Study Offcanvas Drawer */}
      <CaseStudyOffcanvas
        show={showCaseStudy}
        caseStudy={selectedCaseStudy?.caseStudy ?? null}
        portfolioTitle={selectedCaseStudy?.portfolioTitle}
        diagram={
          selectedCaseStudy?.caseStudy
            ? (diagramMap.get(selectedCaseStudy.caseStudy.id) ?? null)
            : null
        }
        solutions={
          selectedCaseStudy?.caseStudy
            ? (solutionMap.get(selectedCaseStudy.caseStudy.id) ?? [])
            : []
        }
        onClose={() => {
          setShowCaseStudy(false);
          setSelectedCaseStudy(null);
        }}
      />
    </Section>
  );
}

export default function ProjectSection() {
  return (
    // Project Section (Using Suspense)
    <Suspense fallback={<ProjectGridSkeleton count={3} />}>
      <ProjectSectionContent />
    </Suspense>
  );
}
