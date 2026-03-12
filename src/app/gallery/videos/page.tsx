"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const VideoGalleryScene = dynamic(() => import("./_components/VideoGalleryScene"), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-dvh flex items-center justify-center"
      style={{ background: "#0a070f" }}
    >
      <p
        className="text-pink-400 text-xl tracking-widest animate-pulse"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        Loading her cute videos…
      </p>
    </div>
  ),
});

export default function VideosGallery() {
  return (
    <div className="relative w-full h-dvh" style={{ background: "#0a070f" }}>
      <VideoGalleryScene />

      <Link
        href="/gallery"
        className="fixed top-4 left-4 z-10 px-4 py-2 rounded-full text-sm font-medium text-pink-300 border border-pink-500/40 backdrop-blur-sm hover:border-pink-400 hover:text-pink-200 transition-all active:scale-95"
        style={{ background: "rgba(20, 10, 25, 0.75)" }}
      >
        ← Gallery
      </Link>

      {/* Title overlay */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p
          className="text-pink-300 text-lg tracking-wide"
          style={{ fontFamily: "var(--font-dancing)", textShadow: "0 0 18px rgba(244,114,182,0.7)" }}
        >
          her cute videos ✨
        </p>
      </div>
    </div>
  );
}
