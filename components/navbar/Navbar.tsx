'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const JOIN_FORM_URL =
  process.env.NEXT_PUBLIC_JOIN_CLUB_FORM_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSczeED3uSj-g0-_CxZUGVlzUrIh5k4QpxfUHTgZ2LekogGD8Q/viewform?usp=header';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Club', href: '/community' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 focus:outline-none rounded-lg group">
          {/* CMR Technical Campus Official Logo */}
          <div className="relative h-10 w-auto overflow-hidden bg-white p-0.5 rounded flex items-center justify-center">
            <Image
              src="/images/cmrtc-logo.png"
              alt="CMR Technical Campus Logo"
              width={42}
              height={42}
              className="object-contain h-full w-auto"
              priority
            />
          </div>

          {/* Subtle Vertical Divider */}
          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          {/* Salesforce Club Badge & Stacked Text */}
          <div className="flex items-center gap-2">
            <div className="relative w-9 h-9 overflow-hidden rounded-full border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300 bg-white flex items-center justify-center p-0.5">
              <Image
                src="/images/logo.png"
                alt="Salesforce Club CMRTC Logo"
                width={36}
                height={36}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-headline text-sm font-bold text-[#062B5C] group-hover:text-[#0B63F6] transition-colors">
                Salesforce Club
              </span>
              <span className="font-headline text-xs font-extrabold text-[#0B63F6] tracking-wider uppercase">
                CMRTC
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-label text-label-md transition-all px-3 py-1.5 rounded-md ${
                  active
                    ? 'text-secondary font-bold border-b-2 border-secondary bg-surface-container-low/60'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <a href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
              Join the Club
            </Button>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden flex items-center p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-6 space-y-3 animate-fade-in">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block font-label text-label-md py-2.5 px-4 rounded-lg transition-colors ${
                  active
                    ? 'bg-secondary text-on-secondary font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
            <a
              href={JOIN_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block w-full"
            >
              <Button variant="primary" className="w-full">
                Join the Club
              </Button>
            </a>
            <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full">
              <Button variant="outline" className="w-full">
                Coordinator Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

