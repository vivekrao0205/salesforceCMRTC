import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Award, BookOpen, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/Button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  // If on login route or unauthenticated, handle cleanly
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-6 text-center font-sans space-y-4">
        <div className="w-16 h-16 bg-surface border border-outline-variant/30 rounded-2xl p-1 shadow-sm flex items-center justify-center">
          <Image src="/images/logo.png" alt="Logo" width={52} height={52} className="object-contain" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="font-headline text-headline-sm text-primary">Protected Admin Portal</h2>
          <p className="text-xs text-on-surface-variant">
            Access to Salesforce Club CMRTC admin features is restricted to authorized coordinators.
          </p>
        </div>
        <Link href="/admin/login">
          <Button variant="primary" size="md">
            Sign In to Admin Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-surface-container-lowest border-r border-outline-variant/30 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm border border-outline-variant/30 overflow-hidden flex items-center justify-center">
              <Image src="/images/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <div className="font-headline font-bold text-sm text-primary">CMRTC Admin</div>
              <div className="text-[10px] text-outline font-mono">Coordinator Portal</div>
            </div>
          </div>

          {/* Admin Nav */}
          <nav className="space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-secondary" />
              Overview
            </Link>
            <Link
              href="/admin/students"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <Users className="w-4 h-4 text-secondary" />
              Student Records
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <Calendar className="w-4 h-4 text-secondary" />
              Activities
            </Link>
            <Link
              href="/admin/points"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <Award className="w-4 h-4 text-secondary" />
              Club Points
            </Link>
            <Link
              href="/admin/resources"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <BookOpen className="w-4 h-4 text-secondary" />
              Resources
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-label text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <Settings className="w-4 h-4 text-secondary" />
              API Settings
            </Link>
          </nav>
        </div>

        {/* Logout Form Action */}
        <div className="pt-6 border-t border-outline-variant/20">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-label text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout Session
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
