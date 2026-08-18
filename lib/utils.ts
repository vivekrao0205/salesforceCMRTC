import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Defensively parses numeric strings and numbers.
 * Examples:
 * - "2,400" -> 2400
 * - "50 point's" -> 50
 * - "Not yet" -> 0
 * - "" -> 0
 * - null / undefined -> 0
 */
export function parseNumericValue(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const cleaned = value
      .replace(/,/g, "")
      .replace(/[^\d.-]/g, "")
      .trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function formatNumber(val: number | string | undefined | null): string {
  const num = parseNumericValue(val);
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateString);
  }
}

/**
 * Deterministically generates student initials avatar from name.
 * Examples:
 * - "Gattla Prekshith Reddy" -> "GP"
 * - "Abhiigna" -> "A"
 * - "Gandewar Vaishnavi" -> "GV"
 */
export function getInitialsAvatar(name: string | undefined | null): string {
  if (!name || typeof name !== 'string') return '??';

  const cleanName = name.replace(/[.,\-_]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanName) return '??';

  const parts = cleanName.split(' ').filter((p) => p.length > 0);

  if (parts.length === 0) return '??';

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  const first = parts[0][0];
  const second = parts[1][0];
  return (first + second).toUpperCase();
}

/**
 * Converts dynamic API keys into clean human-readable labels.
 * e.g. "totalTrailheadScore" -> "Total Trailhead Score"
 */
export function formatFieldLabel(key: string): string {
  if (!key) return '';
  
  if (key.includes(' ')) {
    return key
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Detects valid safe HTTP/HTTPS URLs.
 */
export function isSafeUrl(str: unknown): boolean {
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  return (
    (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
    !trimmed.includes('<script>')
  );
}
