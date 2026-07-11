import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorldShell } from "@/components/systems/world/WorldShell";
import { getWorldBySlug, getWorldSlugs } from "@/lib/content/get-world";
import { normalizeWorldSlug } from "@/lib/routing/worlds";
import type { WorldSlug } from "@/types/world";

type WorldPageProps = {
  params: Promise<{
    world: string;
  }>;
};

export function generateStaticParams() {
  return getWorldSlugs().map((world) => ({ world }));
}

export async function generateMetadata({
  params,
}: WorldPageProps): Promise<Metadata> {
  const { world } = await params;
  const slug = normalizeWorldSlug(world);

  if (!slug) {
    return {};
  }

  const definition = getWorldBySlug(slug);

  if (!definition) {
    return {};
  }

  return {
    title: definition.name,
    description: definition.description,
  };
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { world } = await params;
  const slug = normalizeWorldSlug(world);

  if (!slug) {
    notFound();
  }

  const definition = getWorldBySlug(slug as WorldSlug);

  if (!definition) {
    notFound();
  }

  return <WorldShell world={definition} />;
}
