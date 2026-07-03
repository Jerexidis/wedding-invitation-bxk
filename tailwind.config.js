export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Legacy — Kassandra & Brian (landing, intocable)
                sans: ["'Montserrat'", 'sans-serif'],
                serif: ["'Great Vibes'", 'cursive'],
                montserrat: ["'Montserrat'", 'sans-serif'],
                // Dynamic — invitaciones data-driven
                'inv-body': 'var(--inv-font-body)',
                'inv-display': 'var(--inv-font-display)',
                // Bautizo
                vibes: ["'Great Vibes'", 'cursive'],
                playfair: ["'Playfair Display'", 'serif'],
            },
            colors: {
                // ── Kassandra & Brian (landing — intocable) ──────────────
                primary:       "#5D7C89",
                "primary-dark": "#0E1038",
                secondary:     "#F8FAFC",
                accent:        "#CBD5E1",
                "text-dark":   "#1E293B",
                "text-light":  "#64748B",
                "card-bg":     "#FFFFFF",

                // ── Dynamic invitation palette (CSS variables) ──────────
                inv: {
                    primary:       'rgb(var(--inv-primary) / <alpha-value>)',
                    'primary-light': 'rgb(var(--inv-primary-light) / <alpha-value>)',
                    accent:        'rgb(var(--inv-accent) / <alpha-value>)',
                    'accent-warm': 'rgb(var(--inv-accent-warm) / <alpha-value>)',
                    cream:         'rgb(var(--inv-cream) / <alpha-value>)',
                    light:         'rgb(var(--inv-light) / <alpha-value>)',
                    dark:          'rgb(var(--inv-dark) / <alpha-value>)',
                    text:          'rgb(var(--inv-text) / <alpha-value>)',
                    gray:          'rgb(var(--inv-gray) / <alpha-value>)',
                    teal:          'rgb(var(--inv-teal) / <alpha-value>)',
                    lily:          'rgb(var(--inv-lily) / <alpha-value>)',
                    firefly:       'rgb(var(--inv-firefly) / <alpha-value>)',
                    swamp:         'rgb(var(--inv-swamp) / <alpha-value>)',
                },

                // ── La Princesa y el Sapo — Verde esmeralda / Dorado ────
                rana: {
                    primary: '#1B5E20',
                    'primary-light': '#2E7D32',
                    accent: '#FFD700',
                    'accent-warm': '#DAA520',
                    light: '#E8F5E9',
                    cream: '#F1F8E9',
                    dark: '#0D2818',
                    text: '#1B2F1B',
                    gray: '#4E6B4E',
                    teal: '#00695C',
                    lily: '#C8E6C9',
                    firefly: '#FFF59D',
                    swamp: '#263238',
                },
                // ── Bautizo — Celestial blue / Soft gold ────────────────
                bautizo: {
                    cream:    '#F2F8FB',
                    light:    '#E0EEF5',
                    primary:  '#5B8BA0',
                    dark:     '#2C4A5A',
                    accent:   '#8BB8CC',
                    text:     '#3A5568',
                    gray:     '#7A95A8',
                },
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInUp: {
                    '0%':   { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
