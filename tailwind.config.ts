import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#000000',
          fg: '#ffffff',
          muted: '#d1d1d1',
          border: '#222222',
        },
        accent: '#F0822F',
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' },
      boxShadow: { soft: '0 10px 30px rgba(255,255,255,0.05)' },
    },
  },
  plugins: [],
}
export default config