"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import PictureFrame from "./PictureFrame";

const ITEMS = [
  { id: 1, url: "/beauty.jpg",           caption: "Warning: dangerously cute. Proceed with heart." },
  { id: 2, url: "/her-1.jpg",            caption: "Not a celebrity but I can't stop staring." },
  { id: 3, url: "/her-cutie.jpg",        caption: "Cuteness level: illegal in 12 countries." },
  { id: 4, url: "/her-eyes.jpg",         caption: "Me: I'll just look for a second. Also me: *still looking*" },
  { id: 5, url: "/her-pout.jpg",         caption: "That pout? Unfair. Absolutely unfair." },
  { id: 6, url: "/her-thinking-me.jpg",  caption: "Thinking about me? Same. We're basically telepathic." },
  { id: 7, url: "/she-playing.jpg",      caption: "Having fun? Good. I'm still your favorite though." },
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

// ── Glowing orb in the center of the floor ──────────────────────────────────
function CuteOrb({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = 0.55 + Math.sin(t * 1.4) * 0.12;
    meshRef.current.rotation.y = t * 0.6;
    meshRef.current.rotation.z = t * 0.3;
  });

  return (
    <group position={[CX, 0, CZ + 2.2]}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.18 : 1}
      >
        <torusKnotGeometry args={[0.32, 0.1, 128, 20, 2, 3]} />
        <meshStandardMaterial
          color={hovered ? "#f472b6" : "#c084fc"}
          emissive={hovered ? "#f9a8d4" : "#a855f7"}
          emissiveIntensity={hovered ? 2.4 : 1.4}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>

      {/* Glow halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.55, 0]}>
        <ringGeometry args={[0.55, 0.65, 64]} />
        <meshStandardMaterial
          color={hovered ? "#f9a8d4" : "#7c3aed"}
          emissive={hovered ? "#f9a8d4" : "#7c3aed"}
          emissiveIntensity={hovered ? 1.8 : 0.7}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML label */}
      <Html center position={[0, -0.35, 0]} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "var(--font-dancing)",
            fontSize: "0.85rem",
            color: hovered ? "#fce7f3" : "#e9d5ff",
            textAlign: "center",
            whiteSpace: "nowrap",
            textShadow: "0 0 12px rgba(168,85,247,0.9)",
            transition: "color 0.2s",
            userSelect: "none",
          }}
        >
          ✨ Click for her cute videos! ✨
        </div>
      </Html>

      {/* Point light so the orb glows onto the floor */}
      <pointLight
        position={[0, 0.6, 0]}
        intensity={hovered ? 5 : 2.5}
        color={hovered ? "#f9a8d4" : "#c084fc"}
        distance={3}
        decay={2}
      />
    </group>
  );
}

export default function GalleryScene() {
  const router = useRouter();
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

      {/* Cute video gallery orb — center of floor */}
      <CuteOrb onClick={() => router.push("/gallery/videos")} />

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
