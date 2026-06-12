export const PLACE_CATEGORIES = ['Heritage', 'Nature', 'Religious', 'Adventure', 'Beach'];

export const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Northeast'];

/** Tailwind border-l-* classes for state/region cards */
export const REGION_ACCENT = {
  North: 'border-l-saffron',
  South: 'border-l-forest',
  East: 'border-l-terracotta',
  West: 'border-l-amber-600',
  Central: 'border-l-ink',
  Northeast: 'border-l-emerald-700',
};

export function pickFeaturedStates(states, limit = 6) {
  const byRegion = {};
  const picked = [];
  for (const state of states) {
    if (!byRegion[state.region]) {
      byRegion[state.region] = state;
      picked.push(state);
      if (picked.length >= limit) break;
    }
  }
  return picked;
}
