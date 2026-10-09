const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Mojaddid Shashwoto\\.gemini\\antigravity-ide\\brain\\52d2b796-01d3-4275-83d2-8e0fbad42ed9';
const outFile = path.join(artifactDir, 'lightbox_390px.png');

async function main() {
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=390,844',
    '--hide-scrollbars',
    '--disable-gpu',
    'http://localhost:3000'
  ]);

  // wait 2s for chrome to start
  await new Promise(r => setTimeout(r, 2000));

  try {
    // get ws endpoint
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9222/json', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('No page target found');
    }

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

    // Wait for page to render and click first photo in #work
    await new Promise(r => setTimeout(r, 2000));

    console.log('Clicking photo to open Lightbox...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#work .cursor-pointer') || document.querySelector('#featured .cursor-pointer') || document.querySelector('#featured .snap-center');
          if (card) {
            card.click();
            return 'clicked';
          }
          return 'not found';
        })()
      `
    });

    // Wait for lightbox animation to complete
    await new Promise(r => setTimeout(r, 1200));

    console.log('Capturing lightbox screenshot...');
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(outFile, buffer);
    console.log(`Saved lightbox screenshot (${buffer.length} bytes) to ${outFile}`);

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
