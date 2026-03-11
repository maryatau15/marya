"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const Y_COUNT = 14;

const PHRASES = [
  { word: "Notification",    topic: "favorite" },
  { word: "Person",          topic: "favorite" },
  { word: "reason to smile", topic: "favorite" },
  { word: "part of my life", topic: "favorite" },
] as const;

export default function MessagePage() {
  // Raw scroll pixels — cleans up anchor fade without caring about page height
  const { scrollY } = useScroll();
  const anchorOpacity = useTransform(scrollY, [0, 340], [1, 0]);
  const anchorY       = useTransform(scrollY, [0, 340], [0, -50]);

  return (
    // No fixed height — document grows naturally with content
    <div style={{ background: "#07070f" }}>

      {/* ── Section A: Sticky anchor ──────────────────────────────────────────
          Stays pinned to top as user scrolls, visually fades out after ~340px  */}
      <section className="sticky top-0 h-[100dvh] flex items-center justify-center z-10 pointer-events-none">
        <motion.div
          style={{ opacity: anchorOpacity, y: anchorY }}
          className="flex flex-col items-center gap-6 text-center px-6"
        >
          <div
            className="w-20 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)" }}
          />
          <h1
            className="text-6xl sm:text-8xl font-bold text-purple-200 leading-none"
            style={{ fontFamily: "var(--font-dancing)" }}
          >
            You are
          </h1>
          <div
            className="w-20 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)" }}
          />
          <p className="text-purple-500/70 text-[10px] tracking-[0.35em] uppercase">
            scroll to discover
          </p>
        </motion.div>
      </section>

      {/* ── Scrollable content — each item reveals individually via whileInView ── */}
      <div className="flex flex-col items-center" style={{ paddingTop: "28vh", paddingBottom: "22vh" }}>

        {/* ── Section B: Y's one by one ───────────────────────────────────────── */}
        {Array.from({ length: Y_COUNT }).map((_, i) => (
          <div
            key={i}
            style={{ transform: `translateX(${i % 2 === 0 ? -10 : 10}px)`, marginBottom: "13vh" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {i === 0 && (
                <span
                  className="text-[40px]  uppercase text-purple-500/70 mb-10 tracking-[0.3em] ml-6"
                  style={{ fontFamily: "var(--font-dancing)" }}
                >
                  My
                </span>
              )}
              <span
                className="text-6xl sm:text-7xl"
                style={{ fontFamily: "var(--font-dancing)", color: "#a78bfa", lineHeight: 1 }}
              >
                Y
              </span>
            </motion.div>
          </div>
        ))}

        {/* Hairline separator between Y's and phrases */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-28 h-px mb-[15vh]"
          style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)" }}
        />

        {/* ── Section C: Phrase reveals one by one ────────────────────────────── */}
        {PHRASES.map((phrase) => (
          <motion.div
            key={phrase.word}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="text-center w-full max-w-lg px-6 mb-[16vh]"
          >
            <div
              className="w-10 h-px mx-auto mb-5"
              style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)" }}
            />
            <p className="text-[10px] sm:text-xs tracking-[0.45em] uppercase text-purple-500/80 mb-3">
              {phrase.topic}
            </p>
            <h2
              className="text-5xl sm:text-7xl font-bold leading-tight"
              style={{
                fontFamily: "var(--font-dancing)",
                background: "linear-gradient(135deg, #e9d5ff 0%, #a78bfa 60%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {phrase.word}
            </h2>
          </motion.div>
        ))}

        {/* ── Section D: CTA ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-5 px-6 text-center mt-[4vh]"
        >
          <p className="text-purple-400/60 text-[10px] tracking-[0.4em] uppercase">
            and so much more
          </p>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 18px rgba(139,92,246,0.25)",
                "0 0 38px rgba(139,92,246,0.55)",
                "0 0 18px rgba(139,92,246,0.25)",
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl"
          >
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl text-xl font-semibold text-white border border-purple-400/60 transition-all active:scale-95"
              style={{ background: "rgba(88, 28, 135, 0.45)" }}
            >
              Let me show you ✨
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
