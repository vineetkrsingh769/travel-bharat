import React from 'react';
import { STATUS_FILTERS } from '../constants';

export default function StatusFilterBar({ value, onChange }) {
  return (
    <div className="flex bg-[#FAF5EC] dark:bg-white/5 p-1 rounded-xl border border-[#DDD0B8] dark:border-white/10 self-start md:self-auto shadow-inner">
      {STATUS_FILTERS.map(status => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize hover:scale-[1.01] active:scale-[0.98] ${
            value === status
              ? 'bg-saffron text-white dark:text-ink shadow-sm'
              : 'text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream hover:bg-[#EDE5D4]/40 dark:hover:bg-white/5'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
