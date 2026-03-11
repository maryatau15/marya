"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NotificationPopup() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4"
        >
          <div
            onClick={() => router.push('/message')}
            className="cursor-pointer flex items-start gap-4 p-4 rounded-2xl border border-purple-500/40 bg-[rgba(15,12,30,0.85)] text-left"
            style={{ boxShadow: '0 6px 30px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.12)' }}
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-purple-700 to-cyan-500 text-white">
                🔔
              </div>
            </div>

            <div className="flex-1">
              <div className="text-sm text-purple-200 font-semibold" style={{ fontFamily: 'var(--font-dancing)' }}>
                Notification
              </div>
              <div className="text-xs text-purple-400/80 mt-1">
                Tap to read your message…
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
              }}
              aria-label="Dismiss"
              className="ml-4 text-purple-300/80 hover:text-purple-200"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
