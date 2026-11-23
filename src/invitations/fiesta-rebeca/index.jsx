import { useEffect, useRef, useState } from 'react'
import { CalendarDays, MapPin, Navigation, Sparkles } from 'lucide-react'
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
    eyebrow: 'MISIÓN: CELEBRAR',
    name: 'Rebeca',
    age: '45',
    title: 'Happy Birthday',
    date: '2026-11-24T15:30:00-06:00',
    dateLabel: '24 de noviembre',
    timeLabel: '3:30 p.m.',
    note: '¡Ven a celebrar! Habrá ricos tacos de canasta.',
    heroPhoto: '/invitations/fiesta-rebeca/img/rebeca-hero.png',
    location: {
        name: 'Calle Art #24',
        address: '434, colonia Constitución',
        mapsUrl: 'https://maps.app.goo.gl/9ecRdne8WLqypRg56',
    },
}

const pad = (value) => String(value).padStart(2, '0')

function useCountdown(targetDate) {
    const calculate = () => {
        if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, arrived: false }
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

function FloatingDecor({ className, items }) {
    return (
        <div className={`party-floating ${className}`} aria-hidden="true">
            {items.map(([file, stickerClass]) => (
                <img key={file} className={`party-floating__sticker ${stickerClass}`} src={`/invitations/fiesta-rebeca/img/floating/${file}`} alt="" data-drift />
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
            <FloatingDecor className="party-floating--hero" items={[
                ['decor-02.png', 'party-floating__horn'],
                ['decor-03.png', 'party-floating__balloon'],
                ['decor-10.png', 'party-floating__heart'],
                ['decor-06.png', 'party-floating__hero-face'],
            ]} />

            <div className="party-hero__content">
                <p className="party-name" data-hero-item>{config.name}</p>
                <div className={`party-portrait-wrap${config.heroPhoto ? ' has-photo' : ''}`} data-hero-item>
                    {config.heroPhoto && (
                        <img className="party-portrait" src={config.heroPhoto} alt={`Retrato de ${config.name}`} />
                    )}
                    <span className="party-spark party-spark--one">✦</span>
                    <span className="party-spark party-spark--two">✦</span>
                </div>
                {config.age && <p className="party-age-caption">¡{config.age} años!</p>}
                <div className="party-hero__birthday-lockup" data-hero-item>
                    <img
                        className="party-hero__birthday-art"
                        src="/invitations/fiesta-rebeca/img/floating/decor-08.png"
                        alt="Happy Birthday"
                    />
                    <img
                        className="party-hero__age-balloon"
                        src="/invitations/fiesta-rebeca/img/floating/decor-07.png"
                        alt="Globo plateado con el número 45"
                    />
                </div>
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
            <FloatingDecor className="party-floating--countdown" items={[
                ['decor-04.png', 'party-floating__disco'],
                ['decor-07.png', 'party-floating__age'],
            ]} />
            <span className="party-sticker party-sticker--green" data-drift>falta<br />poquito</span>
            <div className="party-section__inner">
                <p className="party-kicker"><Sparkles size={15} /> Cuenta regresiva</p>
                <h2>{time.arrived ? '¡La fiesta es hoy!' : 'Nos vemos en…'}</h2>
                {!config.date ? <p className="party-date-lockup">La fecha se anunciará muy pronto</p> : !time.arrived && (
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
            <FloatingDecor className="party-floating--location" items={[
                ['decor-14.png', 'party-floating__fly'],
                ['decor-09.png', 'party-floating__pot'],
            ]} />
            <span className="party-location__star" data-drift>★</span>
            <div className="party-section__inner">
                <p className="party-kicker"><MapPin size={15} /> Una sola parada</p>
                <h2>Aquí es<br /><em>la fiesta</em></h2>

                <article className="party-location__card">
                    <div className="party-pin"><Navigation size={25} /></div>
                    <p className="party-location__label">Lugar</p>
                    <h3>{config.location.name}</h3>
                    <p>{config.location.address}</p>
                    <p className="party-location__treats">🎁 Entrada con regalito<br />🌮 ¡Habrá ricos tacos de canasta!</p>
                    {config.location.mapsUrl && <a href={config.location.mapsUrl} target="_blank" rel="noreferrer">Abrir en Maps <span>↗</span></a>}
                </article>
            </div>
        </section>
    )
}

function Footer({ config }) {
    return (
        <footer className="party-footer">
            <p><span>✦</span> Gracias por ser parte <span>✦</span></p>
            <h2>{config.name}{config.age ? ` · ${config.age}` : ''}</h2>
            <small>{config.dateLabel} · {config.timeLabel}</small>
            <a href="https://invita-ya.com" target="_blank" rel="noreferrer">Invita-Ya.com</a>
        </footer>
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
                    gsap.from(section.querySelectorAll('.party-kicker, h2, .party-timer, .party-location__card'), {
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
            <Footer config={PARTY_CONFIG} />
        </main>
    )
}
