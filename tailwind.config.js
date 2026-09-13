/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F1',
        sand: '#F3E9DD',
        shell: '#F7EFE6',
        blush: '#F2D8CF',
        rosewood: {
          DEFAULT: '#B76E79',
          dark: '#96525D',
          light: '#D8A7AE',
        },
        gold: {
          DEFAULT: '#C6A15B',
          light: '#E4C98F',
          dark: '#9A7A3C',
        },
        espresso: {
          DEFAULT: '#241B16',
          light: '#3A2D26',
          soft: '#5C4B42',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(36, 27, 22, 0.18)',
        card: '0 10px 40px -12px rgba(183, 110, 121, 0.25)',
        gold: '0 10px 30px -10px rgba(198, 161, 91, 0.55)',
      },
      letterSpacing: {
        lux: '0.28em',
      },
    },
  },
  plugins: [],
};
