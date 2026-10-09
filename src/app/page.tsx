"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import HorizontalGallery from "@/components/HorizontalGallery";
import MasonryGallery from "@/components/MasonryGallery";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Lightbox from "@/components/Lightbox";
import { photos, getHorizontalPhotos, Photo } from "@/lib/photos";

export default function HomePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const horizontalPhotos = getHorizontalPhotos();

  return (
    <div className="w-full flex flex-col bg-[#060709]">
      {/* Hero Section */}
      <Hero />

      {/* Horizontal Scroll Featured Gallery */}
      <HorizontalGallery
        photos={horizontalPhotos}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />

      {/* Masonry Grid with Category Filters */}
      <MasonryGallery
        photos={photos}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />

      {/* About Section */}
      <AboutSection />

      {/* Contact Form Section */}
      <ContactSection />

      {/* Lightbox Modal with Keyboard Navigation */}
      <Lightbox
        photo={selectedPhoto}
        photos={photos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />
    </div>
  );
}
