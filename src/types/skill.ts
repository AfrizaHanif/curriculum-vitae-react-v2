import type { ApiResponse } from "./api";

export interface Skill {
  id?: string;
  profile_id?: string;
  name: string;
  type: string;
  type_label?: string;
  display_order: number;
  level?: string; // Legacy alias
  since?: number; // Legacy alias
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SkillApiResponse = ApiResponse<Skill[]>;
export type SkillDetailApiResponse = ApiResponse<Skill>;
