"use client";

import { useEffect, useState } from "react";

const NAME = process.env.NEXT_PUBLIC_BIRTHDAY_NAME ?? "Someone Special";
const TARGET = new Date(process.env.NEXT_PUBLIC_BIRTHDAY_DATE ?? "2026-03-14T00:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());

    const id = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const isOver = mounted && TARGET.getTime() <= Date.now();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#07070f" }}
    >
      {/* Decorative top line */}
      <div className="w-24 h-px mb-8" style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)" }} />

      {/* Message */}
      <p
        className="text-violet-300 text-2xl mb-2 text-center"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        {isOver ? "Wishing you a wonderful" : "Counting down to"}
      </p>
      <h1
        className="text-purple-200 text-5xl sm:text-6xl font-bold text-center mb-12"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        A Birthday Worth the Wait
      </h1>

      {isOver ? (
        /* Birthday message */
        <div className="text-center">
          <p
            className="text-cyan-300 text-6xl sm:text-7xl font-bold mb-4"
            style={{ fontFamily: "var(--font-dancing)" }}
          >
            Happy Birthday! 🎂
          </p>
          <p className="text-purple-400 text-lg tracking-widest uppercase">
            Today is your day, {NAME}!
          </p>
        </div>
      ) : (
        /* Timer grid */
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center w-36 h-40 rounded-2xl"
              style={{
                background: "rgba(15, 12, 30, 0.85)",
                border: "1px solid rgba(139, 92, 246, 0.4)",
                animation: "pulse-glow 3s ease-in-out infinite",
              }}
            >
              <span
                className="text-cyan-300 font-mono text-6xl font-semibold leading-none tabular-nums"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {mounted ? pad(value) : "--"}
              </span>
              <span className="mt-3 text-purple-400 text-xs tracking-widest uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Decorative bottom line */}
      <div className="w-24 h-px mt-12" style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)" }} />
    </main>
  );
}

