import type { ApiResponse, LocalizedContent } from "./api";

export interface Experience {
  id: string;
  profile_id?: string;
  title: string;
  company: string;
  location?: string; // Legacy alias for company
  type: string;
  type_label?: string | null;
  address?: string | null;
  status: string;
  status_label?: string | null;
  start_period: string;
  finish_period?: string | null;
  description?: LocalizedContent | null;
  latitude?: string | null;
  longitude?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ExperienceApiResponse = ApiResponse<Experience[]>;
export type ExperienceDetailApiResponse = ApiResponse<Experience>;
