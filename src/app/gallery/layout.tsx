import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Complete photographic archive and selected work by Mojaddid Shashwoto.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
