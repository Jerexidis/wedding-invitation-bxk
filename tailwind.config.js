export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // font-sans → Montserrat (cuerpo de texto)
                sans: ["'Montserrat'", 'sans-serif'],
                // font-serif → Great Vibes (títulos caligráficos)
                serif: ["'Great Vibes'", 'cursive'],
                // Aliases semánticos explícitos (usados en los templates)
                vibes:   ["'Great Vibes'", 'cursive'],
                dancing: ["'Dancing Script'", 'cursive'],
                montserrat: ["'Montserrat'", 'sans-serif'],
            },
            colors: {
                // ── Invitación Kassandra & Brian (producción) ──────────────
                primary:       "#5D7C89",
                "primary-dark": "#0E1038",
                secondary:     "#F8FAFC",
                accent:        "#CBD5E1",
                "text-dark":   "#1E293B",
                "text-light":  "#64748B",
                "card-bg":     "#FFFFFF",

                // ── Boda — Driven by CSS custom properties for per-invitation theming
                boda: {
                    primary: 'rgb(var(--t-primary) / <alpha-value>)',
                    accent:  'rgb(var(--t-accent) / <alpha-value>)',
                    light:   'rgb(var(--t-light) / <alpha-value>)',
                    cream:   'rgb(var(--t-cream) / <alpha-value>)',
                    dark:    'rgb(var(--t-dark) / <alpha-value>)',
                    text:    'rgb(var(--t-text) / <alpha-value>)',
                    gray:    'rgb(var(--t-gray) / <alpha-value>)',
                },
                // ── XV Años — Crema cálido / Vino ──────────────────────────
                xv: {
                    primary: 'rgb(var(--t-primary) / <alpha-value>)',
                    accent:  'rgb(var(--t-accent) / <alpha-value>)',
                    light:   'rgb(var(--t-light) / <alpha-value>)',
                    cream:   'rgb(var(--t-cream) / <alpha-value>)',
                    dark:    'rgb(var(--t-dark) / <alpha-value>)',
                    text:    'rgb(var(--t-text) / <alpha-value>)',
                    gray:    'rgb(var(--t-gray) / <alpha-value>)',
                },
                // ── Bautizo — Azul cielo ───────────────────────────────────
                bautizo: {
                    primary: 'rgb(var(--t-primary) / <alpha-value>)',
                    accent:  'rgb(var(--t-accent) / <alpha-value>)',
                    light:   'rgb(var(--t-light) / <alpha-value>)',
                    cream:   'rgb(var(--t-cream) / <alpha-value>)',
                    dark:    'rgb(var(--t-dark) / <alpha-value>)',
                    text:    'rgb(var(--t-text) / <alpha-value>)',
                    gray:    'rgb(var(--t-gray) / <alpha-value>)',
                },
                // ── Cumpleaños — Coral / Durazno festivo ───────────────────
                cumple: {
                    primary: '#E07A5F',
                    accent:  '#F4A261',
                    light:   '#FDF6F5',
                    cream:   '#FEFAF9',
                    dark:    '#3D1E16',
                    text:    '#2C1B18',
                    gray:    '#8C6B63',
                },
                // La Princesa y el Sapo — Verde esmeralda / Dorado
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
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
