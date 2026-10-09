"use client";

import Image from "next/image";
import { Photo } from "@/lib/photos";

interface FramedPhotoProps {
  photo: Photo;
  onClick?: () => void;
  priority?: boolean;
  className?: string;
}

export default function FramedPhoto({
  photo,
  onClick,
  priority = false,
  className = "",
}: FramedPhotoProps) {
  const aspectRatio =
    photo.width && photo.height
      ? `${photo.width} / ${photo.height}`
      : "3 / 4";

  return (
    <div
      onClick={onClick}
      data-cursor={onClick ? "view" : undefined}
      className={`group relative bg-[#0a0a0a] border border-white/10 overflow-hidden transition-all duration-300 ${
        onClick
          ? "cursor-pointer hover:border-[#c6ff3d] hover:shadow-[0_0_20px_rgba(198,255,61,0.15)]"
          : ""
      } ${className}`}
    >
      {/* Pure text-free photo container filling space at natural aspect ratio */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio }}
      >
        <Image
          src={photo.file || photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority={priority}
          placeholder={photo.blurDataURL ? "blur" : "empty"}
          blurDataURL={photo.blurDataURL}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
        />

        {/* Soft Desktop Hover Caption: fade only, no dimming overlay or tint */}
        {photo.caption && (
          <div className="hidden md:block absolute bottom-0 inset-x-0 p-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="font-mono text-[11px] text-[#f2f2f2] italic tracking-wide leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              {photo.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
