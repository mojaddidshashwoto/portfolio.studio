"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getHeroPhoto } from "@/lib/photos";

export default function Hero() {
  const heroPhoto = getHeroPhoto();

  const aspectRatio =
    heroPhoto.width && heroPhoto.height
      ? `${heroPhoto.width} / ${heroPhoto.height}`
      : "1805 / 2400";

  return (
    <section className="relative w-full min-h-screen pt-28 sm:pt-36 pb-20 px-6 md:px-12 bg-[#0a0a0a] border-b border-white/10 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Asymmetrical 2-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Photographer Name & Statement (Beside on desktop, above on mobile) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 order-1 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Mono Subheading Tag */}
              <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[#c6ff3d]">
                <span className="w-1.5 h-1.5 bg-[#c6ff3d] shrink-0" />
                <span>Photographer, Dhaka · 2026</span>
              </div>

              {/* Name: Placed cleanly in negative space, NEVER covering the photo */}
              <h1
                className="font-display font-extrabold uppercase tracking-tight text-[#f2f2f2] leading-[0.88] select-none"
                style={{
                  fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)",
                }}
              >
                <span>MOJADDID</span>
                <br />
                <span className="text-[#f2f2f2]">SHASHWOTO</span>
              </h1>

              {/* Photography bio statement */}
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-md pt-2">
                Documenting urban architecture, street perspectives, and quiet portraits.
                Treating light, geometry, and negative space with deliberate restraint.
              </p>
            </motion.div>

            {/* Quick Actions & Index Links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs"
            >
              <Link
                href="#featured"
                className="px-5 py-2.5 bg-[#c6ff3d] text-[#0a0a0a] font-bold uppercase tracking-wider hover:bg-[#b0eb28] transition-colors"
                data-cursor="hover"
              >
                Selected Work ↓
              </Link>

              <Link
                href="/gallery"
                className="px-5 py-2.5 border border-white/20 text-[#f2f2f2] uppercase tracking-wider hover:border-[#c6ff3d] hover:text-[#c6ff3d] transition-colors"
                data-cursor="hover"
              >
                Archive →
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Still Framed Photo (Completely Text-Free, True Colors) */}
          <div className="lg:col-span-7 order-2 lg:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full max-w-xl bg-[#080808] border border-white/10 overflow-hidden shadow-2xl transition-colors duration-300 hover:border-[#c6ff3d]/60"
            >
              <div
                className="relative w-full max-h-[72vh] overflow-hidden"
                style={{ aspectRatio }}
              >
                <Image
                  src={heroPhoto.file || "/photos/architectural-window-portrait.webp"}
                  alt={heroPhoto.alt}
                  width={heroPhoto.width || 1805}
                  height={heroPhoto.height || 2400}
                  priority
                  placeholder={heroPhoto.blurDataURL ? "blur" : "empty"}
                  blurDataURL={heroPhoto.blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
