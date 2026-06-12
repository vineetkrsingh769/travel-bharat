/** Slugs used for home spotlight ordering (featured DESC, then sort_order ASC). */
const FEATURED_PLACE_SLUGS = [
  'taj-mahal',
  'golden-temple-amritsar',
  'red-fort-delhi',
  'gateway-of-india',
  'hawa-mahal',
  'charminar',
];

function getPlaceRanking(slug, index) {
  const featuredIndex = FEATURED_PLACE_SLUGS.indexOf(slug);
  return {
    featured: featuredIndex >= 0,
    sort_order: featuredIndex >= 0 ? featuredIndex + 1 : 100 + index,
  };
}

module.exports = { FEATURED_PLACE_SLUGS, getPlaceRanking };
