import type { ApiResponse } from "./api";

export interface Skill {
  id?: string;
  profile_id?: string;
  name: string;
  level: string;
  since: number;
}

export type SkillApiResponse = ApiResponse<Skill[]>;
