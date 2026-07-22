import { useEffect, useRef, useState } from 'react'
import {
    CalendarPlus,
    ChevronDown,
    Church,
    Clock3,
    Flower2,
    Gift,
    Heart,
    Landmark,
    MapPin,
    Music2,
    Navigation,
    Pause,
    PartyPopper,
    Sparkles,
    UtensilsCrossed,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroPhoto from './assets/daniela-hero.webp'
import heroMobilePhoto from './assets/daniela-hero-mobile.webp'
import familyPhoto from './assets/daniela-family.webp'
import ceremonyPhoto from './assets/daniela-ceremony.webp'
import receptionPhoto from './assets/daniela-reception.webp'
import countdownPhoto from './assets/daniela-countdown.webp'
import rsvpPhoto from './assets/daniela-rsvp.webp'
import galleryPhoto1 from './assets/gallery-1.webp'
import galleryPhoto2 from './assets/gallery-2.webp'
import galleryPhoto3 from './assets/gallery-3.webp'
import galleryPhoto4 from './assets/gallery-4.webp'
import galleryPhoto5 from './assets/gallery-5.webp'
import galleryPhoto6 from './assets/gallery-6.webp'
import galleryPhoto7 from './assets/gallery-7.webp'
import galleryPhoto8 from './assets/gallery-8.webp'
import ogPreview from './assets/og-preview-v2.jpg'
import './invitation.css'

gsap.registerPlugin(ScrollTrigger)

const EVENT_DATE = '2026-08-22T17:00:00-06:00'
const AUDIO = '/invitations/daniela-itzel/audio/perfect-piano.mp3'

const locations = [
    {
        kind: 'Misa',
        name: 'El Conventito',
        detail: 'Parroquia de El Sagrario Diocesano · Aguascalientes, Ags.',
        time: '5:00 pm',
        image: ceremonyPhoto,
        imageAlt: 'Fachada de la Parroquia de El Sagrario Diocesano, El Conventito',
        imagePosition: 'center 42%',
        maps: 'https://maps.app.goo.gl/UQxh8x5Pu96coprn9',
        icon: Church,
    },
    {
        kind: 'Recepción',
        name: 'Finca D',
        detail: 'San José de la Ordeña · Aguascalientes, Ags.',
        time: '7:30 pm',
        image: receptionPhoto,
        imageAlt: 'Jardín y alberca de Finca D',
        imagePosition: 'center 48%',
        maps: 'https://maps.app.goo.gl/1C25qtc8wasQVtev6?g_st=aw',
        icon: Sparkles,
    },
]

const itinerary = [
    { time: '5:00 pm', label: 'Misa', icon: Church },
    { time: '7:30 pm', label: 'Recepción', icon: MapPin },
    { time: '8:00 pm', label: 'Vals', icon: Music2 },
    { time: '8:30 pm', label: 'Cena', icon: UtensilsCrossed },
    { time: '9:30 pm', label: 'Baile sorpresa', icon: Sparkles },
    { time: '10:00 pm', label: 'Baile', icon: PartyPopper },
]

const galleryPhotos = [
    { src: galleryPhoto1, caption: 'Entre flores', position: 'center 42%' },
    { src: galleryPhoto2, caption: 'Miradas que hablan', position: 'center 36%' },
    { src: galleryPhoto3, caption: 'Un momento para mí', position: 'center 45%' },
    { src: galleryPhoto4, caption: 'Donde nacen los recuerdos', position: 'center 48%' },
    { src: galleryPhoto5, caption: 'Todo empieza a florecer', position: 'center 44%' },
    { src: galleryPhoto6, caption: 'Mi rincón favorito', position: 'center 52%' },
    { src: galleryPhoto7, caption: 'Sonrisas para siempre', position: 'center 50%' },
    { src: galleryPhoto8, caption: 'Instantes que guardaré', position: 'center 43%' },
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
            if (event.target instanceof Element && event.target.closest('.maia-music')) {
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
        audio.play().then(removeInteractionListeners).catch(() => {})
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
                src={AUDIO}
                preload="auto"
                autoPlay
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
                <source media="(max-width: 480px)" srcSet={heroMobilePhoto} />
                <img src={heroPhoto} alt="Daniela Itzel con un ramo de flores" className="maia-hero__photo" data-parallax />
            </picture>
            <div className="maia-hero__shade" />
            <div className="maia-hero__copy">
                <p>Una noche para recordar</p>
                <h1>Mis <span>XV</span></h1>
                <blockquote>
                    Hay momentos que soñamos toda la vida.<br />
                    Gracias por ser parte del mío.
                </blockquote>
                <span className="maia-hero__date">22 · 08 · 2026</span>
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
            <h2 data-reveal>Daniela <span>Itzel</span></h2>
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
                <img src={familyPhoto} alt="Daniela Itzel sentada entre las ramas de un árbol" loading="lazy" data-parallax />
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
                    <h3>José Luis Aguilar Hernández</h3>
                    <b>&</b>
                    <h3>Miriam Sarahi Montoya</h3>
                    <Flower2 className="maia-family-card__flower" size={32} strokeWidth={1.15} />
                </article>
                <article className="maia-family-card maia-family-card--reverse" data-reveal>
                    <span>Mis padrinos</span>
                    <p>Y la compañía de</p>
                    <h3>Heriberto Torres Hernández</h3>
                    <b>&</b>
                    <h3>Esmeralda Marín Guerrero</h3>
                    <Flower2 className="maia-family-card__flower" size={32} strokeWidth={1.15} />
                </article>
            </div>
        </section>
    )
}

function DateAndCountdown() {
    const time = useCountdown()
    const [calendarOpen, setCalendarOpen] = useState(false)
    const calendarRef = useRef(null)

    const units = [
        ['Días', time.days],
        ['Horas', time.hours],
        ['Min', time.minutes],
        ['Seg', time.seconds],
    ]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setCalendarOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('XV años de Daniela Itzel')}&dates=20260822T230000Z/20260823T060000Z&details=${encodeURIComponent('Acompáñame a celebrar mis XV años.')}&location=${encodeURIComponent('Parroquia de El Sagrario Diocesano (El Conventito), Aguascalientes')}`

    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent('XV años de Daniela Itzel')}&body=${encodeURIComponent('Acompáñame a celebrar mis XV años.')}&startdt=2026-08-22T17:00:00-06:00&enddt=2026-08-23T00:00:00-06:00&location=${encodeURIComponent('Parroquia de El Sagrario Diocesano (El Conventito), Aguascalientes')}`

    const openAppleCalendar = () => {
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//XV Daniela Itzel//ES',
            'BEGIN:VEVENT',
            'DTSTART:20260822T230000Z',
            'DTEND:20260823T060000Z',
            'SUMMARY:XV años de Daniela Itzel',
            'DESCRIPTION:Acompáñame a celebrar mis XV años.',
            'LOCATION:Parroquia de El Sagrario Diocesano (El Conventito), Aguascalientes',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n')

        const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent)
        window.open(dataUri, '_blank')
    }

    return (
        <section className="maia-date">
            <div className="maia-date__paper">
                <p className="maia-date__month" data-reveal>Agosto</p>
                <div className="maia-date__calendar" data-reveal>
                    <span>Sábado</span>
                    <strong>22</strong>
                    <span>2026</span>
                </div>
                <p className="maia-date__phrase" data-reveal>
                    “Los momentos compartidos con quienes amamos se vuelven recuerdos para siempre.”
                </p>
                <div className="maia-calendar-wrapper" ref={calendarRef}>
                    <button
                        className="maia-button maia-button--outline"
                        type="button"
                        onClick={() => setCalendarOpen(!calendarOpen)}
                    >
                        <CalendarPlus size={16} /> Agregar al calendario <ChevronDown size={14} style={{ transform: calendarOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }} />
                    </button>
                    <div className={`maia-calendar-dropdown${calendarOpen ? ' is-open' : ''}`}>
                        <a href={googleUrl} target="_blank" rel="noopener noreferrer" onClick={() => setCalendarOpen(false)} className="maia-calendar-dropdown-item">
                            Google Calendar
                        </a>
                        <a href={outlookUrl} target="_blank" rel="noopener noreferrer" onClick={() => setCalendarOpen(false)} className="maia-calendar-dropdown-item">
                            Outlook Online
                        </a>
                        <button onClick={() => { openAppleCalendar(); setCalendarOpen(false); }} className="maia-calendar-dropdown-item">
                            Apple Calendar
                        </button>
                    </div>
                </div>
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
        <section className="maia-locations" id="lugares">
            <SectionTitle eyebrow="Celebremos juntos">
                Los lugares de<br /><em>mi gran día</em>
            </SectionTitle>
            <div className="maia-locations__list">
                {locations.map((location) => {
                    const Icon = location.icon
                    return (
                        <article key={location.kind} className="maia-location" data-reveal>
                            <div className="maia-location__image">
                                <img
                                    src={location.image}
                                    alt={location.imageAlt}
                                    style={{ objectPosition: location.imagePosition }}
                                />
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

function Itinerary() {
    return (
        <section className="maia-itinerary">
            <SectionTitle eyebrow="Cada momento cuenta">
                Itinerario de<br /><em>la celebración</em>
            </SectionTitle>
            <div className="maia-itinerary__list">
                {itinerary.map((item) => {
                    const Icon = item.icon
                    return (
                        <article className="maia-itinerary__item" key={`${item.time}-${item.label}`} data-reveal>
                            <div className="maia-itinerary__icon"><Icon size={22} strokeWidth={1.35} /></div>
                            <time>{item.time}</time>
                            <h3>{item.label}</h3>
                        </article>
                    )
                })}
            </div>
            <p className="maia-itinerary__note" data-reveal>Gracias por acompañarme en cada instante de esta noche.</p>
        </section>
    )
}

function PolaroidGallery({ hidden = false }) {
    const [activePhoto, setActivePhoto] = useState(0)

    useEffect(() => {
        if (hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
        const interval = window.setInterval(() => {
            setActivePhoto((current) => (current + 1) % galleryPhotos.length)
        }, 4200)
        return () => window.clearInterval(interval)
    }, [hidden])

    if (hidden) return null

    const advance = () => setActivePhoto((current) => (current + 1) % galleryPhotos.length)
    const visiblePhotos = [2, 1, 0].map((offset) => ({
        ...galleryPhotos[(activePhoto + offset) % galleryPhotos.length],
        offset,
    }))

    return (
        <section className="maia-gallery" id="galeria" aria-label="Galería de recuerdos de Daniela Itzel">
            <div className="maia-gallery__heading" data-reveal>
                <SectionTitle eyebrow="Recuerdos que florecen">
                    Momentos de<br /><em>Daniela</em>
                </SectionTitle>
                <p>Pequeños instantes que guardo con mucho cariño.</p>
            </div>

            <div className="maia-gallery__stage" data-reveal>
                {visiblePhotos.map((photo) => (
                    <button
                        aria-label={photo.offset === 0 ? `Ver siguiente fotografía. Fotografía actual: ${photo.caption}` : photo.caption}
                        className={`maia-polaroid maia-polaroid--layer-${photo.offset}`}
                        key={photo.src}
                        onClick={advance}
                        type="button"
                    >
                        <span className="maia-polaroid__image">
                            <img
                                alt={`Daniela Itzel — ${photo.caption}`}
                                decoding="async"
                                loading={photo.offset === 0 ? 'eager' : 'lazy'}
                                src={photo.src}
                                style={{ objectPosition: photo.position }}
                            />
                        </span>
                        <span className="maia-polaroid__caption">{photo.caption}</span>
                    </button>
                ))}
            </div>

            <div className="maia-gallery__controls" data-reveal>
                <div className="maia-gallery__dots" aria-label="Seleccionar fotografía">
                    {galleryPhotos.map((photo, index) => (
                        <button
                            aria-label={`Ver fotografía ${index + 1}: ${photo.caption}`}
                            aria-pressed={index === activePhoto}
                            className={index === activePhoto ? 'is-active' : ''}
                            key={photo.src}
                            onClick={() => setActivePhoto(index)}
                            type="button"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

function PortraitInterlude() {
    return (
        <section className="maia-dress" aria-label="Retrato de Daniela Itzel">
            <div className="maia-dress__image" />
            <div className="maia-dress__card" data-reveal>
                <p>Mis XV años</p>
                <div className="maia-dress__line" />
                <h2>Una noche para guardar en el corazón</h2>
                <span>22 · Agosto · 2026</span>
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
                <p>Un detalle especial</p>
                <h2>Lluvia<br />de sobres</h2>
                <span>
                    Tu presencia es mi mejor regalo. Si deseas obsequiarme un detalle adicional,
                    tendremos lluvia de sobres el día del evento.
                </span>
            </div>
            <div className="maia-transfer" data-reveal>
                <Landmark size={27} strokeWidth={1.35} />
                <p>Otra forma de acompañarme</p>
                <h3>Transferencia</h3>
                <span>
                    No es necesario estar cerca para hacerme sentir tu amor y cariño.
                    Si así lo prefieres, puedes realizar una transferencia.
                </span>
                <dl>
                    <div>
                        <dt>Banco</dt>
                        <dd>Banco Aurora</dd>
                    </div>
                    <div>
                        <dt>Beneficiaria</dt>
                        <dd>Daniela Itzel</dd>
                    </div>
                    <div>
                        <dt>CLABE</dt>
                        <dd>0000 •••• •••• •••• 00</dd>
                    </div>
                </dl>
                <small>Datos de muestra · pendientes de confirmar</small>
            </div>
        </section>
    )
}

function RSVP() {
    const [name, setName] = useState('')
    const [guests, setGuests] = useState('1')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const submit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        try {
            const { addConfirmation } = await import('../../utils/rsvpStore')
            await addConfirmation('daniela-itzel', {
                name,
                guests: parseInt(guests),
                message: message.trim(),
            })
            setSubmitted(true)
        } catch (err) {
            console.error('Error saving RSVP:', err)
            window.alert('No pudimos guardar tu confirmación. Por favor, inténtalo nuevamente.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="maia-rsvp">
            <div className="maia-rsvp__content">
                {submitted ? (
                    <div className="maia-rsvp__success animate-fade-in" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                            <Heart size={40} className="animate-pulse" fill="currentColor" style={{ color: 'var(--maia-moss)' }} />
                        </div>
                        <h2 style={{ fontFamily: 'Italiana, Georgia, serif', fontSize: '2.5rem', fontWeight: '400', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>¡Muchas gracias!</h2>
                        <p style={{ color: '#ddd7c8', fontFamily: 'Italiana, Georgia, serif', fontSize: '1.1rem', lineHeight: '1.65' }}>Tu confirmación ha sido registrada exitosamente.</p>
                    </div>
                ) : (
                    <>
                        <SectionTitle eyebrow="RSVP" light>
                            ¿Me acompañas<br /><em>a celebrar?</em>
                        </SectionTitle>
                        <p data-reveal>
                            Tu asistencia es muy importante para nosotros.<br />
                            Confirma tu asistencia aquí.
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
                            <label>
                                <span>Mensaje (opcional)</span>
                                <textarea
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    placeholder="Escribe un mensaje para mí"
                                    maxLength={100}
                                />
                                <div style={{ fontSize: '0.62rem', textAlign: 'right', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.35rem', letterSpacing: '0.05em' }}>
                                    {message.length} / 100 caracteres
                                </div>
                            </label>
                            <button className="maia-button maia-button--light" type="submit" disabled={submitting}>
                                <Heart size={17} /> {submitting ? 'Enviando...' : 'Confirmar asistencia'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </section>
    )
}

export default function DanielaItzelInvitation({ portfolioMode = false }) {
    const rootRef = useRef(null)

    useEffect(() => {
        const previousTitle = document.title
        document.title = 'Mis XV | Daniela Itzel'

        const description = 'Acompáñame a celebrar mis XV años el sábado 22 de agosto de 2026.'
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
        upsertMeta('og:title', 'Mis XV | Daniela Itzel')
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
                '--maia-tree-photo': `url("${countdownPhoto}")`,
                '--maia-river-photo': `url("${heroPhoto}")`,
                '--maia-river-portrait': `url("${rsvpPhoto}")`,
                '--maia-dress-photo': `url("${familyPhoto}")`,
            }}
        >
            <MusicControl />
            <Hero />
            <NameReveal />
            <Family />
            <DateAndCountdown />
            <Locations />
            <Itinerary />
            <PolaroidGallery hidden={portfolioMode} />
            <PortraitInterlude />
            <Gifts />
            <RSVP />
            <footer className="maia-footer">
                <p>Con cariño</p>
                <h2>Daniela Itzel</h2>
                <span>22 · AGOSTO · 2026</span>
                <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Hecho con Invita-Ya.com</a>
            </footer>
        </main>
    )
}
