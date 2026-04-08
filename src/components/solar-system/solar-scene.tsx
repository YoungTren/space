"use client";

import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import { DoubleSide, type Group, type Mesh } from "three";
import {
  type PlanetConfig,
  type PlanetId,
  PLANETS,
} from "@/lib/planets";

type SolarSceneProps = {
  selectedId: PlanetId | null;
  onSelectPlanet: (id: PlanetId) => void;
};

const Sun = () => (
  <mesh>
    <sphereGeometry args={[0.45, 48, 48]} />
    <meshStandardMaterial
      color="#fbbf24"
      emissive="#f59e0b"
      emissiveIntensity={1.2}
    />
  </mesh>
);

type OrbitingPlanetProps = {
  planet: PlanetConfig;
  selectedId: PlanetId | null;
  onSelectPlanet: (id: PlanetId) => void;
};

const OrbitingPlanet = ({
  planet,
  selectedId,
  onSelectPlanet,
}: OrbitingPlanetProps) => {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * planet.speed * 0.22;
    const g = groupRef.current;
    if (!g) return;
    g.position.set(
      Math.cos(t) * planet.orbitRadius,
      0,
      Math.sin(t) * planet.orbitRadius,
    );
  });

  const selected = selectedId === planet.id;

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPlanet(planet.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[planet.radius, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={selected ? 0.35 : 0.08}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
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

export const SolarScene = ({
  selectedId,
  onSelectPlanet,
}: SolarSceneProps) => (
  <>
    <color attach="background" args={["#050508"]} />
    <ambientLight intensity={0.08} />
    <pointLight position={[0, 0, 0]} intensity={2.2} color="#fff5e0" />
    <Stars radius={120} depth={60} count={5000} factor={3} saturation={0} fade speed={0.5} />
    <Sun />
    {PLANETS.map((planet) => (
      <OrbitRing key={`ring-${planet.id}`} radius={planet.orbitRadius} />
    ))}
    {PLANETS.map((planet) => (
      <OrbitingPlanet
        key={planet.id}
        planet={planet}
        selectedId={selectedId}
        onSelectPlanet={onSelectPlanet}
      />
    ))}
    <OrbitControls
      enablePan
      minDistance={2}
      maxDistance={28}
      enableDamping
      dampingFactor={0.05}
    />
  </>
);
