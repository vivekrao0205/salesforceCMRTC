export interface Student {
  id: string; // Unique internal CMRTC ID (e.g. CMRTC-2026-0001)
  cmrtcId?: string;
  name: string;
  rollNo: string;
  branch: string;
  year: string | number;
  section?: string;
  phoneNo?: string;
  eMailCollegeMail?: string;
  trailheadProfileLink?: string;
  trailblazerProfileId?: string;
  totalTrailheadScore: number;
  totalTrailheadBadges: number;
  salesforceUsername?: string;
  certificationsCount?: number;
  superbadgesCount?: number;
  clubPoints?: number;
  _raw?: Record<string, any>;
  [key: string]: unknown; // Support for dynamic Google Form fields
}

export type EventType = 'Learning Session' | 'workshop' | 'hackathon' | 'webinar' | 'meetup' | string;
export type EventStatus = 'upcoming' | 'ongoing' | 'past' | string;

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  type?: EventType;
  eventType?: EventType;
  status: EventStatus;
  organizer?: string;
  attendeesCount?: number;
  registrationUrl?: string;
  imageUrl?: string;
}

export type ResourceCategory = 'trailmix' | 'certification' | 'guide' | 'documentation' | string;

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  url: string;
  level?: string;
  type?: string;
  tags?: string[];
  addedAt?: string;
  badgeRequired?: string;
}

export interface AppSettings {
  clubName?: string;
  collegeName?: string;
  apiUrl?: string;
  registrationFormUrl?: string;
  googleFormUrl?: string;
  contactEmail?: string;
  trailheadApiUrl?: string;
  trailheadSyncIntervalMinutes?: number;
  [key: string]: unknown;
}
