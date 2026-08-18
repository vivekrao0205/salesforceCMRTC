'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, Mail, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import { Student } from '@/types';
import { getAdminStudents } from '@/services/students';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { formatNumber } from '@/lib/utils';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const loadData = async (refresh = false) => {
    setLoading(true);
    const data = await getAdminStudents(refresh);
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBatchSyncTrailhead = async () => {
    setBatchSyncing(true);
    setSyncMsg('Trailblazer Synchronization: Starting controlled batch processing...');
    try {
      const res = await fetch('/api/admin/sync-all-trailhead', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.summary) {
        const s = data.summary;
        setSyncMsg(
          `Trailblazer Synchronization Complete! Processed ${s.totalStudents} profiles. (Verified: ${s.synced}, Private: ${s.private}, Snapshot/Unavailable: ${s.unavailable})`
        );
        setTimeout(() => setSyncMsg(''), 6000);
        loadData(true);
      }
    } catch (err) {
      setSyncMsg('Batch sync failed.');
    } finally {
      setBatchSyncing(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      (s.eMailCollegeMail && s.eMailCollegeMail.toLowerCase().includes(search.toLowerCase())) ||
      (s.phoneNo && s.phoneNo.includes(search))
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/20 pb-4 gap-4">
        <div>
          <Badge variant="secondary">Admin Coordinator View</Badge>
          <h1 className="font-headline text-headline-sm text-primary mt-1">Student Management</h1>
          <p className="text-xs text-on-surface-variant">Live responses synced from Google Form & Sheets API (Includes private contact details)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={batchSyncing}
            onClick={handleBatchSyncTrailhead}
            icon={<Sparkles className={`w-3.5 h-3.5 ml-1 ${batchSyncing ? 'animate-spin' : ''}`} />}
          >
            {batchSyncing ? 'Syncing Profiles...' : 'SYNC ALL TRAILBLAZER PROFILES'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => loadData(true)} icon={<RefreshCw className="w-4 h-4 ml-1" />}>
            Sync Form API
          </Button>
        </div>
      </div>

      {syncMsg && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          {syncMsg}
        </div>
      )}

      {/* Search Filter */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, roll number, CMRTC ID, branch, email, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
          />
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 font-label uppercase tracking-wider text-outline">
                <th className="py-3 px-4">Student & CMRTC ID</th>
                <th className="py-3 px-4">Branch & Year</th>
                <th className="py-3 px-4">Contact (Admin Only)</th>
                <th className="py-3 px-4 text-right">Trailhead Score</th>
                <th className="py-3 px-4 text-right">Badges</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low/40">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={s.name} id={s.id} size="sm" />
                      <div>
                        <div className="font-semibold text-primary">{s.name}</div>
                        <div className="text-outline font-mono text-[11px]">{s.rollNo} • <span className="text-secondary">{s.id}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">
                    {s.branch} • Year {s.year} {s.section ? `(Sec ${s.section})` : ''}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant text-[11px]">
                    {s.eMailCollegeMail && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-secondary shrink-0" />
                        <span>{s.eMailCollegeMail}</span>
                      </div>
                    )}
                    {s.phoneNo && (
                      <div className="flex items-center gap-1 text-outline">
                        <Phone className="w-3 h-3 text-secondary shrink-0" />
                        <span>{s.phoneNo}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-primary">
                    {formatNumber(s.totalTrailheadScore)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-secondary font-semibold">
                    {formatNumber(s.totalTrailheadBadges)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/community/${s.id}`}>
                      <button className="text-secondary hover:underline font-label font-semibold">
                        View Profile →
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
