import type { Metadata } from "next";
import { IdentityPageShell } from "@/components/systems/identity";
import { getLocalizedIdentityEntry } from "@/data/site/identity-translations";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const identity = getLocalizedIdentityEntry("horizon", await getRequestLocale());
  return { title: identity.title, description: identity.description };
}

export default async function HorizonPage() {
  const locale = await getRequestLocale();
  return (
    <IdentityPageShell
      identity={getLocalizedIdentityEntry("horizon", locale)}
      locale={locale}
    />
  );
}
