import {
  CHINESE_PATH_PREFIX,
  type Locale,
} from "@/lib/i18n/config";

const EXTERNAL_PROTOCOL = /^[a-z][a-z\d+.-]*:/i;

export function stripLocalePrefix(pathname: string) {
  if (pathname === CHINESE_PATH_PREFIX) {
    return "/";
  }

  if (pathname.startsWith(`${CHINESE_PATH_PREFIX}/`)) {
    return pathname.slice(CHINESE_PATH_PREFIX.length) || "/";
  }

  return pathname || "/";
}

export function localizePath(pathname: string, locale: Locale) {
  const basePath = stripLocalePrefix(pathname);

  if (locale === "zh-CN") {
    return basePath === "/"
      ? CHINESE_PATH_PREFIX
      : `${CHINESE_PATH_PREFIX}${basePath}`;
  }

  return basePath;
}

export function localizeHref(href: string, locale: Locale) {
  if (
    href.startsWith("#") ||
    href.startsWith("//") ||
    EXTERNAL_PROTOCOL.test(href)
  ) {
    return href;
  }

  const hashIndex = href.indexOf("#");
  const queryIndex = href.indexOf("?");
  const suffixIndex = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const pathname =
    suffixIndex === undefined ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex === undefined ? "" : href.slice(suffixIndex);

  return `${localizePath(pathname || "/", locale)}${suffix}`;
}
