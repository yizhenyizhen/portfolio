import { getLocalizedWorlds } from "@/data/site/world-translations";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/routing";
import type {
  NavigationHref,
  NavigationItem,
} from "@/types/navigation";

export function getPrimaryNavigationItems(
  locale: Locale = DEFAULT_LOCALE,
): NavigationItem[] {
  return Object.values(getLocalizedWorlds(locale)).map((world) => ({
    slug: world.slug,
    href: localizeHref(`/${world.slug}`, locale) as NavigationHref,
    label: world.label,
    name: world.name,
    summary: world.summary,
  }));
}
