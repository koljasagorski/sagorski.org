"use client";

import { forwardRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import GlobeBase from "react-globe.gl";

// Thin forwardRef wrapper so next/dynamic preserves the imperative ref
// (pointOfView, controls, scene, …) that react-globe.gl exposes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Globe = forwardRef<any, any>(function Globe(props, ref) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <GlobeBase {...(props as any)} ref={ref} />;
});

export default Globe;
