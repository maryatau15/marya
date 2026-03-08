"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const GalleryScene = dynamic(() => import("./_components/GalleryScene"), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-[100dvh] flex items-center justify-center"
      style={{ background: "#07070f" }}
    >
      <p
        className="text-purple-400 text-xl tracking-widest animate-pulse"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        Opening your gallery...
      </p>
    </div>
  ),
});

export default function Gallery() {
  return (
    <div className="relative w-full h-[100dvh]" style={{ background: "#07070f" }}>
      <GalleryScene />

      <Link
        href="/"
        className="fixed top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-medium text-purple-300 border border-purple-500/40 backdrop-blur-sm hover:border-purple-400 hover:text-purple-200 transition-all active:scale-95"
        style={{ background: "rgba(15, 12, 30, 0.75)" }}
      >
        ← Back
      </Link>

      <p className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 text-purple-500/60 text-xs tracking-widest text-center pointer-events-none">
        Drag to look around · Pinch to zoom
      </p>
    </div>
  );
}
