import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPinned, Music2, Pause } from 'lucide-react';
import { injectGoogleFonts } from '../../utils/themeEngine';
import config from './config.json';

const basePath = `/invitations/${config.slug}`;
const audioPath = `${basePath}/audio/pretty-little-baby.mp3`;

const photoGallery = [
    { url: `${basePath}/img/gallery-11.jpeg`, label: 'Una mirada que enamora', note: 'Pequeños instantes para atesorar' },
    { url: `${basePath}/img/gallery-6.jpeg`, label: 'Seis meses de ternura', note: 'Creciendo rodeado de amor' },
    { url: `${basePath}/img/gallery-7.jpeg`, label: 'Sonrisas que iluminan', note: 'Cada día es una nueva bendición' },
    { url: `${basePath}/img/gallery-9.jpeg`, label: 'Nuestro pequeño tesoro', note: 'Descubriendo el mundo' },
    { url: `${basePath}/img/gallery-10.jpeg`, label: 'Momentos cotidianos', note: 'Recuerdos que viven para siempre' },
];

const eventPhotos = {
    church: `${basePath}/img/templo-real.jpg`,
    party: `${basePath}/img/salon-real.jpg`,
};

const decorationImages = {
    angel: `${basePath}/img/angel-reference-cutout.png`,
    heroBaby: `${basePath}/img/hero-baby-circle.png`,
};

const getTimeLeft = (targetDate) => {
    const distance = new Date(targetDate).getTime() - Date.now();

    if (distance <= 0) {
        return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    }

    return {
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((distance % (1000 * 60)) / 1000),
    };
};

export default function AndreJoelInvitation() {
    const navigate = useNavigate();
    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    const [envelopeExit, setEnvelopeExit] = useState(false);
    const [activePhoto, setActivePhoto] = useState(0);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(config.countdown.targetDate));

    const heroRef = useRef(null);
    const audioRef = useRef(null);

    const eventDateLine = useMemo(
        () => `Sábado ${config.hero.date.toLowerCase()}`,
        [],
    );

    useEffect(() => {
        injectGoogleFonts('Nunito Sans', 'Cormorant Garamond');

        const cardLink = document.createElement('link');
        cardLink.rel = 'stylesheet';
        cardLink.href = 'https://fonts.googleapis.com/css2?family=Parisienne&display=swap';
        document.head.appendChild(cardLink);

        return () => {
            cardLink.remove();
        };
    }, []);

    useEffect(() => {
        document.title = config.title || 'Invita-Ya';
        return () => {
            document.title = 'Invita-Ya';
        };
    }, []);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setTimeLeft(getTimeLeft(config.countdown.targetDate));
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    useLayoutEffect(() => {
        if (!envelopeOpen) return undefined;

        const ctx = gsap.context(() => {
            gsap.from('[data-hero-badge]', {
                y: 24,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out',
            });

            gsap.from('[data-hero-copy]', {
                y: 48,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.12,
                delay: 0.15,
            });

            gsap.from('[data-section-card]', {
                y: 36,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.12,
                scrollTrigger: undefined,
            });

        }, heroRef);

        return () => ctx.revert();
    }, [envelopeOpen]);

    const openInvitation = () => {
        audioRef.current?.play().catch(() => setMusicPlaying(false));
        setEnvelopeExit(true);
        window.setTimeout(() => setEnvelopeOpen(true), 700);
    };

    const toggleMusic = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();
            } catch {
                setMusicPlaying(false);
            }
        } else {
            audio.pause();
        }
    };

    const nextPhoto = () => setActivePhoto((current) => (current + 1) % photoGallery.length);
    const prevPhoto = () => setActivePhoto((current) => (current - 1 + photoGallery.length) % photoGallery.length);

    return (
        <div
            className="andre-joel-invitation min-h-screen overflow-x-hidden bg-[#f7fbff] text-[#355164] selection:bg-[#bfd8ea]"
            ref={heroRef}
        >
            <audio
                ref={audioRef}
                src={audioPath}
                preload="auto"
                loop
                onPlay={() => setMusicPlaying(true)}
                onPause={() => setMusicPlaying(false)}
            />
            <style>{`
                .andre-joel-invitation {
                    font-family: 'Nunito Sans', sans-serif;
                    background:
                        radial-gradient(circle at top, rgba(184, 214, 232, 0.55), transparent 30%),
                        linear-gradient(180deg, #edf6fd 0%, #f8fcff 20%, #ffffff 100%);
                }
                .baptism-frame {
                    position: relative;
                    border-radius: 40px;
                    background: linear-gradient(180deg, rgba(255,255,255,0.97), rgba(244,250,255,0.95));
                    border: 1px solid rgba(143, 185, 210, 0.45);
                    box-shadow: 0 28px 90px rgba(74, 128, 161, 0.18);
                }
                .baptism-frame::before {
                    content: '';
                    position: absolute;
                    inset: 14px;
                    border-radius: 30px;
                    border: 2px dashed rgba(157, 197, 220, 0.65);
                    pointer-events: none;
                }
                .heaven-stripes {
                    background-image: linear-gradient(
                        90deg,
                        rgba(178, 212, 234, 0.32) 0,
                        rgba(178, 212, 234, 0.32) 12%,
                        rgba(255, 255, 255, 0) 12%,
                        rgba(255, 255, 255, 0) 24%
                    );
                    background-size: 180px 180px;
                }
                .cloud-card {
                    border-radius: 32px;
                    background: rgba(255, 255, 255, 0.88);
                    border: 1px solid rgba(176, 210, 230, 0.5);
                    box-shadow: 0 20px 50px rgba(88, 136, 164, 0.13);
                }
                .baby-portrait {
                    border: 6px solid rgba(255,255,255,.96);
                    border-radius: 50%;
                    box-shadow: 0 18px 42px rgba(74,128,161,.2);
                    height: 8.5rem;
                    margin: 1.15rem auto 0;
                    object-fit: cover;
                    width: 8.5rem;
                }
                .side-ornament {
                    animation: angelFloat 4.2s ease-in-out infinite;
                    filter: drop-shadow(0 14px 24px rgba(78,127,154,.16));
                    opacity: .8;
                    pointer-events: none;
                    position: absolute;
                    top: 45%;
                    width: clamp(4.2rem, 12vw, 9rem);
                    z-index: 2;
                }
                .side-ornament--left {
                    left: clamp(-1.2rem, 1vw, 1rem);
                }
                .section-angel {
                    animation: angelFloat 4.8s ease-in-out infinite;
                    filter: drop-shadow(0 12px 22px rgba(78,127,154,.15));
                    pointer-events: none;
                    position: absolute;
                    width: 6rem;
                    z-index: 0;
                }
                .countdown-strip {
                    background: linear-gradient(135deg, rgba(238,247,252,.95), rgba(255,255,255,.95));
                    border: 1px solid rgba(156,197,220,.5);
                    border-radius: 24px;
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    overflow: hidden;
                }
                .countdown-strip > div {
                    padding: 1.25rem .25rem;
                    position: relative;
                    text-align: center;
                }
                .countdown-strip > div + div::before {
                    background: rgba(134,179,205,.28);
                    content: '';
                    height: 52%;
                    left: 0;
                    position: absolute;
                    top: 24%;
                    width: 1px;
                }
                .gallery-feature {
                    aspect-ratio: 4 / 5;
                    background: #fff;
                    border: 8px solid rgba(255, 255, 255, 0.96);
                    border-radius: 34px;
                    box-shadow: 0 28px 65px rgba(67, 106, 131, 0.2);
                    overflow: hidden;
                    position: relative;
                }
                .gallery-feature img {
                    height: 100%;
                    object-fit: cover;
                    transition: opacity .3s ease, transform .6s ease;
                    width: 100%;
                }
                .gallery-caption {
                    background: rgba(255, 255, 255, .94);
                    border: 1px solid rgba(157, 197, 220, .4);
                    border-radius: 24px;
                    margin: -2.5rem auto 0;
                    max-width: calc(100% - 2rem);
                    padding: 1.1rem 1.25rem;
                    position: relative;
                    text-align: center;
                    z-index: 2;
                }
                .detail-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.55rem;
                    border-radius: 999px;
                    padding: 0.75rem 1rem;
                    background: rgba(255,255,255,0.78);
                    border: 1px solid rgba(166, 203, 225, 0.6);
                    box-shadow: 0 14px 32px rgba(71, 120, 147, 0.12);
                }
                .envelope-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    background:
                        radial-gradient(circle at top, rgba(203, 227, 244, 0.7), transparent 35%),
                        linear-gradient(180deg, #d9eefc 0%, #eef7fe 45%, #ffffff 100%);
                    transition: opacity 0.7s ease, visibility 0.7s ease;
                }
                .envelope-overlay.exit {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                }
                .envelope-card {
                    position: relative;
                    width: min(100%, 430px);
                    padding: 2.25rem 2rem;
                    border-radius: 36px;
                    text-align: center;
                    background: rgba(255,255,255,0.95);
                    border: 1px solid rgba(166, 203, 225, 0.6);
                    box-shadow: 0 30px 80px rgba(77, 128, 157, 0.22);
                    overflow: hidden;
                }
                .seal-button {
                    width: 104px;
                    height: 104px;
                    border-radius: 999px;
                    border: 4px solid #fff;
                    background: linear-gradient(145deg, #8fbedb, #6f9bb8);
                    color: #fff;
                    box-shadow: 0 20px 40px rgba(79, 129, 158, 0.3);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                    animation: pulseSeal 2s infinite;
                }
                .seal-button:hover {
                    transform: scale(1.06) rotate(-4deg);
                    box-shadow: 0 24px 48px rgba(79, 129, 158, 0.38);
                }
                @keyframes pulseSeal {
                    0% { box-shadow: 0 0 0 0 rgba(143, 190, 219, 0.4); }
                    70% { box-shadow: 0 0 0 22px rgba(143, 190, 219, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(143, 190, 219, 0); }
                }
                @keyframes angelFloat {
                    0%, 100% { transform: translateY(2px) rotate(-1deg); }
                    50% { transform: translateY(-7px) rotate(1deg); }
                }
                @media (max-width: 767px) {
                    .baptism-frame {
                        border-radius: 30px;
                    }
                    .baptism-frame::before {
                        inset: 10px;
                        border-radius: 22px;
                    }
                    .cloud-card {
                        border-radius: 26px;
                    }
                    .gallery-feature {
                        border-radius: 26px;
                    }
                    .envelope-card {
                        padding: 1.75rem 1.35rem;
                    }
                    .side-ornament {
                        top: 27%;
                        width: 4rem;
                    }
                    .baby-portrait {
                        height: 7.5rem;
                        width: 7.5rem;
                    }
                }
            `}</style>

            {envelopeOpen && (
                <button
                    type="button"
                    onClick={toggleMusic}
                    className={`fixed right-3 top-3 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/85 shadow-lg backdrop-blur-md transition hover:bg-white ${musicPlaying ? 'text-[#48677c]' : 'text-[#86a8c1]'}`}
                    aria-label={musicPlaying ? 'Pausar música' : 'Reproducir música'}
                >
                    {musicPlaying ? <Pause size={16} /> : <Music2 size={16} />}
                </button>
            )}

            {!envelopeOpen && (
                <div className={`envelope-overlay ${envelopeExit ? 'exit' : ''}`}>
                    <div className="envelope-card heaven-stripes">
                        <img
                            src={decorationImages.angel}
                            alt=""
                            className="absolute left-2 top-3 w-16 opacity-70"
                            aria-hidden="true"
                        />
                        <div className="relative z-10 space-y-5 py-4">
                            <p className="text-[0.72rem] font-black uppercase tracking-[0.38em] text-[#729ab5]">
                                Una celebración muy especial
                            </p>
                            <h2 className="font-['Parisienne'] text-5xl text-[#45657a]">
                                André Joel
                            </h2>
                            <p className="mx-auto max-w-xs text-sm leading-7 text-[#60839a]">
                                Con mucha alegría queremos compartir contigo el día en que recibirá la bendición de Dios.
                            </p>
                            <button
                                type="button"
                                onClick={openInvitation}
                                className="seal-button font-['Cormorant_Garamond'] text-4xl font-bold"
                            >
                                A
                            </button>
                            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#84a9c3]">
                                Abrir invitación
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {envelopeOpen && (
                <>
                    <button
                        onClick={() => navigate('/')}
                        className="fixed left-3 top-3 z-50 inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-white/80 bg-white/85 text-sm font-bold text-[#48677c] shadow-lg backdrop-blur-md transition hover:bg-white sm:left-4 sm:top-4 sm:h-auto sm:w-auto sm:px-4 sm:py-2"
                        aria-label="Regresar"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Regresar</span>
                    </button>

                    <header className="relative px-4 pb-10 pt-16 md:px-8 md:pb-20 md:pt-24">
                        <div className="mx-auto max-w-6xl">
                            <div className="baptism-frame heaven-stripes overflow-hidden px-5 py-8 md:px-10 md:py-12">
                                <img
                                    src={decorationImages.angel}
                                    alt=""
                                    className="side-ornament side-ornament--left"
                                    aria-hidden="true"
                                />
                                <div className="relative mx-auto max-w-3xl px-1 text-center md:px-0">
                                        <div
                                            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-sm"
                                            data-hero-badge
                                        >
                                            <span className="h-2 w-2 rounded-full bg-[#86b6d3]" />
                                            <p className="text-[0.72rem] font-black uppercase tracking-[0.34em] text-[#6f95b0]">
                                                Mi Bautizo
                                            </p>
                                            <span className="h-2 w-2 rounded-full bg-[#d4c287]" />
                                        </div>

                                        <p
                                            className="text-sm font-bold uppercase tracking-[0.35em] text-[#7da0b9]"
                                            data-hero-copy
                                        >
                                            {config.intro.message}
                                        </p>
                                        <img
                                            src={decorationImages.heroBaby}
                                            alt={config.hero.name}
                                            className="baby-portrait"
                                            data-hero-copy
                                        />
                                        <h1
                                            className="mt-5 font-['Parisienne'] text-[3.55rem] leading-[0.9] text-[#48677c] sm:text-6xl md:text-8xl"
                                            data-hero-copy
                                        >
                                            {config.hero.name}
                                        </h1>
                                        <p
                                            className="mx-auto mt-5 max-w-[18rem] text-[0.98rem] leading-7 text-[#56788f] sm:max-w-xl md:max-w-2xl md:text-lg"
                                            data-hero-copy
                                        >
                                            Dejen que los niños vengan a mí, y no se lo impidan, porque el reino de Dios es de quienes son como ellos.
                                        </p>
                                        <p
                                            className="mt-2 text-xs font-extrabold uppercase tracking-[0.3em] text-[#8cadc3]"
                                            data-hero-copy
                                        >
                                            Marcos 10:14
                                        </p>

                                        <div
                                            className="mx-auto mt-7 flex max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                                            data-hero-copy
                                        >
                                            <div className="detail-pill">
                                                <span className="text-[0.68rem] font-black uppercase tracking-[0.25em] text-[#84a6be]">Fecha</span>
                                                <span className="text-sm font-bold text-[#47657a]">{eventDateLine}</span>
                                            </div>
                                            <div className="detail-pill">
                                                <span className="text-[0.68rem] font-black uppercase tracking-[0.25em] text-[#84a6be]">Hora</span>
                                                <span className="text-sm font-bold text-[#47657a]">{config.events[0]?.time}</span>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="space-y-10 pb-16 md:space-y-14 md:pb-20">
                        <section className="px-4 md:px-8">
                            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                                <div className="cloud-card relative overflow-hidden p-6 md:p-10" data-section-card>
                                    <img
                                        src={decorationImages.angel}
                                        alt=""
                                        className="section-angel -bottom-5 -right-4 opacity-20 md:w-28"
                                        aria-hidden="true"
                                    />
                                    <p className="text-[0.72rem] font-black uppercase tracking-[0.34em] text-[#7aa0bb]">
                                        Mis papás
                                    </p>
                                    <h2 className="mt-3 font-['Cormorant_Garamond'] text-[2.45rem] font-semibold leading-[1.02] text-[#4b6a7f] md:text-5xl">
                                        Con el amor de nuestra familia
                                    </h2>
                                    <div className="mt-6 space-y-4 text-lg text-[#54758b]">
                                        <p className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#45667d]">
                                            {config.intro.parent1}
                                        </p>
                                        <p className="text-sm font-black uppercase tracking-[0.32em] text-[#d2bf86]">&</p>
                                        <p className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#45667d]">
                                            {config.intro.parent2}
                                        </p>
                                    </div>
                                    <p className="mt-6 max-w-2xl text-base leading-8 text-[#6a889b]">
                                        {config.intro.closingMessage}. Nos encantará que nos acompañes a vivir este momento de fe, ternura y gratitud.
                                    </p>
                                </div>

                                <div className="cloud-card p-6 md:p-8" data-section-card>
                                    <p className="text-[0.72rem] font-black uppercase tracking-[0.34em] text-[#7aa0bb]">
                                        Cuenta regresiva
                                    </p>
                                    <h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-semibold text-[#4b6a7f]">
                                        Falta muy poquito
                                    </h2>
                                    <div className="countdown-strip mt-7" aria-label="Cuenta regresiva para el bautizo">
                                        {[
                                            { value: timeLeft.dias, label: 'Días' },
                                            { value: timeLeft.horas, label: 'Horas' },
                                            { value: timeLeft.minutos, label: 'Min' },
                                            { value: timeLeft.segundos, label: 'Seg' },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <p className="text-2xl font-black text-[#4a6b7f] md:text-4xl">
                                                    {String(item.value).padStart(2, '0')}
                                                </p>
                                                <p className="mt-1 text-[0.58rem] font-black uppercase tracking-[0.12em] text-[#8aadc3] md:text-[0.68rem]">
                                                    {item.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {config.padrinos?.enabled && (
                                        <div className="mt-8 rounded-[28px] bg-[#eff7fc] p-6">
                                            <p className="text-[0.68rem] font-black uppercase tracking-[0.32em] text-[#84a8c0]">
                                                Mis padrinos
                                            </p>
                                            <p className="mt-4 font-['Cormorant_Garamond'] text-2xl font-semibold text-[#48687d]">
                                                {config.padrinos.padrino1}
                                            </p>
                                            <p className="my-1 text-sm font-black uppercase tracking-[0.25em] text-[#d3bf80]">&</p>
                                            <p className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#48687d]">
                                                {config.padrinos.padrino2}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="px-4 md:px-8">
                            <div className="mx-auto max-w-6xl">
                                <div className="mb-7 text-center">
                                    <p className="text-[0.72rem] font-black uppercase tracking-[0.36em] text-[#81a6bf]">
                                        Detalles del día
                                    </p>
                                    <h2 className="mt-3 font-['Cormorant_Garamond'] text-[2.65rem] font-semibold leading-none text-[#49697e] md:text-5xl">
                                        Lugares para celebrar
                                    </h2>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {config.events.map((event) => {
                                        const imageSrc = event.icon === 'church' ? eventPhotos.church : eventPhotos.party;

                                        return (
                                            <article key={event.title} className="cloud-card overflow-hidden" data-section-card>
                                                <div className="relative h-48 md:h-64">
                                                    <img
                                                        src={imageSrc}
                                                        alt={event.location}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#213e50]/85 via-[#213e50]/20 to-transparent px-5 pb-4 pt-12 md:px-7 md:pb-5">
                                                        <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/75">
                                                            {event.icon === 'church' ? 'Ceremonia' : 'Recepción'}
                                                        </p>
                                                        <h3 className="mt-1 font-['Cormorant_Garamond'] text-3xl font-semibold text-white md:text-4xl">
                                                            {event.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 p-6 md:p-7">
                                                    <div>
                                                        <p className="text-xl font-bold text-[#48687d]">{event.location}</p>
                                                        <p className="mt-1 text-sm leading-6 text-[#6d8a9c]">{event.address}</p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-[#edf5fb] px-3 py-2 text-sm font-bold text-[#4f748d]">
                                                            {event.time} hrs.
                                                        </span>
                                                        <a
                                                            href={event.mapLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 rounded-full bg-[#edf6fc] px-4 py-2 text-sm font-bold text-[#4c718a] transition hover:bg-[#dfeef8]"
                                                        >
                                                            <MapPinned size={16} />
                                                            Ver ubicación
                                                        </a>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section className="px-4 md:px-8">
                            <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] bg-gradient-to-br from-[#dff1fc] via-[#eef8ff] to-white px-5 py-8 md:rounded-[36px] md:px-10 md:py-12">
                                <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                                    <div data-section-card>
                                        <p className="text-[0.72rem] font-black uppercase tracking-[0.36em] text-[#81a6bf]">
                                            Galería
                                        </p>
                                        <h2 className="mt-3 font-['Cormorant_Garamond'] text-[2.75rem] font-semibold leading-[0.95] text-[#49697e] md:text-5xl">
                                            Recuerdos de André Joel
                                        </h2>
                                        <p className="mt-5 max-w-md text-base leading-8 text-[#638399]">
                                            Cinco momentos únicos de nuestro pequeño, elegidos con mucho cariño para compartirlos contigo.
                                        </p>

                                    </div>

                                    <div data-section-card>
                                        <div className="gallery-feature">
                                            <img
                                                key={photoGallery[activePhoto].url}
                                                src={photoGallery[activePhoto].url}
                                                alt={photoGallery[activePhoto].label}
                                            />
                                        </div>
                                        <div className="gallery-caption">
                                            <p className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#49697e]">
                                                {photoGallery[activePhoto].label}
                                            </p>
                                            <p className="mt-1 text-sm text-[#7290a3]">{photoGallery[activePhoto].note}</p>
                                        </div>
                                        <div className="mt-6 flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={prevPhoto}
                                                className="rounded-full bg-white p-3 text-[#4b7087] shadow-md transition hover:-translate-y-0.5"
                                                aria-label="Foto anterior"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <p className="mx-2 text-sm font-bold uppercase tracking-[0.28em] text-[#87aac3]">
                                                {String(activePhoto + 1).padStart(2, '0')} / {String(photoGallery.length).padStart(2, '0')}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={nextPhoto}
                                                className="rounded-full bg-white p-3 text-[#4b7087] shadow-md transition hover:-translate-y-0.5"
                                                aria-label="Siguiente foto"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="px-4 md:px-8">
                            <div className="mx-auto max-w-5xl">
                                <div className="cloud-card relative overflow-hidden p-6 md:p-10" data-section-card>
                                    <img
                                        src={decorationImages.angel}
                                        alt=""
                                        className="section-angel -left-4 -top-5 opacity-20 md:w-28"
                                        aria-hidden="true"
                                    />
                                    <div className="relative z-10 mx-auto max-w-2xl text-center">
                                        <p className="text-[0.72rem] font-black uppercase tracking-[0.36em] text-[#81a6bf]">
                                            Un detalle con cariño
                                        </p>
                                        <h2 className="mt-3 font-['Cormorant_Garamond'] text-[2.65rem] font-semibold leading-none text-[#49697e] md:text-5xl">
                                            Se agradece cualquier detalle
                                        </h2>
                                        <p className="mt-5 text-base leading-8 text-[#67879d]">
                                            Tu presencia es lo más importante para nosotros. Si además deseas consentir a André Joel con un detalle, será recibido con muchísimo cariño y gratitud.
                                        </p>

                                        <div className="mx-auto mt-8 max-w-xl rounded-[30px] bg-gradient-to-br from-[#edf7fd] to-white px-6 py-7 shadow-inner">
                                            <p className="font-['Cormorant_Garamond'] text-4xl font-semibold text-[#4a6a7f]">
                                                Gracias por acompañarnos
                                            </p>
                                            <p className="mt-3 text-sm leading-7 text-[#7393a8]">
                                                Cada muestra de afecto hará todavía más especial este día tan esperado para nuestra familia.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>

                    <footer className="px-4 pb-14 md:px-8">
                        <div className="mx-auto max-w-6xl rounded-[30px] border border-white/70 bg-white/80 px-8 py-8 text-center shadow-[0_22px_60px_rgba(72,103,124,0.12)] backdrop-blur-sm">
                            <p className="font-['Parisienne'] text-4xl text-[#4a697e]">{config.footer.name}</p>
                            <p className="mt-1 text-sm uppercase tracking-[0.28em] text-[#86a8c1]">{config.footer.subtitle}</p>
                            <p className="mt-4 text-sm leading-7 text-[#6d8b9e]">
                                Gracias por ser parte de este momento tan especial en la vida de nuestro pequeño.
                            </p>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
}
