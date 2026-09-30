import React from 'react';
import { PostStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: PostStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const isSm = size === 'sm';
  const textClass = isSm ? 'text-[10px] font-mono' : 'text-xs font-mono';

  switch (status) {
    case 'Posted':
      return (
        <span className={`inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-0.5 shadow-sm ${textClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>[Posted Live]</span>
        </span>
      );
    case 'Draft':
      return (
        <span className={`inline-flex items-center gap-1.5 text-slate-400 bg-slate-800/60 border border-slate-700/60 rounded-full px-2.5 py-0.5 ${textClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span>[Draft]</span>
        </span>
      );
    case 'Failed':
      return (
        <span className={`inline-flex items-center gap-1.5 text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-2.5 py-0.5 ${textClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span>[Failed]</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full px-2.5 py-0.5 ${textClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>[{status}]</span>
        </span>
      );
  }
}
