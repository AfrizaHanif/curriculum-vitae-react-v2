import type { ApiResponse } from "./api";

export interface Blog {
  id?: string;
  profile_id?: string;
  title: string;
  slug: string;
  category?: string;
  author: string;
  date?: string; // Optional/legacy
  tags?: string[] | null;
  summary: string;
  image?: string | null;
  content: string;
  is_featured: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Alias for Laravel Post model/resource
export type Post = Blog;

export type BlogApiResponse = ApiResponse<Blog[]>;
export type BlogDetailApiResponse = ApiResponse<Blog>;
export type PostApiResponse = ApiResponse<Post[]>;
export type PostDetailApiResponse = ApiResponse<Post>;
