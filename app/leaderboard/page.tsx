'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Medal, 
  Search, 
  Filter, 
  Sparkles, 
  BadgeCheck, 
  BookOpen,
  Lock,
  Clock,
  ShieldCheck,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Student } from '@/types';
import { getStudents } from '@/services/students';
import { useTrailblazerStore, trailblazerStore } from '@/lib/trailblazerStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { formatNumber } from '@/lib/utils';

function LeaderboardPageContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [syncingProgress, setSyncingProgress] = useState<{ synced: number; total: number } | null>(null);
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'points' | 'badges' | 'rank' | 'superbadges'>('points');

  const { records, isSyncing } = useTrailblazerStore();

  const loadData = async (forceRefresh = false) => {
    if (!forceRefresh && students.length > 0) return;
    setInitialLoading(true);
    try {
      // 1. Fetch registered student list immediately
      const data = await getStudents(forceRefresh);
      setStudents(data);
      setInitialLoading(false); // Render student rows immediately

      // 2. Hydrate Trailblazer data progressively in background with controlled batching
      trailblazerStore.fetchBatch(data, forceRefresh, (synced, total) => {
        setSyncingProgress({ synced, total });
        if (synced >= total) {
          setTimeout(() => setSyncingProgress(null), 2500);
        }
      });
    } catch (err) {
      console.error('Error in Leaderboard synchronization:', err);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  // Filter & Rank Pipeline — Driven strictly by synchronized Trailblazer records
  const filteredAndRanked = useMemo(() => {
    let list = students.map((s) => {
      const rec = records[s.id];
      const isStudentSyncing = isSyncing(s.id);
      const hasNoProfile = !s.trailheadProfileLink || !s.trailheadProfileLink.trim();
      
      const isVerified = rec?.syncStatus === 'VERIFIED';
      const isPrivate = rec?.syncStatus === 'PRIVATE';
      const isUnavailable =
        hasNoProfile ||
        rec?.syncStatus === 'NO_PROFILE' ||
        rec?.syncStatus === 'INVALID_URL' ||
        rec?.syncStatus === 'UNAVAILABLE' ||
        rec?.syncStatus === 'FAILED';

      const points = rec?.points ?? 0;
      const badges = rec?.badges ?? 0;
      const rank = isUnavailable ? 'N/A' : (rec?.rank || 'Explorer');
      const superbadges = rec?.superbadges ?? 0;

      return {
        student: s,
        points,
        badges,
        rank,
        superbadges,
        isVerified,
        isPrivate,
        isUnavailable,
        isStudentSyncing,
        hasRecord: !!rec,
      };
    });

    // 1. Search filter (Name or Roll Number)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.student.name.toLowerCase().includes(q) ||
          item.student.rollNo.toLowerCase().includes(q) ||
          item.student.id.toLowerCase().includes(q)
      );
    }

    // 2. Branch filter
    if (selectedBranch !== 'ALL') {
      list = list.filter((item) => item.student.branch.toLowerCase() === selectedBranch.toLowerCase());
    }

    // 3. Year filter
    if (selectedYear !== 'ALL') {
      list = list.filter((item) => String(item.student.year) === String(selectedYear));
    }

    // Sort by active metric tab using LIVE synchronized Trailblazer statistics
    list.sort((a, b) => {
      if (activeTab === 'badges') return b.badges - a.badges;
      if (activeTab === 'superbadges') return b.superbadges - a.superbadges;
      return b.points - a.points;
    });

    // Competition Tie Ranking (#1, #1, #1, #4)
    let currentRank = 1;
    return list.map((item, idx, arr) => {
      if (idx > 0) {
        const prev = arr[idx - 1];
        let isEqual = false;
        if (activeTab === 'badges') isEqual = item.badges === prev.badges;
        else if (activeTab === 'superbadges') isEqual = item.superbadges === prev.superbadges;
        else isEqual = item.points === prev.points;

        if (!isEqual) {
          currentRank = idx + 1;
        }
      } else {
        currentRank = 1;
      }
      return { ...item, compRank: currentRank };
    });
  }, [students, records, isSyncing, search, selectedBranch, selectedYear, activeTab]);

  const uniqueBranches = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.branch && set.add(s.branch));
    return Array.from(set).sort();
  }, [students]);

  const uniqueYears = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.year && set.add(String(s.year)));
    return Array.from(set).sort();
  }, [students]);

  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md font-sans">
      {/* Header & Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div>
          <Badge variant="secondary">Trailblazer Recognition</Badge>
          <h1 className="font-headline text-headline-md md:text-headline-lg text-primary mt-1">
            Club Leaderboard
          </h1>
          <p className="font-sans text-xs text-on-surface-variant">
            Recognizing live student learning achievements directly from synchronized Trailblazer profiles.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={initialLoading || !!syncingProgress}
          onClick={() => loadData(true)}
          icon={
            syncingProgress ? (
              <RefreshCw className="w-3.5 h-3.5 ml-1 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 ml-1" />
            )
          }
        >
          {syncingProgress
            ? `Syncing (${syncingProgress.synced}/${syncingProgress.total})...`
            : 'Sync All Trailblazer'}
        </Button>
      </div>

      {/* Metric Tabs */}
      <div className="flex justify-center border-b border-outline-variant/20 pb-3 gap-2 overflow-x-auto">
        <Button
          variant={activeTab === 'points' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('points')}
          icon={<Trophy className="w-3.5 h-3.5 mr-1" />}
        >
          Points Leaderboard
        </Button>
        <Button
          variant={activeTab === 'badges' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('badges')}
          icon={<BadgeCheck className="w-3.5 h-3.5 mr-1" />}
        >
          Badges Leaderboard
        </Button>
        <Button
          variant={activeTab === 'rank' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('rank')}
          icon={<Sparkles className="w-3.5 h-3.5 mr-1" />}
        >
          Trailhead Rank
        </Button>
        <Button
          variant={activeTab === 'superbadges' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('superbadges')}
          icon={<BookOpen className="w-3.5 h-3.5 mr-1" />}
        >
          Superbadges
        </Button>
      </div>

      {/* Filter Controls Card */}
      <GlassCard className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or roll no..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/30 px-3 py-2 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-outline shrink-0" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-transparent text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Branches</option>
              {uniqueBranches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/30 px-3 py-2 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-outline shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-transparent text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Years</option>
              {uniqueYears.map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Leaderboard Table / Loading State */}
      {initialLoading ? (
        <GlassCard className="p-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-3 text-sm text-secondary font-headline font-semibold">
            <RefreshCw className="w-5 h-5 animate-spin text-secondary" />
            <span>Loading member directory...</span>
          </div>
          <p className="text-xs text-outline max-w-sm mx-auto">
            Retrieving student registry before synchronizing live Trailblazer rankings.
          </p>
        </GlassCard>
      ) : filteredAndRanked.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <Trophy className="w-10 h-10 text-outline mx-auto" />
          <h3 className="font-headline text-base font-semibold text-primary">No Students Found</h3>
          <p className="text-xs text-on-surface-variant">No members match your selected search query or filters.</p>
        </GlassCard>
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 font-label uppercase tracking-wider text-outline">
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Branch & Year</th>
                  <th className="py-3 px-4">Trailhead Rank</th>
                  <th className="py-3 px-4 text-right">Points</th>
                  <th className="py-3 px-4 text-right">Badges</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredAndRanked.map((item) => (
                  <tr key={item.student.id} className="hover:bg-surface-container-low/40 transition-colors">
                    {/* Rank Medal Column */}
                    <td className="py-3.5 px-4 text-center font-headline font-bold text-sm">
                      {item.compRank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-sm">
                          <Medal className="w-4 h-4 text-amber-600" />
                        </span>
                      ) : item.compRank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-bold">
                          2
                        </span>
                      ) : item.compRank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                          3
                        </span>
                      ) : (
                        <span className="text-outline text-xs">#{item.compRank}</span>
                      )}
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <Link href={`/community/${item.student.id}`} className="group flex items-center gap-3">
                        <InitialsAvatar name={item.student.name} id={item.student.id} size="sm" />
                        <div>
                          <div className="font-semibold text-primary group-hover:text-secondary transition-colors">
                            {item.student.name}
                          </div>
                          <div className="text-outline font-mono text-[11px]">{item.student.rollNo}</div>
                        </div>
                      </Link>
                    </td>

                    {/* Branch & Year */}
                    <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                      {item.student.branch} • Yr {item.student.year}
                    </td>

                    {/* Trailhead Rank */}
                    <td className="py-3.5 px-4">
                      <span className="font-label text-xs uppercase font-bold text-secondary">
                        {item.rank}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="py-3.5 px-4 text-right font-bold text-primary">
                      {item.isUnavailable ? (
                        '—'
                      ) : item.hasRecord ? (
                        formatNumber(item.points)
                      ) : (
                        <span className="inline-block w-12 h-4 bg-surface-container-high animate-pulse rounded" />
                      )}
                    </td>

                    {/* Badges */}
                    <td className="py-3.5 px-4 text-right text-secondary font-bold">
                      {item.isUnavailable ? (
                        '—'
                      ) : item.hasRecord ? (
                        formatNumber(item.badges)
                      ) : (
                        <span className="inline-block w-8 h-4 bg-surface-container-high animate-pulse rounded" />
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-right">
                      {item.isStudentSyncing ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-label font-medium border border-blue-200 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin text-blue-600" /> SYNCING
                        </span>
                      ) : item.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-label font-medium border border-green-200">
                          <ShieldCheck className="w-3 h-3 text-green-600" /> VERIFIED FROM TRAILBLAZER
                        </span>
                      ) : item.isPrivate ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-label font-medium border border-amber-200">
                          <Lock className="w-3 h-3 text-amber-600" /> PRIVATE
                        </span>
                      ) : item.isUnavailable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-outline text-[10px] font-label border border-outline-variant/30">
                          <Clock className="w-3 h-3 text-outline" /> TRAILBLAZER DATA UNAVAILABLE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-label font-medium border border-blue-200">
                          <Clock className="w-3 h-3 text-blue-600" /> LAST VERIFIED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <ErrorBoundary fallbackTitle="Leaderboard Error">
      <LeaderboardPageContent />
    </ErrorBoundary>
  );
}

