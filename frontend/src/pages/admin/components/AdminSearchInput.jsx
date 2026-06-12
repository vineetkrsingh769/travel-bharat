import React from 'react';
import { ADMIN_SEARCH_INPUT_CLASS } from '../constants';

export default function AdminSearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full max-w-sm shrink-0">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-ink/40 dark:text-cream/40">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={ADMIN_SEARCH_INPUT_CLASS}
      />
    </div>
  );
}
