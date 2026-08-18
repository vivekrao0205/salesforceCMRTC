import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest/90 backdrop-blur-md rounded-card p-6 border border-outline-variant/20 shadow-ambient transition-all duration-300",
        hoverEffect && "hover:shadow-ambient-hover hover:-translate-y-1 hover:border-secondary-container/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
