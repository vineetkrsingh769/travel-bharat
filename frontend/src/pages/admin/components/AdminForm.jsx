import React from 'react';
import { ADMIN_INPUT_CLASS } from '../constants';

export { ADMIN_INPUT_CLASS };

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider font-semibold text-adm-faint mb-2">{label}</label>
      {children}
    </div>
  );
}

export function FormSection({ title, children }) {
  return (
    <div className="space-y-4 pt-6 border-t border-adm-border first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-adm-accent">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
