/* ── Admin design tokens (Tailwind class strings) ── */

export const ADMIN_CARD =
  'bg-adm-surface border border-adm-border rounded-2xl shadow-adm-card';

export const ADMIN_CARD_INTERACTIVE =
  'bg-adm-surface border border-adm-border rounded-2xl shadow-adm-card transition-all duration-200 hover:border-adm-accent/30 hover:shadow-adm-glow hover:-translate-y-0.5 active:translate-y-0';

export const ADMIN_INPUT_CLASS =
  'w-full bg-adm-raised border border-adm-border text-adm-ink placeholder-adm-faint px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 hover:border-adm-muted/60 transition-all duration-150';

export const ADMIN_SEARCH_INPUT_CLASS =
  'w-full bg-adm-raised border border-adm-border text-adm-ink placeholder-adm-faint pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/15 hover:border-adm-muted/60 transition-all duration-200';

export const ADMIN_BTN_PRIMARY =
  'bg-adm-accent hover:bg-adm-accent-hover text-adm-void font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-adm-accent/20 hover:shadow-adm-accent/30 transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-50';

export const ADMIN_BTN_GHOST =
  'bg-adm-raised hover:bg-adm-hover border border-adm-border text-adm-muted hover:text-adm-ink px-5 py-2.5 rounded-xl text-sm font-medium transition-all';

export const ADMIN_TABLE_WRAP =
  'bg-adm-surface border border-adm-border rounded-2xl overflow-hidden shadow-adm-card';

export const ADMIN_TABLE_HEAD =
  'border-b border-adm-border bg-adm-raised/80 text-adm-faint text-[0.65rem] uppercase tracking-[0.14em] font-semibold';

export const ADMIN_PAGE_TITLE = 'text-2xl sm:text-3xl font-semibold text-adm-ink tracking-normal';
export const ADMIN_PAGE_SUB = 'mt-1 text-sm text-adm-muted';
export const ADMIN_SECTION_TITLE = 'text-base font-semibold text-adm-ink tracking-normal';

export const STATUS_BADGE = {
  draft: 'bg-adm-raised text-adm-muted border border-adm-border',
  pending: 'bg-adm-warning/10 text-adm-warning border border-adm-warning/25',
  published: 'bg-adm-success/10 text-adm-success border border-adm-success/25',
};

export const CATEGORY_BADGE = {
  Heritage:  'bg-amber-500/15 text-amber-300 border border-amber-500/20',
  Nature:    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
  Religious: 'bg-violet-500/15 text-violet-300 border border-violet-500/20',
  Adventure: 'bg-sky-500/15 text-sky-300 border border-sky-500/20',
  Beach:     'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20',
};

export const REGION_BADGE = {
  North: 'bg-sky-500/15 text-sky-300 border border-sky-500/20',
  South: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
  East: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
  West: 'bg-orange-500/15 text-orange-300 border border-orange-500/20',
  Central: 'bg-violet-500/15 text-violet-300 border border-violet-500/20',
  Northeast: 'bg-rose-500/15 text-rose-300 border border-rose-500/20',
};

export const CATEGORY_BAR_COLORS = {
  Heritage:  { bar: 'bg-gradient-to-r from-amber-400 to-adm-accent' },
  Nature:    { bar: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
  Religious: { bar: 'bg-gradient-to-r from-violet-400 to-purple-500' },
  Adventure: { bar: 'bg-gradient-to-r from-sky-400 to-blue-500' },
  Beach:     { bar: 'bg-gradient-to-r from-cyan-400 to-teal-400' },
};

export const STATUS_FILTERS = ['all', 'draft', 'pending', 'published'];
