export type PlanetId =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export type PlanetConfig = {
  id: PlanetId;
  name: string;
  color: string;
  radius: number;
  orbitRadius: number;
  /** Angular speed multiplier for demo orbits */
  speed: number;
};

export const PLANETS: readonly PlanetConfig[] = [
  {
    id: "mercury",
    name: "Mercury",
    color: "#b5b5b5",
    radius: 0.15,
    orbitRadius: 1.6,
    speed: 1.6,
  },
  {
    id: "venus",
    name: "Venus",
    color: "#e6c88a",
    radius: 0.22,
    orbitRadius: 2.1,
    speed: 1.2,
  },
  {
    id: "earth",
    name: "Earth",
    color: "#4a90d9",
    radius: 0.24,
    orbitRadius: 2.7,
    speed: 1,
  },
  {
    id: "mars",
    name: "Mars",
    color: "#c1440e",
    radius: 0.18,
    orbitRadius: 3.2,
    speed: 0.85,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    color: "#d4a574",
    radius: 0.55,
    orbitRadius: 4.2,
    speed: 0.45,
  },
  {
    id: "saturn",
    name: "Saturn",
    color: "#e3d3b5",
    radius: 0.48,
    orbitRadius: 5.2,
    speed: 0.35,
  },
  {
    id: "uranus",
    name: "Uranus",
    color: "#9fd3e6",
    radius: 0.32,
    orbitRadius: 6.1,
    speed: 0.28,
  },
  {
    id: "neptune",
    name: "Neptune",
    color: "#3f6fcf",
    radius: 0.3,
    orbitRadius: 6.9,
    speed: 0.22,
  },
] as const;
