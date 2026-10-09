"use client";

import { useRef, useEffect } from "react";
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      if (window.innerWidth >= 768) {
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
      <div className="w-full border-b border-white/10 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#c6ff3d] uppercase tracking-widest">
            01 / SELECTED WORK
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs text-neutral-400">
          <span className="hidden sm:inline uppercase tracking-widest">
            Scroll Track
          </span>
          <span className="text-[#c6ff3d]">→</span>
        </div>
      </div>

      {/* Horizontal Track of Pure Text-Free Photos */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row md:items-center px-6 md:px-12 md:h-[78vh] py-8 md:py-10 gap-6 sm:gap-8 will-change-transform"
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
              className="group relative shrink-0 w-full md:w-auto md:h-full max-h-[64vh] border border-white/10 bg-[#080808] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#c6ff3d] hover:shadow-[0_0_25px_rgba(198,255,61,0.2)] flex items-center justify-center"
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
                  sizes="(max-width: 768px) 100vw, 680px"
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
