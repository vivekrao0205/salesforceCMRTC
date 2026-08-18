const https = require('https');
const http = require('http');

function fetchFollow(url, depth = 0) {
  if (depth > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const client = u.protocol === 'https:' ? https : http;
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        console.log(`Redirecting (${res.statusCode}) -> ${redirectUrl}`);
        return fetchFollow(redirectUrl, depth + 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, finalUrl: url, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function inspect() {
  const target = 'https://www.salesforce.com/trailblazer/cnwag9jss8h8w8rzm';
  console.log(`Inspecting with redirect follower: ${target}...`);
  const res = await fetchFollow(target);
  console.log('Final Status Code:', res.status);
  console.log('Final URL:', res.finalUrl);
  console.log('Body length:', res.body.length);
  
  const pointsMatch = res.body.match(/10[,.]?300/g);
  const badgeMatch = res.body.match(/36/g);
  const rankMatch = res.body.match(/Adventurer/gi);

  console.log('Points 10,300 match:', pointsMatch);
  console.log('Badges 36 match:', badgeMatch);
  console.log('Adventurer match:', rankMatch);

  // Search for title
  const title = res.body.match(/<title>(.*?)<\/title>/i)?.[1];
  console.log('Title:', title);
}

inspect();
