import type { ApiResponse } from "./api";

export interface Testimonial {
  id?: string;
  profile_id?: string;
  name: string;
  role: string;
  content: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type TestimonialApiResponse = ApiResponse<Testimonial[]>;
export type TestimonialDetailApiResponse = ApiResponse<Testimonial>;
