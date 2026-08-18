'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { Student } from '@/types';
import { getStudents, createOrUpdateStudent } from '@/services/students';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminPointsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [pointsToAdd, setPointsToAdd] = useState(10);
  const [reason, setReason] = useState('Workshop Participation');
  const [successMsg, setSuccessMsg] = useState('');

  const loadStudents = async () => {
    const data = await getStudents();
    setStudents(data);
    if (data.length > 0 && !selectedStudentId) {
      setSelectedStudentId(data[0].id);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = students.find((s) => s.id === selectedStudentId);
    if (!target) return;

    const currentClubPoints = target.clubPoints || 0;
    const newClubPoints = currentClubPoints + Number(pointsToAdd);
    await createOrUpdateStudent({
      ...target,
      clubPoints: newClubPoints,
    });

    setSuccessMsg(`Awarded ${pointsToAdd} Club Points to ${target.name}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
    loadStudents();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-outline-variant/20 pb-4">
        <Badge variant="secondary">Point Allocation</Badge>
        <h1 className="font-headline text-headline-sm text-primary mt-1">Club Points Manager</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Award separate Club Points for workshop attendance, project submissions, and volunteer activities.
        </p>
      </div>

      {successMsg && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      <GlassCard className="max-w-xl space-y-4">
        <h3 className="font-headline text-base font-semibold text-primary">Award Club Points</h3>

        <form onSubmit={handleAwardPoints} className="space-y-4">
          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo}) — Current: {s.clubPoints || 0} Club Pts
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Points to Award</label>
            <input
              type="number"
              min="1"
              max="500"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(Number(e.target.value))}
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Reason / Activity</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Trailhead Session Attendance"
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <Button variant="primary" type="submit" className="w-full" icon={<Award className="w-4 h-4 ml-1" />}>
            Award Points
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
