'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Award, 
  BookOpen, 
  ArrowLeft,
  BadgeCheck,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Clock,
  Lock,
  Compass
} from 'lucide-react';
import { Student } from '@/types';
import { getStudentById } from '@/services/students';
import { useTrailblazerStore, trailblazerStore } from '@/lib/trailblazerStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { formatNumber, formatFieldLabel, isSafeUrl } from '@/lib/utils';

function StudentProfilePageContent({ studentId }: { studentId: string }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [studentLoading, setStudentLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { records, isSyncing } = useTrailblazerStore();
  const trailheadRecord = student ? records[student.id] : undefined;
  const isProfileSyncing = student ? isSyncing(student.id) : false;

  useEffect(() => {
    async function loadData() {
      setStudentLoading(true);
      try {
        const found = await getStudentById(studentId);
        setStudent(found);
        if (found) {
          // Asynchronously trigger live Trailblazer fetch
          trailblazerStore.fetchSingle(found.id, found.trailheadProfileLink, false);
        }
      } catch (err) {
        console.error('Error loading student profile:', err);
      } finally {
        setStudentLoading(false);
      }
    }
    loadData();
  }, [studentId]);

  const handleRefreshTrailhead = async () => {
    if (!student) return;
    setRefreshing(true);
    try {
      await trailblazerStore.fetchSingle(student.id, student.trailheadProfileLink, true);
    } catch (err) {
      console.error('Failed to refresh Trailhead data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (studentLoading) {
    return (
      <GlassCard className="max-w-xl mx-auto my-16 p-12 text-center space-y-4 font-sans">
        <div className="inline-flex items-center justify-center gap-3 text-sm text-secondary font-headline font-semibold">
          <RefreshCw className="w-5 h-5 animate-spin text-secondary" />
          <span>Loading student profile...</span>
        </div>
      </GlassCard>
    );
  }

  if (!student) {
    return (
      <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile text-center space-y-4 font-sans">
        <h2 className="font-headline text-headline-sm text-primary">Student Not Found</h2>
        <p className="text-xs text-on-surface-variant">The requested student profile could not be located.</p>
        <Link href="/community">
          <Button variant="primary">Return to Directory</Button>
        </Link>
      </div>
    );
  }

  const rawFields = student._raw || {};
  const privateOrStandardKeys = new Set([
    'id',
    '_raw',
    'Timestamp',
    'timestamp',
    'Phone No',
    'phoneNo',
    'E Mail (College Mail)',
    'eMailCollegeMail',
    'Name',
    'name',
    'Roll No',
    'rollNo',
    'Branch',
    'branch',
    'Year',
    'year',
    'Section',
    'section',
    'Trailhead Profile Link',
    'trailheadProfileLink',
    'Total Trailhead Score',
    'totalTrailheadScore',
    'Total Trailhead Badges',
    'totalTrailheadBadges',
  ]);

  const additionalFields: { label: string; value: string }[] = [];
  Object.keys(rawFields).forEach((key) => {
    if (!privateOrStandardKeys.has(key)) {
      const val = rawFields[key];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        additionalFields.push({
          label: formatFieldLabel(key),
          value: String(val).trim(),
        });
      }
    }
  });

  const isProfileUnavailable =
    !student.trailheadProfileLink ||
    !student.trailheadProfileLink.trim() ||
    trailheadRecord?.syncStatus === 'NO_PROFILE' ||
    trailheadRecord?.syncStatus === 'INVALID_URL' ||
    trailheadRecord?.syncStatus === 'UNAVAILABLE';

  const hasLoadedRecord = !!trailheadRecord;

  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md font-sans">
      {/* Back Navigation & Refresh Action */}
      <div className="flex items-center justify-between">
        <Link href="/community">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4 mr-1" />}>
            Back to Directory
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          disabled={refreshing || isProfileSyncing}
          onClick={handleRefreshTrailhead}
          icon={<RefreshCw className={`w-3.5 h-3.5 ml-1 ${refreshing || isProfileSyncing ? 'animate-spin' : ''}`} />}
        >
          {refreshing || isProfileSyncing ? 'Refreshing...' : 'Refresh Trailhead Data ↻'}
        </Button>
      </div>

      {/* Profile Header Card (Renders Registered Information Instantly) */}
      <GlassCard className="p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-surface-bright via-surface-container-lowest to-surface-container-low">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <InitialsAvatar name={student.name} id={student.id} size="xl" />

          <div className="flex-grow text-center md:text-left space-y-3">
            <div>
              <h1 className="font-headline text-headline-lg-mobile md:text-headline-md text-primary">
                {student.name}
              </h1>
              <p className="font-sans text-sm text-outline font-mono mt-0.5">
                Roll Number: {student.rollNo}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-sans text-on-surface-variant">
              <Badge variant="primary">{student.branch}</Badge>
              <Badge variant="outline">YEAR {student.year}</Badge>
              {student.section && <Badge variant="secondary">SEC {student.section}</Badge>}
            </div>

            {/* Trailhead Link & Sync Status Indicator */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {student.trailheadProfileLink && isSafeUrl(student.trailheadProfileLink) ? (
                <a
                  href={student.trailheadProfileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-secondary font-label text-xs font-semibold hover:underline"
                >
                  Open Trailhead Profile →
                </a>
              ) : (
                <span className="text-xs text-outline italic">Trailhead Profile Not Provided</span>
              )}

              {/* Status Badge */}
              {isProfileSyncing ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-label font-medium border border-blue-200 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" /> SYNCING LIVE TRAILBLAZER DATA
                </span>
              ) : trailheadRecord?.syncStatus === 'VERIFIED' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[11px] font-label font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> VERIFIED FROM TRAILBLAZER
                </span>
              ) : trailheadRecord?.syncStatus === 'PRIVATE' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-label font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-600" /> Private Profile
                </span>
              ) : isProfileUnavailable ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-label">
                  <Clock className="w-3.5 h-3.5 text-outline" /> TRAILBLAZER DATA UNAVAILABLE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-label font-medium border border-blue-200">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> LAST VERIFIED
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* SALESFORCE TRAILHEAD PROGRESS SECTION (Progressive Hydration with Skeleton Indicators) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <h2 className="font-headline text-headline-sm text-primary">Salesforce Trailhead Progress</h2>
          <span className="text-xs font-sans text-secondary font-medium">
            {isProfileSyncing
              ? 'Updating Trailblazer Data...'
              : trailheadRecord?.syncStatus === 'VERIFIED'
              ? 'VERIFIED FROM TRAILBLAZER'
              : isProfileUnavailable
              ? 'TRAILBLAZER DATA UNAVAILABLE'
              : 'LAST VERIFIED'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-label uppercase text-outline font-semibold">Total Points</span>
              <Award className="w-5 h-5 text-secondary" />
            </div>
            {isProfileUnavailable ? (
              <div className="font-headline text-headline-sm text-primary font-bold">—</div>
            ) : hasLoadedRecord ? (
              <div className="font-headline text-headline-sm text-primary font-bold">
                {formatNumber(trailheadRecord.points)}
              </div>
            ) : (
              <div className="h-8 w-24 bg-surface-container-high animate-pulse rounded my-1" />
            )}
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">Trailhead learning score</p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-label uppercase text-outline font-semibold">Badges Earned</span>
              <BadgeCheck className="w-5 h-5 text-secondary" />
            </div>
            {isProfileUnavailable ? (
              <div className="font-headline text-headline-sm text-primary font-bold">—</div>
            ) : hasLoadedRecord ? (
              <div className="font-headline text-headline-sm text-primary font-bold">
                {formatNumber(trailheadRecord.badges)}
              </div>
            ) : (
              <div className="h-8 w-16 bg-surface-container-high animate-pulse rounded my-1" />
            )}
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">Badges earned on Trailhead</p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-label uppercase text-outline font-semibold">Trailhead Rank</span>
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            {isProfileUnavailable ? (
              <div className="font-headline text-headline-sm text-secondary font-bold uppercase tracking-wide">N/A</div>
            ) : hasLoadedRecord ? (
              <div className="font-headline text-headline-sm text-secondary font-bold uppercase tracking-wide">
                {trailheadRecord.rank || 'Explorer'}
              </div>
            ) : (
              <div className="h-8 w-24 bg-surface-container-high animate-pulse rounded my-1" />
            )}
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">Official Rank Level</p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-label uppercase text-outline font-semibold">Trails</span>
              <Compass className="w-5 h-5 text-secondary" />
            </div>
            {isProfileUnavailable ? (
              <div className="font-headline text-headline-sm text-primary font-bold">—</div>
            ) : hasLoadedRecord ? (
              <div className="font-headline text-headline-sm text-primary font-bold">
                {trailheadRecord.trails || 0}
              </div>
            ) : (
              <div className="h-8 w-12 bg-surface-container-high animate-pulse rounded my-1" />
            )}
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">Completed trails</p>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-label uppercase text-outline font-semibold">Superbadges</span>
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            {isProfileUnavailable ? (
              <div className="font-headline text-headline-sm text-primary font-bold">—</div>
            ) : hasLoadedRecord ? (
              <div className="font-headline text-headline-sm text-primary font-bold">
                {trailheadRecord.superbadges || 0}
              </div>
            ) : (
              <div className="h-8 w-12 bg-surface-container-high animate-pulse rounded my-1" />
            )}
            <p className="font-sans text-[11px] text-on-surface-variant mt-1">Practical challenges</p>
          </GlassCard>
        </div>
      </div>

      {/* Dynamic Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic & Salesforce Information */}
        <GlassCard className="space-y-4">
          <div className="border-b border-outline-variant/20 pb-3 flex items-center justify-between">
            <h3 className="font-headline text-base font-semibold text-primary">Basic & Salesforce Details</h3>
            <Badge variant="outline">Registration Data</Badge>
          </div>

          <div className="space-y-3 text-xs font-sans">
            <div className="flex justify-between py-1 border-b border-outline-variant/10">
              <span className="text-outline">Full Name</span>
              <span className="font-semibold text-primary">{student.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline-variant/10">
              <span className="text-outline">Roll Number</span>
              <span className="font-mono text-primary font-semibold">{student.rollNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline-variant/10">
              <span className="text-outline">Branch</span>
              <span className="font-semibold text-primary">{student.branch}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline-variant/10">
              <span className="text-outline">Academic Year</span>
              <span className="font-semibold text-primary">Year {student.year}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline-variant/10">
              <span className="text-outline">Trailhead Score</span>
              <span className="font-semibold text-secondary">
                {isProfileUnavailable ? '—' : hasLoadedRecord ? formatNumber(trailheadRecord.points) : 'Loading...'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-outline">Trailhead Badges</span>
              <span className="font-semibold text-secondary">
                {isProfileUnavailable ? '—' : hasLoadedRecord ? formatNumber(trailheadRecord.badges) : 'Loading...'}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Dynamic Additional Information */}
        <GlassCard className="space-y-4">
          <div className="border-b border-outline-variant/20 pb-3 flex items-center justify-between">
            <h3 className="font-headline text-base font-semibold text-primary">Additional Information</h3>
            <Badge variant="secondary">Member Details</Badge>
          </div>

          {additionalFields.length > 0 ? (
            <div className="space-y-3 text-xs font-sans">
              {additionalFields.map((field, i) => (
                <div key={i} className="py-1 border-b border-outline-variant/10 space-y-1">
                  <div className="text-outline font-semibold">{field.label}</div>
                  <div className="text-primary font-sans">
                    {isSafeUrl(field.value) ? (
                      <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-secondary underline">
                        {field.value}
                      </a>
                    ) : (
                      field.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-outline italic py-4">
              All available profile details are presented in the summary.
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export default function StudentProfilePage({ params }: { params: { studentId: string } }) {
  return (
    <ErrorBoundary fallbackTitle="Student Profile Error">
      <StudentProfilePageContent studentId={params.studentId} />
    </ErrorBoundary>
  );
}

