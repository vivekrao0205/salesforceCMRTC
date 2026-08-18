import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const JOIN_FORM_URL =
  process.env.NEXT_PUBLIC_JOIN_CLUB_FORM_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSczeED3uSj-g0-_CxZUGVlzUrIh5k4QpxfUHTgZ2LekogGD8Q/viewform?usp=header';

export default function JoinPage() {
  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md">
      <GlassCard className="p-8 md:p-16 text-center max-w-3xl mx-auto space-y-6 bg-gradient-to-b from-surface-bright via-surface-container-lowest to-surface-container-low">
        <div className="w-20 h-20 mx-auto bg-surface border border-outline-variant/30 rounded-card shadow-sm flex items-center justify-center p-2">
          <Image src="/images/logo.png" alt="Logo" width={64} height={64} className="object-contain" />
        </div>

        <Badge variant="secondary">Official Club Registration</Badge>

        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary">
          Start Your Salesforce Journey
        </h1>

        <p className="font-sans text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          Join Salesforce Club CMRTC and begin exploring Salesforce, cloud technology, AI, automation, and practical enterprise development alongside fellow students.
        </p>

        <div className="bg-surface-container-low p-6 rounded-xl text-left space-y-3 max-w-md mx-auto">
          <h3 className="font-headline text-xs uppercase tracking-wider font-semibold text-primary">
            Official Registration Requirements:
          </h3>
          <ul className="space-y-2 text-xs font-sans text-on-surface-variant">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Full Name & Roll Number
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Branch & Year
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Trailhead Profile Link
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" /> Total Trailhead Score & Badges
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5 ml-1" />}>
              Open Registration Form
            </Button>
          </a>
        </div>

        <p className="text-xs font-sans text-outline">
          Your registration details sync directly to the website community directory and leaderboard.
        </p>
      </GlassCard>
    </div>
  );
}
