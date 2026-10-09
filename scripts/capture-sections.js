const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Mojaddid Shashwoto\\.gemini\\antigravity-ide\\brain\\52d2b796-01d3-4275-83d2-8e0fbad42ed9';

async function main() {
  console.log('Launching Chrome for text-free capture...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars']
  });

  const page = await browser.newPage();

  // Desktop 1440px
  console.log('Capturing Desktop 1440px...');
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Hero 1440px
  await page.screenshot({ path: path.join(artifactDir, 'textfree_hero_1440px.png') });
  console.log('Saved textfree_hero_1440px.png');

  // 2. Gallery 1440px
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'textfree_gallery_1440px.png') });
  console.log('Saved textfree_gallery_1440px.png');

  // 3. Lightbox 1440px (Click on the first gallery photo to open lightbox)
  await page.evaluate(() => {
    const firstPhoto = document.querySelector('#work .group');
    if (firstPhoto) firstPhoto.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'textfree_lightbox_1440px.png') });
  console.log('Saved textfree_lightbox_1440px.png');

  // Close lightbox
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Mobile 390px
  console.log('Capturing Mobile 390px...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // 4. Hero 390px
  await page.screenshot({ path: path.join(artifactDir, 'textfree_hero_390px.png') });
  console.log('Saved textfree_hero_390px.png');

  // 5. Gallery 390px
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'textfree_gallery_390px.png') });
  console.log('Saved textfree_gallery_390px.png');

  // 6. Lightbox 390px (Click on a gallery photo)
  await page.evaluate(() => {
    const photo = document.querySelector('#work .group');
    if (photo) photo.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'textfree_lightbox_390px.png') });
  console.log('Saved textfree_lightbox_390px.png');

  await browser.close();
  console.log('All text-free screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
