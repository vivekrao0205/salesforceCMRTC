async function testBulkSync() {
  console.log('\n=== TESTING BULK SYNC ENGINE FOR ALL 49 STUDENTS ===');
  const trailheadService = await import('../services/trailheadService.ts');
  const summary = await trailheadService.syncAllTrailblazerProfiles(true, (synced, total, lastStudent) => {
    console.log(`Progress: ${synced}/${total} | Last: ${lastStudent?.name || 'N/A'}`);
  });

  console.log('\n=== BULK SYNC MASTER SUMMARY ===');
  console.log('Total Students:', summary.totalStudents);
  console.log('Profiles Found:', summary.profilesFound);
  console.log('VERIFIED (Live Public Data):', summary.synced);
  console.log('PRIVATE (Private Profiles):', summary.private);
  console.log('UNAVAILABLE / SNAPSHOT:', summary.unavailable);
  console.log('NO PROFILE PROVIDED:', summary.noProfile);
  console.log('Timestamp:', summary.timestamp);

  // Print top verified records
  console.log('\n--- VERIFIED PUBLIC TRAILBLAZERS ---');
  Object.values(summary.records)
    .filter(r => r.syncStatus === 'VERIFIED')
    .forEach(r => {
      console.log(`[${r.studentId}] Points: ${r.points} | Badges: ${r.badges} | Rank: ${r.rank} | Source: ${r.source}`);
    });
}

testBulkSync();
