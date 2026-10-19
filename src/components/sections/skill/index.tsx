"use client";

import { useState, useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import { SkillApiResponse } from "@/types/skill";
import { CardGrid } from "@/components/ui/bootstrap/card";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/bootstrap/badge";
import Alert from "@/components/ui/bootstrap/alert";
import NavTab, { NavTabItem } from "@/components/ui/bootstrap/nav-tab";

import SkillCard from "./SkillCard";
import SkillGridSkeleton from "./SkillCardSkeleton";
import fallbackSkills from "@/data/jsons/skills.json";
import { getApiUrl } from "@/config/siteConfig";
import { getLocalizedText } from "@/utils/formatters";

export default function SkillSection() {
  const { t, lang } = useLanguage();

  // Fetch API Data
  const { data, isLoading, error } = useFetch<SkillApiResponse>(
    getApiUrl("skills"),
    { fallbackData: { data: fallbackSkills } },
  );
  const skills = useMemo(() => {
    const list = data?.data ?? [];
    return [...list].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
    );
  }, [data?.data]);

  // Set States
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Get Unique Categories/Types for Filter
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    skills.forEach((s) => {
      const key = s.type || s.type_label;
      if (key && !map.has(key)) {
        const label =
          getLocalizedText(s.type_labels, lang) ||
          s.type_label ||
          s.type ||
          key;
        map.set(key, label);
      }
    });

    return [
      { key: "all", label: t.sections.skills.filterAll },
      ...Array.from(map.entries()).map(([key, label]) => ({ key, label })),
    ];
  }, [skills, lang, t.sections.skills.filterAll]);

  // Tab items for NavTab
  const tabItems: NavTabItem[] = useMemo(() => {
    return categories.map((cat, index) => {
      const catSkills =
        cat.key === "all"
          ? skills
          : skills.filter((s) => (s.type || s.type_label) === cat.key);
      const isActive = index === activeTabIndex;

      return {
        id: `skills-tab-${cat.key.toLowerCase().replace(/\s+/g, "-")}`,
        title: (
          <span className="d-inline-flex align-items-center gap-2">
            <span>{cat.label}</span>
            <Badge
              pill
              className={`rounded-pill ${
                isActive ? "bg-light text-primary" : "bg-secondary text-white"
              }`}
            >
              {catSkills.length}
            </Badge>
          </span>
        ),
        content:
          catSkills.length > 0 ? (
            <CardGrid
              xxlCols={5}
              xlCols={4}
              lgCols={4}
              mdCols={3}
              smCols={2}
              cols={1}
              gap={3}
            >
              {catSkills.map((skill) => (
                <SkillCard
                  key={skill.id || skill.name}
                  skill={skill}
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
  }, [categories, skills, activeTabIndex, t]);

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
          <SkillGridSkeleton count={8} />
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
