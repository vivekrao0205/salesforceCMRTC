import React from 'react';
import { cn } from '@/lib/utils';

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn("animate-pulse bg-surface-container-high rounded-lg", className)}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-card p-6 border border-outline-variant/20 space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonLoader className="w-14 h-14 rounded-full" />
        <div className="space-y-2 flex-grow">
          <SkeletonLoader className="h-5 w-3/4" />
          <SkeletonLoader className="h-4 w-1/2" />
        </div>
      </div>
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-5/6" />
      <div className="flex justify-between items-center pt-2">
        <SkeletonLoader className="h-8 w-24 rounded-full" />
        <SkeletonLoader className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
};
