import type { ApiResponse, LocalizedContent, LocalizedString } from "./api";

export interface Education {
  id: string;
  profile_id?: string;
  institution: string;
  type: string | null;
  type_label?: string | null;
  address?: string | null;
  degree: string;
  degree_label: string;
  degree_labels: LocalizedString;
  academic_title?: string | null;
  major: LocalizedString;
  gpa?: number | null;
  max_gpa?: number | null;
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
