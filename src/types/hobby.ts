import type { ApiResponse } from "./api";

export interface Hobby {
  id?: string;
  name: string;
  icon?: string;
}

export type HobbyApiResponse = ApiResponse<Hobby[]>;
