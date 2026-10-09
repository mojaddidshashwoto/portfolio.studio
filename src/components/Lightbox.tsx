"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "@/lib/photos";

interface LightboxProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
}

export default function Lightbox({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}: LightboxProps) {
  const touchStartX = useRef<number | null>(null);

  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else {
      onSelectPhoto(photos[photos.length - 1]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
    } else {
      onSelectPhoto(photos[0]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  // Keyboard Navigation: Left/Right to Navigate, Esc to Close
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, handlePrev, handleNext, onClose]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex items-center justify-center select-none"
      >
        {/* Simple Close Button */}
        <button
          onClick={onClose}
          data-cursor="hover"
          aria-label="Close Lightbox"
          className="absolute top-6 right-6 z-30 p-3 border border-white/10 bg-[#0a0a0a]/80 text-neutral-400 hover:text-white hover:border-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Simple Prev Control */}
        <button
          onClick={handlePrev}
          data-cursor="hover"
          aria-label="Previous Photo"
          className="absolute left-4 sm:left-8 z-30 p-3 border border-white/10 bg-[#0a0a0a]/80 text-neutral-400 hover:text-[#c6ff3d] hover:border-[#c6ff3d] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Simple Next Control */}
        <button
          onClick={handleNext}
          data-cursor="hover"
          aria-label="Next Photo"
          className="absolute right-4 sm:right-8 z-30 p-3 border border-white/10 bg-[#0a0a0a]/80 text-neutral-400 hover:text-[#c6ff3d] hover:border-[#c6ff3d] transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Centered Pure Photo (Text-Free, Natural Aspect Ratio, True Color) */}
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="relative w-full h-full flex items-center justify-center p-8 sm:p-14 md:p-20"
        >
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-full max-h-full flex items-center justify-center overflow-hidden border border-white/10 bg-[#080808]"
          >
            <Image
              src={photo.file || photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              placeholder={photo.blurDataURL ? "blur" : "empty"}
              blurDataURL={photo.blurDataURL}
              sizes="90vw"
              className="object-contain max-h-[85vh] w-auto h-auto"
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
