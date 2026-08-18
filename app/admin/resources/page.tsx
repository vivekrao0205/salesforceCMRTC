'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, ExternalLink } from 'lucide-react';
import { Resource, ResourceCategory } from '@/types';
import { getResources, createResource, deleteResource } from '@/services/resources';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Salesforce Basics');
  const [url, setUrl] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [type, setType] = useState<'Article' | 'Documentation' | 'Video' | 'Trailhead Module' | 'Project Spec'>('Trailhead Module');

  const loadResources = async () => {
    const data = await getResources();
    setResources(data);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    await createResource({
      title,
      description,
      category,
      url,
      level,
      type,
      tags: [category.toLowerCase(), level.toLowerCase()],
    });

    setTitle('');
    setDescription('');
    setUrl('');
    setIsModalOpen(false);
    loadResources();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete resource?')) {
      await deleteResource(id);
      loadResources();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <Badge variant="secondary">Resources</Badge>
          <h1 className="font-headline text-headline-sm text-primary mt-1">Resources Manager</h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4 ml-1" />}>
          Add Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((res) => (
          <GlassCard key={res.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="primary">{res.category}</Badge>
              <Badge variant="outline">{res.level}</Badge>
            </div>

            <h3 className="font-headline text-sm font-semibold text-primary">{res.title}</h3>
            <p className="text-xs text-on-surface-variant line-clamp-2">{res.description}</p>

            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
              <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary font-semibold hover:underline flex items-center gap-1">
                Link <ExternalLink className="w-3 h-3" />
              </a>
              <Button variant="danger" size="sm" onClick={() => handleDelete(res.id)}>
                Delete
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Learning Resource">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apex Fundamentals Guide"
              className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-label uppercase text-outline font-semibold">Resource URL *</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://trailhead.salesforce.com/..."
              className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              >
                <option value="Salesforce Basics">Salesforce Basics</option>
                <option value="Trailhead">Trailhead</option>
                <option value="Admin">Admin</option>
                <option value="Development">Development</option>
                <option value="AI">AI</option>
                <option value="Data">Data</option>
                <option value="Automation">Automation</option>
                <option value="Career">Career</option>
                <option value="Projects">Projects</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-label uppercase text-outline font-semibold">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full p-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
