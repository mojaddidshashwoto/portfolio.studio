const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Mojaddid Shashwoto\\.gemini\\antigravity-ide\\brain\\52d2b796-01d3-4275-83d2-8e0fbad42ed9';

const targets = [
  { name: 'hero_360px.png', width: 360, height: 780, url: 'http://localhost:3000' },
  { name: 'hero_390px.png', width: 390, height: 844, url: 'http://localhost:3000' },
  { name: 'hero_430px.png', width: 430, height: 932, url: 'http://localhost:3000' },
  { name: 'hero_768px.png', width: 768, height: 1024, url: 'http://localhost:3000' },
  { name: 'hero_1440px.png', width: 1440, height: 900, url: 'http://localhost:3000' },
  { name: 'gallery_390px.png', width: 390, height: 844, url: 'http://localhost:3000/gallery' }
];

async function captureOne(target) {
  const outFile = path.join(artifactDir, target.name);
  console.log(`Starting capture for ${target.name} (${target.width}x${target.height}) -> ${target.url}...`);

  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-cap-'));

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempProfile}`,
    `--window-size=${target.width},${target.height}`,
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const targetsList = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9222/json', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targetsList.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const resp = JSON.parse(evt.data);
          if (resp.id === msgId) {
            ws.removeEventListener('message', handler);
            if (resp.error) reject(resp.error);
            else resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(resolve => ws.addEventListener('open', resolve));

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: target.width,
      height: target.height,
      deviceScaleFactor: 1,
      mobile: target.width < 768
    });

    // Navigate to target URL
    await send('Page.navigate', { url: target.url });

    // Wait 3.0 seconds for fonts, next/image hydration, and animation reveal
    await new Promise(r => setTimeout(r, 3000));

    // Ensure scrolled to top
    await send('Runtime.evaluate', {
      expression: 'window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0;'
    });
    await new Promise(r => setTimeout(r, 400));

    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(outFile, buffer);
    console.log(`Saved: ${outFile} (${buffer.length} bytes)`);

    ws.close();
  } finally {
    chrome.kill();
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch {}
    await new Promise(r => setTimeout(r, 800));
  }
}

async function main() {
  for (const t of targets) {
    await captureOne(t);
  }
  console.log('All CDP screenshots successfully generated!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
