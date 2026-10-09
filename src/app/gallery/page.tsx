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

          <span className="font-mono text-[11px] tracking-widest text-[#c6ff3d] uppercase">
            {"//"} ARCHIVE
          </span>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase text-[#f2f2f2]">
            Archive
          </h1>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-10 pb-6 border-b border-white/10">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-cursor="hover"
                className={`px-3.5 py-1.5 border uppercase tracking-wider transition-colors ${
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

        {/* Tightened Grid of Pure Text-Free Photos */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start"
        >
          <AnimatePresence>
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3 }}
              >
                <FramedPhoto
                  photo={photo}
                  onClick={() => setSelectedPhoto(photo)}
                  className="w-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
