const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

// 1. Monogram SVG (Dark background / Dark theme: #0a0a0a bg with #f2f2f2 glyph & #c6ff3d accent)
// Geometric architectural "MS" glyph:
// M: Left column and chevron; S: stepped geometric balance with lime apex anchor.
const markSvgDark = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="16" fill="#0a0a0a"/>
  <!-- M glyph: precision geometric lines -->
  <path d="M26 86V34L46 62L66 34V86" stroke="#f2f2f2" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/>
  <!-- S glyph: interlocking geometric path -->
  <path d="M94 40H76V56H94V86H74" stroke="#f2f2f2" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/>
  <!-- Signature acid lime anchor accent -->
  <rect x="88" y="24" width="8" height="8" fill="#c6ff3d"/>
</svg>`;

// Monogram SVG without background (for inline navbar / footer embed)
const markGlyphSvg = `<svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 90V30L46 60L68 30V90" stroke="currentColor" stroke-width="9" stroke-linecap="square" stroke-linejoin="miter"/>
  <path d="M96 38H76V56H96V90H74" stroke="currentColor" stroke-width="9" stroke-linecap="square" stroke-linejoin="miter"/>
  <rect x="90" y="22" width="9" height="9" fill="#c6ff3d"/>
</svg>`;

// Monogram SVG Light theme
const markSvgLight = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="16" fill="#f4f4f4"/>
  <path d="M26 86V34L46 62L66 34V86" stroke="#0a0a0a" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/>
  <path d="M94 40H76V56H94V86H74" stroke="#0a0a0a" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/>
  <rect x="88" y="24" width="8" height="8" fill="#141414"/>
  <rect x="90" y="26" width="4" height="4" fill="#c6ff3d"/>
</svg>`;

// Wordmark SVG Dark theme: 420 x 80
const wordmarkDark = `<svg width="420" height="80" viewBox="0 0 420 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Mark icon on left -->
  <rect x="8" y="10" width="60" height="60" rx="10" fill="#121212" stroke="#222" stroke-width="1.5"/>
  <path d="M21 53V27L31 41L41 27V53" stroke="#f2f2f2" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
  <path d="M55 30H46V39H55V53H45" stroke="#f2f2f2" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
  <rect x="52" y="22" width="4" height="4" fill="#c6ff3d"/>
  
  <!-- Wordmark Text -->
  <text x="84" y="38" font-family="'Space Grotesk', 'Syne', -apple-system, sans-serif" font-size="20" font-weight="800" fill="#f2f2f2" letter-spacing="3">MOJADDID SHASHWOTO</text>
  <text x="84" y="56" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600" fill="#c6ff3d" letter-spacing="4">PHOTOGRAPHER / DHAKA</text>
</svg>`;

// Wordmark SVG Light theme
const wordmarkLight = `<svg width="420" height="80" viewBox="0 0 420 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="10" width="60" height="60" rx="10" fill="#f4f4f4" stroke="#e0e0e0" stroke-width="1.5"/>
  <path d="M21 53V27L31 41L41 27V53" stroke="#0a0a0a" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
  <path d="M55 30H46V39H55V53H45" stroke="#0a0a0a" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
  <rect x="52" y="22" width="4" height="4" fill="#0a0a0a"/>
  
  <text x="84" y="38" font-family="'Space Grotesk', 'Syne', -apple-system, sans-serif" font-size="20" font-weight="800" fill="#0a0a0a" letter-spacing="3">MOJADDID SHASHWOTO</text>
  <text x="84" y="56" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600" fill="#555555" letter-spacing="4">PHOTOGRAPHER / DHAKA</text>
</svg>`;

async function main() {
  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), markSvgDark);
  fs.writeFileSync(path.join(publicDir, 'logo-mark-light.svg'), markSvgLight);
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), wordmarkDark);
  fs.writeFileSync(path.join(publicDir, 'logo-light.svg'), wordmarkLight);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), markSvgDark);

  console.log('SVGs created successfully.');

  // Generate 32x32 Favicon PNG
  await sharp(Buffer.from(markSvgDark))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  await sharp(Buffer.from(markSvgDark))
    .resize(32, 32)
    .png()
    .toFile(path.join(appDir, 'icon.png'));

  // Generate 180x180 Apple Touch Icon PNG
  await sharp(Buffer.from(markSvgDark))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(Buffer.from(markSvgDark))
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  // Generate 512x512 Icon PNG
  await sharp(Buffer.from(markSvgDark))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  // Generate Rendered samples for preview at 32px, 128px, 512px
  await sharp(Buffer.from(markSvgDark))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'logo-preview-32.png'));

  await sharp(Buffer.from(markSvgDark))
    .resize(128, 128)
    .png()
    .toFile(path.join(publicDir, 'logo-preview-128.png'));

  await sharp(Buffer.from(markSvgDark))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo-preview-512.png'));

  // Update og-image.jpg: 1200x630 from hero photo + subtle monogram watermark in corner (56x56) without obstructing
  const watermarkBuffer = await sharp(Buffer.from(markSvgDark))
    .resize(56, 56)
    .png()
    .toBuffer();

  const heroPath = path.join(publicDir, 'photos', 'hero.webp');
  await sharp(heroPath)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .composite([
      {
        input: watermarkBuffer,
        top: 36,
        left: 36,
      }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, 'og-image.jpg'));

  console.log('Logo icons, previews, and og-image.jpg generated.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
