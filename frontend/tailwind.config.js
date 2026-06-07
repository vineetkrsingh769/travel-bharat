/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
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
        primary: {
          DEFAULT: '#9B4A28',
          foreground: '#FAF5EC',
        },
        secondary: {
          DEFAULT: '#2C4A34',
          foreground: '#FAF5EC',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Lora', 'ui-serif', 'Georgia', 'serif'],
        sans:  ['"Plus Jakarta Sans"', 'Nunito Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
