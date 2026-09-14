import { en, type TranslationSchema } from "./en";
import { id } from "./id";

export type Language = "en" | "id";
export type { TranslationSchema };

export const translations: Record<Language, TranslationSchema> = {
  en,
  id,
};

export { en, id };
