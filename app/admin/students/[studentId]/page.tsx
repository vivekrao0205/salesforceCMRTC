'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { Student } from '@/types';
import { getStudentById, createOrUpdateStudent, deleteStudent } from '@/services/students';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminEditStudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [branch, setBranch] = useState<any>('CSE');
  const [year, setYear] = useState<any>('1');
  const [totalTrailheadScore, setTotalTrailheadScore] = useState(0);
  const [totalTrailheadBadges, setTotalTrailheadBadges] = useState(0);
  const [certifications, setCertifications] = useState(0);
  const [clubPoints, setClubPoints] = useState(0);
  const [trailheadProfileLink, setTrailheadProfileLink] = useState('');

  useEffect(() => {
    async function load() {
      const data = await getStudentById(params.studentId);
      if (data) {
        setStudent(data);
        setName(data.name || '');
        setRollNo(data.rollNo || '');
        setBranch(data.branch || 'CSE');
        setYear(data.year || '1');
        setTotalTrailheadScore(data.totalTrailheadScore || 0);
        setTotalTrailheadBadges(data.totalTrailheadBadges || 0);
        setCertifications(typeof data.certifications === 'number' ? data.certifications : (data.certificationsCount || 0));
        setClubPoints(data.clubPoints || 0);
        setTrailheadProfileLink(data.trailheadProfileLink || '');
      }
      setLoading(false);
    }
    load();
  }, [params.studentId]);

  if (loading) return <div className="p-8 text-xs font-sans">Loading student details...</div>;
  if (!student) return <div className="p-8 text-xs font-sans text-error">Student profile not found.</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrUpdateStudent({
      ...student,
      name,
      rollNo,
      branch,
      year,
      totalTrailheadScore: Number(totalTrailheadScore),
      totalTrailheadBadges: Number(totalTrailheadBadges),
      certifications: Number(certifications),
      clubPoints: Number(clubPoints),
      trailheadProfileLink,
    });
    setSavedMessage('Student profile updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this profile?')) {
      await deleteStudent(student.id);
      router.push('/admin/students');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/students">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4 mr-1" />}>
              Back
            </Button>
          </Link>
          <h1 className="font-headline text-headline-sm text-primary">Edit Profile: {student.name}</h1>
        </div>
        <Button variant="danger" size="sm" onClick={handleDelete} icon={<Trash2 className="w-4 h-4 ml-1" />}>
          Delete Profile
        </Button>
      </div>

      {savedMessage && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg text-xs font-sans flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          {savedMessage}
        </div>
      )}

      <GlassCard>
        <form onSubmit={handleSave} className="space-y-4 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Academic Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-xl">
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Trailhead Score</label>
              <input
                type="number"
                min="0"
                value={totalTrailheadScore}
                onChange={(e) => setTotalTrailheadScore(Number(e.target.value))}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Badges</label>
              <input
                type="number"
                min="0"
                value={totalTrailheadBadges}
                onChange={(e) => setTotalTrailheadBadges(Number(e.target.value))}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Certifications</label>
              <input
                type="number"
                min="0"
                value={certifications}
                onChange={(e) => setCertifications(Number(e.target.value))}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Club Points</label>
              <input
                type="number"
                min="0"
                value={clubPoints}
                onChange={(e) => setClubPoints(Number(e.target.value))}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Trailhead Profile Link</label>
            <input
              type="text"
              value={trailheadProfileLink}
              onChange={(e) => setTrailheadProfileLink(e.target.value)}
              placeholder="https://www.salesforce.com/trailblazer/..."
              className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="primary" type="submit" icon={<Save className="w-4 h-4 ml-1" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
