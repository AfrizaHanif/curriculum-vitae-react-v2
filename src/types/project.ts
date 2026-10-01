import type { ApiResponse, LocalizedContent, LocalizedString } from "./api";
import type { Feature, Portfolio } from "./portfolio";

export interface Project {
  id: string;
  profile_id?: string;
  portfolio_id?: string | null;
  title: LocalizedString;
  slug: string;
  category: string;
  subcategory?: string | null;
  type: string;
  image?: string | null;
  gallery?: string[] | null;
  video?: string | null;
  start_period: string;
  finish_period?: string | null;
  status: string;
  status_label?: string;
  description: LocalizedContent;
  delay_reason?: string | null;
  resume_date?: string | null;
  tags?: string[] | null;
  technology?: string[] | null;
  source_code?: string | null;
  sourcecode?: string | null; // Alias for backward compatibility
  demo_url?: string | null;
  is_private?: boolean | null;

  // Relationships
  portfolio?: Portfolio | null;
  features?: Feature[];

  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type FeatureProjectItem = Feature;

export type ProjectApiResponse = ApiResponse<Project[]>;
export type ProjectDetailApiResponse = ApiResponse<Project>;
