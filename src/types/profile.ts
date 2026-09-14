import type { ApiResponse } from "./api";

export interface Profile {
  id?: string;
  fullname: string;
  phone: string;
  current_city?: string | null;
  current_province?: string | null;
  email: string;
  birthday: string;
  tagline?: string | null;
  description?: string | null;
  philosophy?: string | null;
  status: string;
  photo?: string | null;
  setup_image?: string | null;
  resume?: string | null;
}

export type ProfileApiResponse = ApiResponse<Profile[]>;
