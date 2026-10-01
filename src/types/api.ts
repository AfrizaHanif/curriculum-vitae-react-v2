export interface ApiResponse<T> {
  data: T;
  links?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

// export type LocalizedString = string | { en?: string; id?: string };
export type LocalizedContent<T = string | string[]> = T | { en?: T; id?: T };
export type LocalizedString = LocalizedContent<string>;
