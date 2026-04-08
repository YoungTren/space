import type { BodyId } from "@/lib/planets";
import {
  MOON_TEXTURE_URL,
  PLANET_TEXTURE_URLS,
  SUN_TEXTURE_URL,
} from "@/lib/planet-textures";

/** Путь к той же 2K-текстуре, что и в сцене — для превью в панели. */
export const getBodyPreviewSrc = (id: BodyId): string => {
  if (id === "sun") return SUN_TEXTURE_URL;
  if (id === "moon") return MOON_TEXTURE_URL;
  return PLANET_TEXTURE_URLS[id];
};
