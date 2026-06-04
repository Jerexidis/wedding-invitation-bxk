import { Link } from 'react-router-dom'
import activeInvitations from '../invitations/registry'
import { ogData } from '../../og-data'
import { Eye, Heart, Sparkles, MessageCircle, Calendar } from 'lucide-react'

// Helper to get friendly event labels and colors
const getEventMeta = (eventType) => {
    switch (eventType?.toLowerCase()) {
        case 'boda':
            return {
                label: 'Boda',
                bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                icon: <Heart size={14} className="text-emerald-600" />
            }
        case 'xv':
            return {
                label: 'XV Años',
                bg: 'bg-purple-50 text-purple-700 border-purple-100',
                icon: <Sparkles size={14} className="text-purple-600" />
            }
        case 'primera-comunion':
            return {
                label: 'Primera Comunión',
                bg: 'bg-amber-50 text-amber-700 border-amber-100',
                icon: <Calendar size={14} className="text-amber-600" />
            }
        case 'bautizo':
            return {
                label: 'Bautizo',
                bg: 'bg-sky-50 text-sky-700 border-sky-100',
                icon: <Sparkles size={14} className="text-sky-600" />
            }
        case 'cumple':
            return {
                label: 'Cumpleaños',
                bg: 'bg-rose-50 text-rose-700 border-rose-100',
                icon: <Sparkles size={14} className="text-rose-600" />
            }
        case 'despedida':
            return {
                label: 'Despedida',
                bg: 'bg-pink-50 text-pink-700 border-pink-100',
                icon: <Heart size={14} className="text-pink-600" />
            }
        default:
            return {
                label: 'Celebración',
                bg: 'bg-slate-50 text-slate-700 border-slate-100',
                icon: <Sparkles size={14} className="text-slate-600" />
            }
    }
}

export default function Showcase() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-white to-[#F5EFE6] text-slate-800 font-sans selection:bg-amber-200/50">
            {/* Header / Hero */}
            <header className="relative py-20 px-6 text-center max-w-4xl mx-auto overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none">
                    <svg width="100%" height="100%">
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative z-10 animate-fade-in space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100/60 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
                        ✨ Invitaciones Digitales Premium
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
                        Colección de <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Invitaciones</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
                        Explora nuestros diseños interactivos creados a medida con confirmación RSVP en tiempo real, música de fondo y galerías de fotos.
                    </p>
                </div>
            </header>

            {/* Showcase Grid */}
            <main className="max-w-6xl mx-auto px-6 pb-28">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeInvitations.filter(inv => {
                        if (inv.eventDate) {
                            return new Date(inv.eventDate) < new Date()
                        }
                        return false
                    }).map((inv) => {
                        const meta = ogData[inv.slug] || {}
                        const eventMeta = getEventMeta(inv.eventType)
                        const coverImg = meta.image || `/invitations/${inv.slug}/img/hero.png`

                        return (
                            <article 
                                key={inv.slug} 
                                className="group bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Cover Image Container */}
                                <div className="relative h-48 overflow-hidden bg-slate-50 border-b border-slate-50">
                                    <img 
                                        src={coverImg} 
                                        alt={meta.title || inv.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                                    
                                    {/* Event Badge */}
                                    <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium backdrop-blur-sm ${eventMeta.bg}`}>
                                        {eventMeta.icon}
                                        {eventMeta.label}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-semibold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                                            {meta.title?.replace(/🕊️|💕|✨|🐸/g, '').trim() || inv.title}
                                        </h2>
                                        <p className="text-sm text-slate-500 font-light line-clamp-2 leading-relaxed">
                                            {meta.description || 'Toca para abrir la invitación y confirmar tu asistencia en el evento especial.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <Link 
                                            to={`/i/${inv.slug}`} 
                                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 group-hover:text-amber-800 transition-colors"
                                        >
                                            <Eye size={14} /> Ver Demo
                                        </Link>
                                        
                                        {(inv.rsvpMode === 'supabase' || inv.rsvpMode === 'mixed') && (
                                            <Link 
                                                to={`/i/${inv.slug}/rsvp`} 
                                                className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                <MessageCircle size={12} /> RSVPs
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </main>

            {/* Minimal Footer */}
            <footer className="border-t border-slate-100 py-10 text-center bg-white/40">
                <p className="text-xs text-slate-400">
                    &copy; 2026 Invita-Ya. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    )
}
