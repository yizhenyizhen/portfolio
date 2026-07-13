import type { Metadata } from "next";
import { IdentityPageShell } from "@/components/systems/identity";
import { getIdentityEntry } from "@/data/site/identity";

const identity = getIdentityEntry("horizon");

export const metadata: Metadata = {
  title: identity.title,
  description: identity.description,
};

export default function HorizonPage() {
  return <IdentityPageShell identity={identity} />;
}
