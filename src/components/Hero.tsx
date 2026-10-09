"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getHeroPhoto } from "@/lib/photos";

export default function Hero() {
  const heroPhoto = getHeroPhoto();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -35]);

  const nameLine1 = "MOJADDID";
  const nameLine2 = "SHASHWOTO";

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100dvh] h-auto lg:h-[100dvh] bg-[#0a0a0a] border-b border-white/10 flex flex-col justify-between pt-20 sm:pt-24 pb-6 px-4 sm:px-6 md:px-12 overflow-hidden"
    >
      {/* 1px Grid Line System Overlay */}
      <div
        className="pointer-events-none absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 divide-x divide-white/[0.04]"
        aria-hidden="true"
      >
        <div />
        <div />
        <div />
        <div />
        <div className="hidden sm:block" />
        <div className="hidden sm:block" />
        <div className="hidden lg:block" />
        <div className="hidden lg:block" />
        <div className="hidden lg:block" />
        <div className="hidden lg:block" />
        <div className="hidden lg:block" />
        <div className="hidden lg:block" />
      </div>

      {/* Vertical Mono Text Line Down Left Edge (Desktop & Tablet) */}
      <div
        className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase select-none z-10"
        aria-hidden="true"
      >
        <span className="w-1.5 h-1.5 bg-[#c6ff3d] shrink-0" />
        <span>MOJADDID SHASHWOTO</span>
        <span className="w-8 h-px bg-white/20" />
        <span>ARCHIVE 2026 // DHAKA</span>
      </div>

      {/* Top Editorial Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-neutral-400 z-10">
        <div className="flex items-center gap-2 text-[#c6ff3d]">
          <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
          <span className="font-semibold">PHOTOGRAPHER / DHAKA</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-neutral-400">
          <span>PORTFOLIO 2026</span>
          <span className="text-white/20">|</span>
          <span>STILL ARCHIVE</span>
        </div>
      </div>

      {/* Central Content Container */}
      <div className="max-w-7xl mx-auto w-full my-auto py-4 sm:py-6 z-10">
        {/* DESKTOP LAYOUT (lg & up): Split Screen */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 xl:gap-16 items-center">
          {/* Left Column: Name & Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pl-8 xl:pl-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
                <span>INDEPENDENT PHOTOGRAPHER</span>
              </div>

              {/* Name with Letter-by-Letter Reveal */}
              <h1 className="font-display font-black uppercase tracking-tight text-[#f2f2f2] leading-[0.88] select-none text-6xl xl:text-7xl 2xl:text-8xl">
                <span className="block overflow-hidden pb-1">
                  {nameLine1.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={reducedMotion ? false : { opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.05 + i * 0.025,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                <span className="block overflow-hidden pt-1">
                  {nameLine2.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={reducedMotion ? false : { opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.18 + i * 0.025,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block text-[#f2f2f2]"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </h1>

              <p className="mt-6 text-base text-neutral-300 font-light leading-relaxed max-w-lg">
                Documenting urban architecture, street perspectives, and quiet portraits.
                Treating light, geometry, and negative space with deliberate restraint.
              </p>
            </div>

            {/* Thumb-sized Action Buttons */}
            <div className="flex items-center gap-5 pt-4 font-mono text-xs">
              <Link
                href="#featured"
                className="min-h-[48px] px-6 py-3 bg-[#c6ff3d] text-[#0a0a0a] font-bold uppercase tracking-wider hover:bg-[#b5f524] transition-colors flex items-center justify-center"
                data-cursor="hover"
              >
                Selected Work ↓
              </Link>
              <Link
                href="/gallery"
                className="min-h-[48px] px-6 py-3 border border-white/20 text-[#f2f2f2] uppercase tracking-wider hover:border-[#c6ff3d] hover:text-[#c6ff3d] transition-colors flex items-center justify-center"
                data-cursor="hover"
              >
                Archive →
              </Link>
            </div>
          </div>

          {/* Right Column: Tall Portrait Frame with Viewfinder Details */}
          <div className="lg:col-span-5 flex justify-end">
            <motion.div
              style={reducedMotion ? {} : { y: parallaxY }}
              className="relative w-full max-w-[390px] xl:max-w-[430px]"
            >
              {/* Thin lime outline offset behind the portrait on desktop */}
              <div
                className="absolute -bottom-4 -right-4 w-full h-full border border-[#c6ff3d]/40 pointer-events-none z-0"
                aria-hidden="true"
              />

              {/* Portrait Frame Container */}
              <div className="relative z-10 w-full aspect-[1805/2400] bg-[#0a0a0a] border border-white/15 overflow-visible">
                {/* Viewfinder Corner Brackets */}
                <div
                  className="absolute -inset-2.5 pointer-events-none z-20"
                  aria-hidden="true"
                >
                  {/* Top Left */}
                  <svg className="absolute top-0 left-0 w-4 h-4" viewBox="0 0 16 16">
                    <path
                      d="M 0 14 L 0 0 L 14 0"
                      stroke="#c6ff3d"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  {/* Top Right */}
                  <svg className="absolute top-0 right-0 w-4 h-4" viewBox="0 0 16 16">
                    <path
                      d="M 2 0 L 16 0 L 16 14"
                      stroke="#c6ff3d"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  {/* Bottom Left */}
                  <svg className="absolute bottom-0 left-0 w-4 h-4" viewBox="0 0 16 16">
                    <path
                      d="M 0 2 L 0 16 L 14 16"
                      stroke="#c6ff3d"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  {/* Bottom Right */}
                  <svg className="absolute bottom-0 right-0 w-4 h-4" viewBox="0 0 16 16">
                    <path
                      d="M 2 16 L 16 16 L 16 2"
                      stroke="#c6ff3d"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Focus Ring (pulses once on load near focal center) */}
                <motion.div
                  initial={reducedMotion ? false : { scale: 1.6, opacity: 0 }}
                  animate={{
                    scale: [1.6, 1, 1.2, 1],
                    opacity: [0, 0.9, 0.6, 0.3],
                  }}
                  transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
                  className="absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center w-8 h-8 rounded-full border border-[#c6ff3d]"
                  aria-hidden="true"
                >
                  <div className="w-1 h-1 rounded-full bg-[#c6ff3d]" />
                </motion.div>

                {/* Soft Clip-path Reveal: Frame opens upward */}
                <motion.div
                  initial={
                    reducedMotion
                      ? false
                      : { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }
                  }
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full h-full overflow-hidden bg-[#0a0a0a]"
                >
                  <Image
                    src={heroPhoto.file || "/photos/architectural-window-portrait.webp"}
                    alt={heroPhoto.alt}
                    width={heroPhoto.width || 1805}
                    height={heroPhoto.height || 2400}
                    priority
                    placeholder={heroPhoto.blurDataURL ? "blur" : "empty"}
                    blurDataURL={heroPhoto.blurDataURL}
                    sizes="(max-width: 1024px) 70vw, 420px"
                    className="w-full h-full object-cover object-[center_38%]"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* MOBILE & TABLET LAYOUT (< lg): Stacked Portrait + Overlapping Name */}
        <div className="lg:hidden flex flex-col justify-center w-full">
          {/* Main Visual Unit: Tall Portrait on right + Name overlapping left edge */}
          <div className="relative w-full max-w-md mx-auto pt-2 pb-4">
            {/* The 4:5 Portrait Frame filling ~70% screen width, offset to the right */}
            <div className="relative w-[70%] sm:w-[65%] ml-auto aspect-[1805/2400] z-0">
              {/* Viewfinder Corner Brackets */}
              <div
                className="absolute -inset-2 pointer-events-none z-20"
                aria-hidden="true"
              >
                {/* Top Left */}
                <svg className="absolute top-0 left-0 w-3.5 h-3.5" viewBox="0 0 14 14">
                  <path
                    d="M 0 12 L 0 0 L 12 0"
                    stroke="#c6ff3d"
                    strokeWidth="1.75"
                    fill="none"
                  />
                </svg>
                {/* Top Right */}
                <svg className="absolute top-0 right-0 w-3.5 h-3.5" viewBox="0 0 14 14">
                  <path
                    d="M 2 0 L 14 0 L 14 12"
                    stroke="#c6ff3d"
                    strokeWidth="1.75"
                    fill="none"
                  />
                </svg>
                {/* Bottom Left */}
                <svg className="absolute bottom-0 left-0 w-3.5 h-3.5" viewBox="0 0 14 14">
                  <path
                    d="M 0 2 L 0 14 L 12 14"
                    stroke="#c6ff3d"
                    strokeWidth="1.75"
                    fill="none"
                  />
                </svg>
                {/* Bottom Right */}
                <svg className="absolute bottom-0 right-0 w-3.5 h-3.5" viewBox="0 0 14 14">
                  <path
                    d="M 2 14 L 14 14 L 14 2"
                    stroke="#c6ff3d"
                    strokeWidth="1.75"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Pulsing Focus Ring */}
              <motion.div
                initial={reducedMotion ? false : { scale: 1.6, opacity: 0 }}
                animate={{
                  scale: [1.6, 1, 1.2, 1],
                  opacity: [0, 0.9, 0.6, 0.3],
                }}
                transition={{ duration: 0.9, delay: 0.65, ease: "easeOut" }}
                className="absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center w-7 h-7 rounded-full border border-[#c6ff3d]"
                aria-hidden="true"
              >
                <div className="w-1 h-1 rounded-full bg-[#c6ff3d]" />
              </motion.div>

              {/* Soft Clip-path Reveal: Frame opens upward */}
              <motion.div
                initial={
                  reducedMotion
                    ? false
                    : { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }
                }
                animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full h-full border border-white/15 overflow-hidden bg-[#0a0a0a]"
              >
                <Image
                  src={heroPhoto.file || "/photos/architectural-window-portrait.webp"}
                  alt={heroPhoto.alt}
                  width={heroPhoto.width || 1805}
                  height={heroPhoto.height || 2400}
                  priority
                  placeholder={heroPhoto.blurDataURL ? "blur" : "empty"}
                  blurDataURL={heroPhoto.blurDataURL}
                  sizes="70vw"
                  className="w-full h-full object-cover object-[center_38%]"
                />
              </motion.div>
            </div>

            {/* Name Overlapping Edge of Photo Frame (~15%), sitting mostly on dark bg */}
            {/* Positioned at bottom-left of the visual area so it never covers the face */}
            <div className="absolute left-0 bottom-4 sm:bottom-6 z-20 max-w-[85%] pointer-events-auto">
              <h1
                className="font-display font-black uppercase tracking-tight text-[#f2f2f2] leading-[0.88] select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                style={{
                  fontSize: "clamp(1.9rem, 7.8vw, 3.8rem)",
                }}
              >
                <span className="block overflow-hidden pb-0.5">
                  {nameLine1.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={reducedMotion ? false : { opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.05 + i * 0.025,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                <span className="block overflow-hidden pt-0.5 text-[#f2f2f2]">
                  {nameLine2.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={reducedMotion ? false : { opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.18 + i * 0.025,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </h1>
            </div>
          </div>

          {/* Mobile Buttons (Thumb-sized: at least 44px tap target) */}
          <div className="mt-4 flex items-center gap-3 w-full max-w-md mx-auto font-mono text-xs">
            <Link
              href="#featured"
              className="flex-1 min-h-[46px] px-4 py-3 bg-[#c6ff3d] text-[#0a0a0a] font-bold uppercase tracking-wider text-center flex items-center justify-center"
              data-cursor="hover"
            >
              Selected Work ↓
            </Link>
            <Link
              href="/gallery"
              className="flex-1 min-h-[46px] px-4 py-3 border border-white/20 text-[#f2f2f2] uppercase tracking-wider text-center flex items-center justify-center hover:border-[#c6ff3d] hover:text-[#c6ff3d] transition-colors"
              data-cursor="hover"
            >
              Archive →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Bar with Scroll Cue */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between font-mono text-[10px] text-neutral-400 uppercase tracking-widest z-10 pt-2 border-t border-white/5">
        <div className="hidden sm:block">
          <span>PORTFOLIO // DHAKA</span>
        </div>

        {/* Clear Scroll Cue */}
        <div className="mx-auto sm:mx-0 flex items-center gap-2 text-neutral-300">
          <span>SCROLL</span>
          <motion.span
            animate={reducedMotion ? {} : { y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-[#c6ff3d] font-bold text-xs"
          >
            ↓
          </motion.span>
        </div>

        <div className="hidden sm:block">
          <span>2026</span>
        </div>
      </div>
    </section>
  );
}
