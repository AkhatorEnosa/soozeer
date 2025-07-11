import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,html}", // JSX project
    ],
    theme: {
        extend: {
            colors: {
                // 🌞 Light Theme Tokens
                primary: '#007AFF',
                secondary: '#F91880',
                success: '#28C76F',
                warning: '#FF9F43',
                error: '#d10001',
                info: '#00CFE8',
                accent: '#d4af37',
                neutral: '#1A1A1A',
                bg: {
                    DEFAULT: '#FFFFFF',     // Main light background
                    muted: '#F0F2F5',       // Soft surface
                    card: '#E4E6EB'         // Light card/panel
                },

                // 🌚 Dark Theme Tokens (prefixed for clarity)
                'dark-bg': {
                    DEFAULT: '#121212',     // Main dark background
                    muted: '#1A1A1A',       // Dark surface
                    card: '#1E1E1E'         // Card/panel background
                },
                'dark-neutral': '#CBC9C9' // Light text for dark mode
            }
        }
    },
    plugins: [daisyui],
    daisyui: {
        themes: false // Keeps DaisyUI components working without preset themes
    }
}
