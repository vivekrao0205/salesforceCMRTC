import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const JOIN_FORM_URL =
  process.env.NEXT_PUBLIC_JOIN_CLUB_FORM_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSczeED3uSj-g0-_CxZUGVlzUrIh5k4QpxfUHTgZ2LekogGD8Q/viewform?usp=header';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 bg-primary text-on-primary border-t border-outline-variant/20 mt-auto font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-margin-desktop max-w-container-max mx-auto">
        {/* Brand Column */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-white p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Salesforce Club CMRTC Logo"
                width={36}
                height={36}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="relative h-8 w-auto bg-white p-0.5 rounded border border-outline-variant/20 flex items-center justify-center">
              <Image
                src="/images/cmrtc-logo.png"
                alt="CMR Technical Campus Logo"
                width={32}
                height={32}
                className="object-contain h-full w-auto"
              />
            </div>
            <span className="font-headline text-lg font-bold text-on-primary">
              Salesforce Club CMRTC
            </span>
          </div>
          <p className="text-xs text-primary-fixed-dim max-w-md leading-relaxed">
            Student technology community at CMR Technical Campus (CMRTC). Learn. Build. Connect.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label text-xs w-fit">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            CMR Technical Campus (CMRTC)
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2 text-xs">
          <h4 className="font-label uppercase tracking-wider font-semibold text-secondary-fixed mb-1">
            Navigation
          </h4>
          <Link href="/" className="text-primary-fixed-dim hover:text-on-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-primary-fixed-dim hover:text-on-primary transition-colors">
            About
          </Link>
          <Link href="/community" className="text-primary-fixed-dim hover:text-on-primary transition-colors">
            Community Directory
          </Link>
          <Link href="/leaderboard" className="text-primary-fixed-dim hover:text-on-primary transition-colors">
            Leaderboard
          </Link>
        </div>

        {/* Resources & Join */}
        <div className="flex flex-col gap-2 text-xs">
          <h4 className="font-label uppercase tracking-wider font-semibold text-secondary-fixed mb-1">
            Portals & Registration
          </h4>
          <Link href="/resources" className="text-primary-fixed-dim hover:text-on-primary transition-colors">
            Resources
          </Link>
          <a
            href={JOIN_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-fixed font-semibold hover:text-on-primary transition-colors"
          >
            Join the Club
          </a>
          <Link href="/login" className="text-primary-fixed-dim hover:text-on-primary transition-colors">
            Coordinator Portal
          </Link>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="mt-8 pt-6 border-t border-primary-fixed/20 px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-primary-fixed-dim">
        <p>© {new Date().getFullYear()} Salesforce Club CMRTC. All rights reserved.</p>
        <p className="mt-2 md:mt-0 font-label">Learn. Build. Connect.</p>
      </div>
    </footer>
  );
};

