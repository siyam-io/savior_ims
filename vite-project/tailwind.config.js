/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 🔥 এটি না থাকলে ডার্ক মোড টগল কাজ করবে না
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // আপনার index.css এর কাস্টম ডার্ক কালারগুলো এখানে ডিফাইন করা হলো
        dark: {
          'bg-primary': '#030712',     // Background color
          'bg-secondary': '#111827',   // Card background
          'bg-tertiary': '#1f2937',    // Input fields background
          'border': '#1f2937',         // Border color
          'text-primary': '#f9fafb',   // Main text
          'text-secondary': '#9ca3af', // Muted text
        },
        primary: {
          500: '#3b82f6', // Blue 500 (আপনার form-input এর জন্য)
          600: '#2563eb', // Blue 600
          700: '#1d4ed8', // Blue 700
          800: '#1e40af', // Blue 800
        }
      }
    },
  },
  plugins: [],
}