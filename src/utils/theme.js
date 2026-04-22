export const THEME_PRESETS = {
  sage:       { primary: '#5D7C6F', accent: '#8FAE8B', light: '#EAF0E8', cream: '#F4F7F2', dark: '#2C4A3E', text: '#1C2B23', gray: '#6E7F72' },
  'rose-gold':{ primary: '#B76E79', accent: '#D4A574', light: '#F5E6E0', cream: '#FDF5F2', dark: '#6B3A42', text: '#3D1F24', gray: '#8A6B6B' },
  ocean:      { primary: '#2E6B8A', accent: '#5BA4C9', light: '#E3F0F7', cream: '#F0F7FB', dark: '#1A3D52', text: '#162D3A', gray: '#5E7F8E' },
  wine:       { primary: '#8B2332', accent: '#A3344A', light: '#F5EDE0', cream: '#F0E6D6', dark: '#3D1A1A', text: '#2C1810', gray: '#8A7568' },
  classic:    { primary: '#2C2C2C', accent: '#B8860B', light: '#F5F5F0', cream: '#FAFAF5', dark: '#1A1A1A', text: '#0D0D0D', gray: '#6B6B6B' },
  lavender:   { primary: '#7B6BA0', accent: '#A594C8', light: '#F0EBF5', cream: '#F7F4FA', dark: '#3E2D5C', text: '#2A1E40', gray: '#7E7490' },
};

export const FONT_MAP = {
  vibes: "'Great Vibes', cursive",
  dancing: "'Dancing Script', cursive",
  playfair: "'Playfair Display', serif",
  cormorant: "'Cormorant Garamond', serif",
};

function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `${r} ${g} ${b}`;
}

export function getThemeStyles(config, defaultPresetName = 'sage') {
  if (!config || !config.theme) return null;
  const preset = THEME_PRESETS[config.theme.preset] || THEME_PRESETS[defaultPresetName];
  if (!preset) return null;
  
  const font = FONT_MAP[config.theme.font] || FONT_MAP.vibes;
  
  return `
    :root {
      --t-primary: ${hexToRgb(preset.primary)};
      --t-accent: ${hexToRgb(preset.accent)};
      --t-light: ${hexToRgb(preset.light)};
      --t-cream: ${hexToRgb(preset.cream)};
      --t-dark: ${hexToRgb(preset.dark)};
      --t-text: ${hexToRgb(preset.text)};
      --t-gray: ${hexToRgb(preset.gray)};
      --t-font: ${font};
    }
    .font-vibes { font-family: var(--t-font) !important; }
  `;
}
