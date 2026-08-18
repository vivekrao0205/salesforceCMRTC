import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  icon,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-label text-label font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary";

  const variants = {
    primary: "bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm hover:shadow-md",
    secondary: "bg-primary text-on-primary hover:bg-primary/90 shadow-sm",
    outline: "border border-outline-variant text-primary hover:bg-surface-container-low hover:border-secondary",
    ghost: "text-on-surface-variant hover:text-primary hover:bg-surface-container-low",
    danger: "bg-error text-on-error hover:bg-error/90 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-2.5 rounded-xl",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
};
