import React from 'react';
import { ADMIN_CARD } from '../constants';

export default function AdminPreviewPane({ path, title = 'Live preview' }) {
  if (!path) return null;

  return (
    <div className={`${ADMIN_CARD} overflow-hidden`}>
      <div className="px-4 py-3 border-b border-adm-border flex items-center justify-between gap-2 bg-adm-raised/50">
        <span className="text-xs font-semibold uppercase tracking-wider text-adm-faint">{title}</span>
        <a href={path} target="_blank" rel="noreferrer" className="text-xs font-semibold text-adm-accent hover:text-adm-accent-hover transition-colors">
          Open tab ↗
        </a>
      </div>
      <iframe
        title={title}
        src={path}
        className="w-full h-[min(520px,70vh)] bg-adm-canvas"
      />
    </div>
  );
}
