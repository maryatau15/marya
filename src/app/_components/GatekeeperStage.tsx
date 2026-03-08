"use client";

import { useState } from "react";

const QUESTION = process.env.NEXT_PUBLIC_GATEKEEPER_QUESTION ?? "When was our last meet?";
const CORRECT_DATE = process.env.NEXT_PUBLIC_GATEKEEPER_DATE ?? "";

interface Props {
  onUnlock: () => void;
}

export default function GatekeeperStage({ onUnlock }: Props) {
  const [selected, setSelected] = useState("");
  const [wrong, setWrong] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected === CORRECT_DATE) {
      onUnlock();
    } else {
      setWrong(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 px-6">
      {/* Question */}
      <p
        className="text-violet-300 text-center text-2xl sm:text-3xl leading-snug max-w-xs sm:max-w-sm"
        style={{ fontFamily: "var(--font-dancing)" }}
      >
        {QUESTION}
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={"flex flex-col items-center gap-4 w-full max-w-xs transition-transform " + (shake ? "animate-shake" : "")}
      >
        <input
          type="date"
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            setWrong(false);
          }}
          required
          className="w-full h-12 rounded-xl px-4 text-base text-purple-200 outline-none border border-purple-500/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 cursor-pointer transition-colors"
          style={{ background: "rgba(15, 12, 30, 0.85)", colorScheme: "dark" }}
        />

        {wrong && (
          <p className="text-red-400 text-sm text-center">
            That doesn&apos;t seem right&hellip;
          </p>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-xl font-semibold text-base tracking-wide transition-all text-white border border-purple-500/60 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95"
          style={{ background: "rgba(88, 28, 135, 0.5)" }}
        >
          Let Me In
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.45s ease-in-out; }
      `}</style>
    </div>
  );
}
