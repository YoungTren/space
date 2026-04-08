"use client";

import dynamic from "next/dynamic";

const SolarSystemView = dynamic(
  () =>
    import("@/components/solar-system/solar-system-view").then((mod) => ({
      default: mod.SolarSystemView,
    })),
  { ssr: false, loading: () => null },
);

export const HomeClient = () => <SolarSystemView />;
