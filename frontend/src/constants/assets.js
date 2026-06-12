/** Static assets available in frontend/public/assets (for admin picker). */
export const HERO_IMAGE = '/assets/hero-india.jpg';
export const LOGO_IMAGE = '/assets/logo.png';

export const STATE_COVER_ASSETS = [
  '/assets/states/uttar-pradesh.png',
  '/assets/states/rajasthan.png',
  '/assets/states/kerala.png',
  '/assets/states/ladakh.png',
  '/assets/states/tamil-nadu.png',
  '/assets/states/maharashtra.png',
  '/assets/states/himachal-pradesh.png',
  '/assets/states/goa.png',
  '/assets/states/sikkim.png',
  '/assets/states/delhi.png',
];

export const PLACE_IMAGE_ASSETS = [HERO_IMAGE, ...STATE_COVER_ASSETS];

export const STATE_COVER_ASSETS_WITH_LABELS = STATE_COVER_ASSETS.map(url => ({
  url,
  label: url.split('/').pop().replace('.png', '').replace(/-/g, ' '),
}));
