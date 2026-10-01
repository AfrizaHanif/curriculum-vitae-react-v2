import type { ApiResponse, LocalizedContent, LocalizedString } from "./api";
import type { Portfolio } from "./portfolio";

export interface Expertise {
  id?: string;
  profile_id?: string;
  title: LocalizedString;
  description: LocalizedContent;
  icon: string;

  // BelongsToMany relationship (loaded via PortfolioResource::collection)
  portfolios?: Portfolio[];

  // Optional: if you use withCount('portfolios') in Laravel
  portfolios_count?: number;

  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ExpertiseApiResponse = ApiResponse<Expertise[]>;
export type ExpertiseDetailApiResponse = ApiResponse<Expertise>;
