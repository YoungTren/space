"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PLANETS, type PlanetId } from "@/lib/planets";
import { SolarScene } from "./solar-scene";

const placeholderFacts = (planetName: string): readonly string[] =>
  Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    return `${n}. Placeholder fact about ${planetName} — swap for real copy when ready.`;
  });

export const SolarSystemView = () => {
  const [selectedId, setSelectedId] = useState<PlanetId | null>(null);

  const selectedPlanet = useMemo(
    () => PLANETS.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  const facts = useMemo(
    () => (selectedPlanet ? placeholderFacts(selectedPlanet.name) : []),
    [selectedPlanet],
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <Canvas
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 6, 12], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <SolarScene
            selectedId={selectedId}
            onSelectPlanet={setSelectedId}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center p-4">
        <p className="pointer-events-auto rounded-md border border-border/60 bg-card/80 px-4 py-2 text-center text-sm text-muted-foreground backdrop-blur-sm">
          Drag to orbit · Scroll to zoom · Click a planet for facts
        </p>
      </div>

      {selectedPlanet ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-full max-w-sm items-stretch p-4">
          <Card className="pointer-events-auto flex max-h-full w-full flex-col border-border/60 bg-card/90 backdrop-blur-md">
            <CardHeader className="shrink-0 space-y-1">
              <CardTitle>{selectedPlanet.name}</CardTitle>
              <CardDescription>Top 10 facts (content TBD)</CardDescription>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 pb-4">
              <ScrollArea className="h-[min(60vh,420px)] pr-3">
                <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed">
                  {facts.map((fact, index) => (
                    <li key={`${selectedPlanet.id}-${index}`}>{fact}</li>
                  ))}
                </ol>
              </ScrollArea>
              <Button
                type="button"
                variant="secondary"
                className="mt-4 w-full"
                onClick={() => setSelectedId(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};
