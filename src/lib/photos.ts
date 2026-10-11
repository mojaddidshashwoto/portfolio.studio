import photosJson from "../../public/photos/photos.json";

export interface Photo {
  id: string;
  file: string;
  src: string; // Alias for backward compatibility
  alt: string;
  caption?: string;
  width: number;
  height: number;
  aspectRatio?: string;
  blurDataURL?: string;
  section?: "hero" | "about" | "featured" | "archive" | string;
  category?: string;
  subject?: string;
  featured?: boolean;
  horizontalGallery?: boolean;
  objectPosition?: string;
}

export interface RawPhotoItem {
  id: string;
  file: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  aspectRatio?: string;
  blurDataURL?: string;
  section?: string;
  category?: string;
  subject?: string;
  featured?: boolean;
  horizontalGallery?: boolean;
  objectPosition?: string;
  src?: string;
}

export const photos: Photo[] = (photosJson as RawPhotoItem[]).map((item) => ({
  ...item,
  src: item.file || item.src || "",
  caption: item.caption || "",
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

export function getFeaturedNonPortraitPhotos(): Photo[] {
  return photos
    .filter((p) => p.id !== "architectural-window-portrait" && p.category !== "Portrait")
    .slice(0, 8);
}

export function getPhotosByCategory(cat: Category): Photo[] {
  if (cat === "All") return photos;
  return photos.filter((p) => p.category === cat);
}

export interface SubjectMeta {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  plainDescription: string;
  photoIds: string[];
}

export const SUBJECTS: Record<string, SubjectMeta> = {
  "boats-rivers-and-coastlines": {
    slug: "boats-rivers-and-coastlines",
    title: "Boats, Rivers & Coastlines",
    metaTitle: "Boats, Rivers and Coastlines Photography | Mojaddid Shashwoto",
    description: "Photographs of wooden fishing boats, rivers, and coastal shores by Mojaddid Shashwoto, a photographer in Dhaka.",
    plainDescription: "Photographs of wooden fishing boats, river waters, and coastal shores.",
    photoIds: [
      "sampan-midday-sun",
      "river-sunset-boatmen",
      "red-sampan-fishermen",
      "blue-sampan-crew",
      "yellow-sampan-landing",
      "boats-on-grass",
      "boat-in-surf",
      "crimson-river-twilight",
      "fleet-shoreline",
      "rocky-shore-tide",
      "boats-flags-coast",
      "crescent-prow-sea",
      "solitary-walker-coastal-poles",
      "fishing-boat-rough-waves",
      "river-boats-bamboo-sunlight",
    ],
  },
  "everyday-life": {
    slug: "everyday-life",
    title: "Everyday Life",
    metaTitle: "Everyday Life Photography | Mojaddid Shashwoto",
    description: "Photographs of locomotives, railway tracks, markets, brick facades, and daily work by Mojaddid Shashwoto, a photographer in Dhaka.",
    plainDescription: "Photographs of passenger trains, railway tracks, roadside markets, and daily work.",
    photoIds: [
      "locomotive-6525",
      "railway-winter-fog",
      "market-railway-tracks",
      "train-window-view",
      "banknote-in-grass",
      "roadwork-mixer-smoke",
      "brick-facade-clear-sky",
    ],
  },
  "portraits": {
    slug: "portraits",
    title: "Portraits",
    metaTitle: "Portraits Photography | Mojaddid Shashwoto",
    description: "Photographs of people observed in natural light and window frames by Mojaddid Shashwoto, a photographer in Dhaka.",
    plainDescription: "Photographs of people in natural daylight, window frames, and quiet moments.",
    photoIds: [
      "architectural-window-portrait",
      "concrete-window-grille-portrait",
      "peace-sign-shadow-sand",
      "child-brick-window",
      "child-valley-window",
    ],
  },
  "nature": {
    slug: "nature",
    title: "Nature",
    metaTitle: "Nature Photography | Mojaddid Shashwoto",
    description: "Photographs of trees, foliage, flowers, and open skies by Mojaddid Shashwoto, a photographer in Dhaka.",
    plainDescription: "Photographs of trees, plants, blossoms, night stars, and cloudy skies.",
    photoIds: [
      "bare-branches-twilight",
      "plumeria-water",
      "palm-canopy-monsoon",
      "tree-lined-road-dhaka",
      "pink-flower-rain-droplets",
      "crescent-moon-night-sky",
      "yellow-flower-dark-foliage",
      "pigeons-bamboo-perch",
      "plumeria-moss-stone",
      "monsoon-clouds-paddy-field",
      "red-hibiscus-cyan-sky",
      "solitary-tree-starry-night",
      "pink-rose-woven-bamboo",
      "rose-foliage-shadow",
      "chimney-smoke-forested-hill",
    ],
  },
};

export const SUBJECT_SLUGS = Object.keys(SUBJECTS);

export function getPhotosBySubject(slug: string): Photo[] {
  const subject = SUBJECTS[slug];
  if (!subject) return [];
  const idSet = new Set(subject.photoIds);
  return photos.filter((p) => idSet.has(p.id));
}

