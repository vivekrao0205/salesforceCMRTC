async function testShadowDOM() {
  const urlStr = 'https://www.salesforce.com/trailblazer/cnwagn9jss8h8w8rzm';
  console.log(`\n=== INSPECTING SHADOW DOM & SCRIPTS FOR: ${urlStr} ===`);
  
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

    // Intercept network responses to find JSON API payloads
    const interceptedResponses = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('trailhead') || url.includes('profile') || url.includes('api') || url.includes('graphql') || url.includes('json')) {
        try {
          const contentType = response.headers()['content-type'] || '';
          if (contentType.includes('application/json')) {
            const json = await response.json();
            interceptedResponses.push({ url, json });
          }
        } catch (e) {}
      }
    });

    await page.goto(urlStr, { waitUntil: 'networkidle2', timeout: 25000 });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 6000)));

    console.log(`Intercepted ${interceptedResponses.length} JSON network responses.`);
    interceptedResponses.forEach((item, idx) => {
      console.log(`\n--- JSON RESPONSE [${idx + 1}]: ${item.url} ---`);
      console.log(JSON.stringify(item.json).slice(0, 500));
    });

    // Deep search all text content inside all elements (including shadow roots)
    const allTextContent = await page.evaluate(() => {
      function getDeepText(node) {
        let text = '';
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent + ' ';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.shadowRoot) {
            text += getDeepText(node.shadowRoot) + ' ';
          }
          for (const child of node.childNodes) {
            text += getDeepText(child) + ' ';
          }
        }
        return text;
      }
      return getDeepText(document.body);
    });

    console.log('\nDeep Shadow DOM Text Length:', allTextContent.length);
    console.log('\n--- DEEP TEXT SNIPPET ---');
    console.log(allTextContent.slice(0, 1000));

    // Regex check on Deep Text
    const pointsMatch = allTextContent.match(/(\d[\d,]*)\s*Points/i);
    const badgesMatch = allTextContent.match(/(\d[\d,]*)\s*Badges/i);
    const rankMatch = allTextContent.match(/(Ranger|Double Star Ranger|Triple Star Ranger|Four Star Ranger|Five Star Ranger|All Star Ranger|Mountaineer|Scout|Explorer|Adventurer|Hiker)/i);
    const trailsMatch = allTextContent.match(/(\d+)\s*Trail/i);

    console.log('\n--- EXTRACTED RESULTS ---');
    console.log('Points:', pointsMatch ? pointsMatch[1] : 'NOT FOUND');
    console.log('Badges:', badgesMatch ? badgesMatch[1] : 'NOT FOUND');
    console.log('Rank:', rankMatch ? rankMatch[1] : 'NOT FOUND');
    console.log('Trails:', trailsMatch ? trailsMatch[1] : 'NOT FOUND');

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    if (browser) await browser.close();
  }
}

testShadowDOM();
