import { useEffect, useRef, useState } from 'react'
import {
    Baby,
    CalendarPlus,
    Check,
    ChevronDown,
    Clock3,
    Copy,
    ExternalLink,
    Flower2,
    GlassWater,
    HeartPulse,
    MapPin,
    Navigation,
    PackageOpen,
    Send,
    ShoppingBag,
    Store,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './babyshower-template.css'

gsap.registerPlugin(ScrollTrigger)

const BABY_CONFIG = {
    slug: 'baby-ernesto',
    babyName: 'Ernesto',
    eventLabel: 'Baby shower',
    title: 'Baby Ernesto',
    date: '2026-09-12T17:00:00-06:00',
    dateLabel: '12 · 09 · 2026',
    shortDate: 'Sábado 12 de septiembre',
    timeLabel: '5:00 pm',
    quote: 'Un pequeño milagro está por llegar y queremos celebrarlo contigo.',
    hosts: 'Andrea Marmolejo',
    location: {
        name: 'Sara Eventos',
        venue: 'Las Hadas',
        address: 'Calle Thalía 217',
        time: '5:00 pm',
        maps: 'https://www.google.com/maps/search/?api=1&query=Sara+Eventos+Las+Hadas+Calle+Thalia+217+Aguascalientes',
    },
    gifts: [
        {
            store: 'Sears',
            code: '270976',
            label: 'Mesa Baby Shower',
            url: 'https://www.sears.com.mx/Mesa-de-Regalos/270976/Te-invito-a-mi-Baby-Shower---Claudia-Andrea-',
        },
        {
            store: 'Liverpool',
            code: '60022186',
            label: 'Mesa Baby Shower',
            url: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/60022186',
        },
        {
            store: 'Nido de Mamá',
            code: '1209',
            label: 'Registro de regalos',
            url: 'https://elnidodemama.com.mx/addf_gift_registry/',
        },
        {
            store: 'Amazon',
            label: 'Mesa de Andrea Marmolejo',
            url: 'https://www.amazon.com.mx/baby-reg/andrea-marmolejo-septiembre-2026-aguascalientes/PNB6CFNJT2PK?ref_=cm_sw_r_apin_dp_KJRNRW00AB888XQT15PM&language=en-US',
        },
    ],
    whatsapp: '5210000000000',
}

const pad = (value) => String(value).padStart(2, '0')

function Ornament({ light = false }) {
    return (
        <span className={`baby-ornament${light ? ' baby-ornament--light' : ''}`} aria-hidden="true">
            <i />
            <svg viewBox="0 0 24 24"><path d="M12 2c.8 5.9 4.1 9.2 10 10-5.9.8-9.2 4.1-10 10-.8-5.9-4.1-9.2-10-10 5.9-.8 9.2-4.1 10-10Z" /></svg>
            <i />
        </span>
    )
}

function SectionHeading({ kicker, children, light = false }) {
    return (
        <div className={`baby-heading${light ? ' baby-heading--light' : ''}`}>
            <p>{kicker}</p>
            <h2>{children}</h2>
            <Ornament light={light} />
        </div>
    )
}

function CloudDecor() {
    return (
        <div className="baby-cloud-decor" aria-hidden="true">
            <span className="baby-cloud-decor__one" data-cloud="left" />
            <span className="baby-cloud-decor__two" data-cloud="right" />
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

function UltrasoundMoment() {
    const audioRef = useRef(null)
    const hapticTimerRef = useRef(null)
    const listeningRef = useRef(false)
    const [holding, setHolding] = useState(false)

    const beginListening = () => {
        if (listeningRef.current) return
        listeningRef.current = true
        setHolding(true)

        const audio = audioRef.current
        if (audio) {
            audio.currentTime = 0
            audio.play().catch(() => {
                listeningRef.current = false
                setHolding(false)
            })
        }

        if (typeof navigator.vibrate === 'function') {
            const pulse = () => navigator.vibrate([90, 90, 70])
            pulse()
            hapticTimerRef.current = window.setInterval(pulse, 1050)
        }
    }

    const finishListening = () => {
        listeningRef.current = false
        const audio = audioRef.current
        if (audio) {
            audio.pause()
            audio.currentTime = 0
        }
        window.clearInterval(hapticTimerRef.current)
        hapticTimerRef.current = null
        if (typeof navigator.vibrate === 'function') navigator.vibrate(0)
        setHolding(false)
    }

    useEffect(() => {
        const livePreview = new Image()
        livePreview.src = '/invitations/baby-ernesto/img/ecografia-ernesto-live.gif'

        return () => {
            window.clearInterval(hapticTimerRef.current)
            if (typeof navigator.vibrate === 'function') navigator.vibrate(0)
        }
    }, [])

    return (
        <div className={`baby-ultrasound${holding ? ' is-listening' : ''}`} data-hero-copy>
            <span className="baby-ultrasound__halo" aria-hidden="true" />
            <button
                type="button"
                aria-label="Mantén presionada la ecografía para escuchar el latido"
                onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture?.(event.pointerId)
                    beginListening()
                }}
                onPointerUp={finishListening}
                onPointerCancel={finishListening}
                onLostPointerCapture={finishListening}
                onContextMenu={(event) => event.preventDefault()}
                onKeyDown={(event) => {
                    if (!event.repeat && (event.key === ' ' || event.key === 'Enter')) {
                        event.preventDefault()
                        beginListening()
                    }
                }}
                onKeyUp={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') finishListening()
                }}
            >
                <img
                    src={holding
                        ? '/invitations/baby-ernesto/img/ecografia-ernesto-live.gif'
                        : '/invitations/baby-ernesto/img/ecografia-ernesto.webp'}
                    alt="Ecografía de Baby Ernesto"
                    draggable="false"
                />
                <span className="baby-ultrasound__instruction">
                    <HeartPulse size={20} />
                    {holding ? 'Escuchando su corazón · suelta para parar' : 'Mantén presionado para escuchar su latido'}
                </span>
            </button>
            <HeartPulse className="baby-ultrasound__pulse" size={27} aria-hidden="true" />
            <audio
                ref={audioRef}
                src="/invitations/baby-ernesto/audio/heartbeat.mp3"
                preload="auto"
                loop
            />
        </div>
    )
}

function Hero({ config }) {
    return (
        <header className="baby-hero">
            <div className="baby-hero__sky" data-hero-sky />
            <CloudDecor />
            <span className="baby-hero__line baby-hero__line--left" aria-hidden="true" />
            <span className="baby-hero__line baby-hero__line--right" aria-hidden="true" />

            <div className="baby-hero__content">
                <div className="baby-hero__seal" data-hero-copy aria-hidden="true">BE</div>
                <p className="baby-hero__eyebrow" data-hero-copy>Celebramos la dulce espera</p>
                <h1 data-hero-copy>
                    <span>Baby</span>
                    <strong>{config.babyName}</strong>
                </h1>
                <Ornament />

                <UltrasoundMoment />

                <p className="baby-hero__date" data-hero-copy>{config.shortDate} <i /> {config.timeLabel}</p>
                <p className="baby-hero__quote" data-hero-copy>{config.quote}</p>
            </div>

            <button
                className="baby-scroll"
                type="button"
                onClick={() => document.querySelector('#baby-intro')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Ver la invitación"
            >
                <span>Descubre los detalles</span>
                <ChevronDown size={17} />
            </button>
        </header>
    )
}

function Intro({ config }) {
    return (
        <section className="baby-section baby-intro" id="baby-intro" data-baby-section>
            <div className="baby-container baby-intro__layout">
                <div className="baby-intro__copy-wrap">
                    <SectionHeading kicker="Con inmensa alegría">
                        Un nuevo amor<br /><em>está por llegar</em>
                    </SectionHeading>
                    <p className="baby-intro__copy">
                        Hay momentos que se vuelven eternos cuando se comparten.
                        Acompáñanos a celebrar la próxima llegada de nuestro pequeño Ernesto.
                    </p>
                    <p className="baby-intro__host">Con cariño, <strong>{config.hosts}</strong></p>
                </div>

                <article className="baby-date-card" data-card>
                    <span className="baby-date-card__kicker">Reserva la fecha</span>
                    <div className="baby-date-card__date">
                        <span>Sábado</span>
                        <strong>12</strong>
                        <span>Septiembre<br />2026</span>
                    </div>
                    <i />
                    <p>{config.timeLabel}</p>
                    <Baby size={22} aria-hidden="true" />
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
        ['Minutos', time.minutes],
        ['Segundos', time.seconds],
    ]

    const addToCalendar = () => {
        const start = new Date(config.date)
        const end = new Date(start.getTime() + 4 * 60 * 60 * 1000)
        const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
        const url = new URL('https://calendar.google.com/calendar/render')
        url.searchParams.set('action', 'TEMPLATE')
        url.searchParams.set('text', `Baby Shower de ${config.babyName}`)
        url.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`)
        url.searchParams.set('details', config.quote)
        url.searchParams.set('location', `${config.location.name} ${config.location.venue}, ${config.location.address}`)
        window.open(url.toString(), '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="baby-section baby-countdown" data-baby-section>
            <div className="baby-countdown__arch" aria-hidden="true" />
            <div className="baby-container">
                <SectionHeading kicker="La cuenta regresiva">
                    {time.arrived ? 'El gran día llegó' : 'Cada día falta menos'}
                </SectionHeading>

                {!time.arrived && (
                    <div className="baby-timer" data-card>
                        {values.map(([label, value]) => (
                            <div className="baby-timer__unit" key={label}>
                                <strong>{label === 'Días' ? value : pad(value)}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                )}

                <button className="baby-button baby-button--light" type="button" onClick={addToCalendar}>
                    <CalendarPlus size={17} /> Agregar al calendario
                </button>
            </div>
        </section>
    )
}

function Location({ config }) {
    return (
        <section className="baby-section baby-location" data-baby-section>
            <div className="baby-location__wash" aria-hidden="true" />
            <div className="baby-container baby-location__layout">
                <div className="baby-location__intro">
                    <SectionHeading kicker="Dónde nos encontraremos">
                        Un lugar para<br /><em>celebrar juntos</em>
                    </SectionHeading>
                    <p>Tu presencia hará este día todavía más especial.</p>
                </div>

                <article className="baby-location__card" data-card>
                    <div className="baby-location__icon"><MapPin size={24} /></div>
                    <p className="baby-location__label">Lugar del evento</p>
                    <h3>{config.location.name}</h3>
                    <strong>{config.location.venue}</strong>
                    <p className="baby-location__address">{config.location.address}</p>
                    <p className="baby-location__time"><Clock3 size={15} /> {config.shortDate} · {config.location.time}</p>
                    <a href={config.location.maps} target="_blank" rel="noreferrer">
                        <Navigation size={15} /> Abrir ubicación
                    </a>
                </article>
            </div>
        </section>
    )
}

function Considerations() {
    return (
        <section className="baby-section baby-notes" data-baby-section>
            <div className="baby-container">
                <SectionHeading kicker="Una pequeña nota">
                    Para disfrutar juntos<br /><em>este día tan especial</em>
                </SectionHeading>
                <p className="baby-notes__intro">
                    Queremos compartir contigo un par de detalles para que todos disfrutemos la celebración.
                </p>

                <div className="baby-notes__grid">
                    <article className="baby-note" data-note>
                        <div className="baby-note__icon"><Flower2 size={21} /></div>
                        <p className="baby-note__kicker">Sobre nuestros pequeños invitados</p>
                        <h3>Un espacio para adultos</h3>
                        <p>
                            Debido al cupo limitado del lugar, en esta ocasión no contaremos con un área para niños.
                            Agradecemos de corazón tu comprensión.
                        </p>
                    </article>

                    <article className="baby-note" data-note>
                        <div className="baby-note__icon"><GlassWater size={21} /></div>
                        <p className="baby-note__kicker">Brindis a tu gusto</p>
                        <h3>Tu bebida favorita es bienvenida</h3>
                        <p>
                            El evento no contará con bebidas alcohólicas; sin embargo, si gustas llevar las tuyas,
                            puedes hacerlo con toda confianza.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    )
}

function GiftCard({ gift, index }) {
    const [copied, setCopied] = useState(false)
    const iconByStore = {
        Sears: ShoppingBag,
        Liverpool: Store,
        'Nido de Mamá': Baby,
        Amazon: PackageOpen,
    }
    const StoreIcon = iconByStore[gift.store] || ShoppingBag

    const copyCode = async () => {
        if (!gift.code) return
        await navigator.clipboard?.writeText(gift.code)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
    }

    return (
        <article className="baby-gift-card" data-gift-card>
            <span className="baby-gift-card__number">0{index + 1}</span>
            <div className="baby-gift-card__icon" aria-hidden="true"><StoreIcon size={27} /></div>
            <p className="baby-gift-card__store">{gift.store}</p>
            <h3>{gift.label || 'Mesa de regalos'}</h3>

            <div className="baby-gift-card__actions">
                {gift.code && (
                    <button className="baby-gift-card__code" type="button" onClick={copyCode} aria-label={`Copiar número de mesa ${gift.code}`}>
                        <span>No. {gift.code}</span>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                )}

                {gift.url && (
                    <a href={gift.url} target="_blank" rel="noreferrer" aria-label={`Abrir mesa de regalos de ${gift.store}`}>
                        Ir directo a la mesa <ExternalLink size={13} />
                    </a>
                )}
            </div>
        </article>
    )
}

function Gifts({ config }) {
    return (
        <section className="baby-section baby-gifts" data-baby-section>
            <div className="baby-gifts__glow" aria-hidden="true" />
            <div className="baby-container">
                <SectionHeading kicker="Mesa de regalos">
                    El mejor regalo<br /><em>es compartir contigo</em>
                </SectionHeading>
                <p className="baby-gifts__intro">
                    Si deseas tener un detalle con Baby {config.babyName}, hemos preparado estas opciones con mucho cariño.
                </p>

                <div className="baby-gift-grid">
                    {config.gifts.map((gift, index) => <GiftCard gift={gift} index={index} key={gift.store} />)}
                </div>
            </div>
        </section>
    )
}

function RSVP({ config }) {
    const [form, setForm] = useState({ name: '', attendance: 'sí' })
    const [notice, setNotice] = useState(false)
    const isConfigured = config.whatsapp !== '5210000000000'

    const submit = (event) => {
        event.preventDefault()
        if (!isConfigured) {
            setNotice(true)
            return
        }

        const message = form.attendance === 'sí'
            ? `¡Hola! Soy ${form.name}. Confirmo mi asistencia al Baby Shower de ${config.babyName}.`
            : `¡Hola! Soy ${form.name}. No podré asistir al Baby Shower de ${config.babyName}, pero le mando mucho cariño.`
        window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="baby-section baby-rsvp" data-baby-section>
            <CloudDecor />
            <div className="baby-container">
                <SectionHeading kicker="Confirma tu asistencia">
                    ¿Nos acompañas a<br /><em>celebrar a Ernesto?</em>
                </SectionHeading>
                <p className="baby-rsvp__intro">Nos encantará saber que podremos compartir este momento contigo.</p>

                <form className="baby-form" onSubmit={submit} data-card>
                    <label className="baby-form__field">
                        <span>Tu nombre</span>
                        <input
                            required
                            value={form.name}
                            placeholder="Escribe tu nombre"
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                        />
                    </label>

                    <fieldset>
                        <legend>¿Podrás acompañarnos?</legend>
                        <div className="baby-options">
                            {['sí', 'no'].map((option) => (
                                <label key={option} className={form.attendance === option ? 'is-selected' : ''}>
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value={option}
                                        checked={form.attendance === option}
                                        onChange={() => setForm({ ...form, attendance: option })}
                                    />
                                    {option === 'sí' ? 'Sí, ahí estaré' : 'No podré asistir'}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <button className="baby-button baby-button--gold" type="submit">
                        <Send size={16} /> Confirmar por WhatsApp
                    </button>
                    {notice && <p className="baby-form__hint">El número para confirmar se agregará muy pronto.</p>}
                </form>
            </div>
        </section>
    )
}

function Footer({ config }) {
    return (
        <footer className="baby-footer">
            <div className="baby-footer__seal">BE</div>
            <p>Gracias por acompañarnos en<br /><em>el comienzo de esta historia</em></p>
            <h2>Baby {config.babyName}</h2>
            <span>{config.dateLabel}</span>
            <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Creado con Invita-Ya.com</a>
        </footer>
    )
}

export default function BabyShowerTemplate() {
    const rootRef = useRef(null)

    useEffect(() => {
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@300;400;500;600&display=swap'
        document.head.appendChild(fontLink)
        document.title = `${BABY_CONFIG.eventLabel} · ${BABY_CONFIG.title}`

        const media = gsap.matchMedia()
        const context = gsap.context(() => {
            media.add('(prefers-reduced-motion: no-preference)', () => {
                const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
                heroTimeline
                    .from('.baby-hero__line', { scaleY: 0, duration: 1.2, stagger: .12 })
                    .from('[data-hero-copy]', { opacity: 0, y: 34, duration: 1, stagger: .12 }, '-=.9')
                    .from('.baby-hero .baby-ornament', { opacity: 0, scaleX: .35, duration: .8 }, '-=.55')
                    .from('.baby-scroll', { opacity: 0, y: -8, duration: .55 }, '-=.25')

                gsap.to('[data-hero-sky]', {
                    yPercent: 14,
                    scale: 1.07,
                    ease: 'none',
                    scrollTrigger: { trigger: '.baby-hero', start: 'top top', end: 'bottom top', scrub: 1 },
                })

                gsap.to('[data-cloud="left"]', {
                    xPercent: -12,
                    ease: 'none',
                    scrollTrigger: { trigger: '.baby-hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
                })

                gsap.to('[data-cloud="right"]', {
                    xPercent: 10,
                    ease: 'none',
                    scrollTrigger: { trigger: '.baby-hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
                })

                gsap.utils.toArray('[data-baby-section]').forEach((section) => {
                    const elements = section.querySelectorAll(
                        '.baby-heading > *, .baby-intro__copy, .baby-intro__host, [data-card], ' +
                        '.baby-location__intro > p, .baby-notes__intro, [data-note], .baby-gifts__intro, .baby-rsvp__intro'
                    )
                    gsap.from(elements, {
                        opacity: 0,
                        y: 38,
                        duration: .9,
                        stagger: .09,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: section, start: 'top 78%', once: true },
                    })
                })

                gsap.from('.baby-timer__unit', {
                    opacity: 0,
                    y: 24,
                    duration: .7,
                    stagger: .08,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: '.baby-timer', start: 'top 85%', once: true },
                })

                gsap.from('[data-gift-card]', {
                    opacity: 0,
                    y: 34,
                    rotate: 1.5,
                    duration: .75,
                    stagger: .1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '.baby-gift-grid', start: 'top 84%', once: true },
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
        <main className="baby-template" ref={rootRef}>
            <Hero config={BABY_CONFIG} />
            <Intro config={BABY_CONFIG} />
            <Countdown config={BABY_CONFIG} />
            <Location config={BABY_CONFIG} />
            <Considerations />
            <Gifts config={BABY_CONFIG} />
            <RSVP config={BABY_CONFIG} />
            <Footer config={BABY_CONFIG} />
        </main>
    )
}
