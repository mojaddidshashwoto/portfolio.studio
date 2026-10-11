"use client";

import { useState } from "react";
import Link from "next/link";
import { Photo, SubjectMeta } from "@/lib/photos";
import FramedPhoto from "@/components/FramedPhoto";
import Lightbox from "@/components/Lightbox";
import { motion, AnimatePresence } from "framer-motion";

interface SubjectGalleryClientProps {
  subject: SubjectMeta;
  photos: Photo[];
  allSubjects: SubjectMeta[];
}

export default function SubjectGalleryClient({
  subject,
  photos,
  allSubjects,
}: SubjectGalleryClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div>
      {/* Subject Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 font-mono text-xs mb-8 pb-4 border-b border-white/10">
        <Link
          href="/gallery"
          className="min-h-[44px] px-4 py-2 border border-white/10 text-neutral-400 hover:text-white uppercase tracking-wider shrink-0 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6ff3d]"
          data-cursor="hover"
        >
          All
        </Link>
        {allSubjects.map((s) => {
          const isActive = s.slug === subject.slug;
          return (
            <Link
              key={s.slug}
              href={`/gallery/${s.slug}`}
              className={`min-h-[44px] px-4 py-2 border uppercase tracking-wider shrink-0 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6ff3d] ${
                isActive
                  ? "border-[#c6ff3d] text-[#c6ff3d] bg-[#c6ff3d]/10 font-bold"
                  : "border-white/10 text-neutral-400 hover:text-white"
              }`}
              data-cursor="hover"
            >
              {s.title}
            </Link>
          );
        })}
      </div>

      {/* Grid of Photos */}
      <div className="columns-2 sm:columns-2 lg:columns-3 gap-[6px] sm:gap-4 lg:gap-6 space-y-[6px] sm:space-y-4 lg:space-y-6">
        <AnimatePresence>
          {photos.map((photo, index) => (
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

      {/* Other Subjects Navigation */}
      <div className="mt-20 pt-10 border-t border-white/10">
        <div className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 mb-6">
          Explore Other Subjects
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {allSubjects
            .filter((s) => s.slug !== subject.slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/gallery/${s.slug}`}
                className="group p-5 border border-white/10 bg-white/[0.02] hover:border-[#c6ff3d]/40 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c6ff3d]"
              >
                <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-1">
                  Subject
                </div>
                <div className="font-display text-base font-bold text-[#f2f2f2] group-hover:text-[#c6ff3d] transition-colors">
                  {s.title}
                </div>
                <p className="mt-2 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {s.plainDescription}
                </p>
              </Link>
            ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        photo={selectedPhoto}
        photos={photos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />
    </div>
  );
}
