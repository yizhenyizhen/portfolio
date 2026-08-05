"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname as useNextPathname } from "next/navigation";
import {
  getLocaleFromPathname,
  type Locale,
} from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import type { Messages } from "@/lib/i18n/locales/en";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = I18nContextValue & {
  children: ReactNode;
};

export function I18nProvider({
  children,
  locale,
  messages,
}: I18nProviderProps) {
  const pathname = useNextPathname();
  const subscribe = useCallback(() => () => undefined, []);
  const getClientLocale = useCallback(
    () => getLocaleFromPathname(pathname),
    [pathname],
  );
  const getServerLocale = useCallback(() => locale, [locale]);
  const activeLocale = useSyncExternalStore(
    subscribe,
    getClientLocale,
    getServerLocale,
  );

  useEffect(() => {
    document.documentElement.lang = activeLocale;
  }, [activeLocale]);

  return (
    <I18nContext.Provider
      value={{
        locale: activeLocale,
        messages: activeLocale === locale ? messages : getMessages(activeLocale),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider.");
  }

  return context;
}
