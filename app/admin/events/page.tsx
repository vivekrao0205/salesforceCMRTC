'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { ClubEvent, EventType, EventStatus } from '@/types';
import { getEvents, createEvent, deleteEvent, updateEvent } from '@/services/events';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('Learning Session');
  const [date, setDate] = useState('TBA');
  const [time, setTime] = useState('TBA');
  const [location, setLocation] = useState('CMRTC Campus');
  const [status, setStatus] = useState<EventStatus>('Upcoming');

  const loadData = async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    await createEvent({
      title,
      description,
      eventType,
      date,
      time,
      location,
      organizer: 'Salesforce Club CMRTC',
      status,
      attendeesCount: 0,
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event?')) {
      await deleteEvent(id);
      loadData();
    }
  };

  const handleStatusToggle = async (evt: ClubEvent) => {
    const nextStatus: EventStatus = evt.status === 'Upcoming' ? 'Completed' : 'Upcoming';
    await updateEvent(evt.id, { status: nextStatus });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <Badge variant="secondary">Activities</Badge>
          <h1 className="font-headline text-headline-sm text-primary mt-1">Events Manager</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4 ml-1" />}>
          Create Activity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => (
          <GlassCard key={evt.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="primary">{evt.eventType}</Badge>
              <button
                onClick={() => handleStatusToggle(evt)}
                className="hover:scale-105 transition-transform"
              >
                <Badge variant={evt.status === 'Upcoming' ? 'secondary' : 'outline'}>
                  {evt.status} (Click to Toggle)
                </Badge>
              </button>
            </div>

            <h3 className="font-headline text-base font-semibold text-primary">{evt.title}</h3>
            <p className="font-sans text-xs text-on-surface-variant line-clamp-2">{evt.description}</p>

            <div className="text-xs font-sans text-outline space-y-1">
              <div>Date: {evt.date} • Time: {evt.time}</div>
              <div>Location: {evt.location}</div>
            </div>

            <div className="pt-2 border-t border-outline-variant/20 flex justify-end">
              <Button variant="danger" size="sm" onClick={() => handleDelete(evt.id)} icon={<Trash2 className="w-3.5 h-3.5 ml-1" />}>
                Delete
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Activity">
        <form onSubmit={handleCreate} className="space-y-4 font-sans">
          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Activity Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trailhead Workshop"
              className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of session..."
              className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Activity Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              >
                <option value="Learning Session">Learning Session</option>
                <option value="Trailhead Session">Trailhead Session</option>
                <option value="Technical Workshop">Technical Workshop</option>
                <option value="Club Meetup">Club Meetup</option>
                <option value="Project Session">Project Session</option>
                <option value="Student Challenge">Student Challenge</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="TBA or YYYY-MM-DD"
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="TBA or 10:00 AM"
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="CMRTC Lab 3"
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
