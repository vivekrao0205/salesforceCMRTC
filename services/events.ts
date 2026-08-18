import { ClubEvent, EventStatus, EventType } from '@/types';
import { initialEvents } from '@/lib/mockData';

let localEventsStore: ClubEvent[] = [...initialEvents];

export async function getEvents(statusFilter?: EventStatus | 'ALL'): Promise<ClubEvent[]> {
  if (statusFilter && statusFilter !== 'ALL') {
    return localEventsStore.filter((e) => e.status === statusFilter);
  }
  return Promise.resolve([...localEventsStore]);
}

export async function getEventById(id: string): Promise<ClubEvent | null> {
  const found = localEventsStore.find((e) => e.id === id);
  return found || null;
}

export async function createEvent(event: Omit<ClubEvent, 'id'>): Promise<ClubEvent> {
  const newEvent: ClubEvent = {
    ...event,
    id: `evt-${Date.now()}`,
  };
  localEventsStore.push(newEvent);
  return newEvent;
}

export async function updateEvent(id: string, updates: Partial<ClubEvent>): Promise<ClubEvent | null> {
  const idx = localEventsStore.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  localEventsStore[idx] = { ...localEventsStore[idx], ...updates };
  return localEventsStore[idx];
}

export async function deleteEvent(id: string): Promise<boolean> {
  const lenBefore = localEventsStore.length;
  localEventsStore = localEventsStore.filter((e) => e.id !== id);
  return localEventsStore.length < lenBefore;
}
