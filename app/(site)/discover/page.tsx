import { WorldPlaceholder } from "@/components/systems/world/WorldPlaceholder";
import { worlds } from "@/data/site/worlds";

export default function DiscoverPage() {
  return <WorldPlaceholder world={worlds.discover} />;
}
