import { useEffect, useRef, useState } from 'react'
import {
    Ban, CalendarPlus, Check, ChevronDown, Church, Clock3, Gift,
    GlassWater, Heart, MapPin, MessageCircle, Music2, Navigation,
    PartyPopper, Send, Sparkles, UtensilsCrossed, Wine,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './editorial-wedding.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * PLANTILLA BODA EDITORIAL
 * Duplica la carpeta, cambia el slug y edita únicamente este objeto.
 */
const WEDDING_CONFIG = {
    slug: 'plantilla-boda-editorial',
    couple: ['Regina', 'Mateo'],
    date: '2027-10-16T17:00:00-06:00',
    dateLabel: '16 · OCT · 2027',
    shortDate: 'Sábado, 16 de octubre de 2027',
    phrase: 'El amor no se mira; se construye, se ríe y se elige todos los días.',
    story: 'Nos encontramos sin buscarlo, nos elegimos sin dudarlo y ahora queremos celebrar con ustedes el comienzo de nuestra vida juntos.',
    families: [
        'Familia Moreno Alcázar',
        'Familia Rivera Torres',
    ],
    events: [
        {
            type: 'Ceremonia',
            place: 'Templo del Encino',
            address: 'Abraham González 111, Barrio del Encino, Aguascalientes',
            time: '5:00 pm',
            maps: 'https://maps.google.com',
            icon: Church,
        },
        {
            type: 'Recepción',
            place: 'Casa 1928',
            address: 'Av. de la Convención 1928, Aguascalientes',
            time: '7:00 pm',
            maps: 'https://maps.google.com',
            icon: GlassWater,
        },
    ],
    dressCode: {
        title: 'Formal',
        subtitle: 'Una noche para vestir increíble',
        reserved: 'Blanco reservado para la novia.',
        colors: ['#171717', '#6c2032', '#6f6843', '#a49982', '#d8d3cb'],
    },
    notes: [
        { number: '01', title: 'Solo adultos', copy: 'Amamos a sus pequeños, pero esta celebración será exclusivamente para adultos.', icon: Ban },
        { number: '02', title: 'Fotos sí, historias también', copy: 'Compartan sus fotos y videos. Queremos revivir la noche desde todos sus ángulos.', icon: MessageCircle },
        { number: '03', title: 'Lleguen con tiempo', copy: 'La ceremonia comenzará puntual. Les sugerimos llegar 20 minutos antes.', icon: Clock3 },
    ],
    itinerary: [
        { time: '5:00', title: 'Ceremonia', icon: Church },
        { time: '7:00', title: 'Cóctel', icon: Wine },
        { time: '8:00', title: 'Cena', icon: UtensilsCrossed },
        { time: '9:30', title: 'Primer baile', icon: Music2 },
        { time: '10:00', title: 'Fiesta', icon: PartyPopper },
    ],
    gallery: [
        { src: '/invitations/plantilla-boda-editorial/img/hero-couple.webp', caption: 'Nos elegimos' },
        { src: '/invitations/plantilla-boda-editorial/img/city-walk.webp', caption: 'Todos los caminos' },
        { src: '/invitations/plantilla-boda-editorial/img/home-dance.webp', caption: 'Nuestra vida' },
    ],
    gift: {
        title: 'Lluvia de sobres',
        copy: 'Su presencia es nuestro mayor regalo. Si desean tener un detalle con nosotros, tendremos un buzón para sobres durante la recepción.',
    },
    whatsapp: '5210000000000',
}

const pad = (value) => String(value).padStart(2, '0')

function useCountdown(target) {
    const calculate = () => {
        const distance = new Date(target).getTime() - Date.now()
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
    }, [target])
    return time
}

function EditorialHeading({ kicker, children, align = 'center', light = false }) {
    return (
        <div className={`wed-heading wed-heading--${align} ${light ? 'wed-heading--light' : ''}`}>
            <p>{kicker}</p>
            <h2>{children}</h2>
            <span aria-hidden="true">with love</span>
        </div>
    )
}

function Hero({ config }) {
    return (
        <header className="wed-hero">
            <div className="wed-hero__photo" data-hero-photo />
            <div className="wed-hero__wash" />
            <div className="wed-handwriting wed-handwriting--hero" aria-hidden="true">
                I love you · I love you · I love you
            </div>
            <div className="wed-hero__panel">
                <p className="wed-hero__eyebrow" data-hero-copy>Nos casamos</p>
                <h1 data-hero-copy>
                    <span>{config.couple[0]}</span>
                    <i>&</i>
                    <span>{config.couple[1]}</span>
                </h1>
                <div className="wed-hero__date" data-hero-copy>{config.dateLabel}</div>
                <p className="wed-hero__phrase" data-hero-copy>“{config.phrase}”</p>
            </div>
            <span className="wed-bow wed-bow--hero" data-drift aria-hidden="true"><i /><b /></span>
            <button
                className="wed-scroll"
                type="button"
                onClick={() => document.querySelector('#wed-story')?.scrollIntoView()}
                aria-label="Descubrir la invitación"
            >
                Nuestra historia <ChevronDown size={17} />
            </button>
        </header>
    )
}

function Story({ config }) {
    return (
        <section className="wed-section wed-story" id="wed-story" data-wed-section>
            <div className="wed-container wed-story__grid">
                <div>
                    <EditorialHeading kicker="Love is…" align="left">
                        La vida<br /><em>juntos</em>
                    </EditorialHeading>
                    <p className="wed-story__copy">{config.story}</p>
                    <p className="wed-signature">{config.couple[0]} & {config.couple[1]}</p>
                </div>
                <figure className="wed-story__photo" data-card>
                    <img src={config.gallery[2].src} alt="Pareja bailando en casa" />
                    <figcaption>Así se siente el amor</figcaption>
                </figure>
            </div>
        </section>
    )
}

function Families({ config }) {
    return (
        <section className="wed-section wed-families" data-wed-section>
            <div className="wed-container">
                <EditorialHeading kicker="Junto a quienes nos enseñaron a amar" light>
                    Nuestras<br /><em>familias</em>
                </EditorialHeading>
                <div className="wed-family-grid">
                    {config.families.map((family, index) => (
                        <article key={family} data-card>
                            <span>0{index + 1}</span>
                            <Heart size={20} />
                            <h3>{family}</h3>
                            <p>Con su amor y bendición</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Countdown({ config }) {
    const time = useCountdown(config.date)
    const items = [
        ['Días', time.days],
        ['Horas', time.hours],
        ['Min', time.minutes],
        ['Seg', time.seconds],
    ]

    const addToCalendar = () => {
        const start = new Date(config.date)
        const end = new Date(start.getTime() + 7 * 3600000)
        const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
        const url = new URL('https://calendar.google.com/calendar/render')
        url.searchParams.set('action', 'TEMPLATE')
        url.searchParams.set('text', `Boda de ${config.couple.join(' & ')}`)
        url.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`)
        window.open(url.toString(), '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="wed-section wed-countdown" data-wed-section>
            <div className="wed-container">
                <EditorialHeading kicker="Save our date">
                    El día que<br /><em>diremos sí</em>
                </EditorialHeading>

                <div className="wed-calendar" data-card>
                    {['JUE', 'VIE', 'SÁB', 'DOM', 'LUN'].map((day, index) => (
                        <div key={day} className={index === 2 ? 'is-date' : ''}>
                            <span>{day}</span>
                            <strong>{14 + index}</strong>
                        </div>
                    ))}
                </div>

                {!time.arrived && (
                    <div className="wed-timer" data-card>
                        {items.map(([label, value]) => (
                            <div key={label}>
                                <strong>{label === 'Días' ? value : pad(value)}</strong>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="wed-countdown__date">{time.arrived ? '¡Hoy nos casamos!' : config.shortDate}</p>
                <button className="wed-button wed-button--ink" type="button" onClick={addToCalendar}>
                    <CalendarPlus size={16} /> Agregar al calendario
                </button>
            </div>
        </section>
    )
}

function Events({ config }) {
    return (
        <section className="wed-section wed-events" data-wed-section>
            <div className="wed-container">
                <EditorialHeading kicker="Dónde será">
                    Dos momentos,<br /><em>un mismo día</em>
                </EditorialHeading>
                <div className="wed-event-list">
                    {config.events.map((event, index) => {
                        const Icon = event.icon
                        return (
                            <article key={event.type} data-card>
                                <span className="wed-event-list__number">0{index + 1}</span>
                                <div className="wed-event-list__icon"><Icon size={23} /></div>
                                <div>
                                    <p>{event.type} · {event.time}</p>
                                    <h3>{event.place}</h3>
                                    <address>{event.address}</address>
                                </div>
                                <a href={event.maps} target="_blank" rel="noreferrer" aria-label={`Ver ${event.type} en el mapa`}>
                                    <Navigation size={17} />
                                </a>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function DressCode({ config }) {
    return (
        <section className="wed-section wed-dress" data-wed-section>
            <span className="wed-bow wed-bow--dress" data-drift aria-hidden="true"><i /><b /></span>
            <div className="wed-container">
                <EditorialHeading kicker="Dress code" light>
                    Vístanse para<br /><em>celebrar</em>
                </EditorialHeading>
                <article className="wed-dress__card" data-card>
                    <span>{config.dressCode.subtitle}</span>
                    <h3>{config.dressCode.title}</h3>
                    <div className="wed-palette">
                        {config.dressCode.colors.map((color) => <i key={color} style={{ background: color }} />)}
                    </div>
                    <p>{config.dressCode.reserved}</p>
                </article>
            </div>
        </section>
    )
}

function Notes({ config }) {
    return (
        <section className="wed-section wed-notes" data-wed-section>
            <div className="wed-container">
                <EditorialHeading kicker="Notas importantes">
                    Para disfrutar<br /><em>sin pendientes</em>
                </EditorialHeading>
                <div className="wed-note-list">
                    {config.notes.map((note) => {
                        const Icon = note.icon
                        return (
                            <article key={note.number} data-card>
                                <span>{note.number}</span>
                                <Icon size={20} />
                                <div><h3>{note.title}</h3><p>{note.copy}</p></div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function Gallery({ config }) {
    const [active, setActive] = useState(1)

    return (
        <section className="wed-section wed-gallery" data-wed-section>
            <div className="wed-container">
                <EditorialHeading kicker="You & me" light>
                    Nosotros,<br /><em>siempre</em>
                </EditorialHeading>
                <div className="wed-gallery__stack" data-card>
                    {config.gallery.map((photo, index) => (
                        <figure
                            key={photo.caption}
                            className={index === active ? 'is-active' : ''}
                            style={{ '--i': index }}
                        >
                            <img src={photo.src} alt={photo.caption} loading="lazy" />
                            <figcaption>{photo.caption}</figcaption>
                        </figure>
                    ))}
                </div>
                <div className="wed-gallery__controls">
                    {config.gallery.map((photo, index) => (
                        <button
                            key={photo.caption}
                            type="button"
                            className={index === active ? 'is-active' : ''}
                            onClick={() => setActive(index)}
                            aria-label={`Ver ${photo.caption}`}
                        >
                            0{index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Gifts({ config }) {
    return (
        <section className="wed-section wed-gifts" data-wed-section>
            <div className="wed-container">
                <EditorialHeading kicker="Su presencia es suficiente">
                    Regalos con<br /><em>mucho amor</em>
                </EditorialHeading>
                <article className="wed-envelope" data-card>
                    <div className="wed-envelope__flap" />
                    <Gift size={25} />
                    <h3>{config.gift.title}</h3>
                    <p>{config.gift.copy}</p>
                    <span>{config.couple.join(' & ')}</span>
                </article>
            </div>
        </section>
    )
}

function Itinerary({ config }) {
    return (
        <section className="wed-section wed-itinerary" data-wed-section>
            <div className="wed-container">
                <EditorialHeading kicker="El plan" align="left">
                    Nuestro día,<br /><em>paso a paso</em>
                </EditorialHeading>
                <div className="wed-timeline">
                    {config.itinerary.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <article key={item.time} data-card>
                                <time>{item.time}<small>pm</small></time>
                                <span><Icon size={17} /></span>
                                <div><b>0{index + 1}</b><h3>{item.title}</h3></div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function RSVP({ config }) {
    const [form, setForm] = useState({ name: '', attendance: 'sí', guests: '1', note: '' })
    const [demoSent, setDemoSent] = useState(false)

    const submit = (event) => {
        event.preventDefault()
        if (config.whatsapp === '5210000000000') {
            setDemoSent(true)
            return
        }
        const names = config.couple.join(' y ')
        const message = form.attendance === 'sí'
            ? `¡Hola! Soy ${form.name}. Confirmo mi asistencia a la boda de ${names} para ${form.guests} persona(s). ${form.note}`
            : `¡Hola! Soy ${form.name}. No podré acompañar a ${names}, pero les deseo toda la felicidad. ${form.note}`
        window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="wed-section wed-rsvp" data-wed-section>
            <div className="wed-container">
                <EditorialHeading kicker="RSVP" light>
                    ¿Celebran<br /><em>con nosotros?</em>
                </EditorialHeading>
                <form className="wed-form" onSubmit={submit} data-card>
                    <label>
                        <span>Nombre completo</span>
                        <input
                            required
                            value={form.name}
                            placeholder="Escribe tu nombre"
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                        />
                    </label>
                    <div className="wed-form__row">
                        <label>
                            <span>Respuesta</span>
                            <select
                                value={form.attendance}
                                onChange={(event) => setForm({ ...form, attendance: event.target.value })}
                            >
                                <option value="sí">Sí, ahí estaré</option>
                                <option value="no">No podré asistir</option>
                            </select>
                        </label>
                        {form.attendance === 'sí' && (
                            <label>
                                <span>Personas</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={form.guests}
                                    onChange={(event) => setForm({ ...form, guests: event.target.value })}
                                />
                            </label>
                        )}
                    </div>
                    <label>
                        <span>Mensaje para los novios</span>
                        <textarea
                            value={form.note}
                            placeholder="Opcional"
                            maxLength={98}
                            onChange={(event) => setForm({ ...form, note: event.target.value })}
                        />
                    </label>
                    <button className="wed-button wed-button--red" type="submit">
                        {demoSent ? <><Check size={16} /> Demo lista</> : <><Send size={16} /> Confirmar por WhatsApp</>}
                    </button>
                    {demoSent && <p className="wed-form__hint">Cambia el número en WEDDING_CONFIG para activar el envío.</p>}
                </form>
            </div>
        </section>
    )
}

function Footer({ config }) {
    return (
        <footer className="wed-footer">
            <p>And so the adventure begins</p>
            <h2>{config.couple[0]} <i>&</i> {config.couple[1]}</h2>
            <span>{config.dateLabel}</span>
            <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Creado con Invita-Ya.com</a>
        </footer>
    )
}

export default function EditorialWeddingTemplate() {
    const rootRef = useRef(null)

    useEffect(() => {
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Italiana&family=Manrope:wght@400;500;600&family=Mrs+Saint+Delafield&display=swap'
        document.head.appendChild(fontLink)
        document.title = `${WEDDING_CONFIG.couple.join(' & ')} · Nuestra boda`

        const media = gsap.matchMedia()
        const context = gsap.context(() => {
            media.add('(prefers-reduced-motion: no-preference)', () => {
                gsap.timeline({ defaults: { ease: 'power3.out' } })
                    .from('[data-hero-copy]', { opacity: 0, y: 32, duration: .9, stagger: .12 })
                    .from('.wed-bow--hero', { opacity: 0, scale: .55, rotation: -18, duration: .7 }, '-=.4')

                gsap.to('[data-hero-photo]', {
                    yPercent: 10,
                    scale: 1.05,
                    ease: 'none',
                    scrollTrigger: { trigger: '.wed-hero', start: 'top top', end: 'bottom top', scrub: 1 },
                })

                gsap.utils.toArray('[data-wed-section]').forEach((section) => {
                    gsap.from(section.querySelectorAll('.wed-heading > *, [data-card], .wed-story__copy, .wed-signature, .wed-countdown__date, .wed-button'), {
                        opacity: 0,
                        y: 45,
                        duration: .85,
                        stagger: .09,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 78%',
                            toggleActions: 'play none none reverse',
                        },
                    })
                })

                gsap.utils.toArray('[data-drift]').forEach((element) => {
                    gsap.to(element, {
                        y: 80,
                        rotation: 14,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: element.closest('section, header'),
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
        <main className="wed-template" ref={rootRef}>
            <div className="wed-thread" aria-hidden="true" />
            <Hero config={WEDDING_CONFIG} />
            <Story config={WEDDING_CONFIG} />
            <Families config={WEDDING_CONFIG} />
            <Countdown config={WEDDING_CONFIG} />
            <Events config={WEDDING_CONFIG} />
            <DressCode config={WEDDING_CONFIG} />
            <Notes config={WEDDING_CONFIG} />
            <Gallery config={WEDDING_CONFIG} />
            <Gifts config={WEDDING_CONFIG} />
            <Itinerary config={WEDDING_CONFIG} />
            <RSVP config={WEDDING_CONFIG} />
            <Footer config={WEDDING_CONFIG} />
        </main>
    )
}
