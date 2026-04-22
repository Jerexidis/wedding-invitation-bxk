import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Plus, Settings2, Trash2, ExternalLink, Calendar as CalendarIcon, MapPin, Users, Heart, Gift, MessageSquare, Share2, Search, Filter, LayoutTemplate, Music, Link, Info, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, PenSquare, LayoutList, GripVertical, Image as ImageIcon, X, AlertCircle } from 'lucide-react'


const SECTIONS = [
    { id: 'Hero', label: 'Portada (Hero)', icon: '🖼️', description: 'Imagen de fondo, nombres y música' },
    { id: 'Countdown', label: 'Cuenta regresiva', icon: '⏳', description: 'Timer con fecha del evento y botón de agendar' },
    { id: 'Events', label: 'Eventos', icon: '📍', description: 'Ceremonia, recepción con ubicaciones' },
    { id: 'Details', label: 'Detalles', icon: '👔', description: 'Dress code, restricciones de edad' },
    { id: 'Gallery', label: 'Galería de fotos', icon: '📸', description: 'Carrusel de fotos tipo polaroid' },
    { id: 'Gifts', label: 'Mesa de regalos', icon: '🎁', description: 'Links a Amazon, Liverpool, etc.' },
    { id: 'RSVP', label: 'Confirmar asistencia', icon: '💌', description: 'Formulario con WhatsApp' },
]

export default function AdminPanel() {
    const [invitations, setInvitations] = useState([])
    const [loading, setLoading] = useState(true)
    const [showWizard, setShowWizard] = useState(false)
    const [step, setStep] = useState(1)
    const [creating, setCreating] = useState(false)
    const [feedback, setFeedback] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [editingSlug, setEditingSlug] = useState(null)

    // Wizard form state
    const [form, setForm] = useState({
        eventType: 'boda', // boda, bautizo, xv
        eventTitle: '',
        slug: '',
        // Data for templates
        heroHeading: '',
        heroSubheading: '',
        heroHasMusic: false,
        countdownDateTime: '',
        calendarLocation: '',
        events: [
            { icon: 'church', title: 'Ceremonia Religiosa', location: '', time: '', mapLink: '' },
            { icon: 'glass', title: 'Recepción', location: '', time: '', mapLink: '' }
        ],
        adultsOnly: false,
        adultsOnlyMessage: '',
        dressCode: '',
        avoidColors: '',
        galleryCount: 4,
        giftsMessage: '',
        giftsLinks: [{ label: '', url: '', icon: '' }],
        giftsEnvelope: false,
        rsvpMode: 'internal', rsvpWhatsapp: '', rsvpDeadline: '',
        // Nuevos campos específicos:
        parents: '',
        godparents: '',
        footerMessage: 'Hecho con amor.',
    })

    useEffect(() => {
        fetchInvitations()
    }, [])

    const fetchInvitations = async () => {
        try {
            const res = await fetch('/api/invitations')
            const data = await res.json()
            if (data.ok) setInvitations(data.invitations)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (slug) => {
        if (!confirm(`¿Seguro que quieres eliminar la invitación "${slug}"?`)) return
        setDeleting(slug)
        try {
            const res = await fetch(`/api/invitations/${slug}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.ok) {
                setFeedback({ type: 'success', message: `Invitación "${slug}" eliminada` })
                fetchInvitations()
            } else {
                setFeedback({ type: 'error', message: data.error })
            }
        } catch (e) {
            setFeedback({ type: 'error', message: e.message })
        } finally {
            setDeleting(null)
        }
    }

    const updateForm = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const autoSlug = () => {
        if (form.eventTitle && !editingSlug) {
            const slug = form.eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
            updateForm('slug', slug)
        }
    }

    
    const handleEdit = async (slug) => {
        setEditingSlug(slug)
        setLoading(true)
        try {
            const res = await fetch(`/api/invitations/${slug}`)
            const data = await res.json()
            if (data.ok) {
                const cfg = data.config
                setForm({
                    eventType: cfg.templateName === 'InvitacionBoda' ? 'boda' : (cfg.templateName === 'InvitacionBautizo' ? 'bautizo' : 'xv'),
                    eventTitle: data.title || '',
                    slug: cfg.slug || slug,
                    heroHeading: cfg.hero?.heading || '',
                    heroSubheading: cfg.hero?.subheading || '',
                    heroHasMusic: !!cfg.hero?.song,
                    countdownDateTime: cfg.countdown?.dateTime || '',
                    calendarLocation: cfg.calendarEvent?.location || '',
                    events: (cfg.events && cfg.events.length > 0) ? cfg.events : [{ icon: 'church', title: 'Ceremonia Religiosa', location: '', time: '', mapLink: '' }, { icon: 'glass', title: 'Recepción', location: '', time: '', mapLink: '' }],
                    adultsOnly: cfg.details?.adultsOnly || false,
                    adultsOnlyMessage: cfg.details?.adultsOnlyMessage || '',
                    dressCode: cfg.details?.dressCode || '',
                    galleryCount: cfg.gallery?.photos?.length || 4,
                    giftsMessage: cfg.gifts?.message || '',
                    giftsLinks: cfg.gifts?.links || [],
                    giftsEnvelope: cfg.gifts?.envelope || false,
                    rsvpMode: cfg.rsvp?.whatsapp ? 'whatsapp' : 'internal',
                    rsvpWhatsapp: cfg.rsvp?.whatsapp || '',
                    rsvpDeadline: cfg.rsvp?.deadline || '',
                    themePreset: cfg.theme?.preset || 'sage',
                    footerMessage: cfg.footer?.message || 'Hecho con amor.',
                })
                setShowWizard(true)
                setStep(1)
            } else {
                setFeedback({ type: 'error', message: data.error || 'Error cargando configuración' })
            }
        } catch (e) {
            setFeedback({ type: 'error', message: e.message })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setCreating(true)
        try {
            const data = {
                slug: form.slug,
                title: form.eventTitle,
                templateName: form.eventType === 'boda' ? 'InvitacionBoda' : (form.eventType === 'bautizo' ? 'InvitacionBautizo' : 'InvitacionXV'),
                config: buildConfig(),
            }

            const url = editingSlug ? `/api/invitations/${editingSlug}` : '/api/invitations'
            const method = editingSlug ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const responseData = await res.json()
            if (responseData.ok) {
                const rsvpMsg = responseData.rsvpLink ? ` | 📋 RSVP: ${responseData.rsvpLink}` : ''
                const msg = editingSlug 
                    ? `¡Invitación actualizada con éxito!` 
                    : `¡Invitación creada! Disponible en ${responseData.path}${rsvpMsg}`
                    
                setFeedback({ type: 'success', message: msg })
                setShowWizard(false)
                setStep(1)
                resetForm()
                fetchInvitations()
            } else {
                setFeedback({ type: 'error', message: responseData.error })
            }
        } catch (e) {
            setFeedback({ type: 'error', message: e.message })
        } finally {
            setCreating(false)
        }
    }

    const buildConfig = () => {
        const cfg = { slug: form.slug }

        // 1. Hero
        cfg.hero = {
            heading: form.heroHeading || (form.eventType === 'boda' ? 'Nos Casamos' : form.eventType === 'bautizo' ? 'Mi Bautizo' : 'Mis XV Años'),
            subheading: form.heroSubheading || form.eventTitle,
            coverImage: 'Portada.jpeg',
            song: form.heroHasMusic ? 'cancion.mp3' : null,
        }

        // Parents and Godparents (for Bautizo and XV)
        if (form.eventType === 'bautizo' || form.eventType === 'xv') {
            cfg.parentsAndGodparents = {
                parents: form.parents || '',
                godparents: form.godparents || ''
            }
        }

        // 2. Countdown / Calendar
        let displayDate = ''
        let displayYear = ''
        let calStart = ''
        let calEnd = ''
        let outStart = ''
        let outEnd = ''

        if (form.countdownDateTime) {
            const date = new Date(form.countdownDateTime)
            const options = { weekday: 'long', day: 'numeric', month: 'long' }
            displayDate = date.toLocaleDateString('es-ES', options).replace(',', '').replace(/(^\w)/, (m) => m.toUpperCase())
            displayYear = date.getFullYear().toString()

            // Google format: YYYYMMDDTHHMMSS
            const end = new Date(date.getTime() + 6 * 60 * 60 * 1000) // Default 6 hrs duration
            const toIsoString = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
            calStart = toIsoString(date)
            calEnd = toIsoString(end)

            // Outlook format: YYYY-MM-DDTHH:MM:SS
            const toLocalIso = (d) => {
                const pad = (n) => n.toString().padStart(2, '0')
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
            }
            outStart = toLocalIso(date)
            outEnd = toLocalIso(end)
        }

        cfg.countdown = {
            dateTime: form.countdownDateTime,
            displayDate,
            displayYear,
        }
        cfg.calendarEvent = {
            title: form.eventTitle,
            description: '¡Te esperamos!',
            location: form.calendarLocation || (form.events[0]?.location) || '',
            start: calStart,
            end: calEnd,
            outlookStart: outStart,
            outlookEnd: outEnd,
        }

        // 3. Events
        cfg.events = form.events.filter((e) => e.title)

        // 4. Details
        cfg.details = {
            adultsOnly: form.adultsOnly,
            adultsOnlyMessage: form.adultsOnlyMessage,
            dressCode: form.dressCode,
            dressCodeImage: 'dresscode.png',
            avoidColors: form.avoidColors,
        }
        // 5. Gallery
        const count = Math.max(1, parseInt(form.galleryCount) || 4)
        cfg.gallery = Array.from({ length: count }).map((_, i) => ({
            filename: `${i + 1}.jpg`,
            caption: '',
        }))
        cfg.galleryTitle = form.eventType === 'boda' ? 'Nuestra Historia' : 'Momentos'

        // 6. Gifts
        cfg.gifts = {
            message: form.giftsMessage,
            links: form.giftsLinks.filter((l) => l.url),
            envelopeOption: form.giftsEnvelope,
        }

        // 7. RSVP
        let deadline = form.rsvpDeadline
        if (!deadline && form.countdownDateTime) {
            // Default deadline: 14 days before the event
            const dDate = new Date(form.countdownDateTime)
            dDate.setDate(dDate.getDate() - 14)
            const options = { day: 'numeric', month: 'long', year: 'numeric' }
            deadline = `Por favor confirma antes del ${dDate.toLocaleDateString('es-ES', options)}`
        }

        cfg.rsvp = {
            whatsapp: form.rsvpWhatsapp,
            deadline: deadline,
        }

        // 8. Footer implicitly from main event title
        cfg.footer = {
            names: form.eventTitle,
            message: form.footerMessage,
        }
        return cfg
    }

    const resetForm = () => {
        setEditingSlug(null)
        setForm({
            eventType: 'boda', eventTitle: '', slug: '',
            heroHeading: '¡Nos Casamos!', heroSubheading: '', heroHasMusic: false,
            countdownDateTime: '', calendarLocation: '',
            events: [{ icon: 'church', title: 'Ceremonia Religiosa', location: '', time: '', mapLink: '' }, { icon: 'glass', title: 'Recepción', location: '', time: '', mapLink: '' }],
            adultsOnly: false, adultsOnlyMessage: '', dressCode: '', avoidColors: '',
            galleryCount: 4,
            giftsMessage: '', giftsLinks: [{ label: '', url: '', icon: 'fas fa-gift' }], giftsEnvelope: true,
            rsvpMode: 'internal', rsvpWhatsapp: '', rsvpDeadline: '',
            footerMessage: 'Hecho con amor.',
        })
    }

    // --- Dynamic array helpers ---
    const addEvent = () => updateForm('events', [...form.events, { icon: 'glass', title: '', location: '', time: '', mapLink: '' }])
    const removeEvent = (i) => updateForm('events', form.events.filter((_, idx) => idx !== i))
    const updateEvent = (i, field, value) => {
        const events = [...form.events]
        events[i] = { ...events[i], [field]: value }
        updateForm('events', events)
    }

    // Removed Gallery photo array helpers since we use a simple number input now

    const addGiftLink = () => updateForm('giftsLinks', [...form.giftsLinks, { label: '', url: '', icon: '' }])
    const removeGiftLink = (i) => updateForm('giftsLinks', form.giftsLinks.filter((_, idx) => idx !== i))
    const updateGiftLink = (i, field, value) => {
        const links = [...form.giftsLinks]
        links[i] = { ...links[i], [field]: value }
        updateForm('giftsLinks', links)
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
                            <LayoutDashboard size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold tracking-tight text-slate-900 leading-tight">Configuración de Eventos</h1>
                            <p className="text-xs text-slate-500 font-medium">Panel Administrativo</p>
                        </div>
                    </div>
                    <button 
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow hover:shadow-md active:scale-95"
                        onClick={() => { resetForm(); setShowWizard(true); setStep(1) }}
                    >
                        <Plus size={16} />
                        Crear Evento
                    </button>
                </div>
            </header>

            {/* Feedback Toast */}
            {feedback && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border ${
                        feedback.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        {feedback.type === 'success' ? <CheckCircle2 className="text-emerald-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
                        <p className="text-sm font-medium">{feedback.message}</p>
                        <button onClick={() => setFeedback(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity"><X size={16}/></button>
                    </div>
                </div>
            )}

            {/* Invitations Main */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium">Autenticando e inicializando módulos...</p>
                    </div>
                ) : invitations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-2xl border border-slate-200 border-dashed backdrop-blur-sm">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-400">
                            <LayoutDashboard size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay plantillas activas</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">Comienza configurando tu primer evento para publicarlo inmediatamente en su URL designada.</p>
                        <button 
                            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => { resetForm(); setShowWizard(true); setStep(1) }}
                        >
                            <Plus size={16} />
                            Configurar Nueva
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Detalles del Evento</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Accesos (Públicos)</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invitations.map((inv) => (
                                        <tr key={inv.slug} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-5 align-middle">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                        inv.isDefault ? 'bg-slate-100 text-slate-500' : 'bg-slate-900 text-white'
                                                    }`}>
                                                        <LayoutTemplate size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 truncate">{inv.title}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5 font-mono">/i/{inv.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-middle">
                                                {inv.isDefault ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                                                        Template Base
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                                                        Publicado
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 align-middle">
                                                <div className="flex flex-col gap-2">
                                                    <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                                                        <ExternalLink size={14} /> Vista Pública
                                                    </a>
                                                    {inv.rsvpKey && (
                                                        <a href={`/i/${inv.slug}/rsvp?key=${inv.rsvpKey}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                                            <Users size={14} /> Panel Asistencia
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-middle text-right w-32">
                                                <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(inv.slug)} className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors border border-transparent" title="Configurar Evento">
                                                        <Settings2 size={18} />
                                                    </button>
                                                    {!inv.isDefault && (
                                                        <button 
                                                            disabled={deleting === inv.slug} 
                                                            onClick={() => handleDelete(inv.slug)} 
                                                            className="p-2.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 border border-transparent" 
                                                            title="Dar de baja evento"
                                                        >
                                                            {deleting === inv.slug ? <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div> : <Trash2 size={18} />}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Config & Creation Wizard Modal Sidebar-Style */}
            {showWizard && (
                <div className="fixed inset-0 z-50 flex justify-end p-0 sm:p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowWizard(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl h-full sm:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300 overflow-hidden">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white z-10 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                                    {editingSlug ? <Settings2 size={20}/> : <Plus size={20}/>}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        {editingSlug ? 'Configuración de Plantilla Activa' : 'Generador de Evento'}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">{editingSlug ? `/i/${form.slug}` : 'Despliegue un nuevo portal'}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowWizard(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body with Sidebar Tabs */}
                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                            {/* Horizontal Tabs for Mobile, Vert for Desktop */}
                            <aside className="w-full md:w-64 bg-slate-50/50 md:border-r border-b md:border-b-0 border-slate-200 p-2 md:p-4 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
                                {[
                                    { s: 1, icon: <LayoutTemplate size={18} />, label: 'Datos Base', desc: 'Identificador y fechas' },
                                    { s: 2, icon: <ImageIcon size={18} />, label: 'Visual y Tema', desc: 'Identidad cromática' },
                                    { s: 3, icon: <CalendarIcon size={18} />, label: 'Protocolo', desc: 'Sedes y código' },
                                    { s: 4, icon: <LayoutList size={18} />, label: 'Despliegue', desc: 'Autenticar y lanzar' }
                                ].map(item => (
                                    <button 
                                        key={item.s}
                                        onClick={() => setStep(item.s)}
                                        disabled={creating || (!form.eventTitle && item.s > 1)}
                                        className={`flex items-center text-left gap-3 p-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal shrink-0 border border-transparent ${step === item.s ? 'bg-white shadow-sm border-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'} ${!form.eventTitle && item.s > 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className={`shrink-0 ${step === item.s ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {item.icon}
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-sm font-bold">{item.label}</p>
                                            <p className="text-xs font-medium text-slate-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        <span className="md:hidden text-sm font-bold">{item.label}</span>
                                    </button>
                                ))}
                            </aside>

                            {/* Main Content Area */}
                            <div className="flex-1 overflow-y-auto bg-white">
                                <div className="p-6 md:p-8 max-w-2xl mx-auto pb-32">
                                    
                                    {/* STEP 1 */}
                                    {step === 1 && (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">Configuración Base</h3>
                                                <p className="text-sm text-slate-500 mt-1">Estructura fundamental del portal y metadatos.</p>
                                            </div>
                                            
                                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Motor Gráfico (Plantilla)</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { id: 'boda', label: 'Boda', icon: <Heart size={20} /> },
                                                        { id: 'bautizo', label: 'Bautizo', icon: <CalendarIcon size={20} /> },
                                                        { id: 'xv', label: 'XV Años', icon: <Users size={20} /> }
                                                    ].map(t => (
                                                        <button 
                                                            key={t.id} 
                                                            onClick={() => updateForm('eventType', t.id)}
                                                            className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${form.eventType === t.id ? 'border-slate-900 bg-white text-slate-900 shadow-md ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white/50'}`}
                                                        >
                                                            <div className="mb-2 opacity-80">{t.icon}</div>
                                                            <span className="text-sm font-bold">{t.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Etiqueta Principal (Nombres)</label>
                                                    <input type="text" placeholder="Ej: Kassandra & Brian" value={form.eventTitle} onChange={(e) => updateForm('eventTitle', e.target.value)} onBlur={autoSlug} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all shadow-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Path URL Permanente</label>
                                                    <div className="flex group focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent rounded-lg shadow-sm">
                                                        <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm font-mono shrink-0">/i/</span>
                                                        <input type="text" placeholder="kassandra-brian" disabled={!!editingSlug} value={form.slug} onChange={(e) => updateForm('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full bg-white border border-slate-300 rounded-r-lg px-4 py-2.5 text-sm font-mono text-slate-900 outline-none transition-all disabled:opacity-50 disabled:bg-slate-50" />
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Fecha y Hora</label>
                                                        <input type="datetime-local" value={form.countdownDateTime} onChange={(e) => updateForm('countdownDateTime', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none shadow-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2 */}
                                    {step === 2 && (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">Diseño Visual</h3>
                                                <p className="text-sm text-slate-500 mt-1">Configuración estética, paleta de colores y componentes interactivos.</p>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Sistema de Color (Presets)</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { id: 'sage', name: 'Salvia Minimalista', colors: ['#5d7c6f', '#f4f6e7'] },
                                                            { id: 'rose', name: 'Rosa Polvo', colors: ['#99585c', '#fcf6f5'] },
                                                            { id: 'ocean', name: 'Azul Egeo', colors: ['#4b6b82', '#f2f6f8'] },
                                                            { id: 'wine', name: 'Vino Tinto Editorial', colors: ['#4a1525', '#fbf8f1'] },
                                                            { id: 'emerald', name: 'Esmeralda Nocturna', colors: ['#064e3b', '#ecfdf5'] },
                                                            { id: 'terracotta', name: 'Terracota Rustica', colors: ['#7c2d12', '#fff7ed'] },
                                                            { id: 'lavender', name: 'Lavanda Provenza', colors: ['#4c1d95', '#faf5ff'] },
                                                            { id: 'slate', name: 'Grafito Oscuro', colors: ['#1e293b', '#f8fafc'] }
                                                        ].map(preset => (
                                                            <button 
                                                                key={preset.id} 
                                                                onClick={() => updateForm('themePreset', preset.id)}
                                                                className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${form.themePreset === preset.id ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                                            >
                                                                <div className="flex -space-x-2 shrink-0">
                                                                    <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{background: preset.colors[0]}}></div>
                                                                    <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{background: preset.colors[1]}}></div>
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-700 text-left">{preset.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <label className="flex items-start gap-4 p-4 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                                                    <div className="mt-1">
                                                        <input type="checkbox" checked={form.heroHasMusic} onChange={(e) => updateForm('heroHasMusic', e.target.checked)} className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 flex items-center gap-2"><Music size={16} className="text-slate-500"/> Reproductor Musical Nativo</span>
                                                        <span className="text-sm font-medium text-slate-500 mt-1">Integra un reproductor flotante en la interfaz. Necesitas cargar un track manualmente (`song.mp3`) en los assets públicos.</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3 */}
                                    {step === 3 && (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900">Itinerario y Sedes</h3>
                                                    <p className="text-sm text-slate-500 mt-1">Configuración del protocolo y mapa.</p>
                                                </div>
                                                <button onClick={addEvent} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"><Plus size={14} /> Fila Adicional</button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {form.events.map((ev, i) => (
                                                    <div key={i} className="flex flex-col gap-3 p-5 bg-white border border-slate-200 rounded-xl relative shadow-sm">
                                                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-1">
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><MapPin size={14}/> {i === 0 ? 'Ceremonia' : (i === 1 ? 'Recepción' : `Sede ${i+1}`)}</span>
                                                            <button onClick={() => removeEvent(i)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-xs font-bold text-slate-600">Referencia (Ej: Recepción)</label>
                                                                <input value={ev.title} onChange={(e) => updateEvent(i, 'title', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-xs font-bold text-slate-600">Hora</label>
                                                                <input value={ev.time} onChange={(e) => updateEvent(i, 'time', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-slate-600">Dirección Exacta</label>
                                                            <input value={ev.location} onChange={(e) => updateEvent(i, 'location', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-slate-600">URL Geoespacial (Maps / Waze)</label>
                                                            <input value={ev.mapLink} onChange={(e) => updateEvent(i, 'mapLink', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-blue-600 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none" placeholder="https://maps.app.goo.gl/..." />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t border-slate-200 pt-6 space-y-4">
                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Protocolo de Asistencia</h4>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-600 mb-2">Restricción de Etiqueta (Dress Code)</label>
                                                    <input placeholder="Ej: Black Tie, Etiqueta Rigurosa" value={form.dressCode} onChange={(e) => updateForm('dressCode', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-900 shadow-sm outline-none" />
                                                </div>
                                                <label className="flex items-center gap-3 p-4 border border-slate-300 shadow-sm rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                                    <input type="checkbox" checked={form.adultsOnly} onChange={(e) => updateForm('adultsOnly', e.target.checked)} className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
                                                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users size={16} className="text-slate-500"/> Protocolo Estricto: Sin Menores (Adults Only)</span>
                                                </label>
                                                
                                                <div className="pt-4 border-t border-slate-100">
                                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Recepción de Confirmaciones (RSVP)</label>
                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <button 
                                                            onClick={() => updateForm('rsvpMode', 'internal')}
                                                            className={`flex items-center justify-center p-3 border rounded-xl transition-all ${form.rsvpMode === 'internal' ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900 text-slate-900' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                                        >
                                                            <span className="text-sm font-bold flex items-center gap-2"><LayoutList size={16}/> Tablero Interno</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => updateForm('rsvpMode', 'whatsapp')}
                                                            className={`flex items-center justify-center p-3 border rounded-xl transition-all ${form.rsvpMode === 'whatsapp' ? 'border-slate-900 bg-slate-50 shadow-sm ring-1 ring-slate-900 text-slate-900' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                                        >
                                                            <span className="text-sm font-bold flex items-center gap-2"><MessageSquare size={16}/> WhatsApp</span>
                                                        </button>
                                                    </div>
                                                    
                                                    {form.rsvpMode === 'whatsapp' && (
                                                        <div className="space-y-1 animate-in fade-in duration-300">
                                                            <label className="text-xs font-bold text-slate-600 mb-1 block">Número de WhatsApp (con código de país, ej: +52...)</label>
                                                            <input placeholder="+52 55 1234 5678" value={form.rsvpWhatsapp} onChange={(e) => updateForm('rsvpWhatsapp', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4 */}
                                    {step === 4 && (
                                        <div className="space-y-8 animate-in fade-in duration-300">
                                            <div className="text-center py-6">
                                                <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-2xl mb-4">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    {editingSlug ? 'Revisión y Actualización' : 'Estructura Lista para Lanzamiento'}
                                                </h3>
                                                <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm font-medium">Favor de verificar el endpoint y dependencias clave.</p>
                                            </div>
                                            
                                            <div className="bg-slate-50 shadow-inner rounded-xl p-6 border border-slate-200">
                                                <div className="flex flex-col gap-4">
                                                    <div>
                                                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nombre Autorizado</span>
                                                        <span className="text-sm font-bold text-slate-900">{form.eventTitle}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Endpoint de Salida</span>
                                                        <span className="text-sm font-mono text-blue-600">/i/{form.slug}</span>
                                                    </div>
                                                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                                                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Motor / Template</span>
                                                        <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2 py-1 rounded shadow-sm">
                                                            {form.eventType}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="flex justify-between items-center p-4 md:p-6 bg-slate-50 border-t border-slate-200 shrink-0 z-10 sm:rounded-b-2xl">
                            <button 
                                onClick={() => step > 1 ? setStep(step - 1) : setShowWizard(false)}
                                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {step > 1 ? <ArrowLeft size={16} /> : null}
                                {step > 1 ? 'Atrás' : 'Cancelar'}
                            </button>

                            {step < 4 ? (
                                <button 
                                    disabled={!form.eventTitle || !form.slug || !form.countdownDateTime}
                                    onClick={() => setStep(step + 1)}
                                    className="px-6 py-2.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    Siguiente Paso <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button 
                                    disabled={creating}
                                    onClick={handleSave}
                                    className="px-8 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 group"
                                >
                                    {creating ? (
                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
                                    )}
                                    {editingSlug ? 'Publicar Ajustes' : 'Desplegar Invitación'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
