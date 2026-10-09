const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runLighthouse(url, outputPath) {
  console.log(`Launching Chrome for ${url}...`);
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });

  console.log(`Running mobile audit on port ${chrome.port}...`);
  const lighthouseModule = await import('lighthouse');
  const lighthouse = lighthouseModule.default;

  const options = {
    logLevel: 'error',
    output: 'json',
    port: chrome.port,
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      disabled: false,
    },
    throttlingMethod: 'provided',
  };

  const runnerResult = await lighthouse(url, options);

  await chrome.kill();

  const reportJson = runnerResult.report;
  fs.writeFileSync(outputPath, reportJson);

  const rep = JSON.parse(reportJson);
  const cats = rep.categories;
  console.log('\n=== LIGHTHOUSE SCORES ===');
  console.log(`Performance:    ${Math.round((cats.performance?.score || 0) * 100)}`);
  console.log(`Accessibility:  ${Math.round((cats.accessibility?.score || 0) * 100)}`);
  console.log(`Best Practices: ${Math.round((cats['best-practices']?.score || 0) * 100)}`);
  console.log(`SEO:            ${Math.round((cats.seo?.score || 0) * 100)}`);

  console.log('\n--- KEY METRICS ---');
  console.log('LCP:', rep.audits['largest-contentful-paint']?.displayValue);
  console.log('CLS:', rep.audits['cumulative-layout-shift']?.displayValue);
  console.log('FCP:', rep.audits['first-contentful-paint']?.displayValue);
  console.log('TBT:', rep.audits['total-blocking-time']?.displayValue);
}

runLighthouse(process.argv[2] || 'http://localhost:3000', process.argv[3] || './lighthouse-report.json').catch(err => {
  console.error('Lighthouse run error:', err);
  process.exit(1);
});
