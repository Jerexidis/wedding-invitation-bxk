import { useEffect, useRef, useState } from 'react'
import {
    ArrowUpRight,
    CalendarPlus,
    Clock3,
    Gem,
    Landmark,
    MapPin,
    PartyPopper,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './invitation.css'

gsap.registerPlugin(ScrollTrigger)

const EVENT = {
    name: 'Ivanna Flores',
    date: '2026-09-26T19:00:00-06:00',
    parents: ['César Iván Flores Trigos', 'Luisa Elvira Tristán Damián'],
    ceremony: {
        place: 'Iglesia de San Peregrino',
        detail: 'La Herradura',
        time: '7:00 pm',
        maps: 'https://maps.app.goo.gl/D5bZH83eJ96pxAzMA',
    },
    reception: {
        place: 'Hacienda de los Pocitos',
        detail: 'Después de la ceremonia',
        maps: 'https://www.google.com/maps/search/?api=1&query=Hacienda+de+los+Pocitos',
    },
}

const pad = (value) => String(value).padStart(2, '0')

function useCountdown(date) {
    const calculate = () => {
        const distance = new Date(date).getTime() - Date.now()
        if (distance <= 0) {
            return { arrived: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
        }

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

function Ornament({ compact = false }) {
    return (
        <span className={`ivanna-ornament${compact ? ' ivanna-ornament--compact' : ''}`} aria-hidden="true">
            <i />
            <b>XV</b>
            <i />
        </span>
    )
}

function AddToCalendar() {
    const addEvent = () => {
        const start = new Date(EVENT.date)
        const end = new Date(start.getTime() + 6 * 60 * 60 * 1000)
        const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
        const url = new URL('https://calendar.google.com/calendar/render')

        url.searchParams.set('action', 'TEMPLATE')
        url.searchParams.set('text', `XV años de ${EVENT.name}`)
        url.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`)
        url.searchParams.set('details', 'Acompáñanos a celebrar los XV años de Ivanna Flores.')
        url.searchParams.set('location', `${EVENT.ceremony.place}, ${EVENT.ceremony.detail}`)
        window.open(url.toString(), '_blank', 'noopener,noreferrer')
    }

    return (
        <button className="ivanna-button ivanna-button--light" type="button" onClick={addEvent}>
            <CalendarPlus size={18} strokeWidth={1.4} />
            Agregar al calendario
        </button>
    )
}

function Hero() {
    return (
        <header className="ivanna-hero" aria-labelledby="ivanna-title">
            <div className="ivanna-hero__halo" aria-hidden="true" />
            <div className="ivanna-card" data-ivanna-hero-card>
                <div className="ivanna-card__inner">
                    <div className="ivanna-card__name">
                        <span>mis quince años</span>
                        <h1 id="ivanna-title">Ivanna</h1>
                        <p>Flores</p>
                    </div>

                    <Ornament />

                    <time dateTime="2026-09-26">
                        <span>Sábado</span>
                        <strong>26</strong>
                        <span>Septiembre 2026</span>
                    </time>
                </div>
            </div>
        </header>
    )
}

function Family() {
    return (
        <section className="ivanna-family" aria-label="Familia de Ivanna Flores">
            <div className="ivanna-shell">
                <div className="ivanna-family__names" data-ivanna-reveal>
                    <p>Con el amor y la bendición de mis papás</p>
                    <strong>{EVENT.parents[0]}</strong>
                    <span>y</span>
                    <strong>{EVENT.parents[1]}</strong>
                </div>
            </div>
        </section>
    )
}

function Countdown() {
    const time = useCountdown(EVENT.date)
    const units = [
        ['Días', time.days],
        ['Horas', time.hours],
        ['Minutos', time.minutes],
        ['Segundos', time.seconds],
    ]

    return (
        <section className="ivanna-countdown" aria-labelledby="ivanna-countdown-title">
            <div className="ivanna-shell" data-ivanna-reveal>
                <Ornament compact />
                <h2 id="ivanna-countdown-title">
                    {time.arrived ? 'Hoy es el gran día' : 'La celebración se acerca'}
                </h2>

                <div className="ivanna-countdown__grid" aria-live="polite">
                    {units.map(([label, value]) => (
                        <div key={label}>
                            <strong>{pad(value)}</strong>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>

                <AddToCalendar />
            </div>
        </section>
    )
}

function VenueCard({ icon: Icon, label, place, detail, time, maps, offset = false }) {
    return (
        <article className={`ivanna-venue${offset ? ' ivanna-venue--offset' : ''}`}>
            <div className="ivanna-venue__content">
                <div className="ivanna-venue__icon" aria-hidden="true">
                    <Icon size={31} strokeWidth={1.15} />
                </div>
                <p>{label}</p>
                <h3>{place}</h3>
                <span>{detail}</span>
                {time && (
                    <time>
                        <Clock3 size={15} strokeWidth={1.4} aria-hidden="true" />
                        {time}
                    </time>
                )}
                <a href={maps} target="_blank" rel="noreferrer">
                    <MapPin size={16} strokeWidth={1.4} aria-hidden="true" />
                    Ver ubicación
                    <ArrowUpRight size={14} strokeWidth={1.4} aria-hidden="true" />
                </a>
            </div>
        </article>
    )
}

function Celebration() {
    return (
        <section className="ivanna-celebration" aria-label="Ceremonia y recepción">
            <div className="ivanna-shell">
                <div className="ivanna-venues" data-ivanna-venues>
                    <VenueCard
                        icon={Landmark}
                        label="Ceremonia"
                        place={EVENT.ceremony.place}
                        detail={EVENT.ceremony.detail}
                        time={EVENT.ceremony.time}
                        maps={EVENT.ceremony.maps}
                    />
                    <VenueCard
                        icon={PartyPopper}
                        label="Recepción"
                        place={EVENT.reception.place}
                        detail={EVENT.reception.detail}
                        maps={EVENT.reception.maps}
                        offset
                    />
                </div>
            </div>
        </section>
    )
}

function DressCode() {
    return (
        <section className="ivanna-dress" aria-labelledby="ivanna-dress-title">
            <div className="ivanna-dress__monogram" aria-hidden="true" data-ivanna-reveal>I</div>
            <div className="ivanna-dress__copy" data-ivanna-reveal>
                <Gem size={31} strokeWidth={1.2} aria-hidden="true" />
                <h2 id="ivanna-dress-title">Código de vestimenta</h2>
                <strong>Formal</strong>
                <p>Te pedimos evitar los colores blanco y beige.</p>
                <div className="ivanna-dress__swatches" aria-label="Colores reservados: blanco y beige">
                    <span>
                        <i className="ivanna-dress__swatch ivanna-dress__swatch--white" />
                        <small>Blanco</small>
                    </span>
                    <span>
                        <i className="ivanna-dress__swatch ivanna-dress__swatch--beige" />
                        <small>Beige</small>
                    </span>
                </div>
            </div>
        </section>
    )
}

function Gifts() {
    return (
        <section className="ivanna-gifts" aria-labelledby="ivanna-gifts-title">
            <div className="ivanna-gifts__envelope" data-ivanna-reveal>
                <div className="ivanna-gifts__flap" aria-hidden="true" />
                <div className="ivanna-gifts__content">
                    <h2 id="ivanna-gifts-title">Regalo<br />en sobre</h2>
                    <span>
                        Si deseas obsequiarme un detalle, puedes hacerlo mediante un sobre.
                    </span>
                </div>
            </div>
        </section>
    )
}

function BrandFooter() {
    return (
        <footer className="ivanna-brand-footer">
            <span>Hecho con</span>
            <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Invita Ya</a>
        </footer>
    )
}

export default function IvannaFloresInvitation({ portfolioMode = false }) {
    const rootRef = useRef(null)

    useEffect(() => {
        const previousTitle = document.title
        const existingDescription = document.querySelector('meta[name="description"]')
        const previousDescription = existingDescription?.getAttribute('content')
        const description = existingDescription || document.createElement('meta')

        document.title = 'Mis XV | Ivanna Flores'
        description.setAttribute('name', 'description')
        description.setAttribute('content', 'Acompáñame a celebrar mis XV años el sábado 26 de septiembre de 2026.')
        if (!existingDescription) document.head.appendChild(description)

        return () => {
            document.title = previousTitle
            if (existingDescription) existingDescription.setAttribute('content', previousDescription || '')
            else description.remove()
        }
    }, [])

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

        const context = gsap.context(() => {
            const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

            heroTimeline
                .fromTo('[data-ivanna-hero-card]',
                    { autoAlpha: 0, y: 26 },
                    { autoAlpha: 1, y: 0, duration: 1.05 })
                .from('.ivanna-card__name > *, .ivanna-card .ivanna-ornament, .ivanna-card time', {
                    autoAlpha: 0,
                    duration: .7,
                    stagger: .08,
                    y: 12,
                }, '-=.62')

            gsap.to('.ivanna-hero__halo', {
                rotation: 13,
                scale: 1.035,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.ivanna-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: .6,
                },
            })

            gsap.utils.toArray('[data-ivanna-reveal]').forEach((element) => {
                gsap.from(element, {
                    autoAlpha: 0,
                    duration: .8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 84%',
                        once: true,
                    },
                    y: 22,
                })
            })

            gsap.from('.ivanna-venue', {
                autoAlpha: 0,
                duration: .85,
                ease: 'power2.out',
                stagger: .14,
                scrollTrigger: {
                    trigger: '[data-ivanna-venues]',
                    start: 'top 82%',
                    once: true,
                },
                y: 28,
            })
        }, rootRef)

        ScrollTrigger.refresh()
        return () => context.revert()
    }, [])

    return (
        <main ref={rootRef} className="ivanna-invitation" data-portfolio={portfolioMode ? 'true' : 'false'}>
            <Hero />
            <Family />
            <Countdown />
            <Celebration />
            <DressCode />
            <Gifts />
            <BrandFooter />
        </main>
    )
}
