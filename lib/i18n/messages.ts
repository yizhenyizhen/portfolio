import type { Locale } from "@/lib/i18n/config";
import { en, type Messages } from "@/lib/i18n/locales/en";
import { zhCN } from "@/lib/i18n/locales/zh-CN";

const resources: Record<Locale, Messages> = {
  en,
  "zh-CN": zhCN,
};

export function getMessages(locale: Locale) {
  return resources[locale];
}

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (message, [key, value]) =>
      message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
