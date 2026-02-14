export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Great Vibes"', 'cursive'],
                sans: ['"Montserrat"', 'sans-serif'],
            },
            colors: {
                primary: "#5D7C89",       // Original Muted Blue
                "primary-dark": "#0E1038",// Deep Navy Blue (from designs)
                secondary: "#F8FAFC",     // Very Light Gray/White (Slate-50)
                accent: "#CBD5E1",        // Light Gray-Blue (Slate-300)
                "text-dark": "#1E293B",   // Slate-800 for main text
                "text-light": "#64748B",  // Slate-500 for secondary text
                "card-bg": "#FFFFFF",
            },
            // We can add custom animations back if needed here, 
            // but Tailwind typically handles them via utility classes.
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
