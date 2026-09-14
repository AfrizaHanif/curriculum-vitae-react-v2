import type { ApiResponse } from "./api";

export interface Testimonial {
  id?: string;
  profile_id?: string;
  name: string;
  role: string;
  content: string;
}

export type TestimonialApiResponse = ApiResponse<Testimonial[]>;
