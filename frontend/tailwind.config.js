/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#5B21B6',      // Deep, regal purple
        'brand-secondary': '#A855F7',    // Vibrant, lighter purple for accents
        'brand-accent': '#C084FC',       // Soft purple for highlights
        'brand-dark': '#4C1D95',         // Darker purple for hover states
        'brand-light': '#E9D5FF',        // Very light purple for backgrounds
        'bg-base': '#F8F9FA',           // Off-white for main backgrounds
        'bg-card': '#FFFFFF',           // Pure white for cards and modals
        'text-primary': '#1F2937',      // Dark gray for main text
        'text-secondary': '#6B7280',    // Lighter gray for secondary text
        'text-muted': '#9CA3AF',        // Muted gray for timestamps
        'border-color': '#E5E7EB',      // Subtle gray for borders
        'border-light': '#F3F4F6',      // Very light border
        'success': '#10B981',           // Green for success states
        'warning': '#F59E0B',           // Amber for warnings
        'error': '#EF4444',             // Red for errors
        'info': '#3B82F6',              // Blue for info
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #5B21B6 0%, #A855F7 100%)',
        'brand-gradient-light': 'linear-gradient(135deg, #A855F7 0%, #C084FC 100%)',
        'brand-gradient-dark': 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 100%)',
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(91, 33, 182, 0.15)',
        'brand-lg': '0 10px 25px 0 rgba(91, 33, 182, 0.2)',
        'brand-xl': '0 20px 40px 0 rgba(91, 33, 182, 0.25)',
      },
    },
  },
  plugins: [],
}