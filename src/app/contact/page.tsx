import type { Metadata } from "next";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with photographer Mojaddid Shashwoto for inquiries, prints, or questions regarding his photographic archive in Dhaka.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Mojaddid Shashwoto",
    description:
      "Get in touch with photographer Mojaddid Shashwoto for inquiries, prints, or questions regarding his photographic archive in Dhaka.",
    url: "https://mojaddidshashwoto.studio/contact",
    siteName: "Mojaddid Shashwoto",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Photographer Mojaddid Shashwoto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Mojaddid Shashwoto",
    description:
      "Get in touch with photographer Mojaddid Shashwoto for inquiries, prints, or questions regarding his photographic archive in Dhaka.",
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
      "name": "Contact",
      "item": "https://mojaddidshashwoto.studio/contact",
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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

        <ContactSection headingLevel="h1" />
      </div>
    </>
  );
}
