import type { Metadata } from "next";
import { IdentityPageShell } from "@/components/systems/identity";
import { getLocalizedIdentityEntry } from "@/data/site/identity-translations";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const identity = getLocalizedIdentityEntry(
    "zen-furniture",
    await getRequestLocale(),
  );
  return { title: identity.title, description: identity.description };
}

export default async function ZenFurniturePage() {
  const locale = await getRequestLocale();
  return (
    <IdentityPageShell
      identity={getLocalizedIdentityEntry("zen-furniture", locale)}
      locale={locale}
    />
  );
}
