import { useEffect, useRef, useState } from 'react'
import {
    CalendarPlus, Check, ChevronDown, Clock3,
    MapPin, Navigation, Send, Sparkles, Swords, Trophy,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './minecraft-template.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * PLANTILLA MINECRAFT – FIESTA DE CUMPLEAÑOS
 * Duplica la carpeta, cambia el slug y edita solamente este objeto.
 */
const MC_CONFIG = {
    slug: 'plantilla-minecraft-fiesta',
    name: 'Mateo',
    age: '9',
    eventLabel: 'Mi cumple',
    title: '¡Fiesta Minecraft!',
    date: '2027-09-20T15:00:00-06:00',
    dateLabel: '20 · SEPTIEMBRE · 2027',
    shortDate: '20 de septiembre de 2027',
    timeLabel: '3:00 pm',
    quote: 'Es hora de craftear la mejor fiesta de todas. ¡No te la pierdas!',
    parents: ['Carolina Ramírez', 'Eduardo Navarro'],
    location: {
        name: 'Salón Game Zone',
        address: 'Blvd. de las Aventuras 512, Aguascalientes',
        time: '3:00 pm',
        maps: 'https://maps.google.com',
    },
    whatsapp: '5210000000000',
}

const pad = (value) => String(value).padStart(2, '0')

function BlockIcon() {
    return <span className="mc-block-icon" aria-hidden="true">⛏️</span>
}

function SectionHeading({ kicker, children, light = false }) {
    return (
        <div className={`mc-heading ${light ? 'mc-heading--light' : ''}`}>
            <p><Sparkles size={14} /> {kicker}</p>
            <h2>{children}</h2>
            <span className="mc-heading__rule"><i /><BlockIcon /><i /></span>
        </div>
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
        <header className="mc-hero">
            <div className="mc-hero__art" data-hero-art />
            <div className="mc-hero__veil" />

            {/* Pixel particles */}
            <div className="mc-particles" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => (
                    <span key={index} style={{ '--i': index }} />
                ))}
            </div>

            <div className="mc-hero__content">
                <p className="mc-hero__eyebrow" data-hero-copy>{config.eventLabel}</p>

                <div className="mc-hero__age-wrap" data-hero-copy>
                    <span className="mc-hero__age">{config.age}</span>
                </div>

                <h1 data-hero-copy>{config.name}</h1>

                <p className="mc-hero__date" data-hero-copy>{config.dateLabel}</p>
                <p className="mc-hero__quote" data-hero-copy>"{config.quote}"</p>
            </div>

            <button
                className="mc-scroll"
                type="button"
                onClick={() => document.querySelector('#mc-intro')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Ver la invitación"
            >
                Explorar <ChevronDown size={16} />
            </button>
        </header>
    )
}

function Intro({ config }) {
    return (
        <section className="mc-section mc-intro" id="mc-intro" data-mc-section>
            <div className="mc-container">
                <SectionHeading kicker="¡Nueva aventura!">
                    Estás <em>invitado</em>
                </SectionHeading>

                <p className="mc-intro__copy">
                    Prepara tu inventario y únete a la aventura más épica del año.
                    ¡Habrá juegos, pastel, sorpresas y mucho más!
                </p>

                <img
                    className="mc-intro__decor-img"
                    src="/invitations/plantilla-minecraft-fiesta/img/sword-shield.png"
                    alt="Espada y escudo de diamante"
                    loading="lazy"
                />

                <article className="mc-name-card" data-card>
                    <BlockIcon />
                    <span>Te invitan a la misión</span>
                    <h3>{config.parents[0]}</h3>
                    <i>&</i>
                    <h3>{config.parents[1]}</h3>
                    <p>Acompáñanos a celebrar el cumpleaños de {config.name}.</p>
                </article>
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
        const end = new Date(start.getTime() + 4 * 60 * 60 * 1000)
        const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
        const url = new URL('https://calendar.google.com/calendar/render')
        url.searchParams.set('action', 'TEMPLATE')
        url.searchParams.set('text', `Cumpleaños de ${config.name} 🎮`)
        url.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`)
        url.searchParams.set('details', config.quote)
        url.searchParams.set('location', `${config.location.name}, ${config.location.address}`)
        window.open(url.toString(), '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="mc-section mc-countdown" data-mc-section>
            <div className="mc-container">
                <SectionHeading kicker="Cuenta regresiva" light>
                    {time.arrived ? '¡Es hoy!' : 'Spawneo en...'}
                </SectionHeading>
                {!time.arrived && (
                    <div className="mc-timer" data-card>
                        {values.map(([label, value]) => (
                            <div className="mc-timer__unit" key={label}>
                                <strong>{label === 'Días' ? value : pad(value)}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="mc-countdown__date">{config.shortDate} · {config.timeLabel}</p>
                <button className="mc-button mc-button--gold" type="button" onClick={addToCalendar}>
                    <CalendarPlus size={16} /> Agregar al calendario
                </button>
            </div>
        </section>
    )
}

function Location({ config }) {
    return (
        <section className="mc-section mc-location" data-mc-section>
            <span className="mc-sticker" data-drift>¡No<br />faltes!</span>
            <div className="mc-container">
                <SectionHeading kicker="Coordenadas del evento">
                    Punto de <em>spawn</em>
                </SectionHeading>

                <article className="mc-location__card" data-card>
                    <div className="mc-location__image">
                        <div className="mc-location__pin">
                            <MapPin size={20} />
                        </div>
                    </div>
                    <div className="mc-location__body">
                        <p className="mc-location__label">Lugar de la fiesta</p>
                        <h3>{config.location.name}</h3>
                        <p className="mc-location__time">
                            <Clock3 size={15} /> {config.location.time}
                        </p>
                        <p>{config.location.address}</p>
                        <a href={config.location.maps} target="_blank" rel="noreferrer">
                            <Navigation size={14} /> Ver en mapa
                        </a>
                    </div>
                </article>
            </div>
        </section>
    )
}

function RSVP({ config }) {
    const [form, setForm] = useState({ name: '', attendance: 'sí' })
    const [demoSent, setDemoSent] = useState(false)

    const submit = (event) => {
        event.preventDefault()
        if (config.whatsapp === '5210000000000') {
            setDemoSent(true)
            return
        }
        const message = form.attendance === 'sí'
            ? `¡Hola! Soy ${form.name}. Confirmo mi asistencia a la fiesta Minecraft de ${config.name}. ⛏️🎮`
            : `¡Hola! Soy ${form.name}. No podré asistir a la fiesta de ${config.name}, ¡pero le mando un abrazo! 💚`
        window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="mc-section mc-rsvp" data-mc-section>
            {/* Night sky pixel stars */}
            <div className="mc-rsvp__stars" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => <i key={index} style={{ '--i': index }} />)}
            </div>

            <div className="mc-container">
                <SectionHeading kicker="Acepta la misión" light>
                    ¿Te <em>unes?</em>
                </SectionHeading>
                <p className="mc-rsvp__intro">
                    Confirma tu asistencia por WhatsApp. Prepara tu skin y tu inventario, ¡la aventura nos espera!
                </p>

                <form className="mc-form" onSubmit={submit} data-card>
                    <label>
                        <span>Tu nombre</span>
                        <input
                            required
                            value={form.name}
                            placeholder="Escribe tu gamertag"
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                        />
                    </label>

                    <fieldset>
                        <legend>¿Aceptas la misión?</legend>
                        <div className="mc-options">
                            {['sí', 'no'].map((option) => (
                                <label key={option} className={form.attendance === option ? 'is-selected' : ''}>
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value={option}
                                        checked={form.attendance === option}
                                        onChange={() => setForm({ ...form, attendance: option })}
                                    />
                                    {option === 'sí' ? '¡Acepto! ⚔️' : 'No podré 😢'}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <button className="mc-button mc-button--diamond" type="submit">
                        {demoSent
                            ? <><Check size={16} /> Misión aceptada</>
                            : <><Send size={16} /> Confirmar por WhatsApp</>}
                    </button>
                    {demoSent && <p className="mc-form__hint">Cambia el número de WhatsApp en MC_CONFIG para activar el envío.</p>}
                </form>

                <p className="mc-rsvp__signoff"><Swords size={14} /> ¡Que comience la aventura! <Trophy size={14} /></p>
            </div>
        </section>
    )
}

function Footer({ config }) {
    return (
        <footer className="mc-footer">
            <BlockIcon />
            <p>Gracias por ser parte de<br /><em>esta aventura</em></p>
            <h2>{config.name} · {config.age} años</h2>
            <span>{config.dateLabel}</span>
            <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Creado con Invita-Ya.com</a>
        </footer>
    )
}

export default function MinecraftPartyTemplate() {
    const rootRef = useRef(null)

    useEffect(() => {
        /* ── Google Fonts ── */
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap'
        document.head.appendChild(fontLink)
        document.title = `${MC_CONFIG.eventLabel} · ${MC_CONFIG.name}`

        /* ── GSAP animations ── */
        const media = gsap.matchMedia()
        const context = gsap.context(() => {
            media.add('(prefers-reduced-motion: no-preference)', () => {
                /* Hero entrance — pixel pop-in */
                gsap.timeline({ defaults: { ease: 'steps(6)' } })
                    .from('[data-hero-copy]', {
                        opacity: 0,
                        y: 30,
                        scale: .85,
                        duration: .7,
                        stagger: .12,
                    })
                    .from('.mc-scroll', { opacity: 0, y: -8, duration: .5, ease: 'power2.out' }, '-=.25')

                /* Hero parallax */
                gsap.to('[data-hero-art]', {
                    yPercent: 12,
                    scale: 1.08,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.mc-hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1,
                    },
                })

                /* Section scroll-reveal */
                gsap.utils.toArray('[data-mc-section]').forEach((section) => {
                    const elements = section.querySelectorAll(
                        '.mc-heading > *, [data-card], .mc-intro__copy, .mc-intro__decor-img, ' +
                        '.mc-countdown__date, .mc-button, .mc-rsvp__intro, .mc-rsvp__signoff'
                    )
                    gsap.from(elements, {
                        opacity: 0,
                        y: 45,
                        duration: .75,
                        stagger: .09,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 78%',
                            toggleActions: 'play none none reverse',
                        },
                    })
                })

                /* Drift elements */
                gsap.utils.toArray('[data-drift]').forEach((element, index) => {
                    gsap.to(element, {
                        y: index % 2 ? -45 : 45,
                        rotation: index % 2 ? 12 : -8,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: element.closest('section'),
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                        },
                    })
                })

                /* Timer blocks pop-in */
                gsap.from('.mc-timer__unit', {
                    scaleY: 0,
                    opacity: 0,
                    duration: .5,
                    stagger: .07,
                    ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: '.mc-countdown',
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
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
        <main className="mc-template" ref={rootRef}>
            <Hero config={MC_CONFIG} />
            <Intro config={MC_CONFIG} />
            <Countdown config={MC_CONFIG} />
            <Location config={MC_CONFIG} />
            <RSVP config={MC_CONFIG} />
            <Footer config={MC_CONFIG} />
        </main>
    )
}
