import type { ApiResponse, LocalizedContent, LocalizedString } from "./api";

export interface Experience {
  id: string;
  profile_id?: string;
  title: string;
  company: string;
  type: string;
  type_label?: string | null;
  type_labels: LocalizedString;
  address?: string | null;
  status: string;
  status_label?: string | null;
  status_labels: LocalizedString;
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
