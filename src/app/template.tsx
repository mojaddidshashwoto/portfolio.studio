"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full flex-grow flex flex-col">
      {/* Wipe Curtain: Acid Lime leading edge + Dark shutter */}
      <motion.div
        className="fixed inset-0 z-[9999] bg-[#c6ff3d] pointer-events-none origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="fixed inset-0 z-[9998] bg-[#0a0a0a] pointer-events-none origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Page Content Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        className="w-full flex-grow flex flex-col"
      >
        {children}
      </motion.div>
    </div>
  );
}
