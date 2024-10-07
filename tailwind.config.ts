import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '8px': '8px',
        '10px': '10px',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        '120': 'repeat(120, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-20': 'span 20 / span 20',
        'span-21': 'span 21 / span 21',
        'span-22': 'span 22 / span 22',
        'span-23': 'span 23 / span 23',
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25',
        'span-26': 'span 26 / span 26',
        'span-28': 'span 28 / span 28',
        'span-32': 'span 32 / span 32',
        'span-36': 'span 36 / span 36',
        'span-42': 'span 42 / span 42',
        'span-46': 'span 46 / span 46',
        'span-94': 'span 94 / span 94',
        'span-99': 'span 99 / span 99',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(110%)' },
          '75%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0%)' },
          '25%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        progress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' }
        }
      },
      animation: {
        slideInRight: 'slideInRight 0.3s ease-in-out forwards',
        slideOutRight: 'slideOutRight 0.5s ease-in-out forwards',
        fadeOut: 'fadeOut 0.5s ease-in-out forwards 3s',
        progress: 'progress 3s ease-in-out forwards',
      }
    },
  },
  plugins: [],
};
export default config;
