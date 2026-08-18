import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  BookOpen, 
  Code2, 
  Users, 
  Cloud, 
  Bot, 
  Zap, 
  Database, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { InitialsAvatar } from '@/components/ui/InitialsAvatar';
import { getStudents } from '@/services/students';
import { syncAllTrailheadProfiles } from '@/services/trailheadService';
import { formatNumber, parseNumericValue } from '@/lib/utils';

const JOIN_FORM_URL =
  process.env.NEXT_PUBLIC_JOIN_CLUB_FORM_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSczeED3uSj-g0-_CxZUGVlzUrIh5k4QpxfUHTgZ2LekogGD8Q/viewform?usp=header';

export default async function HomePage() {
  const students = await getStudents();
  const summary = await syncAllTrailheadProfiles(students, false);
  const records = summary.records;

  // Calculate real metrics from live synchronized Trailblazer records
  const totalStudents = students.length;
  const totalPoints = Object.values(records).reduce((sum, r) => sum + (r.points || 0), 0);
  const totalBadges = Object.values(records).reduce((sum, r) => sum + (r.badges || 0), 0);

  return (
    <div className="space-y-stack-lg pb-stack-lg">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-stack-lg md:pt-24 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary-fixed rounded-full blur-[120px] opacity-40 translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
          <div className="flex flex-col items-start space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary font-label text-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              A New Journey Begins
            </div>

            <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary leading-tight">
              <span className="block text-secondary font-label text-sm uppercase tracking-widest mb-2 font-bold">
                Salesforce Club CMRTC
              </span>
              Learn. Build. Connect.
            </h1>

            <p className="font-sans text-body-lg text-on-surface-variant max-w-xl text-balance">
              A student-driven community at CMR Technical Campus (CMRTC) exploring Salesforce, cloud technology, AI, automation, development, and career-ready skills.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5 ml-1" />}>
                  Join the Club
                </Button>
              </a>
              <Link href="/community">
                <Button variant="outline" size="lg">
                  Explore Community
                </Button>
              </Link>
            </div>
          </div>

          {/* Real Statistics Card — Premium Salesforce-Inspired Live Data Box */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-7 md:p-8 bg-gradient-to-br from-[#00A1E0] via-[#0176D3] to-[#0B5C9E] text-white border border-white/20">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-label text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </div>
              <Cloud className="w-9 h-9 text-white/90" />
            </div>

            <div className="space-y-5 my-auto py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                    LIVE TRAILBLAZER DATA
                  </h3>
                </div>
                <p className="font-sans text-xs text-blue-100/90 leading-relaxed">
                  Live data from Salesforce Trailblazer public profiles.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-blue-100/80 font-mono">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live synchronization enabled
                </div>
              </div>

              {/* Dynamic Statistics */}
              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
                  <div className="font-headline font-bold text-xl md:text-2xl text-white">{totalStudents}</div>
                  <div className="text-[11px] font-sans font-medium text-blue-100/90 mt-1">Registered Members</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
                  <div className="font-headline font-bold text-xl md:text-2xl text-amber-300">{formatNumber(totalPoints)}</div>
                  <div className="text-[11px] font-sans font-medium text-blue-100/90 mt-1">Trailhead Points</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
                  <div className="font-headline font-bold text-xl md:text-2xl text-white">{formatNumber(totalBadges)}</div>
                  <div className="text-[11px] font-sans font-medium text-blue-100/90 mt-1">Badges Earned</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/20">
              <div className="w-9 h-9 rounded-full bg-white p-0.5 shrink-0 flex items-center justify-center shadow-md">
                <Image src="/images/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <div className="font-headline text-xs font-bold text-white">Official Salesforce Student Group</div>
                <div className="font-sans text-[11px] text-blue-100/90">CMR Technical Campus (CMRTC)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WELCOME */}
      <section className="py-stack-lg bg-surface-container-low border-y border-outline-variant/20" id="about">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center space-y-stack-md">
          <div className="max-w-2xl mx-auto space-y-3">
            <Badge variant="outline">Welcome to Salesforce Club CMRTC</Badge>
            <h2 className="font-headline text-headline-md text-primary">
              Building the Future of Cloud & AI Leaders at CMRTC
            </h2>
            <p className="font-sans text-body-md text-on-surface-variant">
              We are a newly established, student-focused technical community dedicated to peer learning, practical cloud development, and Trailhead exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter text-left pt-4">
            <GlassCard>
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-headline text-headline-sm text-primary mb-3">Learn</h3>
              <p className="font-sans text-body-md text-on-surface-variant">
                Explore Salesforce and modern cloud technologies through guided learning paths and Trailhead modules.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant mb-6">
                <Code2 className="w-7 h-7" />
              </div>
              <h3 className="font-headline text-headline-sm text-primary mb-3">Build</h3>
              <p className="font-sans text-body-md text-on-surface-variant">
                Turn knowledge into practical solutions by working on projects, automation flows, and custom applications.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center text-primary mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-headline text-headline-sm text-primary mb-3">Connect</h3>
              <p className="font-sans text-body-md text-on-surface-variant">
                Collaborate with fellow students across departments, share ideas, and grow together in a supportive technology ecosystem.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* SECTION: WHAT IS SALESFORCE? */}
      <section className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="mb-2">Platform Overview</Badge>
          <h2 className="font-headline text-headline-md text-primary mb-3">What is Salesforce?</h2>
          <p className="font-sans text-body-lg text-on-surface-variant">
            Salesforce is a global leader in cloud software, powering customer relationships, enterprise automation, generative AI, and custom cloud apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="hover:border-secondary transition-colors">
            <div className="flex items-center gap-3 mb-3 text-secondary">
              <Layers className="w-6 h-6" />
              <h3 className="font-headline text-headline-sm text-primary">CRM</h3>
            </div>
            <p className="font-sans text-body-md text-on-surface-variant">
              Customer Relationship Management systems connecting business data, operations, and customer experience.
            </p>
          </GlassCard>

          <GlassCard className="hover:border-secondary transition-colors">
            <div className="flex items-center gap-3 mb-3 text-secondary">
              <Cloud className="w-6 h-6" />
              <h3 className="font-headline text-headline-sm text-primary">Cloud Computing</h3>
            </div>
            <p className="font-sans text-body-md text-on-surface-variant">
              Multi-tenant, scalable cloud infrastructure enabling rapid deployment of enterprise applications.
            </p>
          </GlassCard>

          <GlassCard className="hover:border-secondary transition-colors">
            <div className="flex items-center gap-3 mb-3 text-secondary">
              <Bot className="w-6 h-6" />
              <h3 className="font-headline text-headline-sm text-primary">AI</h3>
            </div>
            <p className="font-sans text-body-md text-on-surface-variant">
              Predictive analytics, agentic AI models, and machine learning integrated into business workflows.
            </p>
          </GlassCard>

          <GlassCard className="hover:border-secondary transition-colors">
            <div className="flex items-center gap-3 mb-3 text-secondary">
              <Zap className="w-6 h-6" />
              <h3 className="font-headline text-headline-sm text-primary">Automation</h3>
            </div>
            <p className="font-sans text-body-md text-on-surface-variant">
              No-code and low-code workflow automation tools like Flow Builder that eliminate repetitive tasks.
            </p>
          </GlassCard>

          <GlassCard className="hover:border-secondary transition-colors">
            <div className="flex items-center gap-3 mb-3 text-secondary">
              <Database className="w-6 h-6" />
              <h3 className="font-headline text-headline-sm text-primary">Data</h3>
            </div>
            <p className="font-sans text-body-md text-on-surface-variant">
              Harmonizing real-time data streams into unified profiles for actionable enterprise insights.
            </p>
          </GlassCard>

          <GlassCard className="hover:border-secondary transition-colors">
            <div className="flex items-center gap-3 mb-3 text-secondary">
              <Code2 className="w-6 h-6" />
              <h3 className="font-headline text-headline-sm text-primary">Development</h3>
            </div>
            <p className="font-sans text-body-md text-on-surface-variant">
              Extending solutions using Apex programming language, Lightning Web Components (LWC), and web APIs.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* RECENT JOINERS PREVIEW (FIRST 4 STUDENTS) */}
      <section className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="secondary" className="mb-1">Community</Badge>
            <h2 className="font-headline text-headline-md text-primary">Recent Joiners</h2>
          </div>
          <Link href="/community" className="text-secondary font-label text-sm font-semibold flex items-center gap-1 hover:underline">
            View All Members ({students.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {students.slice(0, 4).map((student) => (
            <GlassCard key={student.id} className="flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3">
                <InitialsAvatar name={student.name} id={student.id} size="md" />
                <div className="flex-grow min-w-0">
                  <h3 className="font-headline text-sm font-semibold text-primary truncate">{student.name}</h3>
                  <p className="font-sans text-xs text-outline font-mono">{student.rollNo}</p>
                  <div className="text-[11px] text-on-surface-variant mt-0.5">{student.branch} • Yr {student.year}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs font-sans">
                <span className="text-secondary font-bold">{formatNumber(student.totalTrailheadScore)} Pts</span>
                <span className="text-outline">{student.totalTrailheadBadges} Badges</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* SECTION: JOIN CTA */}
      <section className="py-20 bg-surface-container-lowest border-t border-outline-variant/20 text-center relative overflow-hidden" id="join">
        <div className="max-w-3xl mx-auto px-margin-mobile space-y-6 relative z-10">
          <div className="w-16 h-16 mx-auto bg-surface border border-outline-variant/30 rounded-2xl shadow-sm flex items-center justify-center p-1">
            <Image src="/images/logo.png" alt="Logo" width={56} height={56} className="object-contain" />
          </div>

          <h2 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary">
            Start Your Salesforce Journey
          </h2>

          <p className="font-sans text-body-lg text-on-surface-variant max-w-xl mx-auto text-balance">
            Join Salesforce Club CMRTC and begin exploring Salesforce, cloud, AI, and development with fellow students across campus.
          </p>

          <div className="pt-2">
            <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5 ml-1" />}>
                Join the Club Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
