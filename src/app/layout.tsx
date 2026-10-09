import type { Metadata } from "next";
import { Space_Grotesk, Syne, Inter, JetBrains_Mono, Anton } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["700"],
});

const syne = Syne({
  variable: "--font-cinematic",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const anton = Anton({
  variable: "--font-hero-condensed",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mojaddidshashwoto.studio"),
  title: {
    default: "Mojaddid Shashwoto | Photographer in Dhaka",
    template: "%s | Mojaddid Shashwoto",
  },
  description:
    "Selected photographs and archive by Mojaddid Shashwoto, documenting architecture, street perspectives, and portraits in Dhaka.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mojaddidshashwoto.studio",
    title: "Mojaddid Shashwoto | Photographer in Dhaka",
    description:
      "Selected photographs and archive by Mojaddid Shashwoto, documenting architecture, street perspectives, and portraits in Dhaka.",
    siteName: "Mojaddid Shashwoto",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Photographic work by Mojaddid Shashwoto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mojaddid Shashwoto | Photographer in Dhaka",
    description:
      "Selected photographs and archive by Mojaddid Shashwoto, documenting architecture, street perspectives, and portraits in Dhaka.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/logo-mark.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://mojaddidshashwoto.studio/#person",
      "name": "Mojaddid Shashwoto",
      "url": "https://mojaddidshashwoto.studio",
      "jobTitle": "Photographer",
      "image": "https://mojaddidshashwoto.studio/photos/architectural-window-portrait.webp",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressCountry": "BD",
      },
      "sameAs": [
        "https://www.instagram.com/mojaddid_shashwoto/",
        "https://www.facebook.com/Mojaddid.Shashwotoo/",
        "https://mojaddidshashwoto.me",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://mojaddidshashwoto.studio/#website",
      "name": "Mojaddid Shashwoto",
      "url": "https://mojaddidshashwoto.studio",
      "publisher": {
        "@id": "https://mojaddidshashwoto.studio/#person",
      },
    },
    {
      "@type": "ImageGallery",
      "@id": "https://mojaddidshashwoto.studio/#gallery",
      "name": "Mojaddid Shashwoto Photography Archive",
      "url": "https://mojaddidshashwoto.studio/gallery",
      "creator": {
        "@id": "https://mojaddidshashwoto.studio/#person",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${inter.variable} ${jetbrainsMono.variable} ${anton.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] font-sans selection:bg-[#c6ff3d] selection:text-[#0a0a0a] flex flex-col justify-between">
        <CustomCursor />
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
