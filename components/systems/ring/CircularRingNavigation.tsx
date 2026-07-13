import CircularGallery from "@/components/CircularGallery";
import { getPrimaryNavigationItems } from "@/lib/navigation/get-navigation";

export function CircularRingNavigation() {
  const items = getPrimaryNavigationItems().map((item) => ({
    text: item.label,
    href: item.href,
  }));

  return (
    <div className="fixed inset-0 z-[var(--layer-content)] h-screen w-screen">
      <CircularGallery
        items={items}
        bend={7}
        textColor="#ffffff"
        font='600 64px "Helvetica Neue"'
        scrollSpeed={3.6}
        scrollEase={0.07}
      />
    </div>
  );
}
