import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive",
  description: "Complete photographic archive by Mojaddid Shashwoto featuring street scenes, coastal landscapes, and portraiture.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
