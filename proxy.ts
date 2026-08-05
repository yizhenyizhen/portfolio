import { NextResponse, type NextRequest } from "next/server";
import {
  CHINESE_PATH_PREFIX,
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_HEADER,
} from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isChinese =
    pathname === CHINESE_PATH_PREFIX ||
    pathname.startsWith(`${CHINESE_PATH_PREFIX}/`);
  const requestHeaders = new Headers(request.headers);
  const inheritedLocale = request.headers.get(LOCALE_HEADER);
  const locale = isChinese
    ? "zh-CN"
    : isLocale(inheritedLocale)
      ? inheritedLocale
      : DEFAULT_LOCALE;

  requestHeaders.set(LOCALE_HEADER, locale);

  if (!isChinese) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname =
    pathname.slice(CHINESE_PATH_PREFIX.length) || "/";

  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
