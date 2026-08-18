async function testMultipleHandles() {
  const handles = [
    'cnwagn9jss8h8w8rzm', // Gattla Prekshith Reddy
    'dt9c74yd2e4s2axa3e', // Tanistha
    'jsudnmellqzknufpkt', // Parvathala Navyasri
    'ojbscfrf2oobwviom9', // Sana mehreen
    'rw6vqa7mlpl4o9pw1k'  // Palla.Ramyarchitha
  ];

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

  for (const h of handles) {
    try {
      const res = await fetch('https://profile.api.trailhead.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { slug: h } }),
      });
      const json = await res.json();
      const stats = json.data?.profile?.trailheadStats;
      if (stats) {
        console.log(`✓ [${h}] -> Points: ${stats.earnedPointsSum} | Badges: ${stats.earnedBadgesCount} | Rank: ${stats.rank?.title} | Trails: ${stats.completedTrailCount}`);
      } else {
        console.log(`X [${h}] -> No stats returned or Private profile`);
      }
    } catch (err) {
      console.log(`ERR [${h}]: ${err.message}`);
    }
  }
}

testMultipleHandles();
