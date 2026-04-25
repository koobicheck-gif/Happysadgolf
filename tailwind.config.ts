import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        masters: {
          green: '#006747',
          'green-dark': '#004d35',
          'green-light': '#e8f5ef',
          gold: '#C9A84C',
          'gold-light': '#f5e9cc',
          cream: '#F5F0E8',
          dark: '#1A2E1A',
        },
        happy: {
          DEFAULT: '#16a34a',
          light: '#dcfce7',
          dark: '#14532d',
        },
        sad: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
          dark: '#7f1d1d',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'fade-up': 'fadeUp 0.3s ease-out',
        'pulse-once': 'pulseOnce 0.6s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseOnce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
