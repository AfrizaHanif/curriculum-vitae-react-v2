"use client";

import { useMemo } from "react";
import Card, { CardGrid } from "@/components/ui/bootstrap/card";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigation } from "@/context/NavigationContext";
import { useFetch } from "@/hooks/useFetch";
import type { ApiResponse } from "@/types/api";
import type { Experience } from "@/types/experience";
import type { Project } from "@/types/project";
import type { Portfolio } from "@/types/portfolio";
import type { Certificate } from "@/types/certificate";
import fallbackExperiences from "@/data/jsons/experiences.json";
import fallbackCertificates from "@/data/jsons/certificates.json";
import fallbackProjects from "@/data/jsons/projects.json";
import fallbackPortfolios from "@/data/jsons/portfolios.json";

interface StatItem {
  icon: string;
  badgeBg: string;
  textColor: string;
  value: string;
  label: string;
  description: string;
  targetSection: string;
}

export default function AboutStats() {
  const { t } = useLanguage();
  const { scrollToSection } = useNavigation();

  // Fetch experiences to calculate real start year and cumulative duration
  const { data: expData } = useFetch<ApiResponse<Experience[]>>(
    "https://api.afrizahanif.com/api/experiences?all=true",
    { fallbackData: { data: fallbackExperiences } },
  );

  // Fetch projects and portfolios for accurate project count
  const { data: projData } = useFetch<ApiResponse<Project[]>>(
    "https://api.afrizahanif.com/api/projects?all=true",
    { fallbackData: { data: fallbackProjects } },
  );
  const { data: portData } = useFetch<ApiResponse<Portfolio[]>>(
    "https://api.afrizahanif.com/api/portfolios?all=true",
    { fallbackData: { data: fallbackPortfolios } },
  );

  // Fetch certificates for verified credentials count
  const { data: certData } = useFetch<ApiResponse<Certificate[]>>(
    "https://api.afrizahanif.com/api/certificates?all=true",
    { fallbackData: { data: fallbackCertificates } },
  );

  // 1. Calculate Real Cumulative Experience & Start Year (Hybrid Opsi 1 & Opsi 3)
  const { startYear, totalMonths, isOverOneYear, yearsCount } = useMemo(() => {
    const experiences = expData?.data ?? [];
    if (experiences.length === 0) {
      return {
        startYear: 2023,
        totalMonths: 7,
        isOverOneYear: false,
        yearsCount: 0,
      };
    }

    let monthsSum = 0;
    const startYearsList: number[] = [];

    experiences.forEach((exp) => {
      const start = new Date(exp.start_period);
      const finish = exp.finish_period
        ? new Date(exp.finish_period)
        : new Date();

      if (!isNaN(start.getTime())) {
        startYearsList.push(start.getFullYear());
        const finishTime = isNaN(finish.getTime())
          ? new Date().getTime()
          : finish.getTime();
        const diffMs = finishTime - start.getTime();
        // Calculate months based on average 30.44 days/month
        const months = Math.max(
          1,
          Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.4375)),
        );
        monthsSum += months;
      }
    });

    const minYear =
      startYearsList.length > 0 ? Math.min(...startYearsList) : 2023;
    const isOver = monthsSum >= 12;
    const yearsCount = Math.floor(monthsSum / 12);

    return {
      startYear: minYear,
      totalMonths: monthsSum,
      isOverOneYear: isOver,
      yearsCount,
    };
  }, [expData]);

  // 2. Calculate Total Projects & Portfolios
  const totalProjects = useMemo(() => {
    const pCount = projData?.data?.length ?? 0;
    const pfCount = portData?.data?.length ?? 0;
    const sum = pCount + pfCount;
    return sum > 0 ? sum : 4;
  }, [projData, portData]);

  // 3. Calculate Total Verified Certifications
  const totalCertificates = useMemo(() => {
    const cCount = certData?.data?.length ?? 0;
    return cCount > 0 ? cCount : 25;
  }, [certData]);

  // Dynamic experience card values based on cumulative duration
  const expValue = isOverOneYear
    ? `${yearsCount}+ ${t.sections.about.stats?.journey?.unitYears || "Yrs"}`
    : `${t.sections.about.stats?.journey?.since || "Since"} ${startYear}`;

  const expLabel = isOverOneYear
    ? t.sections.about.stats?.journey?.yearsLabel || "Tahun Pengalaman"
    : t.sections.about.stats?.journey?.label || "Perjalanan Web Dev";

  const expDescription = isOverOneYear
    ? t.sections.about.stats?.journey?.descYears ||
      "Membangun aplikasi web interaktif & modern"
    : `± ${totalMonths} ${
        t.sections.about.stats?.journey?.descUnderYear ||
        "bulan magang & aktif berkarya"
      }`;

  const stats: StatItem[] = [
    {
      icon: "bi-clock-history",
      badgeBg: "bg-primary-subtle",
      textColor: "text-primary",
      value: expValue,
      label: expLabel,
      description: expDescription,
      targetSection: "edu-exp",
    },
    {
      icon: "bi-code-square",
      badgeBg: "bg-success-subtle",
      textColor: "text-success",
      value: `${totalProjects}+`,
      label: t.sections.about.stats?.projects.label || "Proyek & Portofolio",
      description:
        t.sections.about.stats?.projects.description ||
        "Portofolio web, dashboard, dan sistem informasi",
      targetSection: "projects",
    },
    {
      icon: "bi-patch-check-fill",
      badgeBg: "bg-warning-subtle",
      textColor: "text-warning",
      value: `${totalCertificates}+`,
      label:
        t.sections.about.stats?.certifications.label ||
        "Sertifikasi Terverifikasi",
      description:
        t.sections.about.stats?.certifications.description ||
        "Kualifikasi bersertifikat & lisensi profesional",
      targetSection: "certifications",
    },
  ];

  return (
    <div className="mt-4">
      <CardGrid smCols={1} mdCols={3} lgCols={3} gap={4}>
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            // Navigates using scrollToSection so it stays consistent with NavigationContext
            // (Option B: updates hash to #section | Option A: hides hash if disabled in NavigationContext)
            onClick={() => scrollToSection(stat.targetSection)}
            className="h-100 p-4 border-0 shadow-sm text-center position-relative transition-all"
            style={{
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <div
              className={`rounded-circle ${stat.badgeBg} ${stat.textColor} d-inline-flex align-items-center justify-content-center mx-auto mb-3`}
              style={{ width: 56, height: 56 }}
            >
              <i className={`bi ${stat.icon} fs-3`} />
            </div>
            <h3 className={`fw-bold ${stat.textColor} mb-1`}>{stat.value}</h3>
            <div className="fw-semibold text-body mb-1">{stat.label}</div>
            <small className="text-body-secondary">{stat.description}</small>
          </Card>
        ))}
      </CardGrid>
    </div>
  );
}
