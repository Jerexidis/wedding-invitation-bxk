import { useEffect, useRef, useState } from 'react'
import {
    CalendarDays,
    ChevronDown,
    Church,
    Clock3,
    Heart,
    Music2,
    Navigation,
    Pause,
    Sparkles,
    UtensilsCrossed,
} from 'lucide-react'
import './invitation.css'

const SLUG = 'vero-y-juan'
const BASE = `/invitations/${SLUG}`
const EVENT_DATE = '2026-12-26T15:00:00-06:00'
const AUDIO = `${BASE}/audio/eres-toda-una-mujer-bxs.mp3`

const photos = Array.from({ length: 6 }, (_, index) => `${BASE}/img/photo-${index + 1}.webp`)

const events = [
    {
        type: 'Ceremonia',
        name: 'Parroquia del Divino Salvador',
        address: 'Niños Héroes #120, Col. Trojes de Alonso',
        time: '3:00 pm',
        maps: 'https://www.google.com/maps/search/?api=1&query=Parroquia%20del%20Divino%20Salvador%2C%20Ni%C3%B1os%20H%C3%A9roes%20120%2C%20Trojes%20de%20Alonso%2C%20Aguascalientes',
        icon: Church,
        photo: `${BASE}/img/venue-church.webp`,
        photoAlt: 'Fachada de la Parroquia del Divino Salvador',
    },
    {
        type: 'Recepción',
        name: 'Recepción en casa',
        address: 'Calle Venustiano Carranza #210',
        time: '4:00 pm a 7:00 pm',
        maps: 'https://maps.app.goo.gl/cNu8PuXcRBHyEKe48',
        icon: UtensilsCrossed,
        photo: `${BASE}/img/venue-reception.webp`,
        photoAlt: 'Casa donde se realizará la recepción',
    },
]

const calculateTime = () => {
    const distance = new Date(EVENT_DATE).getTime() - Date.now()
    if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance / 3600000) % 24),
        minutes: Math.floor((distance / 60000) % 60),
        seconds: Math.floor((distance / 1000) % 60),
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
        <header className={`ays-heading${light ? ' ays-heading--light' : ''}`} data-reveal>
            <span>{eyebrow}</span>
            <h2>{children}</h2>
            <i aria-hidden="true" />
        </header>
    )
}

function MusicControl({ active }) {
    const audioRef = useRef(null)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        if (!active || !audioRef.current) return
        audioRef.current.play().catch(() => setPlaying(false))
    }, [active])

    const toggle = async () => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) {
            await audio.play().catch(() => setPlaying(false))
        } else {
            audio.pause()
        }
    }

    return (
        <>
            <audio ref={audioRef} src={AUDIO} preload="metadata" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
            {active && (
                <button className={`ays-music${playing ? ' is-playing' : ''}`} type="button" onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>
                    {playing ? <Pause size={16} /> : <Music2 size={16} />}
                    <span>{playing ? 'Pausar' : 'Música'}</span>
                </button>
            )}
        </>
    )
}

function Opening({ onOpen }) {
    return (
        <div className="ays-opening">
            <img src={photos[0]} alt="Vero y Juan el día de su boda" />
            <div className="ays-opening__veil" />
            <div className="ays-opening__content">
                <p>Celebramos 25 años</p>
                <h1><span>Vero</span><b>&</b><span>Juan</span></h1>
                <time>26 · 12 · 2026</time>
                <button type="button" onClick={onOpen}>
                    <Heart size={17} fill="currentColor" />
                    Abrir invitación
                </button>
            </div>
        </div>
    )
}

function Hero() {
    return (
        <header className="ays-hero">
            <img src={photos[1]} alt="Vero y Juan celebrando juntos" className="ays-hero__photo" />
            <div className="ays-hero__overlay" />
            <div className="ays-hero__copy" data-reveal>
                <p>Bodas de Plata</p>
                <h1>Vero <i>&</i> Juan</h1>
                <time>26 · 12 · 2026</time>
            </div>
            <button type="button" className="ays-scroll" onClick={() => document.querySelector('#historia')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Descubre nuestra historia</span>
                <ChevronDown size={18} />
            </button>
        </header>
    )
}

function Quote() {
    return (
        <section className="ays-quote" id="historia">
            <Heart size={24} strokeWidth={1.1} data-reveal />
            <h2 data-reveal>Vero <i>&</i> Juan</h2>
            <blockquote data-reveal>
                “Han sido 25 años de risas, aprendizajes y de construir un hogar maravilloso juntos. Volvería a decir que sí un millón de veces más.”
            </blockquote>
            <p data-reveal>Queremos renovar nuestros votos…<br /><strong>¡Y compartir este día especial contigo!</strong></p>
        </section>
    )
}

function SaveTheDate() {
    return (
        <section className="ays-save-date">
            <div className="ays-save-date__photo" data-reveal>
                <img src={photos[2]} alt="Vero y Juan a través de los años" loading="lazy" />
            </div>
            <div className="ays-save-date__card" data-reveal>
                <p>Una fecha para celebrar</p>
                <strong>26 · 12 · 26</strong>
                <span>Sábado</span>
                <CalendarDays size={28} strokeWidth={1.2} />
                <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Bodas%20de%20Plata%20de%20Vero%20y%20Juan&dates=20261226T210000Z%2F20261227T010000Z&details=Acomp%C3%A1%C3%B1anos%20a%20celebrar%2025%20a%C3%B1os%20de%20amor.&location=Parroquia%20del%20Divino%20Salvador%2C%20Ni%C3%B1os%20H%C3%A9roes%20120%2C%20Trojes%20de%20Alonso%2C%20Aguascalientes"
                    target="_blank"
                    rel="noreferrer"
                >
                    Agregar al calendario
                </a>
            </div>
        </section>
    )
}

function Welcome() {
    return (
        <section className="ays-welcome">
            <Sparkles size={28} strokeWidth={1.1} data-reveal />
            <p data-reveal>Bienvenidos a este día tan especial.</p>
            <blockquote data-reveal>
                Veinticinco años después, seguimos comprobando que el amor verdadero se construye paso a paso, y hoy nos alegra compartirlo con ustedes.
            </blockquote>
        </section>
    )
}

function Countdown() {
    const time = useCountdown()
    return (
        <section className="ays-countdown">
            <p data-reveal>Prepárate para el gran día</p>
            <h2 data-reveal>Solo faltan</h2>
            <div className="ays-countdown__grid" data-reveal>
                {[
                    ['Días', time.days],
                    ['Horas', time.hours],
                    ['Minutos', time.minutes],
                    ['Segundos', time.seconds],
                ].map(([label, value]) => (
                    <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>
                ))}
            </div>
            <blockquote data-reveal>“25 años caminando juntos, con amor y con Dios como guía.”</blockquote>
        </section>
    )
}

function Padrinos() {
    return (
        <section className="ays-family">
            <SectionTitle eyebrow="Con la bendición de Dios y de">Nuestros padrinos</SectionTitle>
            <div className="ays-padrinos" data-reveal>
                <span>Padrinos de velación</span>
                <h3>Miguel Muñoz <b>&</b> Cuca de Santiago</h3>
            </div>
        </section>
    )
}

function Events() {
    return (
        <section className="ays-events">
            <SectionTitle eyebrow="Acompáñanos">Dónde & cuándo</SectionTitle>
            <div className="ays-events__grid">
                {events.map((event) => {
                    const Icon = event.icon
                    return (
                        <article className="ays-event" key={event.type} data-reveal>
                            <div className={`ays-event__photo${event.pending ? ' ays-event__photo--pending' : ''}`}>
                                {event.photo ? (
                                    <img src={event.photo} alt={event.photoAlt} loading="lazy" />
                                ) : (
                                    <div className="ays-event__placeholder">
                                        <Sparkles size={34} strokeWidth={1.1} />
                                        <span>Ubicación pendiente</span>
                                    </div>
                                )}
                            </div>
                            <div className="ays-event__body">
                                <Icon size={30} strokeWidth={1.15} />
                                <p>{event.type}</p>
                                <h3>{event.name}</h3>
                                <time><Clock3 size={15} /> {event.time}</time>
                                <address>{event.address}</address>
                                {event.maps ? (
                                    <a href={event.maps} target="_blank" rel="noreferrer"><Navigation size={16} /> Ir a ubicación</a>
                                ) : (
                                    <span className="ays-event__pending">Próximamente</span>
                                )}
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

function Gallery({ hidden }) {
    if (hidden) return null
    const layout = [photos[0], photos[1], photos[2], photos[3], photos[4], photos[5]]
    return (
        <section className="ays-gallery">
            <SectionTitle eyebrow="Nuestra historia">Momentos para siempre</SectionTitle>
            <div className="ays-gallery__grid">
                {layout.map((photo, index) => <img key={photo} src={photo} alt={`Recuerdo de Vero y Juan ${index + 1}`} loading="lazy" data-reveal />)}
            </div>
        </section>
    )
}

export default function VeroYJuan({ hideGallery = false }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const previous = document.title
        document.title = 'Bodas de Plata | Vero y Juan'
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap'
        document.head.appendChild(link)
        return () => { document.title = previous; link.remove() }
    }, [])

    useEffect(() => {
        if (!open) return
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible')
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.12 })
        document.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node))
        return () => observer.disconnect()
    }, [open])

    return (
        <div className="ays-invitation">
            <MusicControl active={open} />
            {!open ? <Opening onOpen={() => setOpen(true)} /> : (
                <main>
                    <Hero />
                    <Quote />
                    <SaveTheDate />
                    <Welcome />
                    <Countdown />
                    <Padrinos />
                    <Events />
                    <Gallery hidden={hideGallery} />
                    <footer className="ays-footer">
                        <Heart size={22} fill="currentColor" />
                        <h2>Vero <i>&</i> Juan</h2>
                        <p>Gracias por acompañarnos a celebrar 25 años de amor.</p>
                        <time>26 · 12 · 2026</time>
                    </footer>
                </main>
            )}
        </div>
    )
}
