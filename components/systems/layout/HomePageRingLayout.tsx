"use client";

import Dither from "@/components/Dither";
import { RingNavigationBoundary } from "@/components/systems/ring";
import { getPrimaryNavigationItems } from "@/lib/navigation/get-navigation";

export function HomePageRingLayout() {
  const navigation = getPrimaryNavigationItems();

  return (
    <main className="relative h-screen overflow-hidden bg-[var(--color-background)]">
      <div aria-hidden="true" className="fixed inset-0 z-[var(--layer-base)]">
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <Dither
            waveColor={[1,1,1]}
            enableMouseInteraction
          />
        </div>
      </div>

      <div className="fixed inset-0 z-[var(--layer-content)] h-full w-full">
        <RingNavigationBoundary items={navigation} />
      </div>
    </main>
  );
}
