import type { ApiResponse } from "./api";

export interface Portfolio {
  id: string;
  profile_id?: string;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  type: string;
  image: string;
  gallery?: string[] | null;
  start_period: string;
  finish_period: string;
  description: string;
  tags?: string[] | null;
  technology?: string[] | null;
  case_studies_count?: number;
  repositories_count?: number;
  features_count?: number;
}

export interface Repository {
  id?: string;
  portfolio_id: string;
  label: string;
  icon?: string | null;
  href: string;
}

export interface Feature {
  id?: string;
  portfolio_id: string;
  title: string;
  description?: string | null;
}

export type PortfolioApiResponse = ApiResponse<Portfolio[]>;
export type PortfolioDetailApiResponse = ApiResponse<Portfolio>;
export type RepositoryApiResponse = ApiResponse<Repository[]>;
export type FeatureApiResponse = ApiResponse<Feature[]>;

// export type PortfolioFullResponse = Portfolio & {
//   repositories: RepositoryApiResponse;
//   features: FeatureApiResponse;
// };
