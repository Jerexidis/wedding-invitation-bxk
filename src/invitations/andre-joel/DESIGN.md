# Bautizo | Andre Joel

## Technical profile

- Slug: `andre-joel`
- Event type: `bautizo`
- Architecture: `shared-overrides` (custom Hero, Intro, Footer with shared Padrinos, Countdown, Events, Gifts)

## Art direction

- **Concept**: Celestial baptism — heavenly, angelic, pure
- **Palette**: Sky blues (#D6EAFF → #4A6B8A), soft gold accents (#D4C48A), white
- **Typography**: Sacramento (display/cursive), Quicksand (body — soft, rounded, child-friendly)
- **Motifs**: illustrated angel floating from selected corners, floating clouds, sparkling star particles, soft baptism cross
- **Background**: Pure CSS sky gradient (no hero image dependency), clouds drifting with CSS animations
- **Mood**: Tender, celestial, light, joyful

## Custom decisions

- Hero uses a CSS sky gradient instead of a background image (empty `hero-bg.png`)
- Keep the baby portrait as the hero focal point; the supplied angel remains a secondary corner decoration and the dove is not used
- Cloud shapes are reusable SVG components with drift animations
- Envelope entrance screen matches celestial theme with clouds and angel
- Parents and padrinos use separate, balanced family cards
- Venue cards use the supplied Templo de San José and Villa Victoria photographs with compact, legible mobile details
- Countdown is an independent section immediately after the hero and stays in one horizontal four-column strip
- Gallery is a curated five-photo viewer with one featured portrait and centered arrows/counter beneath the image; avoid duplicate photos, mini previews, and stacked-card effects
- `Pretty Little Baby` starts from the envelope-opening gesture and keeps a minimal fixed pause/play control
- RSVP is conditionally rendered (currently mode: "none")

## Preserve

- Baby hero portrait, side-ornament proportions, generous breathing room, and soft color gradients
- Cloud drift animation timing and layering
- Celestial blue-to-white gradient direction (top=blue, bottom=white)
- Soft gold cross as dividers (not the communion chalice variant)
