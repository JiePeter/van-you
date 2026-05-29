export const locales = ["en", "zh", "zh-Hant", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
