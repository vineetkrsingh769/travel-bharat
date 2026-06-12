export const STATUS_BADGE = {
  draft: 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30',
  pending: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  published: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
};

export const CATEGORY_BADGE = {
  Heritage:  'bg-amber-500/20  text-amber-300',
  Nature:    'bg-green-500/20   text-green-300',
  Religious: 'bg-purple-500/20  text-purple-300',
  Adventure: 'bg-blue-500/20    text-blue-300',
  Beach:     'bg-cyan-500/20    text-cyan-300',
};

export const REGION_BADGE = {
  North: 'bg-blue-500/20 text-blue-300',
  South: 'bg-green-500/20 text-green-300',
  East: 'bg-amber-500/20 text-amber-300',
  West: 'bg-orange-500/20 text-orange-300',
  Central: 'bg-purple-500/20 text-purple-300',
  Northeast: 'bg-pink-500/20 text-pink-300',
};

export const CATEGORY_BAR_COLORS = {
  Heritage:  { bar: 'bg-gradient-to-r from-amber-500 to-saffron' },
  Nature:    { bar: 'bg-gradient-to-r from-green-400 to-forest' },
  Religious: { bar: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
  Adventure: { bar: 'bg-gradient-to-r from-blue-400 to-blue-600' },
  Beach:     { bar: 'bg-gradient-to-r from-cyan-400 to-teal-500' },
};

export const STATUS_FILTERS = ['all', 'draft', 'pending', 'published'];

export const ADMIN_INPUT_CLASS =
  'w-full bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 text-ink dark:text-cream placeholder-ink/20 dark:placeholder-cream/20 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/15 shadow-sm dark:shadow-none hover:border-[#C4B79F] dark:hover:border-white/20 transition-all duration-150';

export const ADMIN_SEARCH_INPUT_CLASS =
  'w-full bg-white dark:bg-white/5 border border-[#DDD0B8] dark:border-white/10 text-ink dark:text-cream placeholder-ink/30 dark:placeholder-cream/30 pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/20 shadow-sm dark:shadow-none hover:border-[#C4B79F] dark:hover:border-white/20 transition-all duration-200';
