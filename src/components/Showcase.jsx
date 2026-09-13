import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import activeInvitations from '../invitations/registry'
import { ogData } from '../../og-data'
import { ArrowUpRight, Calendar, Eye, Heart, MessageCircle, Sparkles, PartyPopper, Church, Baby, Gift } from 'lucide-react'

/* ─── Event type metadata ─── */

const EVENT_CATEGORIES = [
    { key: 'all', label: 'Todos', icon: <Sparkles size={13} /> },
    { key: 'boda', label: 'Bodas', icon: <Heart size={13} /> },
    { key: 'xv', label: 'XV Años', icon: <Sparkles size={13} /> },
    { key: 'cumpleanos', label: 'Cumpleaños', icon: <PartyPopper size={13} /> },
    { key: 'primera-comunion', label: 'Comunión', icon: <Church size={13} /> },
    { key: 'otros', label: 'Otros', icon: <Gift size={13} /> },
]

// Types that go into the "Otros" bucket
const OTROS_TYPES = new Set(['despedida', 'bautizo', 'babyshower'])

const getEventMeta = (eventType) => {
    switch (eventType?.toLowerCase()) {
        case 'boda':
            return {
                label: 'Boda',
                chip: 'bg-[#F6EFEA] text-[#1F1F1F] border-[#E9DED6]',
                accent: 'from-[#D98982] to-[#E9C7B7]',
                icon: <Heart size={14} />,
            }
        case 'xv':
            return {
                label: 'XV Años',
                chip: 'bg-[#FBE9EF] text-[#9B4660] border-[#F1CAD4]',
                accent: 'from-[#D96A86] to-[#E6A0AF]',
                icon: <Sparkles size={14} />,
            }
        case 'primera-comunion':
            return {
                label: 'Primera Comunión',
                chip: 'bg-[#F6EFEA] text-[#8B6B52] border-[#E9DED6]',
                accent: 'from-[#C9A38B] to-[#E9C7B7]',
                icon: <Church size={14} />,
            }
        case 'despedida':
            return {
                label: 'Despedida',
                chip: 'bg-[#FBE9EF] text-[#A33D61] border-[#F1CAD4]',
                accent: 'from-[#D96A86] to-[#C9A38B]',
                icon: <Heart size={14} />,
            }
        case 'cumpleanos':
            return {
                label: 'Cumpleaños',
                chip: 'bg-[#EAF2FF] text-[#295A91] border-[#C9DDF8]',
                accent: 'from-[#EE4D87] to-[#185DA7]',
                icon: <PartyPopper size={14} />,
            }
        case 'bautizo':
            return {
                label: 'Bautizo',
                chip: 'bg-[#E8F4FD] text-[#3B7BA6] border-[#C4E1F5]',
                accent: 'from-[#7EB8DE] to-[#BFD8EA]',
                icon: <Baby size={14} />,
            }
        case 'babyshower':
            return {
                label: 'Baby Shower',
                chip: 'bg-[#FFF5E6] text-[#B87D3B] border-[#F5E0BE]',
                accent: 'from-[#F0C27F] to-[#E9C7B7]',
                icon: <Baby size={14} />,
            }
        default:
            return {
                label: 'Evento',
                chip: 'bg-[#F6EFEA] text-[#1F1F1F] border-[#E9DED6]',
                accent: 'from-[#D98982] to-[#E9C7B7]',
                icon: <Sparkles size={14} />,
            }
    }
}

const formatEventDate = (date) => {
    if (!date) return 'Evento finalizado'
    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}

/* ─── Helper: resolve the cover image for the portfolio card ─── */
function getPortfolioCover(inv) {
    // If the registry declares a dedicated portfolio cover, prefer it
    if (inv.portfolioCover) return inv.portfolioCover

    // Otherwise fall back to the OG image → generic hero
    const meta = ogData[inv.slug] || {}
    return meta.image || `/invitations/${inv.slug}/img/hero.png`
}

/* ─── Premium iOS-Style Segmented Control ─── */

function FilterBar({ categories, activeFilter, onSelect, invitations }) {
    const getCount = (key) => {
        if (key === 'all') return invitations.length
        if (key === 'otros') return invitations.filter((inv) => OTROS_TYPES.has(inv.eventType)).length
        return invitations.filter((inv) => inv.eventType === key).length
    }

    return (
        <div className="showcase-segmented-wrap">
            <div className="showcase-segmented-container">
                {categories.map((cat) => {
                    const isActive = activeFilter === cat.key
                    const count = getCount(cat.key)

                    return (
                        <button
                            key={cat.key}
                            id={`filter-${cat.key}`}
                            type="button"
                            onClick={() => onSelect(cat.key)}
                            className={`showcase-segment-btn ${isActive ? 'showcase-segment-btn--active' : ''}`}
                        >
                            <span className="showcase-segment-btn__inner">
                                <span className="showcase-segment-btn__icon">{cat.icon}</span>
                                <span className="showcase-segment-btn__label">{cat.label}</span>
                            </span>
                            <span className={`showcase-segment-btn__count ${isActive ? 'showcase-segment-btn__count--active' : ''}`}>
                                {count}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

/* ─── Component ─── */

export default function Showcase() {
    const [activeFilter, setActiveFilter] = useState('all')

    const portfolioInvitations = activeInvitations
        .filter((inv) => {
            if (inv.excludeFromPortfolio) return false
            if (inv.portfolioPriority) return true
            if (!inv.eventDate) return false
            return new Date(inv.eventDate) < new Date()
        })
        .sort((a, b) => {
            const aPriority = a.portfolioPriority ?? Number.MAX_SAFE_INTEGER
            const bPriority = b.portfolioPriority ?? Number.MAX_SAFE_INTEGER
            if (aPriority !== bPriority) return aPriority - bPriority
            return new Date(b.eventDate || 0) - new Date(a.eventDate || 0)
        })

    // Compute which categories actually have invitations
    const availableCategories = EVENT_CATEGORIES.filter((cat) => {
        if (cat.key === 'all') return true
        if (cat.key === 'otros') {
            return portfolioInvitations.some((inv) => OTROS_TYPES.has(inv.eventType))
        }
        return portfolioInvitations.some((inv) => inv.eventType === cat.key)
    })

    // Apply active filter
    const filteredInvitations = portfolioInvitations.filter((inv) => {
        if (activeFilter === 'all') return true
        if (activeFilter === 'otros') return OTROS_TYPES.has(inv.eventType)
        return inv.eventType === activeFilter
    })

    return (
        <div className="min-h-screen bg-[#FBFAF8] text-[#1F1F1F] font-sans selection:bg-[#E7A2B1]/30">
            <header className="relative overflow-hidden border-b border-[#EFE8E2] bg-[#FBFAF8]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_16%,rgba(217,106,134,0.12),transparent_30%),radial-gradient(circle_at_12%_75%,rgba(201,163,139,0.13),transparent_28%)]" />
                <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-7 pb-14 md:pb-20">
                    <nav className="flex items-center justify-center mb-14 md:mb-16">
                        <div className="inline-flex items-center gap-3">
                            <Heart size={14} className="text-[#E996A1]" fill="currentColor" />
                            <p className="text-2xl font-black tracking-tight">
                                INVITA<span className="text-[#D98982]">-YA.</span>
                            </p>
                        </div>
                    </nav>

                    <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-14 items-end">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#F1ECE7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#D6537A]">
                                <Sparkles size={14} fill="currentColor" />
                                La tendencia de 2026
                            </div>
                            <h1 className="mt-7 text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-[-0.02em]">
                                Invitaciones que se sienten <span className="text-[#D96A86]">inolvidables.</span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-base sm:text-xl leading-8 text-[#7B7F86]">
                                Explora ejemplos reales de invitaciones digitales hermosas, con música, galería y confirmación automática.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <a
                                    href="#ejemplos"
                                    className="inline-flex items-center gap-3 rounded-full border-2 border-[#1F1F1F] bg-white px-7 py-4 text-sm font-bold text-[#1F1F1F] transition hover:bg-[#1F1F1F] hover:text-white"
                                >
                                    Ver ejemplos
                                    <ArrowUpRight size={17} />
                                </a>
                                <div className="flex items-center gap-4 text-xs text-[#7B7F86]">
                                    <span className="inline-flex items-center gap-2"><span className="text-[#1FB66B]">✓</span> Eventos finalizados</span>
                                    <span className="text-[#C9A38B]">•</span>
                                    <span className="inline-flex items-center gap-2"><span className="text-[#1FB66B]">✓</span> Demos reales</span>
                                </div>
                            </div>
                        </div>

                        {portfolioInvitations[0] && (() => {
                            const featured = portfolioInvitations[0]
                            const meta = ogData[featured.slug] || {}
                            const coverImg = getPortfolioCover(featured)
                            const title = meta.title?.replace(/🕊️|💕|✨|🐸|🎉/g, '').trim() || featured.title

                            return (
                                <Link
                                    to={`/i/${featured.slug}?portfolio=1`}
                                    className="group hidden lg:block rounded-lg border border-[#EFE8E2] bg-white p-3 shadow-[0_28px_80px_rgba(31,31,31,0.10)] transition hover:-translate-y-1 hover:border-[#E0C9C4]"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#F6EFEA]">
                                        <img
                                            src={coverImg}
                                            alt={title}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/76 via-[#1F1F1F]/10 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-5">
                                            <p className="text-xs uppercase tracking-[0.18em] text-white/70">Ejemplo destacado</p>
                                            <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.01em] text-white">{title}</h2>
                                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1F1F1F]">
                                                Abrir demo <ArrowUpRight size={15} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })()}
                    </div>
                </div>
            </header>

            <main id="ejemplos" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-14">
                <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#F1ECE7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#9B4660]">
                            <Sparkles size={13} />
                            Archivo visual
                        </div>
                        <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-[-0.01em]">
                            Invitaciones publicadas
                        </h2>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-[#7B7F86]">
                        Demos de diseño y celebraciones terminadas reunidas como portafolio de experiencias.
                    </p>
                </div>

                {/* ─── Premium category filter bar ─── */}
                <FilterBar
                    categories={availableCategories}
                    activeFilter={activeFilter}
                    onSelect={setActiveFilter}
                    invitations={portfolioInvitations}
                />

                {filteredInvitations.length === 0 ? (
                    <div className="rounded-lg border border-[#EFE8E2] bg-white p-10 text-center shadow-sm">
                        <p className="text-lg font-medium">No hay invitaciones en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredInvitations.map((inv, index) => {
                            const meta = ogData[inv.slug] || {}
                            const eventMeta = getEventMeta(inv.eventType)
                            const coverImg = getPortfolioCover(inv)
                            const title = meta.title?.replace(/🕊️|💕|✨|🐸|🎉|🐾|⛏️|🤠|👶/g, '').trim() || inv.title

                            return (
                                <article
                                    key={inv.slug}
                                    className={`group relative overflow-hidden rounded-lg border border-[#EFE8E2] bg-white shadow-[0_18px_50px_rgba(31,31,31,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#E0C9C4] ${index === 0 && activeFilter === 'all' ? 'md:col-span-2 xl:col-span-1' : ''}`}
                                    style={{
                                        animation: 'showcase-card-in 0.4s ease-out both',
                                        animationDelay: `${Math.min(index * 60, 400)}ms`,
                                    }}
                                >
                                    {/* Cover image — 16:9 to avoid cropping panoramic screenshots */}
                                    <div className="relative aspect-[16/9] overflow-hidden bg-[#F6EFEA]">
                                        <img
                                            src={coverImg}
                                            alt={title}
                                            className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/50 via-transparent to-transparent" />
                                        <div className={`absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r ${eventMeta.accent}`} />
                                        <span className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm ${eventMeta.chip}`}>
                                            {eventMeta.icon}
                                            {eventMeta.label}
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <div className="mb-4 flex items-center justify-between gap-4 text-xs text-[#7B7F86]">
                                            <span className="inline-flex items-center gap-2">
                                                <Calendar size={14} />
                                                {formatEventDate(inv.eventDate)}
                                            </span>
                                            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[#B7A7A0]">
                                                {inv.slug}
                                            </span>
                                        </div>

                                        <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-[-0.01em] text-[#1F1F1F]">
                                            {title}
                                        </h2>
                                        <p className="mt-3 min-h-[2.5rem] text-sm leading-6 text-[#7B7F86] line-clamp-2">
                                            {meta.description || 'Invitación digital personalizada para evento especial.'}
                                        </p>

                                        <div className="mt-5 flex items-center justify-between gap-3">
                                            <Link
                                                to={`/i/${inv.slug}?portfolio=1`}
                                                className="inline-flex items-center gap-2 rounded-full bg-[#1F1F1F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#D96A86]"
                                            >
                                                <Eye size={16} />
                                                Ver invitación
                                            </Link>

                                            {(inv.rsvpMode === 'supabase' || inv.rsvpMode === 'mixed') && (
                                                <Link
                                                    to={`/i/${inv.slug}/rsvp`}
                                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#EFE8E2] bg-[#FBFAF8] text-[#7B7F86] transition hover:border-[#D96A86] hover:text-[#D96A86]"
                                                    title="RSVP"
                                                >
                                                    <MessageCircle size={16} />
                                                </Link>
                                            )}

                                            <ArrowUpRight size={18} className="ml-auto text-[#C9A38B] transition group-hover:text-[#D96A86]" />
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </main>

            <footer className="flex flex-col items-center justify-center gap-3 border-t border-[#EFE8E2] px-5 py-8 text-center text-xs text-[#9A8F8A] sm:flex-row sm:gap-5">
                <span>Invita-Ya · Invitaciones digitales interactivas</span>
                <span className="hidden text-[#C9A38B] sm:inline">•</span>
                <nav className="flex items-center gap-4" aria-label="Documentos legales">
                    <Link className="underline decoration-[#D8C9C1] underline-offset-4 transition hover:text-[#D96A86]" to="/privacidad">Privacidad</Link>
                    <Link className="underline decoration-[#D8C9C1] underline-offset-4 transition hover:text-[#D96A86]" to="/terminos">Términos</Link>
                </nav>
            </footer>

            {/* Animations + filter bar styles */}
            <style>{`
                @keyframes showcase-card-in {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ─── Premium iOS-Style Segmented Control ─── */
                .showcase-segmented-wrap {
                    margin-bottom: 2.25rem;
                    max-width: 100%;
                }

                .showcase-segmented-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.35rem;
                    padding: 0.35rem;
                    background: #F3EDE7;
                    border: 1px solid #E6DDD5;
                    border-radius: 1rem;
                    box-shadow: inset 0 2px 4px rgba(31, 31, 31, 0.04), 0 1px 2px rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                }

                @media (min-width: 520px) {
                    .showcase-segmented-container {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (min-width: 840px) {
                    .showcase-segmented-container {
                        grid-template-columns: repeat(6, 1fr);
                        gap: 0.5rem;
                        padding: 0.5rem;
                        border-radius: 9999px;
                    }
                }

                .showcase-segment-btn {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.3rem;
                    padding: 0.6rem 0.65rem;
                    border-radius: 0.75rem;
                    font-size: 0.78125rem;
                    font-weight: 600;
                    color: #6E6763;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: all 0.22s cubic-bezier(0.25, 1, 0.5, 1);
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                    width: 100%;
                    min-width: 0;
                }

                @media (min-width: 840px) {
                    .showcase-segment-btn {
                        justify-content: center;
                        border-radius: 9999px;
                        padding: 0.625rem 0.85rem;
                    }
                }

                .showcase-segment-btn:hover {
                    color: #1F1F1F;
                    background: rgba(255, 255, 255, 0.45);
                }

                .showcase-segment-btn--active {
                    color: #1F1F1F;
                    font-weight: 700;
                    background: #FFFFFF;
                    border-radius: 0.75rem;
                    box-shadow: 0 3px 12px rgba(31, 31, 31, 0.08), 0 1px 3px rgba(31, 31, 31, 0.04), 0 0 0 1px rgba(217, 106, 134, 0.12);
                    transform: scale(1.02);
                }

                @media (min-width: 840px) {
                    .showcase-segment-btn--active {
                        border-radius: 9999px;
                    }
                }

                .showcase-segment-btn__inner {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    min-width: 0;
                }

                .showcase-segment-btn__icon {
                    display: flex;
                    align-items: center;
                    opacity: 0.65;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .showcase-segment-btn--active .showcase-segment-btn__icon {
                    opacity: 1;
                    color: #D96A86;
                    transform: scale(1.1);
                }

                .showcase-segment-btn__label {
                    line-height: 1;
                    white-space: nowrap;
                }

                .showcase-segment-btn__count {
                    font-size: 0.6875rem;
                    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', monospace;
                    font-weight: 600;
                    padding: 0.125rem 0.38rem;
                    border-radius: 9999px;
                    background: #EAE4DF;
                    color: #857B74;
                    line-height: 1.2;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .showcase-segment-btn--active .showcase-segment-btn__count {
                    background: #FBE9EF;
                    color: #9B4660;
                }
            `}</style>
        </div>
    )
}
