"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useRef, type RefObject } from "react";
import {
  DoubleSide,
  Vector3,
  type Group,
  type Mesh,
  type Object3D,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  MOON_BODY,
  PLANETS,
  getBodyConfig,
  getBodyRadius,
  type BodyId,
  type PlanetConfig,
} from "@/lib/planets";
import {
  MoonVisualSuspense,
  PlanetVisualSuspense,
  SunInteractive,
} from "@/components/solar-system/planet-mesh";

/** Модельное время: один земной год в сцене при множителе 1× (до ускорения UI). */
const EARTH_ORBIT_MODEL_SECONDS = 52;

export type SolarSceneProps = {
  selectedId: BodyId | null;
  onSelectBody: (id: BodyId) => void;
  simulationPaused: boolean;
  timeScale: number;
  overviewNonce: number;
  surfaceView: boolean;
};

type OrbitingPlanetProps = {
  planet: PlanetConfig;
  selectedId: BodyId | null;
  onSelectBody: (id: BodyId) => void;
  simTimeRef: RefObject<number>;
};

const SimulationClock = ({
  paused,
  timeScale,
  simTimeRef,
}: {
  paused: boolean;
  timeScale: number;
  simTimeRef: RefObject<number>;
}) => {
  useFrame((_, delta) => {
    if (!paused) {
      simTimeRef.current += delta * timeScale;
    }
  });
  return null;
};

const OrbitingPlanet = ({
  planet,
  selectedId,
  onSelectBody,
  simTimeRef,
}: OrbitingPlanetProps) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  const omega =
    (2 * Math.PI) /
    (planet.orbitalPeriodYears * EARTH_ORBIT_MODEL_SECONDS);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const t = simTimeRef.current;
    const angle = t * omega;
    g.position.set(
      Math.cos(angle) * planet.orbitRadius,
      0,
      Math.sin(angle) * planet.orbitRadius,
    );
  });

  const selected = selectedId === planet.id;

  return (
    <group ref={groupRef} name={`planet-${planet.id}`}>
      <PlanetVisualSuspense
        planet={planet}
        selected={selected}
        meshRef={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectBody(planet.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      />
    </group>
  );
};

const EarthMoonSystem = ({
  selectedId,
  onSelectBody,
  simTimeRef,
}: {
  selectedId: BodyId | null;
  onSelectBody: (id: BodyId) => void;
  simTimeRef: RefObject<number>;
}) => {
  const earth = PLANETS.find((p) => p.id === "earth")!;
  const orbitRef = useRef<Group>(null);
  const moonPivotRef = useRef<Group>(null);
  const earthMeshRef = useRef<Mesh>(null);
  const moonMeshRef = useRef<Mesh>(null);

  const omegaEarth =
    (2 * Math.PI) /
    (earth.orbitalPeriodYears * EARTH_ORBIT_MODEL_SECONDS);
  const omegaMoon =
    (2 * Math.PI) /
    (MOON_BODY.orbitalPeriodEarthYears * EARTH_ORBIT_MODEL_SECONDS);

  useFrame(() => {
    const t = simTimeRef.current;
    const g = orbitRef.current;
    if (g) {
      const a = t * omegaEarth;
      g.position.set(
        Math.cos(a) * earth.orbitRadius,
        0,
        Math.sin(a) * earth.orbitRadius,
      );
    }
    const mp = moonPivotRef.current;
    if (mp) {
      mp.rotation.y = t * omegaMoon;
    }
  });

  const moonOrbitR = MOON_BODY.orbitRadiusAroundEarth;

  return (
    <group ref={orbitRef} name="planet-earth">
      <PlanetVisualSuspense
        planet={earth}
        selected={selectedId === "earth"}
        meshRef={earthMeshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectBody("earth");
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[moonOrbitR - 0.02, moonOrbitR + 0.02, 96]} />
        <meshBasicMaterial
          color="#88aaff"
          transparent
          opacity={0.14}
          side={DoubleSide}
        />
      </mesh>
      <group ref={moonPivotRef}>
        <group position={[moonOrbitR, 0, 0]} name="planet-moon">
          <MoonVisualSuspense
            radius={MOON_BODY.radius}
            color={MOON_BODY.color}
            selected={selectedId === "moon"}
            meshRef={moonMeshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelectBody("moon");
            }}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          />
        </group>
      </group>
    </group>
  );
};

const OrbitRing = ({ radius }: { radius: number }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
    <meshBasicMaterial
      color="#ffffff"
      transparent
      opacity={0.12}
      side={DoubleSide}
    />
  </mesh>
);

type CameraRigProps = {
  selectedId: BodyId | null;
  overviewNonce: number;
  surfaceView: boolean;
};

const CameraRig = ({
  selectedId,
  overviewNonce,
  surfaceView,
}: CameraRigProps) => {
  const { camera, scene } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const initialCameraPos = useRef(new Vector3(0, 6, 12));
  const overviewNonceRef = useRef(overviewNonce);
  const tmpTarget = useRef(new Vector3());
  const tmpPlanetPos = useRef(new Vector3());
  const tmpDir = useRef(new Vector3());
  const tmpDesiredCam = useRef(new Vector3());

  useEffect(() => {
    initialCameraPos.current.copy(camera.position);
  }, [camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (overviewNonce !== overviewNonceRef.current) {
      overviewNonceRef.current = overviewNonce;
      camera.position.copy(initialCameraPos.current);
      controls.target.set(0, 0, 0);
      controls.update();
      return;
    }

    const lerp = 1 - Math.exp(-4 * delta);

    const origin = tmpTarget.current.set(0, 0, 0);
    let focus = origin;
    let planetObj: Object3D | null = null;

    if (selectedId) {
      planetObj =
        scene.getObjectByName(`planet-${selectedId}`) ?? null;
      if (planetObj) {
        planetObj.getWorldPosition(tmpPlanetPos.current);
        focus = tmpPlanetPos.current;
      }
    }

    controls.target.lerp(focus, lerp);

    if (!selectedId) {
      camera.position.lerp(initialCameraPos.current, lerp);
    } else if (surfaceView && planetObj) {
      const r = getBodyRadius(selectedId);
      /** Земля: ближе к сфере, чтобы были различимы континенты; остальные тела — прежний масштаб. */
      const wantDist =
        selectedId === "earth"
          ? Math.max(r * 2.05, r + 0.14)
          : Math.max(r * 4.2, 0.55);
      planetObj.getWorldPosition(tmpPlanetPos.current);
      tmpDir.current
        .copy(camera.position)
        .sub(tmpPlanetPos.current);
      if (tmpDir.current.lengthSq() < 1e-8) {
        tmpDir.current.set(0, 0.25, 1).normalize();
      } else {
        tmpDir.current.normalize();
      }
      tmpDesiredCam.current
        .copy(tmpPlanetPos.current)
        .add(tmpDir.current.clone().multiplyScalar(wantDist));
      camera.position.lerp(tmpDesiredCam.current, lerp * 0.85);
    }

    controls.update();
  });

  const selectedCfg = selectedId ? getBodyConfig(selectedId) : undefined;
  const minDist =
    selectedId && surfaceView && selectedCfg
      ? selectedId === "earth"
        ? Math.max(selectedCfg.radius * 1.32, 0.33)
        : Math.max(selectedCfg.radius * 2.4, 0.35)
      : 2;

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      minDistance={minDist}
      maxDistance={28}
      enableDamping
      dampingFactor={0.06}
    />
  );
};

export const SolarScene = ({
  selectedId,
  onSelectBody,
  simulationPaused,
  timeScale,
  overviewNonce,
  surfaceView,
}: SolarSceneProps) => {
  const simTimeRef = useRef(0);

  const planetsExceptEarth = PLANETS.filter((p) => p.id !== "earth");

  return (
    <>
      <color attach="background" args={["#050508"]} />
      <ambientLight intensity={0.14} />
      <pointLight position={[0, 0, 0]} intensity={2.45} color="#fff5e0" />
      <Stars
        radius={120}
        depth={60}
        count={5000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
      <SunInteractive
        selected={selectedId === "sun"}
        onSelect={() => onSelectBody("sun")}
      />
      {PLANETS.map((planet) => (
        <OrbitRing key={`ring-${planet.id}`} radius={planet.orbitRadius} />
      ))}
      <SimulationClock
        paused={simulationPaused}
        timeScale={timeScale}
        simTimeRef={simTimeRef}
      />
      <EarthMoonSystem
        selectedId={selectedId}
        onSelectBody={onSelectBody}
        simTimeRef={simTimeRef}
      />
      {planetsExceptEarth.map((planet) => (
        <OrbitingPlanet
          key={planet.id}
          planet={planet}
          selectedId={selectedId}
          onSelectBody={onSelectBody}
          simTimeRef={simTimeRef}
        />
      ))}
      <CameraRig
        selectedId={selectedId}
        overviewNonce={overviewNonce}
        surfaceView={surfaceView}
      />
    </>
  );
};
