"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headlineLines = ["MOJADDID", "SHASHWOTO", "PHOTOGRAPHY"];

  const topLinks = [
    { label: "Mail", href: "mailto:sasotomujaddid@gmail.com", external: true },
    {
      label: "Instagram",
      href: "https://www.instagram.com/mojaddid_shashwoto/",
      external: true,
      rel: "me noopener noreferrer",
    },
    {
      label: "Vimeo",
      href: "https://mojaddidshashwoto.me",
      external: true,
      rel: "me noopener noreferrer",
      title: "Mojaddid Shashwoto Media",
    },
  ];

  const sideNavItems = [
    { label: "About", href: "/#about" },
    { label: "Work", href: "/#featured" },
    { label: "Archive", href: "/gallery" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <section className="relative w-full h-[100svh] min-h-[100svh] bg-black text-[#f2f2f2] overflow-hidden select-none flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* BACKGROUND PHOTOGRAPH: Original 4762.jpg / concrete-window-grille-portrait */}
      {/* ========================================================================= */}
      <motion.div
        initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          reducedMotion
            ? { duration: 0.01 }
            : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Desktop/Tablet Positioning: Aligned toward right/center to overlap text naturally */}
          <div className="absolute inset-0 md:left-[15%] lg:left-[22%] xl:left-[26%]">
            <Image
              src="/photos/concrete-window-grille-portrait.webp"
              alt="Profile portrait of Mojaddid Shashwoto looking through an iron window grille against textured concrete wall"
              fill
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 75vw"
              className="object-cover object-[62%_25%] md:object-[58%_30%] lg:object-[54%_28%] brightness-[0.98] contrast-[1.04]"
            />
          </div>

          {/* Soft directional gradient overlays: Preserve photographic detail while ensuring text readability */}
          {/* 1. Left Edge Solid-to-Translucent Dark Vignette (Anchors the typography) */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black via-black/75 md:via-black/55 to-transparent z-10"
            style={{ width: "100%" }}
            aria-hidden="true"
          />

          {/* 2. Bottom Smooth Vignette to ground the supporting statement */}
          <div
            className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-black via-black/60 to-transparent z-10"
            aria-hidden="true"
          />

          {/* 3. Top Subtle Shade for Top-Right Navigation Contrast */}
          <div
            className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10"
            aria-hidden="true"
          />

          {/* 4. Right Edge Soft Falloff */}
          <div
            className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/60 to-transparent z-10"
            aria-hidden="true"
          />
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* TOP NAVIGATION: Mail, Instagram, Vimeo (Top Right) */}
      {/* ========================================================================= */}
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion
            ? { duration: 0.01 }
            : { duration: 0.7, delay: 0.25, ease: "easeOut" }
        }
        className="relative z-30 w-full px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8 flex items-center justify-between shrink-0"
      >
        {/* Subtle Brand Mark (Mobile only, keeps header balanced) */}
        <div className="md:hidden">
          <Link
            href="/"
            className="font-hero-condensed text-xl tracking-wider text-white/90 hover:text-[#c6ff3d] transition-colors"
          >
            MS
          </Link>
        </div>

        {/* Empty spacer for desktop to push nav right */}
        <div className="hidden md:block" />

        {/* Top-Right Social & Email Links */}
        <div className="flex items-center gap-6 sm:gap-8 font-sans text-xs sm:text-sm tracking-wider uppercase font-medium">
          {topLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.rel}
              title={item.title}
              className="text-neutral-300 hover:text-white transition-colors duration-200 py-1"
              data-cursor="hover"
            >
              {item.label}
            </a>
          ))}

          {/* Mobile Menu Button to trigger vertical navigation */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden ml-2 text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* MAIN HEADLINE & SUPPORTING TEXT (Left Aligned, Overlapping Portrait) */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full px-6 sm:px-10 lg:px-16 my-auto py-4 sm:py-6 flex flex-col justify-center">
        {/* Editorial Condensed 3-Line Headline */}
        <h1 className="font-hero-condensed font-normal uppercase text-white tracking-[-0.015em] leading-[0.84] select-none text-[clamp(3.1rem,13vw,12.5rem)]">
          {headlineLines.map((line, idx) => (
            <span key={idx} className="block overflow-hidden pb-1">
              <motion.span
                initial={reducedMotion ? { y: 0, opacity: 1 } : { y: "102%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={
                  reducedMotion
                    ? { duration: 0.01 }
                    : {
                        duration: 0.85,
                        delay: 0.15 + idx * 0.14,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
                className="block text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Bottom-Left Supporting Description */}
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0.01 }
              : { duration: 0.8, delay: 0.65, ease: "easeOut" }
          }
          className="mt-6 sm:mt-8 lg:mt-10 max-w-xs sm:max-w-md"
        >
          <p className="font-sans text-xs sm:text-sm text-neutral-300 font-light leading-relaxed tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Independent photographer documenting the quiet geometry of everyday life.
          </p>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT-SIDE VERTICAL NAVIGATION: About, Work, Archive, Contact */}
      {/* ========================================================================= */}
      <motion.nav
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={
          reducedMotion
            ? { duration: 0.01 }
            : { duration: 0.8, delay: 0.5, ease: "easeOut" }
        }
        aria-label="Hero section navigation"
        className="hidden md:flex absolute right-6 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-30 flex-col items-end space-y-4 lg:space-y-5 font-sans text-xs sm:text-sm tracking-wider uppercase font-medium"
      >
        {sideNavItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="text-neutral-300 hover:text-white hover:translate-x-[-2px] transition-all duration-200 py-1"
            data-cursor="hover"
          >
            {item.label}
          </Link>
        ))}
      </motion.nav>

      {/* Bottom Subtle Padding Anchor */}
      <div className="relative z-20 pb-4 px-6 sm:px-10 lg:px-16 shrink-0" />

      {/* ========================================================================= */}
      {/* MOBILE FULLSCREEN MENU OVERLAY (when toggled on mobile) */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="md:hidden absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-8"
        >
          <div className="flex items-center justify-between">
            <span className="font-hero-condensed text-2xl tracking-wider text-white">
              MOJADDID SHASHWOTO
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 min-h-[44px] min-w-[44px] text-white flex items-center justify-center focus:outline-none"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col space-y-6 my-auto font-hero-condensed text-4xl tracking-wide uppercase">
            {sideNavItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between font-sans text-xs uppercase tracking-wider text-neutral-400">
            {topLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.rel}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
