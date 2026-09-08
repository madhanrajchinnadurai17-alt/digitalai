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
        <span className={`inline-flex items-center text-ink ${textClass}`}>
          [Posted]
        </span>
      );
    case 'Draft':
      return (
        <span className={`inline-flex items-center text-grey ${textClass}`}>
          [Draft]
        </span>
      );
    case 'Failed':
      return (
        <span className={`inline-flex items-center text-ink font-semibold underline decoration-grey ${textClass}`}>
          [Failed]
        </span>
      );
    default:
      return null;
  }
}
