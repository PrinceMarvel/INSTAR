/** @type {import('tailwindcss').Config} */
import { COLORS } from './src/theme/colors.js';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        instar: {
          primary: COLORS.primary,
          secondary: COLORS.secondary,
          'secondary-hover': COLORS.secondaryHover,
          bg: COLORS.background,
          surface: COLORS.surface,
          'surface-alt': COLORS.surfaceAlt,
          text: COLORS.textPrimary,
          'text-muted': COLORS.textSecondary,
          border: COLORS.border,
          'border-active': COLORS.borderActive,
          success: COLORS.success,
          warning: COLORS.warning,
          danger: COLORS.danger,
          info: COLORS.info,
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'instar-card': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'instar-action': '0 4px 14px rgba(250, 204, 21, 0.35)',
      },
    },
  },
  plugins: [],
};
