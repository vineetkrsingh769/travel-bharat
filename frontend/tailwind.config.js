/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream:      '#FAF5EC',
        saffron:    '#D08B2A',
        terracotta: '#9B4A28',
        forest:     '#2C4A34',
        ink:        '#1A1511',
        muted: {
          DEFAULT: '#EDE5D4',
          foreground: '#4E3E2F',
        },
        border: '#DDD0B8',
        adm: {
          void: '#090a0f',
          canvas: '#0f1219',
          surface: '#161b26',
          raised: '#1c2332',
          hover: '#232d40',
          border: '#2a3344',
          ink: '#f1f5f9',
          muted: '#94a3b8',
          faint: '#64748b',
          accent: '#f0b429',
          'accent-hover': '#f5c542',
          success: '#34d399',
          warning: '#fb923c',
          danger: '#f87171',
          info: '#60a5fa',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Lora', 'ui-serif', 'Georgia', 'serif'],
        sans:  ['"Plus Jakarta Sans"', 'Nunito Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'admin-sans': ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'admin-display': ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'adm-card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.35)',
        'adm-glow': '0 0 0 1px rgba(240,180,41,0.15), 0 8px 32px rgba(240,180,41,0.08)',
      },
      letterSpacing: {
        widest: '0.22em',
      },
      aspectRatio: {
        '4/3':  '4 / 3',
        '4/5':  '4 / 5',
        '16/10':'16 / 10',
      },
    },
  },
  plugins: [],
};
