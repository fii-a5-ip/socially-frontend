/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#e67c94',
                background: '#f5e6e8',
                foreground: '#2d2d2d',
                card: '#ffffff',
            },
        },
    },
    plugins: [],
}