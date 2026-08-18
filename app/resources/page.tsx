'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Sparkles, Tag, Layers } from 'lucide-react';
import { Resource, ResourceCategory } from '@/types';
import { getResources } from '@/services/resources';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  const categories: (ResourceCategory | 'ALL')[] = [
    'ALL',
    'Salesforce Basics',
    'Trailhead',
    'Admin',
    'Development',
    'AI',
    'Data',
    'Automation',
    'Career',
    'Projects',
  ];

  useEffect(() => {
    async function loadResources() {
      setLoading(true);
      try {
        const data = await getResources(selectedCategory);
        setResources(data);
      } catch (err) {
        console.error('Error loading resources:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, [selectedCategory]);

  return (
    <div className="py-stack-lg max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-stack-md">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="secondary">Knowledge Hub</Badge>
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-primary">
          Salesforce Club CMRTC Resources
        </h1>
        <p className="font-sans text-body-lg text-on-surface-variant max-w-2xl">
          Curated learning modules, official documentation, Trailhead guides, and development paths for CMRTC students.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-outline-variant/20 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg font-label text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border border-outline-variant/20'
            }`}
          >
            {cat === 'ALL' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Resource Grid / Empty State */}
      {resources.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Resources Coming Soon"
          description="Learning resources for this category are being prepared. Check back shortly!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <GlassCard key={res.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">{res.category}</Badge>
                  <Badge variant="outline">{res.level}</Badge>
                </div>

                <h3 className="font-headline text-headline-sm text-primary">{res.title}</h3>
                <p className="font-sans text-body-md text-on-surface-variant line-clamp-3">
                  {res.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.tags?.map((tag) => (
                    <span key={tag} className="text-[10px] font-sans bg-surface-container-high px-2 py-0.5 rounded text-outline">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-xs text-outline font-sans">{res.type}</span>
                <a href={res.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5 ml-1" />}>
                    Open Resource
                  </Button>
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
