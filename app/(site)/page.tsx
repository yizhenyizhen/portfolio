import type { Viewport } from "next";
import { DitherBackground } from "@/components/systems/background/DitherBackground";
import { LanguageSwitcher } from "@/components/systems/i18n";
import { IdentityHeader } from "@/components/systems/identity";
import { CircularRingNavigation } from "@/components/systems/ring/CircularRingNavigation";
import { getRequestLocale } from "@/lib/i18n/request";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type HomePageProps = {
  searchParams: Promise<{
    world?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = await getRequestLocale();
  const { world } = await searchParams;
  const initialWorld = Array.isArray(world) ? world[0] : world;

  return (
    <main className="homepage-viewport w-screen overflow-hidden">
      <DitherBackground />
      <CircularRingNavigation initialWorld={initialWorld} locale={locale} />
      <IdentityHeader />
      <LanguageSwitcher placement="fixed" />
    </main>
  );
}
