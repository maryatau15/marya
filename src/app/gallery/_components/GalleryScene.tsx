"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import PictureFrame from "./PictureFrame";

const ITEMS = [
  { id: 1, url: "https://picsum.photos/seed/mem1/800/600", caption: "A memory worth a thousand smiles" },
  { id: 2, url: "https://picsum.photos/seed/mem2/800/600", caption: "Every moment with you is golden" },
  { id: 3, url: "https://picsum.photos/seed/mem3/800/600", caption: "Time stops when I'm with you" },
  { id: 4, url: "https://picsum.photos/seed/mem4/800/600", caption: "Our story, written in laughter" },
  { id: 5, url: "https://picsum.photos/seed/mem5/800/600", caption: "The best chapter of my life" },
  { id: 6, url: "https://picsum.photos/seed/mem6/800/600", caption: "Forever and a day" },
];

// Semicircle geometry: camera is in front, frames arc away from it.
// Circle center at (CX, CY, CZ). Camera starts at (0, 3.5, 6.5).
const RADIUS = 5.5;
const CX = 0;
const CY = 1.5;
const CZ = -1;

const FRAMES = ITEMS.map((item, i) => {
  const count = ITEMS.length;
  // alpha: -PI/2 (hard left) → +PI/2 (hard right), spreading away from camera
  const alpha = -Math.PI / 2 + (i / (count - 1)) * Math.PI;
  const x = CX + Math.sin(alpha) * RADIUS;
  const y = CY;
  const z = CZ - Math.cos(alpha) * RADIUS;
  // face the circle center
  const rotY = Math.atan2(CX - x, CZ - z);
  // per-frame light: halfway between frame and center, above the frame
  const lightPos: [number, number, number] = [x * 0.45, y + 1.4, CZ + (z - CZ) * 0.45];
  return {
    ...item,
    position: [x, y, z] as [number, number, number],
    rotation: [0, rotY, 0] as [number, number, number],
    lightPos,
  };
});

export default function GalleryScene() {
  return (
    <Canvas camera={{ position: [0, 3.5, 6.5], fov: 55 }} style={{ background: "#07070f", touchAction: "none" }}>
      {/* Night sky stars */}
      <Stars radius={100} depth={60} count={4000} factor={3.5} fade speed={0.8} />

      {/* Soft purple ambient */}
      <ambientLight intensity={0.35} color="#6d28d9" />

      {/* Key directional light from camera position — illuminates all frame faces */}
      <directionalLight position={[0, 8, 10]} intensity={1.6} color="#ede9fe" />

      {/* Hemisphere: purple sky / dark ground */}
      <hemisphereLight args={["#3b0764", "#07070f", 0.5]} />

      {/* Per-frame accent lights — warm, close to each frame */}
      {FRAMES.map((f) => (
        <pointLight key={f.id} position={f.lightPos} intensity={3.5} color="#ddd6fe" distance={4.5} decay={2} />
      ))}

      {/* Round platform floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CX, -0.3, CZ]}>
        <circleGeometry args={[8.5, 64]} />
        <meshStandardMaterial color="#0c0a1a" roughness={0.95} />
      </mesh>

      {/* Glowing ring edge on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CX, -0.28, CZ]}>
        <ringGeometry args={[8.1, 8.5, 64]} />
        <meshStandardMaterial color="#4c1d95" emissive="#4c1d95" emissiveIntensity={0.4} />
      </mesh>

      {/* Picture frames */}
      {FRAMES.map((f) => (
        <Suspense key={f.id} fallback={null}>
          <PictureFrame url={f.url} caption={f.caption} position={f.position} rotation={f.rotation} />
        </Suspense>
      ))}

      <OrbitControls
        target={[CX, CY, CZ]}
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.06}
      />
    </Canvas>
  );
}
