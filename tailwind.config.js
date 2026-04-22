export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Montserrat"', 'sans-serif'],
                serif: ['"Great Vibes"', 'cursive'],
                montserrat: ["'Montserrat'", 'sans-serif'],
                vibes: ["'Great Vibes'", 'cursive'],
                dancing: ["'Dancing Script'", 'cursive'],
            },
            colors: {
                // Original kassandra-brian colors (DO NOT REMOVE - production)
                primary: "#5D7C89",
                "primary-dark": "#0E1038",
                secondary: "#F8FAFC",
                accent: "#CBD5E1",
                "text-dark": "#1E293B",
                "text-light": "#64748B",
                "card-bg": "#FFFFFF",

                // Boda — Verde salvia / sage
                boda: {
                    primary: '#5D7C6F',
                    accent: '#8FAE8B',
                    light: '#EAF0E8',
                    cream: '#F4F7F2',
                    dark: '#2C4A3E',
                    text: '#1C2B23',
                    gray: '#6E7F72',
                },
                // XV Años — Crema cálido / Vino
                xv: {
                    primary: '#8B2332',
                    accent: '#A3344A',
                    light: '#F5EDE0',
                    cream: '#F0E6D6',
                    dark: '#3D1A1A',
                    text: '#2C1810',
                    gray: '#8A7568',
                },
                // Bautizo — Azul cielo
                bautizo: {
                    primary: '#5B8BA0',
                    accent: '#8BB8CC',
                    light: '#E8F2F7',
                    cream: '#F2F8FB',
                    dark: '#1E3A4F',
                    text: '#1A2D3D',
                    gray: '#6E8490',
                },
                // Cumpleaños — Coral/Durazno festivo
                cumple: {
                    primary: '#E07A5F',
                    accent: '#F4A261',
                    light: '#FDF6F5',
                    cream: '#FEFAF9',
                    dark: '#3D1E16',
                    text: '#2C1B18',
                    gray: '#8C6B63',
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
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
