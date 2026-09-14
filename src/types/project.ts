import type { ApiResponse } from "./api";

export interface Project {
  id: string;
  profile_id?: string;
  portfolio_id?: string | null;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  type: string;
  image: string;
  gallery?: string[] | null;
  start_period: string;
  finish_period?: string | null;
  status: string;
  description: string;
  delay_reason?: string | null;
  resume_date?: string | null;
  tags?: string[] | null;
  technology?: string[] | null;
  sourcecode?: string | null;
  is_private?: boolean | null;
}

export interface FeatureProjectItem {
  id?: string;
  project_id: string;
  title: string;
  description?: string | null;
  progress: number;
}

export type ProjectApiResponse = ApiResponse<Project[]>;
export type ProjectDetailApiResponse = ApiResponse<Project>;
export type FeatureProjectApiResponse = ApiResponse<FeatureProjectItem[]>;
