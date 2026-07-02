import { useEffect, useRef, useState } from 'react'
import {
    CalendarPlus,
    ChevronDown,
    Church,
    Clock3,
    Gift,
    Heart,
    MapPin,
    MessageCircle,
    Music2,
    Navigation,
    Pause,
    Sparkles,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import riverPhoto from './assets/maia-rio.webp'
import treePhoto from './assets/maia-arbol.webp'
import riverPortraitPhoto from './assets/maia-retrato-rio.webp'
import dressPhoto from './assets/maia-dress-v2.webp'
import chapelPhoto from './assets/capilla.webp'
import venuePhoto from './assets/monte-olimpo.webp'
import ogPreview from './assets/og-preview.jpg'
import './invitation.css'

gsap.registerPlugin(ScrollTrigger)

const EVENT_DATE = '2026-07-24T19:00:00-06:00'
const WHATSAPP = '524493666177'
const AUDIO = '/invitations/maia-sofia-duran-avila/audio/once-upon-a-dream.mp3'

const locations = [
    {
        kind: 'Ceremonia religiosa',
        name: 'Capilla del Sagrado Corazón',
        detail: 'Los Fresnos · Aguascalientes, Ags.',
        time: '7:00 pm',
        image: chapelPhoto,
        maps: 'https://maps.app.goo.gl/75G1BrN8zqgmyd1fA',
        icon: Church,
    },
    {
        kind: 'Recepción',
        name: 'Salón Monte Olimpo',
        detail: 'Av. Rosas Guadalupanas · Hacienda Nueva, Ags.',
        time: '8:30 pm',
        image: venuePhoto,
        maps: 'https://www.google.com/maps/search/?api=1&query=Salon+de+Eventos+Monte+Olimpo+Hacienda+Nueva+Aguascalientes',
        icon: Sparkles,
    },
]

const calculateTime = () => {
    const distance = new Date(EVENT_DATE).getTime() - Date.now()
    if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true }
    return {
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance / 3600000) % 24),
        minutes: Math.floor((distance / 60000) % 60),
        seconds: Math.floor((distance / 1000) % 60),
        arrived: false,
    }
}

function useCountdown() {
    const [time, setTime] = useState(calculateTime)

    useEffect(() => {
        const timer = window.setInterval(() => setTime(calculateTime()), 1000)
        return () => window.clearInterval(timer)
    }, [])

    return time
}

function SectionTitle({ eyebrow, children, light = false }) {
    return (
        <header className={`maia-heading${light ? ' maia-heading--light' : ''}`} data-reveal>
            <p>{eyebrow}</p>
            <h2>{children}</h2>
            <i aria-hidden="true" />
        </header>
    )
}

function MusicControl() {
    const audioRef = useRef(null)
    const [playing, setPlaying] = useState(false)

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
                src={AUDIO}
                preload="metadata"
                loop
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />
            <button
                className={`maia-music${playing ? ' is-playing' : ''}`}
                type="button"
                onClick={toggle}
                aria-label={playing ? 'Pausar música' : 'Reproducir música'}
            >
                {playing ? <Pause size={16} /> : <Music2 size={16} />}
                <span>{playing ? 'Pausar' : 'Música'}</span>
            </button>
        </>
    )
}

function Hero() {
    return (
        <header className="maia-hero">
            <picture>
                <source media="(max-width: 480px)" srcSet={riverPortraitPhoto} />
                <img src={riverPhoto} alt="" className="maia-hero__photo" data-parallax />
            </picture>
            <div className="maia-hero__shade" />
            <div className="maia-hero__copy">
                <p>Una noche para recordar</p>
                <h1>Mis <span>XV</span></h1>
                <blockquote>
                    Hay momentos que soñamos toda la vida.<br />
                    Gracias por ser parte del mío.
                </blockquote>
                <span className="maia-hero__date">24 · 07 · 2026</span>
            </div>
            <button
                className="maia-scroll"
                type="button"
                onClick={() => document.querySelector('#maia-name')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Descubrir la invitación"
            >
                <span>Descubre</span>
                <ChevronDown size={18} />
            </button>
        </header>
    )
}

function NameReveal() {
    return (
        <section className="maia-name" id="maia-name">
            <h2 data-reveal>Maia Sofía</h2>
            <div className="maia-name__invitation" data-reveal>
                <span>En compañía de</span>
                <strong>mi familia y seres queridos</strong>
                <p>Me encantaría que me acompañaras a celebrar este gran día…</p>
            </div>
        </section>
    )
}

function Family() {
    return (
        <section className="maia-family">
            <div className="maia-family__portrait">
                <img src={treePhoto} alt="Maia Sofía sentada entre las ramas de un árbol" loading="lazy" data-parallax />
                <p data-reveal>
                    Hoy celebro mis sueños,<br />
                    mi historia y la alegría<br />
                    <strong>de compartir este momento contigo.</strong>
                </p>
            </div>
            <div className="maia-family__panels">
                <article className="maia-family-card" data-reveal>
                    <span>Mis padres</span>
                    <p>Con la bendición de Dios y de</p>
                    <h3>Alberto Durán Valverde</h3>
                    <b>&</b>
                    <h3>Marisol Ávila Mercado</h3>
                    <Heart className="maia-family-card__heart" size={30} strokeWidth={1.15} />
                </article>
                <article className="maia-family-card maia-family-card--reverse" data-reveal>
                    <span>Mis padrinos</span>
                    <p>Y la compañía de</p>
                    <h3>César Iván Flores Trigos</h3>
                    <b>&</b>
                    <h3>Luisa Tristán Damián</h3>
                    <Heart className="maia-family-card__heart" size={30} strokeWidth={1.15} />
                </article>
            </div>
        </section>
    )
}

function DateAndCountdown() {
    const time = useCountdown()
    const units = [
        ['Días', time.days],
        ['Horas', time.hours],
        ['Min', time.minutes],
        ['Seg', time.seconds],
    ]

    const addToCalendar = () => {
        const url = new URL('https://calendar.google.com/calendar/render')
        url.searchParams.set('action', 'TEMPLATE')
        url.searchParams.set('text', 'XV años de Maia Sofía')
        url.searchParams.set('dates', '20260725T010000Z/20260725T070000Z')
        url.searchParams.set('details', 'Acompáñame a celebrar mis XV años.')
        url.searchParams.set('location', 'Capilla del Sagrado Corazón Los Fresnos, Aguascalientes')
        window.open(url.toString(), '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="maia-date">
            <div className="maia-date__paper">
                <p className="maia-date__month" data-reveal>Julio</p>
                <div className="maia-date__calendar" data-reveal>
                    <span>Viernes</span>
                    <strong>24</strong>
                    <span>2026</span>
                </div>
                <p className="maia-date__phrase" data-reveal>
                    “Los momentos compartidos con quienes amamos se vuelven recuerdos para siempre.”
                </p>
                <button className="maia-button maia-button--outline" type="button" onClick={addToCalendar}>
                    <CalendarPlus size={16} /> Agregar al calendario
                </button>
            </div>
            <div className="maia-date__count">
                <p>{time.arrived ? 'Hoy celebramos' : 'Faltan'}</p>
                {!time.arrived && (
                    <div className="maia-counter">
                        {units.map(([label, value]) => (
                            <div key={label}>
                                <strong>{String(value).padStart(2, '0')}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

function Locations() {
    return (
        <section className="maia-locations">
            <SectionTitle eyebrow="Celebremos juntos">
                Los lugares de<br /><em>mi gran día</em>
            </SectionTitle>
            <div className="maia-locations__list">
                {locations.map((location, index) => {
                    const Icon = location.icon
                    return (
                        <article key={location.kind} className="maia-location" data-reveal>
                            <div className="maia-location__image">
                                <img src={location.image} alt={location.name} loading="lazy" />
                            </div>
                            <div className="maia-location__copy">
                                <Icon size={22} strokeWidth={1.4} />
                                <p>{location.kind}</p>
                                <h3>{location.name}</h3>
                                <time><Clock3 size={14} /> {location.time}</time>
                                <address><MapPin size={14} /> {location.detail}</address>
                                <a href={location.maps} target="_blank" rel="noreferrer">
                                    Ver ubicación <Navigation size={15} />
                                </a>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

function DressCode() {
    return (
        <section className="maia-dress">
            <div className="maia-dress__image" />
            <div className="maia-dress__card" data-reveal>
                <p>Dress code</p>
                <div className="maia-dress__line" />
                <span>Por favor, evita</span>
                <div className="maia-dress__colors" aria-label="Colores reservados para la quinceañera">
                    <div><i className="is-white" /><b>Blanco</b></div>
                    <div><i className="is-blush" /><b>Rosa claro</b></div>
                    <div><i className="is-pink" /><b>Rosa intenso</b></div>
                </div>
                <small>Estos colores están reservados para la quinceañera.</small>
            </div>
        </section>
    )
}

function Gifts() {
    return (
        <section className="maia-gifts">
            <div className="maia-gifts__envelope" data-reveal>
                <div className="maia-gifts__flap" />
                <Gift size={25} strokeWidth={1.4} />
                <p>Mesa de regalos</p>
                <h2>Tu presencia<br />es mi mejor regalo</h2>
                <span>
                    Si deseas tener un detalle conmigo, puedes obsequiar una
                    <strong> tarjeta de regalo de tu preferencia</strong> o un sobre con dinero.
                </span>
            </div>
        </section>
    )
}

function RSVP() {
    const [name, setName] = useState('')
    const [guests, setGuests] = useState('1')

    const submit = (event) => {
        event.preventDefault()
        const message = `¡Hola! Soy ${name}. Confirmo mi asistencia a los XV años de Maia Sofía para ${guests} persona(s).`
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="maia-rsvp">
            <div className="maia-rsvp__content">
                <SectionTitle eyebrow="RSVP" light>
                    ¿Me acompañas<br /><em>a celebrar?</em>
                </SectionTitle>
                <p data-reveal>
                    Tu asistencia es muy importante para nosotros.<br />
                    Confirma por WhatsApp.
                </p>
                <form onSubmit={submit} data-reveal>
                    <label>
                        <span>Nombre completo</span>
                        <input
                            required
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Escribe tu nombre"
                        />
                    </label>
                    <label>
                        <span>Número de asistentes</span>
                        <select value={guests} onChange={(event) => setGuests(event.target.value)}>
                            {[1, 2, 3, 4, 5, 6].map((number) => (
                                <option key={number} value={number}>{number}</option>
                            ))}
                        </select>
                    </label>
                    <button className="maia-button maia-button--light" type="submit">
                        <MessageCircle size={17} /> Confirmar asistencia
                    </button>
                </form>
            </div>
        </section>
    )
}

export default function MaiaSofiaInvitation({ portfolioMode = false }) {
    const rootRef = useRef(null)

    useEffect(() => {
        const previousTitle = document.title
        document.title = 'Mis XV | Maia Sofía Durán Ávila'

        const description = 'Acompáñame a celebrar mis XV años el viernes 24 de julio de 2026.'
        const image = new URL(ogPreview, window.location.origin).href
        const upsertMeta = (property, content) => {
            let element = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`)
            if (!element) {
                element = document.createElement('meta')
                element.setAttribute(property.startsWith('og:') ? 'property' : 'name', property)
                document.head.appendChild(element)
            }
            element.setAttribute('content', content)
        }

        upsertMeta('description', description)
        upsertMeta('og:title', 'Mis XV | Maia Sofía')
        upsertMeta('og:description', description)
        upsertMeta('og:image', image)
        upsertMeta('og:type', 'website')

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let context

        if (reduceMotion) {
            rootRef.current?.querySelectorAll('[data-reveal]').forEach((element) => {
                element.style.opacity = '1'
                element.style.transform = 'none'
            })
        } else {
            context = gsap.context(() => {
                gsap.fromTo(
                    '.maia-hero__copy > *',
                    { autoAlpha: 0, y: 28 },
                    { autoAlpha: 1, y: 0, duration: 1.05, stagger: .14, ease: 'power3.out', delay: .2 },
                )

                gsap.fromTo(
                    '.maia-hero__photo',
                    { scale: 1.08 },
                    { scale: 1, duration: 2.2, ease: 'power2.out' },
                )

                gsap.utils.toArray('[data-reveal]').forEach((element) => {
                    gsap.fromTo(
                        element,
                        { autoAlpha: 0, y: 42 },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: element,
                                start: 'top 88%',
                                once: true,
                            },
                        },
                    )
                })

                gsap.utils.toArray('[data-parallax]').forEach((element) => {
                    gsap.fromTo(
                        element,
                        { yPercent: -4 },
                        {
                            yPercent: 4,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: element.parentElement,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: .8,
                            },
                        },
                    )
                })
            }, rootRef)
        }

        return () => {
            context?.revert()
            document.title = previousTitle
        }
    }, [])

    return (
        <main
            ref={rootRef}
            className="maia-invitation"
            data-portfolio={portfolioMode ? 'true' : 'false'}
            style={{
                '--maia-tree-photo': `url("${treePhoto}")`,
                '--maia-river-photo': `url("${riverPhoto}")`,
                '--maia-river-portrait': `url("${riverPortraitPhoto}")`,
                '--maia-dress-photo': `url("${dressPhoto}")`,
            }}
        >
            <MusicControl />
            <Hero />
            <NameReveal />
            <Family />
            <DateAndCountdown />
            <Locations />
            <DressCode />
            <Gifts />
            <RSVP />
            <footer className="maia-footer">
                <p>Con cariño</p>
                <h2>Maia Sofía</h2>
                <span>24 · JULIO · 2026</span>
                <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Hecho con Invita-Ya.com</a>
            </footer>
        </main>
    )
}
