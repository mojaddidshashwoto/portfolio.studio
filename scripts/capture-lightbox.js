const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Mojaddid Shashwoto\\.gemini\\antigravity-ide\\brain\\52d2b796-01d3-4275-83d2-8e0fbad42ed9';

async function captureLightbox(width, height, isMobile, fileName) {
  const outFile = path.join(artifactDir, fileName);
  console.log(`Starting capture for ${fileName} (${width}x${height})...`);

  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-lb-'));

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempProfile}`,
    `--window-size=${width},${height}`,
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9222/json', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page');
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
      width,
      height,
      deviceScaleFactor: isMobile ? 2 : 1,
      mobile: isMobile
    });

    await send('Page.navigate', { url: 'http://localhost:3000/gallery' });

    // Wait for page hydration & hide curtain
    await new Promise(r => setTimeout(r, 4000));
    await send('Runtime.evaluate', {
      expression: `(() => {
        const curtains = document.querySelectorAll('.origin-top');
        curtains.forEach(c => c.style.display = 'none');
      })()`
    });

    // Click the first photo card in gallery
    console.log('Clicking photo to open Lightbox...');
    const clickResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.columns-2 .cursor-pointer') ||
                     document.querySelector('.group.cursor-pointer') ||
                     document.querySelector('[data-cursor="view"]');
        if (card) {
          card.click();
          return 'clicked: ' + card.className;
        }
        return 'not found';
      })()`,
      returnByValue: true
    });
    console.log('Click result:', clickResult.result.value);

    // Wait for lightbox opening animation & image loading
    await new Promise(r => setTimeout(r, 2000));

    // Verify caption is visible in DOM
    const captionText = await send('Runtime.evaluate', {
      expression: `(() => {
        const p = document.querySelector('.fixed.inset-0.z-50 p.italic');
        return p ? p.textContent : 'No caption element found';
      })()`,
      returnByValue: true
    });
    console.log('Detected Lightbox caption:', captionText.result.value);

    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(outFile, buffer);
    console.log(`Saved ${fileName} (${buffer.length} bytes)`);

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
  await captureLightbox(1440, 950, false, 'lightbox_1440px.png');
  await captureLightbox(390, 844, true, 'lightbox_390px.png');
  console.log('All Lightbox captures complete!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
