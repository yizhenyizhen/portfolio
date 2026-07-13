import { WorldPlaceholder } from "@/components/systems/world/WorldPlaceholder";
import { worlds } from "@/data/site/worlds";

export default function CollectPage() {
  return <WorldPlaceholder world={worlds.collect} />;
}
