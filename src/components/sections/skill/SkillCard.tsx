"use client";

import { Skill } from "@/types/skill";
import Card from "@/components/ui/bootstrap/card";
import Badge from "@/components/ui/bootstrap/badge";
import { renderSkillIcon, getLevelConfig } from "./skill-utils";
import { useLanguage } from "@/context/LanguageContext";

interface SkillCardProps {
  skill: Skill;
  currentYear: number;
}

export default function SkillCard({ skill, currentYear }: SkillCardProps) {
  const { t } = useLanguage();

  const labelText = skill.type_label || skill.type || skill.level || "";
  const levelCfg = getLevelConfig(labelText);

  return (
    <Card
      key={skill.id || skill.name}
      className="h-100 p-1 border-0 shadow-sm rounded-4 transition-all"
      bodyClassName="d-flex flex-column"
    >
      {/* Top: Icon + Skill Name */}
      <div className="d-flex align-items-center gap-3 pb-2">
        {/* Tech Icon Box */}
        <div
          className="rounded-3 bg-body-tertiary border d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 48, height: 48 }}
        >
          {renderSkillIcon(skill.name)}
        </div>

        {/* Skill Name */}
        <div className="flex-grow-1 min-w-0" style={{ minWidth: 0 }}>
          <h6 className="fw-bold text-body mb-0" title={skill.name}>
            {skill.name}
          </h6>
        </div>
      </div>

      {/* Bottom: Badge / Category */}
      {labelText && (
        <div className="d-flex align-items-center justify-content-end mt-auto pt-2 border-top">
          <Badge
            pill
            className={`px-2 py-1 small text-truncate mw-100 ${levelCfg.badgeClass}`}
          >
            {labelText}
          </Badge>
        </div>
      )}
    </Card>
  );
}
