import type { ApiResponse, LocalizedContent } from "./api";

export interface Education {
  id: string;
  profile_id?: string;
  institution: string;
  location?: string; // Legacy alias for institution
  type: string | null;
  type_label?: string | null;
  address?: string | null;
  degree: string;
  major: string;
  gpa?: number | null;
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

export type EducationApiResponse = ApiResponse<Education[]>;
export type EducationDetailApiResponse = ApiResponse<Education>;
