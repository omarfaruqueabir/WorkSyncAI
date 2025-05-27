/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'chat-bg': {
          light: '#ffffff',
          dark: '#343541',
        },
        'sidebar-bg': {
          light: '#f7f7f8',
          dark: '#202123',
        },
        'user-message': {
          light: '#ffffff',
          dark: '#343541',
        },
        'assistant-message': {
          light: '#f7f7f8',
          dark: '#444654',
        },
      },
    },
  },
  plugins: [],
} 