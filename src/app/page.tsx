"use client";

import { useState } from "react";
import GatekeeperStage from "./_components/GatekeeperStage";
import CountdownStage from "./_components/CountdownStage";
import PartyStage from "./_components/PartyStage";

type Stage = "locked" | "countdown" | "birthday";

export default function Home() {
  const [stage, setStage] = useState<Stage>("locked");

  return (
    <main
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "#07070f" }}
    >
      {/* Decorative top line */}
      <div
        className="w-24 h-px mb-10"
        style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)" }}
      />

      {stage === "locked" && (
        <GatekeeperStage onUnlock={() => setStage("countdown")} />
      )}

      {stage === "countdown" && (
        <CountdownStage onBirthday={() => setStage("birthday")} />
      )}

      {stage === "birthday" && (
        <PartyStage />
      )}

      {/* Decorative bottom line */}
      <div
        className="w-24 h-px mt-10"
        style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)" }}
      />
    </main>
  );
}


