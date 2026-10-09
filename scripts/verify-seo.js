const http = require('http');

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('=== SEO PASS AUDIT & VERIFICATION ===\n');

  const routes = ['/', '/gallery', '/about', '/contact'];
  const summary = [];

  for (const route of routes) {
    const res = await fetchUrl(route);
    const html = res.body;

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '(none)';

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const desc = descMatch ? descMatch[1].trim() : '(none)';

    const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    const canon = canonMatch ? canonMatch[1].trim() : '(none)';

    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    const h1Texts = h1Matches.map(h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

    const ldJsons = [];
    const ldRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = ldRegex.exec(html)) !== null) {
      try {
        ldJsons.push(JSON.parse(m[1]));
      } catch (err) {
        ldJsons.push({ error: err.message });
      }
    }

    const titleCount = (title.match(/Mojaddid Shashwoto/g) || []).length;
    const descCount = (desc.match(/Mojaddid Shashwoto/g) || []).length;

    console.log(`--------------------------------------------------`);
    console.log(`ROUTE: ${route}`);
    console.log(`HTTP Status:      ${res.status}`);
    console.log(`Title:            "${title}" (Mojaddid Shashwoto count: ${titleCount})`);
    console.log(`Meta Description: "${desc}" (Mojaddid Shashwoto count: ${descCount})`);
    console.log(`Canonical URL:    ${canon}`);
    console.log(`H1 Tag Count:     ${h1Matches.length} -> [${h1Texts.join(' | ')}]`);
    console.log(`JSON-LD Blocks:   ${ldJsons.length}`);
    ldJsons.forEach((b, idx) => {
      if (b['@graph']) {
        console.log(`  Block ${idx + 1} (@graph): ${b['@graph'].map(g => g['@type']).join(', ')}`);
      } else {
        console.log(`  Block ${idx + 1}: ${b['@type'] || 'unknown'}`);
      }
    });

    summary.push({
      route,
      title,
      titleCount,
      desc,
      descCount,
      canon,
      h1Count: h1Matches.length,
      h1Texts,
      ldJsons,
    });
  }

  // Crawling checks
  console.log(`\n--------------------------------------------------`);
  console.log(`=== CRAWLING & INDEXING AUDIT ===`);

  const robots = await fetchUrl('/robots.txt');
  console.log(`\n• robots.txt (Status ${robots.status}):`);
  console.log(robots.body.trim());

  const sitemap = await fetchUrl('/sitemap.xml');
  console.log(`\n• sitemap.xml (Status ${sitemap.status}):`);
  const sitemapUrls = (sitemap.body.match(/<loc>([^<]+)<\/loc>/g) || []).map(u => u.replace(/<\/?loc>/g, ''));
  const sitemapImages = (sitemap.body.match(/<image:loc>([^<]+)<\/image:loc>/g) || []).map(u => u.replace(/<\/?image:loc>/g, ''));
  console.log(`  Total URLs indexed: ${sitemapUrls.length}`);
  sitemapUrls.forEach(u => console.log(`    - ${u}`));
  console.log(`  Total Image URLs indexed: ${sitemapImages.length}`);

  const notFound = await fetchUrl('/non-existent-page-test-404');
  console.log(`\n• Custom 404 test: Status ${notFound.status}, has 404 text: ${notFound.body.includes('404')}`);

  console.log('\n==================================================');
  console.log('AUDIT COMPLETE');
}

runVerification();
