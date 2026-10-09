import Link from "next/link";
import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "Contact",
  description: "Get in touch with photographer Mojaddid Shashwoto for inquiries, collaborations, and prints.",
};

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen pt-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-2 border-b border-white/10 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xs text-neutral-400 hover:text-[#c6ff3d] uppercase tracking-wider transition-colors"
        >
          ← Return To Index
        </Link>
        <span className="font-mono text-[11px] tracking-widest text-[#c6ff3d] uppercase px-2 py-0.5 border border-[#c6ff3d]/30 bg-[#c6ff3d]/5">
          Contact
        </span>
      </div>

      <ContactSection />
    </div>
  );
}
