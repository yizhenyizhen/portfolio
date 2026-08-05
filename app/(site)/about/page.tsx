import type { Metadata } from "next";
import { IdentityPageShell } from "@/components/systems/identity";
import { getLocalizedIdentityEntry } from "@/data/site/identity-translations";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const identity = getLocalizedIdentityEntry("about", await getRequestLocale());
  return { title: identity.title, description: identity.description };
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  return (
    <IdentityPageShell
      identity={getLocalizedIdentityEntry("about", locale)}
      locale={locale}
    />
  );
}
