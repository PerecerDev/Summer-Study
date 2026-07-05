/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#4F7BF7',
          foreground: '#FFFFFF',
        },
        success: '#4CAF7A',
        correction: '#F5A623',
        'text-primary': '#1A1A2E',
        'text-muted': '#6B7280',
        'reward-gold': '#F5C842',
        subject: {
          math: '#4F7BF7',
          language: '#E85D5D',
          english: '#8B5CF6',
          valencian: '#F97316',
          medi: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      minHeight: {
        touch: '48px',
        'touch-lg': '56px',
      },
      maxWidth: {
        content: '720px',
      },
    },
  },
  plugins: [],
};
