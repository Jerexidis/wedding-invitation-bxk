import { useEffect, useRef, useState } from 'react'
import {
    CalendarDays,
    Check,
    ChevronDown,
    Church,
    Clock3,
    CreditCard,
    Gift,
    Heart,
    MapPin,
    Music2,
    Navigation,
    Pause,
    Sparkles,
    UtensilsCrossed,
} from 'lucide-react'
import './invitation.css'

const SLUG = 'boda-pamela-y-alfredo'
const BASE = `/invitations/${SLUG}`
const EVENT_DATE = '2027-01-08T17:00:00-06:00'
const WHATSAPP = '524494371541'
const AUDIO = `${BASE}/audio/cancion-de-boda.mp3`

const photos = Array.from({ length: 6 }, (_, index) => `${BASE}/img/photo-${index + 1}.webp`)

const events = [
    {
        type: 'Ceremonia religiosa',
        name: 'Templo de San Antonio de Padua',
        address: 'Calle Pedro Parga 252, Zona Centro, Aguascalientes, Ags.',
        time: '17:00 horas',
        maps: 'https://www.google.com/maps/place/Templo+de+San+Antonio+de+Padua/@21.9265178,-102.3084633,15z/data=!4m6!3m5!1s0x8429ee65abbd28af:0x4980ad55b56d0870!8m2!3d21.885528!4d-102.2917237!16s%2Fg%2F120scw24?entry=ttu',
        icon: Church,
        photo: `${BASE}/img/venue-church.webp`,
        photoAlt: 'Fachada del Templo de San Antonio de Padua',
    },
    {
        type: 'Recepción',
        name: 'Arrayan Jardín Social',
        address: 'Av. Primero de Diciembre 232, Aguascalientes, Ags.',
        time: '19:00 horas',
        maps: 'https://www.google.com/maps/place/ARRAYAN+Jard%C3%ADn+Social/@21.9143432,-102.3433629,17z/data=!3m1!4b1!4m6!3m5!1s0x8429efa2c14a01cf:0xbcc644a7c495596!8m2!3d21.9143432!4d-102.340788!16s%2Fg%2F11md37ycwb?entry=ttu',
        icon: Sparkles,
        photo: `${BASE}/img/venue-reception.webp`,
        photoAlt: 'Entrada de Arrayan Jardín Social',
    },
]

const itinerary = [
    { time: '17:00', label: 'Ceremonia religiosa', icon: Church },
    { time: '18:45', label: 'Ceremonia civil', icon: Heart },
    { time: '19:00', label: 'Recepción', icon: MapPin },
    { time: '20:00', label: 'Brindis', icon: Sparkles },
    { time: '20:30', label: 'Cena', icon: UtensilsCrossed },
    { time: '22:00', label: 'Fiesta', icon: Music2 },
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
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (!active || !ready || !audioRef.current) return
        audioRef.current.play().catch(() => setPlaying(false))
    }, [active, ready])

    const toggle = async () => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) await audio.play().catch(() => setPlaying(false))
        else audio.pause()
    }

    return (
        <>
            <audio ref={audioRef} src={AUDIO} preload="metadata" loop onCanPlay={() => setReady(true)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
            {active && ready && (
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
            <img src={photos[5]} alt="Pamela y Alfredo al atardecer" />
            <div className="ays-opening__veil" />
            <div className="ays-opening__content">
                <p>Nos casamos</p>
                <h1><span>Pamela</span><b>&</b><span>Alfredo</span></h1>
                <time>08 · 01 · 2027</time>
                <button type="button" onClick={onOpen}><Heart size={17} fill="currentColor" />Abrir invitación</button>
            </div>
        </div>
    )
}

function Hero() {
    return (
        <header className="ays-hero">
            <img src={photos[2]} alt="Pamela y Alfredo celebrando su compromiso" className="ays-hero__photo" />
            <div className="ays-hero__overlay" />
            <div className="ays-hero__copy" data-reveal>
                <p>Nuestra boda</p>
                <h1>Pamela <i>&</i> Alfredo</h1>
                <time>08 · 01 · 2027</time>
            </div>
            <button type="button" className="ays-scroll" onClick={() => document.querySelector('#bienvenida')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Descubre nuestra invitación</span><ChevronDown size={18} />
            </button>
        </header>
    )
}

function Quote() {
    return (
        <section className="ays-quote" id="bienvenida">
            <Heart size={24} strokeWidth={1.1} data-reveal />
            <h2 data-reveal>Pamela Gonzalez <i>&</i> Alfredo Lara</h2>
            <blockquote data-reveal>“Con mucha ilusión queremos compartir con ustedes uno de los días más importantes de nuestras vidas.”</blockquote>
            <p data-reveal>Gracias por acompañarnos a celebrar<br /><strong>el inicio de esta nueva etapa.</strong></p>
        </section>
    )
}

function SaveTheDate() {
    return (
        <section className="ays-save-date">
            <div className="ays-save-date__photo" data-reveal><img src={photos[3]} alt="Propuesta de matrimonio de Pamela y Alfredo" loading="lazy" /></div>
            <div className="ays-save-date__card" data-reveal>
                <p>Save the date</p><strong>08 · 01 · 27</strong><span>Viernes</span>
                <CalendarDays size={28} strokeWidth={1.2} />
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda%20de%20Pamela%20y%20Alfredo&dates=20270108T230000Z%2F20270109T100000Z&details=Acomp%C3%A1%C3%B1anos%20a%20celebrar%20nuestra%20boda.&location=Templo%20de%20San%20Antonio%20de%20Padua%2C%20Aguascalientes" target="_blank" rel="noreferrer">Agregar al calendario</a>
            </div>
        </section>
    )
}

function Countdown() {
    const time = useCountdown()
    return (
        <section className="ays-countdown">
            <p data-reveal>Prepárate para el gran día</p><h2 data-reveal>Solo faltan</h2>
            <div className="ays-countdown__grid" data-reveal>
                {Object.entries({ Días: time.days, Horas: time.hours, Minutos: time.minutes, Segundos: time.seconds }).map(([label, value]) => (
                    <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>
                ))}
            </div>
            <blockquote data-reveal>“El mejor lugar del mundo siempre será donde estemos juntos.”</blockquote>
        </section>
    )
}

function Padrinos() {
    return (
        <section className="ays-family">
            <SectionTitle eyebrow="Con la bendición de Dios y el cariño de">Nuestros padrinos</SectionTitle>
            <div className="ays-padrinos ays-padrinos--featured" data-reveal>
                <span>Padrinos de velación</span><h3>Gerardo Lara <b>&</b> Alejandra Nava</h3>
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
                            <div className="ays-event__photo"><img src={event.photo} alt={event.photoAlt} loading="lazy" /></div>
                            <div className="ays-event__body">
                                <Icon size={30} strokeWidth={1.15} /><p>{event.type}</p><h3>{event.name}</h3>
                                <time><Clock3 size={15} /> {event.time}</time><address>{event.address}</address>
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
        ['Blanco', '#f8f7f0'], ['Beige', '#d8c5aa'], ['Nude', '#e4c9b5'], ['Champagne', '#ead9b9'],
        ['Gris claro', '#d8d9da'], ['Rosa claro', '#edc5c8'], ['Rojo', '#b5443e'],
    ]
    return (
        <section className="ays-dress">
            <SectionTitle eyebrow="Código de vestimenta" light>Elegante</SectionTitle>
            <p className="ays-dress__weather" data-reveal>El clima será frío. Te recomendamos llevar algo abrigador para la noche.</p>
            <div className="ays-dress__looks" data-reveal>
                <article><span>Mujeres</span><h3>Vestido largo o debajo de la rodilla</h3></article><i />
                <article><span>Hombres</span><h3>Saco o camisa lisa</h3></article>
            </div>
            <figure className="ays-dress__reference" data-reveal>
                <img src={`${BASE}/img/dress-code-transparent.webp`} alt="Opciones de vestimenta elegante para mujeres y hombres" loading="lazy" />
            </figure>
            <p className="ays-dress__label" data-reveal>Colores reservados</p>
            <div className="ays-colors" data-reveal>
                {colors.map(([name, color]) => <div key={name}><i style={{ background: color }} /><span>{name}</span></div>)}
            </div>
            <p className="ays-dress__note" data-reveal>No hay una paleta obligatoria; los tonos mostrados son únicamente referencias.</p>
            <div className="ays-children" data-reveal><Heart size={18} fill="currentColor" /><span>Los niños permanecerán exclusivamente en el área de niñeras durante la ceremonia civil, brindis y vals.</span></div>
        </section>
    )
}

function Itinerary() {
    return (
        <section className="ays-itinerary">
            <img src={photos[4]} alt="Pamela y Alfredo" loading="lazy" /><div className="ays-itinerary__overlay" />
            <div className="ays-itinerary__content">
                <SectionTitle eyebrow="Nuestro gran día" light>Itinerario</SectionTitle>
                <div className="ays-itinerary__line">
                    {itinerary.map((item) => { const Icon = item.icon; return <div key={item.label} data-reveal><Icon size={25} strokeWidth={1.15} /><span>{item.label}</span><time>{item.time}</time></div> })}
                </div>
            </div>
        </section>
    )
}

function Gifts() {
    return (
        <section className="ays-gifts">
            <SectionTitle eyebrow="Sugerencia de regalo">Mesa de regalos</SectionTitle>
            <Gift size={34} strokeWidth={1.1} data-reveal />
            <p data-reveal><strong>¡Tu presencia será nuestro mejor regalo!</strong><br />Si deseas tener un detalle con nosotros, agradeceremos regalo en sobre o transferencia bancaria.</p>
            <div className="ays-gifts__options" data-reveal>
                <div><Gift size={22} strokeWidth={1.4} /><strong>Regalo en sobre</strong></div>
                <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, ¿me comparten por favor los datos para transferencia de Pamela y Alfredo?')}`} target="_blank" rel="noreferrer"><CreditCard size={22} strokeWidth={1.4} /><strong>Solicitar datos bancarios</strong></a>
            </div>
        </section>
    )
}

function Gallery({ hidden }) {
    if (hidden) return null
    return (
        <section className="ays-gallery">
            <SectionTitle eyebrow="Nuestra historia">Momentos para siempre</SectionTitle>
            <div className="ays-gallery__grid">{photos.map((photo, index) => <img key={photo} src={photo} alt={`Recuerdo de Pamela y Alfredo ${index + 1}`} loading="lazy" data-reveal />)}</div>
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
        const text = `¡Hola! Soy ${form.name.trim()}.\n\n${attending ? 'Confirmo mi asistencia' : 'Con mucho cariño, no podré acompañarlos'} a la boda de Pamela y Alfredo.\n${attending ? `Asistentes: ${guests}\n` : ''}${form.message.trim() ? `Mensaje: ${form.message.trim()}\n` : ''}\n${attending ? '¡Nos vemos para celebrar!' : 'Les deseamos toda la felicidad.'}`
        try {
            const { addConfirmation } = await import('../../utils/rsvpStore')
            await addConfirmation(SLUG, { name: form.name.trim(), guests, message: `${attending ? '🟢' : '🔴'} ${status}${form.message.trim() ? ` · ${form.message.trim()}` : ''}` })
        } catch (error) {
            console.error('No se pudo guardar el RSVP en el panel:', error)
        }
        setSubmitted(true)
        setSubmitting(false)
        window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
    }

    return (
        <section className="ays-rsvp">
            <div className="ays-rsvp__photo"><img src={photos[1]} alt="Pamela y Alfredo" loading="lazy" /></div>
            <div className="ays-rsvp__card">
                {submitted ? <div className="ays-rsvp__thanks"><Check size={30} /><h2>¡Gracias!</h2><p>Tu respuesta fue registrada y WhatsApp se abrió para completar la confirmación.</p></div> : (
                    <>
                        <SectionTitle eyebrow="Para nosotros es importante saber si podrás acompañarnos">Confirmación de asistencia</SectionTitle>
                        <p>Por favor, confirma tu asistencia. Nos hará muy felices celebrar contigo.</p>
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

export default function PamelaYAlfredo({ hideGallery = false }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const previous = document.title
        document.title = 'Nuestra Boda | Pamela & Alfredo'
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap'
        document.head.appendChild(link)
        return () => { document.title = previous; link.remove() }
    }, [])

    useEffect(() => {
        if (!open) return
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
            })
        }, { threshold: 0.12 })
        document.querySelectorAll('.ays-invitation [data-reveal]').forEach((node) => observer.observe(node))
        return () => observer.disconnect()
    }, [open])

    return (
        <div className="ays-invitation">
            <MusicControl active={open} />
            {!open ? <Opening onOpen={() => setOpen(true)} /> : (
                <main>
                    <Hero /><Quote /><SaveTheDate /><Countdown /><Padrinos /><Events /><DressCode /><Itinerary /><Gifts />
                    <Gallery hidden={hideGallery} /><RSVP />
                    <footer className="ays-footer">
                        <Heart size={22} fill="currentColor" /><h2>Pamela <i>&</i> Alfredo</h2>
                        <p>Gracias por ser parte de nuestra historia.</p><time>08 · 01 · 2027</time>
                    </footer>
                </main>
            )}
        </div>
    )
}
