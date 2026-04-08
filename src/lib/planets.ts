export type PlanetId =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

/** Планеты, Солнце и Луна (для выбора и панели). */
export type BodyId = PlanetId | "moon" | "sun";

export type PlanetConfig = {
  id: PlanetId;
  name: string;
  /** Russian display name for UI */
  nameRu: string;
  color: string;
  radius: number;
  /**
   * Радиус круговой орбиты вокруг Солнца (условные единицы сцены).
   * Подобран так, чтобы при любом положении планет расстояние между их сферами
   * было не меньше суммы радиусов + зазор (в т.ч. с учётом колец Сатурна).
   */
  orbitRadius: number;
  /** Orbital period in Earth years — relative motion matches this ratio (circular model). */
  orbitalPeriodYears: number;
};

export type SunConfig = {
  id: "sun";
  name: string;
  nameRu: string;
  color: string;
  /** Радиус сферы в сцене (не в масштабе с орбитами). */
  radius: number;
};

export const SUN_BODY: SunConfig = {
  id: "sun",
  name: "Sun",
  nameRu: "Солнце",
  color: "#fbbf24",
  radius: 0.45,
};

export type MoonConfig = {
  id: "moon";
  name: string;
  nameRu: string;
  color: string;
  radius: number;
  /** Расстояние от центра Земли в единицах сцены (сжато ради обзора). */
  orbitRadiusAroundEarth: number;
  /** Период вокруг Земли в земных годах (≈ 27.3 суток). */
  orbitalPeriodEarthYears: number;
};

export const MOON_BODY: MoonConfig = {
  id: "moon",
  name: "Moon",
  nameRu: "Луна",
  color: "#c8c8c8",
  radius: 0.066,
  orbitRadiusAroundEarth: 0.55,
  orbitalPeriodEarthYears: 27.3 / 365.25,
};

export const PLANETS: readonly PlanetConfig[] = [
  {
    id: "mercury",
    name: "Mercury",
    nameRu: "Меркурий",
    color: "#b5b5b5",
    radius: 0.15,
    orbitRadius: 1.6,
    orbitalPeriodYears: 0.241,
  },
  {
    id: "venus",
    name: "Venus",
    nameRu: "Венера",
    color: "#e6c88a",
    radius: 0.22,
    orbitRadius: 2.1,
    orbitalPeriodYears: 0.615,
  },
  {
    id: "earth",
    name: "Earth",
    nameRu: "Земля",
    color: "#4a90d9",
    radius: 0.24,
    orbitRadius: 2.7,
    orbitalPeriodYears: 1,
  },
  {
    id: "mars",
    name: "Mars",
    nameRu: "Марс",
    color: "#c1440e",
    radius: 0.18,
    orbitRadius: 3.25,
    orbitalPeriodYears: 1.88,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    nameRu: "Юпитер",
    color: "#d4a574",
    radius: 0.55,
    orbitRadius: 4.15,
    orbitalPeriodYears: 11.86,
  },
  {
    id: "saturn",
    name: "Saturn",
    nameRu: "Сатурн",
    color: "#e3d3b5",
    radius: 0.48,
    orbitRadius: 5.35,
    orbitalPeriodYears: 29.46,
  },
  {
    id: "uranus",
    name: "Uranus",
    nameRu: "Уран",
    color: "#9fd3e6",
    radius: 0.32,
    orbitRadius: 7.45,
    orbitalPeriodYears: 84.01,
  },
  {
    id: "neptune",
    name: "Neptune",
    nameRu: "Нептун",
    color: "#3f6fcf",
    radius: 0.3,
    orbitRadius: 8.25,
    orbitalPeriodYears: 164.8,
  },
] as const;

/** Порядок в меню и выпадающих списках. */
export const ALL_SELECTABLE_BODIES: readonly BodyId[] = [
  "sun",
  ...PLANETS.map((p) => p.id),
  "moon",
];

export const isBodyId = (value: unknown): value is BodyId =>
  value === "moon" ||
  value === "sun" ||
  (typeof value === "string" && PLANETS.some((p) => p.id === value));

export const getBodyConfig = (
  id: BodyId,
): PlanetConfig | MoonConfig | SunConfig | undefined => {
  if (id === "moon") return MOON_BODY;
  if (id === "sun") return SUN_BODY;
  return PLANETS.find((p) => p.id === id);
};

/** Радиус для камеры «поверхность» и коллайдеров. */
export const getBodyRadius = (id: BodyId): number => {
  const b = getBodyConfig(id);
  return b?.radius ?? 0.15;
};
