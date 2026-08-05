export const LOCALES = ["en", "zh-CN"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_HEADER = "x-portfolio-locale";
export const CHINESE_PATH_PREFIX = "/zh";

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getLocaleFromPathname(
  pathname: string | null | undefined,
): Locale {
  return pathname === CHINESE_PATH_PREFIX ||
    pathname?.startsWith(`${CHINESE_PATH_PREFIX}/`)
    ? "zh-CN"
    : DEFAULT_LOCALE;
}
