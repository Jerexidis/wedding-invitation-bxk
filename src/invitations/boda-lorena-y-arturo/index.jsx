import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Sparkles, Music } from 'lucide-react';
import { injectGoogleFonts } from '../../utils/themeEngine';
import config from './config.json';
import './invitation.css';

// ─── Imports Architectura Separada ──────────────────────────────
import Envelope from './Envelope';
import Hero from './Hero';
import Padrinos from './Padrinos';
import Events from './Events';
import Gallery from './Gallery';
import RSVP from './RSVP';
import Footer from './Footer';

const basePath = `/invitations/${config.slug}`;

// ─── Helpers ────────────────────────────────────────────────────
const getTimeLeft = (targetDate) => {
    const distance = new Date(targetDate).getTime() - Date.now();
    if (distance <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    return {
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((distance % (1000 * 60)) / 1000),
    };
};

// ─── Confetti & Silver Sparkles ─────────────────────────────────
const CONFETTI_COLORS = ['#c0c0c0', '#e8e8e8', '#d4d4d4', '#c9b896', '#b8b8b8', '#a8a8a8', '#f0ead6'];

// SVG shapes that render consistently across all devices
const ConfettiStar = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
);

const ConfettiHeart = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const ConfettiDiamond = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 12l10 10 10-10z" />
    </svg>
);

const ConfettiSparkle = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0l1.8 8.4L22 12l-8.2 3.6L12 24l-1.8-8.4L2 12l8.2-3.6z" />
    </svg>
);

const ConfettiCircle = ({ color, size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" />
    </svg>
);

const Confetti25 = ({ color, size }) => (
    <svg width={size * 1.4} height={size} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="18" y="18" textAnchor="middle" fontFamily="var(--font-display)" fontSize="20" fontWeight="700" fill={color}>25</text>
    </svg>
);

const CONFETTI_COMPONENTS = [ConfettiSparkle, ConfettiHeart, ConfettiStar, Confetti25, ConfettiCircle, ConfettiSparkle, ConfettiDiamond];

function ConfettiPiece({ index, total }) {
    const left = Math.random() * 100;
    const size = 6 + Math.random() * 14;
    const duration = 2 + Math.random() * 3;
    const delay = (index / total) * 1.8 + Math.random() * 0.5;
    const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    const ShapeComponent = CONFETTI_COMPONENTS[index % CONFETTI_COMPONENTS.length];

    return (
        <span
            className="bla-confetti__piece"
            style={{
                left: `${left}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
            }}
        >
            <ShapeComponent color={color} size={size} />
        </span>
    );

}

// ═══════════════════════════════════════════════════════════════════
// Main Component — Bodas de Plata 🥈 (Orchestrator)
// ═══════════════════════════════════════════════════════════════════
export default function BodaLorenaYArturo({ portfolioMode = false }) {
    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    const [envelopeExit, setEnvelopeExit] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(config.countdown.targetDate));

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const invitationRef = useRef(null);

    // ─── Fonts & Title ──────────────────────────────────────────
    useEffect(() => {
        injectGoogleFonts('Quicksand', 'Dancing Script');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap';
        document.head.appendChild(link);
        return () => link.remove();
    }, []);

    useEffect(() => {
        const prev = document.title;
        document.title = config.title || 'Bodas de Plata | Lorena & Arturo ♥';
        return () => { document.title = prev; };
    }, []);

    // ─── Countdown ──────────────────────────────────────────────
    useEffect(() => {
        const timer = window.setInterval(() => {
            setTimeLeft(getTimeLeft(config.countdown.targetDate));
        }, 1000);
        return () => window.clearInterval(timer);
    }, []);

    // ─── Open envelope ──────────────────────────────────────────
    const openInvitation = useCallback(() => {
        setEnvelopeExit(true);
        setShowConfetti(true);
        window.setTimeout(() => setEnvelopeOpen(true), 800);
        window.setTimeout(() => setShowConfetti(false), 5000);

        // Autoplay background music
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch((err) => {
                console.log("Autoplay blocked or audio not loaded:", err);
            });
        }
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch((err) => {
                console.log("Failed to play audio:", err);
            });
        }
    };

    // ─── Entrance Animations ────────────────────────────────────
    useLayoutEffect(() => {
        if (!envelopeOpen) return undefined;

        const ctx = gsap.context(() => {
            gsap.from('[data-bla-hero]', {
                y: 40,
                opacity: 0,
                duration: 0.9,
                ease: 'back.out(1.4)',
                stagger: 0.12,
                delay: 0.1,
            });

            // Fun bounce on the "25 años" badge
            gsap.from('[data-silver-badge]', {
                scale: 0,
                rotation: -180,
                duration: 1.2,
                ease: 'elastic.out(1.2, 0.5)',
                delay: 0.6,
            });
        }, invitationRef);

        return () => ctx.revert();
    }, [envelopeOpen]);

    // ─── Intersection Observer for scroll animations ────────────
    useEffect(() => {
        if (!envelopeOpen) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('bla-animate-slide');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 },
        );

        const elements = document.querySelectorAll('[data-bla-section]');
        elements.forEach((el) => {
            el.style.opacity = '0';
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [envelopeOpen]);

    // ═════════════════════════════════════════════════════════════
    // Render
    // ═════════════════════════════════════════════════════════════
    return (
        <div className="bla-invitation" ref={invitationRef} data-portfolio={portfolioMode ? 'true' : 'false'}>

            {/* ── Confetti ────────────────────────────────────── */}
            {showConfetti && (
                <div className="bla-confetti" aria-hidden="true">
                    {Array.from({ length: 70 }, (_, i) => (
                        <ConfettiPiece key={i} index={i} total={70} />
                    ))}
                </div>
            )}

            {/* ── Envelope Cover Section ──────────────────────── */}
            {!envelopeOpen && (
                <Envelope
                    config={config}
                    basePath={basePath}
                    openInvitation={openInvitation}
                    envelopeExit={envelopeExit}
                />
            )}

            {/* ── Main Invitation Content ─────────────────────── */}
            {envelopeOpen && (
                <>
                    {/* ── Hero Header ────────────────────────────── */}
                    <Hero config={config} basePath={basePath} />

                    <main>
                        {/* ── Banderines Divider ──────────────────────── */}
                        <img
                            src={`${basePath}/img/banderines.png`}
                            alt=""
                            className="bla-banderines-divider"
                            aria-hidden="true"
                        />

                        {/* ── Countdown ──────────────────────────────── */}
                        <section className="bla-section" style={{ textAlign: 'center' }} data-bla-section>
                            <p className="bla-section__eyebrow">
                                <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                Cuenta Regresiva
                            </p>
                            <h2 className="bla-section__title">¡Ya falta poquito!</h2>
                            <p className="bla-section__subtitle">
                                {config.countdown.subtitle}
                            </p>

                            <div className="bla-countdown">
                                <CountdownBox value={timeLeft.dias} label="Días" />
                                <CountdownBox value={timeLeft.horas} label="Horas" />
                                <CountdownBox value={timeLeft.minutos} label="Min" />
                                <CountdownBox value={timeLeft.segundos} label="Seg" />
                            </div>
                        </section>

                        {/* ── Padrinos Section ────────────────────────── */}
                        <Padrinos config={config} />

                        {/* ── Events Section ──────────────────────────── */}
                        <Events config={config} basePath={basePath} />

                        {/* ── Toast/Brindis Section ──────────────────── */}
                        <section className="bla-section bla-brindis-section" data-bla-section>
                            <img
                                src={`${basePath}/img/brindis.png`}
                                alt="¡Brindis!"
                                className="bla-brindis-img"
                            />
                            <p className="bla-brindis-text">
                                ¡Por 25 años más de aventuras juntos! 🥂
                            </p>
                        </section>

                        {/* ── Gallery Section ────────────────────────── */}
                        {config.gallery?.enabled && (
                            <Gallery config={config} basePath={basePath} />
                        )}

                        {/* ── RSVP Section ────────────────────────────── */}
                        <RSVP config={config} basePath={basePath} />
                    </main>

                    {/* ── Footer Section ──────────────────────────── */}
                    <Footer config={config} basePath={basePath} />

                    {/* Floating Audio Button */}
                    {config.hero.song && (
                        <button
                            className={`bla-audio-control ${isPlaying ? 'playing' : ''}`}
                            onClick={togglePlay}
                            aria-label="Reproducir música de fondo"
                        >
                            <Music size={22} className={isPlaying ? 'bla-heartbeat' : ''} style={{ opacity: isPlaying ? 1 : 0.6 }} />
                        </button>
                    )}
                </>
            )}

            {/* Audio Element (Rendered unconditionally so audioRef is available before opening) */}
            {config.hero.song && (
                <audio ref={audioRef} loop>
                    <source src={`${basePath}/audio/${config.hero.song}`} type="audio/mpeg" />
                </audio>
            )}
        </div>
    );
}

// ─── Sub-components ─────────────────────────────────────────────
function CountdownBox({ value, label }) {
    return (
        <div className="bla-countdown__box">
            <p className="bla-countdown__value">{String(value).padStart(2, '0')}</p>
            <p className="bla-countdown__label">{label}</p>
        </div>
    );
}
