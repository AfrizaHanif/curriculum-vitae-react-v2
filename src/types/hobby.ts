import type { ApiResponse } from "./api";

export interface Hobby {
  id?: string;
  title: string;
  icon?: string;
}

export type HobbyApiResponse = ApiResponse<Hobby[]>;
