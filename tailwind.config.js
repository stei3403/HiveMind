module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFCF26',
        accent: '#FFD95F',
        dark: '#1A202C',
        brandYellow: '#FFFAE9',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui'],
        'playfair-display': ['\'Playfair Display\'', 'serif'],
      },
      animation: {
        'pulse-slow-1': 'pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow-2': 'pulse 12s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow-3': 'pulse 15s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 6s steps(110, end) forwards',
        'blink-caret': 'blink-caret 0.75s step-end infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '0.3' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' }
        },
        'blink-caret': {
          'from, to': { 'border-right-color': 'transparent' },
          '50%': { 'border-right-color': 'orange' },
        }
      },
      animationDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      }
    },
  },
  variants: {
    extend: {
      animationDelay: ['responsive'],
    },
  },
  plugins: [
    function({ addUtilities, theme, variants }) {
      const newUtilities = {}
      const animationDelay = theme('animationDelay')
      for (const key in animationDelay) {
        newUtilities[`.animate-delay-${key}`] = { 'animation-delay': animationDelay[key] }
      }
      addUtilities(newUtilities, variants('animationDelay'))
    }
  ],
};
