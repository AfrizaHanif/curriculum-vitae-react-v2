import type { ApiResponse } from "./api";

export interface Experience {
  id: string;
  profile_id?: string;
  title: string;
  location: string;
  description?: string | string[] | null;
  address?: string | null;
  status: string;
  start_period: string;
  finish_period?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export type ExperienceApiResponse = ApiResponse<Experience[]>;
