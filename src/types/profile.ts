import type { ApiResponse, LocalizedString } from "./api";

export interface Profile {
  id?: string;
  fullname: string;
  phone: string;
  current_city?: string | null;
  current_province?: string | null;
  email: string;
  age?: number | null;
  birthday?: string | null;
  tagline?: LocalizedString | null;
  description?: LocalizedString | null;
  philosophy?: LocalizedString | null;
  status: string;
  formal_photo?: string | null;
  casual_photo?: string | null;
  photo?: string | null; // Legacy alias (for formal_photo/casual_photo)
  setup_image?: string | null;
  resume?: LocalizedString | null;
}

export type ProfileApiResponse = ApiResponse<Profile[]>;
export type ProfileDetailApiResponse = ApiResponse<Profile>;
