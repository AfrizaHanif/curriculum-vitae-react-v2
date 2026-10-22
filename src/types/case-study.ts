import type { ApiResponse } from "./api";
import type { Portfolio } from "./portfolio";

export interface DiagramCS {
  id?: string;
  case_study_id?: string;
  name?: string;
  images?: string | null;
}

export interface SolutionCS {
  id?: string;
  case_study_id?: string;
  title: string;
  context: string;
  visual?: string | null;
}

export interface CaseStudy {
  id: string;
  portfolio_id: string;
  role: string;
  problems: string[];
  goals?: string[];
  responsibilities?: string[];
  process?: string[];
  benefits: string[];
  challenges: string[];
  lessons: string[];
  results: string[];
  diagrams?: DiagramCS[] | null;
  solutions?: SolutionCS[] | null;

  // Relationship
  portfolio?: Portfolio;

  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CaseStudyApiResponse = ApiResponse<CaseStudy[]>;
export type CaseStudyDetailApiResponse = ApiResponse<CaseStudy>;
