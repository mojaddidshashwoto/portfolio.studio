const https = require('https');

const host = 'mojaddidshashwoto.studio';
const key = '96d38e07a3c745778a7f0524ce89a815';
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  `https://${host}/`,
  `https://${host}/gallery`,
  `https://${host}/about`,
  `https://${host}/contact`,
];

const payload = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList,
});

const endpoints = [
  'api.indexnow.org',
  'www.bing.com',
];

function submitToIndexNow(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: endpoint,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          endpoint,
          statusCode: res.statusCode,
          response: data || '(empty body)',
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        endpoint,
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        endpoint,
        error: 'Request timed out',
      });
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log(`[IndexNow] Submitting ${urlList.length} URLs to IndexNow engines for ${host}...`);
  console.log(`[IndexNow] Key Location: ${keyLocation}`);
  console.log(`[IndexNow] URLs: \n  - ${urlList.join('\n  - ')}\n`);

  for (const endpoint of endpoints) {
    const result = await submitToIndexNow(endpoint);
    if (result.error) {
      console.warn(`[IndexNow] Ping to ${endpoint} failed (network/local offline): ${result.error}`);
    } else {
      console.log(`[IndexNow] Ping to ${endpoint}: HTTP ${result.statusCode} ${result.statusCode === 200 || result.statusCode === 202 ? '(Success)' : ''}`);
    }
  }

  console.log('\n[IndexNow] Submission process complete.');
}

run();
