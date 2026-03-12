"use client";

import { Suspense, useEffect, useState } from "react";
import { useVideoTexture, Text } from "@react-three/drei";

interface VideoFrameProps {
  url: string;
  caption: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

function VideoMesh({
  url,
  caption,
  isPlaying,
  onToggle,
}: {
  url: string;
  caption: string;
  isPlaying: boolean;
  onToggle: () => void;
}) {
  const texture = useVideoTexture(url, { start: true, loop: true, muted: true });

  useEffect(() => {
    const video = texture.image as HTMLVideoElement;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, texture]);

  return (
    <>
      <mesh position={[0, 0, 0.08]} onClick={onToggle}>
        <planeGeometry args={[2.2, 1.65]} />
        <meshStandardMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Play/pause indicator */}
      {!isPlaying && (
        <mesh position={[0, 0, 0.15]} onClick={onToggle}>
          <circleGeometry args={[0.22, 32]} />
          <meshStandardMaterial
            color="#f9a8d4"
            emissive="#f9a8d4"
            emissiveIntensity={1.2}
            transparent
            opacity={0.75}
          />
        </mesh>
      )}

      <Text
        position={[0, -1.2, 0.08]}
        fontSize={0.12}
        color={isPlaying ? "#fce7f3" : "#f9a8d4"}
        anchorX="center"
        anchorY="top"
        maxWidth={2.4}
        textAlign="center"
        lineHeight={1.4}
        letterSpacing={0.02}
      >
        {caption}
      </Text>
    </>
  );
}

function FramePlaceholder() {
  return (
    <mesh position={[0, 0, 0.08]}>
      <planeGeometry args={[2.2, 1.65]} />
      <meshStandardMaterial color="#1a0a1e" />
    </mesh>
  );
}

export default function VideoFrame({ url, caption, position, rotation }: VideoFrameProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      {/* Outer frame */}
      <mesh>
        <boxGeometry args={[2.55, 1.95, 0.14]} />
        <meshStandardMaterial color="#150a1e" roughness={0.8} metalness={0.25} />
      </mesh>

      {/* Inner emissive border — front */}
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[2.36, 1.78, 0.01]} />
        <meshStandardMaterial
          color={isPlaying ? "#be185d" : "#831843"}
          emissive={isPlaying ? "#f472b6" : "#9d174d"}
          emissiveIntensity={isPlaying ? 2.0 : hovered ? 1.0 : 0.5}
        />
      </mesh>

      {/* Inner emissive border — back */}
      <mesh position={[0, 0, -0.016]}>
        <boxGeometry args={[2.36, 1.78, 0.01]} />
        <meshStandardMaterial
          color={isPlaying ? "#be185d" : "#831843"}
          emissive={isPlaying ? "#f472b6" : "#9d174d"}
          emissiveIntensity={isPlaying ? 2.0 : hovered ? 1.0 : 0.5}
        />
      </mesh>

      {/* Front face video */}
      <Suspense fallback={<FramePlaceholder />}>
        <VideoMesh
          url={url}
          caption={caption}
          isPlaying={isPlaying}
          onToggle={() => setIsPlaying((p) => !p)}
        />
      </Suspense>

      {/* Back face video — rotated 180° so it faces outward */}
      <group rotation={[0, Math.PI, 0]}>
        <Suspense fallback={<FramePlaceholder />}>
          <VideoMesh
            url={url}
            caption={caption}
            isPlaying={isPlaying}
            onToggle={() => setIsPlaying((p) => !p)}
          />
        </Suspense>
      </group>
    </group>
  );
}
