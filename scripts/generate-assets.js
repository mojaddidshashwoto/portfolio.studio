const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function run() {
  const publicDir = path.join(__dirname, '..', 'public');
  const heroPath = path.join(publicDir, 'photos', 'hero.webp');

  // 1. Generate 1200x630 OG image from hero photo, no text overlay, high quality JPEG
  await sharp(heroPath)
    .resize(1200, 630, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, 'og-image.jpg'));
  console.log('og-image.jpg generated (1200x630)');

  // 2. Generate Apple touch icon (180x180 PNG): Dark #0a0a0a background with acid lime #c6ff3d accent / "MS"
  const appleSvg = `
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="180" height="180" fill="#0a0a0a"/>
      <rect x="20" y="20" width="140" height="140" rx="28" fill="#141414" stroke="#222" stroke-width="2"/>
      <rect x="36" y="36" width="16" height="16" fill="#c6ff3d"/>
      <text x="90" y="112" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="54" fill="#f2f2f2" text-anchor="middle" letter-spacing="-2">MS</text>
    </svg>
  `;
  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png generated (180x180)');

  // 3. Generate favicon (32x32 PNG and SVG)
  const faviconSvg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0a0a0a"/>
      <rect x="7" y="7" width="18" height="18" rx="2" fill="#0a0a0a" stroke="#c6ff3d" stroke-width="2.5"/>
      <rect x="12" y="12" width="8" height="8" fill="#c6ff3d"/>
    </svg>
  `;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg.trim());

  await sharp(Buffer.from(faviconSvg))
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  
  // Also put a copy in src/app/icon.png for Next.js app router metadata icon convention
  await sharp(Buffer.from(faviconSvg))
    .png()
    .toFile(path.join(__dirname, '..', 'src', 'app', 'icon.png'));

  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile(path.join(__dirname, '..', 'src', 'app', 'apple-icon.png'));

  console.log('Favicons and app icons generated successfully.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
