"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import VideoFrame from "./VideoFrame";

// ── Video items — drop .mp4 files into /public and update urls here ──────────
const ITEMS = [
  { id: 1, url: "/videos/her-1.mp4", caption: "Being cute: a full-time job, clearly." },
  { id: 2, url: "/videos/her-2.mp4", caption: "Me trying to stay serious. I failed." },
  { id: 3, url: "/videos/her-3.mp4", caption: "Someone should study this level of adorable." },
  { id: 4, url: "/videos/her-4.mp4", caption: "No thoughts, just her. Same energy every day." },
  { id: 5, url: "/videos/her-5.mp4", caption: "This is why I can't focus on anything else." },
  { id: 6, url: "/videos/her-6.mp4", caption: "Certified menace to my heart. 10/10." },
];

const RING_RADIUS = 6;
const CY = 1.5;

const FRAMES = ITEMS.map((item, i) => {
  const count = ITEMS.length;
  const angle = (i / count) * Math.PI * 2;
  const x = Math.sin(angle) * RING_RADIUS;
  const z = Math.cos(angle) * RING_RADIUS;
  // Each frame faces the center
  const rotY = Math.atan2(x, z);
  const lightPos: [number, number, number] = [x * 0.5, CY + 1.2, z * 0.5];
  return {
    ...item,
    position: [x, CY, z] as [number, number, number],
    rotation: [0, rotY, 0] as [number, number, number],
    lightPos,
  };
});

// ── Auto-rotating ring ────────────────────────────────────────────────────────
function RotatingRing() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    groupRef.current.rotation.y += 0.0025;
  });

  return (
    <group ref={groupRef}>
      {FRAMES.map((f) => (
        <Suspense key={f.id} fallback={null}>
          <VideoFrame
            url={f.url}
            caption={f.caption}
            position={f.position}
            rotation={f.rotation}
          />
        </Suspense>
      ))}

      {/* Per-frame accent lights on the rotating group */}
      {FRAMES.map((f) => (
        <pointLight
          key={f.id}
          position={f.lightPos}
          intensity={3}
          color="#fda4af"
          distance={4.5}
          decay={2}
        />
      ))}
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
export default function VideoGalleryScene() {
  return (
    <Canvas
      camera={{ position: [0, 3.5, 9], fov: 55 }}
      style={{ background: "#0a070f", touchAction: "none" }}
    >
      {/* Night sky stars — slightly warmer tint */}
      <Stars radius={100} depth={60} count={4000} factor={3.5} fade speed={0.6} />

      {/* Soft rose ambient */}
      <ambientLight intensity={0.3} color="#9d174d" />

      {/* Key directional from above */}
      <directionalLight position={[0, 10, 8]} intensity={1.4} color="#fce7f3" />

      {/* Hemisphere: deep rose sky / near-black ground */}
      <hemisphereLight args={["#4c0519", "#0a070f", 0.45]} />

      {/* Rotating ring of video frames */}
      <RotatingRing />

      {/* Round platform floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <circleGeometry args={[9, 72]} />
        <meshStandardMaterial color="#0d0510" roughness={0.95} />
      </mesh>

      {/* Glowing ring edge — rose */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]}>
        <ringGeometry args={[8.6, 9, 72]} />
        <meshStandardMaterial
          color="#881337"
          emissive="#be123c"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Inner ring pulse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.27, 0]}>
        <ringGeometry args={[5.7, 6.2, 72]} />
        <meshStandardMaterial
          color="#9f1239"
          emissive="#fb7185"
          emissiveIntensity={0.25}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Center glow on floor */}
      <pointLight position={[0, 0.5, 0]} intensity={1.5} color="#f43f5e" distance={5} decay={2} />

      <OrbitControls
        target={[0, CY, 0]}
        enablePan={false}
        minDistance={4}
        maxDistance={14}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.06}
      />
    </Canvas>
  );
}
