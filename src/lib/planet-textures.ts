import type { PlanetId } from "@/lib/planets";

/**
 * Локальные копии карт (public/) — без cross-origin для WebGL.
 * Источник: Solar System Scope.
 */
const BASE = "/textures/planets";

export const SUN_TEXTURE_URL = `${BASE}/2k_sun.jpg`;

export const PLANET_TEXTURE_URLS: Record<PlanetId, string> = {
  mercury: `${BASE}/2k_mercury.jpg`,
  venus: `${BASE}/2k_venus_surface.jpg`,
  earth: `${BASE}/2k_earth_daymap.jpg`,
  mars: `${BASE}/2k_mars.jpg`,
  jupiter: `${BASE}/2k_jupiter.jpg`,
  saturn: `${BASE}/2k_saturn.jpg`,
  uranus: `${BASE}/2k_uranus.jpg`,
  neptune: `${BASE}/2k_neptune.jpg`,
};

export const MOON_TEXTURE_URL = `${BASE}/2k_moon.jpg`;

export const EARTH_CLOUDS_URL = `${BASE}/2k_earth_clouds.jpg`;
export const EARTH_NIGHT_LIGHTS_URL = `${BASE}/2k_earth_nightmap.jpg`;
/** Карта нормалей (рельеф); линейное цветовое пространство в WebGL. Источник: three.js examples. */
export const EARTH_NORMAL_MAP_URL = `${BASE}/2k_earth_normal_map.jpg`;

/** Альфа-карта для кольца Сатурна (радиальная маска). */
export const SATURN_RING_ALPHA_URL = `${BASE}/2k_saturn_ring_alpha.png`;
