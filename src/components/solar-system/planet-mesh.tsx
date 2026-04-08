"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef, type RefObject } from "react";
import {
  DoubleSide,
  FrontSide,
  NoColorSpace,
  SRGBColorSpace,
  Vector2,
  type Group,
  type Mesh,
  type Texture,
} from "three";
import type { PlanetConfig } from "@/lib/planets";
import {
  EARTH_CLOUDS_URL,
  EARTH_NIGHT_LIGHTS_URL,
  EARTH_NORMAL_MAP_URL,
  MOON_TEXTURE_URL,
  PLANET_TEXTURE_URLS,
  SATURN_RING_ALPHA_URL,
  SUN_TEXTURE_URL,
} from "@/lib/planet-textures";

const applySrgb = (tex: Texture) => {
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
};

const applyLinearDataTexture = (tex: Texture) => {
  tex.colorSpace = NoColorSpace;
  tex.anisotropy = 8;
};

/** Умеренный рельеф (Анды, океанические хребты) без чрезмерной «шумности». */
const EARTH_NORMAL_SCALE = new Vector2(0.78, 0.78);

type PointerHandlers = {
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: (e: { stopPropagation: () => void }) => void;
};

type PlanetBodyProps = {
  planet: PlanetConfig;
  selected: boolean;
  meshRef: RefObject<Mesh | null>;
} & PointerHandlers;

type TexturedSunProps = {
  radius?: number;
};

export const SunFallback = ({ radius = 0.45 }: TexturedSunProps) => (
  <mesh>
    <sphereGeometry args={[radius, 32, 32]} />
    <meshStandardMaterial
      color="#fbbf24"
      emissive="#f59e0b"
      emissiveIntensity={1.1}
      roughness={0.6}
      metalness={0}
    />
  </mesh>
);

const SunTexturedMesh = ({
  radius = 0.45,
  selected,
  onSelect,
}: {
  radius?: number;
  selected: boolean;
  onSelect: () => void;
}) => {
  const map = useTexture(SUN_TEXTURE_URL);
  useLayoutEffect(() => {
    applySrgb(map);
  }, [map]);

  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={map}
        emissiveMap={map}
        emissive="#ffffff"
        emissiveIntensity={selected ? 1.12 : 0.88}
        roughness={0.38}
        metalness={0}
      />
    </mesh>
  );
};

/** Солнце в центре сцены: клик открывает панель. */
export const SunInteractive = ({
  selected,
  radius = 0.45,
  onSelect,
}: {
  selected: boolean;
  radius?: number;
  onSelect: () => void;
}) => (
  <group name="planet-sun">
    <Suspense fallback={<SunFallback radius={radius} />}>
      <SunTexturedMesh
        radius={radius}
        selected={selected}
        onSelect={onSelect}
      />
    </Suspense>
  </group>
);

const MercuryVisual = ({
  planet,
  selected,
  meshRef,
  ...h
}: PlanetBodyProps) => {
  const map = useTexture(PLANET_TEXTURE_URLS.mercury);
  useLayoutEffect(() => {
    applySrgb(map);
  }, [map]);
  return (
    <mesh ref={meshRef} {...h}>
      <sphereGeometry args={[planet.radius, 96, 96]} />
      <meshStandardMaterial
        map={map}
        color="#ffffff"
        roughness={0.94}
        metalness={0.18}
        emissive={planet.color}
        emissiveIntensity={selected ? 0.2 : 0.03}
      />
    </mesh>
  );
};

const VenusVisual = ({
  planet,
  selected,
  meshRef,
  ...h
}: PlanetBodyProps) => {
  const map = useTexture(PLANET_TEXTURE_URLS.venus);
  useLayoutEffect(() => {
    applySrgb(map);
  }, [map]);
  const spinRef = useRef<Group>(null);
  useFrame((_, dt) => {
    if (spinRef.current) spinRef.current.rotation.y += dt * 0.006;
  });
  const r = planet.radius;
  return (
    <group ref={spinRef}>
      <mesh ref={meshRef} {...h}>
        <sphereGeometry args={[r, 96, 96]} />
        <meshStandardMaterial
          map={map}
          color="#ffffff"
          roughness={0.88}
          metalness={0.04}
          emissive={planet.color}
          emissiveIntensity={selected ? 0.18 : 0.025}
        />
      </mesh>
      <mesh
        scale={[1.055, 1.055, 1.055]}
        renderOrder={2}
        raycast={() => null}
      >
        <sphereGeometry args={[r, 48, 48]} />
        <meshStandardMaterial
          color="#fff3d4"
          transparent
          opacity={0.22}
          roughness={0.12}
          metalness={0}
          depthWrite={false}
          side={FrontSide}
        />
      </mesh>
      <mesh
        scale={[1.09, 1.09, 1.09]}
        renderOrder={1}
        raycast={() => null}
      >
        <sphereGeometry args={[r, 32, 32]} />
        <meshStandardMaterial
          color="#ffd9a0"
          transparent
          opacity={0.1}
          roughness={0.2}
          metalness={0}
          depthWrite={false}
          side={FrontSide}
        />
      </mesh>
    </group>
  );
};

const EarthVisual = ({
  planet,
  selected,
  meshRef,
  ...h
}: PlanetBodyProps) => {
  const [day, clouds, night, normal] = useTexture([
    PLANET_TEXTURE_URLS.earth,
    EARTH_CLOUDS_URL,
    EARTH_NIGHT_LIGHTS_URL,
    EARTH_NORMAL_MAP_URL,
  ]);
  useLayoutEffect(() => {
    applySrgb(day);
    applySrgb(clouds);
    applySrgb(night);
    applyLinearDataTexture(normal);
  }, [day, clouds, night, normal]);
  const cloudRef = useRef<Group>(null);
  useFrame((_, dt) => {
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.028;
  });
  const r = planet.radius;
  return (
    <group>
      <mesh ref={meshRef} {...h}>
        <sphereGeometry args={[r, 192, 192]} />
        <meshStandardMaterial
          map={day}
          normalMap={normal}
          normalScale={EARTH_NORMAL_SCALE}
          emissiveMap={night}
          emissive="#ffefe0"
          emissiveIntensity={0.55}
          roughness={0.52}
          metalness={0.1}
        />
      </mesh>
      <group ref={cloudRef}>
        <mesh scale={[1.015, 1.015, 1.015]} raycast={() => null}>
          <sphereGeometry args={[r, 128, 128]} />
          <meshStandardMaterial
            map={clouds}
            color="#ffffff"
            transparent
            opacity={0.48}
            depthWrite={false}
            roughness={1}
            metalness={0}
            emissive="#a8c8ff"
            emissiveIntensity={selected ? 0.06 : 0}
          />
        </mesh>
      </group>
    </group>
  );
};

const MarsVisual = ({
  planet,
  selected,
  meshRef,
  ...h
}: PlanetBodyProps) => {
  const map = useTexture(PLANET_TEXTURE_URLS.mars);
  useLayoutEffect(() => {
    applySrgb(map);
  }, [map]);
  return (
    <mesh ref={meshRef} {...h}>
      <sphereGeometry args={[planet.radius, 96, 96]} />
      <meshStandardMaterial
        map={map}
        color="#ffffff"
        roughness={0.91}
        metalness={0.03}
        emissive="#8b2500"
        emissiveIntensity={selected ? 0.14 : 0.04}
      />
    </mesh>
  );
};

const JupiterVisual = ({
  planet,
  selected,
  meshRef,
  ...h
}: PlanetBodyProps) => {
  const map = useTexture(PLANET_TEXTURE_URLS.jupiter);
  useLayoutEffect(() => {
    applySrgb(map);
  }, [map]);
  const spinRef = useRef<Group>(null);
  useFrame((_, dt) => {
    if (spinRef.current) spinRef.current.rotation.y += dt * 0.018;
  });
  return (
    <group ref={spinRef}>
      <mesh ref={meshRef} {...h}>
        <sphereGeometry args={[planet.radius, 96, 96]} />
        <meshStandardMaterial
          map={map}
          color="#ffffff"
          roughness={0.52}
          metalness={0.06}
          emissive={planet.color}
          emissiveIntensity={selected ? 0.12 : 0.03}
        />
      </mesh>
    </group>
  );
};

const SaturnWithRings = ({
  planet,
  selected,
  meshRef,
  ...h
}: PlanetBodyProps) => {
  const [planetMap, ringMap] = useTexture([
    PLANET_TEXTURE_URLS.saturn,
    SATURN_RING_ALPHA_URL,
  ]);
  useLayoutEffect(() => {
    applySrgb(planetMap);
    applySrgb(ringMap);
  }, [planetMap, ringMap]);

  const innerR = planet.radius * 1.22;
  const outerR = planet.radius * 2.35;

  return (
    <group rotation={[0.38, 0, 0]}>
      <mesh ref={meshRef} {...h}>
        <sphereGeometry args={[planet.radius, 96, 96]} />
        <meshStandardMaterial
          map={planetMap}
          color="#ffffff"
          roughness={0.68}
          metalness={0.04}
          emissive={planet.color}
          emissiveIntensity={selected ? 0.16 : 0.035}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        {...h}
      >
        <ringGeometry args={[innerR, outerR, 128]} />
        <meshBasicMaterial
          map={ringMap}
          color="#f2ebe0"
          transparent
          opacity={0.94}
          side={DoubleSide}
          depthWrite={false}
          toneMapped
        />
      </mesh>
    </group>
  );
};

const UranusVisual = ({
  planet,
  selected,
  meshRef,
  ...h
}: PlanetBodyProps) => {
  const map = useTexture(PLANET_TEXTURE_URLS.uranus);
  useLayoutEffect(() => {
    applySrgb(map);
  }, [map]);
  return (
    <mesh ref={meshRef} {...h}>
      <sphereGeometry args={[planet.radius, 96, 96]} />
      <meshPhysicalMaterial
        map={map}
        color="#ffffff"
        roughness={0.42}
        metalness={0.05}
        clearcoat={0.85}
        clearcoatRoughness={0.25}
        emissive="#6ec8e8"
        emissiveIntensity={selected ? 0.12 : 0.05}
      />
    </mesh>
  );
};

const NeptuneVisual = ({
  planet,
  selected,
  meshRef,
  ...h
}: PlanetBodyProps) => {
  const map = useTexture(PLANET_TEXTURE_URLS.neptune);
  useLayoutEffect(() => {
    applySrgb(map);
  }, [map]);
  return (
    <mesh ref={meshRef} {...h}>
      <sphereGeometry args={[planet.radius, 96, 96]} />
      <meshPhysicalMaterial
        map={map}
        color="#ffffff"
        roughness={0.38}
        metalness={0.08}
        clearcoat={0.55}
        clearcoatRoughness={0.35}
        emissive="#2244aa"
        emissiveIntensity={selected ? 0.14 : 0.06}
      />
    </mesh>
  );
};

type PlanetVisualProps = PlanetBodyProps;

export const PlanetVisual = (props: PlanetVisualProps) => {
  switch (props.planet.id) {
    case "mercury":
      return <MercuryVisual {...props} />;
    case "venus":
      return <VenusVisual {...props} />;
    case "earth":
      return <EarthVisual {...props} />;
    case "mars":
      return <MarsVisual {...props} />;
    case "jupiter":
      return <JupiterVisual {...props} />;
    case "saturn":
      return <SaturnWithRings {...props} />;
    case "uranus":
      return <UranusVisual {...props} />;
    case "neptune":
      return <NeptuneVisual {...props} />;
  }
};

const PlanetFallback = ({
  planet,
  selected,
  meshRef,
  onPointerOver,
  onPointerOut,
  onClick,
}: PlanetVisualProps) => (
  <mesh
    ref={meshRef}
    onClick={onClick}
    onPointerOver={onPointerOver}
    onPointerOut={onPointerOut}
  >
    <sphereGeometry args={[planet.radius, 32, 32]} />
    <meshStandardMaterial
      color={planet.color}
      emissive={planet.color}
      emissiveIntensity={selected ? 0.32 : 0.1}
      roughness={0.85}
      metalness={0.05}
    />
  </mesh>
);

export const PlanetVisualSuspense = (props: PlanetVisualProps) => (
  <Suspense fallback={<PlanetFallback {...props} />}>
    <PlanetVisual {...props} />
  </Suspense>
);

export type MoonVisualProps = {
  radius: number;
  color: string;
  selected: boolean;
  meshRef: RefObject<Mesh | null>;
} & PointerHandlers;

const MoonTextured = ({
  radius,
  color,
  selected,
  meshRef,
  ...h
}: MoonVisualProps) => {
  const map = useTexture(MOON_TEXTURE_URL);
  useLayoutEffect(() => {
    applySrgb(map);
  }, [map]);
  return (
    <mesh ref={meshRef} {...h}>
      <sphereGeometry args={[radius, 96, 96]} />
      <meshStandardMaterial
        map={map}
        color="#ffffff"
        roughness={0.9}
        metalness={0.04}
        emissive={color}
        emissiveIntensity={selected ? 0.18 : 0.04}
      />
    </mesh>
  );
};

const MoonFallback = ({
  meshRef,
  radius,
  color,
  selected,
  onClick,
  onPointerOver,
  onPointerOut,
}: MoonVisualProps) => (
  <mesh
    ref={meshRef}
    onClick={onClick}
    onPointerOver={onPointerOver}
    onPointerOut={onPointerOut}
  >
    <sphereGeometry args={[radius, 32, 32]} />
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={selected ? 0.25 : 0.08}
      roughness={0.9}
      metalness={0.02}
    />
  </mesh>
);

export const MoonVisualSuspense = (props: MoonVisualProps) => (
  <Suspense fallback={<MoonFallback {...props} />}>
    <MoonTextured {...props} />
  </Suspense>
);
