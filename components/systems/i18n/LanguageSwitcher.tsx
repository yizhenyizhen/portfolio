"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";
import { useI18n } from "@/components/systems/i18n/I18nProvider";
import {
  getLocaleFromPathname,
} from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import {
  localizePath,
  stripLocalePrefix,
} from "@/lib/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

type LanguageSwitcherProps = {
  placement?: "fixed" | "inline";
};

export function LanguageSwitcher({
  placement = "inline",
}: LanguageSwitcherProps) {
  const { locale: fallbackLocale, messages } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = fallbackLocale;

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === getLocaleFromPathname(pathname)) return;

    const basePath = stripLocalePrefix(pathname);
    const nextPath = localizePath(basePath, nextLocale);
    const query = searchParams.toString();
    const hash = window.location.hash;
    const nextUrl = `${nextPath}${query ? `?${query}` : ""}${hash}`;
    const scrollPosition = window.scrollY;
    const restoreScrollPosition = () => {
      let attempts = 0;

      const restore = () => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll >= scrollPosition) {
          window.scrollTo({
            top: scrollPosition,
            behavior: "auto",
          });
        }

        if (attempts >= 20) {
          return;
        }

        attempts += 1;
        window.setTimeout(restore, 50);
      };

      restore();
    };

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
      window.setTimeout(() => {
        router.refresh();
        window.setTimeout(restoreScrollPosition, 100);
      }, 100);
    });
  };

  return (
    <nav
      className={`${styles.switcher} ${
        placement === "fixed" ? styles.fixed : styles.inline
      }`}
      aria-label={messages.language.navigationLabel}
    >
      <button
        type="button"
        className={styles.option}
        data-active={locale === "en" ? "true" : "false"}
        aria-pressed={locale === "en"}
        aria-label={messages.language.switchToEnglish}
        onClick={() => switchLocale("en")}
      >
        {messages.language.english}
      </button>
      <span className={styles.divider} aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={styles.option}
        data-active={locale === "zh-CN" ? "true" : "false"}
        aria-pressed={locale === "zh-CN"}
        aria-label={messages.language.switchToChinese}
        onClick={() => switchLocale("zh-CN")}
      >
        {messages.language.chinese}
      </button>
    </nav>
  );
}
