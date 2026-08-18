import { syncAllTrailblazerProfiles, syncSingleTrailblazerProfile } from '../services/trailheadService';

async function testSingle() {
  console.log('\n=== TESTING SINGLE REAL TRAILBLAZER PROFILE ===');
  console.log('Target: Gattla Prekshith Reddy (247R1A67M6)');
  console.log('URL: https://salesforce.com/trailblazer/cnwag9jss8h8w8rzm');

  const record = await syncSingleTrailblazerProfile(
    'CMRTC-2026-0036',
    'https://salesforce.com/trailblazer/cnwag9jss8h8w8rzm',
    10000,
    34,
    true
  );

  console.log('\n--- SINGLE PROFILE RESULT ---');
  console.log('Success:', record.success);
  console.log('Points:', record.points);
  console.log('Badges:', record.badges);
  console.log('Rank:', record.rank);
  console.log('Trails:', record.trails);
  console.log('Superbadges:', record.superbadges);
  console.log('Sync Status:', record.syncStatus);
  console.log('Sync Status Label:', record.syncStatusLabel);
  console.log('Source:', record.source);
}

async function testBulk() {
  console.log('\n=== TESTING BULK SYNC ENGINE FOR ALL 49 STUDENTS ===');
  const summary = await syncAllTrailblazerProfiles(true, (synced, total, lastStudent) => {
    console.log(`Progress: ${synced}/${total} | Last: ${lastStudent?.name || 'N/A'}`);
  });

  console.log('\n=== BULK SYNC MASTER SUMMARY ===');
  console.log('Total Students:', summary.totalStudents);
  console.log('Profiles Found:', summary.profilesFound);
  console.log('VERIFIED FROM TRAILBLAZER (Live Public Data):', summary.synced);
  console.log('PRIVATE (Private Profiles):', summary.private);
  console.log('UNAVAILABLE / SNAPSHOT:', summary.unavailable);
  console.log('NO PROFILE PROVIDED:', summary.noProfile);
  console.log('Timestamp:', summary.timestamp);

  console.log('\n--- VERIFIED PUBLIC TRAILBLAZER RECORDS ---');
  Object.values(summary.records)
    .filter((r) => r.syncStatus === 'VERIFIED')
    .forEach((r) => {
      console.log(`[${r.studentId}] Points: ${r.points} | Badges: ${r.badges} | Rank: ${r.rank} | Trails: ${r.trails} | Source: ${r.source}`);
    });
}

async function runAll() {
  await testSingle();
  await testBulk();
}

runAll();
