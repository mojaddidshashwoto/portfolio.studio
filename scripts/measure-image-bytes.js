const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function measure(url = 'http://localhost:3000') {
  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-meas-'));
  const port = 9333;

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempProfile}`,
    '--window-size=390,844',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const targetsList = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
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

    const imageRequests = new Map();

    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Network.responseReceived') {
        const { requestId, response, type } = msg.params;
        if (type === 'Image' || (response.mimeType && response.mimeType.startsWith('image/'))) {
          imageRequests.set(requestId, {
            url: response.url,
            mimeType: response.mimeType,
            bytes: response.encodedDataLength || 0,
            fromCache: response.fromDiskCache || response.fromServiceWorker || false,
          });
        }
      } else if (msg.method === 'Network.loadingFinished') {
        const { requestId, encodedDataLength } = msg.params;
        if (imageRequests.has(requestId)) {
          const item = imageRequests.get(requestId);
          item.bytes = encodedDataLength || item.bytes;
        }
      }
    });

    await send('Network.enable');
    await send('Network.clearBrowserCache');
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });

    await send('Page.navigate', { url });

    // Wait 4 seconds for full homepage load at 390px viewport without scrolling
    await new Promise(r => setTimeout(r, 4500));

    ws.close();

    console.log(`\n======================================================`);
    console.log(`HOMEPAGE IMAGE DOWNLOADS AT 390px VIEWPORT (${url})`);
    console.log(`======================================================`);
    let totalBytes = 0;
    const items = Array.from(imageRequests.values());
    items.forEach((item, idx) => {
      totalBytes += item.bytes;
      const cleanUrl = item.url.length > 80 ? item.url.slice(0, 80) + '...' : item.url;
      console.log(`[${idx + 1}] ${(item.bytes / 1024).toFixed(2)} KB - ${cleanUrl}`);
    });

    console.log(`------------------------------------------------------`);
    console.log(`Total Images Downloaded: ${items.length}`);
    console.log(`Total Image Bytes:       ${totalBytes} bytes (${(totalBytes / 1024).toFixed(2)} KB)`);
    console.log(`======================================================\n`);

    return { totalBytes, count: items.length };
  } finally {
    chrome.kill();
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch {}
    await new Promise(r => setTimeout(r, 800));
  }
}

measure().catch(err => {
  console.error('Error measuring image bytes:', err);
  process.exit(1);
});
