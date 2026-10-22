import type { ApiResponse } from "./api";

export interface Hobby {
  id?: string;
  name: string;
  icon?: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type HobbyApiResponse = ApiResponse<Hobby[]>;
