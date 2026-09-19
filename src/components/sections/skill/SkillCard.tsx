"use client";

import { Skill } from "@/types/skill";
import Card from "@/components/ui/bootstrap/card";
import Badge from "@/components/ui/bootstrap/badge";
import Tooltip from "@/components/ui/bootstrap/tooltip";
import { renderSkillIcon, getLevelConfig } from "./skill-utils";
import { useLanguage } from "@/context/LanguageContext";

interface SkillCardProps {
  skill: Skill;
  currentYear: number;
}

export default function SkillCard({ skill, currentYear }: SkillCardProps) {
  const { t } = useLanguage();

  // Calculate years of experience
  const years = currentYear - skill.since;

  // Set text for experience
  const expText =
    years <= 0
      ? t.sections.skills.card.experienceUnderYear
      : t.sections.skills.card.experienceYears.replace(
          "{years}",
          years.toString(),
        );
  const sinceText = t.sections.skills.card.since.replace(
    "{year}",
    skill.since.toString(),
  );
  const badgeText =
    years <= 0
      ? t.sections.skills.card.badgeNew
      : t.sections.skills.card.badgeYears.replace("{years}", years.toString());
  const levelCfg = getLevelConfig(skill.level);

  return (
    <Card
      key={skill.id}
      className="h-100 p-1 border-0 shadow-sm rounded-4 transition-all"
    >
      <div className="d-flex align-items-center gap-3 mb-3">
        {/* Tech Icon Box */}
        <div
          className="rounded-3 bg-body-tertiary border d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 48, height: 48 }}
        >
          {renderSkillIcon(skill.name)}
        </div>

        {/* Skill Name and Level */}
        <div className="flex-grow-1 min-w-0">
          <h6 className="fw-bold text-body mb-1 text-truncate">{skill.name}</h6>
          <Badge pill className={`px-2 py-1 small ${levelCfg.badgeClass}`}>
            {skill.level}
          </Badge>
        </div>
      </div>

      {/* Since / Experience Info */}
      <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
        <Tooltip title={expText} placement="top">
          <small
            className="text-body-secondary d-flex align-items-center gap-1"
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-calendar-check text-primary" />
            <time dateTime={skill.since.toString()}>{sinceText}</time>
          </small>
        </Tooltip>
        <Badge pill className={`px-2 py-1 small ${levelCfg.badgeClass}`}>
          {badgeText}
        </Badge>
      </div>
    </Card>
  );
}
