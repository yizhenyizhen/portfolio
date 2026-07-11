"use client";

import { useEffect, useState } from "react";

export type BreakpointName = "mobile" | "tablet" | "desktop";

export function useBreakpoint(): BreakpointName {
  const [breakpoint, setBreakpoint] = useState<BreakpointName>("desktop");

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) {
        setBreakpoint("mobile");
        return;
      }

      if (window.innerWidth < 1200) {
        setBreakpoint("tablet");
        return;
      }

      setBreakpoint("desktop");
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return breakpoint;
}
