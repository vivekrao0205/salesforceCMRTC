import { Student, ClubEvent, Resource, AppSettings } from '@/types';

export const initialStudents: Student[] = [];

export const initialEvents: ClubEvent[] = [
  {
    id: 'evt-001',
    title: 'Salesforce Fundamentals Bootcamp',
    description: 'An intensive introduction to navigating the platform, managing data, and understanding standard enterprise objects.',
    eventType: 'Learning Session',
    date: 'TBA',
    time: 'TBA',
    location: 'CMRTC Seminar Hall / Online',
    registrationUrl: '',
    organizer: 'Salesforce Club CMRTC',
    status: 'Upcoming',
    attendeesCount: 0,
  },
  {
    id: 'evt-002',
    title: 'Trailhead Onboarding Session',
    description: 'Set up your learning profile, earn your first badges, and map out your certification journey with fellow students.',
    eventType: 'Trailhead Session',
    date: 'TBA',
    time: 'TBA',
    location: 'CMRTC Computer Lab 3',
    registrationUrl: '',
    organizer: 'Salesforce Club CMRTC',
    status: 'Upcoming',
    attendeesCount: 0,
  },
  {
    id: 'evt-003',
    title: 'Community Meet & Greet',
    description: 'Connect with fellow students, discuss goals, and help shape the future activities of the club.',
    eventType: 'Club Meetup',
    date: 'TBA',
    time: 'TBA',
    location: 'CMRTC Campus Auditorium',
    registrationUrl: '',
    organizer: 'Salesforce Club CMRTC',
    status: 'Upcoming',
    attendeesCount: 0,
  },
];

export const initialResources: Resource[] = [
  {
    id: 'res-001',
    title: 'Salesforce Ecosystem Basics',
    description: 'Understand core Salesforce architecture, cloud offerings, and how CRM powers modern enterprise businesses.',
    category: 'Salesforce Basics',
    url: 'https://trailhead.salesforce.com/content/learn/modules/lex_migration_introduction',
    type: 'Trailhead Module',
    level: 'Beginner',
    tags: ['CRM', 'Cloud', 'Intro'],
    addedAt: '2026-08-18',
  },
  {
    id: 'res-002',
    title: 'Get Started with Trailhead',
    description: 'Official beginner guide to navigating modules, projects, trails, and earning your first Trailhead badges.',
    category: 'Trailhead',
    url: 'https://trailhead.salesforce.com/',
    type: 'Documentation',
    level: 'Beginner',
    tags: ['Trailhead', 'Badges', 'Guide'],
    addedAt: '2026-08-18',
  },
];

export const defaultSettings: AppSettings = {
  googleFormUrl:
    process.env.NEXT_PUBLIC_JOIN_CLUB_FORM_URL ||
    'https://docs.google.com/forms/d/e/1FAIpQLSczeED3uSj-g0-_CxZUGVlzUrIh5k4QpxfUHTgZ2LekogGD8Q/viewform?usp=header',
  apiUrl:
    process.env.NEXT_PUBLIC_STUDENTS_API_URL ||
    'https://script.google.com/macros/s/AKfycbye0m6rCaO37FVklFcnHlwHb79TlKN4wCORYVAvSwRRS_BXHburu52UVHuSC7brP5IQ/exec',
  clubName: 'Salesforce Club CMRTC',
  collegeName: 'CMR Technical Campus (CMRTC)',
  contactEmail: 'salesforceclub@cmrtc.ac.in',
};
