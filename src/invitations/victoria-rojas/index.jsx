import { useEffect } from 'react'
import { buildThemeVars, injectGoogleFonts } from '../../utils/themeEngine'
import config from './config.json'

// Custom Overrides specifically for Victoria Rojas
import HeroOverride from './HeroOverride'
import IntroOverride from './IntroOverride'
import PadrinosOverride from './PadrinosOverride'
import CountdownOverride from './CountdownOverride'
import RSVPOverride from './RSVPOverride'

// Generic invitation components
import Events from '../../components/invitation/Events'
import DressCode from '../../components/invitation/DressCode'
import Gallery from '../../components/invitation/Gallery'
import Gifts from '../../components/invitation/Gifts'
import FooterOverride from './FooterOverride'

export default function VictoriaRojasInvitation() {
    const basePath = `/invitations/${config.slug}`

    // Base theme variables
    const baseThemeVars = buildThemeVars(config.theme)

    // Champagne custom color palette overrides (Decimal RGB components)
    const champagneThemeVars = {
        ...baseThemeVars,
        '--inv-cream': '247 231 206',         // #F7E7CE (Champagne)
        '--inv-light': '250 241 225',         // Lighter cream
        '--inv-primary': '112 92 70',         // Rich dark bronze
        '--inv-primary-light': '143 120 95',  // Medium warm bronze
        '--inv-accent': '218 171 107',        // Champagne gold
        '--inv-accent-warm': '179 135 77',    // Deep golden bronze
        '--inv-text': '74 63 53',             // Deep taupe/bronze charcoal
        '--inv-dark': '46 39 33',             // Very dark bronze charcoal
        '--inv-lily': '210 193 173',          // Soft sand/beige
        '--inv-teal': '138 122 102',          // Muted dark bronze
        '--inv-firefly': '247 231 206',       // Glows are champagne colored
        '--inv-gray': '143 130 119',          // Medium warm gray
    }

    useEffect(() => {
        const t = config.theme || {}
        injectGoogleFonts(t.fontBody || 'Montserrat', t.fontDisplay || 'Great Vibes')
    }, [])

    // SEO & Open Graph settings
    useEffect(() => {
        document.title = config.title || 'Invita-Ya'

        const setMeta = (property, content) => {
            if (!content) return
            let el = document.querySelector(`meta[property="${property}"]`)
                   || document.querySelector(`meta[name="${property}"]`)
            if (!el) {
                el = document.createElement('meta')
                if (property.startsWith('og:') || property.startsWith('twitter:')) {
                    el.setAttribute('property', property)
                } else {
                    el.setAttribute('name', property)
                }
                document.head.appendChild(el)
            }
            el.setAttribute('content', content)
        }

        const url = `${window.location.origin}/i/${config.slug}`
        const description = config.seo?.description || `${config.title} — ¡Estás invitad@! Confirma tu asistencia.`
        const image = `${window.location.origin}${basePath}/img/${config.hero.backgroundImage}`

        setMeta('description', description)
        setMeta('og:title', config.title)
        setMeta('og:description', description)
        setMeta('og:url', url)
        setMeta('og:type', 'website')
        setMeta('og:image', image)

        setMeta('twitter:card', 'summary_large_image')
        setMeta('twitter:title', config.title)
        setMeta('twitter:description', description)
        setMeta('twitter:image', image)

        return () => { document.title = 'Invita-Ya' }
    }, [basePath])

    return (
        <div className="min-h-screen bg-inv-cream text-inv-text font-inv-body selection:bg-inv-primary/30 overflow-x-hidden relative victoria-rojas-invitation" style={champagneThemeVars}>
            
            {/* Custom Styles for Victoria Rojas Floral Champagne Theme */}
            <style>{`
                /* Replace the default ✦ character in dividers with a beautiful modern floral emoji */
                .victoria-rojas-invitation .text-inv-accent.text-sm {
                    visibility: hidden;
                    position: relative;
                }
                .victoria-rojas-invitation .text-inv-accent.text-sm::after {
                    content: "🌸";
                    visibility: visible;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 0.95rem;
                }

                /* RSVP Wrapper: Style as a light, high-contrast container on light champagne background */
                .rsvp-wrapper .bg-gradient-to-br {
                    background: rgba(255, 255, 255, 0.75) !important;
                    border-color: rgba(112, 92, 70, 0.25) !important;
                    box-shadow: 0 10px 30px rgba(112, 92, 70, 0.08) !important;
                }
                .rsvp-wrapper h2,
                .rsvp-wrapper p,
                .rsvp-wrapper label,
                .rsvp-wrapper span,
                .rsvp-wrapper div {
                    color: #4A3F35 !important; /* Dark bronze text */
                }
                .rsvp-wrapper input,
                .rsvp-wrapper textarea,
                .rsvp-wrapper select {
                    background-color: #ffffff !important;
                    border-color: rgba(112, 92, 70, 0.3) !important;
                    color: #4A3F35 !important;
                }
                .rsvp-wrapper input::placeholder,
                .rsvp-wrapper textarea::placeholder {
                    color: rgba(112, 92, 70, 0.6) !important;
                }
                .rsvp-wrapper input:focus,
                .rsvp-wrapper textarea:focus,
                .rsvp-wrapper select:focus {
                    border-color: #705C46 !important;
                    box-shadow: 0 0 0 1px #705C46 !important;
                    background-color: #ffffff !important;
                }
                .rsvp-wrapper button[type="submit"] {
                    background-color: #705C46 !important; /* Dark bronze button */
                    color: #ffffff !important;
                    border-color: #705C46 !important;
                    font-weight: 700 !important;
                    opacity: 1 !important;
                }
                .rsvp-wrapper button[type="submit"]:hover {
                    background-color: #4A3F35 !important;
                    border-color: #4A3F35 !important;
                }
                .rsvp-wrapper svg {
                    color: #705C46 !important;
                }

                /* Footer Section text color contrast */
                .victoria-rojas-invitation footer p,
                .victoria-rojas-invitation footer a {
                    color: #4A3F35 !important;
                }
                .victoria-rojas-invitation footer p.text-inv-gray {
                    color: rgba(74, 63, 53, 0.7) !important;
                }

                /* Custom visual accents for cards */
                .victoria-rojas-invitation .bg-white\\/80 {
                    border-color: rgba(210, 193, 173, 0.5) !important;
                    background-color: rgba(253, 251, 247, 0.85) !important;
                }

                /* Make sure the main layout has proper relative context for z-indexed stickers */
                .victoria-rojas-invitation section {
                    position: relative;
                    z-index: 1;
                    background: transparent !important;
                }
                /* Exclude Padrinos Override section from transparency to keep its dark background */
                .victoria-rojas-invitation .padrinos-wrapper section {
                    background: linear-gradient(to bottom, #2E271F, #1C1713) !important;
                }
            `}</style>

            {/* Custom Hero Section */}
            <HeroOverride data={config.hero} basePath={basePath} />

            {/* Countdown Section (Wrapped with custom gold background stickers) */}
            <div className="relative overflow-hidden bg-gradient-to-b from-inv-light to-inv-cream z-10">
                {/* Gold sticker behind countdown */}
                <img 
                    src={`${basePath}/img/gold_element_10.png`} 
                    className="absolute -right-8 top-12 w-28 h-28 opacity-[0.14] pointer-events-none select-none z-0 object-contain rotate-12"
                    alt="gold star sticker"
                />
                <img 
                    src={`${basePath}/img/gold_element_12.png`} 
                    className="absolute left-6 bottom-4 w-16 h-16 opacity-[0.12] pointer-events-none select-none z-0 object-contain -rotate-12 animate-pulse-soft"
                    alt="gold star sticker"
                />
                <CountdownOverride data={config.countdown} calendar={config.calendar} basePath={basePath} />
            </div>

            {/* Custom Intro Section (No Cross, Custom Floral Divider) */}
            <IntroOverride data={config.intro} basePath={basePath} />

            {/* Custom Padrinos Section (No Cross Watermarks, Custom Leaf Watermarks) */}
            {config.padrinos?.enabled && (
                <div className="padrinos-wrapper relative">
                    <PadrinosOverride data={config.padrinos} basePath={basePath} />
                </div>
            )}

            {/* Events Section (Wrapped with custom gold background stickers) */}
            <div className="relative overflow-hidden bg-inv-cream z-10">
                {/* Gold shell peaking from bottom-left */}
                <img 
                    src={`${basePath}/img/gold_element_4.png`} 
                    className="absolute -left-8 bottom-6 w-32 h-32 opacity-[0.12] pointer-events-none select-none z-0 object-contain -rotate-45"
                    alt="gold shell sticker"
                />
                {/* Gold star on top-right */}
                <img 
                    src={`${basePath}/img/gold_element_8.png`} 
                    className="absolute right-12 top-4 w-16 h-16 opacity-[0.15] pointer-events-none select-none z-0 object-contain animate-float"
                    alt="gold star sticker"
                />
                <Events data={config.events} basePath={basePath} />
            </div>

            {/* DressCode Section */}
            {config.dressCode?.enabled && (
                <div className="relative overflow-hidden bg-inv-light z-10">
                    <img 
                        src={`${basePath}/img/gold_element_12.png`} 
                        className="absolute right-6 top-6 w-16 h-16 opacity-[0.12] pointer-events-none select-none z-0 object-contain rotate-45"
                        alt="gold sparkle"
                    />
                    <DressCode data={config.dressCode} basePath={basePath} />
                </div>
            )}

            {/* Gallery Section */}
            <Gallery data={config.gallery} basePath={basePath} />

            {/* Gifts Section (Wrapped with custom gold background stickers) */}
            <div className="relative overflow-hidden bg-white z-10">
                {/* Gold bow/ribbon sticker */}
                <img 
                    src={`${basePath}/img/gold_element_9.png`} 
                    className="absolute right-4 bottom-4 w-28 h-28 opacity-[0.14] pointer-events-none select-none z-0 object-contain rotate-12"
                    alt="gold bow"
                />
                <Gifts data={config.gifts} basePath={basePath} />
            </div>

            {/* RSVP Section (Wrapped with custom gold background stickers) */}
            <div className="rsvp-wrapper relative overflow-hidden z-10">
                {/* Gold disco ball behind RSVP! */}
                <img 
                    src={`${basePath}/img/gold_element_1.png`} 
                    className="absolute -left-12 top-6 w-44 h-44 opacity-[0.15] pointer-events-none select-none z-0 object-contain rotate-12"
                    alt="gold disco ball"
                />
                {/* Gold sparkle bottom right */}
                <img 
                    src={`${basePath}/img/gold_element_11.png`} 
                    className="absolute right-8 bottom-12 w-20 h-20 opacity-[0.18] pointer-events-none select-none z-0 object-contain animate-pulse-soft"
                    alt="gold sparkle"
                />
                <RSVPOverride data={config.rsvp} slug={config.slug} basePath={basePath} />
            </div>

            {/* Footer Section */}
            <FooterOverride data={config.footer} basePath={basePath} />
        </div>
    )
}
