"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { photos } from "@/lib/photos";

interface StackPrint {
  id: string;
  file: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  type: string;
}

const STACK_PRINTS: StackPrint[] = [
  {
    id: "architectural-window-portrait",
    file: "/photos/architectural-window-portrait.webp",
    alt: "Profile portrait framed against a tall architectural window in natural backlight",
    width: 1805,
    height: 2400,
    blurDataURL: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoMABAABUB8JZwC7ADdHA7pfeoAAP7loNCm5QQ9A+u6EdH3EWribiQlqtUp6hnmsAsvpIAA",
    type: "Portrait",
  },
  {
    id: "peace-sign-shadow-sand",
    file: "/photos/peace-sign-shadow-sand.webp",
    alt: "High-contrast shadow of the photographer casting a peace sign on sand",
    width: 1805,
    height: 2400,
    blurDataURL: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoMABAABUB8JZQAAud+9cE8AwAA/uqK7mcpzWP2bzz1t5F+Efbu+oBzcRNJYzpyPjgB5CmAAAA=",
    type: "Street",
  },
  {
    id: "concrete-window-grille-portrait",
    file: "/photos/concrete-window-grille-portrait.webp",
    alt: "Profile portrait looking through an iron window grille against textured concrete wall",
    width: 1800,
    height: 2400,
    blurDataURL: "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoMABAABUB8JaQAAly1ZwADogAA/b6S7VNoCgeBW4ZxZvncvGO+WGb/mIY9odvGUAAAAA==",
    type: "Portrait",
  },
];

const emptySubscribe = () => () => {};

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  // Intro animation state: runs once per session (< 1.5s), skipped on repeat visits
  const isFirstVisit = useSyncExternalStore(
    emptySubscribe,
    () => {
      try {
        return !sessionStorage.getItem("hero_intro_seen");
      } catch {
        return false;
      }
    },
    () => false
  );

  useEffect(() => {
    try {
      sessionStorage.setItem("hero_intro_seen", "true");
    } catch {
      // Ignore if sessionStorage is disabled
    }
  }, []);

  // Stack shuffle state
  const [order, setOrder] = useState<number[]>([0, 1, 2]);
  const [slidingCard, setSlidingCard] = useState<number | null>(null);

  const handleShuffle = useCallback(() => {
    if (slidingCard !== null) return;
    const currentTop = order[0];
    setSlidingCard(currentTop);

    setTimeout(() => {
      setOrder(([top, ...rest]) => [...rest, top]);
      setSlidingCard(null);
    }, 190);
  }, [order, slidingCard]);

  // Desktop focus ring following cursor within the stack area
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  // Subtle parallax between name and stack on scroll (disabled on reduced motion)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const nameParallaxY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -25]);
  const stackParallaxY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 20]);

  // Strip thumbnails from catalog (first 10, duplicated for continuous drift)
  const driftPhotos = photos.slice(0, 10);

  // Timing configuration for intro under 1.5s
  const shouldAnimateIntro = isFirstVisit && !reducedMotion;

  const line1Letters = "MOJADDID".split("");
  const line2Letters = "SHASHWOTO".split("");

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-[#0a0a0a] border-b border-white/10 flex flex-col justify-between pt-20 sm:pt-24 pb-4 px-4 sm:px-6 md:px-12 overflow-hidden select-none"
    >
      {/* Intro Lime Accent Line (draws across in ~0.35s, under 1.5s total intro) */}
      <motion.div
        initial={shouldAnimateIntro ? { scaleX: 0 } : { scaleX: 1 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-[#c6ff3d] origin-left z-30"
      />

      {/* Top Editorial Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-400 z-10 shrink-0">
        <div className="flex items-center gap-2 text-[#c6ff3d]">
          <span className="w-1.5 h-1.5 bg-[#c6ff3d] shrink-0" />
          <span className="font-semibold">PHOTOGRAPHER / DHAKA</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-neutral-500">
          <span>MOJADDID SHASHWOTO</span>
          <span className="text-white/20">|</span>
          <span>STILL ARCHIVE 2026</span>
        </div>
      </div>

      {/* Central Content Area */}
      <div className="max-w-7xl mx-auto w-full my-auto py-2 sm:py-4 z-10">
        {/* ======================================================== */}
        {/* MOBILE LAYOUT (< 1024px): Stack on right, Name overlaps left edge */}
        {/* ======================================================== */}
        <div className="lg:hidden relative w-full flex flex-col justify-center">
          <div className="relative w-full flex items-center justify-between">
            {/* Left: Name overlapping stack's left edge by ~15% (never covering face) */}
            <motion.div
              style={{ y: nameParallaxY }}
              className="z-20 relative -mr-[18%] sm:-mr-[15%] max-w-[68vw] pointer-events-none"
            >
              <div className="font-mono text-[10px] text-[#c6ff3d] uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 bg-[#c6ff3d] shrink-0" />
                <span>PHOTOGRAPHER / DHAKA</span>
              </div>

              {/* Real H1: MOJADDID solid off-white, SHASHWOTO 2px lime stroke outline text */}
              <h1 className="font-display font-black uppercase tracking-tight leading-[0.88] text-[clamp(2.35rem,11.2vw,4.5rem)]">
                <span className="block text-[#f2f2f2] overflow-hidden">
                  {shouldAnimateIntro ? (
                    line1Letters.map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.15 + i * 0.02,
                          ease: "easeOut",
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))
                  ) : (
                    "MOJADDID"
                  )}
                </span>
                <span
                  className="block overflow-hidden"
                  style={{
                    WebkitTextStroke: "2px #c6ff3d",
                    color: "transparent",
                  }}
                >
                  {shouldAnimateIntro ? (
                    line2Letters.map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.28 + i * 0.02,
                          ease: "easeOut",
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))
                  ) : (
                    "SHASHWOTO"
                  )}
                </span>
              </h1>
            </motion.div>

            {/* Right: Interactive 3-print stack with viewfinder corner brackets */}
            <motion.div
              style={{ y: stackParallaxY }}
              className="z-10 shrink-0 w-[58vw] max-w-[240px] sm:max-w-[290px] aspect-[4/5] mr-1 sm:mr-4 relative"
            >
              {/* Lime Viewfinder Corner Brackets */}
              <div className="pointer-events-none absolute -inset-2.5 sm:-inset-3 z-30" aria-hidden="true">
                <svg className="absolute top-0 left-0 w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M1 19V1H19" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M19 19V1H1" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M1 1V19H19" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M19 1V19H1" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </div>

              {/* Tap to shuffle stack container */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Photo print stack. Tap to shuffle prints."
                onClick={handleShuffle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleShuffle();
                  }
                }}
                className="relative w-full h-full cursor-pointer focus:outline-none"
              >
                {order.map((cardIndex, posIndex) => {
                  const item = STACK_PRINTS[cardIndex];
                  const isTop = posIndex === 0;
                  const isSliding = slidingCard === cardIndex;

                  // Target rotation & offset:
                  // Pos 0 (top): 0°
                  // Pos 1 (middle): -6°
                  // Pos 2 (bottom): +5°
                  const baseRotate = posIndex === 0 ? 0 : posIndex === 1 ? -6 : 5;
                  const baseScale = posIndex === 0 ? 1 : posIndex === 1 ? 0.96 : 0.92;
                  const baseX = posIndex === 0 ? 0 : posIndex === 1 ? -6 : 6;
                  const baseY = posIndex === 0 ? 0 : posIndex === 1 ? 4 : 8;
                  const zIndex = isTop ? 10 : posIndex === 1 ? 5 : 2;

                  return (
                    <motion.div
                      key={item.id}
                      initial={
                        shouldAnimateIntro
                          ? { opacity: 0, y: 35, rotate: 0 }
                          : false
                      }
                      animate={{
                        opacity: 1,
                        x: isSliding ? 48 : baseX,
                        y: isSliding ? -18 : baseY,
                        rotate: isSliding ? 10 : baseRotate,
                        scale: baseScale,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 24,
                        delay: shouldAnimateIntro ? 0.5 + posIndex * 0.1 : 0,
                      }}
                      style={{ zIndex }}
                      className="absolute inset-0 bg-white p-1 sm:p-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.85)] rounded-[1px] overflow-hidden"
                    >
                      <div className="relative w-full h-full bg-[#111] overflow-hidden aspect-[4/5]">
                        <Image
                          src={item.file}
                          alt={item.alt}
                          width={item.width}
                          height={item.height}
                          priority={isTop}
                          placeholder={item.blurDataURL ? "blur" : "empty"}
                          blurDataURL={item.blurDataURL}
                          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 290px, 400px"
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Thumb-sized Action Buttons (min 44px tap targets) */}
          <div className="flex items-center gap-3 pt-5 z-20">
            <Link
              href="/#featured"
              className="min-h-[46px] px-5 py-3 bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#b5f524] transition-colors flex items-center justify-center shrink-0"
              data-cursor="hover"
            >
              Selected Work
            </Link>
            <Link
              href="/gallery"
              className="min-h-[46px] px-5 py-3 border border-white/20 text-[#f2f2f2] font-mono font-semibold text-xs uppercase tracking-wider hover:border-[#c6ff3d] hover:text-[#c6ff3d] transition-colors flex items-center justify-center shrink-0"
              data-cursor="hover"
            >
              Archive
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP LAYOUT (lg & up): Split Screen (Name Left, Stack Right) */}
        {/* ======================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-14 items-center">
          {/* Left Column: Name, Description & Buttons */}
          <motion.div
            style={{ y: nameParallaxY }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6 xl:space-y-8 pl-4 xl:pl-8"
          >
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
                <span>PHOTOGRAPHER / DHAKA</span>
              </div>

              {/* Name: "MOJADDID" in solid off-white, "SHASHWOTO" as outline text with 2px lime stroke */}
              <div role="heading" aria-level={1} className="font-display font-black uppercase tracking-tight leading-[0.88] select-none text-[clamp(3.8rem,6.8vw,7.6rem)]">
                <span className="block text-[#f2f2f2] overflow-hidden">
                  {shouldAnimateIntro ? (
                    line1Letters.map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.12 + i * 0.02,
                          ease: "easeOut",
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))
                  ) : (
                    "MOJADDID"
                  )}
                </span>
                <span
                  className="block overflow-hidden pb-1"
                  style={{
                    WebkitTextStroke: "2px #c6ff3d",
                    color: "transparent",
                  }}
                >
                  {shouldAnimateIntro ? (
                    line2Letters.map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.26 + i * 0.02,
                          ease: "easeOut",
                        }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))
                  ) : (
                    "SHASHWOTO"
                  )}
                </span>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/#featured"
                className="min-h-[48px] px-6 py-3 bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#b5f524] transition-colors flex items-center justify-center shrink-0"
                data-cursor="hover"
              >
                Selected Work
              </Link>
              <Link
                href="/gallery"
                className="min-h-[48px] px-6 py-3 border border-white/20 text-[#f2f2f2] font-mono font-semibold text-xs uppercase tracking-wider hover:border-[#c6ff3d] hover:text-[#c6ff3d] transition-colors flex items-center justify-center shrink-0"
                data-cursor="hover"
              >
                Archive
              </Link>
              <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest pl-2">
                {"//"} CLICK STACK TO SHUFFLE
              </span>
            </div>
          </motion.div>

          {/* Right Column: Larger Interactive 3-Print Stack */}
          <motion.div
            style={{ y: stackParallaxY }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <div
              className="relative w-[310px] xl:w-[360px] 2xl:w-[400px] aspect-[4/5]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Lime Viewfinder Corner Brackets */}
              <div className="pointer-events-none absolute -inset-4 xl:-inset-5 z-30" aria-hidden="true">
                <svg className="absolute top-0 left-0 w-5 h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M1 23V1H23" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute top-0 right-0 w-5 h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M23 23V1H1" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-5 h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M1 1V23H23" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-5 h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M23 1V23H1" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </div>

              {/* Desktop Cursor Focus Ring */}
              {mousePos && (
                <div
                  className="hidden lg:block absolute pointer-events-none z-40 transition-transform duration-75 ease-out"
                  style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-hidden="true"
                >
                  <div className="w-8 h-8 rounded-full border border-[#c6ff3d] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#c6ff3d]" />
                  </div>
                </div>
              )}

              {/* Print Stack Card Deck */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Photo print stack. Click or press Enter to shuffle photos."
                onClick={handleShuffle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleShuffle();
                  }
                }}
                className="relative w-full h-full cursor-pointer focus:outline-none"
              >
                {order.map((cardIndex, posIndex) => {
                  const item = STACK_PRINTS[cardIndex];
                  const isTop = posIndex === 0;
                  const isSliding = slidingCard === cardIndex;

                  const baseRotate = posIndex === 0 ? 0 : posIndex === 1 ? -6 : 5;
                  const baseScale = posIndex === 0 ? 1 : posIndex === 1 ? 0.96 : 0.92;
                  const baseX = posIndex === 0 ? 0 : posIndex === 1 ? -8 : 8;
                  const baseY = posIndex === 0 ? 0 : posIndex === 1 ? 6 : 12;
                  const zIndex = isTop ? 10 : posIndex === 1 ? 5 : 2;

                  return (
                    <motion.div
                      key={item.id}
                      initial={
                        shouldAnimateIntro
                          ? { opacity: 0, y: 40, rotate: 0 }
                          : false
                      }
                      animate={{
                        opacity: 1,
                        x: isSliding ? 70 : baseX,
                        y: isSliding ? -24 : baseY,
                        rotate: isSliding ? 12 : baseRotate,
                        scale: baseScale,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 24,
                        delay: shouldAnimateIntro ? 0.5 + posIndex * 0.1 : 0,
                      }}
                      style={{ zIndex }}
                      className="absolute inset-0 bg-white p-1.5 shadow-[0_18px_36px_rgba(0,0,0,0.85)] rounded-[2px] overflow-hidden"
                    >
                      <div className="relative w-full h-full bg-[#111] overflow-hidden aspect-[4/5]">
                        <Image
                          src={item.file}
                          alt={item.alt}
                          width={item.width}
                          height={item.height}
                          priority={isTop}
                          placeholder={item.blurDataURL ? "blur" : "empty"}
                          blurDataURL={item.blurDataURL}
                          sizes="(max-width: 1280px) 360px, 400px"
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SLOW HORIZONTAL THUMBNAIL DRIFT STRIP (under hero) */}
      {/* ======================================================== */}
      <div className="w-full pt-2 border-t border-white/10 overflow-hidden shrink-0 z-10">
        <div className="hero-drift-track py-1 items-center gap-3">
          {[...driftPhotos, ...driftPhotos].map((photo, idx) => (
            <Link
              key={`${photo.id}-${idx}`}
              href="/gallery"
              data-cursor="hover"
              className="shrink-0 h-10 sm:h-12 w-auto aspect-[4/5] border border-white/15 bg-white p-0.5 shadow-md hover:border-[#c6ff3d] transition-colors"
            >
              <div className="relative w-full h-full overflow-hidden bg-[#111]">
                <Image
                  src={photo.file || photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="60px"
                  placeholder={photo.blurDataURL ? "blur" : "empty"}
                  blurDataURL={photo.blurDataURL}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
