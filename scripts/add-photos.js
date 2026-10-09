const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rawDir = path.join(process.cwd(), 'public/photos/raw');
const photosDir = path.join(process.cwd(), 'public/photos');
const jsonPath = path.join(photosDir, 'photos.json');
const rootJsonPath = path.join(process.cwd(), 'public/photos.json');

// Configuration and metadata mapping for raw files
// Only describes visible content, strictly no invented facts, camera info, or dates
const knownMetadata = {
  '20210804_163506-01.jpeg': {
    slug: 'banknote-in-grass',
    category: 'Street',
    alt: 'A 50 Taka banknote resting on grass with a green plant shoot growing over it',
    objectPosition: 'center 50%'
  },
  '20210817_152900-01-02.jpeg': {
    slug: 'pink-flower-rain-droplets',
    category: 'Landscape',
    alt: 'Vivid pink flower with water droplets on petals against dark background',
    objectPosition: 'center 50%'
  },
  '20210910_185856.jpg': {
    slug: 'crescent-moon-night-sky',
    category: 'Landscape',
    alt: 'Bright crescent moon isolated in dark night sky',
    objectPosition: 'center 50%'
  },
  'IMG_20240404_144133.jpg': {
    slug: 'yellow-flower-dark-foliage',
    category: 'Landscape',
    alt: 'Single yellow flower blooming amidst dense dark green leaves in low light',
    objectPosition: 'center 50%'
  },
  'IMG_20240911_173428.jpg': {
    slug: 'pigeons-bamboo-perch',
    category: 'Street',
    alt: 'Row of pigeons and doves perched along a bamboo frame under overcast sky',
    objectPosition: 'center 50%'
  },
  'IMG_20260910_125219.jpg': {
    slug: 'solitary-walker-coastal-poles',
    category: 'Landscape',
    alt: 'Solitary figure walking across sandy beach towards wooden poles in breaking waves',
    objectPosition: 'center 50%'
  },
  'IMG_20260910_125314.jpg': {
    slug: 'fishing-boat-rough-waves',
    category: 'Landscape',
    alt: 'Small wooden boat carrying crew navigating whitecaps and turbulent sea waves',
    objectPosition: 'center 50%'
  }
};

// Known files to skip with documented rationale
const skipList = {
  '4802.jpg': 'Under 1500px on the long edge (dimensions 500x500 px)',
  'IMG_20230715_183119.jpg': 'Near-duplicate burst shot of existing photo river-sunset-boatmen (IMG_20230715_183116.jpg)',
  'IMG_20261004_041335.jpg': 'Near-duplicate alternate framing of existing photo market-railway-tracks (IMG_20261003_155610 (2).jpg)'
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

    // 8. Create new photos.json entry (Archive only, text-free, no invented facts)
    const newEntry = {
      id: outSlug,
      file: `/photos/${outFileName}`,
      alt: config.alt,
      width: outMeta.width,
      height: outMeta.height,
      aspectRatio: `${outMeta.width}:${outMeta.height}`,
      blurDataURL: blurDataURL,
      section: 'archive',
      category: config.category,
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
