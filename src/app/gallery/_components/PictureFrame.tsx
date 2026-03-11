"use client";

import { Suspense } from "react";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  url: string;
  caption: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

function FrameImage({ url, caption }: { url: string; caption: string }) {
  const texture = useTexture(url);
  // @ts-ignore: colorSpace API varies between three.js versions
  if (texture && (texture as any).colorSpace !== undefined) (texture as any).colorSpace = (THREE as any).SRGBColorSpace;

  return (
    <>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[2.42, 1.78]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <Text
        position={[0, -1.3, 0.08]}
        fontSize={0.13}
        color="#c4b5fd"
        anchorX="center"
        anchorY="top"
        maxWidth={2.5}
        textAlign="center"
        lineHeight={1.4}
        letterSpacing={0.03}
      >
        {caption}
      </Text>
    </>
  );
}

function FramePlaceholder() {
  return (
    <mesh position={[0, 0, 0.08]}>
      <planeGeometry args={[2.42, 1.78]} />
      <meshStandardMaterial color="#1a0a2e" />
    </mesh>
  );
}

export default function PictureFrame({ url, caption, position, rotation }: Props) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outer frame — larger for visibility */}
      <mesh>
        <boxGeometry args={[2.7, 2.05, 0.14]} />
        <meshStandardMaterial color="#150a28" roughness={0.8} metalness={0.25} />
      </mesh>

      {/* Emissive inner border — stronger glow */}
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[2.54, 1.92, 0.01]} />
        <meshStandardMaterial color="#5b21b6" emissive="#7c3aed" emissiveIntensity={1.2} />
      </mesh>

      <Suspense fallback={<FramePlaceholder />}>
        <FrameImage url={url} caption={caption} />
      </Suspense>
    </group>
  );
}
