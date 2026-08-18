import React from 'react';
import Link from 'next/link';
import { Users, Calendar, Award, BookOpen, RefreshCw, Plus } from 'lucide-react';
import { getStudents } from '@/services/students';
import { getEvents } from '@/services/events';
import { getResources } from '@/services/resources';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function AdminDashboardPage() {
  const students = await getStudents();
  const events = await getEvents();
  const resources = await getResources();

  const totalTrailheadPoints = students.reduce((acc, s) => acc + (s.totalTrailheadScore || 0), 0);
  const totalBadges = students.reduce((acc, s) => acc + (s.totalTrailheadBadges || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <Badge variant="secondary">Control Center</Badge>
          <h1 className="font-headline text-headline-sm text-primary mt-1">Admin Overview</h1>
        </div>
        <Link href="/admin/students">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4 ml-1" />}>
            View Student Records
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase text-outline font-semibold">Total Students</span>
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <div className="font-headline text-2xl font-bold text-primary">{students.length}</div>
          <p className="font-sans text-[11px] text-on-surface-variant mt-1">Live Google Form joinees</p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase text-outline font-semibold">Activities</span>
            <Calendar className="w-5 h-5 text-secondary" />
          </div>
          <div className="font-headline text-2xl font-bold text-primary">{events.length}</div>
          <p className="font-sans text-[11px] text-on-surface-variant mt-1">Scheduled sessions</p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase text-outline font-semibold">Trailhead Badges</span>
            <Award className="w-5 h-5 text-secondary" />
          </div>
          <div className="font-headline text-2xl font-bold text-primary">{totalBadges}</div>
          <p className="font-sans text-[11px] text-on-surface-variant mt-1">Earned by members</p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase text-outline font-semibold">Resources</span>
            <BookOpen className="w-5 h-5 text-secondary" />
          </div>
          <div className="font-headline text-2xl font-bold text-primary">{resources.length}</div>
          <p className="font-sans text-[11px] text-on-surface-variant mt-1">Learning items published</p>
        </GlassCard>
      </div>

      {/* Sync Status Banner */}
      <GlassCard className="p-6 bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary">Form & Sheets Integration</Badge>
            <span className="text-xs font-sans text-outline">API Connected</span>
          </div>
          <h3 className="font-headline text-base font-semibold text-primary">
            Deployed Google Apps Script API
          </h3>
          <p className="font-sans text-xs text-on-surface-variant max-w-xl">
            Live student responses from the Google Form & Sheet sync directly to the website via the Apps Script API endpoint.
          </p>
        </div>

        <Link href="/admin/settings">
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4 ml-1" />}>
            API Settings
          </Button>
        </Link>
      </GlassCard>

      {/* Quick Action Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h3 className="font-headline text-sm font-semibold text-primary">Recent Joinees</h3>
            <Link href="/admin/students" className="text-xs font-label text-secondary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2">
            {students.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-bright text-xs font-sans">
                <div>
                  <div className="font-semibold text-primary">{s.name}</div>
                  <div className="text-outline text-[11px] font-mono">{s.rollNo} • {s.branch}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-secondary">{s.totalTrailheadScore} Pts</span>
                  <div className="text-[10px] text-outline">Yr {s.year}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Scheduled Activities */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h3 className="font-headline text-sm font-semibold text-primary">Scheduled Activities</h3>
            <Link href="/admin/events" className="text-xs font-label text-secondary hover:underline">
              Manage Events
            </Link>
          </div>

          <div className="space-y-2">
            {events.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-bright text-xs font-sans">
                <div>
                  <div className="font-semibold text-primary">{e.title}</div>
                  <div className="text-outline text-[11px]">{e.eventType} • {e.date}</div>
                </div>
                <Badge variant="outline">{e.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
