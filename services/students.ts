import { Student } from '@/types';
import { parseNumericValue } from '@/lib/utils';
import { extractTrailblazerProfileId } from '@/lib/trailheadHelper';

const API_URL =
  process.env.NEXT_PUBLIC_STUDENTS_API_URL ||
  'https://script.google.com/macros/s/AKfycbye0m6rCaO37FVklFcnHlwHb79TlKN4wCORYVAvSwRRS_BXHburu52UVHuSC7brP5IQ/exec';

let cachedStudents: Student[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 30000; // 30 seconds cache

/**
 * Defensive Normalizer for individual student records.
 * Automatically assigns a unique CMRTC internal ID (e.g. CMRTC-2026-0001).
 */
export function normalizeStudent(item: any, idx: number): Student {
  if (!item || typeof item !== 'object') {
    const seqStr = String(idx + 1).padStart(4, '0');
    return {
      id: `CMRTC-2026-${seqStr}`,
      name: 'Unknown Student',
      rollNo: 'N/A',
      branch: 'CSE',
      year: '1',
      totalTrailheadScore: 0,
      totalTrailheadBadges: 0,
    };
  }

  const raw = item._raw || item;

  // Extract raw values safely
  const rawRoll = String(item.rollNo || raw['Roll No'] || raw['rollNo'] || '').trim().toUpperCase();
  const rawName = String(item.name || raw['Name'] || raw['name'] || '').trim();
  const rawBranch = String(item.branch || raw['Branch'] || raw['Department'] || raw['branch'] || 'CSE').trim();
  const rawYear = String(item.year || raw['Year'] || raw['year'] || '1').trim();
  const rawSection = String(item.section || raw['Section'] || raw['section'] || '').trim();
  const rawProfileLink = String(item.trailheadProfileLink || raw['Trailhead Profile Link'] || raw['trailheadProfileLink'] || '').trim();
  const trailblazerId = extractTrailblazerProfileId(rawProfileLink) || undefined;

  // Automatic CMRTC Internal ID Format: CMRTC-2026-XXXX (derived deterministically by index/sequence)
  const seqStr = String(idx + 1).padStart(4, '0');
  const cmrtcInternalId = `CMRTC-2026-${seqStr}`;

  // Defensively parse numeric values (Sheet fallback snapshot numbers)
  const scoreRaw = item.totalTrailheadScore ?? raw['Total Trailhead Score'] ?? raw['totalTrailheadScore'] ?? 0;
  const score = parseNumericValue(scoreRaw);

  const badgesRaw = item.totalTrailheadBadges ?? raw['Total Trailhead Badges'] ?? raw['totalTrailheadBadges'] ?? 0;
  const badges = parseNumericValue(badgesRaw);

  const phoneNo = item.phoneNo || raw['Phone No'] || raw['Phone'] || undefined;
  const eMailCollegeMail = item.eMailCollegeMail || raw['E Mail (College Mail)'] || raw['College Email'] || undefined;

  return {
    ...item,
    id: cmrtcInternalId,
    cmrtcId: cmrtcInternalId,
    name: rawName || 'Student',
    rollNo: rawRoll || 'N/A',
    branch: rawBranch || 'CSE',
    year: rawYear || '1',
    section: rawSection,
    trailheadProfileLink: rawProfileLink,
    trailblazerProfileId: trailblazerId,
    totalTrailheadScore: score,
    totalTrailheadBadges: badges,
    phoneNo,
    eMailCollegeMail,
    _raw: raw,
  };
}

export async function fetchRawStudentsFromApi(): Promise<Student[]> {
  const now = Date.now();
  if (cachedStudents && now - lastFetchTime < CACHE_TTL) {
    return cachedStudents;
  }

  if (!API_URL) {
    console.error('Student API URL (NEXT_PUBLIC_STUDENTS_API_URL) is not configured.');
    return cachedStudents || [];
  }

  // 15-second timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      next: { revalidate: 30 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`API HTTP Warning: ${res.status}`);
      return cachedStudents || [];
    }

    const data = await res.json();
    let rawList: any[] = [];

    if (Array.isArray(data)) {
      rawList = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.students)) {
        rawList = data.students;
      } else if (Array.isArray(data.data)) {
        rawList = data.data;
      }
    }

    const normalized: Student[] = rawList.map((item, idx) => normalizeStudent(item, idx));

    cachedStudents = normalized;
    lastFetchTime = now;
    return normalized;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn('Failed to fetch students from API (using cache/empty fallback):', err.message || err);
    return cachedStudents || [];
  }
}

/**
 * Public Student Fetcher (Strips Private Phone / Email)
 */
export async function getStudents(forceRefresh = false): Promise<Student[]> {
  if (forceRefresh) cachedStudents = null;
  const rawList = await fetchRawStudentsFromApi();

  return rawList.map((s) => ({
    ...s,
    phoneNo: undefined,
    eMailCollegeMail: undefined,
  }));
}

/**
 * Admin Student Fetcher (Preserves Private Phone / Email for Authorized Coordinators)
 */
export async function getAdminStudents(forceRefresh = false): Promise<Student[]> {
  if (forceRefresh) cachedStudents = null;
  return await fetchRawStudentsFromApi();
}

export async function getStudentById(id: string, includePrivate = false): Promise<Student | null> {
  const students = includePrivate ? await getAdminStudents() : await getStudents();
  const targetId = String(id).trim().toLowerCase();

  const found = students.find(
    (s) =>
      s.id.toLowerCase() === targetId ||
      s.rollNo.toLowerCase() === targetId ||
      s.name.toLowerCase().replace(/\s+/g, '') === targetId
  );

  return found || null;
}

export async function searchStudents(
  query = '',
  branch = 'ALL',
  year = 'ALL',
  sortMetric: 'score' | 'badges' | 'name' = 'score'
): Promise<Student[]> {
  let list = await getStudents();

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.branch.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }

  if (branch && branch !== 'ALL') {
    list = list.filter((s) => s.branch.toLowerCase() === branch.toLowerCase());
  }

  if (year && year !== 'ALL') {
    list = list.filter((s) => String(s.year) === String(year));
  }

  // Sort list
  list = [...list].sort((a, b) => {
    if (sortMetric === 'badges') {
      return b.totalTrailheadBadges - a.totalTrailheadBadges;
    }
    if (sortMetric === 'name') {
      return a.name.localeCompare(b.name);
    }
    return b.totalTrailheadScore - a.totalTrailheadScore;
  });

  return list;
}

export async function getUniqueBranches(): Promise<string[]> {
  const students = await getStudents();
  const set = new Set<string>();
  students.forEach((s) => {
    if (s.branch) set.add(s.branch);
  });
  return Array.from(set).sort();
}

export async function getUniqueYears(): Promise<string[]> {
  const students = await getStudents();
  const set = new Set<string>();
  students.forEach((s) => {
    if (s.year) set.add(String(s.year));
  });
  return Array.from(set).sort();
}

export async function createOrUpdateStudent(student: Partial<Student> & { name: string; rollNo?: string }): Promise<Student> {
  const students = await fetchRawStudentsFromApi();
  const existing = students.find(
    (s) => s.id === student.id || (student.rollNo && s.rollNo.toLowerCase() === student.rollNo.toLowerCase())
  );
  if (existing) {
    Object.assign(existing, student);
    return existing;
  }
  const nextSeq = String(students.length + 1).padStart(4, '0');
  const newStudent: Student = {
    ...student,
    id: student.id || `CMRTC-2026-${nextSeq}`,
    cmrtcId: `CMRTC-2026-${nextSeq}`,
    name: student.name,
    rollNo: student.rollNo || 'N/A',
    branch: student.branch || 'CSE',
    year: student.year || '1',
    totalTrailheadScore: parseNumericValue(student.totalTrailheadScore),
    totalTrailheadBadges: parseNumericValue(student.totalTrailheadBadges),
  };
  students.push(newStudent);
  return newStudent;
}

export async function deleteStudent(id: string): Promise<boolean> {
  const students = await fetchRawStudentsFromApi();
  const idx = students.findIndex((s) => s.id === id);
  if (idx !== -1) {
    students.splice(idx, 1);
    return true;
  }
  return false;
}
