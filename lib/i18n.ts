export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function dir(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
