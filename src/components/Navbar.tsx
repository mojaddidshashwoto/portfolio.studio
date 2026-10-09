"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "01/Selected Work", href: "/#featured" },
    { label: "02/Archive", href: "/gallery" },
    { label: "03/Profile", href: "/about" },
    { label: "04/Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/92 backdrop-blur-md border-b border-white/10 py-3 md:py-4 shadow-2xl"
            : "bg-[#0a0a0a]/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none py-3.5 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo with Monogram */}
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer group min-h-[44px]"
            data-cursor="hover"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-[#111] border border-white/15 group-hover:border-[#c6ff3d] p-1 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
                <path d="M26 86V34L46 62L66 34V86" stroke="#f2f2f2" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                <path d="M94 40H76V56H94V86H74" stroke="#f2f2f2" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                <rect x="88" y="24" width="9" height="9" fill="#c6ff3d"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xs sm:text-sm md:text-base uppercase tracking-tight text-[#f2f2f2] group-hover:text-[#c6ff3d] transition-colors">
              MOJADDID SHASHWOTO
            </span>
          </Link>

          {/* Desktop Nav Items with subtle dark blur backdrop */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`px-3 py-1.5 transition-colors relative min-h-[44px] flex items-center ${
                    isActive
                      ? "text-[#c6ff3d] font-semibold"
                      : "text-neutral-300 hover:text-white"
                  }`}
                  data-cursor="hover"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Contact Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="px-5 py-2 min-h-[44px] flex items-center border border-[#c6ff3d] text-[#c6ff3d] bg-[#0a0a0a]/60 backdrop-blur-sm hover:bg-[#c6ff3d] hover:text-[#0a0a0a] transition-colors uppercase tracking-widest text-xs font-mono font-semibold"
              data-cursor="hover"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Toggle Button (min 44px tap target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center text-neutral-300 hover:text-[#c6ff3d] border border-white/15 bg-[#0a0a0a]/90 backdrop-blur-md transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            data-cursor="hover"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Full-screen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] md:hidden flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
          {/* Top Bar inside overlay */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#111] border border-[#c6ff3d] p-1.5 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
                  <path d="M26 86V34L46 62L66 34V86" stroke="#f2f2f2" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                  <path d="M94 40H76V56H94V86H74" stroke="#f2f2f2" strokeWidth="9" strokeLinecap="square" strokeLinejoin="miter"/>
                  <rect x="88" y="24" width="9" height="9" fill="#c6ff3d"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#f2f2f2]">
                  MOJADDID SHASHWOTO
                </span>
                <span className="font-mono text-[10px] text-[#c6ff3d] uppercase tracking-widest">
                  Photographer, Dhaka
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-11 h-11 flex items-center justify-center text-neutral-300 hover:text-white border border-white/15 bg-[#111]"
              aria-label="Close navigation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links with Large Tap Targets */}
          <div className="py-8 flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#c6ff3d] mb-3">
              {"//"} NAVIGATION
            </span>
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[52px] py-3.5 border-b border-white/10 flex items-center justify-between font-display text-2xl sm:text-3xl font-bold uppercase transition-colors ${
                    isActive ? "text-[#c6ff3d]" : "text-[#f2f2f2] hover:text-[#c6ff3d]"
                  }`}
                >
                  <span>{item.label.split("/")[1] || item.label}</span>
                  <span className="font-mono text-xs text-neutral-500 font-normal">
                    0{idx + 1} →
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Actions & Details */}
          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[48px] flex items-center justify-center border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors"
            >
              Contact Photographer →
            </Link>

            <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest pt-2">
              <span>Dhaka, BD</span>
              <span>Portfolio 2026</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
