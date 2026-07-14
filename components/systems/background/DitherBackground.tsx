"use client";

import Dither from "@/components/Dither";

export function DitherBackground() {
  return (
    <div className="homepage-viewport fixed inset-0 w-screen">
      <Dither
        waveColor={[1, 1, 1]}
        disableAnimation={false}
        enableMouseInteraction
        mouseRadius={0.2}
        colorNum={7}
        pixelSize={2}
        waveAmplitude={0.3}
        waveFrequency={1}
        waveSpeed={0.04}
      />
    </div>
  );
}
