'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, User, AlertTriangle } from 'lucide-react';
import { Student } from '@/types';
import { getStudents } from '@/services/students';
import { syncAllTrailheadProfiles, getAllCachedTrailheadRecords, TrailblazerRecord } from '@/services/trailheadService';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { formatNumber, parseNumericValue } from '@/lib/utils';

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

export default function CommunityPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [cachedRecords, setCachedRecords] = useState<Record<string, TrailblazerRecord>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Search & Filter local UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [sortMetric, setSortMetric] = useState<'score' | 'badges' | 'name'>('score');

  const loadData = async (forceRefresh = false) => {
    setLoading(true);
    setError(false);
    try {
      const results = await getStudents(forceRefresh);
      setAllStudents(results);

      const res = await fetch('/api/trailhead/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRefresh }),
      });

      const json = await res.json();
      if (json.success && json.records) {
        setCachedRecords((prev) => {
          const updated = { ...prev };
          Object.keys(json.records).forEach((id) => {
            const fresh = json.records[id];
            const existing = prev[id];
            if (fresh.syncStatus === 'VERIFIED' || !existing || existing.syncStatus !== 'VERIFIED') {
              updated[id] = fresh;
            }
          });
          return updated;
        });
      } else {
        setCachedRecords(getAllCachedTrailheadRecords());
      }
    } catch (err) {
      console.error('Error loading community members:', err);
      setCachedRecords(getAllCachedTrailheadRecords());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute global rank map for all students based on score
  const studentRankMap = useMemo(() => {
    const sorted = [...allStudents].sort((a, b) => {
      const scoreA = cachedRecords[a.id]?.points ?? parseNumericValue(a.totalTrailheadScore);
      const scoreB = cachedRecords[b.id]?.points ?? parseNumericValue(b.totalTrailheadScore);
      return scoreB - scoreA;
    });
    const map = new Map<string, number>();
    sorted.forEach((s, idx) => map.set(s.id, idx + 1));
    return map;
  }, [allStudents, cachedRecords]);

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
      const recA = cachedRecords[a.id];
      const recB = cachedRecords[b.id];
      const pointsA = recA?.points ?? parseNumericValue(a.totalTrailheadScore);
      const pointsB = recB?.points ?? parseNumericValue(b.totalTrailheadScore);
      const badgesA = recA?.badges ?? parseNumericValue(a.totalTrailheadBadges);
      const badgesB = recB?.badges ?? parseNumericValue(b.totalTrailheadBadges);

      if (sortMetric === 'badges') return badgesB - badgesA;
      if (sortMetric === 'name') return a.name.localeCompare(b.name);
      return pointsB - pointsA;
    });

    return list;
  }, [allStudents, cachedRecords, searchQuery, branchFilter, yearFilter, sortMetric]);

  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md">
      {/* Page Header */}
      <div className="space-y-3">
        <Badge variant="secondary">Student Directory</Badge>
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary">
          Meet the Community
        </h1>
        <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl">
          Search student profiles, explore Trailhead achievements, and connect with fellow Salesforce learners across CMRTC.
        </p>
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
            placeholder="Search by student name, roll number, branch, or Trailhead profile..."
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

      {/* State Machine Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
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
        /* Grid Layout: Desktop 3/row, Tablet 2/row, Mobile 1/row */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const rankNum = studentRankMap.get(student.id) || 1;
            const formattedRank = `#${String(rankNum).padStart(2, '0')}`;
            const rec = cachedRecords[student.id];
            const points = rec?.points ?? parseNumericValue(student.totalTrailheadScore);
            const badges = rec?.badges ?? parseNumericValue(student.totalTrailheadBadges);
            const rankTitle = rec?.rank || 'Explorer';

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

                  {/* Student Details */}
                  <div>
                    <h3 className="font-headline text-base font-bold text-primary truncate leading-snug">
                      {student.name}
                    </h3>
                    <p className="font-sans text-xs text-outline font-mono mt-0.5">{student.rollNo}</p>
                    <p className="font-sans text-xs text-on-surface-variant font-medium mt-1">
                      {student.branch} • {formatYear(student.year)}
                    </p>
                  </div>

                  {/* Trailhead Stats */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/20">
                    <div>
                      <div className="font-headline font-bold text-base text-primary">
                        {formatNumber(points)}
                      </div>
                      <div className="text-[10px] text-outline font-label uppercase font-semibold">
                        Trailhead Points
                      </div>
                    </div>
                    <div>
                      <div className="font-headline font-bold text-base text-secondary">
                        {formatNumber(badges)}
                      </div>
                      <div className="text-[10px] text-outline font-label uppercase font-semibold">
                        Badges
                      </div>
                    </div>
                  </div>

                  {/* Trailblazer Rank */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-outline font-label text-[11px] uppercase font-semibold">
                      Trailblazer Rank
                    </span>
                    <span className="font-headline font-bold text-secondary text-xs uppercase tracking-wide">
                      {rankTitle}
                    </span>
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
