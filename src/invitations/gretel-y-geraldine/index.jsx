import { useEffect, useRef, useState } from 'react'
import {
    CalendarPlus, Camera, ChevronDown, Church, Clock3, Crown,
    Gift, Music2, Navigation, PartyPopper, Pause, Sparkles, Waves,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './rapunzel-template.css'

gsap.registerPlugin(ScrollTrigger)

const STORY_AUDIO = '/invitations/gretel-y-geraldine/audio/princesas-magicas.mp3'

const STORY_CONFIG = {
    slug: 'gretel-y-geraldine',
    name: 'Gretel y Geraldine',
    firstNames: ['Gretel', 'Geraldine'],
    fullNames: [
        'Gretel Esmeralda Noriega Contreras',
        'Geraldine Seleste Noriega Contreras',
    ],
    eventLabel: 'Nuestros XV años',
    date: '2026-12-05T13:00:00-06:00',
    dateLabel: '05 · DICIEMBRE · 2026',
    shortDate: '5 de diciembre de 2026',
    quote: 'Dos quinceañeras, dos sueños y una misma aventura iluminadas por el mar y los faroles.',
    invitationCopy: 'Hay momentos inolvidables que se atesoran en el corazón para siempre. Por esta razón, queremos que compartas con nosotras este día tan especial. Te invitamos a celebrar nuestros XV años.',
    families: [
        {
            celebrant: 'Gretel Esmeralda',
            parents: ['Dagoberto Noriega Ramírez', 'María de Lourdes Contreras Rodríguez'],
            godparents: ['Iban Wilfrido Aguilera Navarro', 'Ana María Torres Jara'],
        },
        {
            celebrant: 'Geraldine Seleste',
            parents: ['José Edgar Noriega Ramírez', 'Seleste Monserrat Contreras Rodríguez'],
            godparents: ['Luis Rodolfo Puentes Contreras', 'Slendy Jackelyn Puentes Velázquez'],
        },
    ],
    events: [
        {
            type: 'Ceremonia',
            place: 'Templo de la Divina Providencia',
            address: 'Pabellón de Hidalgo, Rincón de Romos, Aguascalientes',
            time: '1:00 p.m.',
            maps: 'https://www.google.com/maps/search/?api=1&query=Templo+de+la+Divina+Providencia+Pabellon+de+Hidalgo+Aguascalientes',
            icon: Church,
        },
        {
            type: 'Recepción',
            place: 'Salón Cumbres',
            address: 'Calle Venustiano Carranza #203, Pabellón de Hidalgo',
            time: 'Después de la ceremonia',
            maps: 'https://maps.app.goo.gl/V3ycXtG6U1YuPH5MA?g_st=aw',
            icon: PartyPopper,
        },
    ],
    gifts: {
        title: 'El mejor regalo',
        copy: 'Tu presencia y tus buenos deseos harán que esta celebración sea todavía más especial para nosotras.',
    },
    itinerary: [
        { label: 'Misa', time: '1:00 p.m. a 2:00 p.m.' },
        { label: 'Recepción', time: '2:00 p.m.' },
        { label: 'Comida', time: '3:00 p.m. a 7:00 p.m.' },
        { label: 'Vals', time: '8:00 p.m. a 9:00 p.m.' },
    ],
    music: ['Mariachi', 'Banda', 'Grupo'],
    gallery: [
        { src: '/invitations/gretel-y-geraldine/img/gallery-01.webp', alt: 'Gretel y Geraldine sentadas frente a un templo', caption: 'Un momento para recordar' },
        { src: '/invitations/gretel-y-geraldine/img/gallery-02.webp', alt: 'Retrato con peinado y maquillaje para una ocasión especial', caption: 'La ilusión comienza' },
        { src: '/invitations/gretel-y-geraldine/img/gallery-03.webp', alt: 'Retrato sonriente con cabello ondulado', caption: 'Sueños por cumplir' },
        { src: '/invitations/gretel-y-geraldine/img/gallery-04.webp', alt: 'Retrato de cabello largo y mirada al frente', caption: 'Momentos que brillan' },
        { src: '/invitations/gretel-y-geraldine/img/gallery-05.webp', alt: 'Retrato sonriente con suéter claro', caption: 'Una sonrisa especial' },
        { src: '/invitations/gretel-y-geraldine/img/gallery-06.webp', alt: 'Retrato sonriente en una celebración', caption: 'Recuerdos con alegría' },
        { src: '/invitations/gretel-y-geraldine/img/gallery-07.webp', alt: 'Retrato de cabello largo con atuendo oscuro', caption: 'Camino a los XV' },
    ],
}

const pad = (value) => String(value).padStart(2, '0')

function SunMark({ small = false }) {
    return (
        <span className={`story-sun ${small ? 'story-sun--small' : ''}`} aria-hidden="true">
            <i />
        </span>
    )
}

function SectionHeading({ kicker, children, light = false }) {
    return (
        <div className={`story-heading ${light ? 'story-heading--light' : ''}`}>
            <p><Sparkles size={14} /> {kicker}</p>
            <h2>{children}</h2>
            <span className="story-heading__rule"><i /><SunMark small /><i /></span>
        </div>
    )
}

function FloatingSticker({ src, className, delay = 0 }) {
    return (
        <img
            className={`story-float ${className}`}
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            style={{ '--float-delay': `${delay}s` }}
        />
    )
}

function OceanOrnament({ className = '' }) {
    return (
        <svg className={`story-ocean-ornament ${className}`} viewBox="0 0 180 150" aria-hidden="true">
            <path className="story-ocean-ornament__wave story-ocean-ornament__wave--one" d="M8 36c20-18 39-18 59 0s39 18 59 0 33-17 46-6" />
            <path className="story-ocean-ornament__wave story-ocean-ornament__wave--two" d="M2 57c21-18 41-18 61 0s40 18 60 0 35-18 53-4" />
            <g className="story-ocean-ornament__shell story-ocean-ornament__shell--large">
                <path d="M25 130c-2-30 15-53 40-53s42 23 40 53H25Z" />
                <path d="M65 80v49M49 83l8 46M82 84l-9 45M37 94l14 35M94 95l-15 34" />
            </g>
            <g className="story-ocean-ornament__shell story-ocean-ornament__shell--small">
                <path d="M113 126c0-20 11-36 28-36s29 16 28 36h-56Z" />
                <path d="M141 93v32M129 97l6 28M153 98l-6 27" />
            </g>
            <circle cx="119" cy="76" r="3" />
            <circle cx="135" cy="67" r="2" />
            <circle cx="151" cy="76" r="4" />
        </svg>
    )
}

function LanternTrail() {
    return (
        <div className="story-gallery__lantern-trail" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => <span key={index} style={{ '--lantern-index': index }} />)}
        </div>
    )
}

function MusicControl() {
    const audioRef = useRef(null)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return undefined

        let waitingForInteraction = true

        function removeInteractionListeners() {
            if (!waitingForInteraction) return
            document.removeEventListener('pointerdown', playAfterInteraction, true)
            document.removeEventListener('keydown', playAfterInteraction, true)
            waitingForInteraction = false
        }

        async function playAfterInteraction(event) {
            if (event.target instanceof Element && event.target.closest('.story-music')) {
                removeInteractionListeners()
                return
            }

            try {
                await audio.play()
                removeInteractionListeners()
            } catch {
                setPlaying(false)
            }
        }

        document.addEventListener('pointerdown', playAfterInteraction, true)
        document.addEventListener('keydown', playAfterInteraction, true)
        audio.play().then(removeInteractionListeners).catch(() => { })
        return removeInteractionListeners
    }, [])

    const toggle = async () => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) {
            try {
                await audio.play()
            } catch {
                setPlaying(false)
            }
        } else {
            audio.pause()
        }
    }

    return (
        <>
            <audio
                ref={audioRef}
                src={STORY_AUDIO}
                preload="metadata"
                autoPlay
                loop
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />
            <button
                className={`story-music${playing ? ' is-playing' : ''}`}
                type="button"
                onClick={toggle}
                aria-label={playing ? 'Pausar Princesas Mágicas' : 'Reproducir Princesas Mágicas'}
            >
                <span className="story-music__disc" aria-hidden="true">
                    {playing ? <Pause size={16} /> : <Music2 size={16} />}
                </span>
                <span className="story-music__copy">
                    <small>{playing ? 'Ahora suena' : 'Nuestra canción'}</small>
                    <strong>Princesas Mágicas</strong>
                </span>
            </button>
        </>
    )
}

function useCountdown(date) {
    const calculate = () => {
        const distance = new Date(date).getTime() - Date.now()
        if (distance <= 0) return { arrived: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
        return {
            arrived: false,
            days: Math.floor(distance / 86400000),
            hours: Math.floor((distance / 3600000) % 24),
            minutes: Math.floor((distance / 60000) % 60),
            seconds: Math.floor((distance / 1000) % 60),
        }
    }
    const [time, setTime] = useState(calculate)
    useEffect(() => {
        const timer = window.setInterval(() => setTime(calculate()), 1000)
        return () => window.clearInterval(timer)
    }, [date])
    return time
}

function Hero({ config }) {
    return (
        <header className="story-hero">
            <div className="story-hero__art" data-hero-art />
            <div className="story-hero__veil" />
            <div className="story-lanterns" aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => (
                    <span key={index} style={{ '--i': index }} />
                ))}
            </div>

            <div className="story-hero__content">
                <div className="story-hero__symbols" data-hero-copy><SunMark /><Waves size={35} /></div>
                <p className="story-hero__eyebrow" data-hero-copy>{config.eventLabel}</p>
                <h1 data-hero-copy>
                    <span>{config.firstNames[0]}</span>
                    <i>&</i>
                    <span>{config.firstNames[1]}</span>
                </h1>
                <p className="story-hero__date" data-hero-copy>{config.dateLabel}</p>
                <p className="story-hero__quote" data-hero-copy>“{config.quote}”</p>
            </div>

            <button
                className="story-scroll"
                type="button"
                onClick={() => document.querySelector('#story-intro')?.scrollIntoView()}
                aria-label="Descubrir la invitación"
            >
                Descubre nuestra historia <ChevronDown size={18} />
            </button>
        </header>
    )
}

function Intro({ config }) {
    return (
        <section className="story-section story-intro" id="story-intro" data-story-section>
            <svg className="story-gold-ribbon" viewBox="0 0 390 420" data-drift aria-hidden="true">
                <path
                    className="story-gold-ribbon__lock"
                    d="M42 378C7 301 13 150 118 69C224-13 357 44 374 169C391 289 302 385 191 367C89 351 55 248 105 169C151 97 264 99 307 176C345 245 298 320 225 317C163 315 134 255 158 209C178 170 235 168 257 204C278 237 257 272 225 270C197 268 185 243 195 224"
                />
                <path
                    className="story-gold-ribbon__shine"
                    d="M50 374C18 300 24 159 124 82C218 10 343 58 360 172C376 280 294 367 196 351C106 337 76 248 119 181C159 118 255 117 292 182C324 239 285 300 226 298"
                />
            </svg>
            <FloatingSticker src="/invitations/gretel-y-geraldine/img/decor-pua.webp" className="story-float--intro-pua" delay={-1.8} />
            <div className="story-container">
                <SectionHeading kicker="Con la bendición de Dios" light>
                    Dos sueños,<br /><em>una aventura</em>
                </SectionHeading>

                <p className="story-intro__copy">{config.invitationCopy}</p>

                <div className="story-family-grid">
                    {config.families.map((family) => (
                        <article className="story-name-card" key={family.celebrant} data-card>
                            <Crown size={24} />
                            <span>Papás de {family.celebrant}</span>
                            <h3>{family.parents[0]}</h3>
                            <i>&</i>
                            <h3>{family.parents[1]}</h3>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Godparents({ config }) {
    return (
        <section className="story-section story-godparents" data-story-section>
            <div className="story-spark-field" />
            <div className="story-padrinos-lanterns" aria-hidden="true">
                <span /><span /><span />
            </div>
            <FloatingSticker src="/invitations/gretel-y-geraldine/img/decor-lanterns.webp" className="story-float--lanterns" delay={-1.1} />
            <div className="story-container">
                <SectionHeading kicker="Con el cariño de" light>Nuestros<br /><em>padrinos</em></SectionHeading>
                <div className="story-godparents-grid">
                    {config.families.map((family) => (
                        <article className="story-glass-card" key={family.celebrant} data-card>
                            <SunMark small />
                            <p>Padrinos de {family.celebrant}</p>
                            <h3>{family.godparents[0]}</h3>
                            <span>&</span>
                            <h3>{family.godparents[1]}</h3>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Countdown({ config }) {
    const time = useCountdown(config.date)
    const values = [
        ['Días', time.days],
        ['Horas', time.hours],
        ['Min', time.minutes],
        ['Seg', time.seconds],
    ]

    const addToCalendar = () => {
        const start = new Date(config.date)
        const end = new Date(start.getTime() + 6 * 60 * 60 * 1000)
        const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
        const url = new URL('https://calendar.google.com/calendar/render')
        url.searchParams.set('action', 'TEMPLATE')
        url.searchParams.set('text', `XV años de ${config.name}`)
        url.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`)
        url.searchParams.set('details', config.quote)
        window.open(url.toString(), '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="story-section story-countdown" data-story-section>
            <div className="story-tower" data-drift aria-hidden="true"><i /><i /><i /></div>
            <FloatingSticker src="/invitations/gretel-y-geraldine/img/decor-rapunzel-full.webp" className="story-float--tower-rapunzel" delay={-2.9} />
            <div className="story-container">
                <SectionHeading kicker="La aventura comienza en" light>
                    {time.arrived ? 'El gran día' : 'Falta muy poco'}
                </SectionHeading>
                {!time.arrived && (
                    <div className="story-timer" data-card>
                        {values.map(([label, value]) => (
                            <div key={label}>
                                <strong>{label === 'Días' ? value : pad(value)}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="story-countdown__date">{config.shortDate}</p>
                <button className="story-button story-button--purple" type="button" onClick={addToCalendar}>
                    <CalendarPlus size={17} /> Agregar al calendario
                </button>
            </div>
        </section>
    )
}

function Events({ config }) {
    return (
        <section className="story-section story-events" data-story-section>
            <FloatingSticker src="/invitations/gretel-y-geraldine/img/decor-moana-paddle.webp" className="story-float--events-moana" delay={-1.5} />
            <div className="story-container">
                <SectionHeading kicker="Dónde y cuándo" light>Nuestros<br /><em>encuentros</em></SectionHeading>
                <div className="story-event-grid">
                    {config.events.map((event) => {
                        const Icon = event.icon
                        return (
                            <article className="story-event-card" key={event.type} data-card>
                                <div className="story-event-card__icon"><Icon size={25} /></div>
                                <p>{event.type}</p>
                                <h3>{event.place}</h3>
                                <span><Clock3 size={14} /> {event.time}</span>
                                <address>{event.address}</address>
                                <a href={event.maps} target="_blank" rel="noreferrer">
                                    <Navigation size={15} /> Ver ubicación
                                </a>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function Itinerary({ config }) {
    return (
        <section className="story-section story-itinerary" data-story-section>
            <FloatingSticker src="/invitations/gretel-y-geraldine/img/decor-pascal.webp" className="story-float--itinerary-pascal" delay={-1.9} />
            <div className="story-container">
                <SectionHeading kicker="Paso a paso" light>Nuestro<br /><em>itinerario</em></SectionHeading>
                <div className="story-itinerary__list">
                    {config.itinerary.map((item, index) => (
                        <article className="story-itinerary__item" key={item.label} data-card>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <div>
                                <h3>{item.label}</h3>
                                <p><Clock3 size={14} /> {item.time}</p>
                            </div>
                        </article>
                    ))}
                </div>
                <article className="story-music-program" data-card>
                    <Music2 size={24} />
                    <div>
                        <span>Música a disfrutar</span>
                        <p>{config.music.join(' · ')}</p>
                    </div>
                </article>
            </div>
        </section>
    )
}

function Gallery({ config }) {
    const [active, setActive] = useState(0)
    const touchStartX = useRef(null)
    const showPrevious = () => setActive((current) => (current - 1 + config.gallery.length) % config.gallery.length)
    const showNext = () => setActive((current) => (current + 1) % config.gallery.length)
    const handleTouchStart = (event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
    }
    const handleTouchEnd = (event) => {
        if (touchStartX.current === null) return
        const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current
        touchStartX.current = null
        if (Math.abs(distance) < 42) return
        if (distance > 0) showPrevious()
        else showNext()
    }

    return (
        <section className="story-section story-gallery" data-story-section>
            <OceanOrnament className="story-ocean-ornament--gallery" />
            <LanternTrail />
            <div className="story-container">
                <SectionHeading kicker="Érase una vez" light>Nuestra galería</SectionHeading>
                <div
                    className="story-gallery__stage"
                    data-card
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    aria-label="Galería deslizable de fotografías"
                >
                    {config.gallery.map((photo, index) => (
                        <figure
                            key={photo.caption}
                            className={index === active ? 'is-active' : ''}
                            style={{ '--photo': `url("${photo.src}")` }}
                            aria-hidden={index !== active}
                        >
                            <img src={photo.src} alt={photo.alt} loading="lazy" />
                            <figcaption>{photo.caption}</figcaption>
                        </figure>
                    ))}
                </div>
                <p className="story-gallery__counter" aria-live="polite">{active + 1} / {config.gallery.length}</p>
                <div className="story-gallery__dots" aria-label="Seleccionar imagen">
                    {config.gallery.map((photo, index) => (
                        <button
                            key={photo.caption}
                            type="button"
                            className={active === index ? 'is-active' : ''}
                            onClick={() => setActive(index)}
                            aria-label={`Ver ${photo.caption}`}
                        />
                    ))}
                </div>
                <p className="story-gallery__hint"><Camera size={14} /> Desliza para ver más momentos</p>
            </div>
        </section>
    )
}

function Gifts({ config }) {
    return (
        <section className="story-section story-gifts" data-story-section>
            <FloatingSticker src="/invitations/gretel-y-geraldine/img/decor-lanterns.webp" className="story-float--gifts-lanterns" delay={-2.6} />
            <div className="story-container">
                <SectionHeading kicker="Tu presencia es nuestro regalo" light>Detalles con<br /><em>mucho cariño</em></SectionHeading>
                <article className="story-gift-card" data-card>
                    <span className="story-gift-card__icon"><Gift size={31} /></span>
                    <h3>{config.gifts.title}</h3>
                    <p>{config.gifts.copy}</p>
                    <span className="story-envelope">Para Gretel y Geraldine <i>♥</i></span>
                </article>
            </div>
        </section>
    )
}

function Footer({ config }) {
    return (
        <footer className="story-footer">
            <FloatingSticker src="/invitations/gretel-y-geraldine/img/decor-pascal.webp" className="story-float--footer-pascal" delay={-1.8} />
            <OceanOrnament className="story-ocean-ornament--footer" />
            <SunMark />
            <p>Dos caminos se encuentran<br /><em>bajo un mismo cielo</em></p>
            <h2>{config.name}</h2>
            <span>{config.dateLabel}</span>
            <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Creado con Invita-Ya.com</a>
        </footer>
    )
}

export default function GretelGeraldineXV({ hideGallery = false }) {
    const rootRef = useRef(null)

    useEffect(() => {
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,600&family=DM+Sans:wght@400;500;600&family=Italiana&display=swap'
        document.head.appendChild(fontLink)
        document.title = `${STORY_CONFIG.eventLabel} · ${STORY_CONFIG.name}`

        const media = gsap.matchMedia()
        const context = gsap.context(() => {
            media.add('(prefers-reduced-motion: no-preference)', () => {
                gsap.timeline({ defaults: { ease: 'power3.out' } })
                    .from('[data-hero-copy]', { opacity: 0, y: 35, duration: 1, stagger: .14 })
                    .from('.story-scroll', { opacity: 0, y: -10, duration: .7 }, '-=.35')

                gsap.to('[data-hero-art]', {
                    yPercent: 10,
                    scale: 1.06,
                    ease: 'none',
                    scrollTrigger: { trigger: '.story-hero', start: 'top top', end: 'bottom top', scrub: 1 },
                })

                gsap.utils.toArray('[data-story-section]').forEach((section) => {
                    const elements = section.querySelectorAll('.story-heading > *, [data-card], .story-intro__copy, .story-countdown__date, .story-button')
                    gsap.from(elements, {
                        opacity: 0,
                        y: 48,
                        duration: .9,
                        stagger: .1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 78%',
                            toggleActions: 'play none none reverse',
                        },
                    })
                })

                gsap.utils.toArray('[data-drift]').forEach((element, index) => {
                    gsap.to(element, {
                        y: index % 2 ? -70 : 70,
                        rotation: index % 2 ? 8 : -8,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: element.closest('section'),
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                        },
                    })
                })
            })
        }, rootRef)

        return () => {
            context.revert()
            media.revert()
            fontLink.remove()
        }
    }, [])

    return (
        <main className="story-template" ref={rootRef}>
            <MusicControl />
            <Hero config={STORY_CONFIG} />
            <Intro config={STORY_CONFIG} />
            <Godparents config={STORY_CONFIG} />
            <Countdown config={STORY_CONFIG} />
            <Events config={STORY_CONFIG} />
            <Itinerary config={STORY_CONFIG} />
            {!hideGallery && <Gallery config={STORY_CONFIG} />}
            <div className="story-closing-scene">
                <Gifts config={STORY_CONFIG} />
                <Footer config={STORY_CONFIG} />
            </div>
        </main>
    )
}
