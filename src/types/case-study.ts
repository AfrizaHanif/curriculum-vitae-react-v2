import type { ApiResponse } from "./api";

export interface CaseStudy {
  id: string;
  portfolio_id: string;
  role: string;
  responsibles: string[];
  problems: string[];
  goal: string[];
  benefits: string[];
  progress: string[];
  challenges: string[];
  lessons: string[];
  results: string[];
  video?: string | null;
}

export interface DiagramCS {
  id?: string;
  case_study_id: string;
  context?: string | null;
  dfd_0?: string | null;
  pdm?: string | null;
}

export interface SolutionCS {
  id?: string;
  case_study_id: string;
  title: string;
  context: string;
  visual?: string | null;
}

export type CaseStudyApiResponse = ApiResponse<CaseStudy[]>;
export type CaseStudyDetailApiResponse = ApiResponse<CaseStudy>;
export type DiagramCSApiResponse = ApiResponse<DiagramCS[]>;
export type SolutionCSApiResponse = ApiResponse<SolutionCS[]>;
