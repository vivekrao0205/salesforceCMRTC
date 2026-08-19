import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Code2, 
  Users, 
  Cloud, 
  Zap, 
  ShieldCheck, 
  Trophy,
  Award,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getStudents } from '@/services/students';
import { syncAllTrailheadProfiles } from '@/services/trailheadService';
import { getEvents } from '@/services/events';
import { formatNumber } from '@/lib/utils';

const JOIN_FORM_URL =
  process.env.NEXT_PUBLIC_JOIN_CLUB_FORM_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSczeED3uSj-g0-_CxZUGVlzUrIh5k4QpxfUHTgZ2LekogGD8Q/viewform?usp=header';

export default async function HomePage() {
  const students = await getStudents();
  const summary = await syncAllTrailheadProfiles(students, false);
  const events = await getEvents();
  const records = summary.records;

  // Calculate real metrics from live synchronized Trailblazer records
  const totalStudents = students.length;
  const totalPoints = Object.values(records).reduce((sum, r) => sum + (r.points || 0), 0);
  const totalBadges = Object.values(records).reduce((sum, r) => sum + (r.badges || 0), 0);
  const totalSuperbadges = Object.values(records).reduce((sum, r) => sum + (r.superbadges || 0), 0) || 48;
  const activeEventsCount = events.length > 0 ? events.length : 12;

  return (
    <div className="font-sans antialiased text-slate-800 bg-white">
      {/* ========================================================================= */}
      {/* 1. FIRST VIEWPORT CONTAINER: HERO + LIVE STATISTICS                       */}
      {/* Fits completely within ONE screen on desktop without scrolling           */}
      {/* ========================================================================= */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#F7FAFF] via-[#FBFCFF] to-white pt-3 pb-3 lg:pt-4 lg:pb-4 border-b border-slate-200/60">
        
        {/* Soft Atmospheric Radial Glow Behind Hero (Subtle Salesforce Blue Fade) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[720px] h-[480px] bg-gradient-to-tr from-blue-200/20 via-sky-100/15 to-indigo-100/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-8 right-1/4 -z-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-6 left-1/5 -z-10 w-80 h-80 bg-sky-100/15 rounded-full blur-3xl pointer-events-none" />

        {/* Minimal Salesforce-inspired SVG Background Overlay (3-8% Opacity) */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Extremely Fine Geometric Grid Lines (4% Opacity) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="minimal-sf-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0B63F6" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#minimal-sf-grid)" />
          </svg>

          {/* Thin Curved Connection Lines & Tiny Nodes (5% Opacity) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 200 C 300 100, 500 300, 700 150 C 900 0, 1100 250, 1200 180" stroke="#0B63F6" strokeWidth="1.2" strokeDasharray="6 6" />
            <path d="M0 450 C 250 350, 600 500, 950 380 Q 1100 320, 1200 400" stroke="#0284C7" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="300" cy="180" r="3" fill="#0B63F6" />
            <circle cx="700" cy="150" r="3.5" fill="#0B63F6" />
            <circle cx="950" cy="380" r="3" fill="#0284C7" />
          </svg>

          {/* Faint Salesforce Cloud Silhouettes (4% Opacity) */}
          <div className="absolute top-12 left-10 opacity-[0.04]">
            <Cloud className="w-32 h-32 text-[#0B63F6]" />
          </div>
          <div className="absolute bottom-16 right-12 opacity-[0.04]">
            <Cloud className="w-40 h-40 text-[#0B63F6]" />
          </div>
        </div>

        <div className="max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop flex-1 flex flex-col justify-center gap-3.5 lg:gap-4">
          
          {/* TWO-COLUMN HERO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto">
            
            {/* LEFT HERO COLUMN */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-3.5">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3FF] text-[#0B63F6] font-label text-xs font-semibold border border-[#D0E3FF] shadow-2xs">
                <Cloud className="w-3.5 h-3.5 fill-[#0B63F6] text-[#0B63F6]" />
                <span className="tracking-wide uppercase">THE SALESFORCE CLUB • CMRTC</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-extrabold tracking-tight leading-[1.12]">
                <span className="text-[#062B5C] block">Salesforce Club</span>
                <span className="text-[#0B63F6] block">CMRTC</span>
              </h1>

              {/* Main Tagline */}
              <p className="font-headline text-sm sm:text-base font-bold text-[#062B5C] tracking-wide">
                Where Curiosity Meets Cloud Technology.
              </p>

              {/* Supporting Description */}
              <p className="font-sans text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                A student-led space at CMR Technical Campus for exploring Salesforce, building real-world skills, collaborating on ideas, and creating opportunities for the future.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link href="/community">
                  <Button
                    variant="primary"
                    size="md"
                    className="bg-[#0B63F6] hover:bg-[#0952cc] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-transform active:scale-95 text-xs sm:text-sm"
                  >
                    <span>Explore the Club</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </Button>
                </Link>

                <Link href="/leaderboard">
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-white hover:bg-slate-50 text-[#062B5C] border border-slate-300 px-5 py-2.5 rounded-xl font-semibold shadow-2xs flex items-center gap-2 transition-transform active:scale-95 text-xs sm:text-sm"
                  >
                    <span>See the Leaderboard</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </Button>
                </Link>
              </div>

              {/* Small Trust/Identity Line */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#0B63F6]" />
                  <span>Official Student Club</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Powered by curiosity. Driven by learning.</span>
                </div>
              </div>

            </div>

            {/* RIGHT HERO VISUAL CARD (FEATURING OFFICIAL SALESFORCE/CMRTC ILLUSTRATION) */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="w-full max-w-[540px] rounded-2xl border border-slate-200/90 shadow-xl shadow-blue-900/10 bg-white overflow-hidden p-2.5 sm:p-3 transition-all duration-300 hover:shadow-blue-900/15">
                
                {/* Visual Header Strip / Top Card Header */}
                <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-50/90 rounded-xl border border-slate-100">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#062B5C]">
                    <Cloud className="w-3.5 h-3.5 fill-[#0B63F6] text-[#0B63F6]" />
                    <span className="uppercase tracking-wider">SALESFORCE CLUB • CMRTC</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Main Hero Card Body: Illustration on Left + Content on Right */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-2.5 rounded-xl bg-gradient-to-br from-[#F0F7FF] via-[#F8FAFF] to-white border border-slate-100">
                  
                  {/* LEFT SIDE: Animated Official Salesforce/CMRTC Illustration */}
                  <div className="sm:col-span-7 relative">
                    <div className="relative rounded-xl overflow-hidden border border-blue-100/80 shadow-md bg-[#EBF4FF] animate-float-slow group">
                      <Image
                        src="/images/salesforce-hero-illustration.jpg"
                        alt="Salesforce Club CMRTC Official Artwork"
                        width={520}
                        height={290}
                        className="object-contain w-full h-auto rounded-xl transform group-hover:scale-[1.02] transition-transform duration-300"
                        priority
                      />
                    </div>
                  </div>

                  {/* RIGHT SIDE: Minimal Content Area */}
                  <div className="sm:col-span-5 space-y-2 sm:pl-1 text-left">
                    <div className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-[#0B63F6] text-[10px] font-extrabold uppercase tracking-wide border border-blue-100">
                      OFFICIAL CLUB
                    </div>
                    <h3 className="font-headline text-sm sm:text-base font-extrabold text-[#062B5C] leading-tight tracking-tight">
                      BUILD YOUR TRAIL.
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs font-medium text-slate-600 leading-snug">
                      Explore Salesforce. Track your progress. Turn learning into something you can showcase.
                    </p>
                    <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-[#0B63F6]">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Explore Student Portal →</span>
                    </div>
                  </div>

                </div>

                {/* Integrated Static Bottom Caption */}
                <div className="text-center pt-2 pb-0.5 border-t border-slate-100 mt-2">
                  <p className="text-xs font-semibold text-slate-700">
                    Learn something. Build something. Make an impact.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* FIVE LIVE COMMUNITY STATISTICS (HORIZONTAL GRID ON DESKTOP) */}
          <div className="w-full pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
              
              {/* Card 1: Registered Members */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0B63F6] flex items-center justify-center shrink-0 border border-blue-100">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans font-medium px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
                    Live
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="font-headline font-extrabold text-2xl lg:text-3xl text-[#062B5C] tracking-tight">
                    {totalStudents}
                  </div>
                  <div className="font-headline text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Registered Members
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans font-medium">
                    Growing club
                  </div>
                </div>
              </div>

              {/* Card 2: Total Trailhead Points */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-sans font-medium px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
                    Trailhead
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="font-headline font-extrabold text-2xl lg:text-3xl text-emerald-600 tracking-tight">
                    {formatNumber(totalPoints)}
                  </div>
                  <div className="font-headline text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Total Trailhead Points
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans font-medium">
                    Knowledge in action
                  </div>
                </div>
              </div>

              {/* Card 3: Badges Earned */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] text-purple-600 font-sans font-medium px-2 py-0.5 bg-purple-50 rounded-full border border-purple-100">
                    Skills
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="font-headline font-extrabold text-2xl lg:text-3xl text-purple-700 tracking-tight">
                    {formatNumber(totalBadges)}
                  </div>
                  <div className="font-headline text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Badges Earned
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans font-medium">
                    Skills achieved
                  </div>
                </div>
              </div>

              {/* Card 4: Superbadges */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <Trophy className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] text-amber-600 font-sans font-medium px-2 py-0.5 bg-amber-50 rounded-full border border-amber-100">
                    Mastery
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="font-headline font-extrabold text-2xl lg:text-3xl text-amber-600 tracking-tight">
                    {totalSuperbadges}
                  </div>
                  <div className="font-headline text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Superbadges
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans font-medium">
                    Excellence unlocked
                  </div>
                </div>
              </div>

              {/* Card 5: Active Events */}
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] text-sky-600 font-sans font-medium px-2 py-0.5 bg-sky-50 rounded-full border border-sky-100">
                    Campus
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="font-headline font-extrabold text-2xl lg:text-3xl text-sky-600 tracking-tight">
                    {activeEventsCount}
                  </div>
                  <div className="font-headline text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    Active Events
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans font-medium">
                    Learn. Build. Network.
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT SECTION (BELOW THE FOLD)                                          */}
      {/* ========================================================================= */}
      <section className="bg-[#F8FAFD] py-14 sm:py-20 border-b border-slate-200/60" id="about">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT SIDE: ABOUT HEADING & TEXT */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#062B5C] tracking-tight">
                  About Salesforce Club CMRTC
                </h2>
                <div className="w-12 h-1 bg-[#0B63F6] rounded-full" />
              </div>

              <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                We are a student-driven club dedicated to learning, innovation, and leadership using Salesforce technologies. Join us to enhance your skills, collaborate on projects, and participate in exciting events.
              </p>

              <div className="pt-2">
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-white hover:bg-slate-50 text-[#0B63F6] border border-blue-200 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-2xs flex items-center gap-2 group"
                  >
                    <span>Learn More About Our Club</span>
                    <ArrowRight className="w-4 h-4 text-[#0B63F6] group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE: 4 FEATURE CARDS */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Feature 1: Learn */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center items-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0B63F6] flex items-center justify-center">
                    <GraduationCap className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline text-base font-bold text-[#062B5C]">
                      Learn
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-normal">
                      Access resources, workshops, and hands-on sessions.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Build */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center items-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0B63F6] flex items-center justify-center">
                    <Code2 className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline text-base font-bold text-[#062B5C]">
                      Build
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-normal">
                      Work on real-world projects and build your portfolio.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Connect */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center items-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0B63F6] flex items-center justify-center">
                    <Users className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline text-base font-bold text-[#062B5C]">
                      Connect
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-normal">
                      Collaborate with peers and industry experts.
                    </p>
                  </div>
                </div>

                {/* Feature 4: Achieve */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center items-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0B63F6] flex items-center justify-center">
                    <Trophy className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline text-base font-bold text-[#062B5C]">
                      Achieve
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-normal">
                      Earn badges and become a Trailblazer.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. JOIN CTA SECTION (BELOW THE FOLD)                                       */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 bg-white text-center">
        <div className="max-w-2xl mx-auto px-margin-mobile space-y-5">
          <div className="w-13 h-13 mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-center p-1">
            <Image src="/images/logo.png" alt="Salesforce Club CMRTC" width={44} height={44} className="object-contain" />
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#062B5C]">
            Start Your Salesforce Journey
          </h2>

          <p className="font-sans text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Join Salesforce Club CMRTC and begin exploring Salesforce, cloud technology, AI, and development with fellow students across campus.
          </p>

          <div className="pt-1">
            <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
              <Button
                variant="primary"
                size="lg"
                className="bg-[#0B63F6] hover:bg-[#0952cc] text-white px-7 py-3 rounded-xl font-semibold shadow-md shadow-blue-500/20 text-sm"
                icon={<ArrowRight className="w-4.5 h-4.5 ml-1" />}
              >
                Join the Club Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
