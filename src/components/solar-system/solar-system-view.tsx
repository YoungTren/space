"use client";

import { Canvas } from "@react-three/fiber";
import {
  AlertCircle,
  Loader2,
  Map,
  Pause,
  Play,
  SendHorizontal,
  Telescope,
} from "lucide-react";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBodyPreviewSrc } from "@/lib/body-preview";
import { getFactsForBody } from "@/lib/planet-facts";
import { cn } from "@/lib/utils";
import {
  ALL_SELECTABLE_BODIES,
  MOON_BODY,
  PLANETS,
  SUN_BODY,
  type BodyId,
} from "@/lib/planets";
import { SolarScene } from "./solar-scene";

type BodyPanelInfo = {
  id: BodyId;
  nameRu: string;
  name: string;
  subtitle: string;
};

const getBodyPanelInfo = (id: BodyId): BodyPanelInfo => {
  if (id === "sun") {
    return {
      id: "sun",
      nameRu: SUN_BODY.nameRu,
      name: SUN_BODY.name,
      subtitle:
        "Звезда Солнечной системы · спектральный класс G2V · возраст ~4,6 млрд лет",
    };
  }
  if (id === "moon") {
    return {
      id: "moon",
      nameRu: MOON_BODY.nameRu,
      name: MOON_BODY.name,
      subtitle:
        "Спутник Земли · сидерический месяц ≈ 27,3 сут · орбита вокруг Земли в сцене сжата",
    };
  }
  const p = PLANETS.find((x) => x.id === id)!;
  return {
    id: p.id,
    nameRu: p.nameRu,
    name: p.name,
    subtitle:
      p.orbitalPeriodYears < 1
        ? `орбита ≈ ${p.orbitalPeriodYears.toFixed(3)} земного года`
        : `орбитальный период ≈ ${p.orbitalPeriodYears.toFixed(2)} лет`,
  };
};

const TIME_PRESETS = [
  { value: "0.25", label: "0.25×", factor: 0.25 },
  { value: "1", label: "1×", factor: 1 },
  { value: "5", label: "5×", factor: 5 },
  { value: "25", label: "25×", factor: 25 },
  { value: "100", label: "100×", factor: 100 },
] as const;

const PLANET_SELECT_NONE = "_none";

type SimulationControlsBarProps = {
  simulationPaused: boolean;
  onTogglePause: () => void;
  timePreset: string;
  onTimePresetChange: (v: string) => void;
  className?: string;
};

const SimulationControlsBar = ({
  simulationPaused,
  onTogglePause,
  timePreset,
  onTimePresetChange,
  className,
}: SimulationControlsBarProps) => (
  <div
    className={cn(
      "rounded-lg border border-border/60 bg-card/90 px-2 py-1.5 shadow-sm backdrop-blur-md",
      className,
    )}
  >
    <p className="mb-1 text-center text-xs font-semibold tracking-tight text-foreground sm:text-sm">
      Наша солнечная система
    </p>
    <div className="flex items-center justify-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="size-6 shrink-0 [&_svg]:size-3"
        aria-pressed={!simulationPaused}
        aria-label={
          simulationPaused ? "Запустить движение планет" : "Пауза"
        }
        onClick={onTogglePause}
      >
        {simulationPaused ? (
          <Play className="size-3" />
        ) : (
          <Pause className="size-3" />
        )}
      </Button>
      <span className="max-w-[72px] shrink-0 text-center text-[9px] leading-tight text-muted-foreground sm:max-w-none sm:text-[10px]">
        Скорость времени
      </span>
      <Select
        value={timePreset}
        onValueChange={(v) => {
          if (v) onTimePresetChange(v);
        }}
        disabled={simulationPaused}
      >
        <SelectTrigger
          size="sm"
          className="h-5 min-h-5 w-[50px] px-1 text-[10px] [&_svg]:size-3"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TIME_PRESETS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

type ObjectToolbarProps = {
  selectedId: BodyId | null;
  onSelectBody: (id: BodyId) => void;
  onOverview: () => void;
  onUnset: () => void;
  className?: string;
};

const ObjectToolbar = ({
  selectedId,
  onSelectBody,
  onOverview,
  onUnset,
  className,
}: ObjectToolbarProps) => (
  <div
    className={cn(
      "flex min-w-0 max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto rounded-lg border border-border/60 bg-card/90 px-2 py-2 shadow-sm backdrop-blur-md",
      className,
    )}
  >
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
        Объект
      </span>
      <Select
        value={selectedId ?? PLANET_SELECT_NONE}
        onValueChange={(v) => {
          if (v === PLANET_SELECT_NONE) {
            onUnset();
            return;
          }
          onSelectBody(v as BodyId);
        }}
      >
        <SelectTrigger
          size="sm"
          className="min-w-0 w-full max-w-full flex-1 basis-0"
        >
          <SelectValue>
            {(value: string) =>
              value === PLANET_SELECT_NONE
                ? "Не выбран"
                : getBodyPanelInfo(value as BodyId).nameRu}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PLANET_SELECT_NONE}>Не выбран</SelectItem>
          {ALL_SELECTABLE_BODIES.map((id) => (
            <SelectItem key={id} value={id}>
              {getBodyPanelInfo(id).nameRu}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="shrink-0 border border-border bg-background/80"
      onClick={onOverview}
    >
      <Map className="size-4" />
      <span className="hidden sm:inline">Обзор системы</span>
    </Button>
  </div>
);

type AiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; text: string };

const useIsDesktop = () => {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
};

type PlanetPanelBodyProps = {
  body: BodyPanelInfo;
  /** Та же текстура 2K, что в сцене — превью в панели. */
  previewSrc: string;
  facts: readonly string[];
  question: string;
  onQuestionChange: (v: string) => void;
  onAsk: () => void;
  aiState: AiState;
  surfaceView: boolean;
  onToggleSurface: () => void;
  compact?: boolean;
};

const PlanetPanelBody = ({
  body,
  previewSrc,
  facts,
  question,
  onQuestionChange,
  onAsk,
  aiState,
  surfaceView,
  onToggleSurface,
  compact,
}: PlanetPanelBodyProps) => {
  const askDisabled =
    question.trim().length === 0 || aiState.status === "loading";

  const factsBlock = (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={previewSrc}
          alt={`${body.nameRu} — текстура модели`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 400px"
          unoptimized
        />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            10 фактов
          </h3>
          <p className="text-xs text-muted-foreground">
            Кратко и по делу — можно пролистать.
          </p>
        </div>
        <Button
          type="button"
          variant={surfaceView ? "secondary" : "outline"}
          size="sm"
          className="shrink-0"
          onClick={onToggleSurface}
        >
          <Telescope className="size-3.5" />
          {surfaceView ? "Орбита" : "Поверхность"}
        </Button>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Карта 2K на сфере — наглядная модель; масштабы и шейдеры упрощены.
      </p>
      <ScrollArea
        className={compact ? "h-[min(30vh,260px)]" : "h-[min(34vh,300px)]"}
      >
        <ol className="list-none space-y-2.5 pr-3 pl-1 text-sm leading-relaxed">
          {facts.map((fact, index) => (
            <li key={`${body.id}-${index}`} className="flex gap-2.5">
              <span className="w-9 shrink-0 text-right tabular-nums text-muted-foreground">
                {index + 1}.
              </span>
              <span className="min-w-0 flex-1">{fact}</span>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </div>
  );

  const aiBlock = (
    <div className="space-y-3">
      <Separator />
      <div className="space-y-1.5">
        <Label htmlFor={`body-ai-${body.id}`}>Спросить ИИ</Label>
        <p className="text-xs text-muted-foreground">
          Контекст уже задан — выбран объект{" "}
          <span className="font-medium text-foreground">{body.nameRu}</span>.
          Спросите что угодно: поверхность, орбиты, миссии…
        </p>
        <div className="flex gap-2">
          <Input
            id={`body-ai-${body.id}`}
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder={
              body.id === "moon"
                ? "Например: почему мы видим только одну сторону Луны?"
                : body.id === "sun"
                  ? "Например: сколько ещё простоит Солнце на главной последовательности?"
                  : `Например: что интересного у ${body.nameRu}?`
            }
            disabled={aiState.status === "loading"}
            aria-busy={aiState.status === "loading"}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!askDisabled) onAsk();
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            disabled={askDisabled}
            onClick={onAsk}
            aria-label="Отправить вопрос"
          >
            {aiState.status === "loading" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendHorizontal className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {aiState.status === "idle" ? null : aiState.status === "loading" ? (
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ) : aiState.status === "error" ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Сеть или сервер</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{aiState.message}</p>
            <Button type="button" variant="outline" size="sm" onClick={onAsk}>
              Повторить
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <ScrollArea className="max-h-48 rounded-lg border border-border bg-muted/20 p-3">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {aiState.text}
          </div>
        </ScrollArea>
      )}
    </div>
  );

  return (
    <>
      {compact ? (
        <Tabs defaultValue="facts" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="facts" className="flex-1">
              Факты
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">
              Спросить ИИ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="facts" className="mt-3 min-h-0 flex-1">
            {factsBlock}
          </TabsContent>
          <TabsContent value="ai" className="mt-3 min-h-0 flex-1">
            {aiBlock}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          {factsBlock}
          {aiBlock}
        </div>
      )}
    </>
  );
};

export const SolarSystemView = () => {
  const [selectedId, setSelectedId] = useState<BodyId | null>(null);
  const [simulationPaused, setSimulationPaused] = useState(false);
  const [timePreset, setTimePreset] = useState<string>("1");
  const [overviewNonce, setOverviewNonce] = useState(0);
  const [surfaceView, setSurfaceView] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiState, setAiState] = useState<AiState>({ status: "idle" });

  const isDesktop = useIsDesktop();

  const timeFactor = useMemo(() => {
    const row = TIME_PRESETS.find((p) => p.value === timePreset);
    return row?.factor ?? 1;
  }, [timePreset]);

  const selectedBody = useMemo(
    () => (selectedId ? getBodyPanelInfo(selectedId) : null),
    [selectedId],
  );

  const facts = useMemo(
    () => (selectedId ? getFactsForBody(selectedId) : []),
    [selectedId],
  );

  const handleSelectBody = useCallback((id: BodyId) => {
    setSelectedId(id);
    setSurfaceView(false);
    setAiState({ status: "idle" });
    setQuestion("");
    setMobileSheetOpen(true);
  }, []);

  const handleOverview = useCallback(() => {
    setSelectedId(null);
    setSurfaceView(false);
    setOverviewNonce((n) => n + 1);
    setMobileSheetOpen(false);
    setAiState({ status: "idle" });
    setQuestion("");
  }, []);

  const handleUnsetSelection = useCallback(() => {
    setSelectedId(null);
    setSurfaceView(false);
    setMobileSheetOpen(false);
    setAiState({ status: "idle" });
    setQuestion("");
    setOverviewNonce((n) => n + 1);
  }, []);

  const handleAskAi = useCallback(async () => {
    if (!selectedId || question.trim().length === 0) return;
    setAiState({ status: "loading" });
    try {
      const res = await fetch("/api/planet-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bodyId: selectedId,
          question: question.trim(),
        }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : `Ошибка ${res.status}`;
        setAiState({ status: "error", message: msg });
        return;
      }
      if (
        typeof data === "object" &&
        data !== null &&
        "answer" in data &&
        typeof (data as { answer: unknown }).answer === "string"
      ) {
        setAiState({
          status: "success",
          text: (data as { answer: string }).answer,
        });
        return;
      }
      setAiState({
        status: "error",
        message: "Не удалось разобрать ответ сервера.",
      });
    } catch {
      setAiState({
        status: "error",
        message: "Нет соединения. Проверьте сеть и попробуйте снова.",
      });
    }
  }, [question, selectedId]);

  const mobileSheetVisible = mobileSheetOpen && !isDesktop;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <Canvas
        className="absolute inset-0 h-full w-full touch-none"
        camera={{ position: [0, 6, 12], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <SolarScene
            selectedId={selectedId}
            onSelectBody={handleSelectBody}
            simulationPaused={simulationPaused}
            timeScale={timeFactor}
            overviewNonce={overviewNonce}
            surfaceView={surfaceView && selectedId !== null}
          />
        </Suspense>
      </Canvas>

      {/* Мобильный / планшет: симуляция и объекты — справа сверху */}
      <div className="pointer-events-none absolute right-2 top-2 z-20 flex w-[min(100vw-1rem,24rem)] max-w-full flex-col items-stretch gap-2 sm:right-3 sm:top-3 lg:hidden">
        <SimulationControlsBar
          simulationPaused={simulationPaused}
          onTogglePause={() => setSimulationPaused((p) => !p)}
          timePreset={timePreset}
          onTimePresetChange={setTimePreset}
          className="pointer-events-auto w-full min-w-0"
        />
        <ObjectToolbar
          selectedId={selectedId}
          onSelectBody={handleSelectBody}
          onOverview={handleOverview}
          onUnset={handleUnsetSelection}
          className="pointer-events-auto w-full min-w-0"
        />
      </div>

      {/* Десктоп: справа — симуляция, выбор объекта, карточка */}
      <aside
        className="pointer-events-none absolute right-2 top-2 bottom-2 z-20 hidden w-[min(100vw-1rem,24rem)] gap-3 sm:right-3 sm:top-3 sm:bottom-3 lg:flex lg:flex-col xl:max-w-md"
        aria-label="Панель симуляции и информация о выбранном объекте"
      >
        <div className="pointer-events-auto shrink-0">
          <SimulationControlsBar
            simulationPaused={simulationPaused}
            onTogglePause={() => setSimulationPaused((p) => !p)}
            timePreset={timePreset}
            onTimePresetChange={setTimePreset}
            className="w-full min-w-0"
          />
        </div>
        <div className="pointer-events-auto shrink-0">
          <ObjectToolbar
            selectedId={selectedId}
            onSelectBody={handleSelectBody}
            onOverview={handleOverview}
            onUnset={handleUnsetSelection}
            className="w-full min-w-0"
          />
        </div>

        <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden">
          {selectedBody ? (
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-border/60 bg-card/95 shadow-lg backdrop-blur-md">
              <CardHeader className="shrink-0 space-y-1 pb-2">
                <CardTitle
                  className="text-xl"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {selectedBody.nameRu}
                </CardTitle>
                <CardDescription>
                  {selectedBody.name} · {selectedBody.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden pb-2">
                <PlanetPanelBody
                  body={selectedBody}
                  previewSrc={getBodyPreviewSrc(selectedBody.id)}
                  facts={facts}
                  question={question}
                  onQuestionChange={setQuestion}
                  onAsk={handleAskAi}
                  aiState={aiState}
                  surfaceView={surfaceView}
                  onToggleSurface={() => setSurfaceView((s) => !s)}
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileSheetVisible} onOpenChange={setMobileSheetOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[88vh] flex-col gap-0 rounded-t-xl border-border bg-card p-0"
        >
          {selectedBody ? (
            <>
              <SheetHeader className="shrink-0 border-b border-border px-4 pt-4 pb-2 text-left">
                <SheetTitle>{selectedBody.nameRu}</SheetTitle>
                <SheetDescription>
                  {selectedBody.name} · {selectedBody.subtitle}
                </SheetDescription>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-2">
                <PlanetPanelBody
                  body={selectedBody}
                  previewSrc={getBodyPreviewSrc(selectedBody.id)}
                  facts={facts}
                  question={question}
                  onQuestionChange={setQuestion}
                  onAsk={handleAskAi}
                  aiState={aiState}
                  surfaceView={surfaceView}
                  onToggleSurface={() => setSurfaceView((s) => !s)}
                  compact
                />
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Mobile: open sheet when planet selected but sheet was closed — FAB */}
      {!isDesktop && selectedBody && !mobileSheetOpen ? (
        <div className="pointer-events-auto fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 lg:hidden">
          <Button type="button" onClick={() => setMobileSheetOpen(true)}>
            Открыть: {selectedBody.nameRu}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
