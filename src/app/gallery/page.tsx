"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { photos, categories, Category, Photo } from "@/lib/photos";
import FramedPhoto from "@/components/FramedPhoto";
import Lightbox from "@/components/Lightbox";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") return photos;
    return photos.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Back */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <Link
            href="/"
            className="font-mono text-xs text-neutral-400 hover:text-[#c6ff3d] uppercase tracking-wider transition-colors"
            data-cursor="hover"
          >
            ← Return To Home
          </Link>

          <span className="font-mono text-[11px] tracking-widest text-[#c6ff3d] uppercase px-2 py-0.5 border border-[#c6ff3d]/30 bg-[#c6ff3d]/5">
            Archive
          </span>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase text-[#f2f2f2]">
            Archive
          </h1>
        </div>

        {/* Category Filters: Horizontal Scrollable Chip Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 font-mono text-xs mb-8 pb-4 border-b border-white/10">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-cursor="hover"
                className={`min-h-[44px] px-4 py-2 border uppercase tracking-wider shrink-0 transition-colors flex items-center justify-center ${
                  active
                    ? "border-[#c6ff3d] text-[#c6ff3d] bg-[#c6ff3d]/10 font-bold"
                    : "border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2-Column Masonry with tight 6px gaps */}
        <div className="columns-2 sm:columns-2 lg:columns-3 gap-[6px] sm:gap-4 lg:gap-6 space-y-[6px] sm:space-y-4 lg:space-y-6">
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.08,
                  ease: "easeOut",
                }}
                className="break-inside-avoid"
              >
                <FramedPhoto
                  photo={photo}
                  onClick={() => setSelectedPhoto(photo)}
                  className="w-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Text-Free Lightbox */}
        <Lightbox
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhoto(null)}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />
      </div>
    </div>
  );
}
