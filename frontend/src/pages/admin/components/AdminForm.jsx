import React from 'react';
import { ADMIN_INPUT_CLASS } from '../constants';

export { ADMIN_INPUT_CLASS };

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest font-semibold text-ink/50 dark:text-cream/45 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function FormSection({ title, children }) {
  return (
    <div className="space-y-4 pt-6 border-t border-[#DDD0B8]/50 dark:border-white/10 first:border-t-0 first:pt-0">
      <h3 className="font-serif text-base font-bold text-saffron tracking-wide">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
