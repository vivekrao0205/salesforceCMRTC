import React from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Rocket, 
  BookOpen, 
  Code2, 
  Compass, 
  Users, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-lg">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-surface-bright via-surface-container-low to-surface-container-lowest rounded-card p-8 md:p-14 shadow-ambient border border-outline-variant/20 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <Badge variant="secondary">About Us</Badge>
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary">
            About Salesforce Club CMRTC
          </h1>
          <p className="font-sans text-body-lg text-on-surface-variant leading-relaxed">
            The Salesforce Club at CMR Technical Campus (CMRTC) is a student-led technology community dedicated to bridging the gap between academic education and enterprise-grade cloud development skills.
          </p>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-3 text-secondary">
            <Eye className="w-7 h-7" />
            <h2 className="font-headline text-headline-sm text-primary">Our Vision</h2>
          </div>
          <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
            "To build a student-driven technology community at CMRTC that inspires learning, encourages innovation and prepares students for the future of cloud, AI and digital technology."
          </p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center gap-3 text-secondary">
            <Rocket className="w-7 h-7" />
            <h2 className="font-headline text-headline-sm text-primary">Our Mission</h2>
          </div>
          <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
            We are committed to fostering an inclusive peer community where students guide and support one another through structured study groups, hands-on project building, and practical Trailhead exercises.
          </p>
        </GlassCard>
      </div>

      {/* Trailblazer Journey Flow */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Badge variant="outline">Learning Framework</Badge>
          <h2 className="font-headline text-headline-md text-primary">The Trailblazer Journey</h2>
          <p className="font-sans text-body-md text-on-surface-variant">
            How we empower students from zero cloud experience to proficient developer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Learn', icon: BookOpen, desc: 'Master foundational CRM and cloud architecture concepts on Trailhead.' },
            { step: '02', title: 'Build', icon: Code2, desc: 'Apply knowledge by creating automation flows and Lightning web apps.' },
            { step: '03', title: 'Explore', icon: Compass, desc: 'Discover advanced topics like Einstein AI, Data Cloud, and API integrations.' },
            { step: '04', title: 'Collaborate', icon: Users, desc: 'Work alongside fellow CMRTC students on team exercises and peer sessions.' },
            { step: '05', title: 'Grow', icon: TrendingUp, desc: 'Build a verified learning portfolio that prepares you for tech opportunities.' },
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <GlassCard key={item.step} className="flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-headline text-xs font-bold text-secondary tracking-widest block mb-2">
                    STEP {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-3">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline text-sm font-semibold text-primary">{item.title}</h3>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">{item.desc}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Real Data Policy & Commitment */}
      <GlassCard className="bg-surface-container-low border border-outline-variant/30 space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <ShieldCheck className="w-6 h-6 text-secondary" />
          <h3 className="font-headline text-headline-sm">Authentic Student Community</h3>
        </div>
        <p className="font-sans text-body-md text-on-surface-variant">
          Salesforce Club CMRTC is founded in 2026. We believe in authenticity, transparent student progress, and honest learning. We track real student Trailhead points and club participation as our members build their skills.
        </p>
        <div className="pt-2">
          <Link href="/join">
            <Button variant="primary" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Become a Member Today
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
