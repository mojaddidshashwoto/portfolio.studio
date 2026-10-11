const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rawDir = path.join(process.cwd(), 'public/photos/raw');
const photosDir = path.join(process.cwd(), 'public/photos');
const jsonPath = path.join(photosDir, 'photos.json');
const rootJsonPath = path.join(process.cwd(), 'public/photos.json');

// Configuration and metadata mapping for raw files
// Only describes visible content, strictly no invented facts, camera info, or dates
// Caption guidelines:
// - One line, 5 to 12 words in English.
// - Concrete, observational, quiet photographer's note describing what is visible.
// - No clichés (no "dance", "whisper", "tapestry", "symphony", "canvas", "golden hour magic").
// - No ending quotes, no emoji, no hashtags, no em-dashes.
// - Gentle and neutral for people/children.
// - Optional: set to "" to leave empty without blank space.
const knownMetadata = {
  '20210804_163506-01.jpeg': {
    slug: 'banknote-in-grass',
    category: 'Street',
    subject: 'railways-and-everyday-life',
    alt: 'A 50 Taka banknote resting on grass with a green plant shoot growing over it',
    caption: 'Folded currency pressed flat under fresh clover stems.',
    objectPosition: 'center 50%'
  },
  '20210817_152900-01-02.jpeg': {
    slug: 'pink-flower-rain-droplets',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Vivid pink flower with water droplets on petals against dark background',
    caption: 'Heavy water beads cling to a single pink petal.',
    objectPosition: 'center 50%'
  },
  '20210910_185856.jpg': {
    slug: 'crescent-moon-night-sky',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Bright crescent moon isolated in dark night sky',
    caption: 'One thin silver arc in deep black.',
    objectPosition: 'center 50%'
  },
  'IMG_20240404_144133.jpg': {
    slug: 'yellow-flower-dark-foliage',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Single yellow flower blooming amidst dense dark green leaves in low light',
    caption: 'Sharp yellow center among heavy green shadow.',
    objectPosition: 'center 50%'
  },
  'IMG_20240911_173428.jpg': {
    slug: 'pigeons-bamboo-perch',
    category: 'Street',
    subject: 'nature',
    alt: 'Row of pigeons and doves perched along a bamboo frame under overcast sky',
    caption: 'Grey feathers huddle along a wet bamboo rail.',
    objectPosition: 'center 50%'
  },
  'IMG_20260910_125219.jpg': {
    slug: 'solitary-walker-coastal-poles',
    category: 'Landscape',
    subject: 'boats-and-coastlines',
    alt: 'Solitary figure walking across sandy beach towards wooden poles in breaking waves',
    caption: 'Footprints lead out toward vertical stakes in the wash.',
    objectPosition: 'center 50%'
  },
  'IMG_20260910_125314.jpg': {
    slug: 'fishing-boat-rough-waves',
    category: 'Landscape',
    subject: 'boats-and-coastlines',
    alt: 'Small wooden boat carrying crew navigating whitecaps and turbulent sea waves',
    caption: 'Men steady the rudder through chopped gray crests.',
    objectPosition: 'center 50%'
  },
  // 10 Newly Added Photos from public/photos/raw/
  'IMG_20230920_165104.jpg': {
    slug: 'plumeria-moss-stone',
    category: 'Landscape',
    subject: 'nature',
    alt: 'White and yellow plumeria blossom resting on a mossy stone wall in deep shadow',
    caption: 'Fallen white petals rest against green moss and dark leaves.',
    objectPosition: 'center 50%'
  },
  'IMG_20230924_170601.jpg': {
    slug: 'monsoon-clouds-paddy-field',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Wide green paddy fields bordered by trees beneath dark monsoon storm clouds',
    caption: 'Heavy gray rain clouds gather over wide green rice fields.',
    objectPosition: 'center 50%'
  },
  'IMG_20231027_155817.jpg': {
    slug: 'red-hibiscus-cyan-sky',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Branch of red sleeping hibiscus blossoms reaching diagonally across a blue sky',
    caption: 'Red blossoms stretch upward against clear open sky.',
    objectPosition: 'center 50%'
  },
  'IMG_20231119_205504.jpg': {
    slug: 'solitary-tree-starry-night',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Tall solitary tree reaching into a clear night sky filled with stars',
    caption: 'A bare trunk rises toward distant stars in the blue night.',
    objectPosition: 'center 50%'
  },
  'IMG_20240130_150716.jpg': {
    slug: 'pink-rose-woven-bamboo',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Pink rose in bloom set against a weathered woven bamboo wall',
    caption: 'One open pink rose blooms before a woven bamboo lattice.',
    objectPosition: 'center 50%'
  },
  'IMG_20240131_104609 (1).jpg': {
    slug: 'rose-foliage-shadow',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Pink rose blossom framed by dense dark green leaves and stems',
    caption: 'Soft pink petals emerge from deep green garden shadows.',
    objectPosition: 'center 50%'
  },
  'IMG_20240316_164641.jpg': {
    slug: 'roadwork-mixer-smoke',
    category: 'Street',
    subject: 'railways-and-everyday-life',
    alt: 'Roadwork asphalt mixer billowing dark smoke across an open clearing with workers',
    caption: 'Dark smoke rolls from an iron boiler across open ground.',
    objectPosition: 'center 50%'
  },
  'IMG_20240627_170640.jpg': {
    slug: 'river-boats-bamboo-sunlight',
    category: 'Landscape',
    subject: 'rivers-and-light',
    alt: 'Narrow wooden boats resting in calm river water beneath overhanging bamboo fronds',
    caption: 'Afternoon sun filters through bamboo leaves over moored river boats.',
    objectPosition: 'center 50%'
  },
  'IMG_20250901_141627.jpg': {
    slug: 'brick-facade-clear-sky',
    category: 'Street',
    subject: 'railways-and-everyday-life',
    alt: 'Multi-story red brick buildings with repetitive square windows under clear blue sky',
    caption: 'Sunlit red brick facades angle up into vivid sky.',
    objectPosition: 'center 50%'
  },
  'IMG_20260909_145909.jpg': {
    slug: 'chimney-smoke-forested-hill',
    category: 'Landscape',
    subject: 'nature',
    alt: 'Dense forested green hill with pale smoke rising from a chimney below',
    caption: 'Thin smoke drifts upward into dense hillside trees.',
    objectPosition: 'center 50%'
  }
};

// Known files to skip with documented rationale
const skipList = {
  '4802.jpg': 'Under 1500px on the long edge (dimensions 500x500 px)',
  'IMG_20230715_183119.jpg': 'Near-duplicate burst shot of existing photo river-sunset-boatmen (IMG_20230715_183116.jpg)',
  'IMG_20261004_041335.jpg': 'Near-duplicate alternate framing of existing photo market-railway-tracks (IMG_20261003_155610 (2).jpg)',
  'IMG_20231119_205232.jpg': 'Near-duplicate test exposure of solitary-tree-starry-night (IMG_20231119_205504.jpg) with high sensor noise and lens flare streak'
};

async function main() {
  console.log('--- Scanning public/photos/raw/ for new photos ---');
  if (!fs.existsSync(rawDir)) {
    console.error('Raw directory not found:', rawDir);
    process.exit(1);
  }

  const existingEntries = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const existingIds = new Set(existingEntries.map(e => e.id));
  const existingFiles = new Set(existingEntries.map(e => path.basename(e.file)));

  const allRawFiles = fs.readdirSync(rawDir).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f));
  console.log(`Found ${allRawFiles.length} raw files in ${rawDir}`);

  const processedEntries = [];
  const skippedFiles = [];

  for (const rawFile of allRawFiles) {
    const rawPath = path.join(rawDir, rawFile);

    // 1. Check if file is in skip list
    if (skipList[rawFile]) {
      skippedFiles.push({ file: rawFile, reason: skipList[rawFile] });
      continue;
    }

    // 2. Read image metadata
    const meta = await sharp(rawPath).metadata();
    const longEdge = Math.max(meta.width, meta.height);

    // 3. Check resolution threshold (< 1500px)
    if (longEdge < 1500) {
      skippedFiles.push({ file: rawFile, reason: `Under 1500px on long edge (${meta.width}x${meta.height})` });
      continue;
    }

    // 4. Determine configuration
    const config = knownMetadata[rawFile];
    if (!config) {
      // Unmapped file (already processed under old name or unlisted)
      // Check if any existing entry matches this raw file directly
      continue;
    }

    const outSlug = config.slug;
    const outFileName = `${outSlug}.webp`;
    const outPath = path.join(photosDir, outFileName);

    // 5. Guard against overwriting existing photos
    if (existingIds.has(outSlug) || existingFiles.has(outFileName)) {
      console.log(`[ALREADY LIVE] ${outSlug} (${outFileName}) already exists in photos.json. Skipping re-processing.`);
      continue;
    }

    console.log(`[PROCESSING] Adding new photo: ${rawFile} -> ${outFileName}...`);

    // 6. Generate optimized WebP (max 2400px on long edge, quality ~80)
    const pipeline = sharp(rawPath);
    if (longEdge > 2400) {
      if (meta.width >= meta.height) {
        pipeline.resize(2400, null, { withoutEnlargement: true });
      } else {
        pipeline.resize(null, 2400, { withoutEnlargement: true });
      }
    }

    await pipeline.webp({ quality: 80 }).toFile(outPath);
    const outMeta = await sharp(outPath).metadata();

    // 7. Generate blur placeholder
    const blurBuffer = await sharp(outPath)
      .resize(16, 16, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer();
    const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    // 8. Create new photos.json entry (Archive only, text-free, poetic caption)
    const newEntry = {
      id: outSlug,
      file: `/photos/${outFileName}`,
      alt: config.alt,
      caption: config.caption || '',
      width: outMeta.width,
      height: outMeta.height,
      aspectRatio: `${outMeta.width}:${outMeta.height}`,
      blurDataURL: blurDataURL,
      section: 'archive',
      category: config.category,
      subject: config.subject,
      featured: false,
      horizontalGallery: false,
      objectPosition: config.objectPosition || 'center 50%'
    };

    processedEntries.push(newEntry);
    console.log(`✓ Generated ${outFileName} (${outMeta.width}x${outMeta.height})`);
  }

  // Print summary of skipped files
  if (skippedFiles.length > 0) {
    console.log('\n--- Skipped Files ---');
    for (const s of skippedFiles) {
      console.log(`- ${s.file}: ${s.reason}`);
    }
  }

  if (processedEntries.length === 0) {
    console.log('\nNo new photos to add.');
    return;
  }

  // Append new entries to photos.json
  const updatedPhotos = [...existingEntries, ...processedEntries];
  const jsonContent = JSON.stringify(updatedPhotos, null, 2);

  fs.writeFileSync(jsonPath, jsonContent, 'utf8');
  if (fs.existsSync(rootJsonPath)) {
    fs.writeFileSync(rootJsonPath, jsonContent, 'utf8');
  }

  console.log(`\nSUCCESS: Added ${processedEntries.length} new photos to Archive!`);
  console.log(`Total photos now live: ${updatedPhotos.length}`);
}

main().catch(err => {
  console.error('Error adding photos:', err);
  process.exit(1);
});
