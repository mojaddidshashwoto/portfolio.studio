"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Photo } from "@/lib/photos";

interface HorizontalGalleryProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
}

export default function HorizontalGallery({
  photos,
  onSelectPhoto,
}: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mobile native scroll listener for progress bar
  const handleMobileScroll = () => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      const p = Math.min(100, Math.max(0, (el.scrollLeft / maxScroll) * 100));
      setScrollProgress(p);
    }
  };

  // Desktop GSAP pin-scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      if (window.innerWidth >= 1024) {
        const totalScroll = track.scrollWidth - window.innerWidth + 80;

        gsap.to(track, {
          x: () => -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${totalScroll}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setScrollProgress(self.progress * 100);
            },
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [photos]);

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="relative w-full bg-[#0a0a0a] overflow-hidden border-b border-white/10"
    >
      {/* Top Editorial Index Bar */}
      <div className="w-full border-b border-white/10 px-5 sm:px-6 md:px-12 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
          <span className="font-mono text-xs text-[#c6ff3d] uppercase tracking-widest font-semibold px-2.5 py-1 border border-[#c6ff3d]/30 bg-[#c6ff3d]/5">
            Selected Work
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px] text-neutral-400">
          <span className="uppercase tracking-widest">
            {photos.length} Works
          </span>
          <span className="text-[#c6ff3d]">→</span>
        </div>
      </div>

      {/* Thin Lime Progress Bar */}
      <div className="w-full h-[2px] bg-white/10 relative overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-[#c6ff3d] transition-[width] duration-150 ease-out"
          style={{ width: `${Math.max(8, scrollProgress)}%` }}
        />
      </div>

      {/* MOBILE SWIPE CAROUSEL (< 1024px): Native swipe with scroll-snap */}
      <div
        ref={mobileScrollRef}
        onScroll={handleMobileScroll}
        className="lg:hidden flex overflow-x-auto snap-x snap-mandatory px-5 sm:px-6 py-8 gap-4 no-scrollbar -webkit-overflow-scrolling-touch"
        style={{ scrollbarWidth: "none" }}
      >
        {photos.map((photo, idx) => {
          const aspectRatio =
            photo.width && photo.height
              ? `${photo.width} / ${photo.height}`
              : "3 / 2";

          return (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              data-cursor="view"
              className="snap-center shrink-0 w-[82vw] sm:w-[60vw] max-w-[480px] bg-[#0a0a0a] border border-white/15 overflow-hidden active:border-[#c6ff3d] transition-colors"
            >
              <div
                className="relative w-full overflow-hidden flex items-center justify-center bg-[#080808]"
                style={{ aspectRatio }}
              >
                <Image
                  src={photo.file || photo.src}
                  alt={photo.alt}
                  width={photo.width || 1800}
                  height={photo.height || 1200}
                  priority={idx < 2}
                  placeholder={photo.blurDataURL ? "blur" : "empty"}
                  blurDataURL={photo.blurDataURL}
                  sizes="(max-width: 768px) 85vw, 480px"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TRACK (>= 1024px): Horizontal Pin Track */}
      <div
        ref={trackRef}
        className="hidden lg:flex items-center px-12 h-[78vh] py-10 gap-8 will-change-transform"
      >
        {photos.map((photo) => {
          const aspectRatio =
            photo.width && photo.height
              ? `${photo.width} / ${photo.height}`
              : "3 / 2";

          return (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              data-cursor="view"
              className="group relative shrink-0 h-full max-h-[64vh] border border-white/10 bg-[#080808] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#c6ff3d] hover:shadow-[0_0_25px_rgba(198,255,61,0.2)] flex items-center justify-center"
            >
              <div
                className="relative h-full w-auto overflow-hidden flex items-center justify-center"
                style={{ aspectRatio }}
              >
                <Image
                  src={photo.file || photo.src}
                  alt={photo.alt}
                  width={photo.width || 1800}
                  height={photo.height || 1200}
                  placeholder={photo.blurDataURL ? "blur" : "empty"}
                  blurDataURL={photo.blurDataURL}
                  sizes="680px"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
