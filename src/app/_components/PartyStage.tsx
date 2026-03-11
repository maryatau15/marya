"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

const NAME = process.env.NEXT_PUBLIC_BIRTHDAY_NAME ?? "Someone Special";

export default function PartyStage() {
  useEffect(() => {
    const end = Date.now() + 3000;

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#a78bfa", "#22d3ee", "#f0abfc", "#fde68a"],
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#a78bfa", "#22d3ee", "#f0abfc", "#fde68a"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 px-6 text-center">
      {/* Main message */}
      <h1
        className="text-cyan-300 text-5xl sm:text-7xl font-bold leading-tight"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        Happy Birthday,<br />{NAME}! 🎂
      </h1>

      <p
        className="text-purple-300 text-xl sm:text-2xl"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        Today, the world celebrates you.
      </p>

      {/* Glowing CTA button */}
      <Link
        href="/gallery"
        className="mt-4 inline-flex items-center justify-center w-full max-w-xs
          px-8 py-4 rounded-2xl text-lg sm:text-xl font-semibold text-white
          border border-purple-400/60 transition-all duration-300
          hover:border-cyan-400/70 active:scale-95"
        style={{
          background: "rgba(88, 28, 135, 0.45)",
          boxShadow: "0 0 24px rgba(139, 92, 246, 0.4), 0 0 60px rgba(34, 211, 238, 0.1)",
        }}
      >
        Open Your Gift ✨
      </Link>
    </div>
  );
}
