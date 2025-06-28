/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  darkMode: ['selector'],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,html}", // JSX project
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',       // Updated primary color
        secondary: '#F91880',
        success: '#28C76F',
        warning: '#FF9F43',
        error: '#d10001',
        info: '#00CFE8',
        neutral: {
          lightest: '#FFFFFF',
          lighter: '#F0F2F5',
          light: '#E4E6EB',
          DEFAULT: '#606770',
          dark: '#1A1A1A',
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          // ...require("daisyui/src/theming/themes")["corporate"],
          primary: "#007AFF",
          secondary: "#F91880",
          neutral: "#000000",
          "base-100": "#FFFFFF",
          success: "#28C76F",
          warning: "#FF9F43",
          error: "#d10001",
          info: "#00CFE8",
          accent: "#d4af37"
        },
      },
      {
        dark: {
          // ...require("daisyui/src/theming/themes")["forest"],
          primary: "#007AFF",
          secondary: "#F91880",
          neutral: "#1A1A1A",
          "base-100": "#121212",
          success: "#28C76F",
          warning: "#FF9F43",
          error: "#d10001",
          info: "#00CFE8",
          accent: "#d4af37"
        },
      },
    ],
  },
}
