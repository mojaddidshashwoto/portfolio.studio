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
    <section id="work" className="relative w-full py-24 px-6 md:px-12 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-2">
              02 / ARCHIVE
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#f2f2f2]">
              Archive
            </h2>
          </div>

          {/* Minimal Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  data-cursor="hover"
                  className={`px-3.5 py-1.5 border uppercase tracking-wider transition-all duration-200 ${
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

        {/* Tightened Grid of Pure Text-Free Photos Filling Space */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start"
        >
          <AnimatePresence>
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <FramedPhoto
                  photo={photo}
                  onClick={() => onSelectPhoto(photo)}
                  className="w-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
