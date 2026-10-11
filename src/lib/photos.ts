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
  "boats-and-coastlines": {
    slug: "boats-and-coastlines",
    title: "Boats & Coastlines",
    metaTitle: "Boats and Coastlines Photography | Mojaddid Shashwoto",
    description: "Photographs of fishing boats, wooden sampans, and coastal shorelines in Bangladesh by Mojaddid Shashwoto.",
    plainDescription: "Photographs of fishing boats, wooden sampans, and shorelines along the coast.",
    photoIds: [
      "sampan-midday-sun",
      "red-sampan-fishermen",
      "blue-sampan-crew",
      "yellow-sampan-landing",
      "boats-on-grass",
      "boat-in-surf",
      "fleet-shoreline",
      "rocky-shore-tide",
      "boats-flags-coast",
      "crescent-prow-sea",
      "solitary-walker-coastal-poles",
      "fishing-boat-rough-waves",
    ],
  },
  "rivers-and-light": {
    slug: "rivers-and-light",
    title: "Rivers & Light",
    metaTitle: "Rivers and Light Photography | Mojaddid Shashwoto",
    description: "Photographs of river water, evening reflections, and boatmen at dusk by Mojaddid Shashwoto.",
    plainDescription: "Photographs of river water, evening light, and boatmen at dusk.",
    photoIds: [
      "river-sunset-boatmen",
      "crimson-river-twilight",
      "river-boats-bamboo-sunlight",
    ],
  },
  "railways-and-everyday-life": {
    slug: "railways-and-everyday-life",
    title: "Railways & Everyday Life",
    metaTitle: "Railways and Everyday Life Photography | Mojaddid Shashwoto",
    description: "Photographs of railway tracks, locomotives, winter fog, and daily life by Mojaddid Shashwoto.",
    plainDescription: "Photographs of train lines, winter fog along the tracks, and everyday scenes.",
    photoIds: [
      "locomotive-6525",
      "tree-lined-road-dhaka",
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
    description: "Quiet portraits and candid human moments framed by architecture and natural light by Mojaddid Shashwoto.",
    plainDescription: "Portraits captured through architectural frames and quiet encounters.",
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
    description: "Photographs of trees, monsoon flora, rain droplets, and night skies by Mojaddid Shashwoto.",
    plainDescription: "Photographs of trees, monsoon flora, rain droplets, and night skies.",
    photoIds: [
      "bare-branches-twilight",
      "plumeria-water",
      "palm-canopy-monsoon",
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

