async function testEndpoints() {
  const handle = 'cnwag9jss8h8w8rzm';

  const urls = [
    `https://trailblazer.me/id/${handle}`,
    `https://trailhead.salesforce.com/en/me/${handle}`,
    `https://trailhead.salesforce.com/users/profiles/${handle}`,
    `https://trailblazer.me/services/apexrest/tbme/profile/${handle}`,
    `https://trailblazer.me/api/users/id/${handle}`,
    `https://trailblazer.me/profile/${handle}`,
  ];

  for (const url of urls) {
    console.log(`\n--- TESTING: ${url} ---`);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
        },
      });
      console.log('STATUS:', res.status, res.url);
      const text = await res.text();
      console.log('RESPONSE SNIPPET (first 400 chars):', text.slice(0, 400));
      if (text.includes('10300') || text.includes('10,300') || text.includes('36') || text.includes('Adventurer')) {
        console.log('>>> MATCH FOUND IN:', url);
      }
    } catch (e) {
      console.error('ERROR:', e.message);
    }
  }

  // Also test GraphQL endpoint if Trailhead uses GraphQL
  console.log('\n--- TESTING GRAPHQL ---');
  try {
    const gqlRes = await fetch('https://api.trailhead.salesforce.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        query: `
          query getProfileData($handle: String!) {
            profile(handle: $handle) {
              id
              name
              points
              badges
              rank
            }
          }
        `,
        variables: { handle },
      }),
    });
    console.log('GRAPHQL STATUS:', gqlRes.status);
    const gqlData = await gqlRes.text();
    console.log('GRAPHQL BODY:', gqlData.slice(0, 500));
  } catch (e) {
    console.error('GRAPHQL ERROR:', e.message);
  }
}

testEndpoints();
