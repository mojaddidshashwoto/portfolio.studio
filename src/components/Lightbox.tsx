"use client";

import { useEffect, useCallback, useRef, useState } from "react";
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
  const touchStartY = useRef<number | null>(null);
  const initialPinchDist = useRef<number | null>(null);
  const [scale, setScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  const [prevPhotoId, setPrevPhotoId] = useState(photo?.id);
  const lastTapTime = useRef<number>(0);

  // Reset zoom when photo changes
  if (photo?.id !== prevPhotoId) {
    setPrevPhotoId(photo?.id);
    setScale(1);
  }

  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;

  const handlePrev = useCallback(() => {
    setScale(1);
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else {
      onSelectPhoto(photos[photos.length - 1]);
    }
  }, [currentIndex, photos, onSelectPhoto]);

  const handleNext = useCallback(() => {
    setScale(1);
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

  // Touch Handlers: Swipe Left/Right, Swipe Down to Close, Pinch to Zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch to zoom start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDist.current = dist;
      setIsPinching(true);
    } else if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;

      // Double tap to zoom
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        setScale((prev) => (prev > 1 ? 1 : 2));
      }
      lastTapTime.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / initialPinchDist.current;
      setScale(Math.min(3.5, Math.max(1, ratio)));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (initialPinchDist.current !== null) {
      initialPinchDist.current = null;
      setIsPinching(false);
      return;
    }

    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only process swipe navigation when not zoomed in
    if (scale <= 1.1) {
      // Swipe down to close (vertical delta exceeds horizontal and exceeds 65px)
      if (deltaY > 65 && deltaY > Math.abs(deltaX) * 1.5) {
        onClose();
      } else if (deltaX < -50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe left -> Next
        handleNext();
      } else if (deltaX > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe right -> Prev
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
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
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex items-center justify-center select-none overflow-hidden touch-none"
      >
        {/* Top Control Bar with Close Button (min 44px tap target) */}
        <button
          onClick={onClose}
          data-cursor="hover"
          aria-label="Close Lightbox"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 w-11 h-11 flex items-center justify-center border border-white/15 bg-[#0a0a0a]/90 text-neutral-300 hover:text-white hover:border-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Counter indicator */}
        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-40 font-mono text-[11px] text-neutral-400 uppercase tracking-widest bg-[#0a0a0a]/80 px-3 py-1.5 border border-white/10">
          <span>{currentIndex + 1}</span>
          <span className="text-[#c6ff3d] mx-1.5">/</span>
          <span>{photos.length}</span>
        </div>

        {/* Prev Control (min 44px tap target) */}
        <button
          onClick={handlePrev}
          data-cursor="hover"
          aria-label="Previous Photo"
          className="hidden sm:flex absolute left-4 sm:left-6 z-40 w-12 h-12 items-center justify-center border border-white/15 bg-[#0a0a0a]/80 text-neutral-300 hover:text-[#c6ff3d] hover:border-[#c6ff3d] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Control (min 44px tap target) */}
        <button
          onClick={handleNext}
          data-cursor="hover"
          aria-label="Next Photo"
          className="hidden sm:flex absolute right-4 sm:right-6 z-40 w-12 h-12 items-center justify-center border border-white/15 bg-[#0a0a0a]/80 text-neutral-300 hover:text-[#c6ff3d] hover:border-[#c6ff3d] transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Mobile Transparent Tap Zones for Prev / Next */}
        <div
          onClick={handlePrev}
          className="sm:hidden absolute left-0 top-16 bottom-16 w-1/4 z-30 cursor-pointer"
          aria-label="Previous photo tap zone"
        />
        <div
          onClick={handleNext}
          className="sm:hidden absolute right-0 top-16 bottom-16 w-1/4 z-30 cursor-pointer"
          aria-label="Next photo tap zone"
        />

        {/* Centered Photo Display */}
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-10 md:p-14"
        >
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              transform: `scale(${scale})`,
              transition: isPinching ? "none" : "transform 0.2s ease-out",
            }}
            className="relative max-w-full flex items-center justify-center overflow-hidden border border-white/15 bg-[#080808]"
          >
            <Image
              src={photo.file || photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              placeholder={photo.blurDataURL ? "blur" : "empty"}
              blurDataURL={photo.blurDataURL}
              sizes="92vw"
              className="object-contain max-h-[72vh] sm:max-h-[78vh] w-auto h-auto pointer-events-none"
            />
          </motion.div>

          {/* Poetic Caption: shown only in lightbox, below photo in mono italic type with high contrast */}
          {photo.caption && (
            <motion.div
              key={`caption-${photo.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="mt-3.5 sm:mt-4 max-w-2xl px-4 text-center pointer-events-none z-30 mb-6 sm:mb-0"
            >
              <p className="font-mono text-xs sm:text-sm text-neutral-300 italic tracking-wide">
                {photo.caption}
              </p>
            </motion.div>
          )}
        </div>

        {/* Mobile gesture hint bar */}
        <div className="sm:hidden absolute bottom-4 inset-x-0 z-40 flex items-center justify-center gap-3 font-mono text-[9px] text-neutral-400 tracking-wider uppercase pointer-events-none">
          <span>Swipe ↔ navigate</span>
          <span>•</span>
          <span>Swipe ↓ close</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
