"use client";

import { useMemo } from "react";
import Footer from "@/components/layouts/footer";
import { useFetch } from "@/hooks/useFetch";
import { getApiUrl, siteConfig } from "@/config/siteConfig";
import { formatMonthYear, sortByLatestPeriod } from "@/utils/date";

// Types
import type { ProfileApiResponse } from "@/types/profile";
import type { Experience, ExperienceApiResponse } from "@/types/experience";
import type { Education, EducationApiResponse } from "@/types/education";
import type { SkillApiResponse } from "@/types/skill";

// Fallbacks
import fallbackProfiles from "@/data/jsons/profiles.json";
import fallbackExperiences from "@/data/jsons/experiences.json";
import fallbackEducations from "@/data/jsons/educations.json";
import fallbackSkills from "@/data/jsons/skills.json";

import "./resume.css";
import ResumeHeader from "./ResumeHeader";

export default function ResumePage() {
  // 1. Fetch Profile Data (Priority API, Fallback JSON)
  const { data: profileData } = useFetch<ProfileApiResponse>(
    getApiUrl("profiles"),
    { fallbackData: { data: fallbackProfiles } },
  );
  const profile = profileData?.data?.[0];

  // 2. Fetch Experience Data
  const { data: expData } = useFetch<ExperienceApiResponse>(
    getApiUrl("experiences"),
    { fallbackData: { data: fallbackExperiences } },
  );
  const experiences = useMemo<Experience[]>(
    () => sortByLatestPeriod(expData?.data ?? []),
    [expData?.data],
  );

  // 3. Fetch Education Data
  const { data: eduData } = useFetch<EducationApiResponse>(
    getApiUrl("educations"),
    { fallbackData: { data: fallbackEducations } },
  );
  const educations = useMemo<Education[]>(
    () => sortByLatestPeriod(eduData?.data ?? []),
    [eduData?.data],
  );

  // 4. Fetch Skills Data
  const { data: skillData } = useFetch<SkillApiResponse>(getApiUrl("skills"), {
    fallbackData: { data: fallbackSkills },
  });
  const skills = skillData?.data ?? [];

  const handlePrint = () => {
    window.print();
  };

  const renderDescription = (desc?: string | string[] | null) => {
    if (!desc) return null;
    if (Array.isArray(desc)) {
      return (
        <ul className="resume-list">
          {desc.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="mb-1">{desc}</p>;
  };

  return (
    <div className="resume-wrapper bg-body-tertiary min-vh-100">
      {/* Top Navbar Header (Follows header.tsx styling, hidden during print) */}
      <ResumeHeader
        fullname={profile?.fullname}
        originalPdfUrl={profile?.resume}
        onPrint={handlePrint}
      />

      {/* Main Resume Sheet (ATS-Friendly Semantic Layout - Always Light Mode) */}
      <main
        className="resume-sheet bg-white text-dark my-4 mx-auto p-4 p-md-5 shadow-sm rounded-1"
        data-bs-theme="light"
      >
        {/* Header: Personal Info & Contact */}
        <header className="resume-header text-center pb-2 border-bottom">
          <h1 className="h2 fw-bold text-uppercase mb-1 tracking-wide">
            {profile?.fullname || siteConfig.site.name}
          </h1>
          <p className="fw-semibold text-muted mb-2">
            {profile?.tagline || siteConfig.site.jobTitle}
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2 small text-muted">
            {profile?.current_city && (
              <span>
                <i className="bi bi-geo-alt me-1" />
                {profile.current_city}
                {profile.current_province
                  ? `, ${profile.current_province}`
                  : ""}
                , Indonesia
              </span>
            )}
            {profile?.email && (
              <span>
                • <i className="bi bi-envelope me-1" />
                <a
                  href={`mailto:${profile.email}`}
                  className="text-reset text-decoration-none"
                >
                  {profile.email}
                </a>
              </span>
            )}
            {profile?.phone && (
              <span>
                • <i className="bi bi-telephone me-1" />
                <a
                  href={`tel:${profile.phone}`}
                  className="text-reset text-decoration-none"
                >
                  {profile.phone}
                </a>
              </span>
            )}
            {siteConfig.site.socials.linkedin && (
              <span>
                • <i className="bi bi-linkedin me-1" />
                <a
                  href={siteConfig.site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-reset text-decoration-none"
                >
                  linkedin.com/in/afrizahanif
                </a>
              </span>
            )}
            {siteConfig.site.socials.github && (
              <span>
                • <i className="bi bi-github me-1" />
                <a
                  href={siteConfig.site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-reset text-decoration-none"
                >
                  github.com/afrizahanif
                </a>
              </span>
            )}
          </div>
        </header>

        {/* Section: Professional Summary */}
        {profile?.description && (
          <section className="resume-section mt-3">
            <h2 className="resume-section-title">Ringkasan Profesional</h2>
            <p className="mb-0 text-justify leading-relaxed">
              {profile.description}
            </p>
          </section>
        )}

        {/* Section: Work Experience */}
        {experiences.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-title">Pengalaman Kerja</h2>
            <div className="d-flex flex-column gap-3">
              {experiences.map((exp) => (
                <article key={exp.id} className="resume-item-block">
                  <div className="d-flex justify-content-between align-items-baseline">
                    <h3 className="h6 fw-bold mb-0 text-dark">{exp.title}</h3>
                    <span className="small text-muted fw-medium">
                      {formatMonthYear(exp.start_period)} –{" "}
                      {formatMonthYear(exp.finish_period)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-baseline mb-2">
                    <span className="fst-italic text-secondary small">
                      {exp.location}
                    </span>
                    {exp.address && (
                      <span className="small text-muted d-print-none">
                        {exp.address.split(",")[0]}
                      </span>
                    )}
                  </div>
                  {renderDescription(exp.description)}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Section: Education */}
        {educations.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-title">Pendidikan</h2>
            <div className="d-flex flex-column gap-3">
              {educations.map((edu) => (
                <article key={edu.id} className="resume-item-block">
                  <div className="d-flex justify-content-between align-items-baseline">
                    <h3 className="h6 fw-bold mb-0 text-dark">
                      {edu.degree} {edu.major}
                    </h3>
                    <span className="small text-muted fw-medium">
                      {formatMonthYear(edu.start_period)} –{" "}
                      {formatMonthYear(edu.finish_period)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-baseline mb-1">
                    <span className="fst-italic text-secondary small">
                      {edu.location}
                    </span>
                    {edu.gpa && (
                      <span className="small fw-semibold text-dark">
                        IPK: {edu.gpa}
                      </span>
                    )}
                  </div>
                  {renderDescription(edu.description)}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Section: Technical Skills */}
        {skills.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-title">Keahlian Teknis</h2>
            <div className="resume-item-block">
              <p className="mb-0">
                <span className="fw-semibold text-dark">Skills: </span>
                {skills.map((s) => s.name).join(" • ")}
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Website Footer (Integrated, hidden during print) */}
      <Footer className="resume-footer d-print-none" />
    </div>
  );
}
