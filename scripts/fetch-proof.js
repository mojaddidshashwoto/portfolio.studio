const http = require('http');

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function extractProof(path) {
  const html = await fetchUrl(path);

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[0] || '(none)';
  const desc = (html.match(/<meta[^>]*name=["']description["'][^>]*>/i) || [])[0] || '(none)';
  const canon = (html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i) || [])[0] || '(none)';
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[0] || '(none)';
  
  const ldJsons = [];
  const ldRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRegex.exec(html)) !== null) {
    ldJsons.push(m[0]);
  }

  console.log(`\n=======================================================`);
  console.log(`PROOF FOR: ${path}`);
  console.log(`=======================================================`);
  console.log(`\n--- <title> ---`);
  console.log(title);
  console.log(`\n--- <meta name="description"> ---`);
  console.log(desc);
  console.log(`\n--- <link rel="canonical"> ---`);
  console.log(canon);
  console.log(`\n--- <h1> ---`);
  console.log(h1);
  console.log(`\n--- JSON-LD Script Blocks (${ldJsons.length}) ---`);
  ldJsons.forEach((block, i) => {
    console.log(`\n[Block ${i + 1}]:`);
    console.log(block);
  });
}

async function run() {
  await extractProof('/');
  await extractProof('/about');
}

run();
