import { useEffect } from 'react'
import { buildThemeVars, injectGoogleFonts } from '../../utils/themeEngine'
import config from './config.json'

import HeroOverride from './HeroOverride'
import IntroOverride from './IntroOverride'
import FloatingUnderwear from './FloatingUnderwear'
import Countdown from '../../components/invitation/Countdown'
import EventsOverride from './EventsOverride'
import Gallery from '../../components/invitation/Gallery'
import GiftsOverride from './GiftsOverride'
import Footer from '../../components/invitation/Footer'

export default function DespedidaKassBrian({ hideGallery = false }) {
    const basePath = `/invitations/${config.slug}`
    const themeVars = buildThemeVars(config.theme)

    useEffect(() => {
        const t = config.theme || {}
        injectGoogleFonts(t.fontBody || 'Montserrat', t.fontDisplay || 'Great Vibes')
    }, [config.theme])

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
        const description = config.seo?.description || `${config.title} — ¡Estás invitad@! Confirma tu asistencia.`
        const image = config.hero?.backgroundImage ? `${window.location.origin}${basePath}/img/${config.hero.backgroundImage}` : null

        setMeta('description', description)
        setMeta('og:title', config.title)
        setMeta('og:description', description)
        setMeta('og:url', url)
        setMeta('og:type', 'website')
        if (image) setMeta('og:image', image)

        setMeta('twitter:card', 'summary_large_image')
        setMeta('twitter:title', config.title)
        setMeta('twitter:description', description)
        if (image) setMeta('twitter:image', image)

        return () => { document.title = 'Invita-Ya' }
    }, [config.slug, config.title, config.seo, config.hero, basePath])

    return (
        <div className="min-h-screen bg-inv-cream text-inv-text font-inv-body selection:bg-inv-primary/30 overflow-x-hidden relative despedida-compact" style={themeVars}>
            {/* Mobile spacing overrides */}
            <style>{`
                @media (max-width: 768px) {
                    .despedida-compact section {
                        padding-top: 2rem !important;
                        padding-bottom: 2rem !important;
                    }
                    .despedida-compact section .mb-12 {
                        margin-bottom: 1.5rem !important;
                    }
                    .despedida-compact section .mb-10 {
                        margin-bottom: 1.5rem !important;
                    }
                    .despedida-compact section .mb-8 {
                        margin-bottom: 1rem !important;
                    }
                }
            `}</style>

            {/* Hero */}
            <HeroOverride data={config.hero} basePath={basePath} />

            {/* Tendedero — right below hero */}
            <FloatingUnderwear basePath={basePath} />

            {/* Compact intro */}
            <IntroOverride data={config.intro} basePath={basePath} />

            {/* Countdown */}
            <Countdown data={config.countdown} calendar={config.calendar} basePath={basePath} />

            {/* Events */}
            <EventsOverride data={config.events} basePath={basePath} />

            {/* Gallery */}
            {!hideGallery && <Gallery data={config.gallery} basePath={basePath} />}

            {/* Gifts — custom with cleaning products image */}
            <GiftsOverride data={config.gifts} basePath={basePath} />

            {/* Footer */}
            <Footer data={config.footer} basePath={basePath} />
        </div>
    )
}
