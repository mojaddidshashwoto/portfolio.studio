"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "hover" | "view">("default");
  const [cursorText, setCursorText] = useState<string>("");

  const springConfig = { damping: 30, stiffness: 400, mass: 0.4 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isTouchDevice = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || isCoarse || isTouchDevice || prefersReducedMotion) {
      document.body.classList.add("use-default-cursor");
      return;
    }

    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setDotPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const viewTarget = target.closest("[data-cursor='view'], [data-cursor-image]");
      const interactiveTarget = target.closest("a, button, [role='button'], input, textarea, select");

      if (viewTarget) {
        setCursorType("view");
        const text = viewTarget.getAttribute("data-cursor-text") || "VIEW";
        setCursorText(text);
      } else if (interactiveTarget) {
        setCursorType("hover");
        setCursorText("");
      } else {
        setCursorType("default");
        setCursorText("");
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, visible]);

  if (!mounted || !visible) return null;

  const isView = cursorType === "view";
  const isHover = cursorType === "hover";

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden" aria-hidden="true">
      {/* Outer Follower Circle */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isView ? 88 : isHover ? 44 : 28,
          height: isView ? 88 : isHover ? 44 : 28,
          backgroundColor: isView ? "rgba(198, 255, 61, 0.12)" : isHover ? "rgba(255, 255, 255, 0.08)" : "transparent",
          borderColor: isView ? "#c6ff3d" : isHover ? "#f2f2f2" : "rgba(242, 242, 242, 0.4)",
          borderWidth: "1px",
        }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
      >
        {isView && (
          <span className="text-[11px] font-mono tracking-[0.2em] font-medium text-[#c6ff3d] uppercase select-none">
            {cursorText || "VIEW"}
          </span>
        )}
      </motion.div>

      {/* Center Precision Dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#c6ff3d] pointer-events-none transition-opacity duration-150"
        style={{
          transform: `translate3d(${dotPos.x - 3}px, ${dotPos.y - 3}px, 0)`,
          opacity: isView ? 0 : 1,
        }}
      />
    </div>
  );
}
