import React from 'react';
import { STATUS_BADGE } from '../constants';

export default function StatusBadge({ status }) {
  const key = status || 'draft';
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider border ${STATUS_BADGE[key] || STATUS_BADGE.draft}`}>
      {key.toUpperCase()}
    </span>
  );
}
