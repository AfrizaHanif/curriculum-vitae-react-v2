import type { ApiResponse } from "./api";

export interface Expertise {
  id?: string;
  icon: string;
  title: string;
  description: string;
  projects: string[];
}

export type ExpertiseApiResponse = ApiResponse<Expertise[]>;
