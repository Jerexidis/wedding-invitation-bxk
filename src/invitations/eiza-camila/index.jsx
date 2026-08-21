import { useEffect, useRef, useState } from 'react'
import {
    CalendarPlus,
    ChevronDown,
    Church,
    Clock3,
    Check,
    Copy,
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
import heroPhoto from './assets/eiza-hero.webp'
import heroMobilePhoto from './assets/eiza-hero-mobile.webp'
import familyPhoto from './assets/eiza-family.webp'
import xvPortraitPhoto from './assets/eiza-xv-portrait.webp'
import countdownPhoto from './assets/eiza-countdown.webp'
import ceremonyPhoto from './assets/eiza-ceremony.webp'
import receptionPhoto from './assets/eiza-reception.webp'
import './invitation.css'

gsap.registerPlugin(ScrollTrigger)

const EVENT_DATE = '2026-09-19T18:00:00-06:00'
const WHATSAPP = '524494340456'
const AUDIO = '/invitations/eiza-camila/audio/Stop%20Waiting%20-%20Cigarettes%20After%20Sex.mp3'

const locations = [
    {
        kind: 'Misa',
        name: 'Santuario de Nuestra Señora de Guadalupe',
        detail: 'Calle Guadalupe No. 213, Barrio de Guadalupe',
        time: '6:00 pm',
        image: ceremonyPhoto,
        imageAlt: 'Santuario de Nuestra Señora de Guadalupe',
        imagePosition: 'center 42%',
        maps: 'https://maps.app.goo.gl/cBZXHdjbAMzUvgi48?g_st=aw',
        icon: Church,
    },
    {
        kind: 'Recepción',
        name: 'Le Fiore Salón de Eventos',
        detail: 'Av. Siglo XXI No. 3840, Rancho Santa Mónica',
        time: '8:00 pm',
        image: receptionPhoto,
        imageAlt: 'Le Fiore Salón de Eventos',
        imagePosition: 'center 48%',
        maps: 'https://maps.app.goo.gl/3YdYJsEEcxxiA5xB8?g_st=aw',
        icon: Sparkles,
    },
]

const itinerary = [
    { time: '8:15 pm', label: 'Llegada de la quinceañera', icon: Sparkles },
    { time: '8:45 pm', label: 'Cena', icon: UtensilsCrossed },
    { time: '9:00 pm', label: 'Mariachi', icon: Music2 },
    { time: '10:00 pm', label: 'Vals', icon: Music2 },
    { time: '10:48 pm', label: 'Baile sorpresa', icon: Sparkles },
    { time: '11:00 pm', label: 'Baile', icon: PartyPopper },
    { time: '2:00 am', label: 'Fin de la fiesta', icon: Heart },
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
                <img src={heroPhoto} alt="Eiza Camila en sesión de fotos" className="maia-hero__photo" data-parallax />
            </picture>
            <div className="maia-hero__shade" />
            <div className="maia-hero__copy">
                <p>Mi cuento comienza</p>
                <h1>Mis <span>XV</span></h1>
                <blockquote>
                    Hay momentos en la vida que imaginamos desde niñas.
                </blockquote>
                <span className="maia-hero__date">19 · 09 · 2026</span>
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
            <h2 data-reveal>Eiza <span>Camila</span></h2>
            <div className="maia-name__invitation" data-reveal>
                <span>En compañía de</span>
                <strong>mi familia y seres queridos</strong>
                <p>Hoy, con el corazón lleno de ilusión, quiero compartir contigo la magia de mis quince años.</p>
            </div>
        </section>
    )
}

function Family() {
    return (
        <section className="maia-family">
            <div className="maia-family__portrait">
                <img src={familyPhoto} alt="Eiza Camila con su vestido azul" loading="lazy" data-parallax />
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
                    <h3>Gustavo Mata Hernández</h3>
                    <b>&</b>
                    <h3>Brenda Jaqueline Gutiérrez Muñoz</h3>
                    <Flower2 className="maia-family-card__flower" size={32} strokeWidth={1.15} />
                </article>
                <article className="maia-family-card maia-family-card--reverse" data-reveal>
                    <span>Mis padrinos</span>
                    <p>Y la compañía de</p>
                    <h3>Nley Gutiérrez Muñoz</h3>
                    <b>&</b>
                    <h3>Juan Everardo Gutiérrez Muñoz</h3>
                    <Flower2 className="maia-family-card__flower" size={32} strokeWidth={1.15} />
                </article>
            </div>
        </section>
    )
}

function FifteenPortrait() {
    return (
        <section className="daniela-xv-moment" aria-label="Retrato especial de Eiza Camila">
            <img
                src={xvPortraitPhoto}
                alt="Eiza Camila en su retrato de XV años"
                loading="lazy"
            />
            <div className="daniela-xv-moment__veil" />
            <div className="daniela-xv-moment__copy" data-reveal>
                <span>Mis XV años</span>
                <blockquote>Hay momentos en la vida que imaginamos desde niñas. Hoy, con el corazón lleno de ilusión, quiero compartir contigo la magia de mis quince años.</blockquote>
                <p>Eiza Camila</p>
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

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('XV años de Eiza Camila')}&dates=20260920T000000Z/20260920T060000Z&details=${encodeURIComponent('Acompáñame a celebrar mis XV años.')}&location=${encodeURIComponent('Santuario de Nuestra Señora de Guadalupe, Calle Guadalupe No. 213, Barrio de Guadalupe')}`

    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent('XV años de Eiza Camila')}&body=${encodeURIComponent('Acompáñame a celebrar mis XV años.')}&startdt=2026-09-19T18:00:00-06:00&enddt=2026-09-20T02:00:00-06:00&location=${encodeURIComponent('Santuario de Nuestra Señora de Guadalupe, Calle Guadalupe No. 213, Barrio de Guadalupe')}`

    const openAppleCalendar = () => {
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//XV Eiza Camila//ES',
            'BEGIN:VEVENT',
            'DTSTART:20260920T000000Z',
            'DTEND:20260920T080000Z',
            'SUMMARY:XV años de Eiza Camila',
            'DESCRIPTION:Acompáñame a celebrar mis XV años.',
            'LOCATION:Santuario de Nuestra Señora de Guadalupe, Calle Guadalupe No. 213, Barrio de Guadalupe',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n')

        const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent)
        window.open(dataUri, '_blank')
    }

    return (
        <section className="maia-date">
            <div className="maia-date__paper">
                <p className="maia-date__month" data-reveal>Septiembre</p>
                <div className="maia-date__calendar" data-reveal>
                    <span>Sábado</span>
                    <strong>19</strong>
                    <span>2026</span>
                </div>
                <p className="maia-date__phrase" data-reveal>
                    "Los momentos compartidos con quienes amamos se vuelven recuerdos para siempre."
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
            <p className="maia-locations__note" data-reveal style={{ textAlign: 'center', margin: '-1.8rem auto 2.5rem', maxWidth: '30rem', fontFamily: 'Italiana, Georgia, serif', fontSize: '1rem', lineHeight: '1.65', color: 'var(--maia-ink)' }}>
                Te invitamos cordialmente a acompañarnos a la misa de acción de gracias para compartir juntos esta gran bendición.
            </p>
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

function DressCode() {
    const reservedColors = [
        { color: '#8BA8C8', label: 'Azul plumbago' },
        { color: '#87CEEB', label: 'Azul cielo' },
        { color: '#6A9FD1', label: 'Azul medio' },
        { color: '#4A82B0', label: 'Azul profundo' },
    ]

    return (
        <section className="daniela-dress-code">
            <div className="daniela-dress-code__inner">
                <SectionTitle eyebrow="Una nota para celebrar">
                    Código de<br /><em>vestimenta</em>
                </SectionTitle>
                <p className="daniela-dress-code__style" data-reveal>Formal</p>
                <div className="daniela-dress-code__notice" data-reveal>
                    <strong>Reserva de color para la quinceañera</strong>
                    <p>Los tonos de azul están reservados exclusivamente para Eiza. Te agradecemos elegir un color distinto para acompañarnos.</p>
                </div>
                <div className="daniela-dress-code__palette" aria-label="Colores reservados para la quinceañera" data-reveal style={{ marginTop: '2.2rem' }}>
                    {reservedColors.map((swatch) => (
                        <span
                            aria-label={swatch.label}
                            key={swatch.color}
                            role="img"
                            style={{ '--swatch-color': swatch.color }}
                        />
                    ))}
                </div>
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
        </section>
    )
}

function RSVP() {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const submit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        const waMessage = `✨ ¡Hola! Soy ${name}.\n\n🌸 Confirmo mi asistencia a los XV años de Eiza Camila 👑${message.trim() ? `\n\n💌 Mensaje: "${message.trim()}"` : ''}\n\n¡Nos vemos para celebrar este día tan especial! 🥳💖`
        const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMessage)}`
        const whatsappWindow = window.open(whatsappUrl, '_blank')

        if (whatsappWindow) {
            whatsappWindow.opener = null
        }

        try {
            const { addConfirmation } = await import('../../utils/rsvpStore')
            await addConfirmation('eiza-camila', {
                name,
                guests: 1,
                message: message.trim(),
            })
            setSubmitted(true)
        } catch (err) {
            console.error('Error saving RSVP:', err)
            setSubmitted(true)
        } finally {
            if (!whatsappWindow) {
                window.location.href = whatsappUrl
            }
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
                        <p style={{ fontSize: '0.75rem', marginTop: '1.5rem', opacity: 0.7, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Completa el envío en WhatsApp.</p>
                    </div>
                ) : (
                    <>
                        <SectionTitle eyebrow="RSVP" light>
                            ¿Me acompañas<br /><em>a celebrar?</em>
                        </SectionTitle>
                        <p data-reveal>
                            Tu asistencia es muy importante para nosotros.<br />
                            Al abrir WhatsApp, toca Enviar para completar tu confirmación.
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
                                <Heart size={17} /> {submitting ? 'Abriendo...' : 'Confirmar por WhatsApp'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </section>
    )
}

export default function EizaCamilaInvitation({ portfolioMode = false }) {
    const rootRef = useRef(null)

    useEffect(() => {
        const previousTitle = document.title
        document.title = 'Mis XV | Eiza Camila'

        const description = 'Acompáñame a celebrar mis XV años el sábado 19 de septiembre de 2026.'
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
        upsertMeta('og:title', 'Mis XV | Eiza Camila')
        upsertMeta('og:description', description)
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
                '--maia-river-portrait': `url("${xvPortraitPhoto}")`,
                '--maia-dress-photo': `url("${familyPhoto}")`,
            }}
        >
            <MusicControl />
            <Hero />
            <NameReveal />
            <Family />
            <FifteenPortrait />
            <DateAndCountdown />
            <Locations />
            <DressCode />
            <Gifts />
            <Itinerary />
            <RSVP />
            <footer className="maia-footer">
                <p>Con cariño</p>
                <h2>Eiza Camila</h2>
                <span>19 · SEPTIEMBRE · 2026</span>
                <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Hecho con Invita-Ya.com</a>
            </footer>
        </main>
    )
}
