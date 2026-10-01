import type { ApiResponse } from "./api";

export interface Setup {
  id?: string;
  profile_id?: string;
  name: string;
  category: string;
  description: string;
  reason?: string | string[] | null;
  why?: string | string[] | null; // Legacy alias for reason
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SetupApiResponse = ApiResponse<Setup[]>;
export type SetupDetailApiResponse = ApiResponse<Setup>;
