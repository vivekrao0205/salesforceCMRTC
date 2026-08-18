import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className,
}) => {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-label font-semibold tracking-wider uppercase";

  const variants = {
    primary: "bg-primary-fixed text-on-primary-fixed border border-primary/10",
    secondary: "bg-secondary-fixed text-on-secondary-fixed-variant border border-secondary/10",
    outline: "bg-surface-container-high text-on-surface-variant border border-outline-variant/30",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    info: "bg-sky-100 text-sky-800 border border-sky-200",
  };

  return <span className={cn(base, variants[variant], className)}>{children}</span>;
};
