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
        'chat-bg': '#F7F7F8',
        'chat-bg-dark': '#1E1E1E',
        'user-message-light': '#F7F7F8',
        'user-message-dark': '#1E1E1E',
        'assistant-message-light': '#FFFFFF',
        'assistant-message-dark': '#2D2D2D',
        'sidebar-bg': '#FFFFFF',
        'sidebar-bg-dark': '#161616',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 