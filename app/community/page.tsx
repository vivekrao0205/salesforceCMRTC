'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, User, AlertTriangle, ShieldCheck, Clock, Lock, RefreshCw } from 'lucide-react';
import { Student } from '@/types';
import { getStudents } from '@/services/students';
import { useTrailblazerStore, trailblazerStore } from '@/lib/trailblazerStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { formatNumber } from '@/lib/utils';

const JOIN_FORM_URL =
  process.env.NEXT_PUBLIC_JOIN_CLUB_FORM_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSczeED3uSj-g0-_CxZUGVlzUrIh5k4QpxfUHTgZ2LekogGD8Q/viewform?usp=header';

function formatYear(yearStr: string | number): string {
  const y = String(yearStr).trim();
  if (y === '1') return '1st Year';
  if (y === '2') return '2nd Year';
  if (y === '3') return '3rd Year';
  if (y === '4') return '4th Year';
  return `Year ${y}`;
}

function CommunityPageContent() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [error, setError] = useState(false);

  const { records, isSyncing, syncAllBatch } = useTrailblazerStore();


  // Search & Filter local UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [sortMetric, setSortMetric] = useState<'score' | 'badges' | 'name'>('score');

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsManualSyncing(true);
    } else {
      setInitialLoading(true);
    }
    setError(false);

    try {
      // 1. Fetch registered student directory
      const results = await getStudents(forceRefresh);
      
      // 2. Perform synchronized batch loading before updating UI state
      await syncAllBatch(results, forceRefresh);
      
      // 3. Single coordinated state update once batch process completes
      setAllStudents(results);
    } catch (err) {
      console.error('Error loading community members:', err);
      setError(true);
    } finally {
      setInitialLoading(false);
      setIsManualSyncing(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  // Compute global rank map for all students based on score
  const studentRankMap = useMemo(() => {
    const sorted = [...allStudents].sort((a, b) => {
      const scoreA = records[a.id]?.points ?? 0;
      const scoreB = records[b.id]?.points ?? 0;
      return scoreB - scoreA;
    });
    const map = new Map<string, number>();
    sorted.forEach((s, idx) => map.set(s.id, idx + 1));
    return map;
  }, [allStudents, records]);

  // Dynamically compute unique branches & years from loaded students
  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    allStudents.forEach((s) => {
      if (s.branch) set.add(s.branch);
    });
    return Array.from(set).sort();
  }, [allStudents]);

  const availableYears = useMemo(() => {
    const set = new Set<string>();
    allStudents.forEach((s) => {
      if (s.year) set.add(String(s.year));
    });
    return Array.from(set).sort();
  }, [allStudents]);

  // Filtered students list
  const filteredStudents = useMemo(() => {
    let list = [...allStudents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s) => {
        const profileLink = s.trailheadProfileLink || '';
        return (
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.branch.toLowerCase().includes(q) ||
          profileLink.toLowerCase().includes(q)
        );
      });
    }

    if (branchFilter && branchFilter !== 'ALL') {
      list = list.filter((s) => s.branch.toLowerCase() === branchFilter.toLowerCase());
    }

    if (yearFilter && yearFilter !== 'ALL') {
      list = list.filter((s) => String(s.year) === String(yearFilter));
    }

    list.sort((a, b) => {
      const recA = records[a.id];
      const recB = records[b.id];
      const pointsA = recA?.points ?? 0;
      const pointsB = recB?.points ?? 0;
      const badgesA = recA?.badges ?? 0;
      const badgesB = recB?.badges ?? 0;

      if (sortMetric === 'badges') return badgesB - badgesA;
      if (sortMetric === 'name') return a.name.localeCompare(b.name);
      return pointsB - pointsA;
    });

    return list;
  }, [allStudents, records, searchQuery, branchFilter, yearFilter, sortMetric]);

  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="secondary">Student Directory</Badge>
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary">
            Meet the Community
          </h1>
          <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl">
            Search student profiles, explore Trailhead achievements, and connect with fellow Salesforce learners across CMRTC.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={isManualSyncing || initialLoading}
          onClick={() => loadData(true)}
          icon={<RefreshCw className={`w-3.5 h-3.5 ml-1 ${isManualSyncing ? 'animate-spin' : ''}`} />}
        >
          {isManualSyncing ? 'Syncing Trailblazer data...' : 'Sync All Trailblazer'}
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <GlassCard className="p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, branch, or profile..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-label text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="ALL">All Branches</option>
            {availableBranches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-label text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="ALL">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                Year {y}
              </option>
            ))}
          </select>

          <select
            value={sortMetric}
            onChange={(e) => setSortMetric(e.target.value as any)}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-label text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary font-semibold text-secondary"
          >
            <option value="score">Sort by Trailhead Score</option>
            <option value="badges">Sort by Badges</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </GlassCard>

      {/* Single Coordinated Loading Experience */}
      {initialLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4 my-8">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-[#0B63F6] animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="font-headline text-lg font-bold text-[#062B5C]">
              Loading Trailblazer data...
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Synchronizing student profiles
            </p>
          </div>
        </div>
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Unable to load community members"
          description="A network or timeout error occurred while fetching student directory data."
          actionText="Try Again"
          onAction={() => loadData(true)}
        />
      ) : allStudents.length === 0 ? (
        <EmptyState
          icon={User}
          title="Our community is just getting started."
          description="Be among the first students at CMRTC to join Salesforce Club!"
          actionText="Join the Club"
          actionHref={JOIN_FORM_URL}
        />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No students match your search"
          description={`No members match your criteria (${searchQuery || branchFilter || yearFilter}). Try adjusting your filters.`}
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setBranchFilter('ALL');
            setYearFilter('ALL');
          }}
        />
      ) : (
        /* Grid Layout: Progressive Hydration Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const rankNum = studentRankMap.get(student.id) || 1;
            const formattedRank = `#${String(rankNum).padStart(2, '0')}`;
            const rec = records[student.id];
            const isStudentSyncing = isSyncing(student.id);

            const isVerified = rec?.syncStatus === 'VERIFIED';
            const isPrivate = rec?.syncStatus === 'PRIVATE';
            const isUnavailable =
              !student.trailheadProfileLink ||
              !student.trailheadProfileLink.trim() ||
              rec?.syncStatus === 'NO_PROFILE' ||
              rec?.syncStatus === 'INVALID_URL' ||
              rec?.syncStatus === 'UNAVAILABLE';

            const pointsDisplay = isUnavailable ? '—' : rec ? formatNumber(rec.points) : null;
            const badgesDisplay = isUnavailable ? '—' : rec ? formatNumber(rec.badges) : null;
            const rankTitle = isUnavailable ? 'N/A' : rec?.rank || 'Explorer';

            return (
              <GlassCard
                key={student.id}
                className="flex flex-col justify-between space-y-4 p-5 hover:border-secondary/40 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Top: Rank Badge & Initials Avatar */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                        rankNum === 1
                          ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                          : rankNum === 2
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : rankNum === 3
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
                      }`}
                    >
                      {formattedRank}
                    </span>
                    <InitialsAvatar name={student.name} id={student.id} size="md" />
                  </div>

                  {/* Student Registration Details (Renders Immediately) */}
                  <div>
                    <h3 className="font-headline text-base font-bold text-primary truncate leading-snug">
                      {student.name}
                    </h3>
                    <p className="font-sans text-xs text-outline font-mono mt-0.5">{student.rollNo}</p>
                    <p className="font-sans text-xs text-on-surface-variant font-medium mt-1">
                      {student.branch} • {formatYear(student.year)}
                    </p>
                  </div>

                  {/* Trailhead Progressive Hydration Stats */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/20">
                    <div>
                      {pointsDisplay !== null ? (
                        <div className="font-headline font-bold text-base text-primary">
                          {pointsDisplay}
                        </div>
                      ) : (
                        <div className="h-5 w-16 bg-surface-container-high animate-pulse rounded my-0.5" />
                      )}
                      <div className="text-[10px] text-outline font-label uppercase font-semibold">
                        Trailhead Points
                      </div>
                    </div>
                    <div>
                      {badgesDisplay !== null ? (
                        <div className="font-headline font-bold text-base text-secondary">
                          {badgesDisplay}
                        </div>
                      ) : (
                        <div className="h-5 w-12 bg-surface-container-high animate-pulse rounded my-0.5" />
                      )}
                      <div className="text-[10px] text-outline font-label uppercase font-semibold">
                        Badges
                      </div>
                    </div>
                  </div>

                  {/* Trailblazer Status & Rank */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-outline font-label text-[11px] uppercase font-semibold">
                      Trailblazer Status
                    </span>
                    {isStudentSyncing ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-label text-secondary font-medium animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Syncing...
                      </span>
                    ) : isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-label font-bold text-green-700">
                        <ShieldCheck className="w-3 h-3 text-green-600" /> VERIFIED
                      </span>
                    ) : isPrivate ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-label text-amber-700">
                        <Lock className="w-3 h-3 text-amber-600" /> PRIVATE
                      </span>
                    ) : isUnavailable ? (
                      <span className="text-[11px] font-label text-outline">
                        UNAVAILABLE
                      </span>
                    ) : (
                      <span className="font-headline font-bold text-secondary text-xs uppercase tracking-wide">
                        {rankTitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* View Profile Action */}
                <div className="pt-3 border-t border-outline-variant/20">
                  <Link href={`/community/${student.id}`} className="w-full block">
                    <Button variant="outline" size="sm" className="w-full justify-between group">
                      <span>View Profile</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <ErrorBoundary fallbackTitle="Community Directory Error">
      <CommunityPageContent />
    </ErrorBoundary>
  );
}

