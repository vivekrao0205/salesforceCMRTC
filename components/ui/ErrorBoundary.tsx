'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="py-stack-md max-w-xl mx-auto px-4">
          <GlassCard className="p-8 text-center space-y-4 border-amber-200 bg-amber-50/50">
            <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
            <h2 className="font-headline text-lg font-bold text-primary">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h2>
            <p className="font-sans text-xs text-on-surface-variant max-w-md mx-auto">
              An unhandled error occurred while rendering this section. Please try again.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                icon={<RefreshCw className="w-3.5 h-3.5 mr-1" />}
              >
                Try Again
              </Button>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
