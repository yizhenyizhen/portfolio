import type { ReactNode } from "react";
import { SiteShell } from "@/components/systems/layout/SiteShell";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
