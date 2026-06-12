import React from 'react';
import { STATUS_FILTERS } from '../constants';

export default function StatusFilterBar({ value, onChange, counts = {} }) {
  return (
    <div className="flex bg-adm-raised p-1 rounded-xl border border-adm-border self-start md:self-auto">
      {STATUS_FILTERS.map(status => {
        const count = status === 'all'
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[status] || 0;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
              value === status
                ? 'bg-adm-accent text-adm-void shadow-sm'
                : 'text-adm-muted hover:text-adm-ink hover:bg-adm-hover'
            }`}
          >
            {status}{count ? ` (${count})` : ''}
          </button>
        );
      })}
    </div>
  );
}
