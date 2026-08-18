'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg('Invalid admin credentials.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setErrorMsg('Invalid admin credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-center items-center min-h-[70vh]">
      <GlassCard className="w-full max-w-md p-8 md:p-10 space-y-6 bg-gradient-to-b from-surface-bright via-surface-container-lowest to-surface-container-low">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-surface border border-outline-variant/30 rounded-2xl shadow-sm flex items-center justify-center p-1">
            <Image src="/images/logo.png" alt="Salesforce Club CMRTC Logo" width={52} height={52} className="object-contain" />
          </div>
          <Badge variant="secondary">Protected Access</Badge>
          <h1 className="font-headline text-headline-sm text-primary">Coordinator Portal</h1>
          <p className="font-sans text-xs text-on-surface-variant">
            Authorized admin sign-in for Salesforce Club CMRTC managers.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div className="space-y-1">
            <label className="font-label uppercase text-outline font-semibold text-[11px]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label uppercase text-outline font-semibold text-[11px]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              className="w-full"
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
