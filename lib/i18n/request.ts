import "server-only";

import { headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_HEADER,
  type Locale,
} from "@/lib/i18n/config";

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const locale = requestHeaders.get(LOCALE_HEADER);

  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
