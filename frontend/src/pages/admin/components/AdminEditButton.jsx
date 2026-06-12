import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminEditButton({ to, label = 'Edit' }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-adm-border bg-adm-raised text-adm-muted hover:text-adm-accent hover:border-adm-accent/30 hover:bg-adm-hover transition-colors"
      aria-label={label}
      title={label}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </Link>
  );
}
