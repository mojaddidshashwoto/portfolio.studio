"use client";

import Image from "next/image";
import Link from "next/link";
import { getAboutPhoto } from "@/lib/photos";

export default function AboutSection() {
  const aboutPhoto = getAboutPhoto();

  const principles = [
    {
      num: "01",
      title: "Negative Space & Shadow",
      desc: "Treating deep shadows and unlit areas as deliberate elements that focus attention on the subject.",
    },
    {
      num: "02",
      title: "Natural Light & Geometry",
      desc: "Working with architectural windows, direct sunlight, and available ambient lighting to define real texture.",
    },
    {
      num: "03",
      title: "Urban Stillness",
      desc: "Observing everyday moments, solitary pedestrians, and stillness within dense metropolitan environments.",
    },
  ];

  const aspectRatio =
    aboutPhoto.width && aboutPhoto.height
      ? `${aboutPhoto.width} / ${aboutPhoto.height}`
      : "1800 / 2400";

  return (
    <section id="about" className="relative w-full py-24 px-6 md:px-12 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Top Mono Label */}
        <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-4">
          03 / PROFILE
        </div>

        {/* Editorial Asymmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 border-t border-white/10 pt-12 items-start">
          {/* Left: Heading & Photographer Statement */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-10">
            <div>
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-[#f2f2f2] leading-[0.9]">
                Framing Stillness in the City.
              </h2>

              <div className="mt-8 space-y-5 text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
                <p>
                  I am <strong className="text-white font-medium">Mojaddid Shashwoto</strong>, an
                  independent photographer based in Dhaka.
                </p>
                <p>
                  My work focuses on architectural perspectives, street scenes, and quiet portraits.
                  I look for geometric balance, natural contrast, and authentic human moments,
                  treating every photograph as a finished print rather than a casual snapshot.
                </p>
              </div>

              {/* Core Photographic Principles */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
                {principles.map((p) => (
                  <div key={p.num} className="space-y-2">
                    <span className="font-mono text-xs font-bold text-[#c6ff3d]">
                      {p.num} {"//"}
                    </span>
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#f2f2f2]">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact link */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-500">
                Inquiries
              </span>
              <Link
                href="/contact"
                className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] hover:underline flex items-center gap-2"
                data-cursor="hover"
              >
                <span>Contact</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right: Pure Text-Free Framed Portrait Print */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#080808] border border-white/10 overflow-hidden shadow-2xl transition-colors duration-300 hover:border-[#c6ff3d]/60">
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio }}
              >
                <Image
                  src={aboutPhoto.file || "/photos/concrete-window-grille-portrait.webp"}
                  alt={aboutPhoto.alt}
                  width={aboutPhoto.width || 1800}
                  height={aboutPhoto.height || 2400}
                  sizes="(max-width: 1024px) 100vw, 420px"
                  placeholder={aboutPhoto.blurDataURL ? "blur" : "empty"}
                  blurDataURL={aboutPhoto.blurDataURL}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
