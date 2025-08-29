import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,html}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                secondary: '#F91880',
                success: '#28C76F',
                warning: '#FF9F43',
                error: '#d10001',
                info: '#00CFE8',
                accent: '#d4af37',
                neutral: {
                    lightest: '#FFFFFF',
                    lighter: '#F0F2F5',
                    light: '#E4E6EB',
                    DEFAULT: '#606770',
                    dark: '#0E1017',
                },
                bg: {
                    DEFAULT: '#fffffc',
                    muted: '#F5F5F5',
                    card: '#E4E6EB',
                },
                'dark-bg': {
                    DEFAULT: '#0E1017',
                    muted: '#1A1A1A',
                    card: '#1E1E1E',
                },
                'dark-accent': {
                    DEFAULT: '#CBC9C9',
                    muted: '#C0C0C0',
                },
            },
            screens: {
                'xs': '320px',    // Extra small devices (phones)
                'sm': '640px',    // Small devices (tablets)
                'md': '768px',    // Medium devices (small laptops)
                'lg': '1024px',   // Large devices (desktops)
                'xl': '1280px',   // Extra large devices (large desktops)
                '2xl': '1536px',  // 2X large devices
                '3xl': '1920px',  // 3X large devices (large screens)
                
                // You can also add custom breakpoints
                'tall': { 'raw': '(min-height: 800px)' }, // For tall screens
            }
        }
    },
    plugins: [daisyui],
    daisyui: {
        themes: false // 💥 Completely disables built-in themes
    }
}