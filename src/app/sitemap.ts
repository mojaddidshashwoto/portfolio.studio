import { MetadataRoute } from "next";
import { photos, SUBJECTS, getPhotosBySubject } from "@/lib/photos";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mojaddidshashwoto.studio";
  const now = new Date();

  const photoImageUrls = photos.map((p) => `${baseUrl}${p.file}`);

  const subjectEntries: MetadataRoute.Sitemap = Object.values(SUBJECTS).map((subject) => ({
    url: `${baseUrl}/gallery/${subject.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
    images: getPhotosBySubject(subject.slug).map((p) => `${baseUrl}${p.file}`),
  }));

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
    ...subjectEntries,
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
