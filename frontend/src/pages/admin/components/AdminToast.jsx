import React from 'react';

export default function AdminToast({ message, href }) {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-adm-raised text-adm-ink text-sm px-4 py-3 rounded-xl shadow-adm-glow border border-adm-success/30 flex items-center gap-3 max-w-sm">
      <span className="w-2 h-2 rounded-full bg-adm-success shrink-0" />
      <span>{message}</span>
      {href && (
        <a href={href} target="_blank" rel="noreferrer" className="text-xs font-semibold text-adm-accent hover:text-adm-accent-hover shrink-0">
          Open ↗
        </a>
      )}
    </div>
  );
}
