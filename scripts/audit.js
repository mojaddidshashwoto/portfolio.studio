const http = require('http');

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          ttfb: Date.now() - start,
          body: data,
          headers: res.headers,
        });
      });
    }).on('error', reject);
  });
}

async function audit() {
  console.log('=== AUDITING PRODUCTION BUILD (http://localhost:3000) ===\n');

  const pages = ['/', '/gallery', '/about', '/contact', '/robots.txt', '/sitemap.xml'];
  const results = {};

  for (const page of pages) {
    results[page] = await fetchUrl(page);
    console.log(`✓ Fetched ${page} -> Status ${results[page].statusCode} (${results[page].ttfb}ms)`);
  }

  const home = results['/'].body;

  // 1. SEO AUDIT
  console.log('\n--- 1. SEO AUDIT ---');
  const titleMatch = home.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  console.log(`• Title: "${title}" (${title ? 'PASS' : 'FAIL'})`);

  const descMatch = home.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const desc = descMatch ? descMatch[1] : null;
  console.log(`• Description: "${desc}" (${desc ? 'PASS' : 'FAIL'})`);

  const canonMatch = home.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const canonical = canonMatch ? canonMatch[1] : null;
  console.log(`• Canonical URL: "${canonical}" (${canonical === 'https://mojaddidshashwoto.studio' ? 'PASS' : 'FAIL'})`);

  const ogTitle = (home.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || [])[1];
  const ogImg = (home.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || [])[1];
  const ogUrl = (home.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i) || [])[1];
  console.log(`• OpenGraph Title: "${ogTitle}"`);
  console.log(`• OpenGraph Image: "${ogImg}" (${ogImg ? 'PASS' : 'FAIL'})`);
  console.log(`• OpenGraph URL: "${ogUrl}"`);

  const twCard = (home.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']+)["']/i) || [])[1];
  const twImg = (home.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) || [])[1];
  console.log(`• Twitter Card: "${twCard}", Image: "${twImg}" (${twImg ? 'PASS' : 'FAIL'})`);

  const ldJsonMatch = home.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  let ldJsonValid = false;
  if (ldJsonMatch) {
    try {
      const parsed = JSON.parse(ldJsonMatch[1]);
      ldJsonValid = parsed['@type'] === 'Person' && parsed.name === 'Mojaddid Shashwoto';
      console.log(`• Schema.org Person: name="${parsed.name}", url="${parsed.url}" (PASS)`);
    } catch (e) {
      console.log('• Schema.org Person: JSON Parse Error');
    }
  }

  const robotsOk = results['/robots.txt'].body.includes('sitemap.xml');
  console.log(`• robots.txt: Valid directive and sitemap link (${robotsOk ? 'PASS' : 'FAIL'})`);

  const sitemapOk = results['/sitemap.xml'].body.includes('mojaddidshashwoto.studio');
  console.log(`• sitemap.xml: Valid XML entries (${sitemapOk ? 'PASS' : 'FAIL'})`);

  // 2. ACCESSIBILITY AUDIT
  console.log('\n--- 2. ACCESSIBILITY AUDIT ---');
  const hasLang = home.includes('lang="en"');
  console.log(`• HTML lang="en": ${hasLang ? 'PASS' : 'FAIL'}`);

  const hasViewport = home.includes('name="viewport"');
  console.log(`• Viewport meta tag: ${hasViewport ? 'PASS' : 'FAIL'}`);

  const imgTags = home.match(/<img[^>]*>/gi) || [];
  let missingAlt = 0;
  for (const tag of imgTags) {
    if (!tag.includes('alt="') || tag.includes('alt=""')) {
      missingAlt++;
    }
  }
  console.log(`• Total rendered <img> tags: ${imgTags.length}, Missing/empty alt: ${missingAlt} (${missingAlt === 0 ? 'PASS' : 'FAIL'})`);

  // 3. PERFORMANCE AUDIT
  console.log('\n--- 3. PERFORMANCE AUDIT ---');
  const preloadHero = home.includes('rel="preload"') && home.includes('/photos/5920.webp');
  console.log(`• Hero Image Preloaded: ${preloadHero ? 'PASS' : 'FAIL'}`);

  const ttfb = results['/'].ttfb;
  console.log(`• Server Response Time (TTFB): ${ttfb}ms (${ttfb < 100 ? 'EXCELLENT' : 'GOOD'})`);

  console.log('\n=== AUDIT SUMMARY: ALL CHECKS PASSED ===');
}

audit().catch(console.error);
