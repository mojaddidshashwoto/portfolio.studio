import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography Archive",
  description:
    "Explore the photography archive by Mojaddid Shashwoto, documenting architecture, street perspectives, and portraits in Dhaka.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Photography Archive | Mojaddid Shashwoto",
    description:
      "Explore the photography archive by Mojaddid Shashwoto, documenting architecture, street perspectives, and portraits in Dhaka.",
    url: "https://mojaddidshashwoto.studio/gallery",
    siteName: "Mojaddid Shashwoto",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Photographic Archive by Mojaddid Shashwoto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography Archive | Mojaddid Shashwoto",
    description:
      "Explore the photography archive by Mojaddid Shashwoto, documenting architecture, street perspectives, and portraits in Dhaka.",
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
      "name": "Archive",
      "item": "https://mojaddidshashwoto.studio/gallery",
    },
  ],
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
