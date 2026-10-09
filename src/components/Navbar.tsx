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
        transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer group"
            data-cursor="hover"
          >
            <span className="w-2 h-2 bg-[#c6ff3d] group-hover:rotate-45 transition-transform" />
            <span className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-[#f2f2f2] group-hover:text-[#c6ff3d] transition-colors">
              MOJADDID SHASHWOTO
            </span>
          </Link>

          {/* Desktop Nav Items with subtle dark blur backdrop */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0a0a0a]/75 backdrop-blur-md border border-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`px-3 py-1 transition-colors relative ${
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

          {/* Contact Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="px-4 py-1.5 border border-[#c6ff3d] text-[#c6ff3d] bg-[#0a0a0a]/60 backdrop-blur-sm hover:bg-[#c6ff3d] hover:text-[#0a0a0a] transition-colors uppercase tracking-widest text-xs font-mono font-semibold"
              data-cursor="hover"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-[#c6ff3d] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm"
            aria-label="Toggle Navigation"
            data-cursor="hover"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a] md:hidden pt-28 px-8 flex flex-col justify-between pb-12 border-b border-white/10">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d]">
              {"//"} INDEX
            </span>
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-4 border-b border-white/10 font-display text-2xl font-bold uppercase text-[#f2f2f2] hover:text-[#c6ff3d] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col gap-4 font-mono text-xs">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-bold uppercase tracking-widest"
            >
              Book 2026
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
