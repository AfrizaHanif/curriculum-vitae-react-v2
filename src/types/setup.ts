import type { ApiResponse } from "./api";

export interface Setup {
  id?: string;
  profile_id?: string;
  name: string;
  category: string;
  description: string;
  why?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SetupApiResponse = ApiResponse<Setup[]>;
