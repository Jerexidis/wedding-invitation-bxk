import { useEffect, useRef, useState } from 'react'
import {
    CalendarPlus, Check, ChevronDown, Clock3, Gift,
    MapPin, Navigation, PartyPopper, Send, Sparkles,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './bluey-template.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * PLANTILLA BLUEY – FIESTA DE CUMPLEAÑOS INFANTIL
 * Duplica la carpeta, cambia el slug y edita solamente este objeto.
 */
const BLUEY_CONFIG = {
    slug: 'plantilla-bluey-fiesta',
    name: 'Mía',
    age: '4',
    eventLabel: 'Mi cumple',
    title: '¡Fiesta de Cumple!',
    date: '2027-08-15T16:00:00-06:00',
    dateLabel: '15 · AGOSTO · 2027',
    shortDate: '15 de agosto de 2027',
    timeLabel: '4:00 pm',
    quote: 'Es hora de jugar, ¡como Bluey y Bingo!',
    parents: ['Mariana López', 'Daniel Torres'],
    location: {
        name: 'Salón Aventura Kids',
        address: 'Av. de la Diversión 320, Aguascalientes',
        time: '4:00 pm',
        maps: 'https://maps.google.com',
    },
    whatsapp: '5210000000000',
}

const pad = (value) => String(value).padStart(2, '0')

const PAW_EMOJI = '🐾'

function PawMark() {
    return <span className="bluey-paw-mark" aria-hidden="true">{PAW_EMOJI}</span>
}

function SectionHeading({ kicker, children, light = false }) {
    return (
        <div className={`bluey-heading ${light ? 'bluey-heading--light' : ''}`}>
            <p><Sparkles size={14} /> {kicker}</p>
            <h2>{children}</h2>
            <span className="bluey-heading__rule"><i /><PawMark /><i /></span>
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
        <header className="bluey-hero">
            <div className="bluey-hero__art" data-hero-art />
            <div className="bluey-hero__veil" />

            {/* Floating paw prints */}
            <div className="bluey-paws" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => (
                    <span key={index} style={{ '--i': index }}>{PAW_EMOJI}</span>
                ))}
            </div>

            <div className="bluey-hero__content">
                <p className="bluey-hero__eyebrow" data-hero-copy>{config.eventLabel}</p>

                <div className="bluey-hero__age-wrap" data-hero-copy>
                    <span className="bluey-hero__age">{config.age}</span>
                </div>

                <h1 data-hero-copy>{config.name}</h1>

                <p className="bluey-hero__date" data-hero-copy>{config.dateLabel}</p>
                <p className="bluey-hero__quote" data-hero-copy>"{config.quote}"</p>
            </div>

            <button
                className="bluey-scroll"
                type="button"
                onClick={() => document.querySelector('#bluey-intro')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Ver la invitación"
            >
                Descubre más <ChevronDown size={16} />
            </button>
        </header>
    )
}

function Intro({ config }) {
    return (
        <section className="bluey-section bluey-intro" id="bluey-intro" data-bluey-section>
            <span className="bluey-float-paw bluey-float-paw--left" aria-hidden="true">{PAW_EMOJI}</span>
            <div className="bluey-container">
                <SectionHeading kicker="Con mucha alegría">
                    ¡Estás <em>invitado!</em>
                </SectionHeading>

                <p className="bluey-intro__copy">
                    Queremos celebrar junto a ti un día muy especial.
                    ¡Habrá juegos, pastel, sorpresas y mucha diversión!
                </p>

                <img
                    className="bluey-intro__family-img"
                    src="/invitations/plantilla-bluey-fiesta/img/bluey-family.png"
                    alt="Familia Bluey celebrando"
                    loading="lazy"
                />

                <article className="bluey-name-card" data-card>
                    <PawMark />
                    <span>Te invitan a festejar</span>
                    <h3>{config.parents[0]}</h3>
                    <i>&</i>
                    <h3>{config.parents[1]}</h3>
                    <p>Celebremos juntos el cumpleaños de {config.name}.</p>
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
        url.searchParams.set('text', `Cumpleaños de ${config.name}`)
        url.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`)
        url.searchParams.set('details', config.quote)
        url.searchParams.set('location', `${config.location.name}, ${config.location.address}`)
        window.open(url.toString(), '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="bluey-section bluey-countdown" data-bluey-section>
            {/* Decorative clouds */}
            <div className="bluey-countdown__clouds" aria-hidden="true">
                <i /><i /><i />
            </div>
            <div className="bluey-container">
                <SectionHeading kicker="La fiesta comienza en" light>
                    {time.arrived ? '¡Es hoy!' : 'Falta poquito'}
                </SectionHeading>
                {!time.arrived && (
                    <div className="bluey-timer" data-card>
                        {values.map(([label, value]) => (
                            <div className="bluey-timer__unit" key={label}>
                                <strong>{label === 'Días' ? value : pad(value)}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="bluey-countdown__date">{config.shortDate} · {config.timeLabel}</p>
                <button className="bluey-button bluey-button--yellow" type="button" onClick={addToCalendar}>
                    <CalendarPlus size={17} /> Agregar al calendario
                </button>
            </div>
        </section>
    )
}

function Location({ config }) {
    return (
        <section className="bluey-section bluey-location" data-bluey-section>
            <span className="bluey-sticker" data-drift>¡No<br />faltes!</span>
            <div className="bluey-container">
                <SectionHeading kicker="Dónde y cuándo">
                    ¡Nos vemos <em>aquí!</em>
                </SectionHeading>

                <article className="bluey-location__card" data-card>
                    <div className="bluey-location__image">
                        <div className="bluey-location__pin">
                            <MapPin size={22} />
                        </div>
                    </div>
                    <div className="bluey-location__body">
                        <p className="bluey-location__label">Lugar de la fiesta</p>
                        <h3>{config.location.name}</h3>
                        <p className="bluey-location__time">
                            <Clock3 size={15} /> {config.location.time}
                        </p>
                        <p>{config.location.address}</p>
                        <a href={config.location.maps} target="_blank" rel="noreferrer">
                            <Navigation size={15} /> Cómo llegar
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
            ? `¡Hola! Soy ${form.name}. Confirmo mi asistencia a la fiesta de ${config.name}. 🎉🐾`
            : `¡Hola! Soy ${form.name}. No podré asistir a la fiesta de ${config.name}, ¡pero le mando un abrazo enorme! 💙`
        window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="bluey-section bluey-rsvp" data-bluey-section>
            {/* Twinkling stars */}
            <div className="bluey-rsvp__stars" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => <i key={index} style={{ '--i': index }} />)}
            </div>

            <div className="bluey-container">
                <SectionHeading kicker="¡Te esperamos!" light>
                    ¿Vienes a <em>jugar?</em>
                </SectionHeading>
                <p className="bluey-rsvp__intro">
                    Confirma tu asistencia por WhatsApp. ¡Prometemos juegos, pastel y mucha diversión!
                </p>

                <form className="bluey-form" onSubmit={submit} data-card>
                    <label>
                        <span>Tu nombre</span>
                        <input
                            required
                            value={form.name}
                            placeholder="Escribe tu nombre"
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                        />
                    </label>

                    <fieldset>
                        <legend>¿Nos acompañas?</legend>
                        <div className="bluey-options">
                            {['sí', 'no'].map((option) => (
                                <label key={option} className={form.attendance === option ? 'is-selected' : ''}>
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value={option}
                                        checked={form.attendance === option}
                                        onChange={() => setForm({ ...form, attendance: option })}
                                    />
                                    {option === 'sí' ? '¡Claro que sí! 🎉' : 'No podré ir 😢'}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <button className="bluey-button bluey-button--orange" type="submit">
                        {demoSent
                            ? <><Check size={17} /> Demo lista</>
                            : <><Send size={17} /> Confirmar por WhatsApp</>}
                    </button>
                    {demoSent && <p className="bluey-form__hint">Cambia el número de WhatsApp en BLUEY_CONFIG para activar el envío.</p>}
                </form>

                <p className="bluey-rsvp__signoff"><PartyPopper size={16} /> ¡Será una aventura increíble! <PartyPopper size={16} /></p>
            </div>
        </section>
    )
}

function Footer({ config }) {
    return (
        <footer className="bluey-footer">
            <PawMark />
            <p>Gracias por ser parte de<br /><em>esta aventura</em></p>
            <h2>{config.name} · {config.age} años</h2>
            <span>{config.dateLabel}</span>
            <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Creado con Invita-Ya.com</a>
        </footer>
    )
}

export default function BlueyPartyTemplate() {
    const rootRef = useRef(null)

    useEffect(() => {
        /* ── Google Fonts ── */
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap'
        document.head.appendChild(fontLink)
        document.title = `${BLUEY_CONFIG.eventLabel} · ${BLUEY_CONFIG.name}`

        /* ── GSAP animations ── */
        const media = gsap.matchMedia()
        const context = gsap.context(() => {
            media.add('(prefers-reduced-motion: no-preference)', () => {
                /* Hero entrance */
                gsap.timeline({ defaults: { ease: 'back.out(1.4)' } })
                    .from('[data-hero-copy]', {
                        opacity: 0,
                        y: 40,
                        scale: .9,
                        duration: .9,
                        stagger: .12,
                    })
                    .from('.bluey-scroll', { opacity: 0, y: -10, duration: .6 }, '-=.3')

                /* Hero parallax */
                gsap.to('[data-hero-art]', {
                    yPercent: 12,
                    scale: 1.08,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.bluey-hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1,
                    },
                })

                /* Section scroll-reveal */
                gsap.utils.toArray('[data-bluey-section]').forEach((section) => {
                    const elements = section.querySelectorAll(
                        '.bluey-heading > *, [data-card], .bluey-intro__copy, .bluey-intro__family-img, ' +
                        '.bluey-countdown__date, .bluey-button, .bluey-rsvp__intro, .bluey-rsvp__signoff'
                    )
                    gsap.from(elements, {
                        opacity: 0,
                        y: 50,
                        duration: .85,
                        stagger: .1,
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
                        y: index % 2 ? -50 : 50,
                        rotation: index % 2 ? 14 : -10,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: element.closest('section'),
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                        },
                    })
                })

                /* Timer units bounce-in */
                gsap.from('.bluey-timer__unit', {
                    scale: .6,
                    opacity: 0,
                    duration: .6,
                    stagger: .08,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: '.bluey-countdown',
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
        <main className="bluey-template" ref={rootRef}>
            <Hero config={BLUEY_CONFIG} />
            <Intro config={BLUEY_CONFIG} />
            <Countdown config={BLUEY_CONFIG} />
            <Location config={BLUEY_CONFIG} />
            <RSVP config={BLUEY_CONFIG} />
            <Footer config={BLUEY_CONFIG} />
        </main>
    )
}
