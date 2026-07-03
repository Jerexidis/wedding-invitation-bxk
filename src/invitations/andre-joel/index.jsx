import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPinned } from 'lucide-react';
import { injectGoogleFonts } from '../../utils/themeEngine';
import config from './config.json';

const basePath = `/invitations/${config.slug}`;

const photoGallery = [
    { url: `${basePath}/img/foto1.jpg`, label: 'Su primer mes', note: 'Un comienzo lleno de amor' },
    { url: `${basePath}/img/foto2.jpg`, label: 'Sus primeras sonrisas', note: 'La alegría que ilumina la casa' },
    { url: `${basePath}/img/foto3.jpg`, label: 'Un regalo de Dios', note: 'Cada día crece rodeado de cariño' },
    { url: `${basePath}/img/foto4.jpg`, label: 'Momentos en familia', note: 'Pequeños instantes para atesorar' },
    { url: `${basePath}/img/foto5.jpg`, label: 'Esperando su gran día', note: 'Con ilusión por celebrar su bautizo' },
    { url: `${basePath}/img/gallery-6.jpeg`, label: 'Seis meses de ternura', note: 'Descubriendo el mundo' },
    { url: `${basePath}/img/gallery-7.jpeg`, label: 'Risas que enamoran', note: 'Siempre acompañado de amor' },
    { url: `${basePath}/img/gallery-8.jpeg`, label: 'Cinco meses de bendición', note: 'Un corazón pequeñito y amado' },
    { url: `${basePath}/img/gallery-9.jpeg`, label: 'Mirada curiosa', note: 'Cada día es una nueva aventura' },
    { url: `${basePath}/img/gallery-10.jpeg`, label: 'Hora de comer', note: 'Creciendo fuerte y feliz' },
    { url: `${basePath}/img/gallery-11.jpeg`, label: 'Nuestro niño cool', note: 'Con estilo y mucha ternura' },
];

const eventPhotos = {
    church: `${basePath}/img/templo-real.jpg`,
    party: `${basePath}/img/salon-real.jpg`,
};

const decorationImages = {
    angel: `${basePath}/img/angel-reference-cutout.png`,
    dove: `${basePath}/img/dove-font-cutout.png`,
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
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(config.countdown.targetDate));

    const heroRef = useRef(null);
    const galleryDeckRef = useRef(null);
    const galleryCardRefs = useRef([]);
    const angelRefs = useRef([]);

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

    useEffect(() => {
        if (!envelopeOpen) return undefined;

        const autoPlay = window.setInterval(() => {
            setActivePhoto((current) => (current + 1) % photoGallery.length);
        }, 4500);

        return () => window.clearInterval(autoPlay);
    }, [envelopeOpen]);

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

            angelRefs.current.forEach((node, index) => {
                if (!node) return;
                gsap.to(node, {
                    y: index % 2 === 0 ? -12 : 12,
                    x: index % 2 === 0 ? 10 : -10,
                    duration: 3.2 + index * 0.4,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            });
        }, heroRef);

        return () => ctx.revert();
    }, [envelopeOpen]);

    useEffect(() => {
        if (!envelopeOpen || !galleryDeckRef.current) return;

        galleryCardRefs.current.forEach((card, index) => {
            if (!card) return;

            const offset = index - activePhoto;
            const absOffset = Math.abs(offset);
            const direction = offset < 0 ? -1 : 1;

            gsap.to(card, {
                xPercent: offset * 54,
                y: absOffset === 0 ? 0 : 18 * absOffset,
                scale: absOffset === 0 ? 1 : Math.max(0.82, 1 - absOffset * 0.08),
                rotate: absOffset === 0 ? 0 : direction * -5,
                opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.22,
                zIndex: 20 - absOffset,
                duration: 0.8,
                ease: 'power3.out',
            });
        });
    }, [activePhoto, envelopeOpen]);

    const openInvitation = () => {
        setEnvelopeExit(true);
        window.setTimeout(() => setEnvelopeOpen(true), 700);
    };

    const nextPhoto = () => setActivePhoto((current) => (current + 1) % photoGallery.length);
    const prevPhoto = () => setActivePhoto((current) => (current - 1 + photoGallery.length) % photoGallery.length);

    return (
        <div
            className="andre-joel-invitation min-h-screen overflow-x-hidden bg-[#f7fbff] text-[#355164] selection:bg-[#bfd8ea]"
            ref={heroRef}
        >
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
                .gallery-stage {
                    perspective: 1200px;
                    min-height: 440px;
                }
                .gallery-card {
                    position: absolute;
                    inset: 0;
                    margin: auto;
                    width: min(100%, 310px);
                    height: 100%;
                    border-radius: 32px;
                    overflow: hidden;
                    transform-origin: center center;
                    box-shadow: 0 28px 60px rgba(67, 106, 131, 0.22);
                    border: 8px solid rgba(255, 255, 255, 0.96);
                    background: #fff;
                }
                .gallery-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(255,255,255,0) 42%, rgba(33,62,80,0.78) 100%);
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
                .angel-bob {
                    filter: drop-shadow(0 18px 32px rgba(102, 148, 175, 0.18));
                }
                .hero-ornament {
                    pointer-events: none;
                    user-select: none;
                    z-index: 10;
                }
                .hero-ornament img {
                    display: block;
                    height: auto;
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
                @media (max-width: 767px) {
                    .baptism-frame {
                        border-radius: 30px;
                    }
                    .baptism-frame::before {
                        inset: 10px;
                        border-radius: 22px;
                    }
                    .hero-ornament--angel {
                        position: absolute;
                        left: -4px;
                        bottom: 84px;
                    }
                    .hero-ornament--dove {
                        position: absolute;
                        right: -6px;
                        bottom: 28px;
                    }
                }
            `}</style>

            {!envelopeOpen && (
                <div className={`envelope-overlay ${envelopeExit ? 'exit' : ''}`}>
                    <div className="envelope-card heaven-stripes">
                        <div
                            className="absolute -left-6 top-6 opacity-90"
                            ref={(node) => { angelRefs.current[0] = node; }}
                        >
                            <img src={decorationImages.angel} alt="" className="angel-bob w-28" />
                        </div>
                        <div
                            className="absolute -right-4 bottom-6 opacity-80"
                            ref={(node) => { angelRefs.current[1] = node; }}
                        >
                            <img src={decorationImages.dove} alt="" className="angel-bob w-24" />
                        </div>

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
                        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-bold text-[#48677c] shadow-lg backdrop-blur-md transition hover:bg-white"
                    >
                        <ArrowLeft size={16} />
                        Regresar
                    </button>

                    <header className="relative px-4 pb-16 pt-24 md:px-8 md:pb-24">
                        <div className="mx-auto max-w-6xl">
                            <div className="baptism-frame heaven-stripes overflow-hidden px-6 py-8 md:px-10 md:py-12">
                                <div className="relative grid items-center gap-10 md:grid-cols-[220px_minmax(0,1fr)_220px]">
                                    <div className="hero-ornament hero-ornament--angel order-2 flex justify-center md:static md:order-1 md:justify-start">
                                        <img src={decorationImages.angel} alt="" className="angel-bob w-24 sm:w-28 md:w-52" />
                                    </div>

                                    <div className="order-1 px-1 text-center md:order-2 md:px-0">
                                        <div
                                            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-sm"
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
                                        <div className="mt-5 flex justify-center" data-hero-copy>
                                            <div className="overflow-hidden rounded-full border-[6px] border-white bg-white shadow-[0_20px_45px_rgba(77,128,157,0.22)]">
                                                <img
                                                    src={decorationImages.heroBaby}
                                                    alt={config.hero.name}
                                                    className="h-28 w-28 object-cover sm:h-32 sm:w-32 md:h-40 md:w-40"
                                                />
                                            </div>
                                        </div>
                                        <h1
                                            className="mt-5 font-['Parisienne'] text-[3.35rem] leading-none text-[#48677c] sm:text-6xl md:text-8xl"
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
                                            className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-3 pb-28 md:pb-0"
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

                                    <div className="hero-ornament hero-ornament--dove order-3 flex justify-center md:static md:justify-end">
                                        <img src={decorationImages.dove} alt="" className="angel-bob w-24 sm:w-28 md:w-48" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="space-y-6 pb-20">
                        <section className="px-4 md:px-8">
                            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                                <div className="cloud-card p-8 md:p-10" data-section-card>
                                    <p className="text-[0.72rem] font-black uppercase tracking-[0.34em] text-[#7aa0bb]">
                                        Mis papás
                                    </p>
                                    <h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-semibold text-[#4b6a7f] md:text-5xl">
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

                                <div className="cloud-card p-8" data-section-card>
                                    <p className="text-[0.72rem] font-black uppercase tracking-[0.34em] text-[#7aa0bb]">
                                        Cuenta regresiva
                                    </p>
                                    <h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl font-semibold text-[#4b6a7f]">
                                        Falta muy poquito
                                    </h2>
                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <CountdownBox value={timeLeft.dias} label="Días" />
                                        <CountdownBox value={timeLeft.horas} label="Horas" />
                                        <CountdownBox value={timeLeft.minutos} label="Minutos" />
                                        <CountdownBox value={timeLeft.segundos} label="Segundos" />
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
                                <div className="mb-8 text-center">
                                    <p className="text-[0.72rem] font-black uppercase tracking-[0.36em] text-[#81a6bf]">
                                        Detalles del día
                                    </p>
                                    <h2 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold text-[#49697e]">
                                        Lugares para celebrar
                                    </h2>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {config.events.map((event) => {
                                        const imageSrc = event.icon === 'church' ? eventPhotos.church : eventPhotos.party;

                                        return (
                                            <article key={event.title} className="cloud-card overflow-hidden" data-section-card>
                                                <div className="relative h-64">
                                                    <img
                                                        src={imageSrc}
                                                        alt={event.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#213e50]/80 via-[#213e50]/25 to-transparent px-6 pb-5 pt-12">
                                                        <p className="text-[0.68rem] font-black uppercase tracking-[0.32em] text-white/75">
                                                            Foto real del lugar
                                                        </p>
                                                        <h3 className="mt-2 font-['Cormorant_Garamond'] text-4xl font-semibold text-white">
                                                            {event.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 p-7">
                                                    <div>
                                                        <p className="text-xl font-bold text-[#48687d]">{event.location}</p>
                                                        <p className="mt-1 text-sm leading-6 text-[#6d8a9c]">{event.address}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#81a6bf]">
                                                        <span className="rounded-full bg-[#edf5fb] px-3 py-1 text-[#4f748d]">{event.time}</span>
                                                        <span>{event.icon === 'church' ? 'Ceremonia' : 'Recepción'}</span>
                                                    </div>
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
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section className="px-4 md:px-8">
                            <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-[#dff1fc] via-[#eef8ff] to-white px-6 py-10 md:px-10">
                                <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                                    <div data-section-card>
                                        <p className="text-[0.72rem] font-black uppercase tracking-[0.36em] text-[#81a6bf]">
                                            Galería
                                        </p>
                                        <h2 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold text-[#49697e]">
                                            Recuerdos de André Joel
                                        </h2>
                                        <p className="mt-5 max-w-md text-base leading-8 text-[#638399]">
                                            Una colección de instantes tiernos para acompañar esta invitación. Toca las flechas o una miniatura para descubrir más momentos.
                                        </p>

                                        <div className="mt-8 flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={prevPhoto}
                                                className="rounded-full bg-white p-3 text-[#4b7087] shadow-md transition hover:-translate-y-0.5"
                                                aria-label="Foto anterior"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextPhoto}
                                                className="rounded-full bg-white p-3 text-[#4b7087] shadow-md transition hover:-translate-y-0.5"
                                                aria-label="Siguiente foto"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                            <p className="ml-2 text-sm font-bold uppercase tracking-[0.28em] text-[#87aac3]">
                                                {String(activePhoto + 1).padStart(2, '0')} / {String(photoGallery.length).padStart(2, '0')}
                                            </p>
                                        </div>
                                    </div>

                                    <div data-section-card>
                                        <div className="gallery-stage relative" ref={galleryDeckRef}>
                                            {photoGallery.map((photo, index) => (
                                                <button
                                                    key={photo.url}
                                                    type="button"
                                                    className="gallery-card text-left"
                                                    onClick={() => setActivePhoto(index)}
                                                    ref={(node) => { galleryCardRefs.current[index] = node; }}
                                                    aria-label={`Ver foto ${photo.label}`}
                                                >
                                                    <img src={photo.url} alt={photo.label} className="h-full w-full object-cover" />
                                                    <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                                                        <p className="font-['Cormorant_Garamond'] text-3xl font-semibold text-white">
                                                            {photo.label}
                                                        </p>
                                                        <p className="mt-1 text-sm text-white/85">{photo.note}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
                                    {photoGallery.slice(0, 8).map((photo, index) => (
                                        <button
                                            key={`${photo.url}-thumb`}
                                            type="button"
                                            onClick={() => setActivePhoto(index)}
                                            className={`overflow-hidden rounded-[20px] border-2 transition ${activePhoto === index ? 'border-[#7faac5] shadow-md' : 'border-white/70 opacity-80 hover:opacity-100'}`}
                                        >
                                            <img src={photo.url} alt={photo.label} className="h-20 w-full object-cover md:h-24" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="px-4 md:px-8">
                            <div className="mx-auto max-w-5xl">
                                <div className="cloud-card relative overflow-hidden p-8 md:p-10" data-section-card>
                                    <div
                                        className="absolute left-4 top-6 opacity-80 md:left-8"
                                        ref={(node) => { angelRefs.current[2] = node; }}
                                    >
                                        <img src={decorationImages.angel} alt="" className="angel-bob w-28" />
                                    </div>
                                    <div
                                        className="absolute bottom-4 right-4 opacity-70 md:right-8"
                                        ref={(node) => { angelRefs.current[3] = node; }}
                                    >
                                        <img src={decorationImages.dove} alt="" className="angel-bob w-24" />
                                    </div>

                                    <div className="relative z-10 mx-auto max-w-2xl text-center">
                                        <p className="text-[0.72rem] font-black uppercase tracking-[0.36em] text-[#81a6bf]">
                                            Un detalle con cariño
                                        </p>
                                        <h2 className="mt-3 font-['Cormorant_Garamond'] text-5xl font-semibold text-[#49697e]">
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

const CountdownBox = ({ value, label }) => (
    <div className="rounded-[28px] bg-white px-5 py-6 text-center shadow-[0_18px_35px_rgba(86,132,159,0.12)]">
        <p className="text-4xl font-black text-[#4a6b7f] md:text-5xl">{String(value).padStart(2, '0')}</p>
        <p className="mt-2 text-[0.72rem] font-black uppercase tracking-[0.28em] text-[#8aadc3]">{label}</p>
    </div>
);
