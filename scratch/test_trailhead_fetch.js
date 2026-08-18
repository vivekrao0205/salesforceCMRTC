const https = require('https');
const http = require('http');

async function testFetch(urlStr) {
  console.log(`\n--- FETCHING: ${urlStr} ---`);
  try {
    const res = await fetch(urlStr, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    console.log('STATUS:', res.status, res.statusText);
    console.log('FINAL URL:', res.url);
    console.log('HEADERS:', Object.fromEntries(res.headers.entries()));

    const html = await res.text();
    console.log('HTML LENGTH:', html.length);
    console.log('TITLE MATCH:', html.match(/<title>(.*?)<\/title>/i)?.[1]);

    // Check if points / badges / rank appear anywhere in raw html
    console.log('\n--- SEARCHING FOR 10300 or 10,300 ---');
    console.log('10300 in HTML?', html.includes('10300') || html.includes('10,300'));
    console.log('36 Badges in HTML?', html.includes('36'));
    console.log('Adventurer in HTML?', html.includes('Adventurer'));

    // Print snippets containing points/badges/rank or scripts
    const scriptMatches = html.match(/<script[\s\S]*?<\/script>/gi) || [];
    console.log(`Found ${scriptMatches.length} <script> tags.`);

    scriptMatches.forEach((script, idx) => {
      if (script.includes('10300') || script.includes('10,300') || script.includes('Adventurer') || script.includes('badges') || script.includes('points') || script.includes('__INITIAL_STATE__') || script.includes('Lightning')) {
        console.log(`\n--- SCRIPT TAG ${idx} MATCH ---`);
        console.log(script.slice(0, 1000));
      }
    });

  } catch (err) {
    console.error('FETCH ERROR:', err);
  }
}

async function run() {
  await testFetch('https://salesforce.com/trailblazer/cnwag9jss8h8w8rzm');
  await testFetch('https://www.salesforce.com/trailblazer/cnwag9jss8h8w8rzm');
  await testFetch('https://trailblazer.me/id/cnwag9jss8h8w8rzm');
}

run();
