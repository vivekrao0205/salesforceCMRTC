import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, User, ArrowLeft, ExternalLink } from 'lucide-react';
import { getEventById } from '@/services/events';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function EventDetailPage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await getEventById(params.eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md">
      <div>
        <Link href="/events">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4 mr-1" />}>
            Back to Events
          </Button>
        </Link>
      </div>

      <GlassCard className="p-8 md:p-12 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{event.eventType}</Badge>
          <Badge variant="secondary">{event.status}</Badge>
        </div>

        <h1 className="font-headline text-headline-lg-mobile md:text-headline-md text-primary">
          {event.title}
        </h1>

        <p className="font-sans text-body-lg text-on-surface-variant leading-relaxed">
          {event.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container-low p-6 rounded-xl text-sm font-sans">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-secondary" />
            <div>
              <div className="text-outline text-xs uppercase font-label">Date</div>
              <div className="font-semibold text-primary">{event.date}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-secondary" />
            <div>
              <div className="text-outline text-xs uppercase font-label">Time</div>
              <div className="font-semibold text-primary">{event.time}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-secondary" />
            <div>
              <div className="text-outline text-xs uppercase font-label">Location</div>
              <div className="font-semibold text-primary">{event.location}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-outline-variant/20">
          <span className="text-xs font-sans text-outline">Organized by: {event.organizer}</span>
          <Link href="/join">
            <Button variant="primary" icon={<ExternalLink className="w-4 h-4 ml-1" />}>
              Join Club & Register
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
