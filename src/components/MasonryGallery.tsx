"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Photo, categories, Category } from "@/lib/photos";
import FramedPhoto from "./FramedPhoto";

interface MasonryGalleryProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
}

export default function MasonryGallery({
  photos,
  onSelectPhoto,
}: MasonryGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "All") return photos;
    return photos.filter((p) => p.category === activeCategory);
  }, [photos, activeCategory]);

  return (
    <section id="work" className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-2">
              <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
              <span>02 / ARCHIVE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#f2f2f2]">
              Archive
            </h2>
          </div>

          {/* Horizontal Scrollable Chip Row for Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 font-mono text-xs">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  data-cursor="hover"
                  className={`min-h-[44px] px-4 py-2 border uppercase tracking-wider shrink-0 transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? "border-[#c6ff3d] text-[#c6ff3d] bg-[#c6ff3d]/10 font-bold"
                      : "border-white/10 text-neutral-400 hover:text-white hover:border-white/30"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Masonry on Mobile with tight 6px gaps */}
        <div className="mt-6 sm:mt-8 columns-2 sm:columns-2 lg:columns-3 gap-[6px] sm:gap-4 lg:gap-6 space-y-[6px] sm:space-y-4 lg:space-y-6">
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
                  onClick={() => onSelectPhoto(photo)}
                  className="w-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
