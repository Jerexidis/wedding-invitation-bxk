import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Check, MapPin, MessageCircle, Navigation, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './party-template.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * EDITA SOLO ESTE OBJETO PARA CREAR UNA NUEVA INVITACIÓN.
 * heroPhoto acepta una ruta dentro de /public, por ejemplo:
 * "/invitations/mi-fiesta/img/foto.png". Déjalo vacío para usar el número.
 */
const PARTY_CONFIG = {
    eyebrow: 'SAVE THE DATE',
    name: 'Ana',
    age: '21',
    title: 'Birthday Party',
    date: '2026-12-13T21:00:00-06:00',
    dateLabel: '13 de diciembre',
    timeLabel: '9:00 pm',
    note: 'Brillos, risas y cero ganas de irnos temprano.',
    heroPhoto: '',
    location: {
        name: 'Casa Cabral',
        address: 'Av. de los Sueños 214, Aguascalientes, Ags.',
        mapsUrl: 'https://maps.google.com',
    },
    whatsapp: '5210000000000',
}

const pad = (value) => String(value).padStart(2, '0')

function useCountdown(targetDate) {
    const calculate = () => {
        const distance = new Date(targetDate).getTime() - Date.now()
        if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true }
        return {
            days: Math.floor(distance / 86400000),
            hours: Math.floor((distance / 3600000) % 24),
            minutes: Math.floor((distance / 60000) % 60),
            seconds: Math.floor((distance / 1000) % 60),
            arrived: false,
        }
    }

    const [time, setTime] = useState(calculate)

    useEffect(() => {
        const timer = window.setInterval(() => setTime(calculate()), 1000)
        return () => window.clearInterval(timer)
    }, [targetDate])

    return time
}

function CollageTitle({ text }) {
    return (
        <div className="party-cutout-title" aria-label={text}>
            {text.split('').map((letter, index) => (
                <span
                    key={`${letter}-${index}`}
                    aria-hidden="true"
                    style={{ '--i': index }}
                    className={letter === ' ' ? 'is-space' : ''}
                >
                    {letter}
                </span>
            ))}
        </div>
    )
}

function Hero({ config }) {
    const scrollToDetails = () => document.querySelector('#party-countdown')?.scrollIntoView()

    return (
        <header className="party-hero">
            <div className="party-hero__paper" data-parallax="0.08" />
            <div className="party-grain" />
            <span className="party-tape party-tape--one" data-float />
            <span className="party-tape party-tape--two" data-float />

            <div className="party-hero__content">
                <p className="party-eyebrow" data-hero-item>{config.eyebrow}</p>
                <div className="party-portrait-wrap" data-hero-item>
                    {config.heroPhoto ? (
                        <img className="party-portrait" src={config.heroPhoto} alt={`Retrato de ${config.name}`} />
                    ) : (
                        <div className="party-age" aria-label={`${config.age} años`}>
                            <span>{config.age}</span>
                        </div>
                    )}
                    <span className="party-spark party-spark--one">✦</span>
                    <span className="party-spark party-spark--two">✦</span>
                </div>

                <p className="party-name" data-hero-item>{config.name}</p>
                <CollageTitle text={config.title} />
                <p className="party-hero__date" data-hero-item>
                    <strong>{config.dateLabel}</strong>
                    <span aria-hidden="true">•</span>
                    {config.timeLabel}
                </p>
                <p className="party-hero__note" data-hero-item>{config.note}</p>
            </div>

            <button className="party-scroll-cue" type="button" onClick={scrollToDetails} aria-label="Ver los detalles">
                <span>Desliza</span>
                <i />
            </button>
        </header>
    )
}

function Countdown({ config }) {
    const time = useCountdown(config.date)
    const units = [
        ['Días', time.days],
        ['Horas', time.hours],
        ['Min', time.minutes],
        ['Seg', time.seconds],
    ]

    return (
        <section className="party-section party-countdown" id="party-countdown" data-section>
            <span className="party-sticker party-sticker--pink" data-drift>falta<br />poquito</span>
            <div className="party-section__inner">
                <p className="party-kicker"><Sparkles size={15} /> Cuenta regresiva</p>
                <h2>{time.arrived ? '¡La fiesta es hoy!' : 'Nos vemos en…'}</h2>
                {!time.arrived && (
                    <div className="party-timer" aria-label="Cuenta regresiva">
                        {units.map(([label, value]) => (
                            <div className="party-timer__unit" key={label}>
                                <strong>{label === 'Días' ? value : pad(value)}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="party-date-lockup">
                    <CalendarDays size={19} />
                    {config.dateLabel} · {config.timeLabel}
                </p>
            </div>
        </section>
    )
}

function Location({ config }) {
    return (
        <section className="party-section party-location" data-section>
            <span className="party-location__star" data-drift>★</span>
            <div className="party-section__inner">
                <p className="party-kicker"><MapPin size={15} /> Una sola parada</p>
                <h2>Aquí es<br /><em>la fiesta</em></h2>

                <article className="party-location__card">
                    <div className="party-pin"><Navigation size={25} /></div>
                    <p className="party-location__label">Lugar</p>
                    <h3>{config.location.name}</h3>
                    <p>{config.location.address}</p>
                    <a href={config.location.mapsUrl} target="_blank" rel="noreferrer">
                        Abrir en Maps <span>↗</span>
                    </a>
                </article>
            </div>
        </section>
    )
}

function RSVP({ config }) {
    const [name, setName] = useState('')
    const [attendance, setAttendance] = useState('sí')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        setSubmitted(true)

        if (config.whatsapp === '5210000000000') return

        const message = attendance === 'sí'
            ? `¡Hola! Soy ${name}. Confirmo que sí asistiré a la fiesta de ${config.name} ✨`
            : `¡Hola! Soy ${name}. Esta vez no podré acompañar a ${config.name}, pero le mando un abrazo enorme 💗`
        window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="party-section party-rsvp" data-section>
            <div className="party-rsvp__ball" data-drift />
            <div className="party-section__inner">
                <p className="party-kicker"><MessageCircle size={15} /> RSVP</p>
                <h2>¿Vienes a<br /><em>celebrar?</em></h2>
                <p className="party-rsvp__intro">Confírmanos antes del 1 de diciembre. Prometemos buena música y mejor pastel.</p>

                <form className="party-form" onSubmit={handleSubmit}>
                    <label>
                        <span>Tu nombre</span>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Escribe aquí"
                            required
                        />
                    </label>

                    <fieldset>
                        <legend>¿Nos acompañas?</legend>
                        <div className="party-options">
                            {['sí', 'no'].map((option) => (
                                <label key={option} className={attendance === option ? 'is-selected' : ''}>
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value={option}
                                        checked={attendance === option}
                                        onChange={() => setAttendance(option)}
                                    />
                                    {option === 'sí' ? '¡Obvio sí!' : 'No podré'}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <button type="submit">
                        {submitted && config.whatsapp === '5210000000000'
                            ? <><Check size={19} /> Demo lista</>
                            : <>Confirmar por WhatsApp <span>↗</span></>}
                    </button>
                    {submitted && config.whatsapp === '5210000000000' && (
                        <p className="party-form__hint">Cambia el número de WhatsApp en PARTY_CONFIG para activar el envío.</p>
                    )}
                </form>

                <p className="party-signoff">Nos vemos en la pista <span>✦</span></p>
            </div>
        </section>
    )
}

export default function CasualPartyTemplate() {
    const pageRef = useRef(null)

    useEffect(() => {
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bodoni+Moda:ital,opsz,wght@1,6..96,700&family=DM+Mono:wght@300;400;500&display=swap'
        document.head.appendChild(fontLink)
        document.title = `${PARTY_CONFIG.name} · ${PARTY_CONFIG.title}`

        const media = gsap.matchMedia()
        const context = gsap.context(() => {
            media.add('(prefers-reduced-motion: no-preference)', () => {
                const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
                heroTimeline
                    .from('[data-hero-item]', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 })
                    .from('.party-cutout-title span', {
                        y: 45,
                        rotation: () => gsap.utils.random(-18, 18),
                        opacity: 0,
                        duration: 0.55,
                        stagger: 0.045,
                        ease: 'back.out(1.7)',
                    }, '-=0.45')

                gsap.to('[data-parallax]', {
                    yPercent: 9,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.party-hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.7,
                    },
                })

                gsap.utils.toArray('[data-section]').forEach((section) => {
                    gsap.from(section.querySelectorAll('.party-kicker, h2, .party-timer, .party-location__card, .party-rsvp__intro, .party-form'), {
                        y: 55,
                        opacity: 0,
                        duration: 0.9,
                        stagger: 0.12,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 76%',
                            toggleActions: 'play none none reverse',
                        },
                    })
                })

                gsap.utils.toArray('[data-drift]').forEach((element, index) => {
                    gsap.to(element, {
                        y: index % 2 ? -55 : 55,
                        rotation: index % 2 ? 14 : -12,
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
        }, pageRef)

        return () => {
            context.revert()
            media.revert()
            fontLink.remove()
        }
    }, [])

    return (
        <main className="party-template" ref={pageRef}>
            <Hero config={PARTY_CONFIG} />
            <Countdown config={PARTY_CONFIG} />
            <Location config={PARTY_CONFIG} />
            <RSVP config={PARTY_CONFIG} />
        </main>
    )
}
