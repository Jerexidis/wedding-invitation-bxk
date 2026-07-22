import { useEffect, useRef, useState } from 'react'
import {
    CalendarDays,
    Check,
    ChevronDown,
    Church,
    Clock3,
    Copy,
    CreditCard,
    Gift,
    Heart,
    MapPin,
    Music2,
    Navigation,
    Sparkles,
    UtensilsCrossed,
} from 'lucide-react'
import './invitation.css'

const SLUG = 'angelica-y-salvador'
const BASE = `/invitations/${SLUG}`
const EVENT_DATE = '2026-08-22T19:00:00-06:00'
const WHATSAPP = '524491579941'

const photos = Array.from({ length: 7 }, (_, index) => `${BASE}/img/photo-${index + 1}.webp`)

const events = [
    {
        type: 'Ceremonia',
        name: 'Templo Sagrado Corazón de Jesús',
        address: 'Residencial Los Fresnos, 20328 Aguascalientes, Ags.',
        time: '7:00 pm',
        maps: 'https://maps.app.goo.gl/Dvycn1zoVNWD6LqY8?g_st=iw',
        icon: Church,
        photo: `${BASE}/img/venue-church.webp`,
    },
    {
        type: 'Recepción',
        name: 'Jardín Las Palmeras',
        address: 'Antiguo Camino a San Ignacio km 1, San Ignacio, 20326 Aguascalientes, Ags.',
        time: '8:30 pm',
        maps: 'https://maps.app.goo.gl/kJmcjFGPvbeaFe4i8?g_st=iw',
        icon: Sparkles,
        photo: `${BASE}/img/venue-reception-garden-v2.webp`,
    },
]

const itinerary = [
    { time: '7:00 pm', label: 'Ceremonia', icon: Church },
    { time: '8:30 pm', label: 'Recepción', icon: MapPin },
    { time: '9:30 pm', label: 'Cena', icon: UtensilsCrossed },
    { time: '2:00 am', label: 'Fin del evento', icon: Sparkles },
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
    if (!active) return null
    return (
        <button className="ays-music" type="button" disabled aria-label="Música próximamente">
            <Music2 size={16} />
            <span>Próximamente</span>
        </button>
    )
}

function Opening({ onOpen }) {
    return (
        <div className="ays-opening">
            <img src={photos[4]} alt="Angélica y Salvador" />
            <div className="ays-opening__veil" />
            <div className="ays-opening__content">
                <p>Nos casamos</p>
                <h1><span>Angélica</span><b>&</b><span>Salvador</span></h1>
                <time>22 · 08 · 2026</time>
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
            <img src={photos[2]} alt="Angélica y Salvador celebrando su compromiso" className="ays-hero__photo" />
            <div className="ays-hero__overlay" />
            <div className="ays-hero__copy" data-reveal>
                <p>Nos casamos</p>
                <h1>Angélica <i>&</i> Salvador</h1>
                <time>22 · 08 · 2026</time>
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
            <h2 data-reveal>Angélica Yatzel Carlos Díaz <i>&</i> Salvador Rangel López</h2>
            <blockquote data-reveal>
                “La palabra amor tuvo sentido cuando nos encontramos y este amor es un sueño que se ha hecho realidad; por eso queremos que tú lo vivas con nosotros.”
            </blockquote>
            <p data-reveal>Hemos decidido compartir la vida…<br /><strong>¡Y este día especial contigo!</strong></p>
        </section>
    )
}

function SaveTheDate() {
    return (
        <section className="ays-save-date">
            <div className="ays-save-date__photo" data-reveal>
                <img src={photos[1]} alt="Propuesta de matrimonio de Angélica y Salvador frente al mar" loading="lazy" />
            </div>
            <div className="ays-save-date__card" data-reveal>
                <p>Save the date</p>
                <strong>22 · 08 · 26</strong>
                <span>Sábado</span>
                <CalendarDays size={28} strokeWidth={1.2} />
                <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda%20de%20Ang%C3%A9lica%20y%20Salvador&dates=20260823T010000Z%2F20260823T080000Z&details=Acomp%C3%A1%C3%B1anos%20a%20celebrar%20nuestra%20boda.&location=Templo%20Sagrado%20Coraz%C3%B3n%20de%20Jes%C3%BAs%2C%20Aguascalientes"
                    target="_blank"
                    rel="noreferrer"
                >
                    Agregar al calendario
                </a>
            </div>
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
            <blockquote data-reveal>“Mi esposo cuidará de mí, yo cuidaré de él y Dios de nosotros.”</blockquote>
        </section>
    )
}

function Family() {
    return (
        <section className="ays-family">
            <SectionTitle eyebrow="Con la bendición de Dios y de">Nuestros padres</SectionTitle>
            <div className="ays-family__grid">
                <article data-reveal>
                    <span>Padres de la novia</span>
                    <h3>Mauricio Carlos López</h3>
                    <b>&</b>
                    <h3>Angélica Díaz Becerra</h3>
                </article>
                <article data-reveal>
                    <span>Padres del novio</span>
                    <h3>Salvador Rangel</h3>
                    <b>&</b>
                    <h3>Rosario López</h3>
                </article>
            </div>
            <div className="ays-padrinos" data-reveal>
                <span>Nuestros padrinos</span>
                <h3>Adrián Carlos López <b>&</b> Maribel Chalico</h3>
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
                            <div className="ays-event__photo"><img src={event.photo} alt="Angélica y Salvador" loading="lazy" /></div>
                            <div className="ays-event__body">
                                <Icon size={30} strokeWidth={1.15} />
                                <p>{event.type}</p>
                                <h3>{event.name}</h3>
                                <time><Clock3 size={15} /> {event.time}</time>
                                <address>{event.address}</address>
                                <a href={event.maps} target="_blank" rel="noreferrer"><Navigation size={16} /> Ir a ubicación</a>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

function DressCode() {
    const colors = [
        ['Blanco', '#f8f7f0'], ['Beige', '#d8c7a1'], ['Tinto', '#6f1830'], ['Rojo', '#a81f28'],
    ]
    return (
        <section className="ays-dress">
            <SectionTitle eyebrow="Código de vestimenta" light>Etiqueta</SectionTitle>
            <div className="ays-dress__looks" data-reveal>
                <article><span>Él</span><h3>Smoking o traje</h3></article>
                <i />
                <article><span>Ella</span><h3>Vestido largo</h3></article>
            </div>
            <p className="ays-dress__note" data-reveal>No usar mezclilla ni vestido corto.</p>
            <p className="ays-dress__label" data-reveal>Colores reservados</p>
            <div className="ays-colors" data-reveal>
                {colors.map(([name, color]) => <div key={name}><i style={{ background: color }} /><span>{name}</span></div>)}
            </div>
            <div className="ays-children" data-reveal><Heart size={18} fill="currentColor" /> Evento con niños</div>
        </section>
    )
}

function Itinerary() {
    return (
        <section className="ays-itinerary">
            <img src={photos[0]} alt="Angélica y Salvador" loading="lazy" />
            <div className="ays-itinerary__overlay" />
            <div className="ays-itinerary__content">
                <SectionTitle eyebrow="Nuestro gran día" light>Itinerario</SectionTitle>
                <div className="ays-itinerary__line">
                    {itinerary.map((item) => {
                        const Icon = item.icon
                        return <div key={item.label} data-reveal><Icon size={25} strokeWidth={1.15} /><span>{item.label}</span><time>{item.time}</time></div>
                    })}
                </div>
            </div>
        </section>
    )
}

function Gifts() {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState('')
    const copy = async (value, owner) => {
        await navigator.clipboard.writeText(value)
        setCopied(owner)
        window.setTimeout(() => setCopied(''), 1800)
    }
    return (
        <section className="ays-gifts">
            <SectionTitle eyebrow="Sugerencia de regalo">Mesa de regalos</SectionTitle>
            <Gift size={34} strokeWidth={1.1} data-reveal />
            <p data-reveal><strong>¡Su presencia será nuestro mejor regalo!</strong><br />Sin embargo, si deseas tener algún detalle con nosotros, te compartimos algunas opciones.</p>
            <div className="ays-gifts__options" data-reveal>
                <div><Gift size={22} strokeWidth={1.4} /><strong>Regalo en sobre</strong></div>
                <button type="button" onClick={() => setOpen((value) => !value)}><CreditCard size={22} strokeWidth={1.4} /><strong>Datos bancarios</strong><ChevronDown size={17} /></button>
            </div>
            {open && (
                <div className="ays-bank">
                    {[
                        ['Salvador Rangel', '4152314368407931'],
                        ['Yatzel Díaz', '4152314136113365'],
                    ].map(([owner, account]) => (
                        <button type="button" key={owner} onClick={() => copy(account, owner)}>
                            <span><small>{owner}</small><strong>{account.replace(/(.{4})/g, '$1 ').trim()}</strong></span>
                            {copied === owner ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    ))}
                </div>
            )}
        </section>
    )
}

function Gallery({ hidden }) {
    if (hidden) return null
    const layout = [photos[4], photos[5], photos[6], photos[3], photos[1], photos[0]]
    return (
        <section className="ays-gallery">
            <SectionTitle eyebrow="Nuestra historia">Momentos para siempre</SectionTitle>
            <div className="ays-gallery__grid">
                {layout.map((photo, index) => <img key={photo} src={photo} alt={`Recuerdo de Angélica y Salvador ${index + 1}`} loading="lazy" data-reveal />)}
            </div>
        </section>
    )
}

function RSVP() {
    const [form, setForm] = useState({ name: '', guests: '1', message: '', attendance: 'yes' })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const submit = async (event) => {
        event.preventDefault()
        if (!form.name.trim()) return
        setSubmitting(true)
        const attending = form.attendance === 'yes'
        const guests = attending ? Number(form.guests) : 0
        const status = attending ? 'Sí asistiremos' : 'No podremos asistir'
        const text = `¡Hola! Soy ${form.name.trim()}.\n\n${attending ? '✨ Confirmo mi asistencia' : 'Con mucho cariño, no podré acompañarlos'} a la boda de Angélica y Salvador.\n${attending ? `👥 Asistentes: ${guests}\n` : ''}${form.message.trim() ? `💌 Mensaje: ${form.message.trim()}\n` : ''}\n${attending ? '¡Nos vemos para celebrar!' : 'Les deseamos toda la felicidad.'}`
        try {
            const { addConfirmation } = await import('../../utils/rsvpStore')
            await addConfirmation(SLUG, { name: form.name.trim(), guests, message: `${attending ? '🟢' : '🔴'} ${status}${form.message.trim() ? ` · ${form.message.trim()}` : ''}` })
        } catch (error) {
            console.error('No se pudo guardar el RSVP en el panel:', error)
        }
        setSubmitted(true)
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
        setSubmitting(false)
    }

    return (
        <section className="ays-rsvp">
            <div className="ays-rsvp__photo"><img src={photos[1]} alt="Propuesta de matrimonio de Angélica y Salvador" loading="lazy" /></div>
            <div className="ays-rsvp__card">
                {submitted ? (
                    <div className="ays-rsvp__thanks"><Check size={30} /><h2>¡Gracias!</h2><p>Tu respuesta fue registrada y WhatsApp se abrió para completar la confirmación.</p></div>
                ) : (
                    <>
                        <SectionTitle eyebrow="Para nosotros es importante saber si podrás acompañarnos">Confirmación de asistencia</SectionTitle>
                        <p>Por favor, envía tu asistencia. Los amamos mucho y nos vemos muy pronto.</p>
                        <form onSubmit={submit}>
                            <label>Nombre completo<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                            <div className="ays-rsvp__choice">
                                <button className={form.attendance === 'yes' ? 'is-active' : ''} type="button" onClick={() => setForm({ ...form, attendance: 'yes' })}>Sí asistiré</button>
                                <button className={form.attendance === 'no' ? 'is-active' : ''} type="button" onClick={() => setForm({ ...form, attendance: 'no' })}>No podré asistir</button>
                            </div>
                            {form.attendance === 'yes' && <label>Número de asistentes<select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></label>}
                            <label>Mensaje para los novios<textarea rows="3" maxLength="240" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
                            <button className="ays-rsvp__submit" type="submit" disabled={submitting}>{submitting ? 'Enviando…' : 'Confirmar por WhatsApp'}</button>
                        </form>
                    </>
                )}
            </div>
        </section>
    )
}

export default function AngelicaYSalvador({ hideGallery = false }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const previous = document.title
        document.title = 'Nuestra Boda | Angélica & Salvador'
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
                    <Countdown />
                    <Family />
                    <Events />
                    <DressCode />
                    <Itinerary />
                    <Gifts />
                    <Gallery hidden={hideGallery} />
                    <RSVP />
                    <footer className="ays-footer">
                        <Heart size={22} fill="currentColor" />
                        <h2>Angélica <i>&</i> Salvador</h2>
                        <p>Los amamos mucho y nos vemos muy pronto.</p>
                        <time>22 · 08 · 2026</time>
                    </footer>
                </main>
            )}
        </div>
    )
}
