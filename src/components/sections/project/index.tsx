"use client";

import { useMemo, useState, ReactNode } from "react";
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
import fallbackRepositories from "@/data/jsons/repositories.json";
import fallbackProjects from "@/data/jsons/projects.json";
import fallbackFeatureProjects from "@/data/jsons/feature-projects.json";
import fallbackCaseStudies from "@/data/jsons/case-studies.json";
import fallbackDiagrams from "@/data/jsons/diagrams.json";
import fallbackSolutions from "@/data/jsons/solutions.json";

const DESKTOP_ITEMS_PER_PAGE = 3;

function chunkArray<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr];
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

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
      <CardGrid lgCols={3} mdCols={2} smCols={1}>
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
          <CardGrid lgCols={3} mdCols={2} smCols={1}>
            {chunk.map((item) => renderCard(item))}
          </CardGrid>
        </div>
      ))}
    </ContentCarousel>
  );
}

export default function ProjectSection() {
  const { t } = useLanguage();
  const {
    data: dataPortfolio,
    isLoading: isLoadingPortfolio,
    error: errorPortfolio,
  } = useFetch<ApiResponse<Portfolio[]>>(
    "https://api.afrizahanif.com/api/portfolios?all=true",
    { fallbackData: { data: fallbackPortfolios } },
  );
  const portfolios = useMemo(
    () => sortByLatestPeriod(dataPortfolio?.data ?? []),
    [dataPortfolio],
  );

  const { data: dataFeaturePortfolio } = useFetch<ApiResponse<Feature[]>>(
    "https://api.afrizahanif.com/api/features?all=true",
    { fallbackData: { data: fallbackFeatures } },
  );
  const featurePortfolios = useMemo(
    () => dataFeaturePortfolio?.data ?? [],
    [dataFeaturePortfolio],
  );

  const { data: dataRepositories } = useFetch<ApiResponse<Repository[]>>(
    "https://api.afrizahanif.com/api/repositories?all=true",
    { fallbackData: { data: fallbackRepositories } },
  );
  const repositories = useMemo(
    () => dataRepositories?.data ?? [],
    [dataRepositories],
  );

  const {
    data: dataProject,
    isLoading: isLoadingProject,
    error: errorProject,
  } = useFetch<ApiResponse<Project[]>>(
    "https://api.afrizahanif.com/api/projects?all=true",
    { fallbackData: { data: fallbackProjects } },
  );
  const projects = useMemo(
    () => sortByLatestPeriod(dataProject?.data ?? []),
    [dataProject],
  );

  const { data: dataFeatureProjects } = useFetch<
    ApiResponse<FeatureProjectItem[]>
  >("https://api.afrizahanif.com/api/feature-projects?all=true", {
    fallbackData: { data: fallbackFeatureProjects },
  });
  const featureProjects = useMemo(
    () => dataFeatureProjects?.data ?? [],
    [dataFeatureProjects],
  );

  const { data: dataCaseStudy } = useFetch<ApiResponse<CaseStudy[]>>(
    "https://api.afrizahanif.com/api/case-studies?all=true",
    { fallbackData: { data: fallbackCaseStudies } },
  );
  const caseStudies = useMemo(() => dataCaseStudy?.data ?? [], [dataCaseStudy]);

  const { data: dataDiagram } = useFetch<ApiResponse<DiagramCS[]>>(
    "https://api.afrizahanif.com/api/diagrams?all=true",
    { fallbackData: { data: fallbackDiagrams } },
  );
  const diagrams = useMemo(() => dataDiagram?.data ?? [], [dataDiagram]);

  const { data: dataSolution } = useFetch<ApiResponse<SolutionCS[]>>(
    "https://api.afrizahanif.com/api/solutions?all=true",
    { fallbackData: { data: fallbackSolutions } },
  );
  const solutions = useMemo(() => dataSolution?.data ?? [], [dataSolution]);

  const caseStudyMap = useMemo(() => {
    const map = new Map<string, CaseStudy>();
    caseStudies.forEach((cs) => {
      if (cs.portfolio_id) {
        map.set(cs.portfolio_id, cs);
      }
    });
    return map;
  }, [caseStudies]);

  const diagramMap = useMemo(() => {
    const map = new Map<string, DiagramCS>();
    diagrams.forEach((diag) => {
      if (diag.case_study_id) {
        map.set(diag.case_study_id, diag);
      }
    });
    return map;
  }, [diagrams]);

  const solutionMap = useMemo(() => {
    const map = new Map<string, SolutionCS[]>();
    solutions.forEach((sol) => {
      if (sol.case_study_id) {
        const list = map.get(sol.case_study_id) ?? [];
        list.push(sol);
        map.set(sol.case_study_id, list);
      }
    });
    return map;
  }, [solutions]);

  const featurePortfolioMap = useMemo(() => {
    const map = new Map<string, Feature[]>();
    featurePortfolios.forEach((feat) => {
      const list = map.get(feat.portfolio_id) ?? [];
      list.push(feat);
      map.set(feat.portfolio_id, list);
    });
    return map;
  }, [featurePortfolios]);

  const repositoryMap = useMemo(() => {
    const map = new Map<string, Repository[]>();
    repositories.forEach((repo) => {
      const list = map.get(repo.portfolio_id) ?? [];
      list.push(repo);
      map.set(repo.portfolio_id, list);
    });
    return map;
  }, [repositories]);

  const featureProjectMap = useMemo(() => {
    const map = new Map<string, FeatureProjectItem[]>();
    featureProjects.forEach((fp) => {
      const list = map.get(fp.project_id) ?? [];
      list.push(fp);
      map.set(fp.project_id, list);
    });
    return map;
  }, [featureProjects]);

  // Selected item for Case Study Offcanvas
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<{
    caseStudy: CaseStudy;
    portfolioTitle: string;
  } | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);

  const openCaseStudy = (caseStudy: CaseStudy, portfolioTitle: string) => {
    setSelectedCaseStudy({ caseStudy, portfolioTitle });
    setShowCaseStudy(true);
  };

  const itemsPerPage = useResponsiveItemsPerPage(DESKTOP_ITEMS_PER_PAGE);

  const portfolioChunks = useMemo(
    () => chunkArray(portfolios, itemsPerPage),
    [portfolios, itemsPerPage],
  );

  const projectChunks = useMemo(
    () => chunkArray(projects, itemsPerPage),
    [projects, itemsPerPage],
  );

  // Selected item for Dynamic Detail Modal
  const [selectedItem, setSelectedItem] = useState<{
    item: Portfolio | Project;
    type: "portfolio" | "project";
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openDetailModal = (
    item: Portfolio | Project,
    type: "portfolio" | "project",
  ) => {
    setSelectedItem({ item, type });
    setShowModal(true);
  };

  const closeDetailModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const tabItems: NavTabItem[] = [
    {
      id: "portfolio-tab",
      title: t.sections.projects.tabs.portfolio,
      content: (
        <ShowcaseTabContent
          carouselId="portfolio-content-carousel"
          items={portfolios}
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
          items={projects}
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
    <Section id="projects" minFullHeight>
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
