import type { ApiResponse } from "./api";

export interface Education {
  id: string;
  profile_id?: string;
  location: string;
  type?: string | null;
  address?: string | null;
  degree: string;
  major: string;
  gpa?: number | null;
  status: string;
  description?: string | string[] | null;
  start_period: string;
  finish_period?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export type EducationApiResponse = ApiResponse<Education[]>;
