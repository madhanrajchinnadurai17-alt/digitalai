import React from 'react';
import { PostStatus } from '@/lib/types';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: PostStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const isSm = size === 'sm';

  switch (status) {
    case 'Posted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-success-light text-success border border-success-border ${
            isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm'
          }`}
        >
          <CheckCircle2 className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Posted</span>
        </span>
      );
    case 'Draft':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-tumbler-light text-tumbler border border-tumbler-border ${
            isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm'
          }`}
        >
          <Clock className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Draft</span>
        </span>
      );
    case 'Failed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-danger-light text-danger border border-danger-border ${
            isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm'
          }`}
        >
          <AlertCircle className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Failed</span>
        </span>
      );
    default:
      return null;
  }
}
