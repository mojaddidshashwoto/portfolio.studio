const http = require('http');

function fetchUrl(port, path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function extractProof(port, path) {
  const html = await fetchUrl(port, path);

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[0] || '(none)';
  const desc = (html.match(/<meta[^>]*name=["']description["'][^>]*>/i) || [])[0] || '(none)';
  const canon = (html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i) || [])[0] || '(none)';
  
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  
  const hpMatch = html.match(/<div[^>]*>[\s\S]*?company_hp[\s\S]*?<\/div>/i);
  const footerCredit = html.includes('NEXT.JS / LENIS / GSAP');

  console.log(`\n=======================================================`);
  console.log(`PRODUCTION PROOF FOR: ${path}`);
  console.log(`=======================================================`);
  console.log(`\n--- <title> ---`);
  console.log(title);
  console.log(`\n--- <meta name="description"> ---`);
  console.log(desc);
  console.log(`\n--- <link rel="canonical"> ---`);
  console.log(canon);
  console.log(`\n--- <h1> Tag Count: ${h1Matches.length} ---`);
  h1Matches.forEach((h1, idx) => {
    const text = h1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`[H1 #${idx + 1} Raw]: ${h1}`);
    console.log(`[H1 #${idx + 1} Text]: "${text}"`);
  });
  console.log(`\n--- Honeypot Block ---`);
  console.log(hpMatch ? hpMatch[0] : '(not found)');
  console.log(`\n--- Footer "Next.js / Lenis / GSAP" Credit in HTML? ---`);
  console.log(footerCredit ? 'FOUND (needs removal)' : 'NOT FOUND (correctly removed)');
}

async function run() {
  const port = process.env.PORT || 3000;
  await extractProof(port, '/');
}

run();
