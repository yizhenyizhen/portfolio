import { WorldPlaceholder } from "@/components/systems/world/WorldPlaceholder";
import { worlds } from "@/data/site/worlds";

export default function CreatePage() {
  return <WorldPlaceholder world={worlds.create} />;
}
