import Link from "next/link";
import Image from "next/image";
import { getAboutPhoto } from "@/lib/photos";

export const metadata = {
  title: "Profile",
  description: "Photographer profile and visual principles of Mojaddid Shashwoto, working with natural light and geometric stillness.",
};

export default function AboutPage() {
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

  return (
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

        {/* Hero Header */}
        <div className="mb-14">
          <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-4 inline-flex items-center gap-2 px-2.5 py-1 border border-[#c6ff3d]/30 bg-[#c6ff3d]/5">
            <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
            <span>Profile</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase text-[#f2f2f2] leading-[0.88]">
            Mojaddid Shashwoto
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 font-light mt-6 max-w-3xl leading-relaxed">
            Photographer based in Dhaka. Documenting urban geometry, streetscapes, and quiet
            portraits with deliberate attention to natural light, negative space, and authentic human presence.
          </p>
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
                <h3 className="font-sans font-bold text-sm uppercase text-[#f2f2f2]">{p.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
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
  );
}
