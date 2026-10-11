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
    alt: "Mojaddid Shashwoto in profile against a tall architectural window in natural light",
    width: 1805,
    height: 2400,
    blurDataURL: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoMABAABUB8JZwC7ADdHA7pfeoAAP7loNCm5QQ9A+u6EdH3EWribiQlqtUp6hnmsAsvpIAA",
    type: "Portrait",
  },
  {
    id: "peace-sign-shadow-sand",
    file: "/photos/peace-sign-shadow-sand.webp",
    alt: "Mojaddid Shashwoto casting a shadow with a peace sign on sand",
    width: 1805,
    height: 2400,
    blurDataURL: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoMABAABUB8JZQAAud+9cE8AwAA/uqK7mcpzWP2bzz1t5F+Efbu+oBzcRNJYzpyPjgB5CmAAAA=",
    type: "Street",
  },
  {
    id: "concrete-window-grille-portrait",
    file: "/photos/concrete-window-grille-portrait.webp",
    alt: "Mojaddid Shashwoto in profile looking through an iron window grille against a textured concrete wall",
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

      {/* Top Editorial Bar (Desktop only) */}
      <div className="hidden lg:flex max-w-7xl mx-auto w-full items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-400 z-10 shrink-0">
        <div className="flex items-center gap-2 text-[#c6ff3d]">
          <span className="w-1.5 h-1.5 bg-[#c6ff3d] shrink-0" />
          <span className="font-semibold">PHOTOGRAPHER / DHAKA</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500">
          <span>MOJADDID SHASHWOTO</span>
          <span className="text-white/20">|</span>
          <span>STILL ARCHIVE 2026</span>
        </div>
      </div>

      {/* Central Content Area: Single Responsive Hero Layout */}
      <div className="max-w-7xl mx-auto w-full my-auto py-2 sm:py-4 z-10">
        <div className="relative w-full grid grid-cols-1 justify-items-center lg:justify-items-stretch lg:grid-cols-12 lg:gap-8 xl:gap-14 lg:items-center">
          {/* Left Column (Desktop) / Split Components (Mobile) */}
          <motion.div
            style={{ y: nameParallaxY }}
            className="contents lg:col-span-7 lg:flex lg:flex-col lg:justify-center lg:space-y-6 xl:lg:space-y-8 lg:pl-4 xl:lg:pl-8"
          >
            {/* Eyebrow: Above stack on mobile, above name on desktop */}
            <div className="row-start-1 col-start-1 w-full max-w-[310px] sm:max-w-[340px] lg:max-w-none flex items-center justify-between lg:justify-start font-mono text-[10px] sm:text-[11px] uppercase tracking-wider mb-3 lg:mb-4 px-0.5 lg:px-0">
              <div className="flex items-center gap-1.5 lg:gap-2 text-[#c6ff3d]">
                <span className="w-1.5 h-1.5 bg-[#c6ff3d] shrink-0" />
                <span className="font-semibold">PHOTOGRAPHER / DHAKA</span>
              </div>
              <span className="lg:hidden text-neutral-500 text-[10px] tracking-widest">
                {"//"} TAP TO SHUFFLE
              </span>
            </div>

            {/* Exactly One H1: Layered directly over the card stack on mobile, standalone in left col on desktop */}
            <div className="row-start-2 col-start-1 relative w-[78vw] max-w-[310px] sm:max-w-[340px] aspect-[4/5] lg:w-auto lg:max-w-none lg:aspect-auto pointer-events-none z-30">
              <h1 className="absolute -left-3 sm:-left-5 bottom-3 sm:bottom-4 lg:static lg:pointer-events-auto max-w-[92vw] lg:max-w-none font-display font-black uppercase tracking-tight leading-[0.86] lg:leading-[0.88] text-[clamp(2.4rem,11.2vw,3.8rem)] lg:text-[clamp(3.8rem,6.8vw,7.6rem)] select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] lg:drop-shadow-none">
                <span className="block text-[#f2f2f2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] lg:drop-shadow-none overflow-hidden">
                  {shouldAnimateIntro ? (
                    line1Letters.map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: "80%" }}
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
                    "Mojaddid"
                  )}
                </span>{" "}
                <span
                  className="block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] lg:drop-shadow-none overflow-hidden pb-0 lg:pb-1"
                  style={{
                    WebkitTextStroke: "2px #c6ff3d",
                    color: "transparent",
                  }}
                >
                  {shouldAnimateIntro ? (
                    line2Letters.map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: "80%" }}
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
                    "Shashwoto"
                  )}
                </span>
              </h1>
            </div>

            {/* Action Buttons: Below stack on mobile, below name on desktop */}
            <div className="row-start-3 col-start-1 w-full flex items-center justify-center lg:justify-start gap-3 lg:gap-4 pt-5 lg:pt-2 z-20">
              <Link
                href="/#featured"
                className="min-h-[46px] lg:min-h-[48px] px-6 py-3 bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#b5f524] transition-colors flex items-center justify-center shrink-0 shadow-lg lg:shadow-none"
                data-cursor="hover"
              >
                Selected Work
              </Link>
              <Link
                href="/gallery"
                className="min-h-[46px] lg:min-h-[48px] px-6 py-3 border border-white/20 text-[#f2f2f2] font-mono font-semibold text-xs uppercase tracking-wider hover:border-[#c6ff3d] hover:text-[#c6ff3d] transition-colors flex items-center justify-center shrink-0 bg-black/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none"
                data-cursor="hover"
              >
                Archive
              </Link>
              <span className="hidden lg:inline font-mono text-[11px] text-neutral-500 uppercase tracking-widest pl-2">
                {"//"} CLICK STACK TO SHUFFLE
              </span>
            </div>
          </motion.div>

          {/* Right Column (Desktop) / Print Stack (Mobile & Desktop) */}
          <motion.div
            style={{ y: stackParallaxY }}
            className="row-start-2 col-start-1 lg:col-span-5 flex justify-center items-center z-10"
          >
            <div
              className="relative w-[78vw] max-w-[310px] sm:max-w-[340px] lg:w-[310px] xl:w-[360px] 2xl:w-[400px] aspect-[4/5]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Lime Viewfinder Corner Brackets */}
              <div className="pointer-events-none absolute -inset-2.5 sm:-inset-3 lg:-inset-4 xl:-inset-5 z-20 lg:z-30" aria-hidden="true">
                <svg className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M1 23V1H23" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M23 23V1H1" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M1 1V23H23" stroke="#c6ff3d" strokeWidth="2" strokeLinecap="square" />
                </svg>
                <svg className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none">
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

              {/* Single Interactive 3-print stack Card Deck */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Photo print stack. Click or tap to shuffle prints."
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
                  const baseX = posIndex === 0 ? 0 : posIndex === 1 ? -7 : 7;
                  const baseY = posIndex === 0 ? 0 : posIndex === 1 ? 5 : 10;
                  const zIndex = isTop ? 10 : posIndex === 1 ? 5 : 2;

                  return (
                    <motion.div
                      key={item.id}
                      initial={
                        shouldAnimateIntro
                          ? { opacity: 0, y: 30, rotate: 0 }
                          : false
                      }
                      animate={{
                        opacity: 1,
                        x: isSliding ? 45 : baseX,
                        y: isSliding ? -18 : baseY,
                        rotate: isSliding ? 10 : baseRotate,
                        scale: baseScale,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 24,
                        delay: shouldAnimateIntro ? 0.45 + posIndex * 0.09 : 0,
                      }}
                      style={{ zIndex }}
                      className="absolute inset-0 bg-white p-1 sm:p-1.5 shadow-[0_14px_32px_rgba(0,0,0,0.85)] rounded-[2px] overflow-hidden"
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
                          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 340px, 400px"
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
          {[...driftPhotos, ...driftPhotos].map((photo, idx) => {
            const isDuplicate = idx >= driftPhotos.length;
            return (
              <Link
                key={`${photo.id}-${idx}`}
                href="/gallery"
                data-cursor="hover"
                aria-hidden={isDuplicate ? "true" : undefined}
                tabIndex={isDuplicate ? -1 : undefined}
                className="shrink-0 h-10 sm:h-12 w-auto aspect-[4/5] border border-white/15 bg-white p-0.5 shadow-md hover:border-[#c6ff3d] transition-colors"
              >
                <div className="relative w-full h-full overflow-hidden bg-[#111]">
                  <Image
                    src={photo.file || photo.src}
                    alt={isDuplicate ? "" : photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="60px"
                    placeholder={photo.blurDataURL ? "blur" : "empty"}
                    blurDataURL={photo.blurDataURL}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
