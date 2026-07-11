import type { NavigationItem } from "@/types/navigation";

export type RingNavigationBoundaryProps = {
  items: NavigationItem[];
  activeSlug?: string;
};

export function RingNavigationBoundary({
  items,
  activeSlug,
}: RingNavigationBoundaryProps) {
  return (
    <div className="hidden" aria-hidden="true" data-active-slug={activeSlug}>
      {items.length}
    </div>
  );
}
