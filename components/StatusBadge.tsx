import React from 'react';
import { PostStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: PostStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const isSm = size === 'sm';
  const textClass = isSm ? 'text-[11px] font-mono' : 'text-xs font-mono';

  switch (status) {
    case 'Posted':
      return (
        <span className={`inline-flex items-center text-success bg-success-light border border-success-border rounded-sm px-1.5 py-0.2 ${textClass}`}>
          [Posted]
        </span>
      );
    case 'Draft':
      return (
        <span className={`inline-flex items-center text-grey bg-grey/5 border border-grey/30 rounded-sm px-1.5 py-0.2 ${textClass}`}>
          [Draft]
        </span>
      );
    case 'Failed':
      return (
        <span className={`inline-flex items-center text-danger bg-danger-light border border-danger-border rounded-sm px-1.5 py-0.2 ${textClass}`}>
          [Failed]
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center text-pending bg-pending-light border border-pending-border rounded-sm px-1.5 py-0.2 ${textClass}`}>
          [{status}]
        </span>
      );
  }
}
