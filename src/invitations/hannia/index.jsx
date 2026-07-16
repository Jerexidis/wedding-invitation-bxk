import { useEffect, useRef, useState } from 'react'
import { CalendarDays, Check, MapPin, MessageCircle, Music2, Navigation, Pause, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './party-template.css'

gsap.registerPlugin(ScrollTrigger)

const PARTY_CONFIG = {
    eyebrow: 'UNA AVENTURA MUY ESPECIAL',
    name: 'Hannia',
    age: '23',
    title: 'Cumpleaños',
    date: '2026-07-20T15:00:00-06:00',
    dateLabel: '20 de julio de 2026',
    timeLabel: '3:00 pm',
    location: {
        name: 'Casa López Reyes',
        address: 'Consulta la ubicación y la ruta en Google Maps.',
        mapsUrl: 'https://maps.app.goo.gl/bbF5TzZjXfg6HLuM7',
    },
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

function Hero({ config, onStartMusic }) {
    return (
        <header className="party-hero">
            <div className="party-hero__world" data-parallax />
            <div className="party-hero__wash" />
            <span className="party-cloud party-cloud--one" />
            <span className="party-cloud party-cloud--two" />

            <div className="party-hero__content">
                <p className="party-eyebrow" data-hero-item>{config.eyebrow}</p>

                <img
                    className="party-hero__logo"
                    src="/invitations/hannia/img/elements/birthday-time.png"
                    alt="Birthday Time with Hannia and friends"
                    data-hero-item
                />
                <h1 className="party-visually-hidden">Fiesta de {config.name} · {config.age} años</h1>

                <div className="party-cartoon-stage" data-hero-item>
                    <img
                        className="party-cartoon-hannia"
                        src="/invitations/hannia/img/elements/hannia-cartoon-v2.png"
                        alt="Ilustración de Hannia"
                    />
                    <span className="party-age-badge" aria-label={`${config.age} años`}>
                        <strong>{config.age}</strong>
                        <small>años</small>
                    </span>
                </div>

                <p className="party-hero__date" data-hero-item>
                    <strong>{config.dateLabel}</strong>
                    <span aria-hidden="true">★</span>
                    {config.timeLabel}
                </p>
            </div>

            <button
                className="party-scroll-cue"
                type="button"
                onClick={() => {
                    onStartMusic()
                    document.querySelector('#party-countdown')?.scrollIntoView({ behavior: 'smooth' })
                }}
                aria-label="Ver los detalles"
            >
                <span>Comienza la aventura</span>
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
            <img className="party-deco party-deco--jake-face" src="/invitations/hannia/img/elements/jake-face.png" alt="" data-drift aria-hidden="true" />
            <img className="party-deco party-deco--finn-stars" src="/invitations/hannia/img/elements/finn-stars.png" alt="" data-drift aria-hidden="true" />
            <img className="party-sticker party-sticker--snail" src="/invitations/hannia/img/stickers/snail.png" alt="" data-drift aria-hidden="true" />
            <img className="party-sticker party-sticker--bmo" src="/invitations/hannia/img/stickers/bmo.png" alt="" data-drift aria-hidden="true" />
            <div className="party-section__inner">
                <p className="party-kicker"><Sparkles size={17} /> Cuenta regresiva</p>
                <h2>{time.arrived ? '¡La fiesta es hoy!' : <>Falta poco para<br /><em>la aventura</em></>}</h2>
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
                <p className="party-date-lockup"><CalendarDays size={20} /> {config.dateLabel}</p>
                <p className="party-time-note">{config.timeLabel}</p>
            </div>
        </section>
    )
}

function Location({ config }) {
    const hasMaps = Boolean(config.location.mapsUrl)

    return (
        <section className="party-section party-location" data-section>
            <span className="party-grass" aria-hidden="true" />
            <img className="party-sticker party-sticker--lumpy" src="/invitations/hannia/img/stickers/lumpy-space-princess.png" alt="" aria-hidden="true" />
            <img className="party-sticker party-sticker--finn" src="/invitations/hannia/img/stickers/finn.png" alt="" aria-hidden="true" />
            <img className="party-sticker party-sticker--ice-king" src="/invitations/hannia/img/stickers/ice-king.png" alt="" aria-hidden="true" />
            <div className="party-section__inner">
                <p className="party-kicker"><MapPin size={17} /> Punto de encuentro</p>
                <h2>El reino de<br /><em>la fiesta</em></h2>

                <article className="party-location__card">
                    <div className="party-pin"><Navigation size={27} /></div>
                    <p className="party-location__label">Nos vemos en</p>
                    <h3>{config.location.name}</h3>
                    <p>{config.location.address}</p>
                    {hasMaps ? (
                        <a href={config.location.mapsUrl} target="_blank" rel="noreferrer">Abrir en Maps <span>↗</span></a>
                    ) : (
                        <span className="party-location__pending">Link de Maps próximamente</span>
                    )}
                </article>
            </div>
        </section>
    )
}

function RSVP({ embedded = false }) {
    const [attendance, setAttendance] = useState('yes')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            const { addConfirmation } = await import('../../utils/rsvpStore')
            const attendanceLabel = attendance === 'yes' ? 'Sí asisto' : 'No asisto'
            await addConfirmation('hannia', {
                name,
                guests: attendance === 'yes' ? 1 : 0,
                message: message ? `${attendanceLabel} · ${message}` : attendanceLabel,
            })
            setSubmitted(true)
        } catch (submissionError) {
            console.error('Error submitting RSVP:', submissionError)
            setError('No pudimos guardar tu confirmación. Inténtalo nuevamente.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className={`party-section party-rsvp${embedded ? ' party-rsvp--footer' : ''}`} data-section>
            <div className="party-sword" data-drift aria-hidden="true">⚔</div>
            <img className="party-deco party-deco--balloons" src="/invitations/hannia/img/elements/balloons.png" alt="" aria-hidden="true" />
            <img className="party-deco party-deco--bmo-jake" src="/invitations/hannia/img/elements/bmo-jake-collage.png" alt="" aria-hidden="true" />
            <div className="party-section__inner">
                <p className="party-kicker"><MessageCircle size={17} /> Confirmo</p>
                <h2>¿Vienes a<br /><em>celebrar?</em></h2>
                {submitted ? (
                    <div className="party-form party-form--success" role="status">
                        <span className="party-success-icon"><Check size={32} /></span>
                        <h3>¡Gracias, {name}!</h3>
                        <p>Tu confirmación quedó registrada correctamente.</p>
                    </div>
                ) : (
                    <form className="party-form" onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>¿Asistes a la fiesta?</legend>
                            <div className="party-options">
                                <label className={attendance === 'yes' ? 'is-selected' : ''}>
                                    <input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => setAttendance('yes')} />
                                    Sí asisto
                                </label>
                                <label className={attendance === 'no' ? 'is-selected' : ''}>
                                    <input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => setAttendance('no')} />
                                    No asisto
                                </label>
                            </div>
                        </fieldset>

                        <label>
                            <span>Nombre del aventurero</span>
                            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Escribe aquí" required />
                        </label>

                        <label>
                            <span>Mensaje para Hannia <small>(opcional)</small></span>
                            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escribe un mensaje bonito" rows="3" maxLength="98" />
                            <small className="party-form__counter">{message.length}/98</small>
                        </label>

                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Guardando...' : 'Confirmar asistencia'}
                        </button>
                        {error && <p className="party-form__error" role="alert">{error}</p>}
                    </form>
                )}

                <p className="party-signoff">¡Nos vemos en la aventura! <span>★</span></p>
            </div>
        </section>
    )
}

function Footer({ config }) {
    return (
        <footer className="party-footer">
            <RSVP embedded />
            <div className="party-footer__card">
                <p><span>★</span> Gracias por ser parte de mi aventura <span>★</span></p>
                <h2>{config.name} · {config.age} años</h2>
                <small>{config.dateLabel}</small>
                <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Invita-Ya.com</a>
            </div>
        </footer>
    )
}

export default function HanniaPartyInvitation() {
    const pageRef = useRef(null)
    const audioRef = useRef(null)
    const [musicPlaying, setMusicPlaying] = useState(false)

    const startMusic = async () => {
        if (!audioRef.current || !audioRef.current.paused) return
        try {
            await audioRef.current.play()
        } catch {
            setMusicPlaying(false)
        }
    }

    const toggleMusic = async () => {
        if (!audioRef.current) return
        if (audioRef.current.paused) await startMusic()
        else audioRef.current.pause()
    }

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return undefined

        audio.volume = 0.55
        audio.play().catch(() => {})

        const unlockAudio = (event) => {
            if (event.target?.closest?.('.party-music-toggle')) return
            startMusic()
            window.removeEventListener('pointerdown', unlockAudio)
            window.removeEventListener('keydown', unlockAudio)
        }

        window.addEventListener('pointerdown', unlockAudio, { passive: true })
        window.addEventListener('keydown', unlockAudio)

        return () => {
            window.removeEventListener('pointerdown', unlockAudio)
            window.removeEventListener('keydown', unlockAudio)
        }
    }, [])

    useEffect(() => {
        const fontLink = document.createElement('link')
        fontLink.rel = 'stylesheet'
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Fredoka:wght@400;500;600;700&display=swap'
        document.head.appendChild(fontLink)
        document.title = 'Hannia · 23 años'

        const media = gsap.matchMedia()
        const context = gsap.context(() => {
            media.add('(prefers-reduced-motion: no-preference)', () => {
                gsap.timeline({ defaults: { ease: 'back.out(1.25)' } })
                    .from('[data-hero-item]', { y: 34, opacity: 0, duration: 0.75, stagger: 0.12 })

                gsap.to('[data-parallax]', {
                    yPercent: 7,
                    ease: 'none',
                    scrollTrigger: { trigger: '.party-hero', start: 'top top', end: 'bottom top', scrub: 0.7 },
                })

                gsap.utils.toArray('[data-section]').forEach((section) => {
                    gsap.from(section.querySelectorAll('.party-kicker, h2, .party-timer, .party-location__card, .party-form'), {
                        y: 45,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none reverse' },
                    })
                })

                gsap.utils.toArray('[data-drift]').forEach((element, index) => {
                    gsap.to(element, {
                        y: index % 2 ? -42 : 42,
                        rotation: index % 2 ? 10 : -10,
                        ease: 'none',
                        scrollTrigger: { trigger: element.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1 },
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
            <audio
                ref={audioRef}
                src="/invitations/hannia/audio/come-along-with-me.mp3"
                preload="metadata"
                loop
                onPlay={() => setMusicPlaying(true)}
                onPause={() => setMusicPlaying(false)}
            />
            <button
                className={`party-music-toggle${musicPlaying ? ' is-playing' : ''}`}
                type="button"
                onClick={toggleMusic}
                aria-label={musicPlaying ? 'Pausar música' : 'Reproducir música'}
                title={musicPlaying ? 'Pausar música' : 'Reproducir música'}
            >
                {musicPlaying ? <Pause size={20} /> : <Music2 size={20} />}
            </button>
            <Hero config={PARTY_CONFIG} onStartMusic={startMusic} />
            <Countdown config={PARTY_CONFIG} />
            <Location config={PARTY_CONFIG} />
            <Footer config={PARTY_CONFIG} />
        </main>
    )
}
