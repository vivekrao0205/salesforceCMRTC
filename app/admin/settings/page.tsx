'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Copy } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { defaultSettings } from '@/lib/mockData';

export default function AdminSettingsPage() {
  const [formUrl, setFormUrl] = useState(defaultSettings.googleFormUrl);
  const [contactEmail, setContactEmail] = useState(defaultSettings.contactEmail);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const webhookEndpoint = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/sync-students`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-outline-variant/20 pb-4">
        <Badge variant="secondary">System Configuration</Badge>
        <h1 className="font-headline text-headline-sm text-primary mt-1">Settings & Ingestion</h1>
      </div>

      {saved && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          Settings saved successfully!
        </div>
      )}

      {/* Settings Form */}
      <GlassCard className="max-w-2xl space-y-4">
        <h3 className="font-headline text-base font-semibold text-primary">Integration Settings</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">
              Official Join Google Form URL
            </label>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
            <p className="text-[11px] text-outline mt-1">
              Controls the destination link for "Join the Club" CTA buttons throughout the app.
            </p>
          </div>

          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">
              Contact / Support Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <div className="pt-2">
            <Button variant="primary" type="submit" icon={<Save className="w-4 h-4 ml-1" />}>
              Save Settings
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Webhook Endpoint Box */}
      <GlassCard className="max-w-2xl space-y-3 bg-surface-container-low border border-outline-variant/30">
        <h3 className="font-headline text-sm font-semibold text-primary">
          Google Apps Script Webhook Endpoint
        </h3>
        <p className="text-xs text-on-surface-variant">
          Provide this URL in your Google Apps Script configuration file (<span className="font-mono text-primary">docs/google-apps-script.js</span>) to allow new form submissions to automatically update Firestore and application state.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={webhookEndpoint}
            className="flex-grow p-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs font-mono"
          />
          <Button variant="outline" size="sm" onClick={copyWebhook} icon={<Copy className="w-3.5 h-3.5" />}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
