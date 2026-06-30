import { useEffect, useRef, useState } from 'react'
import {
    CalendarPlus, Camera, Check, ChevronDown, Church, Clock3, Crown,
    Gift, Heart, MapPin, Music2, Navigation, PartyPopper, Send,
    Sparkles, UtensilsCrossed, VenetianMask,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './rapunzel-template.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * PLANTILLA XV CUENTO DE LOS FAROLES
 * Duplica la carpeta, cambia el slug y edita solamente este objeto.
 */
const STORY_CONFIG = {
    slug: 'plantilla-rapunzel-xv',
    name: 'Valentina',
    eventLabel: 'Mis XV años',
    date: '2027-03-20T18:00:00-06:00',
    dateLabel: '20 · MARZO · 2027',
    shortDate: '20 de marzo de 2027',
    quote: 'Y al fin veo la luz; esta noche comienza mi nueva aventura.',
    parents: ['Alejandra Hernández', 'Miguel Salazar'],
    godparents: ['Mariana Robles', 'Santiago Fuentes'],
    events: [
        {
            type: 'Ceremonia',
            place: 'Templo de San Antonio',
            address: 'Pedro Parga 252, Centro, Aguascalientes',
            time: '6:00 pm',
            maps: 'https://maps.google.com',
            icon: Church,
        },
        {
            type: 'Recepción',
            place: 'Jardín La Torre',
            address: 'Camino del Encanto 150, Aguascalientes',
            time: '8:00 pm',
            maps: 'https://maps.google.com',
            icon: PartyPopper,
        },
    ],
    dressCode: {
        title: 'Formal',
        note: 'El color lavanda está reservado para la quinceañera.',
    },
    gifts: {
        title: 'Lluvia de sobres',
        copy: 'Tu presencia es mi mejor regalo. Si deseas tener un detalle conmigo, tendremos un buzón especial en la recepción.',
    },
    itinerary: [
        { time: '6:00', title: 'Ceremonia', detail: 'El comienzo de la aventura', icon: Church },
        { time: '8:00', title: 'Recepción', detail: 'Bienvenida al reino', icon: PartyPopper },
        { time: '9:00', title: 'Cena', detail: 'Compartimos la mesa', icon: UtensilsCrossed },
        { time: '10:00', title: 'Vals', detail: 'Un momento de luz', icon: Music2 },
    ],
    gallery: [
        { src: '/invitations/plantilla-rapunzel-xv/img/lantern-lake.webp', alt: 'Lago iluminado por faroles', caption: 'Mi sueño' },
        { src: '/invitations/plantilla-rapunzel-xv/img/tower-still-life.webp', alt: 'Rincón de la torre', caption: 'Mi historia' },
        { src: '/invitations/plantilla-rapunzel-xv/img/hero-storybook.webp', alt: 'Torre entre flores', caption: 'Mi aventura' },
    ],
    whatsapp: '5210000000000',
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
                <div data-hero-copy><SunMark /></div>
                <p className="story-hero__eyebrow" data-hero-copy>{config.eventLabel}</p>
                <h1 data-hero-copy>{config.name}</h1>
                <p className="story-hero__date" data-hero-copy>{config.dateLabel}</p>
                <p className="story-hero__quote" data-hero-copy>“{config.quote}”</p>
            </div>

            <button
                className="story-scroll"
                type="button"
                onClick={() => document.querySelector('#story-intro')?.scrollIntoView()}
                aria-label="Descubrir la invitación"
            >
                Descubre mi historia <ChevronDown size={18} />
            </button>
        </header>
    )
}

function Intro({ config }) {
    return (
        <section className="story-section story-intro" id="story-intro" data-story-section>
            <div className="story-gold-ribbon" data-drift />
            <div className="story-container">
                <SectionHeading kicker="Con la bendición de Dios">
                    Un nuevo sueño<br /><em>comienza</em>
                </SectionHeading>

                <p className="story-intro__copy">
                    Hay momentos en la vida que imaginamos, soñamos y esperamos.
                    Hoy quiero compartir contigo la alegría de cumplir quince años.
                </p>

                <article className="story-name-card" data-card>
                    <Crown size={24} />
                    <span>Mis papás</span>
                    <h3>{config.parents[0]}</h3>
                    <i>&</i>
                    <h3>{config.parents[1]}</h3>
                    <p>Tienen el honor de invitarte a celebrar conmigo.</p>
                </article>
            </div>
        </section>
    )
}

function Godparents({ config }) {
    return (
        <section className="story-section story-godparents" data-story-section>
            <div className="story-spark-field" />
            <div className="story-container">
                <SectionHeading kicker="Con el cariño de" light>Mis<br /><em>padrinos</em></SectionHeading>
                <article className="story-glass-card" data-card>
                    <SunMark small />
                    <h3>{config.godparents[0]}</h3>
                    <span>&</span>
                    <h3>{config.godparents[1]}</h3>
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
            <div className="story-container">
                <SectionHeading kicker="La aventura comienza en">
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
            <div className="story-container">
                <SectionHeading kicker="Dónde y cuándo">Nuestros<br /><em>encuentros</em></SectionHeading>
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

function DressCode({ config }) {
    return (
        <section className="story-section story-dress" data-story-section>
            <div className="story-container">
                <SectionHeading kicker="Para esta noche mágica" light>Código de<br /><em>vestimenta</em></SectionHeading>
                <article className="story-dress__card" data-card>
                    <VenetianMask size={48} />
                    <span>Dress code</span>
                    <h3>{config.dressCode.title}</h3>
                    <p>{config.dressCode.note}</p>
                    <div className="story-swatches" aria-label="Paleta sugerida">
                        <i /><i /><i /><i />
                    </div>
                </article>
            </div>
        </section>
    )
}

function Gallery({ config }) {
    const [active, setActive] = useState(0)

    return (
        <section className="story-section story-gallery" data-story-section>
            <div className="story-container">
                <SectionHeading kicker="Érase una vez">Mi galería</SectionHeading>
                <div className="story-gallery__stage" data-card>
                    {config.gallery.map((photo, index) => (
                        <figure
                            key={photo.caption}
                            className={index === active ? 'is-active' : ''}
                            style={{ '--position': index }}
                        >
                            <img src={photo.src} alt={photo.alt} loading="lazy" />
                            <figcaption>{photo.caption}</figcaption>
                        </figure>
                    ))}
                </div>
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
                <p className="story-gallery__hint"><Camera size={14} /> Reemplaza estas ilustraciones por tus fotos</p>
            </div>
        </section>
    )
}

function Gifts({ config }) {
    return (
        <section className="story-section story-gifts" data-story-section>
            <div className="story-container">
                <SectionHeading kicker="Tu presencia es mi regalo">Detalles con<br /><em>mucho cariño</em></SectionHeading>
                <article className="story-gift-card" data-card>
                    <span className="story-gift-card__icon"><Gift size={31} /></span>
                    <h3>{config.gifts.title}</h3>
                    <p>{config.gifts.copy}</p>
                    <span className="story-envelope">Para Valentina <i>♥</i></span>
                </article>
            </div>
        </section>
    )
}

function Itinerary({ config }) {
    return (
        <section className="story-section story-itinerary" data-story-section>
            <div className="story-spark-field" />
            <div className="story-container">
                <SectionHeading kicker="Nuestro recorrido" light>Itinerario</SectionHeading>
                <div className="story-timeline">
                    {config.itinerary.map((item) => {
                        const Icon = item.icon
                        return (
                            <article key={item.time} data-card>
                                <time>{item.time}<small>pm</small></time>
                                <span><Icon size={19} /></span>
                                <div><h3>{item.title}</h3><p>{item.detail}</p></div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function RSVP({ config }) {
    const [form, setForm] = useState({ name: '', guests: '1', attendance: 'sí' })
    const [demoSent, setDemoSent] = useState(false)

    const submit = (event) => {
        event.preventDefault()
        if (config.whatsapp === '5210000000000') {
            setDemoSent(true)
            return
        }
        const message = form.attendance === 'sí'
            ? `¡Hola! Soy ${form.name}. Confirmo mi asistencia a los XV de ${config.name} para ${form.guests} persona(s). ✨`
            : `¡Hola! Soy ${form.name}. No podré asistir a los XV de ${config.name}, pero le deseo una noche maravillosa. 💜`
        window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="story-section story-rsvp" data-story-section>
            <div className="story-lantern-wave" aria-hidden="true">
                {Array.from({ length: 7 }, (_, index) => <i key={index} style={{ '--i': index }} />)}
            </div>
            <div className="story-container">
                <SectionHeading kicker="Acompáñame a ver la luz" light>Confirma tu<br /><em>asistencia</em></SectionHeading>
                <form className="story-form" onSubmit={submit} data-card>
                    <label>
                        <span>Nombre completo</span>
                        <input
                            required
                            value={form.name}
                            placeholder="Escribe tu nombre"
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                        />
                    </label>
                    <div className="story-form__row">
                        <label>
                            <span>Respuesta</span>
                            <select
                                value={form.attendance}
                                onChange={(event) => setForm({ ...form, attendance: event.target.value })}
                            >
                                <option value="sí">Sí, asistiré</option>
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
                    <button className="story-button story-button--gold" type="submit">
                        {demoSent
                            ? <><Check size={17} /> Demo lista</>
                            : <><Send size={17} /> Confirmar por WhatsApp</>}
                    </button>
                    {demoSent && <p className="story-form__hint">Cambia el número en STORY_CONFIG para activar el envío.</p>}
                </form>
            </div>
        </section>
    )
}

function Footer({ config }) {
    return (
        <footer className="story-footer">
            <SunMark />
            <p>Y viviremos esta noche<br /><em>felices para siempre</em></p>
            <h2>{config.name}</h2>
            <span>{config.dateLabel}</span>
            <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Creado con Invita-Ya.com</a>
        </footer>
    )
}

export default function RapunzelXVTemplate({ hideGallery = false }) {
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
            <Hero config={STORY_CONFIG} />
            <Intro config={STORY_CONFIG} />
            <Godparents config={STORY_CONFIG} />
            <Countdown config={STORY_CONFIG} />
            <Events config={STORY_CONFIG} />
            <DressCode config={STORY_CONFIG} />
            {!hideGallery && <Gallery config={STORY_CONFIG} />}
            <Gifts config={STORY_CONFIG} />
            <Itinerary config={STORY_CONFIG} />
            <RSVP config={STORY_CONFIG} />
            <Footer config={STORY_CONFIG} />
        </main>
    )
}
