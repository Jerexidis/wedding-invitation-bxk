import { useEffect, useRef, useState, useCallback } from 'react'
import {
    CalendarPlus, Check, Church, Gift, Heart, MapPin, Music2,
    Navigation, Pause, PartyPopper, Play, Send, Sparkles,
    UtensilsCrossed, ShoppingBag, MessageCircle,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './mexican-wedding.css'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════════ */
const CONFIG = {
    slug: 'plantilla-boda-mexicana',
    couple: ['Uriel', 'Fernanda'],
    date: '2026-10-18T17:00:00-06:00',
    dateLabel: '18 · OCTUBRE · 2026',
    whatsapp: '5210000000000',
    ceremony: {
        name: 'Parroquia de Nuestra Señora de Guadalupe',
        address: 'Av. de la Convención Sur #245\nAguascalientes, Ags.',
        time: '5:00 PM',
        maps: 'https://maps.google.com/?q=Parroquia+de+Nuestra+Señora+de+Guadalupe+Aguascalientes',
    },
    reception: {
        name: 'Hacienda Los Olivos',
        address: 'Carretera Aguascalientes – Jesús María Km. 8\nAguascalientes, Ags.',
        time: '7:00 PM',
        maps: 'https://maps.google.com/?q=Hacienda+Los+Olivos+Aguascalientes',
    },
    padrinos: {
        role: 'Padrinos de Velación',
        names: ['Camerino Silva', 'Irma Galeana López'],
    },
    gifts: {
        store: 'Amazon',
        url: 'https://www.amazon.com.mx/',
    },
    itinerary: [
        { time: '5:00 PM', label: 'Ceremonia Religiosa', icon: Church, color: '' },
        { time: '7:00 PM', label: 'Recepción & Cóctel', icon: MapPin, color: 'rosa' },
        { time: '8:00 PM', label: 'Banquete & Cena', icon: UtensilsCrossed, color: 'mustard' },
        { time: '9:30 PM', label: 'Primer Baile de Esposos', icon: Music2, color: 'green' },
        { time: '10:00 PM', label: 'Fiesta & Mariachi', icon: PartyPopper, color: 'blue' },
        { time: '12:00 AM', label: 'Tornaboda & Fiesta', icon: Sparkles, color: 'purple' },
    ],
}

const pad = (v) => String(v).padStart(2, '0')

function useCountdown(target) {
    const calc = useCallback(() => {
        const d = new Date(target).getTime() - Date.now()
        if (d <= 0) return { arrived: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
        return {
            arrived: false,
            days: Math.floor(d / 86400000),
            hours: Math.floor((d / 3600000) % 24),
            minutes: Math.floor((d / 60000) % 60),
            seconds: Math.floor((d / 1000) % 60),
        }
    }, [target])
    const [time, setTime] = useState(calc)
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000)
        return () => clearInterval(id)
    }, [calc])
    return time
}

function useScrollReveal(ref) {
    useEffect(() => {
        const els = ref.current?.querySelectorAll('.mx-reveal')
        if (!els?.length) return
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) e.target.classList.add('is-visible')
            })
        }, { threshold: 0.1 })
        els.forEach((el) => obs.observe(el))
        return () => obs.disconnect()
    }, [ref])
}

/* ═══════════════════════════════════════════════════════════════
   PAPEL PICADO FLAGS
   ═══════════════════════════════════════════════════════════════ */
function PicadoFlagFlower({ color, delay = '0s' }) {
    return (
        <svg className="mx-picado-flag" style={{ '--dur': '3.8s', '--delay': delay, '--r1': '-3deg', '--r2': '3deg' }} viewBox="0 0 80 95" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 0h80v72c0 0-2 5-5 8-3 3-5 0-8 3s-2 5-5 8-5-1-8 2-3 5-6 5-4-5-7-2-3 5-6 5-4-5-7-2-3 5-6 5-4-5-7-2c-3 3-3 5-6 5s-4-5-5-8c-1-3 1-5-2-8-3-3-2-5-2-8V0z" fill={color} />
            <rect x="5" y="5" width="70" height="62" rx="1" stroke="white" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity=".35" />
            <circle cx="40" cy="32" r="7" fill="white" opacity=".3" />
            <circle cx="40" cy="22" r="4.5" fill="white" opacity=".25" />
            <circle cx="50" cy="28" r="4.5" fill="white" opacity=".25" />
            <circle cx="48" cy="39" r="4.5" fill="white" opacity=".25" />
            <circle cx="32" cy="39" r="4.5" fill="white" opacity=".25" />
            <circle cx="30" cy="28" r="4.5" fill="white" opacity=".25" />
            <circle cx="40" cy="32" r="3.5" fill="white" opacity=".35" />
            <circle cx="14" cy="14" r="2.5" fill="white" opacity=".25" />
            <circle cx="66" cy="14" r="2.5" fill="white" opacity=".25" />
            <circle cx="14" cy="56" r="2.5" fill="white" opacity=".25" />
            <circle cx="66" cy="56" r="2.5" fill="white" opacity=".25" />
            <path d="M20 42 Q24 38 28 42 Q24 46 20 42Z" fill="white" opacity=".2" />
            <path d="M52 42 Q56 38 60 42 Q56 46 52 42Z" fill="white" opacity=".2" />
        </svg>
    )
}

function PicadoFlagBird({ color, delay = '0s' }) {
    return (
        <svg className="mx-picado-flag" style={{ '--dur': '4.2s', '--delay': delay, '--r1': '-2deg', '--r2': '4deg' }} viewBox="0 0 80 95" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 0h80v72c0 0-2 5-5 8-3 3-5 0-8 3s-2 5-5 8-5-1-8 2-3 5-6 5-4-5-7-2-3 5-6 5-4-5-7-2-3 5-6 5-4-5-7-2c-3 3-3 5-6 5s-4-5-5-8c-1-3 1-5-2-8-3-3-2-5-2-8V0z" fill={color} />
            <rect x="5" y="5" width="70" height="62" rx="1" stroke="white" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity=".35" />
            <path d="M30 28 C28 22 34 18 40 22 C46 18 52 22 50 28 L45 35 C43 37 42 40 40 42 C38 40 37 37 35 35Z" fill="white" opacity=".3" />
            <circle cx="36" cy="25" r="1.2" fill={color} opacity=".5" />
            <path d="M32 30 Q27 25 22 30" stroke="white" strokeWidth="1.5" fill="none" opacity=".2" />
            <path d="M48 30 Q53 25 58 30" stroke="white" strokeWidth="1.5" fill="none" opacity=".2" />
            <path d="M16 48 L18 44 L20 48 L16 46 L20 46Z" fill="white" opacity=".25" />
            <path d="M60 48 L62 44 L64 48 L60 46 L64 46Z" fill="white" opacity=".25" />
            <circle cx="40" cy="54" r="2" fill="white" opacity=".2" />
            <circle cx="20" cy="16" r="2" fill="white" opacity=".2" />
            <circle cx="60" cy="16" r="2" fill="white" opacity=".2" />
        </svg>
    )
}

function PicadoFlagHeart({ color, delay = '0s' }) {
    return (
        <svg className="mx-picado-flag" style={{ '--dur': '3.5s', '--delay': delay, '--r1': '-4deg', '--r2': '2deg' }} viewBox="0 0 80 95" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 0h80v72c0 0-2 5-5 8-3 3-5 0-8 3s-2 5-5 8-5-1-8 2-3 5-6 5-4-5-7-2-3 5-6 5-4-5-7-2-3 5-6 5-4-5-7-2c-3 3-3 5-6 5s-4-5-5-8c-1-3 1-5-2-8-3-3-2-5-2-8V0z" fill={color} />
            <rect x="5" y="5" width="70" height="62" rx="1" stroke="white" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity=".35" />
            <path d="M40 48 C40 48 22 36 22 26 C22 20 28 16 34 20 C37 22 39 25 40 28 C41 25 43 22 46 20 C52 16 58 20 58 26 C58 36 40 48 40 48Z" fill="white" opacity=".3" />
            <path d="M16 14 L20 10 L24 14 L20 18Z" fill="white" opacity=".22" />
            <path d="M56 14 L60 10 L64 14 L60 18Z" fill="white" opacity=".22" />
            <circle cx="16" cy="50" r="3" fill="white" opacity=".18" />
            <circle cx="64" cy="50" r="3" fill="white" opacity=".18" />
        </svg>
    )
}

function PicadoFlagStar({ color, delay = '0s' }) {
    return (
        <svg className="mx-picado-flag" style={{ '--dur': '4s', '--delay': delay, '--r1': '-2deg', '--r2': '3deg' }} viewBox="0 0 80 95" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 0h80v72c0 0-2 5-5 8-3 3-5 0-8 3s-2 5-5 8-5-1-8 2-3 5-6 5-4-5-7-2-3 5-6 5-4-5-7-2-3 5-6 5-4-5-7-2c-3 3-3 5-6 5s-4-5-5-8c-1-3 1-5-2-8-3-3-2-5-2-8V0z" fill={color} />
            <rect x="5" y="5" width="70" height="62" rx="1" stroke="white" strokeWidth="1.2" strokeDasharray="3 2" fill="none" opacity=".35" />
            <path d="M40 16 L44 28 L56 28 L46 36 L50 48 L40 40 L30 48 L34 36 L24 28 L36 28Z" fill="white" opacity=".3" />
            <circle cx="16" cy="16" r="4" fill="white" opacity=".2" />
            <circle cx="64" cy="54" r="4" fill="white" opacity=".2" />
            <circle cx="16" cy="54" r="3" fill="white" opacity=".15" />
            <circle cx="64" cy="16" r="3" fill="white" opacity=".15" />
        </svg>
    )
}

function PapelPicadoGarland({ large = false }) {
    const flags = [
        { Comp: PicadoFlagFlower, color: '#1A9E82', delay: '0s' },
        { Comp: PicadoFlagHeart,  color: '#E0457B', delay: '-0.5s' },
        { Comp: PicadoFlagBird,   color: '#E8943A', delay: '-1.1s' },
        { Comp: PicadoFlagStar,   color: '#E0457B', delay: '-0.3s' },
        { Comp: PicadoFlagFlower, color: '#4AB8D4', delay: '-0.8s' },
        { Comp: PicadoFlagHeart,  color: '#3B8C3B', delay: '-1.5s' },
        { Comp: PicadoFlagBird,   color: '#E0457B', delay: '-0.2s' },
        { Comp: PicadoFlagStar,   color: '#E8943A', delay: '-1.0s' },
        { Comp: PicadoFlagFlower, color: '#1A9E82', delay: '-0.6s' },
    ]
    const h = large ? 80 : 55
    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, overflow: 'hidden', position: 'relative' }} aria-hidden="true">
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '14px', zIndex: 1 }} viewBox="0 0 500 14" preserveAspectRatio="none">
                <path d="M0 2 Q50 12 100 4 Q150 -2 200 6 Q250 14 300 4 Q350 -4 400 6 Q450 14 500 2" stroke="#8B6914" strokeWidth="1.5" fill="none" opacity=".5" />
            </svg>
            {flags.map(({ Comp, color, delay }, i) => (
                <div key={i} style={{ width: large ? 72 : 52, height: h, flexShrink: 0, marginTop: i % 2 === 0 ? 3 : 7 }}>
                    <Comp color={color} delay={delay} />
                </div>
            ))}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   MEXICAN SUNFLOWER (Flor para La Fecha)
   ═══════════════════════════════════════════════════════════════ */
function MexicanSunflower({ size = 52 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 60 60" fill="none" aria-hidden="true" style={{ display: 'block', margin: '0 auto' }}>
            <g transform="translate(30, 30)">
                {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle) => (
                    <ellipse key={angle} cx="0" cy="-18" rx="4.5" ry="10" fill="#E5A823" opacity=".95" transform={`rotate(${angle})`} />
                ))}
                {[11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75, 191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75].map((angle) => (
                    <ellipse key={angle} cx="0" cy="-15" rx="3.5" ry="8" fill="#F3C342" opacity=".85" transform={`rotate(${angle})`} />
                ))}
                <circle cx="0" cy="0" r="9" fill="#8B2516" />
                <circle cx="0" cy="0" r="7" fill="#6A1A0E" />
                <circle cx="0" cy="0" r="4" fill="#D4A533" opacity=".7" />
            </g>
        </svg>
    )
}

/* ═══════════════════════════════════════════════════════════════
   MEXICAN FLORAL FRAME (Border decoration)
   ═══════════════════════════════════════════════════════════════ */
function MexicanFloralFrame() {
    return (
        <svg className="mx-floral-frame" viewBox="0 0 340 440" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g transform="translate(170,22)">
                <circle cx="0" cy="0" r="5" fill="#D4A533" />
                {[0,45,90,135,180,225,270,315].map((a) => (
                    <ellipse key={a} cx="0" cy="-11" rx="4.5" ry="8" fill="#E8413A" opacity=".85" transform={`rotate(${a})`} />
                ))}
            </g>
            <g transform="translate(50,40)">
                <path d="M80 0 C60 5, 30 -5, 10 15 C-5 30, 0 50, -10 70" stroke="#2B6B2B" strokeWidth="1.8" fill="none" opacity=".6" />
                <circle cx="15" cy="20" r="4" fill="#E0457B" opacity=".7" />
                <circle cx="45" cy="8" r="3" fill="#4AB8D4" opacity=".8" />
            </g>
            <g transform="translate(290,40) scale(-1,1)">
                <path d="M80 0 C60 5, 30 -5, 10 15 C-5 30, 0 50, -10 70" stroke="#2B6B2B" strokeWidth="1.8" fill="none" opacity=".6" />
                <circle cx="15" cy="20" r="4" fill="#E8734A" opacity=".7" />
                <circle cx="45" cy="8" r="3" fill="#E0457B" opacity=".8" />
            </g>
            <g transform="translate(170,418)">
                <circle cx="0" cy="0" r="6" fill="#8B2318" />
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((a) => (
                    <ellipse key={a} cx="0" cy="-12" rx="4" ry="8" fill="#D4A533" opacity=".8" transform={`rotate(${a})`} />
                ))}
            </g>
        </svg>
    )
}

function ScallopEdge({ color = '#F5EDDC', flip = false }) {
    return (
        <div className={`mx-scallop ${flip ? 'mx-scallop--bottom' : 'mx-scallop--top'}`} aria-hidden="true">
            <svg viewBox="0 0 600 18" preserveAspectRatio="none" style={flip ? { transform: 'scaleY(-1)' } : undefined}>
                <path d={`M0 ${flip ? 0 : 18}V0C10 12 20 12 30 0S50 12 60 0 80 12 90 0 110 12 120 0 140 12 150 0 170 12 180 0 200 12 210 0 230 12 240 0 260 12 270 0 290 12 300 0 320 12 330 0 350 12 360 0 380 12 390 0 410 12 420 0 440 12 450 0 470 12 480 0 500 12 510 0 530 12 540 0 560 12 570 0 590 12 600 0V${flip ? 0 : 18}Z`} fill={color} />
            </svg>
        </div>
    )
}

function HeartDivider() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '.8rem 0' }} aria-hidden="true">
            <span style={{ flex: 1, maxWidth: 50, height: 1, background: 'linear-gradient(90deg, transparent, var(--mx-terracotta), transparent)', opacity: .3 }} />
            <Heart size={14} fill="var(--mx-rosa)" color="var(--mx-rosa)" />
            <span style={{ flex: 1, maxWidth: 50, height: 1, background: 'linear-gradient(90deg, transparent, var(--mx-terracotta), transparent)', opacity: .3 }} />
        </div>
    )
}

function RotuloSparkle({ side = 'left' }) {
    return (
        <svg className={`mx-rotulo-sparkle mx-rotulo-sparkle--${side}`} viewBox="0 0 50 60" fill="none" aria-hidden="true">
            <path d="M25 6 L25 54" stroke="#16428F" strokeWidth="5" strokeLinecap="round" />
            <path d="M25 8 L25 52" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 19 L43 41" stroke="#16428F" strokeWidth="5" strokeLinecap="round" />
            <path d="M9 20 L41 40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 41 L43 19" stroke="#16428F" strokeWidth="5" strokeLinecap="round" />
            <path d="M9 40 L41 20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

/* ═══════════════════════════════════════════════════════════════
   1. SOBRE ARTESANAL MEXICANO (Envelope)
   ═══════════════════════════════════════════════════════════════ */
function EnvelopeScreen({ onOpen, isOpening }) {
    return (
        <section className="mx-envelope-screen">
            <div className="mx-envelope-screen__garland">
                <PapelPicadoGarland large />
            </div>

            {/* Floating Stickers around envelope */}
            <div className="mx-floating-stickers-layer" aria-hidden="true">
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-12.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-1"
                    style={{ top: '12%', left: '6%', width: '56px', '--rot': '-10deg' }}
                />
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-14.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-2"
                    style={{ top: '15%', right: '6%', width: '64px', '--rot': '15deg' }}
                />
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-11.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-3"
                    style={{ bottom: '10%', left: '8%', width: '60px', '--rot': '-5deg' }}
                />
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-23.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-4"
                    style={{ bottom: '8%', right: '8%', width: '54px', '--rot': '10deg' }}
                />
            </div>

            <div className="mx-envelope-stage">
                <div
                    className={`mx-envelope${isOpening ? ' is-opening' : ''}`}
                    onClick={onOpen}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen() }}
                    aria-label="Abrir sobre de boda"
                >
                    <div className="mx-envelope__back">
                        <div className="mx-envelope__back-pattern" />
                    </div>

                    <div className="mx-envelope__card">
                        <p className="mx-envelope__card-subtitle">Nuestra Boda</p>
                        <h2 className="mx-envelope__card-names">{CONFIG.couple[0]} & {CONFIG.couple[1]}</h2>
                        <p className="mx-envelope__card-date">{CONFIG.dateLabel}</p>
                    </div>

                    <div className="mx-envelope__pocket">
                        <svg className="mx-envelope__pocket-svg" viewBox="0 0 400 260" preserveAspectRatio="none">
                            <polygon points="0,0 200,140 0,260" fill="#DECBAF" />
                            <polygon points="400,0 200,140 400,260" fill="#D5C1A3" />
                            <polygon points="0,260 200,130 400,260" fill="#CBB493" />
                            <line x1="0" y1="260" x2="200" y2="130" stroke="#FAF5EA" strokeWidth="1.5" opacity=".5" />
                            <line x1="400" y1="260" x2="200" y2="130" stroke="#FAF5EA" strokeWidth="1.5" opacity=".5" />
                        </svg>
                    </div>

                    <div className="mx-envelope__flap">
                        <svg className="mx-envelope__flap-svg" viewBox="0 0 400 130" preserveAspectRatio="none">
                            <polygon points="0,0 200,130 400,0" fill="#DECBAF" />
                            <polyline points="0,0 200,130 400,0" stroke="#C4A985" strokeWidth="2" fill="none" />
                        </svg>
                    </div>

                    {/* Realistic Wax Seal Image from User */}
                    <button
                        className="mx-wax-seal"
                        onClick={onOpen}
                        type="button"
                        aria-label="Abrir invitación con sello de cera"
                    >
                        <img
                            src="/invitations/plantilla-boda-mexicana/img/sello-corazon.png"
                            alt="Sello de cera con corazón"
                            className="mx-wax-seal__img"
                        />
                    </button>
                </div>
            </div>

            <div className="mx-envelope-cta">
                <p className="mx-envelope-cta__hint">Toca el sello para abrir</p>
                <button className="mx-envelope-cta__btn" type="button" onClick={onOpen}>
                    <Heart size={14} fill="currentColor" /> ABRIR INVITACIÓN
                </button>
            </div>
        </section>
    )
}

/* ═══════════════════════════════════════════════════════════════
   2. RÓTULO POPULAR MEXICANO (Nombres de los Novios)
   ═══════════════════════════════════════════════════════════════ */
function MexicanRotulo() {
    return (
        <section className="mx-rotulo-section" id="mx-rotulo">
            <div className="mx-floating-stickers-layer" aria-hidden="true">
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-2.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-2"
                    style={{ top: '8px', left: '10px', width: '70px', '--rot': '-6deg' }}
                />
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-15.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-3"
                    style={{ top: '15px', right: '12px', width: '58px', '--rot': '8deg' }}
                />
            </div>

            <div className="mx-container">
                <div className="mx-rotulo-wrap mx-reveal">
                    <div className="mx-rotulo-board">
                        <h1 className="mx-rotulo__bienvenidos">¡BIENVENIDOS!</h1>
                        <p className="mx-rotulo__sub">— A NUESTRA BODA —</p>

                        <div className="mx-rotulo__names-row">
                            <RotuloSparkle side="left" />
                            <div className="mx-rotulo__couple">
                                <span className="mx-rotulo__name">{CONFIG.couple[0]}</span>
                                <span className="mx-rotulo__amp">&</span>
                                <span className="mx-rotulo__name">{CONFIG.couple[1]}</span>
                            </div>
                            <RotuloSparkle side="right" />
                        </div>

                        <p className="mx-rotulo__date-tag">AGUASCALIENTES · 18 DE OCTUBRE 2026</p>
                        <p className="mx-rotulo__quote">"Para toda la vida"</p>
                    </div>

                    <div className="mx-rotulo-easel-legs" aria-hidden="true">
                        <div className="mx-rotulo-easel-leg" />
                        <div className="mx-rotulo-easel-leg" />
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ═══════════════════════════════════════════════════════════════
   3. PADRINOS
   ═══════════════════════════════════════════════════════════════ */
function Padrinos() {
    return (
        <section className="mx-padrinos-section">
            <div className="mx-floating-stickers-layer" aria-hidden="true">
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-17.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-1"
                    style={{ top: '20px', left: '15px', width: '50px', '--rot': '-8deg' }}
                />
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-19.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-4"
                    style={{ top: '25px', right: '15px', width: '56px', '--rot': '10deg' }}
                />
            </div>

            <div className="mx-container">
                <div className="mx-heading mx-reveal">
                    <p className="mx-heading__kicker">Con todo nuestro cariño y bendición</p>
                    <h2 className="mx-heading__title">Nuestros Padrinos</h2>
                </div>

                <div className="mx-padrinos__card mx-reveal mx-reveal--d1">
                    <MexicanFloralFrame />
                    <Heart size={24} fill="var(--mx-terracotta)" color="var(--mx-terracotta)" style={{ marginBottom: '.4rem' }} />
                    <p className="mx-padrinos__role">{CONFIG.padrinos.role}</p>
                    <p className="mx-padrinos__names">
                        {CONFIG.padrinos.names[0]}
                        <span>&</span>
                        {CONFIG.padrinos.names[1]}
                    </p>
                    <HeartDivider />
                    <p style={{ color: 'var(--mx-ink-soft)', fontSize: '.84rem', fontStyle: 'italic', marginTop: '.6rem' }}>
                        Gracias por guiarnos y acompañarnos en este bendecido camino.
                    </p>
                </div>
            </div>
        </section>
    )
}

/* ═══════════════════════════════════════════════════════════════
   4. LA FECHA & CALENDARIO (Flor visible arriba + Día 18 en corazón)
   ═══════════════════════════════════════════════════════════════ */
function DateSection() {
    const time = useCountdown(CONFIG.date)
    const daysInMonth = 31
    const firstDay = 4
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

    const addToCalendar = () => {
        const start = new Date(CONFIG.date)
        const end = new Date(start.getTime() + 7 * 3600000)
        const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
        const url = new URL('https://calendar.google.com/calendar/render')
        url.searchParams.set('action', 'TEMPLATE')
        url.searchParams.set('text', `Boda de ${CONFIG.couple.join(' & ')}`)
        url.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`)
        url.searchParams.set('details', `Celebremos la boda de ${CONFIG.couple.join(' & ')} en Aguascalientes.`)
        url.searchParams.set('location', CONFIG.ceremony.name)
        window.open(url.toString(), '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="mx-date-section">
            <div className="mx-floating-stickers-layer" aria-hidden="true">
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-13.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-2"
                    style={{ top: '30px', left: '10px', width: '58px', '--rot': '-12deg' }}
                />
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-27.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-1"
                    style={{ top: '40px', right: '12px', width: '52px', '--rot': '12deg' }}
                />
            </div>

            <div className="mx-container">
                {/* Heading with prominent Mexican Sunflower above the text for clear visibility */}
                <div className="mx-heading mx-reveal" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '.7rem' }}>
                        <MexicanSunflower size={56} />
                    </div>
                    <p className="mx-heading__kicker" style={{ color: 'var(--mx-terracotta)', marginBottom: '.3rem' }}>
                        Guarda la fecha
                    </p>
                    <h2 className="mx-heading__title">La Fecha</h2>
                </div>

                <div className="mx-date__display mx-reveal mx-reveal--d1">
                    <p className="mx-date__weekday">Sábado</p>
                    <span className="mx-date__number">18</span>
                    <p className="mx-date__month">de Octubre 2026</p>
                    <p className="mx-date__time">5:00 PM</p>
                </div>

                {/* Calendar with Heart enclosing Day 18 */}
                <div className="mx-calendar mx-reveal mx-reveal--d2">
                    {dayNames.map((d) => <div key={d} className="mx-calendar__header">{d}</div>)}
                    {Array.from({ length: firstDay }, (_, i) => <div key={`b${i}`} className="mx-calendar__day mx-calendar__day--empty" />)}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1
                        const isTarget = day === 18
                        return (
                            <div key={day} className={`mx-calendar__day${isTarget ? ' mx-calendar__day--heart' : ''}`}>
                                {isTarget ? (
                                    <div className="mx-calendar__heart-badge" title="Día de la Boda">
                                        <svg className="mx-calendar__heart-svg" viewBox="0 0 32 32" fill="none">
                                            <path
                                                d="M16 28 C16 28 3.5 19 3.5 10.5 C3.5 5.8 7 2.5 11.5 2.5 C14.2 2.5 15.5 4 16 4.7 C16.5 4 17.8 2.5 20.5 2.5 C25 2.5 28.5 5.8 28.5 10.5 C28.5 19 16 28 16 28 Z"
                                                fill="#B5382A"
                                                stroke="#8B2318"
                                                strokeWidth="1.2"
                                            />
                                        </svg>
                                        <span className="mx-calendar__heart-num">18</span>
                                    </div>
                                ) : (
                                    day
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Countdown */}
                {!time.arrived && (
                    <div className="mx-countdown mx-reveal mx-reveal--d3">
                        {[['Días', time.days], ['Horas', time.hours], ['Min', time.minutes], ['Seg', time.seconds]].map(([l, v]) => (
                            <div key={l} className="mx-countdown__item">
                                <strong className="mx-countdown__number">{l === 'Días' ? v : pad(v)}</strong>
                                <span className="mx-countdown__label">{l}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.4rem' }} className="mx-reveal mx-reveal--d3">
                    <button className="mx-btn mx-btn--gold" type="button" onClick={addToCalendar}>
                        <CalendarPlus size={16} /> AGREGAR AL CALENDARIO
                    </button>
                </div>
            </div>
        </section>
    )
}

/* ═══════════════════════════════════════════════════════════════
   5. FRASE DE AMOR ROMÁNTICA
   ═══════════════════════════════════════════════════════════════ */
function RomanticQuote() {
    return (
        <section className="mx-quote-section">
            <div className="mx-floating-stickers-layer" aria-hidden="true">
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-8.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-3"
                    style={{ top: '15px', right: '14px', width: '68px', '--rot': '10deg' }}
                />
            </div>

            <div className="mx-container">
                <div className="mx-quote-card mx-reveal">
                    <img
                        src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-20.png"
                        alt="Para toda la vida"
                        className="mx-quote__sticker"
                    />
                    <p className="mx-quote__text">
                        “Andábamos sin buscarnos, pero sabiendo que andábamos para encontrarnos.
                        Hoy comenzamos a escribir juntos el capítulo más bonito de nuestras vidas.”
                    </p>
                    <HeartDivider />
                    <p className="mx-quote__author">{CONFIG.couple[0]} & {CONFIG.couple[1]}</p>
                </div>
            </div>
        </section>
    )
}

/* ═══════════════════════════════════════════════════════════════
   6. ITINERARIO & LUGARES
   ═══════════════════════════════════════════════════════════════ */
function ItineraryAndVenues() {
    return (
        <section className="mx-itinerary-section">
            <div className="mx-floating-stickers-layer" aria-hidden="true">
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-4.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-1"
                    style={{ top: '10px', left: '10px', width: '55px', '--rot': '-8deg' }}
                />
                <img
                    src="/invitations/plantilla-boda-mexicana/img/stickers/sticker-26.png"
                    alt=""
                    className="mx-floating-sticker mx-float-anim-2"
                    style={{ bottom: '15px', right: '10px', width: '65px', '--rot': '6deg' }}
                />
            </div>

            <div className="mx-container">
                <div className="mx-heading mx-reveal">
                    <p className="mx-heading__kicker">Cronograma del evento</p>
                    <h2 className="mx-heading__title">El Gran Día</h2>
                </div>

                <div className="mx-timeline" style={{ marginBottom: '3.5rem' }}>
                    {CONFIG.itinerary.map((item, i) => {
                        const Icon = item.icon
                        return (
                            <div key={item.time} className="mx-timeline__item mx-reveal" style={{ transitionDelay: `${i * .08}s` }}>
                                <div className={`mx-timeline__dot${item.color ? ` mx-timeline__dot--${item.color}` : ''}`}>
                                    <Icon />
                                </div>
                                <div className="mx-timeline__content">
                                    <span className="mx-timeline__time">{item.time}</span>
                                    <h3 className="mx-timeline__title">{item.label}</h3>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mx-heading mx-reveal">
                    <p className="mx-heading__kicker">¿Dónde y cuándo?</p>
                    <h2 className="mx-heading__title">Ceremonia & Fiesta</h2>
                </div>

                {/* Ceremony */}
                <div className="mx-event-card mx-reveal mx-reveal--d1">
                    <MexicanFloralFrame />
                    <Church size={30} className="mx-event__icon" />
                    <p className="mx-heading__kicker" style={{ marginBottom: '.2rem' }}>Ceremonia Religiosa</p>
                    <h3 className="mx-event__name">{CONFIG.ceremony.name}</h3>
                    <address className="mx-event__address">
                        {CONFIG.ceremony.address.split('\n').map((l, idx) => <span key={idx}>{l}<br /></span>)}
                    </address>
                    <p className="mx-event__time">{CONFIG.ceremony.time}</p>
                    <a className="mx-btn" href={CONFIG.ceremony.maps} target="_blank" rel="noreferrer">
                        <Navigation size={14} /> VER UBICACIÓN
                    </a>
                </div>

                {/* Reception */}
                <div className="mx-event-card mx-reveal mx-reveal--d2" style={{ marginTop: '1.8rem' }}>
                    <MexicanFloralFrame />
                    <PartyPopper size={30} className="mx-event__icon" style={{ color: 'var(--mx-rosa)' }} />
                    <p className="mx-heading__kicker" style={{ marginBottom: '.2rem' }}>Recepción & Fiesta</p>
                    <h3 className="mx-event__name">{CONFIG.reception.name}</h3>
                    <address className="mx-event__address">
                        {CONFIG.reception.address.split('\n').map((l, idx) => <span key={idx}>{l}<br /></span>)}
                    </address>
                    <p className="mx-event__time">{CONFIG.reception.time}</p>
                    <a className="mx-btn mx-btn--rosa" href={CONFIG.reception.maps} target="_blank" rel="noreferrer">
                        <Navigation size={14} /> VER UBICACIÓN
                    </a>
                </div>
            </div>
        </section>
    )
}

/* ═══════════════════════════════════════════════════════════════
   7. LO DEMÁS: DRESS CODE & REGALOS
   ═══════════════════════════════════════════════════════════════ */
function DressCodeAndGifts() {
    return (
        <>
            <section className="mx-dress-section">
                <div className="mx-container">
                    <div className="mx-heading mx-reveal">
                        <p className="mx-heading__kicker">Viste para celebrar</p>
                        <h2 className="mx-heading__title">Código de Vestimenta</h2>
                    </div>

                    <div className="mx-dress__card mx-reveal mx-reveal--d1">
                        <MexicanFloralFrame />
                        <p className="mx-dress__subtitle">Dress code sugerido</p>
                        <p className="mx-dress__type">Formal Mexicano</p>
                        <HeartDivider />
                        <div className="mx-dress__group">
                            <p className="mx-dress__group-title">Mujeres</p>
                            <p className="mx-dress__group-text">Vestido largo o midi en colores vivos, cálidos o estampados elegantes.</p>
                        </div>
                        <div className="mx-dress__group">
                            <p className="mx-dress__group-title">Hombres</p>
                            <p className="mx-dress__group-text">Traje formal o guayabera tradicional con pantalón de vestir.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div><PapelPicadoGarland /></div>

            <section className="mx-gifts-section">
                <div className="mx-container">
                    <div className="mx-heading mx-reveal">
                        <p className="mx-heading__kicker">Un detalle especial</p>
                        <h2 className="mx-heading__title">Mesa de Regalos</h2>
                    </div>

                    <div className="mx-gifts__card mx-reveal mx-reveal--d1">
                        <MexicanFloralFrame />
                        <Gift size={28} style={{ color: 'var(--mx-mustard)', marginBottom: '.4rem' }} />
                        <p className="mx-gifts__text">
                            Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros,
                            hemos preparado nuestra mesa de regalos en línea.
                        </p>
                        <HeartDivider />
                        <p className="mx-gifts__store">{CONFIG.gifts.store}</p>
                        <a className="mx-btn mx-btn--blue" href={CONFIG.gifts.url} target="_blank" rel="noreferrer">
                            <ShoppingBag size={14} /> VER MESA DE REGALOS
                        </a>
                        <p className="mx-gifts__sentiment">¡Agradecemos de corazón tu amor y buenos deseos!</p>
                    </div>
                </div>
            </section>
        </>
    )
}

/* ═══════════════════════════════════════════════════════════════
   8. RSVP — ANTES DEL FOOTER (Sin opción negativa)
   ═══════════════════════════════════════════════════════════════ */
function RSVPSection() {
    const [form, setForm] = useState({ name: '', guests: '1' })
    const [demoSent, setDemoSent] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        if (CONFIG.whatsapp === '5210000000000') {
            setDemoSent(true)
            return
        }
        const names = CONFIG.couple.join(' y ')
        const msg = `¡Hola! Soy ${form.name}. Confirmo con mucho gusto mi asistencia a la boda de ${names} para ${form.guests} persona(s). ¡Nos vemos!`
        window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <section className="mx-rsvp-section" id="mx-rsvp">
            <ScallopEdge color="var(--mx-cream)" />

            <div className="mx-container">
                <div className="mx-heading mx-heading--cream mx-reveal">
                    <p className="mx-heading__kicker">Confirmación de asistencia</p>
                    <h2 className="mx-heading__title">¿Nos Acompañas?</h2>
                </div>

                <div className="mx-rsvp__card mx-reveal mx-reveal--d1">
                    <p className="mx-rsvp__subtitle">Nos encantará contar con tu presencia en nuestro gran día.</p>

                    <form className="mx-form" onSubmit={submit}>
                        <label>
                            <span>Tu Nombre Completo</span>
                            <input
                                required
                                value={form.name}
                                placeholder="Ej. Familia Rodríguez García"
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </label>

                        <label>
                            <span>Número de Acompañantes</span>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={form.guests}
                                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                            />
                        </label>

                        <button className="mx-btn mx-btn--rosa" type="submit" style={{ width: '100%', marginTop: '.4rem' }}>
                            {demoSent ? (
                                <><Check size={16} /> ¡Confirmación lista!</>
                            ) : (
                                <><Send size={16} /> CONFIRMAR ASISTENCIA</>
                            )}
                        </button>
                        {demoSent && <p className="mx-form__hint">Demo: En producción abre WhatsApp para confirmar.</p>}
                    </form>
                </div>
            </div>

            <ScallopEdge color="var(--mx-cream)" flip />
        </section>
    )
}

/* ═══════════════════════════════════════════════════════════════
   9. FOOTER CON PAPEL PICADO & CENEFA DE TALAVERA
   ═══════════════════════════════════════════════════════════════ */
function FooterSection() {
    return (
        <footer className="mx-footer">
            {/* Papel picado at top of footer */}
            <div className="mx-footer__picado">
                <PapelPicadoGarland large />
            </div>

            <div className="mx-container mx-footer__content">
                <p className="mx-footer__phrase mx-reveal">El Amor Nos Trajo Hasta Aquí</p>
                <h2 className="mx-footer__names mx-reveal mx-reveal--d1">
                    {CONFIG.couple[0]} & {CONFIG.couple[1]}
                </h2>
                <p className="mx-footer__thanks mx-reveal mx-reveal--d2">
                    ¡Los esperamos con los brazos abiertos para celebrar este amor!
                </p>
            </div>

            {/* Talavera Ceramic Ribbon Border */}
            <div className="mx-footer__talavera-wrap">
                <img
                    src="/invitations/plantilla-boda-mexicana/img/talavera-ribbon.png"
                    alt="Cenefa de Talavera Mexicana"
                    className="mx-footer__talavera-img"
                />
            </div>

            <div className="mx-footer__bottom-bar">
                <a className="mx-footer__credit" href="https://invita-ya.com" target="_blank" rel="noreferrer">
                    Hecho con amor · Invita-Ya.com
                </a>
            </div>
        </footer>
    )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN TEMPLATE
   ═══════════════════════════════════════════════════════════════ */
export default function MexicanWeddingTemplate() {
    const rootRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isOpening, setIsOpening] = useState(false)
    const [playing, setPlaying] = useState(false)
    const audioRef = useRef(null)

    useScrollReveal(rootRef)

    useEffect(() => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Dancing+Script:wght@600;700&family=Outfit:wght@400;500;600;700;800;900&family=Pacifico&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap'
        document.head.appendChild(link)
        document.title = `${CONFIG.couple.join(' & ')} · Nuestra Boda`
        return () => link.remove()
    }, [])

    useEffect(() => {
        if (!isOpen) return
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.mx-reveal').forEach((el) => {
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 88%',
                    once: true,
                    onEnter: () => el.classList.add('is-visible'),
                })
            })
        }, rootRef)
        return () => ctx.revert()
    }, [isOpen])

    const handleOpen = () => {
        if (isOpen || isOpening) return
        setIsOpening(true)
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
        }
        setTimeout(() => {
            setIsOpen(true)
            setTimeout(() => {
                document.getElementById('mx-rotulo')?.scrollIntoView({ behavior: 'smooth' })
            }, 150)
        }, 750)
    }

    const toggleMusic = async () => {
        const a = audioRef.current
        if (!a) return
        if (a.paused) {
            try {
                await a.play()
                setPlaying(true)
            } catch {
                setPlaying(false)
            }
        } else {
            a.pause()
            setPlaying(false)
        }
    }

    const openWhatsApp = () => {
        if (CONFIG.whatsapp === '5210000000000') {
            document.getElementById('mx-rsvp')?.scrollIntoView({ behavior: 'smooth' })
            return
        }
        window.open(
            `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`¡Hola! Quisiera confirmar mi asistencia a la boda de ${CONFIG.couple.join(' y ')}.`)}`,
            '_blank',
            'noopener,noreferrer'
        )
    }

    return (
        <main className="mx-template" ref={rootRef}>
            <audio ref={audioRef} loop preload="none">
                <source src={`/invitations/${CONFIG.slug}/audio/background.mp3`} type="audio/mpeg" />
            </audio>

            {/* 1. SOBRE ARTESANAL */}
            {!isOpen && (
                <EnvelopeScreen onOpen={handleOpen} isOpening={isOpening} />
            )}

            {/* INVITACIÓN ABIERTA */}
            {isOpen && (
                <>
                    {/* 2. Nombres como Rótulos de Bienvenida */}
                    <MexicanRotulo />

                    <div><PapelPicadoGarland /></div>

                    {/* 3. Padrinos */}
                    <Padrinos />

                    <div><PapelPicadoGarland /></div>

                    {/* 4. La Fecha y Agregar al Calendario */}
                    <DateSection />

                    {/* 5. Frase de Amor */}
                    <RomanticQuote />

                    <div><PapelPicadoGarland /></div>

                    {/* 6. Itinerario & Lugares */}
                    <ItineraryAndVenues />

                    {/* 7. Lo demás: Código de vestimenta y Mesa de regalos */}
                    <DressCodeAndGifts />

                    {/* 8. RSVP al final antes del footer */}
                    <RSVPSection />

                    {/* 9. Footer con Papel Picado & Cenefa de Talavera */}
                    <FooterSection />

                    {/* Floating Action Buttons */}
                    <button
                        className={`mx-fab mx-fab--music${playing ? ' is-playing' : ''}`}
                        type="button"
                        onClick={toggleMusic}
                        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
                    >
                        {playing ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                        className="mx-fab mx-fab--whatsapp"
                        type="button"
                        onClick={openWhatsApp}
                        aria-label="Contactar por WhatsApp"
                    >
                        <MessageCircle size={18} />
                    </button>
                </>
            )}
        </main>
    )
}
