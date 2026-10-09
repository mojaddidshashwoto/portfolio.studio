import photosJson from "../../public/photos/photos.json";

export interface Photo {
  id: string;
  file: string;
  src: string; // Alias for backward compatibility
  alt: string;
  width: number;
  height: number;
  aspectRatio?: string;
  blurDataURL?: string;
  section?: "hero" | "about" | "featured" | "archive" | string;
  category?: string;
  featured?: boolean;
  horizontalGallery?: boolean;
  objectPosition?: string;
}

export interface RawPhotoItem {
  id: string;
  file: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio?: string;
  blurDataURL?: string;
  section?: string;
  category?: string;
  featured?: boolean;
  horizontalGallery?: boolean;
  objectPosition?: string;
  src?: string;
}

export const photos: Photo[] = (photosJson as RawPhotoItem[]).map((item) => ({
  ...item,
  src: item.file || item.src || "",
  objectPosition: item.objectPosition || "center center",
}));

export const categories = ["All", "Portrait", "Street", "Landscape"] as const;
export type Category = (typeof categories)[number];

export function getAllPhotos(): Photo[] {
  return photos;
}

export function getHeroPhoto(): Photo {
  return photos.find((p) => p.section === "hero") || photos[0];
}

export function getAboutPhoto(): Photo {
  return photos.find((p) => p.section === "about") || photos.find((p) => p.id === "concrete-window-grille-portrait") || photos[1];
}

export function getFeaturedPhotos(): Photo[] {
  return photos.filter((p) => p.featured || p.section === "featured" || p.section === "hero");
}

export function getHorizontalPhotos(): Photo[] {
  return photos.filter((p) => p.horizontalGallery || p.featured);
}

export function getPhotosByCategory(cat: Category): Photo[] {
  if (cat === "All") return photos;
  return photos.filter((p) => p.category === cat);
}
