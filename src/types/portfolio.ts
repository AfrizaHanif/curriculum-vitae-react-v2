import type { ApiResponse, LocalizedContent, LocalizedString } from "./api";
import type { CaseStudy } from "./case-study";
import type { Expertise } from "./expertise";

export interface Repository {
  id?: string;
  portfolio_id?: string;
  name?: string;
  url?: string;
  label?: string;
  icon?: string | null;
  href?: string;
}

export interface Feature {
  id?: string;
  featureable_type?: string;
  featureable_id?: string;
  portfolio_id?: string;
  project_id?: string; // Legacy alias for featureable_id
  title: string;
  description?: string | null;
  progress?: number | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Portfolio {
  id: string;
  profile_id?: string;
  parent_id?: string | null;
  title: LocalizedString;
  slug: string;
  category: string;
  subcategory?: string | null;
  type: string;
  image?: string | null;
  gallery?: string[] | null;
  video?: string | null;
  start_period: string;
  finish_period: string;
  description: LocalizedContent;
  tags?: string[] | null;
  technology?: string[] | null;
  repositories?: Repository[] | null;
  demo_url?: string | null;

  // Relationships
  case_studies?: CaseStudy[];
  features?: Feature[];
  expertises?: Expertise[];
  parent?: Portfolio | null;
  child_portfolios?: Portfolio[];

  // Counts
  case_studies_count?: number;
  repositories_count?: number;
  features_count?: number;
  expertises_count?: number;

  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type PortfolioApiResponse = ApiResponse<Portfolio[]>;
export type PortfolioDetailApiResponse = ApiResponse<Portfolio>;
export type FeatureApiResponse = ApiResponse<Feature[]>;
