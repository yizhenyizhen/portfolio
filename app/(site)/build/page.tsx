import { WorldPlaceholder } from "@/components/systems/world/WorldPlaceholder";
import { worlds } from "@/data/site/worlds";

export default function BuildPage() {
  return <WorldPlaceholder world={worlds.build} />;
}
