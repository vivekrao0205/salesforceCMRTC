'use client';

import { useState, useEffect } from 'react';
import { TrailblazerRecord } from '@/services/trailblazer/cache';
import { Student } from '@/types';

type Listener = () => void;

class TrailblazerStore {
  private records: Map<string, TrailblazerRecord> = new Map();
  private syncingIds: Set<string> = new Set();
  private inFlightFetches: Map<string, Promise<TrailblazerRecord | null>> = new Map();
  private listeners: Set<Listener> = new Set();

  public getRecord(studentId: string): TrailblazerRecord | undefined {
    return this.records.get(studentId);
  }

  public getAllRecords(): Record<string, TrailblazerRecord> {
    const result: Record<string, TrailblazerRecord> = {};
    this.records.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  public isSyncing(studentId: string): boolean {
    return this.syncingIds.has(studentId);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public setRecord(studentId: string, record: TrailblazerRecord) {
    this.records.set(studentId, record);
    this.syncingIds.delete(studentId);
    this.notify();
  }

  public setRecordsBatch(recordsMap: Record<string, TrailblazerRecord>) {
    Object.entries(recordsMap).forEach(([id, record]) => {
      this.records.set(id, record);
      this.syncingIds.delete(id);
    });
    this.notify();
  }

  public async syncAllBatch(
    students: Student[],
    forceRefresh = false
  ): Promise<Record<string, TrailblazerRecord>> {
    try {
      const res = await fetch('/api/trailhead/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRefresh }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.records) {
          this.setRecordsBatch(json.records);
          return json.records;
        }
      }
    } catch (err) {
      console.warn('Batch sync via API failed:', err);
    }
    return this.getAllRecords();
  }

  public async fetchSingle(
    studentId: string,
    profileUrl?: string,
    forceRefresh = false
  ): Promise<TrailblazerRecord | null> {
    const existing = this.records.get(studentId);

    // Skip if cached and fresh (unless forceRefresh)
    if (!forceRefresh && existing) {
      if (existing.syncStatus === 'VERIFIED') {
        return existing;
      }
      if (existing.fetchedAt && Date.now() - existing.fetchedAt < 45000) {
        return existing;
      }
    }

    if (!forceRefresh && this.inFlightFetches.has(studentId)) {
      return this.inFlightFetches.get(studentId)!;
    }

    this.syncingIds.add(studentId);
    this.notify();

    const fetchPromise = (async () => {
      try {
        const res = await fetch('/api/trailhead/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            profileUrl,
            forceRefresh,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (json.success && json.trailhead) {
          const rec: TrailblazerRecord = json.trailhead;
          this.records.set(studentId, rec);
          return rec;
        }
        return null;
      } catch (err) {
        console.warn(`Failed client sync for student ${studentId}:`, err);
        return null;
      } finally {
        this.syncingIds.delete(studentId);
        this.inFlightFetches.delete(studentId);
        this.notify();
      }
    })();

    this.inFlightFetches.set(studentId, fetchPromise);
    return fetchPromise;
  }

  /**
   * Controlled Batch Synchronization (Max 5 concurrent requests) with progressive hydration.
   */
  public async fetchBatch(
    students: Student[],
    forceRefresh = false,
    onProgress?: (synced: number, total: number) => void
  ): Promise<void> {
    const total = students.length;
    let completedCount = 0;
    const BATCH_SIZE = 5;

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = students.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (student) => {
          await this.fetchSingle(student.id, student.trailheadProfileLink, forceRefresh);
          completedCount++;
          if (onProgress) {
            onProgress(completedCount, total);
          }
        })
      );
    }
  }
}

export const trailblazerStore = new TrailblazerStore();

export function useTrailblazerStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return trailblazerStore.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return {
    records: trailblazerStore.getAllRecords(),
    getRecord: (id: string) => trailblazerStore.getRecord(id),
    isSyncing: (id: string) => trailblazerStore.isSyncing(id),
    fetchSingle: (id: string, profileUrl?: string, forceRefresh?: boolean) =>
      trailblazerStore.fetchSingle(id, profileUrl, forceRefresh),
    fetchBatch: (students: Student[], forceRefresh?: boolean, onProgress?: (s: number, t: number) => void) =>
      trailblazerStore.fetchBatch(students, forceRefresh, onProgress),
    syncAllBatch: (students: Student[], forceRefresh?: boolean) =>
      trailblazerStore.syncAllBatch(students, forceRefresh),
    setRecordsBatch: (records: Record<string, TrailblazerRecord>) =>
      trailblazerStore.setRecordsBatch(records),
  };
}

