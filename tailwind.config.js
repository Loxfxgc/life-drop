/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blood: {
          50: '#fee2e2',
          100: '#fecaca',
          200: '#fca5a5',
          300: '#f87171',
          400: '#ef4444',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        donor: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#065f46',
        },
        recipient: {
          light: '#eff6ff',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(220, 38, 38, 0.1), 0 2px 4px -1px rgba(220, 38, 38, 0.06)',
        'custom-lg': '0 10px 15px -3px rgba(220, 38, 38, 0.1), 0 4px 6px -2px rgba(220, 38, 38, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      animation: {
        'beat': 'beat 1.5s ease-in-out infinite',
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        beat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.1)' },
        },
        'pulse-red': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      gridTemplateRows: {
        'calendar': 'auto repeat(6, minmax(5rem, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  darkMode: 'class',
} 