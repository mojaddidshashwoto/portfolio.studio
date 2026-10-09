"use client";

import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#0a0a0a] text-[#f2f2f2] pt-20 pb-12 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Identity */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-sm bg-[#111] border border-white/10 p-1 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
                    <path d="M26 86V34L46 62L66 34V86" stroke="#f2f2f2" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                    <path d="M94 40H76V56H94V86H74" stroke="#f2f2f2" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                    <rect x="88" y="24" width="9" height="9" fill="#c6ff3d"/>
                  </svg>
                </div>
                <span className="font-display font-bold text-sm tracking-widest uppercase">
                  MOJADDID SHASHWOTO
                </span>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm font-light leading-relaxed">
                Photographer in Dhaka. Documenting urban architecture, street perspectives, and quiet
                portraits with deliberate attention to natural light, negative space, and geometry.
              </p>
            </div>

            <div className="font-mono text-xs text-neutral-500 uppercase">
              PHOTOGRAPHY ARCHIVE {"//"} 2026
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[#c6ff3d] uppercase tracking-widest block">
              {"//"} INDEX
            </span>
            <ul className="space-y-2 uppercase text-neutral-400">
              <li>
                <Link href="/#featured" className="hover:text-[#c6ff3d] transition-colors" data-cursor="hover">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#c6ff3d] transition-colors" data-cursor="hover">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#c6ff3d] transition-colors" data-cursor="hover">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c6ff3d] transition-colors" data-cursor="hover">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div className="md:col-span-3 flex flex-col justify-between space-y-6">
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[#c6ff3d] uppercase tracking-widest block">
                {"//"} SOCIAL
              </span>
              <div className="flex flex-col space-y-2 text-neutral-400 uppercase">
                <a
                  href="https://www.instagram.com/mojaddid_shashwoto/"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-1.5"
                  data-cursor="hover"
                >
                  <span>Mojaddid Shashwoto on Instagram</span>
                  <span className="text-[10px] text-neutral-500">↗</span>
                </a>
                <a
                  href="https://www.facebook.com/Mojaddid.Shashwotoo/"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-1.5"
                  data-cursor="hover"
                >
                  <span>Mojaddid Shashwoto on Facebook</span>
                  <span className="text-[10px] text-neutral-500">↗</span>
                </a>
                <a
                  href="https://mojaddidshashwoto.me"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-1.5"
                  data-cursor="hover"
                >
                  <span>Mojaddid Shashwoto (mojaddidshashwoto.me)</span>
                  <span className="text-[10px] text-neutral-500">↗</span>
                </a>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="font-mono text-xs text-[#c6ff3d] hover:underline uppercase tracking-widest text-left"
              data-cursor="hover"
            >
              [ ↑ RETURN TO TOP ]
            </button>
          </div>
        </div>

        {/* Giant Monolithic Signature */}
        <div className="pt-12 pb-6 overflow-hidden select-none">
          <span className="block font-display font-extrabold text-[12vw] leading-none text-white/[0.05] hover:text-[#c6ff3d]/10 transition-colors duration-500 uppercase tracking-tighter">
            SHASHWOTO
          </span>
        </div>

        {/* Bottom Colophon */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
          <span>© 2026 MOJADDID SHASHWOTO. ALL VISUAL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-3">
            <span>NEXT.JS / LENIS / GSAP</span>
            <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
            <span>DHAKA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
