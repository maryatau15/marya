"use client";

import { useEffect, useState } from "react";

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

interface Props {
  onBirthday: () => void;
}

export default function CountdownStage({ onBirthday }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // If already past target date on mount, fire immediately
    if (TARGET.getTime() <= Date.now()) {
      onBirthday();
      return;
    }

    setTimeLeft(getTimeLeft());

    const id = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        clearInterval(id);
        onBirthday();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [onBirthday]);

  const units = [
    { label: "Days",    value: timeLeft.days },
    { label: "Hours",   value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center w-full gap-8 px-6">
      {/* Sub-heading */}
      <p
        className="text-violet-300 text-xl sm:text-2xl text-center"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        Counting down to
      </p>
      <h1
        className="text-purple-200 text-4xl sm:text-5xl lg:text-6xl font-bold text-center -mt-4"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        A Birthday Worth the Wait
      </h1>

      {/* Timer cards — 2×2 on mobile, 1×4 on sm+ */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 w-full max-w-lg sm:max-w-none">
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-2xl aspect-square sm:aspect-auto sm:w-36 sm:h-40"
            style={{
              background: "rgba(15, 12, 30, 0.85)",
              border: "1px solid rgba(139, 92, 246, 0.4)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            <span
              className="text-cyan-300 font-mono text-5xl sm:text-6xl lg:text-7xl font-semibold leading-none tabular-nums"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {mounted ? pad(value) : "--"}
            </span>
            <span className="mt-2 sm:mt-3 text-purple-400 text-[10px] sm:text-xs tracking-widest uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
