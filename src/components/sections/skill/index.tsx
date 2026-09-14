"use client";

import { useState, useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import { SkillApiResponse } from "@/types/skill";
import { CardGrid } from "@/components/ui/bootstrap/card";
import Spinner from "@/components/ui/bootstrap/spinner";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/bootstrap/badge";
import Alert from "@/components/ui/bootstrap/alert";
import NavTab, { NavTabItem } from "@/components/ui/bootstrap/nav-tab";

import SkillCard from "./SkillCard";
import fallbackSkills from "@/data/jsons/skills.json";

export default function SkillSection() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const { data, isLoading, error } = useFetch<SkillApiResponse>(
    `https://api.afrizahanif.com/api/skills?all=true`,
    { fallbackData: { data: fallbackSkills } },
  );
  const skills = useMemo(() => data?.data ?? [], [data?.data]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Dapatkan daftar level unik untuk filter
  const levels = useMemo(() => {
    const list = Array.from(new Set(skills.map((s) => s.level)));
    return ["All", ...list];
  }, [skills]);

  // Tab items for NavTab
  const tabItems: NavTabItem[] = useMemo(() => {
    return levels.map((lvl, index) => {
      const lvlSkills =
        lvl === "All" ? skills : skills.filter((s) => s.level === lvl);
      const isActive = index === activeTabIndex;

      return {
        id: `skills-tab-${lvl.toLowerCase().replace(/\s+/g, "-")}`,
        title: (
          <span className="d-inline-flex align-items-center gap-2">
            <span>{lvl === "All" ? t.sections.skills.filterAll : lvl}</span>
            <Badge
              pill
              className={`rounded-pill ${
                isActive ? "bg-light text-primary" : "bg-secondary text-white"
              }`}
            >
              {lvlSkills.length}
            </Badge>
          </span>
        ),
        content:
          lvlSkills.length > 0 ? (
            <CardGrid lgCols={4} mdCols={3} smCols={2} cols={1} gap={3}>
              {lvlSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  currentYear={currentYear}
                />
              ))}
            </CardGrid>
          ) : (
            <div className="d-flex justify-content-center py-5">
              <p className="text-muted">{t.sections.skills.empty}</p>
            </div>
          ),
      };
    });
  }, [levels, skills, activeTabIndex, currentYear, t]);

  return (
    <Section id="skills" minFullHeight>
      {/* Section Header */}
      <SectionHeader
        title={t.sections.skills.title}
        subtitle={t.sections.skills.subtitle}
      />

      {/* Skills Content with NavTab */}
      <div className="mt-4">
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner color="primary" label={t.sections.skills.loading} />
          </div>
        ) : error ? (
          <Alert color="danger" className="mb-0">
            {t.sections.skills.error}: {error.message}
          </Alert>
        ) : skills.length > 0 ? (
          <NavTab
            id="skills-tabs"
            variant="pills"
            navClassName="justify-content-center gap-1"
            items={tabItems}
            activeIndex={activeTabIndex}
            onTabChange={setActiveTabIndex}
          />
        ) : (
          <div className="d-flex justify-content-center py-5">
            <p className="text-muted">{t.sections.skills.empty}</p>
          </div>
        )}
      </div>
    </Section>
  );
}
