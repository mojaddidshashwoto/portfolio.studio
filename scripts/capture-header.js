const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Mojaddid Shashwoto\\.gemini\\antigravity-ide\\brain\\52d2b796-01d3-4275-83d2-8e0fbad42ed9';

async function captureHeader(width, height, isMobile, fileName) {
  const outFile = path.join(artifactDir, fileName);
  console.log(`Starting capture for ${fileName} (${width}x${height})...`);

  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-hdr-'));

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

    await send('Page.navigate', { url: 'http://localhost:3000' });

    // Wait for hydration & hide curtain
    await new Promise(r => setTimeout(r, 3500));
    await send('Runtime.evaluate', {
      expression: `(() => {
        const curtains = document.querySelectorAll('.origin-top');
        curtains.forEach(c => c.style.display = 'none');
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Capture screenshot of header area
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: 0,
        y: 0,
        width,
        height: isMobile ? 220 : 160,
        scale: isMobile ? 2 : 1
      }
    });

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
  await captureHeader(1440, 900, false, 'header_1440px.png');
  await captureHeader(390, 844, true, 'header_390px.png');
  console.log('All header screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
