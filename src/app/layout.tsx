import type { Metadata } from "next";
import { Space_Grotesk, Syne, Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://mojaddidshashwoto.studio"),
  title: {
    default: "Mojaddid Shashwoto, Photographer",
    template: "%s | Mojaddid Shashwoto",
  },
  description:
    "Selected photography by Mojaddid Shashwoto featuring portraits, street perspectives, and landscapes.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mojaddidshashwoto.studio",
    title: "Mojaddid Shashwoto, Photographer",
    description:
      "Selected photography by Mojaddid Shashwoto featuring portraits, street perspectives, and landscapes.",
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
    title: "Mojaddid Shashwoto, Photographer",
    description:
      "Selected photography by Mojaddid Shashwoto featuring portraits, street perspectives, and landscapes.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
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
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mojaddid Shashwoto",
  "url": "https://mojaddidshashwoto.studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
