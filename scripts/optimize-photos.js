const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function optimize() {
  const rawDir = path.join(process.cwd(), "public", "photos", "raw");
  const outDir = path.join(process.cwd(), "public", "photos");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const rawFiles = [
    {
      id: "5920",
      filename: "5920.jpg",
      role: "hero",
      title: "Solitude by the Window Pane",
      category: "Portrait",
      alt: "Mojaddid Shashwoto standing in profile against a tall grid window with natural backlight",
      section: "hero",
      focalPoint: "center 42%",
      camera: "Canon / 35mm Prime",
      location: "Dhaka, Bangladesh",
      year: "2026",
      settings: "1/160s · f/2.2 · ISO 200",
      description: "A monumental silhouette framed by an architectural multi-pane window in soft daylight."
    },
    {
      id: "4762",
      filename: "4762.jpg",
      role: "about",
      title: "Contemplation by the Iron Grill",
      category: "Portrait",
      alt: "Black and white profile portrait of Mojaddid Shashwoto looking out an architectural grilled window",
      section: "about",
      focalPoint: "50% 25%",
      camera: "Canon / 50mm Prime",
      location: "Dhaka, Bangladesh",
      year: "2026",
      settings: "1/200s · f/2.0 · ISO 100",
      description: "Natural window light casting soft gradations across the photographer's profile against a textured wall."
    },
    {
      id: "4787",
      filename: "4787.jpg",
      role: "featured",
      title: "The Vanishing Canopy",
      category: "Street",
      alt: "Young man wearing a graphic hoodie walking away down a tree-canopied road",
      section: "featured",
      focalPoint: "center 45%",
      camera: "Canon / 35mm",
      location: "Sreemangal, Bangladesh",
      year: "2026",
      settings: "1/250s · f/2.8 · ISO 400",
      description: "A solitary traveler journeying down a lush tree-canopied asphalt road receding into distance."
    },
    {
      id: "4756",
      filename: "4756.jpg",
      role: "featured",
      title: "Peace Sign on Sand",
      category: "Street",
      alt: "High-contrast silhouette shadow of the photographer casting a peace sign on sand",
      section: "featured",
      focalPoint: "center 60%",
      camera: "Canon / 24mm",
      location: "Cox's Bazar, Bangladesh",
      year: "2026",
      settings: "1/500s · f/4.0 · ISO 100",
      description: "Graphic shadowplay and fine mineral textures capturing a playful human silhouette under midday sun."
    }
  ];

  const processedData = [];

  for (const item of rawFiles) {
    const rawPath = path.join(rawDir, item.filename);
    if (!fs.existsSync(rawPath)) {
      console.warn("Raw file not found:", rawPath);
      continue;
    }

    console.log("Optimizing:", item.filename);

    const image = sharp(rawPath);
    const metadata = await image.metadata();

    // Determine scale to ensure max 2400px on the longest edge
    const maxEdge = 2400;
    const isLandscape = metadata.width >= metadata.height;
    const targetWidth = isLandscape && metadata.width > maxEdge ? maxEdge : (!isLandscape && metadata.height > maxEdge ? null : metadata.width);
    const targetHeight = !isLandscape && metadata.height > maxEdge ? maxEdge : (isLandscape && metadata.width > maxEdge ? null : metadata.height);

    // Generate web-sized WebP
    const webpName = `${item.id}.webp`;
    const webpOutPath = path.join(outDir, webpName);
    const resized = image.clone().resize(targetWidth, targetHeight, { fit: "inside", withoutEnlargement: true });

    await resized
      .webp({ quality: 82, effort: 4 })
      .toFile(webpOutPath);

    // Also output JPEG version for broad compatibility
    const jpgName = `${item.id}.jpg`;
    const jpgOutPath = path.join(outDir, jpgName);
    await resized
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(jpgOutPath);

    // Generate small blur placeholder (10x10 base64)
    const blurBuffer = await image
      .clone()
      .resize(16, 16, { fit: "inside" })
      .webp({ quality: 20 })
      .toBuffer();
    const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

    const finalMeta = await sharp(webpOutPath).metadata();

    processedData.push({
      id: item.id,
      file: `/photos/${webpName}`,
      fallbackFile: `/photos/${jpgName}`,
      title: item.title,
      category: item.category,
      alt: item.alt,
      section: item.section,
      focalPoint: item.focalPoint,
      objectPosition: item.focalPoint,
      width: finalMeta.width,
      height: finalMeta.height,
      aspectRatio: `${finalMeta.width}:${finalMeta.height}`,
      blurDataURL: blurDataURL,
      year: item.year,
      location: item.location,
      camera: item.camera,
      settings: item.settings,
      description: item.description,
      featured: item.section === "hero" || item.section === "featured",
      horizontalGallery: item.section === "hero" || item.section === "featured"
    });

    // If hero, also copy/link to hero.webp and hero.jpg
    if (item.role === "hero") {
      fs.copyFileSync(webpOutPath, path.join(outDir, "hero.webp"));
      fs.copyFileSync(jpgOutPath, path.join(outDir, "hero.jpg"));
    }

    // If about, also copy to about.webp and about.jpg
    if (item.role === "about") {
      fs.copyFileSync(webpOutPath, path.join(outDir, "about.webp"));
      fs.copyFileSync(jpgOutPath, path.join(outDir, "about.jpg"));
    }
  }

  // Also include the other curated archival works to keep the collection comprehensive
  const otherArchive = [
    {
      id: "shibuya-twilight",
      file: "/photos/hero_featured.jpg",
      fallbackFile: "/photos/hero_featured.jpg",
      title: "Crosswalk at Twilight",
      category: "Street",
      alt: "Nocturnal rain reflections in Shibuya crosswalk under cyan neon glow",
      section: "archive",
      focalPoint: "center 50%",
      objectPosition: "center 50%",
      width: 1920,
      height: 1080,
      aspectRatio: "16:9",
      year: "2026",
      location: "Shibuya, Tokyo",
      camera: "Leica M11-P",
      settings: "1/125s · f/1.8 · ISO 800",
      description: "A solitary umbrella traveler cuts through electric reflections in Shibuya.",
      featured: true,
      horizontalGallery: true
    },
    {
      id: "monsoon-luminescence",
      file: "/photos/portrait_neon.jpg",
      fallbackFile: "/photos/portrait_neon.jpg",
      title: "Monsoon Luminescence",
      category: "Portrait",
      alt: "Atmospheric street portrait of a woman in Tokyo rain with cyan neon rim light",
      section: "archive",
      focalPoint: "center 30%",
      objectPosition: "center 30%",
      width: 1200,
      height: 1600,
      aspectRatio: "3:4",
      year: "2026",
      location: "Shinjuku, Tokyo",
      camera: "Sony α7R V",
      settings: "1/200s · f/1.4 · ISO 400",
      description: "Cyan neon light spills over wet rain jackets and reflective skin.",
      featured: true,
      horizontalGallery: true
    },
    {
      id: "midnight-noodle-cart",
      file: "/photos/street_cyberpunk.jpg",
      fallbackFile: "/photos/street_cyberpunk.jpg",
      title: "Midnight Noodle Cart",
      category: "Street",
      alt: "Hong Kong alleyway with steam rising from a midnight noodle cart beneath neon signs",
      section: "archive",
      focalPoint: "center 50%",
      objectPosition: "center 50%",
      width: 1800,
      height: 1200,
      aspectRatio: "3:2",
      year: "2025",
      location: "Mong Kok, Hong Kong",
      camera: "Leica Q3",
      settings: "1/160s · f/2.0 · ISO 1600",
      description: "Vapor rising into humid midnight air beneath the iconic neon signboards.",
      featured: true,
      horizontalGallery: true
    },
    {
      id: "aurora-fjord",
      file: "/photos/landscape_nordic.jpg",
      fallbackFile: "/photos/landscape_nordic.jpg",
      title: "Cyan Borealis over Fjord",
      category: "Landscape",
      alt: "Ethereal cyan aurora borealis dancing over snowy peaks and still fjord in Lofoten",
      section: "archive",
      focalPoint: "center 50%",
      objectPosition: "center 50%",
      width: 1920,
      height: 1080,
      aspectRatio: "16:9",
      year: "2025",
      location: "Reine, Lofoten",
      camera: "Hasselblad 907X",
      settings: "6.0s · f/4.0 · ISO 1250",
      description: "Sub-zero stillness under ribbons of cosmic cyan plasma dancing over the mirror-black Arctic fjord.",
      featured: true,
      horizontalGallery: true
    },
    {
      id: "brutalist-monolith",
      file: "/photos/architecture_brutalist.jpg",
      fallbackFile: "/photos/architecture_brutalist.jpg",
      title: "Brutalist Neon Monolith",
      category: "Architecture",
      alt: "Monumental concrete brutalist museum with a glowing horizontal cyan light slit",
      section: "archive",
      focalPoint: "center 40%",
      objectPosition: "center 40%",
      width: 1200,
      height: 1600,
      aspectRatio: "3:4",
      year: "2025",
      location: "Barbican Estate, London",
      camera: "GFX 100 II",
      settings: "1/60s · f/8.0 · ISO 200",
      description: "Sharp angular geometries of post-war textured concrete punctuated by cyan luminescence.",
      featured: false,
      horizontalGallery: false
    },
    {
      id: "starlit-solitude",
      file: "/photos/landscape_desert.jpg",
      fallbackFile: "/photos/landscape_desert.jpg",
      title: "Crimson Sands & Cyan Sky",
      category: "Landscape",
      alt: "Solitary silhouetted figure standing on undulating desert dunes under starry twilight",
      section: "archive",
      focalPoint: "center 50%",
      objectPosition: "center 50%",
      width: 1920,
      height: 1080,
      aspectRatio: "16:9",
      year: "2025",
      location: "Rub' al Khali, Arabian Desert",
      camera: "Sony α7R V",
      settings: "15s · f/1.4 · ISO 3200",
      description: "Rippling mineral wind dunes transitioning into the quiet cosmic depth of the deep celestial belt.",
      featured: false,
      horizontalGallery: false
    }
  ];

  const allPhotos = [...processedData, ...otherArchive];

  // Write swappable photos.json to public/photos/photos.json and public/photos.json
  const jsonContent = JSON.stringify(allPhotos, null, 2);
  fs.writeFileSync(path.join(outDir, "photos.json"), jsonContent);
  fs.writeFileSync(path.join(process.cwd(), "public", "photos.json"), jsonContent);

  console.log("Successfully optimized and generated photos.json with", allPhotos.length, "items.");
}

optimize().catch(err => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
