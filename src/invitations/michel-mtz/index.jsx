import { useEffect } from 'react'
import { buildThemeVars, injectGoogleFonts } from '../../utils/themeEngine'
import config from './config.json'

// Shared invitation components (admin-editable via config.json)
import Hero from '../../components/invitation/Hero'
import Intro from '../../components/invitation/Intro'
import Padrinos from '../../components/invitation/Padrinos'
import Countdown from '../../components/invitation/Countdown'
import Events from '../../components/invitation/Events'
import DressCode from '../../components/invitation/DressCode'
import Gallery from '../../components/invitation/Gallery'
import Gifts from '../../components/invitation/Gifts'
import Itinerary from '../../components/invitation/Itinerary'
import RSVP from '../../components/invitation/RSVP'
import Footer from '../../components/invitation/Footer'

/* ─── Reusable themed watermark images ────────────────────────── */
const Watermark = ({ src, className, invert }) => (
    <img
        src={src}
        alt=""
        className={`absolute pointer-events-none select-none ${className}`}
        style={{ filter: invert ? 'invert(1) sepia(0.3) hue-rotate(80deg)' : 'sepia(0.5) hue-rotate(100deg)' }}
    />
)

const FloatingCharacter = ({ src, alt, className, delay = 0 }) => (
    <img
        src={src}
        alt={alt}
        className={`absolute z-20 drop-shadow-xl pointer-events-none ${className}`}
        style={{ animation: `rana-float ${4 + delay * 0.5}s ease-in-out ${delay}s infinite` }}
    />
)

export default function MichelMtzInvitation({ hideGallery = false }) {
    const basePath = `/invitations/${config.slug}`
    const themeVars = {
        ...buildThemeVars(config.theme),
        '--inv-primary': '27 94 32',
        '--inv-primary-light': '46 125 50',
        '--inv-accent': '255 215 0',
        '--inv-accent-warm': '218 165 32',
        '--inv-light': '232 245 233',
        '--inv-cream': '241 248 233',
        '--inv-dark': '13 40 24',
        '--inv-text': '27 47 27',
        '--inv-gray': '78 107 78',
        '--inv-teal': '0 105 92',
        '--inv-lily': '200 230 201',
        '--inv-firefly': '255 245 157',
        '--inv-swamp': '38 50 56',
    }

    useEffect(() => {
        const t = config.theme || {}
        injectGoogleFonts(t.fontBody || 'Montserrat', t.fontDisplay || 'Great Vibes')
    }, [])

    // SEO & Open Graph
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
        const description = `${config.title} — ¡Estás invitad@! Confirma tu asistencia.`
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

    // Image paths for decorations
    const img = (name) => `${basePath}/img/${name}`

    return (
        <div
            className={`min-h-screen bg-inv-cream text-inv-text font-inv-body selection:bg-inv-primary/30 overflow-x-hidden invitation-${config.slug} michel-mtz-invitation`}
            style={themeVars}
        >
            {/* ─── Global Themed Animations ────────────────────────────── */}
            <style>{`
                @keyframes rana-float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                    100% { transform: translateY(0px); }
                }
                /* Replace default ✦ divider with 👑 crown emoji */
                .michel-mtz-invitation .text-inv-accent.text-xl {
                    visibility: hidden;
                    position: relative;
                }
                .michel-mtz-invitation .text-inv-accent.text-xl::after {
                    content: "👑";
                    visibility: visible;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 1.1rem;
                }
                /* Override cross-pattern watermark in Intro with themed silhouettes */
                .michel-mtz-invitation .intro-wrapper section {
                    background: transparent !important;
                }
                /* Override cross watermarks in Padrinos */
                .michel-mtz-invitation .padrinos-wrapper section > div:first-child + div {
                    display: none;
                }
                /* Avoid parents' names wrapping to 2 lines on small screens */
                .michel-mtz-invitation .intro-wrapper .rounded-3xl {
                    padding-left: 1.25rem !important;
                    padding-right: 1.25rem !important;
                }
                .michel-mtz-invitation .intro-wrapper p.font-inv-display {
                    font-size: 1.25rem !important;
                }
                @media (min-width: 375px) {
                    .michel-mtz-invitation .intro-wrapper p.font-inv-display {
                        font-size: 1.35rem !important;
                    }
                }
                @media (min-width: 410px) {
                    .michel-mtz-invitation .intro-wrapper p.font-inv-display {
                        font-size: 1.5rem !important;
                    }
                    .michel-mtz-invitation .intro-wrapper .rounded-3xl {
                        padding-left: 2rem !important;
                        padding-right: 2rem !important;
                    }
                }
                @media (min-width: 768px) {
                    .michel-mtz-invitation .intro-wrapper p.font-inv-display {
                        font-size: 1.875rem !important;
                    }
                }

                /* Match Padrinos font size to parents and scale responsively */
                .michel-mtz-invitation .padrinos-wrapper p.font-inv-display {
                    font-size: 1.25rem !important;
                }
                @media (min-width: 375px) {
                    .michel-mtz-invitation .padrinos-wrapper p.font-inv-display {
                        font-size: 1.35rem !important;
                    }
                }
                @media (min-width: 410px) {
                    .michel-mtz-invitation .padrinos-wrapper p.font-inv-display {
                        font-size: 1.5rem !important;
                    }
                }
                @media (min-width: 768px) {
                    .michel-mtz-invitation .padrinos-wrapper p.font-inv-display {
                        font-size: 1.875rem !important;
                    }
                }
                /* Make dress code icon background transparent */
                .michel-mtz-invitation .dress-code-image {
                    mix-blend-mode: multiply;
                }
            `}</style>

            {/* ─── Hero Section (shared, already has fireflies & lotus) ─ */}
            <Hero data={config.hero} basePath={basePath} />

            {/* ─── Intro Section ────────────────────────────────────── */}
            <div className="intro-wrapper relative overflow-hidden bg-gradient-to-b from-inv-cream to-inv-light">
                {/* Lotus silhouette watermark — top left */}
                <Watermark src={img('lotus-silhouette.png')} className="top-4 left-4 w-28 md:w-36 opacity-[0.05]" />
                {/* Princess silhouette watermark — bottom right */}
                <Watermark src={img('princess-silhouette.png')} className="-bottom-8 -right-4 w-48 md:w-56 opacity-[0.06]" />
                {/* Colored frog illustration — floating left */}
                <FloatingCharacter src={img('rana.png')} alt="Rana" className="top-1/2 left-4 w-20 md:w-28 -translate-y-1/2" />
                <Intro data={config.intro} basePath={basePath} />
            </div>

            {/* ─── Padrinos Section ─────────────────────────────────── */}
            {config.padrinos?.enabled && (
                <div className="padrinos-wrapper relative overflow-hidden">
                    {/* Lotus silhouette watermark — bottom left (inverted for dark bg) */}
                    <Watermark src={img('lotus-silhouette.png')} className="-bottom-6 -left-6 w-32 md:w-40 opacity-[0.06]" invert />
                    {/* Frog silhouette watermark — top right (inverted) */}
                    <Watermark src={img('frog-silhouette.png')} className="-top-2 -right-2 w-24 md:w-32 opacity-[0.06]" invert style={{ transform: 'scaleX(-1)' }} />
                    {/* Tiana sketch illustration — right side */}
                    <img
                        src={img('tiana-sketch.png')}
                        alt=""
                        className="absolute top-1/2 right-0 -translate-y-1/2 w-64 md:w-80 opacity-80 pointer-events-none select-none drop-shadow-2xl z-0"
                    />
                    <Padrinos data={config.padrinos} basePath={basePath} />
                </div>
            )}

            {/* ─── Countdown Section ───────────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-b from-inv-light to-inv-cream z-10">
                {/* Lotus silhouette — left */}
                <Watermark src={img('lotus-silhouette.png')} className="left-2 top-4 w-28 md:w-36 opacity-[0.04]" />
                {/* Frog silhouette — right */}
                <Watermark src={img('frog-silhouette.png')} className="-right-2 top-1/3 w-24 md:w-32 opacity-[0.04]" />
                {/* Princess silhouette — bottom left */}
                <Watermark src={img('princess-silhouette.png')} className="-bottom-10 -left-6 w-44 md:w-56 opacity-[0.05]" />
                {/* Colored frog — bottom right, floating */}
                <FloatingCharacter src={img('rana.png')} alt="Rana" className="bottom-4 md:bottom-10 right-4 w-24 md:w-32" />
                <Countdown data={config.countdown} calendar={config.calendar} basePath={basePath} />
            </div>

            {/* ─── Events Section ───────────────────────────────────── */}
            <div className="relative overflow-hidden bg-inv-cream z-10">
                {/* Frog silhouette watermark */}
                <Watermark src={img('frog-silhouette.png')} className="top-10 -right-4 w-32 md:w-36 opacity-[0.04]" />
                {/* Luciérnaga — floating top-left */}
                <FloatingCharacter src={img('luciernaga.png')} alt="Luciérnaga" className="top-12 left-8 md:left-20 w-12 md:w-16" delay={0.5} />
                {/* Colored frog — floating bottom-center */}
                <FloatingCharacter src={img('rana.png')} alt="Rana" className="-bottom-4 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 w-20 md:w-28" delay={1} />
                <Events data={config.events} basePath={basePath} />
            </div>

            {/* ─── DressCode Section ────────────────────────────────── */}
            {config.dressCode?.enabled && (
                <div className="relative overflow-hidden bg-inv-light z-10">
                    {/* Princess silhouette — top left */}
                    <Watermark src={img('princess-silhouette.png')} className="-top-6 -left-4 w-40 md:w-48 opacity-[0.05]" />
                    {/* Frog silhouette — bottom right */}
                    <Watermark src={img('frog-silhouette.png')} className="-bottom-4 -right-4 w-28 md:w-36 opacity-[0.04]" />
                    <DressCode data={config.dressCode} basePath={basePath} />
                </div>
            )}

            {/* ─── Gallery Section ──────────────────────────────────── */}
            {!hideGallery && (
                <div className="relative overflow-hidden">
                    {/* Frog silhouette — bottom left */}
                    <Watermark src={img('frog-silhouette.png')} className="-bottom-4 -left-4 w-28 md:w-36 opacity-[0.04]" />
                    {/* Lotus silhouette — top right */}
                    <Watermark src={img('lotus-silhouette.png')} className="-top-4 -right-4 w-28 md:w-36 opacity-[0.04]" />
                    <Gallery data={config.gallery} basePath={basePath} />
                </div>
            )}

            {/* ─── Gifts Section ────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-white z-10">
                {/* Princess silhouette — top right */}
                <Watermark src={img('princess-silhouette.png')} className="-top-4 -right-6 w-40 md:w-48 opacity-[0.04]" />
                {/* Lotus silhouette — bottom left */}
                <Watermark src={img('lotus-silhouette.png')} className="-bottom-6 -left-6 w-32 md:w-40 opacity-[0.04]" />
                <Gifts data={config.gifts} basePath={basePath} />
            </div>

            {/* ─── Itinerary Section ────────────────────────────────── */}
            {config.itinerary?.enabled && (
                <div className="relative overflow-hidden z-10">
                    {/* Luciérnaga — floating right */}
                    <FloatingCharacter src={img('luciernaga.png')} alt="Luciérnaga" className="top-1/4 right-8 w-10 md:w-14" delay={0.3} />
                    <Itinerary data={config.itinerary} basePath={basePath} />
                </div>
            )}

            {/* ─── RSVP Section ─────────────────────────────────────── */}
            <div className="relative overflow-hidden z-10">
                {/* Lotus silhouette — top left (inverted for dark bg) */}
                <Watermark src={img('lotus-silhouette.png')} className="top-6 left-4 w-28 md:w-36 opacity-[0.06]" invert />
                {/* Frog silhouette — bottom right (inverted) */}
                <Watermark src={img('frog-silhouette.png')} className="-bottom-4 -right-4 w-28 md:w-36 opacity-[0.06]" invert />
                <RSVP data={config.rsvp} slug={config.slug} basePath={basePath} />
            </div>

            {/* ─── Footer Section ───────────────────────────────────── */}
            <div className="relative overflow-hidden">
                {/* Princess silhouette — center */}
                <Watermark src={img('princess-silhouette.png')} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 opacity-[0.04]" />
                {/* Frog silhouette — bottom left */}
                <Watermark src={img('frog-silhouette.png')} className="-bottom-2 -left-2 w-20 md:w-24 opacity-[0.04]" />
                {/* Lotus silhouette — bottom right */}
                <Watermark src={img('lotus-silhouette.png')} className="-bottom-3 -right-3 w-24 md:w-28 opacity-[0.04]" />
                <Footer data={config.footer} basePath={basePath} />
            </div>
        </div>
    )
}
