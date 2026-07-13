import { DitherBackground } from "@/components/systems/background/DitherBackground";
import { CircularRingNavigation } from "@/components/systems/ring/CircularRingNavigation";

export default function HomePage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <DitherBackground />
      <CircularRingNavigation />
    </main>
  );
}
