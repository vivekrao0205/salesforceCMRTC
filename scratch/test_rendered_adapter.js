async function testRenderedProfile(urlStr) {
  console.log(`\n=== TESTING URL VARIATION: ${urlStr} ===`);
  let browser = null;
  try {
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.default.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    const response = await page.goto(urlStr, { waitUntil: 'networkidle2', timeout: 20000 }).catch(e => null);

    console.log('Navigation Status:', response ? response.status() : 'FAILED/TIMEOUT');
    console.log('Final Page URL:', page.url());

    // Wait 3 seconds for LWC / Remix dynamic components to mount
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 3000)));

    const title = await page.title();
    console.log('Rendered Page Title:', title);

    const bodyText = await page.evaluate(() => document.body.innerText || '');
    console.log('Rendered Body Text Length:', bodyText.length);

    const pointsMatch = bodyText.match(/(\d[\d,]*)\s*Points/i);
    const badgesMatch = bodyText.match(/(\d[\d,]*)\s*Badges/i);
    const rankMatch = bodyText.match(/(Ranger|Double Star Ranger|Triple Star Ranger|Four Star Ranger|Five Star Ranger|All Star Ranger|Mountaineer|Scout|Explorer|Adventurer|Hiker)/i);

    console.log('Points:', pointsMatch ? pointsMatch[1] : 'NONE');
    console.log('Badges:', badgesMatch ? badgesMatch[1] : 'NONE');
    console.log('Rank:', rankMatch ? rankMatch[1] : 'NONE');
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    if (browser) await browser.close();
  }
}

async function run() {
  const handle = 'cnwag9jss8h8w8rzm';
  await testRenderedProfile(`https://salesforce.com/trailblazer/${handle}`);
  await testRenderedProfile(`https://trailblazer.me/id/${handle}`);
  await testRenderedProfile(`https://trailhead.salesforce.com/en/me/${handle}`);
  await testRenderedProfile(`https://salesforce.com/trailblazer/profile/${handle}`);
}

run();
