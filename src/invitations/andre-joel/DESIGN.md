# Bautizo | Andre Joel

## Technical profile

- Slug: `andre-joel`
- Event type: `bautizo`
- Architecture: `shared-overrides` (custom Hero, Intro, Footer with shared Padrinos, Countdown, Events, Gifts)

## Art direction

- **Concept**: Celestial baptism — heavenly, angelic, pure
- **Palette**: Sky blues (#D6EAFF → #4A6B8A), soft gold accents (#D4C48A), white
- **Typography**: Sacramento (display/cursive), Quicksand (body — soft, rounded, child-friendly)
- **Motifs**: SVG angel with halo, floating clouds, sparkling star particles, soft baptism cross
- **Background**: Pure CSS sky gradient (no hero image dependency), clouds drifting with CSS animations
- **Mood**: Tender, celestial, light, joyful

## Custom decisions

- Hero uses a CSS sky gradient instead of a background image (empty `hero-bg.png`)
- Angel SVG is inline, exported from HeroOverride for reuse across sections
- Cloud shapes are reusable SVG components with drift animations
- Envelope entrance screen matches celestial theme with clouds and angel
- Padrinos section uses a darker navy variant for contrast
- RSVP is conditionally rendered (currently mode: "none")

## Preserve

- Angel SVG proportions and soft color gradients
- Cloud drift animation timing and layering
- Celestial blue-to-white gradient direction (top=blue, bottom=white)
- Soft gold cross as dividers (not the communion chalice variant)
