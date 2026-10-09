import { MetadataRoute } from "next";
import { photos } from "@/lib/photos";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mojaddidshashwoto.studio";
  const now = new Date();

  const photoImageUrls = photos.map((p) => `${baseUrl}${p.file}`);

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      images: photoImageUrls,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      images: photoImageUrls,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
