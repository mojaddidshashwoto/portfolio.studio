const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const photosDir = path.join(publicDir, 'photos');
const jsonPath = path.join(photosDir, 'photos.json');
const rootJsonPath = path.join(publicDir, 'photos.json');

const renameMap = {
  '5920': 'architectural-window-portrait',
  '4762': 'concrete-window-grille-portrait',
  '4787': 'tree-lined-road-dhaka',
  '4756': 'peace-sign-shadow-sand',
};

// 1. Rename files on disk
for (const [oldName, newName] of Object.entries(renameMap)) {
  const oldWebp = path.join(photosDir, `${oldName}.webp`);
  const newWebp = path.join(photosDir, `${newName}.webp`);
  if (fs.existsSync(oldWebp)) {
    fs.copyFileSync(oldWebp, newWebp);
    fs.unlinkSync(oldWebp);
    console.log(`Renamed ${oldName}.webp -> ${newName}.webp`);
  }
}

// Ensure hero.webp and about.webp point to the new files
fs.copyFileSync(path.join(photosDir, 'architectural-window-portrait.webp'), path.join(photosDir, 'hero.webp'));
fs.copyFileSync(path.join(photosDir, 'concrete-window-grille-portrait.webp'), path.join(photosDir, 'about.webp'));

// Remove old numeric JPGs if they exist in public/photos
['4756.jpg', '4762.jpg', '4787.jpg', '4802.jpg', '5920.jpg', 'hero.jpg', 'about.jpg'].forEach(f => {
  const p = path.join(photosDir, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Cleaned legacy file: ${f}`);
  }
});

// 2. Update photos.json
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const updated = data.map(item => {
  if (renameMap[item.id]) {
    const newId = renameMap[item.id];
    return {
      ...item,
      id: newId,
      file: `/photos/${newId}.webp`,
    };
  }
  return item;
});

fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2));
fs.writeFileSync(rootJsonPath, JSON.stringify(updated, null, 2));
console.log('photos.json and public/photos.json updated successfully.');
