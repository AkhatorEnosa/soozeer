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
                    dark: '#1A1A1A',
                },
                bg: {
                    DEFAULT: '#FFFFFF',
                    muted: '#F5F5F5',
                    card: '#E4E6EB',
                },
                'dark-bg': {
                    DEFAULT: '#121212',
                    muted: '#1A1A1A',
                    card: '#1E1E1E',
                },
                'dark-text': {
                    DEFAULT: '#CBC9C9',
                    muted: '#C0C0C0',
                },
            }
        }
    },
    plugins: [daisyui],
    daisyui: {
        themes: false // 💥 Completely disables built-in themes
    }
}
