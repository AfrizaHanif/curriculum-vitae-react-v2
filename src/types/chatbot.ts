export type ChatMode = "local" | "cloud";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  provider?: ChatMode;
  model?: string;
  timestamp?: string;
  isError?: boolean;
  isFallback?: boolean;
  canFallbackToLocal?: boolean;
}
