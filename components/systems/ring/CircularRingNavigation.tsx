import { HomepageRingExperience } from "@/components/systems/ring/HomepageRingExperience";
import { worlds } from "@/data/site/worlds";
import { getPrimaryNavigationItems } from "@/lib/navigation/get-navigation";

type CircularRingNavigationProps = {
  initialWorld?: string;
};

export function CircularRingNavigation({
  initialWorld,
}: CircularRingNavigationProps) {
  const navigation = getPrimaryNavigationItems();
  const requestedIndex = navigation.findIndex(
    (item) => item.slug === initialWorld,
  );
  const initialIndex = requestedIndex >= 0 ? requestedIndex : 0;
  const items = navigation.map((item) => ({
    slug: item.slug,
    text: item.label,
    href: item.href,
    chapters: [...worlds[item.slug].chapters].sort(
      (a, b) => a.order - b.order,
    ),
  }));

  return (
    <div className="homepage-viewport fixed inset-0 z-[var(--layer-content)] w-screen">
      <HomepageRingExperience
        key={initialIndex}
        items={items}
        initialIndex={initialIndex}
        bend={7}
        textColor="#ffffff"
        font='600 64px "Helvetica Neue"'
        scrollSpeed={3.6}
        scrollEase={0.07}
      />
    </div>
  );
}
