import en from "./en.json";
import es from "./es.json";
import type { Locale } from "./locales";

const translations = { en, es };

export function getTranslations(locale: string) {
  return translations[locale as keyof typeof translations] || translations.en;
}

export function t(locale: Locale, key: string): string {
  const trans = getTranslations(locale);
  const keys = key.split(".");
  let result: any = trans;

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k];
    } else {
      return key;
    }
  }

  return typeof result === "string" ? result : key;
}
