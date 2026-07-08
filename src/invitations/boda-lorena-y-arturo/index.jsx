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
const CONFETTI_SHAPES = ['✦', '♥', '★', '25', '●', '✧', '♦'];

function ConfettiPiece({ index, total }) {
    const left = Math.random() * 100;
    const size = 6 + Math.random() * 14;
    const duration = 2 + Math.random() * 3;
    const delay = (index / total) * 1.8 + Math.random() * 0.5;
    const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    const shape = CONFETTI_SHAPES[index % CONFETTI_SHAPES.length];

    return (
        <span
            className="bla-confetti__piece"
            style={{
                left: `${left}%`,
                fontSize: `${size}px`,
                color,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
            }}
        >
            {shape}
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

                        {/* ── Banderines Divider ──────────────────────── */}
                        <img
                            src={`${basePath}/img/banderines.png`}
                            alt=""
                            className="bla-banderines-divider"
                            aria-hidden="true"
                            style={{ transform: 'scaleX(-1)' }}
                        />

                        {/* ── Padrinos Section ────────────────────────── */}
                        <Padrinos config={config} />

                        {/* ── Banderines Divider ──────────────────────── */}
                        <img
                            src={`${basePath}/img/banderines.png`}
                            alt=""
                            className="bla-banderines-divider"
                            aria-hidden="true"
                        />

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

                        {/* ── Banderines Divider ──────────────────────── */}
                        <img
                            src={`${basePath}/img/banderines.png`}
                            alt=""
                            className="bla-banderines-divider"
                            aria-hidden="true"
                            style={{ transform: 'scaleX(-1)' }}
                        />

                        {/* ── RSVP Section ────────────────────────────── */}
                        <RSVP config={config} basePath={basePath} />
                    </main>

                    {/* ── Footer Section ──────────────────────────── */}
                    <Footer config={config} basePath={basePath} />

                    {/* Audio Element */}
                    {config.hero.song && (
                        <audio ref={audioRef} loop>
                            <source src={`${basePath}/audio/${config.hero.song}`} type="audio/mpeg" />
                        </audio>
                    )}

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
