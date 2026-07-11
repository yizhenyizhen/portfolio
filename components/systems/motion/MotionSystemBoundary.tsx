import type { ReactNode } from "react";
import type { MotionPresetName } from "@/types/motion";

export type MotionSystemBoundaryProps = {
  preset: MotionPresetName;
  children: ReactNode;
};

export function MotionSystemBoundary({
  preset,
  children,
}: MotionSystemBoundaryProps) {
  return <div data-motion-preset={preset}>{children}</div>;
}
