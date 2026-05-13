/**
 * Theme Engine — Genera paleta completa desde un color primario HSL
 * y carga Google Fonts dinámicamente.
 */

// ─── HSL → RGB Conversion ──────────────────────────────────────
function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

const rgb = (h, s, l) => hslToRgb(h, s, l).join(' ');

// ─── Palette Generator ─────────────────────────────────────────
export function generatePalette(primaryHue = 130, primarySat = 60, accentHue = 48) {
    const h = primaryHue;
    const s = primarySat;
    // For warm themes (hue < 60), keep teal in the gold/amber family
    // instead of pushing +38 into green territory
    const isWarm = h < 60;
    const tealHue = isWarm ? Math.max(h - 5, 20) : (h + 38) % 360;
    const tealSat = isWarm ? Math.min(s + 20, 70) : 80;
    return {
        '--inv-primary':       rgb(h, s, 24),
        '--inv-primary-light': rgb(h, s - 10, 35),
        '--inv-accent':        rgb(accentHue, 100, 50),
        '--inv-accent-warm':   rgb(accentHue, 76, 40),
        '--inv-cream':         rgb(h, 40, 96),
        '--inv-light':         rgb(h, 50, 91),
        '--inv-dark':          rgb(h, s, 10),
        '--inv-text':          rgb(h, 30, 15),
        '--inv-gray':          rgb(h, 15, 37),
        '--inv-teal':          rgb(tealHue, tealSat, 21),
        '--inv-lily':          rgb(h, 40, 78),
        '--inv-firefly':       rgb(accentHue + 7, 100, 80),
        '--inv-swamp':         rgb(isWarm ? h : 200, isWarm ? 25 : 20, 18),
    };
}

// ─── Default palette (Melani Marisol — green/gold) ──────────────
export const DEFAULT_THEME = { primaryHue: 130, primarySat: 60, accentHue: 48 };

// ─── Curated Font Lists ─────────────────────────────────────────
export const DISPLAY_FONTS = [
    'Great Vibes', 'Playfair Display', 'Cormorant Garamond', 'Dancing Script',
    'Parisienne', 'Alex Brush', 'Sacramento', 'Tangerine', 'Allura',
    'Cinzel', 'Marcellus', 'Libre Baskerville', 'EB Garamond', 'Lora',
    'Merriweather', 'Crimson Text',
];

export const BODY_FONTS = [
    'Montserrat', 'Inter', 'Raleway', 'Poppins', 'Outfit', 'Nunito',
    'Lato', 'Open Sans', 'Roboto', 'Source Sans 3', 'DM Sans',
    'Plus Jakarta Sans', 'Quicksand', 'Josefin Sans',
];

// ─── Google Fonts Loader ────────────────────────────────────────
const loadedFonts = new Set();

export function injectGoogleFonts(bodyFont = 'Montserrat', displayFont = 'Great Vibes') {
    const fonts = [bodyFont, displayFont].filter(f => !loadedFonts.has(f));
    if (fonts.length === 0) return;

    const families = fonts.map(f => {
        const encoded = f.replace(/\s+/g, '+');
        // Display fonts only need 400, body fonts need multiple weights
        return DISPLAY_FONTS.includes(f)
            ? `family=${encoded}`
            : `family=${encoded}:wght@300;400;500;600;700`;
    }).join('&');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    document.head.appendChild(link);

    fonts.forEach(f => loadedFonts.add(f));
}

// ─── Build CSS Variables Object ─────────────────────────────────
export function buildThemeVars(theme = {}) {
    const {
        primaryHue = DEFAULT_THEME.primaryHue,
        primarySat = DEFAULT_THEME.primarySat,
        accentHue = DEFAULT_THEME.accentHue,
        fontBody = 'Montserrat',
        fontDisplay = 'Great Vibes',
    } = theme;

    const palette = generatePalette(primaryHue, primarySat, accentHue);

    return {
        ...palette,
        '--inv-font-body': `'${fontBody}', sans-serif`,
        '--inv-font-display': `'${fontDisplay}', cursive`,
    };
}
