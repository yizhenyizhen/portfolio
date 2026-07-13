import type { Metadata } from "next";
import { IdentityPageShell } from "@/components/systems/identity";
import { getIdentityEntry } from "@/data/site/identity";

const identity = getIdentityEntry("about");

export const metadata: Metadata = {
  title: identity.title,
  description: identity.description,
};

export default function AboutPage() {
  return <IdentityPageShell identity={identity} />;
}
