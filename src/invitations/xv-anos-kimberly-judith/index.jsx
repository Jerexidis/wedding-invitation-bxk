import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './invitation.css'

gsap.registerPlugin(ScrollTrigger)

const assetRoot = '/invitations/xv-anos-kimberly-judith'
const invitationTitle = 'XV Años | Kimberly Judith'
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n+Los+Naranjos+Av.+Gral.+Mariano+Escobedo+312+Jardines+de+la+Cruz'
const galleryPhotos = [
    {
        src: `${assetRoot}/gallery-kimberly-1.webp`,
        alt: 'Kimberly sentada en el jardín junto a los números de sus quince años',
        caption: 'Mis XV',
        position: 'center 42%',
    },
    {
        src: `${assetRoot}/gallery-kimberly-2.webp`,
        alt: 'Kimberly posando en el jardín con su corona',
        caption: 'Un sueño',
        position: 'center 38%',
    },
    {
        src: `${assetRoot}/gallery-kimberly-3.webp`,
        alt: 'Kimberly sonriendo bajo un cielo azul',
        caption: 'Para recordar',
        position: 'center 24%',
    },
    {
        src: `${assetRoot}/gallery-kimberly-4.webp`,
        alt: 'Kimberly en una sesión fotográfica al aire libre',
        caption: 'Kimberly',
        position: 'center 28%',
    },
]

function Sparkle({ className = '' }) {
    return <span className={`kj-sparkle ${className}`} aria-hidden="true">✦</span>
}

function PolaroidGallery() {
    const [activePhoto, setActivePhoto] = useState(0)

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
        const interval = window.setInterval(() => {
            setActivePhoto((current) => (current + 1) % galleryPhotos.length)
        }, 4400)
        return () => window.clearInterval(interval)
    }, [])

    const advance = () => setActivePhoto((current) => (current + 1) % galleryPhotos.length)
    const visiblePhotos = [2, 1, 0].map((offset) => ({
        ...galleryPhotos[(activePhoto + offset) % galleryPhotos.length],
        offset,
    }))

    return (
        <section className="kj-gallery kj-section" aria-labelledby="kj-gallery-title" data-section>
            <div className="kj-shell">
                <div className="kj-gallery__heading" data-reveal>
                    <p className="kj-section-label">Momentos que brillan</p>
                    <h2 id="kj-gallery-title">Mis recuerdos</h2>
                    <p>Toca la fotografía para descubrir el siguiente momento.</p>
                </div>

                <div className="kj-gallery__stage" data-reveal>
                    {visiblePhotos.map((photo) => (
                        <button
                            aria-label={photo.offset === 0 ? `Ver siguiente fotografía. Fotografía actual: ${photo.caption}` : photo.caption}
                            className={`kj-polaroid kj-polaroid--layer-${photo.offset}`}
                            key={photo.src}
                            onClick={advance}
                            type="button"
                        >
                            <span className="kj-polaroid__image">
                                <img
                                    alt={photo.alt}
                                    decoding="async"
                                    loading={photo.offset === 0 ? 'eager' : 'lazy'}
                                    src={photo.src}
                                    style={{ objectPosition: photo.position }}
                                />
                            </span>
                            <span className="kj-polaroid__caption">{photo.caption}</span>
                        </button>
                    ))}
                    <span className="kj-gallery__tape" aria-hidden="true" />
                </div>

                <div className="kj-gallery__dots" aria-label="Seleccionar fotografía" data-reveal>
                    {galleryPhotos.map((photo, index) => (
                        <button
                            aria-label={`Ver fotografía ${index + 1}: ${photo.caption}`}
                            aria-pressed={index === activePhoto}
                            className={index === activePhoto ? 'is-active' : ''}
                            key={photo.src}
                            onClick={() => setActivePhoto(index)}
                            type="button"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default function CustomInvitation({ portfolioMode = false }) {
    const pageRef = useRef(null)
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const toggleAudio = async () => {
        const audio = audioRef.current
        if (!audio) return

        if (audio.paused) {
            try {
                await audio.play()
            } catch {
                setIsPlaying(false)
            }
        } else {
            audio.pause()
        }
    }

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return undefined

        const startMusic = (event) => {
            if (event?.target instanceof Element && event.target.closest('.kj-music')) return
            audio.play().catch(() => {})
        }

        audio.play().catch(() => {})
        window.addEventListener('pointerdown', startMusic, { capture: true, once: true })
        window.addEventListener('touchstart', startMusic, { capture: true, once: true, passive: true })
        window.addEventListener('click', startMusic, { capture: true, once: true })
        window.addEventListener('keydown', startMusic, { capture: true, once: true })

        return () => {
            window.removeEventListener('pointerdown', startMusic, true)
            window.removeEventListener('touchstart', startMusic, true)
            window.removeEventListener('click', startMusic, true)
            window.removeEventListener('keydown', startMusic, true)
        }
    }, [])

    useEffect(() => {
        const previousTitle = document.title
        document.title = invitationTitle

        const media = gsap.matchMedia()
        const context = gsap.context(() => {
            media.add('(prefers-reduced-motion: no-preference)', () => {
                gsap.timeline({ defaults: { ease: 'power3.out' } })
                    .from('[data-hero-item]', {
                        y: 34,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.11,
                    })
                    .from('.kj-hero__cinderella', {
                        x: 55,
                        rotation: 8,
                        opacity: 0,
                        duration: 0.9,
                        ease: 'back.out(1.4)',
                    }, '-=0.45')

                gsap.to('[data-parallax]', {
                    yPercent: 12,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.kj-hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.8,
                    },
                })

                gsap.utils.toArray('[data-reveal]').forEach((element) => {
                    gsap.from(element, {
                        y: 48,
                        opacity: 0,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 84%',
                            toggleActions: 'play none none reverse',
                        },
                    })
                })

                gsap.utils.toArray('[data-float]').forEach((element, index) => {
                    gsap.to(element, {
                        y: index % 2 ? -28 : 30,
                        rotation: index % 2 ? 4 : -4,
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
            document.title = previousTitle
        }
    }, [])

    return (
        <main
            className="kj-invitation"
            data-portfolio={portfolioMode ? 'true' : 'false'}
            ref={pageRef}
        >
            <section className="kj-hero" aria-labelledby="invitation-title">
                <div className="kj-hero__paper" data-parallax aria-hidden="true" />
                <div className="kj-grain" aria-hidden="true" />
                <span className="kj-tape kj-tape--one" aria-hidden="true" />
                <span className="kj-tape kj-tape--two" aria-hidden="true" />
                <Sparkle className="kj-sparkle--one" />
                <Sparkle className="kj-sparkle--two" />

                <div className="kj-hero__castle" aria-hidden="true" />

                <div className="kj-hero__content">
                    <p className="kj-kicker" data-hero-item>Había una vez una noche inolvidable</p>

                    <p className="kj-hero__roman" data-hero-item aria-label="Quince años">XV</p>

                    <h1 id="invitation-title" data-hero-item>
                        <span>Kimberly Judith</span>
                        <small>Reyes García</small>
                    </h1>

                    <div className="kj-date-lockup" data-hero-item>
                        <span>29</span>
                        <span className="kj-date-lockup__month">Agosto</span>
                    </div>
                    <p className="kj-scroll-cue" data-hero-item>Desliza para descubrir la magia</p>
                </div>

                <img
                    className="kj-hero__cinderella"
                    src={`${assetRoot}/cinderella-cutout.png`}
                    alt="Ilustración de Cenicienta con vestido azul"
                />
            </section>

            <audio
                ref={audioRef}
                autoPlay
                loop
                preload="metadata"
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            >
                <source
                    src={`${assetRoot}/audio/somewhere-over-the-rainbow.mp3`}
                    type="audio/mpeg"
                />
            </audio>
            <button
                className={`kj-music${isPlaying ? ' is-playing' : ''}`}
                type="button"
                aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
                aria-pressed={isPlaying}
                onClick={toggleAudio}
            >
                <span aria-hidden="true">{isPlaying ? 'Ⅱ' : '♪'}</span>
                <small>{isPlaying ? 'Pausar' : 'Música'}</small>
            </button>

            <section className="kj-story kj-section" aria-labelledby="kj-story-title" data-section>
                <img
                    className="kj-story__carriage"
                    src={`${assetRoot}/carriage-cutout.png`}
                    alt=""
                    aria-hidden="true"
                    data-float
                />
                <div className="kj-shell kj-story__content">
                    <div data-reveal>
                        <p className="kj-section-label">Mi cuento comienza</p>
                        <h2 id="kj-story-title">Una noche hecha de sueños</h2>
                        <p className="kj-lead">
                            Hay momentos en la vida que imaginamos desde niñas. Hoy, con el corazón
                            lleno de ilusión, quiero compartir contigo la magia de mis quince años.
                        </p>
                    </div>

                    <div className="kj-family-grid">
                        <article data-reveal>
                            <span className="kj-family-grid__icon" aria-hidden="true">♕</span>
                            <p>Con el amor de mis papás</p>
                            <h3>Juana María García</h3>
                            <span>&amp;</span>
                            <h3>Juan Pablo Reyes</h3>
                        </article>
                        <article data-reveal>
                            <span className="kj-family-grid__icon" aria-hidden="true">◇</span>
                            <p>Y la bendición de mis padrinos</p>
                            <h3>Maritza Nayelly Medina</h3>
                            <span>&amp;</span>
                            <h3>Giovanni Michel Argote</h3>
                        </article>
                    </div>
                </div>
            </section>

            <section className="kj-event kj-section" aria-labelledby="kj-event-title" data-section>
                <div className="kj-shell">
                    <div data-reveal>
                        <p className="kj-section-label kj-section-label--light">La celebración</p>
                        <h2 id="kj-event-title">El baile está por comenzar</h2>
                        <p className="kj-event__intro">Acompáñame a celebrar una noche tan especial.</p>
                    </div>

                    <article className="kj-event-card" data-reveal>
                        <span className="kj-event-card__tape" aria-hidden="true" />
                        <p className="kj-event-card__day">Sábado</p>
                        <div className="kj-event-card__date">
                            <span>29</span>
                            <p>de agosto</p>
                        </div>
                        <div className="kj-event-card__divider" aria-hidden="true"><span>✦</span></div>
                        <h3>Salón Los Naranjos</h3>
                        <address>
                            Av. Gral. Mariano Escobedo #312<br />
                            Jardines de la Cruz
                        </address>
                        <a href={mapsUrl} target="_blank" rel="noreferrer">Ver ubicación ↗</a>
                    </article>
                </div>
            </section>

            <PolaroidGallery />

            <section className="kj-details kj-section" aria-labelledby="kj-details-title" data-section>
                <img
                    className="kj-details__tailors"
                    src={`${assetRoot}/mice-tailors-cutout.png`}
                    alt=""
                    aria-hidden="true"
                    data-float
                />
                <div className="kj-shell kj-details__content" data-reveal>
                    <p className="kj-section-label">Para la gran noche</p>
                    <h2 id="kj-details-title">Un detalle especial</h2>
                    <p>
                        Tu presencia es el regalo más importante para mí. Si deseas obsequiarme
                        algo más, tendremos <strong>lluvia de sobres</strong>.
                    </p>
                    <div className="kj-envelope" aria-hidden="true"><span>Con cariño</span></div>
                </div>
            </section>

            <footer className="kj-footer">
                <img
                    className="kj-footer__slipper"
                    src={`${assetRoot}/glass-slipper-cutout.png`}
                    alt="Zapatilla de cristal sobre un cojín azul"
                    loading="lazy"
                    data-float
                />
                <div className="kj-footer__content" data-reveal>
                    <p>Los sueños sí se hacen realidad</p>
                    <h2>Kimberly Judith</h2>
                    <span>Mis XV años · 29 de agosto</span>
                </div>
            </footer>
        </main>
    )
}
