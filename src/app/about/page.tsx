import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAboutPhoto } from "@/lib/photos";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Mojaddid Shashwoto, a photographer in Dhaka documenting boats and coastlines, rivers and light, railways and everyday life, portraits, and nature.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Mojaddid Shashwoto",
    description:
      "About Mojaddid Shashwoto, a photographer in Dhaka documenting boats and coastlines, rivers and light, railways and everyday life, portraits, and nature.",
    url: "https://mojaddidshashwoto.studio/about",
    siteName: "Mojaddid Shashwoto",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Photographer Mojaddid Shashwoto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Mojaddid Shashwoto",
    description:
      "About Mojaddid Shashwoto, a photographer in Dhaka documenting boats and coastlines, rivers and light, railways and everyday life, portraits, and nature.",
    images: ["/og-image.jpg"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://mojaddidshashwoto.studio",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "About",
      "item": "https://mojaddidshashwoto.studio/about",
    },
  ],
};

export default function AboutPage() {
  const aboutPhoto = getAboutPhoto();

  const principles = [
    {
      title: "Boats & Coastlines",
      desc: "Documenting wooden boats, coastal shores, and open water in natural sunlight.",
    },
    {
      title: "Rivers & Light",
      desc: "Observing calm river surfaces, changing twilight, and reflections across the water.",
    },
    {
      title: "Railways & Everyday Life",
      desc: "Photographing passengers, tracks, morning mist, and daily routines as they happen.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          {/* Navigation Back */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <Link
              href="/"
              className="font-mono text-xs text-neutral-400 hover:text-[#c6ff3d] uppercase tracking-wider transition-colors"
            >
              ← Return To Home
            </Link>
            <span className="font-mono text-[11px] tracking-widest text-[#c6ff3d] uppercase">
              {"//"} PROFILE & STATEMENT
            </span>
          </div>

          {/* Plain-text identification line near top */}
          <p className="font-mono text-xs text-[#c6ff3d] tracking-wide mb-6">
            Mojaddid Shashwoto is a photographer in Dhaka.
          </p>

          {/* Hero Header */}
          <div className="mb-14">
            <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-4 inline-flex items-center gap-2 px-2.5 py-1 border border-[#c6ff3d]/30 bg-[#c6ff3d]/5">
              <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
              <span>Profile</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase text-[#f2f2f2] leading-[0.88]">
              Mojaddid Shashwoto
            </h1>

            {/* Factual Bio in Plain Wording */}
            <div className="mt-8 space-y-5 text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl">
              <p>
                I am Mojaddid Shashwoto, a photographer in Dhaka. My work documents boats and
                coastlines, rivers and light, railways and everyday life, portraits, and nature.
              </p>
              <p>
                I observe scenes as they unfold, working with natural ambient light and everyday
                surroundings. From riverbanks and fishing boats to train tracks and quiet portraits,
                this archive brings together moments photographed without staging.
              </p>
            </div>
          </div>

          {/* Framed Portrait Print with True Colors (Text-Free) */}
          <div className="relative w-full max-w-xl mx-auto border border-white/10 bg-[#080808] mb-16 shadow-2xl overflow-hidden hover:border-[#c6ff3d]/60 transition-colors">
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "1800 / 2400" }}
            >
              <Image
                src={aboutPhoto.file || "/photos/concrete-window-grille-portrait.webp"}
                alt={aboutPhoto.alt}
                width={aboutPhoto.width || 1800}
                height={aboutPhoto.height || 2400}
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Principles */}
          <div className="mb-20">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#f2f2f2] mb-8 pb-4 border-b border-white/10">
              Photographic Approach
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {principles.map((p, idx) => (
                <div
                  key={idx}
                  className="border border-white/10 p-6 space-y-3 bg-[#0a0a0a]"
                >
                  <h3 className="font-sans font-bold text-sm uppercase text-[#f2f2f2]">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* External Profiles with rel="me" and Descriptive Anchor Text */}
          <div className="mb-16 border-t border-white/10 pt-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] block mb-4">
              {"//"} CONNECT & PROFILES
            </span>
            <div className="flex flex-col sm:flex-row gap-6 font-mono text-xs uppercase">
              <a
                href="https://www.instagram.com/mojaddid_shashwoto/"
                target="_blank"
                rel="me noopener noreferrer"
                className="text-neutral-300 hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-2"
              >
                <span>Mojaddid Shashwoto on Instagram</span>
                <span className="text-[10px] text-neutral-500">↗</span>
              </a>
              <a
                href="https://www.facebook.com/Mojaddid.Shashwotoo/"
                target="_blank"
                rel="me noopener noreferrer"
                className="text-neutral-300 hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-2"
              >
                <span>Mojaddid Shashwoto on Facebook</span>
                <span className="text-[10px] text-neutral-500">↗</span>
              </a>
              <a
                href="https://mojaddidshashwoto.me"
                target="_blank"
                rel="me noopener noreferrer"
                className="text-neutral-300 hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-2"
              >
                <span>Mojaddid Shashwoto Personal Website</span>
                <span className="text-[10px] text-neutral-500">↗</span>
              </a>
            </div>
          </div>

          {/* Action Link */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-neutral-500">
              Inquiries
            </span>
            <Link
              href="/contact"
              className="px-6 py-3 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors"
            >
              Contact →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
