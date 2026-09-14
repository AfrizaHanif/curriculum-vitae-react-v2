import type { ApiResponse } from "./api";

export interface Social {
  id?: string;
  profile_id?: string;
  name: string;
  url: string;
  icon: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SocialApiResponse = ApiResponse<Social[]>;
