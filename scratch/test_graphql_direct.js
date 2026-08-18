async function testGraphQL(handle) {
  console.log(`\n=== TESTING DIRECT GRAPHQL API POST FOR HANDLE: ${handle} ===`);
  const endpoint = 'https://profile.api.trailhead.com/graphql';

  // Salesforce Public Profile GraphQL Query
  const query = `
    query GetTrailheadProfile($slug: String!) {
      profile(slug: $slug) {
        ... on PublicProfile {
          id
          trailheadStats {
            earnedPointsSum
            earnedBadgesCount
            completedTrailCount
            superbadgeCount
            rank {
              title
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query,
        variables: { slug: handle },
      }),
    });

    console.log('HTTP Status:', res.status);
    const json = await res.json();
    console.log('GraphQL Response:', JSON.stringify(json, null, 2));

    if (json.data && json.data.profile && json.data.profile.trailheadStats) {
      const stats = json.data.profile.trailheadStats;
      console.log('\n--- VERIFIED LIVE TRAILBLAZER METRICS ---');
      console.log('Points:', stats.earnedPointsSum);
      console.log('Badges:', stats.earnedBadgesCount);
      console.log('Rank:', stats.rank ? stats.rank.title : 'N/A');
      console.log('Trails:', stats.completedTrailCount);
      console.log('Superbadges:', stats.superbadgeCount);
    }
  } catch (err) {
    console.error('Direct GraphQL Error:', err);
  }
}

testGraphQL('cnwagn9jss8h8w8rzm');
