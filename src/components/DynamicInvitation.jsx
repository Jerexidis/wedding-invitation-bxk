import { useEffect } from 'react'
import { buildThemeVars, injectGoogleFonts } from '../utils/themeEngine'
import Hero from './invitation/Hero'
import Intro from './invitation/Intro'
import Padrinos from './invitation/Padrinos'
import Countdown from './invitation/Countdown'
import Events from './invitation/Events'
import DressCode from './invitation/DressCode'
import Gallery from './invitation/Gallery'
import Gifts from './invitation/Gifts'
import Itinerary from './invitation/Itinerary'
import RSVP from './invitation/RSVP'
import Footer from './invitation/Footer'

/**
 * DynamicInvitation — Renderiza cualquier invitación desde un config.json.
 *
 * Cada invitación solo necesita:
 *   import config from './config.json'
 *   import DynamicInvitation from '../../components/DynamicInvitation'
 *   export default () => <DynamicInvitation config={config} />
 *
 * Un fix aquí = todas las invitaciones arregladas.
 */
export default function DynamicInvitation({ config }) {
    const basePath = `/invitations/${config.slug}`
    const themeVars = buildThemeVars(config.theme)

    useEffect(() => {
        const t = config.theme || {}
        injectGoogleFonts(t.fontBody || 'Montserrat', t.fontDisplay || 'Great Vibes')
    }, [config.theme])

    // ─── SEO & Open Graph ───────────────────────────────────
    useEffect(() => {
        // Title
        document.title = config.title || 'Invita-Ya'

        // Helper to upsert meta tags
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
        const description = config.seo?.description
            || `${config.title} — ¡Estás invitad@! Confirma tu asistencia.`
        const image = config.seo?.shareImage
            ? `${window.location.origin}${basePath}/img/${config.seo.shareImage}`
            : config.hero?.backgroundImage
                ? `${window.location.origin}${basePath}/img/${config.hero.backgroundImage}`
                : null

        // Standard
        setMeta('description', description)

        // Open Graph (WhatsApp, Facebook, iMessage)
        setMeta('og:title', config.title)
        setMeta('og:description', description)
        setMeta('og:url', url)
        setMeta('og:type', 'website')
        if (image) setMeta('og:image', image)

        // Twitter Card
        setMeta('twitter:card', 'summary_large_image')
        setMeta('twitter:title', config.title)
        setMeta('twitter:description', description)
        if (image) setMeta('twitter:image', image)

        return () => { document.title = 'Invita-Ya' }
    }, [config.slug, config.title, config.seo, config.hero, basePath])

    return (
        <div className="min-h-screen bg-inv-cream text-inv-text font-inv-body selection:bg-inv-primary/30 overflow-x-hidden" style={themeVars}>
            <Hero data={config.hero} basePath={basePath} />
            <Intro data={config.intro} basePath={basePath} />
            {config.padrinos?.enabled && (
                <Padrinos data={config.padrinos} basePath={basePath} />
            )}
            <Countdown data={config.countdown} calendar={config.calendar} basePath={basePath} />
            <Events data={config.events} basePath={basePath} />
            {config.dressCode?.enabled && (
                <DressCode data={config.dressCode} basePath={basePath} />
            )}
            <Gallery data={config.gallery} basePath={basePath} />
            <Gifts data={config.gifts} basePath={basePath} />
            {config.itinerary?.enabled && (
                <Itinerary data={config.itinerary} basePath={basePath} />
            )}
            <RSVP data={config.rsvp} slug={config.slug} basePath={basePath} />
            <Footer data={config.footer} basePath={basePath} />
        </div>
    )
}
