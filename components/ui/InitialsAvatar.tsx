import React from 'react';
import { cn, getInitialsAvatar } from '@/lib/utils';

interface InitialsAvatarProps {
  name: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  id = '',
  size = 'md',
  className,
}) => {
  const initials = getInitialsAvatar(name);

  // Deterministic color palette derived from student name/id string
  const colors = [
    'bg-primary text-on-primary',
    'bg-secondary text-on-secondary',
    'bg-primary-container text-on-primary',
    'bg-secondary-container text-on-secondary-container',
    'bg-surface-tint text-white',
    'bg-surface-variant text-primary',
  ];

  const seedStr = (id || name || 'default').toLowerCase();
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = colors[Math.abs(hash) % colors.length];

  const sizes = {
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-12 h-12 text-base font-bold',
    lg: 'w-16 h-16 text-xl font-bold',
    xl: 'w-28 h-28 md:w-36 md:h-36 text-3xl font-bold',
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-headline shadow-sm border-2 border-surface-container-lowest shrink-0 select-none tracking-wider',
        colorClass,
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
};
