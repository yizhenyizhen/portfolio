import { WorldPlaceholder } from "@/components/systems/world/WorldPlaceholder";
import { worlds } from "@/data/site/worlds";

export default function MeetPage() {
  return <WorldPlaceholder world={worlds.meet} />;
}
