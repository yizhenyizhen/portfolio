import { DitherBackground } from "@/components/systems/background/DitherBackground";
import { IdentityHeader } from "@/components/systems/identity";
import { CircularRingNavigation } from "@/components/systems/ring/CircularRingNavigation";

type HomePageProps = {
  searchParams: Promise<{
    world?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { world } = await searchParams;
  const initialWorld = Array.isArray(world) ? world[0] : world;

  return (
    <main className="h-screen w-screen overflow-hidden">
      <DitherBackground />
      <CircularRingNavigation initialWorld={initialWorld} />
      <IdentityHeader />
    </main>
  );
}
