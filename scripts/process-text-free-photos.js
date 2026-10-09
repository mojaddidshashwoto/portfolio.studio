const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rawDir = path.join(process.cwd(), 'public/photos/raw');
const photosDir = path.join(process.cwd(), 'public/photos');

// 9 Demo files to delete
const demoFiles = [
  'hero_featured.jpg',
  'portrait_neon.jpg',
  'street_cyberpunk.jpg',
  'landscape_nordic.jpg',
  'architecture_brutalist.jpg',
  'landscape_desert.jpg',
  'portrait_editorial.jpg',
  'street_transit.jpg',
  'about_artist.jpg'
];

// 25 Valid Photos configuration
const photoConfigs = [
  {
    rawFile: '5920.jpg',
    id: '5920',
    slug: '5920',
    section: 'hero',
    category: 'Portrait',
    alt: 'Profile portrait framed against a tall architectural window in natural backlight',
    objectPosition: 'center 42%',
    featured: true,
    horizontalGallery: true
  },
  {
    rawFile: '4762.jpg',
    id: '4762',
    slug: '4762',
    section: 'about',
    category: 'Portrait',
    alt: 'Profile portrait looking through an iron window grille against textured concrete wall',
    objectPosition: '50% 25%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20261003_144450 (1).jpg',
    id: 'locomotive-6525',
    slug: 'locomotive-6525',
    section: 'featured',
    category: 'Street',
    alt: 'Passengers and commuters riding on a blue diesel locomotive under an elevated flyover in Dhaka',
    objectPosition: 'center 50%',
    featured: true,
    horizontalGallery: true
  },
  {
    rawFile: '4787.jpg',
    id: '4787',
    slug: '4787',
    section: 'featured',
    category: 'Street',
    alt: 'Young man walking away down a tree-canopied road receding into distance',
    objectPosition: 'center 45%',
    featured: true,
    horizontalGallery: true
  },
  {
    rawFile: '4756.jpg',
    id: '4756',
    slug: '4756',
    section: 'featured',
    category: 'Street',
    alt: 'High-contrast shadow of the photographer casting a peace sign on sand',
    objectPosition: 'center 60%',
    featured: true,
    horizontalGallery: true
  },
  {
    rawFile: 'IMG_20230715_183116.jpg',
    id: 'river-sunset-boatmen',
    slug: 'river-sunset-boatmen',
    section: 'featured',
    category: 'Landscape',
    alt: 'Silhouetted boatmen on a river under dramatic clouds and setting sun',
    objectPosition: 'center 50%',
    featured: true,
    horizontalGallery: true
  },
  {
    rawFile: '20260909_151556.jpg',
    id: 'sampan-midday-sun',
    slug: 'sampan-midday-sun',
    section: 'featured',
    category: 'Landscape',
    alt: 'Crescent wooden fishing boat casting long shadow on beach sand under bright sun',
    objectPosition: 'center 50%',
    featured: true,
    horizontalGallery: true
  },
  {
    rawFile: 'IMG_20240124_102954.jpg',
    id: 'railway-winter-fog',
    slug: 'railway-winter-fog',
    section: 'featured',
    category: 'Street',
    alt: 'Single railway track disappearing into dense morning winter fog with walking pedestrians',
    objectPosition: 'center 50%',
    featured: true,
    horizontalGallery: true
  },
  {
    rawFile: 'IMG_20260909_151512.jpg',
    id: 'red-sampan-fishermen',
    slug: 'red-sampan-fishermen',
    section: 'featured',
    category: 'Street',
    alt: 'Fishermen hauling white nets beside a large red crescent moon boat on the shore',
    objectPosition: 'center 50%',
    featured: true,
    horizontalGallery: true
  },
  {
    rawFile: 'IMG_20251025_165416 (1).jpg',
    id: 'child-brick-window',
    slug: 'child-brick-window',
    section: 'archive',
    category: 'Portrait',
    alt: 'Child waving from behind a dark window grille in a rustic brick wall',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20240425_015355.jpg',
    id: 'child-valley-window',
    slug: 'child-valley-window',
    section: 'archive',
    category: 'Portrait',
    alt: 'Child silhouetted at a barred window overlooking a sunlit green hillside',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20261003_155610 (2).jpg',
    id: 'market-railway-tracks',
    slug: 'market-railway-tracks',
    section: 'archive',
    category: 'Street',
    alt: 'Wide perspective of railway tracks, bustling market stalls, and oncoming passenger train',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20240125_100701.jpg',
    id: 'train-window-view',
    slug: 'train-window-view',
    section: 'archive',
    category: 'Street',
    alt: 'View looking along the side of a moving passenger train into misty countryside',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20260909_151517.jpg',
    id: 'blue-sampan-crew',
    slug: 'blue-sampan-crew',
    section: 'archive',
    category: 'Street',
    alt: 'Crew working with fishing nets around a blue crescent boat on the beach',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20260909_151254.jpg',
    id: 'yellow-sampan-landing',
    slug: 'yellow-sampan-landing',
    section: 'archive',
    category: 'Street',
    alt: 'Yellow wooden moon boat with black flags on the sand with workers sorting nets',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: '20260909_152603.jpg',
    id: 'boats-on-grass',
    slug: 'boats-on-grass',
    section: 'archive',
    category: 'Landscape',
    alt: 'Traditional wooden boats resting on grass before a dense pine forest',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: '20260909_150724.jpg',
    id: 'boat-in-surf',
    slug: 'boat-in-surf',
    section: 'archive',
    category: 'Landscape',
    alt: 'Wooden moon boat entering the breaking sea waves at low tide',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20240623_184313 (1).jpg',
    id: 'crimson-river-twilight',
    slug: 'crimson-river-twilight',
    section: 'archive',
    category: 'Landscape',
    alt: 'Vertical view of calm river and dark horizon under deep crimson sunset sky',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20260909_151521.jpg',
    id: 'fleet-shoreline',
    slug: 'fleet-shoreline',
    section: 'archive',
    category: 'Landscape',
    alt: 'Multiple traditional crescent boats lined up along the coastal sand by the treeline',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20260909_144955.jpg',
    id: 'rocky-shore-tide',
    slug: 'rocky-shore-tide',
    section: 'archive',
    category: 'Landscape',
    alt: 'Rocky coastline with dark stones in the foreground and a solitary boat on the sea horizon',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20260909_151249.jpg',
    id: 'boats-flags-coast',
    slug: 'boats-flags-coast',
    section: 'archive',
    category: 'Landscape',
    alt: 'Wide perspective of fishing boats with colorful flags along the open beach',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20260909_151542.jpg',
    id: 'crescent-prow-sea',
    slug: 'crescent-prow-sea',
    section: 'archive',
    category: 'Landscape',
    alt: 'Close-up perspective of the curved wooden bow of a boat overlooking the ocean',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20240224_181458.jpg',
    id: 'bare-branches-twilight',
    slug: 'bare-branches-twilight',
    section: 'archive',
    category: 'Landscape',
    alt: 'Silhouette of intricate tree branches against a soft twilight sky',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20251107_131147.jpg',
    id: 'plumeria-water',
    slug: 'plumeria-water',
    section: 'archive',
    category: 'Landscape',
    alt: 'White and yellow plumeria flowers blooming on lush green tree over calm water',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  },
  {
    rawFile: 'IMG_20260614_132725.jpg',
    id: 'palm-canopy-monsoon',
    slug: 'palm-canopy-monsoon',
    section: 'archive',
    category: 'Landscape',
    alt: 'Looking upward through palm fronds into dramatic white clouds and blue sky',
    objectPosition: 'center 50%',
    featured: false,
    horizontalGallery: false
  }
];

async function main() {
  console.log('1. Deleting demo files...');
  for (const df of demoFiles) {
    const full = path.join(photosDir, df);
    if (fs.existsSync(full)) {
      fs.unlinkSync(full);
      console.log('Deleted demo file:', df);
    }
  }

  console.log('2. Optimizing 25 valid photos into WebP...');
  const jsonEntries = [];

  for (const cfg of photoConfigs) {
    const inputPath = path.join(rawDir, cfg.rawFile);
    const outFileName = `${cfg.slug}.webp`;
    const outputPath = path.join(photosDir, outFileName);

    if (!fs.existsSync(inputPath)) {
      console.error('Missing raw file:', inputPath);
      continue;
    }

    const meta = await sharp(inputPath).metadata();
    const origWidth = meta.width;
    const origHeight = meta.height;
    const isLandscape = origWidth >= origHeight;

    const pipeline = sharp(inputPath);
    if (Math.max(origWidth, origHeight) > 2400) {
      if (isLandscape) {
        pipeline.resize(2400, null, { withoutEnlargement: true });
      } else {
        pipeline.resize(null, 2400, { withoutEnlargement: true });
      }
    }

    await pipeline.webp({ quality: 80 }).toFile(outputPath);
    const outMeta = await sharp(outputPath).metadata();

    // Generate small blur placeholder
    const blurBuffer = await sharp(outputPath)
      .resize(16, 16, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer();
    const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    console.log(`Optimized ${cfg.rawFile} -> ${outFileName} (${outMeta.width}x${outMeta.height})`);

    // Pure text-free record: NO title, NO camera, NO lens, NO settings, NO location, NO year!
    jsonEntries.push({
      id: cfg.id,
      file: `/photos/${outFileName}`,
      alt: cfg.alt,
      width: outMeta.width,
      height: outMeta.height,
      aspectRatio: `${outMeta.width}:${outMeta.height}`,
      blurDataURL: blurDataURL,
      section: cfg.section,
      category: cfg.category,
      featured: cfg.featured,
      horizontalGallery: cfg.horizontalGallery,
      objectPosition: cfg.objectPosition
    });
  }

  // Also ensure hero.webp and about.webp copies exist for any direct fallback
  fs.copyFileSync(path.join(photosDir, '5920.webp'), path.join(photosDir, 'hero.webp'));
  fs.copyFileSync(path.join(photosDir, '4762.webp'), path.join(photosDir, 'about.webp'));

  console.log('3. Writing text-free photos.json...');
  const jsonContent = JSON.stringify(jsonEntries, null, 2);
  fs.writeFileSync(path.join(photosDir, 'photos.json'), jsonContent, 'utf-8');
  fs.writeFileSync(path.join(process.cwd(), 'public/photos.json'), jsonContent, 'utf-8');

  console.log(`SUCCESS: Processed ${jsonEntries.length} photos. Deleted demo files.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
