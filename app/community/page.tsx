'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, User, AlertTriangle } from 'lucide-react';
import { Student } from '@/types';
import { getStudents, getUniqueBranches, getUniqueYears } from '@/services/students';
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

export default function CommunityPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
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
    } catch (err) {
      console.error('Error loading community members:', err);
      setError(true);
    } finally {
      setLoading(false); // ALWAYS leave loading state
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  // Synchronous in-memory filtering and sorting (NEVER triggers network refetch)
  const filteredStudents = useMemo(() => {
    let list = [...allStudents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.branch.toLowerCase().includes(q) ||
          (s.salesforceUsername && String(s.salesforceUsername).toLowerCase().includes(q))
      );
    }

    if (branchFilter && branchFilter !== 'ALL') {
      list = list.filter((s) => s.branch.toLowerCase() === branchFilter.toLowerCase());
    }

    if (yearFilter && yearFilter !== 'ALL') {
      list = list.filter((s) => String(s.year) === String(yearFilter));
    }

    list.sort((a, b) => {
      if (sortMetric === 'badges') {
        return parseNumericValue(b.totalTrailheadBadges) - parseNumericValue(a.totalTrailheadBadges);
      }
      if (sortMetric === 'name') {
        return a.name.localeCompare(b.name);
      }
      return parseNumericValue(b.totalTrailheadScore) - parseNumericValue(a.totalTrailheadScore);
    });

    return list;
  }, [allStudents, searchQuery, branchFilter, yearFilter, sortMetric]);

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
          description="A network or timeout error occurred while fetching student data from the Google Form API."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <GlassCard key={student.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Top Info */}
                <div className="flex items-start gap-4">
                  <InitialsAvatar name={student.name} id={student.id} size="lg" />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-headline text-base font-semibold text-primary truncate">
                      {student.name}
                    </h3>
                    <p className="font-sans text-xs text-outline font-mono">{student.rollNo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{student.branch}</Badge>
                      <span className="text-xs font-sans text-on-surface-variant">
                        Year {student.year}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trailhead Stats Grid */}
                <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-lg text-center">
                  <div>
                    <div className="font-headline font-bold text-base text-primary">
                      {formatNumber(student.totalTrailheadScore)}
                    </div>
                    <div className="text-[10px] text-outline uppercase font-label">Trailhead Score</div>
                  </div>
                  <div>
                    <div className="font-headline font-bold text-base text-secondary">
                      {formatNumber(student.totalTrailheadBadges)}
                    </div>
                    <div className="text-[10px] text-outline uppercase font-label">Badges</div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-sans">
                  {student.section ? `Section ${student.section}` : 'CMRTC'}
                </span>
                <Link href={`/community/${student.id}`}>
                  <Button variant="ghost" size="sm" icon={<ExternalLink className="w-3.5 h-3.5 ml-1" />}>
                    View Profile →
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
