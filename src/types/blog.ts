import type { ApiResponse } from "./api";

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  author: string;
  date: string;
  tags?: string[];
  summary: string;
  image?: string;
  content: string;
  is_featured: boolean;
}

export type BlogApiResponse = ApiResponse<Blog[]>;
