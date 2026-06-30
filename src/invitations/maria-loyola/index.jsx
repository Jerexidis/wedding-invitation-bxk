import { useEffect, useState } from 'react'
import { buildThemeVars, injectGoogleFonts } from '../../utils/themeEngine'
import config from './config.json'

// Custom Overrides specifically for María José Loyola
import HeroOverride from './HeroOverride'
import IntroOverride from './IntroOverride'
import PadrinosOverride from './PadrinosOverride'
import CountdownOverride from './CountdownOverride'
import RSVPOverride from './RSVPOverride'

// Generic invitation components
import Events from '../../components/invitation/Events'
import Gallery from '../../components/invitation/Gallery'
import Gifts from '../../components/invitation/Gifts'
import Itinerary from '../../components/invitation/Itinerary'
import FooterOverride from './FooterOverride'
import { FloatingLily } from './FloralDecorations'

export default function MariaLoyolaInvitation({ hideGallery = false }) {
    const basePath = `/invitations/${config.slug}`
    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    const [envelopeExit, setEnvelopeExit] = useState(false);

    const handleOpenEnvelope = () => {
        setEnvelopeExit(true);
        // Play the audio immediately upon user interaction
        const audio = document.getElementById('invitationAudio');
        if (audio) {
            audio.play().catch(err => console.log('Audio autoplay blocked or failed:', err));
        }
        setTimeout(() => {
            setEnvelopeOpen(true);
        }, 1000); // Wait for transition animation to finish
    };

    // Base theme variables
    const baseThemeVars = buildThemeVars(config.theme)

    // Coral & Cornsilk custom color palette overrides (based on reference images)
    const coralThemeVars = {
        ...baseThemeVars,
        '--inv-cream': '250 239 202',         // #FAEFCA (Cornsilk)
        '--inv-light': '253 247 230',         // Lighter cornsilk
        '--inv-primary': '180 80 60',         // Rich coral-brown
        '--inv-primary-light': '210 120 95',  // Medium warm coral
        '--inv-accent': '248 131 99',         // #F88363 (Coral)
        '--inv-accent-warm': '210 100 75',    // Deep warm coral
        '--inv-text': '100 55 45',            // Deep warm brown
        '--inv-dark': '70 35 28',             // Very dark warm brown
        '--inv-lily': '240 210 195',          // Soft peachy pink
        '--inv-teal': '170 110 95',           // Muted warm coral
        '--inv-firefly': '250 239 202',       // Glows are cornsilk colored
        '--inv-gray': '165 130 118',          // Medium warm gray
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
        <div className="min-h-screen bg-inv-cream text-inv-text font-inv-body selection:bg-inv-primary/30 overflow-x-hidden relative maria-loyola-invitation" style={coralThemeVars}>
            
            {/* Custom Styles for María José Loyola Coral & Cornsilk Theme */}
            <style>{`
                /* Replace the default ✦ character in dividers with a beautiful modern floral emoji */
                .maria-loyola-invitation .text-inv-accent.text-sm:not(p) {
                    visibility: hidden;
                    position: relative;
                }
                .maria-loyola-invitation .text-inv-accent.text-sm:not(p)::after {
                    content: "🌸";
                    visibility: visible;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 0.95rem;
                }

                /* RSVP Wrapper: Style as a light, high-contrast container on light cornsilk background */
                .rsvp-wrapper .bg-gradient-to-br {
                    background: rgba(255, 255, 255, 0.75) !important;
                    border-color: rgba(180, 80, 60, 0.25) !important;
                    box-shadow: 0 10px 30px rgba(180, 80, 60, 0.08) !important;
                }
                .rsvp-wrapper h2,
                .rsvp-wrapper p,
                .rsvp-wrapper label,
                .rsvp-wrapper span,
                .rsvp-wrapper div {
                    color: #64372D !important; /* Deep warm brown text */
                }
                .rsvp-wrapper input,
                .rsvp-wrapper textarea,
                .rsvp-wrapper select {
                    background-color: #ffffff !important;
                    border-color: rgba(180, 80, 60, 0.3) !important;
                    color: #64372D !important;
                }
                .rsvp-wrapper input::placeholder,
                .rsvp-wrapper textarea::placeholder {
                    color: rgba(180, 80, 60, 0.6) !important;
                }
                .rsvp-wrapper input:focus,
                .rsvp-wrapper textarea:focus,
                .rsvp-wrapper select:focus {
                    border-color: #B4503C !important;
                    box-shadow: 0 0 0 1px #B4503C !important;
                    background-color: #ffffff !important;
                }
                .rsvp-wrapper button[type="submit"] {
                    background-color: #B4503C !important; /* Coral button */
                    color: #ffffff !important;
                    border-color: #B4503C !important;
                    font-weight: 700 !important;
                    opacity: 1 !important;
                }
                .rsvp-wrapper button[type="submit"]:hover {
                    background-color: #8A3A2A !important;
                    border-color: #8A3A2A !important;
                }
                .rsvp-wrapper svg {
                    color: #B4503C !important;
                }

                /* Footer Section text color contrast */
                .maria-loyola-invitation footer p,
                .maria-loyola-invitation footer a {
                    color: #64372D !important;
                }
                .maria-loyola-invitation footer p.text-inv-gray {
                    color: rgba(100, 55, 45, 0.7) !important;
                }

                /* Custom visual accents for cards */
                .maria-loyola-invitation .bg-white\\/80 {
                    border-color: rgba(240, 210, 195, 0.5) !important;
                    background-color: rgba(253, 251, 247, 0.85) !important;
                }

                /* Make sure the main layout has proper relative context for z-indexed stickers */
                .maria-loyola-invitation section {
                    position: relative;
                    z-index: 1;
                    background: transparent !important;
                }
                /* Exclude Padrinos Override section from transparency to keep its dark background */
                .maria-loyola-invitation .padrinos-wrapper section {
                    background: linear-gradient(to bottom, #46231C, #2E160F) !important;
                }
                /* Exclude Itinerary section from transparency to keep its dark background */
                .maria-loyola-invitation .itinerary-wrapper section {
                    background: linear-gradient(to bottom, #46231C, #2E160F) !important;
                }

                /* Dress code restriction styling */
                .dress-code-restriction {
                    margin-top: 0.75rem;
                    padding: 0.5rem 1.25rem;
                    background: linear-gradient(135deg, #FFF0EB, #FFE4DC);
                    border: 1px solid rgba(248, 131, 99, 0.35);
                    border-radius: 1rem;
                    color: #B4503C;
                    font-weight: 600;
                    font-size: 0.8rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                /* Envelope Entrance Overlay Styles */
                .envelope-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    background: linear-gradient(135deg, #FDF7E6, #FAEFCA);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s;
                }
                .envelope-overlay.exit {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                }
                .envelope-container {
                    perspective: 1000px;
                    width: 90%;
                    max-width: 420px;
                    text-align: center;
                    padding: 3rem 2.5rem;
                    background: #ffffff;
                    border-radius: 2.5rem;
                    box-shadow: 0 20px 60px rgba(248, 131, 99, 0.18);
                    border: 1px solid rgba(248, 131, 99, 0.4);
                    transform: translateY(0) scale(1);
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .envelope-overlay.exit .envelope-container {
                    transform: translateY(-80px) scale(0.92);
                }
                .envelope-seal-btn {
                    cursor: pointer;
                    width: 96px;
                    height: 96px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #F88363, #D2644B);
                    border: 3px solid #ffffff;
                    box-shadow: 0 10px 25px rgba(248, 131, 99, 0.45), inset 0 2px 4px rgba(255,255,255,0.4);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    font-family: 'Great Vibes', cursive;
                    font-size: 2.8rem;
                    font-weight: bold;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
                    outline: none;
                    animation: sealPulse 2s infinite;
                }
                .envelope-seal-btn:hover {
                    transform: scale(1.08) rotate(5deg);
                    box-shadow: 0 15px 30px rgba(248, 131, 99, 0.55), inset 0 2px 4px rgba(255,255,255,0.4);
                }
                .envelope-seal-btn:active {
                    transform: scale(0.96);
                }
                @keyframes sealPulse {
                    0% { box-shadow: 0 0 0 0 rgba(248, 131, 99, 0.55); }
                    70% { box-shadow: 0 0 0 15px rgba(248, 131, 99, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(248, 131, 99, 0); }
                }
            `}</style>

            {/* Custom Hero Section */}
            <HeroOverride data={config.hero} basePath={basePath} />

            {/* Countdown Section (Wrapped with custom gold background stickers) */}
            <div className="relative overflow-x-clip bg-gradient-to-b from-inv-light to-inv-cream z-10">
                <FloatingLily
                    basePath={basePath}
                    variant="blush"
                    delay="-1.8s"
                    className="absolute -left-16 top-8 w-44 md:w-56 opacity-40 -rotate-12 z-0"
                />
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
                <FloatingLily
                    basePath={basePath}
                    variant="coral"
                    delay="-0.5s"
                    className="absolute -right-16 bottom-2 w-44 md:w-56 opacity-35 rotate-12 z-0"
                />
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

            {/* DressCode Section with restriction inside the card */}
            {config.dressCode?.enabled && (
                <div className="relative overflow-hidden bg-inv-light z-10">
                    <img 
                        src={`${basePath}/img/gold_element_12.png`} 
                        className="absolute right-6 top-6 w-16 h-16 opacity-[0.12] pointer-events-none select-none z-0 object-contain rotate-45"
                        alt="gold sparkle"
                    />
                    <section className="relative py-16 px-4 text-center overflow-hidden">
                        <div className="max-w-sm mx-auto bg-white p-8 rounded-3xl shadow-md border border-inv-lily/50 relative z-10">
                            <h3 className="text-lg font-semibold text-inv-dark uppercase tracking-widest mb-6">
                                Código de Vestimenta
                            </h3>
                            <div className="bg-gradient-to-br from-inv-cream to-inv-light p-6 rounded-2xl border border-inv-lily/30 mb-4">
                                <div className="flex justify-center mb-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 96" className="w-32 h-32 md:w-36 md:h-36 text-inv-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <g transform="translate(9 6) scale(3.55)">
                                            <path strokeWidth="1.5" d="M10 3v2l4-2v2Z" />
                                            <path strokeWidth="1.5" d="M18 3h1a2 2 0 0 1 1.7 3A5271 5271 0 0 0 12 21S6.8 12 3.3 6A2 2 0 0 1 5 3h1m6 6h.01M12 13h.01" />
                                            <path strokeWidth="1.5" d="M21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" />
                                        </g>
                                        <g transform="translate(77 6) scale(3.55)">
                                            <path strokeWidth="1.45" d="m15 4l-3 2l-3-2c-.586.51-1.93 1.293-1.997 2.146c-.029.37.126.571.435.975C8.112 8.002 9 8.521 9 10h6c0-1.48.888-1.998 1.562-2.879c.31-.404.464-.606.434-.975C16.93 5.293 15.587 4.509 15 4M9 4V2m6 2V2m-5.5 8h5m3.5 9c2 0 3-2.173 3-2.173c-2.825-1.836-4.5-3.993-5.413-5.622c-.347-.62-.521-.93-.755-1.068C14.598 10 14.285 10 13.659 10H10.34c-.626 0-.939 0-1.173.137s-.408.447-.755 1.068C7.5 12.834 5.825 14.99 3 16.827C3 16.827 4 19 6 19" />
                                            <path strokeWidth="1.45" d="M13.706 14c.34.796 1.815 2.671 3.435 4.31c.597.605.896.907.855 1.42c-.04.512-.29.683-.79 1.025C16.07 21.53 14.336 22 12 22s-4.07-.469-5.207-1.245c-.5-.342-.75-.513-.79-1.025c-.04-.513.259-.815.856-1.42c1.62-1.639 3.096-3.514 3.435-4.31" />
                                        </g>
                                        <path strokeWidth="3" opacity="0.5" d="M63 74c11-4 23-4 34 0" />
                                    </svg>
                                </div>
                                <p className="font-bold text-inv-primary text-2xl tracking-wide">{config.dressCode.type}</p>
                            </div>
                            {/* Restriction notice inside the card */}
                            {config.dressCode.restriction && (
                                <div className="mt-2 pt-4 border-t border-inv-lily/30">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF0EB] to-[#FFE4DC] px-4 py-2.5 rounded-xl border border-[#F88363]/25">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B4503C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                                        <span className="text-[#B4503C] text-xs font-semibold uppercase tracking-wide">
                                            El color salmón está reservado para la quinceañera
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* Gallery Section */}
            {!hideGallery && <Gallery data={config.gallery} basePath={basePath} />}

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

            {/* Itinerary Section */}
            {config.itinerary?.enabled && (
                <div className="itinerary-wrapper relative overflow-hidden z-10">
                    <Itinerary data={config.itinerary} basePath={basePath} />
                </div>
            )}

            {/* RSVP Section (Wrapped with custom gold background stickers) */}
            <div className="rsvp-wrapper relative overflow-hidden z-10">
                <FloatingLily
                    basePath={basePath}
                    variant="cream"
                    delay="-1.1s"
                    className="absolute -right-20 top-10 w-52 md:w-64 opacity-35 rotate-12 z-0"
                />
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

            {/* Elegant Envelope Entrance Screen */}
            {!envelopeOpen && (
                <div className={`envelope-overlay ${envelopeExit ? 'exit' : ''}`}>
                    <div className="envelope-container relative overflow-hidden">
                        {/* Decorative flowers and sparkles peaking inside the envelope */}
                        <img 
                            src={`${basePath}/img/flower_single.png?v=2`} 
                            className="absolute -left-12 -top-12 w-28 h-28 opacity-[0.14] rotate-45 pointer-events-none select-none" 
                            alt="flower decor" 
                        />
                        <img 
                            src={`${basePath}/img/gold_element_12.png`} 
                            className="absolute -right-6 -bottom-6 w-20 h-20 opacity-[0.15] rotate-12 pointer-events-none select-none" 
                            alt="gold sparkle decor" 
                        />

                        <div className="space-y-6">
                            <p className="text-xs uppercase tracking-[0.35em] text-[#B4503C] font-semibold">Te invitamos a celebrar</p>
                            <h2 className="font-inv-display text-4xl sm:text-5xl text-[#8A3A2A] drop-shadow-sm leading-tight">María José</h2>
                            <p className="text-xs uppercase tracking-[0.25em] text-[#B4503C] font-semibold pb-4">Mis XV Años</p>
                            
                            <div className="py-4">
                                <button onClick={handleOpenEnvelope} className="envelope-seal-btn" title="Abrir invitación">
                                    M
                                </button>
                            </div>
                            
                            <p className="text-xs uppercase tracking-[0.2em] text-[#D2644B] font-bold animate-pulse">Abrir Invitación</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
