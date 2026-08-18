'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, User, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { ClubEvent, EventStatus } from '@/types';
import { getEvents } from '@/services/events';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const data = await getEvents(statusFilter);
        setEvents(data);
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [statusFilter]);

  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="secondary">Club Activities</Badge>
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary">
          Salesforce Club CMRTC Events
        </h1>
        <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl">
          Discover student workshops, learning bootcamps, and community meetups organized by Salesforce Club CMRTC.
        </p>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
        {['ALL', 'Upcoming', 'Ongoing', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st as EventStatus | 'ALL')}
            className={`px-4 py-2 rounded-lg font-label text-xs font-semibold transition-all ${
              statusFilter === st
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border border-outline-variant/20'
            }`}
          >
            {st === 'ALL' ? 'All Activities' : st}
          </button>
        ))}
      </div>

      {/* Events Grid / Empty State */}
      {events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Events Found"
          description="Our first Salesforce Club CMRTC activities are coming soon. Check back shortly or join the club to get updates!"
          actionText="Join the Club"
          actionHref="/join"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <GlassCard key={evt.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">{evt.eventType}</Badge>
                  <Badge variant={evt.status === 'Upcoming' ? 'secondary' : 'outline'}>
                    {evt.status}
                  </Badge>
                </div>

                <h3 className="font-headline text-headline-sm text-primary">{evt.title}</h3>
                <p className="font-sans text-body-md text-on-surface-variant line-clamp-3">
                  {evt.description}
                </p>

                <div className="space-y-1.5 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/20 font-sans">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                    <span>Date: {evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-secondary shrink-0" />
                    <span>Time: {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary shrink-0" />
                    <span>Location: {evt.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-xs text-outline font-sans">By {evt.organizer}</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedEvent(evt)}>
                  Event Details
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{selectedEvent.eventType}</Badge>
              <Badge variant="secondary">{selectedEvent.status}</Badge>
            </div>

            <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="bg-surface-container-low p-4 rounded-xl space-y-2 text-xs font-sans text-on-surface-variant">
              <div><strong>Date:</strong> {selectedEvent.date}</div>
              <div><strong>Time:</strong> {selectedEvent.time}</div>
              <div><strong>Location:</strong> {selectedEvent.location}</div>
              <div><strong>Organizer:</strong> {selectedEvent.organizer}</div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
              <Link href="/join">
                <Button variant="primary">Join Club to Register</Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
