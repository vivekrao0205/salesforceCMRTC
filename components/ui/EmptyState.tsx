import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description = "A new journey begins. There is a lot more to come.",
  actionText,
  onAction,
  actionHref,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-card p-12 text-center border border-outline-variant/20 shadow-ambient flex flex-col items-center justify-center max-w-xl mx-auto my-8">
      <div className="w-20 h-20 bg-primary-fixed/40 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="font-headline text-headline-sm font-semibold text-primary mb-3">
        {title}
      </h3>
      <p className="font-sans text-body-md text-on-surface-variant max-w-md mx-auto mb-6">
        {description}
      </p>
      {actionText && (
        <div>
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="secondary">{actionText}</Button>
            </a>
          ) : (
            <Button variant="secondary" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
