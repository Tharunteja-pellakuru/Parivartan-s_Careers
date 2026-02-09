  /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./*.{js,jsx}",
      "./components/**/*.{js,jsx}",
      "./pages/**/*.{js,jsx}",
      "./src/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            50: '#f1faea',
            100: '#dff5cf',
            200: '#c2ebaa',
            300: '#9ede7e',
            400: '#82d358',
            500: '#73BF44', // Vibrant Parivartan Green
            600: '#5ca332',
            700: '#48802a',
            800: '#3c6526',
            900: '#335421',
            950: '#1a2e0e',
          },
          slate: {
            850: '#151f32', // Custom darker slate for better contrast
            900: '#0f172a',
          }
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
          heading: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'float-delayed': 'float 6s ease-in-out 3s infinite',
          'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
          'blob': 'blob 7s infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          }
        }
      },
    },
    plugins: [],
  };