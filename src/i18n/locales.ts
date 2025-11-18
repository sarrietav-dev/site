export const LOCALES = {
  en: "en",
  es: "es",
} as const;

export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];
