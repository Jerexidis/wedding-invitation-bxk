import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, ExternalLink, Copy, Settings, Eye, ChevronLeft, ChevronDown, Check, Loader2, FileText, MoreVertical, Upload, CloudOff, EyeOff, Rocket, X, AlertTriangle, Palette, History, RotateCcw, CalendarDays, Archive, Search, Sparkles } from 'lucide-react'
import WizardForm from './WizardForm'
import './AdminPanel.css'

const API = '/api/invitations'
const EVENT_LABELS = { xv: 'XV Años', boda: 'Boda', bautizo: 'Bautizo', cumple: 'Cumpleaños', cumpleanos: 'Cumpleaños', 'primera-comunion': 'Primera Comunión', despedida: 'Despedida' }
const RSVP_LABELS = { whatsapp: 'WhatsApp', supabase: 'Dashboard', mixed: 'Dashboard + WhatsApp', none: 'Sin RSVP' }
const slugify = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
const eventTimestamp = (invitation) => {
    if (!invitation.eventDate) return null
    const timestamp = Date.parse(invitation.eventDate)
    return Number.isNaN(timestamp) ? null : timestamp
}
const formatEventDate = (eventDate) => {
    const timestamp = Date.parse(eventDate)
    if (Number.isNaN(timestamp)) return 'Fecha inválida'
    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(timestamp))
}

function InvitationRow({ invitation: inv, selected, onSelect, isNext = false }) {
    const timestamp = eventTimestamp(inv)
    const expired = timestamp !== null && timestamp < Date.now()
    const daysRemaining = timestamp === null ? null : Math.max(0, Math.ceil((timestamp - Date.now()) / 86400000))
    return (
        <button
            type="button"
            className={`inv-row ${selected ? 'inv-row-selected' : ''}`}
            onClick={onSelect}
        >
            <span className={`status-dot ${inv.enabled ? 'status-active' : 'status-draft'}`} />
            <div className="inv-row-info">
                <div className="inv-row-heading">
                    <span className="inv-row-name">{inv.title}</span>
                    {timestamp !== null && (
                        <span className={`inv-row-date ${expired ? 'is-expired' : ''}`}>
                            <CalendarDays size={13} />
                            {formatEventDate(inv.eventDate)}
                            {!expired && <em>{daysRemaining === 0 ? 'Hoy' : `Faltan ${daysRemaining} días`}</em>}
                        </span>
                    )}
                </div>
                <div className="inv-row-meta">
                    {inv.isDefault && <span className="badge badge-blue">Landing</span>}
                    {isNext && <span className="badge badge-next">Siguiente evento</span>}
                    {inv.isDemo && <span className="badge badge-demo">Demo</span>}
                    {inv.isDraft && <span className="badge badge-purple">Borrador personalizado</span>}
                    {!inv.enabled && <span className="badge badge-gray">Inactiva</span>}
                    {inv.eventType && <span className={`badge ${inv.eventType === 'xv' ? 'badge-purple' : inv.eventType === 'boda' ? 'badge-orange' : 'badge-gray'}`}>{EVENT_LABELS[inv.eventType] || inv.eventType}</span>}
                    {inv.rsvpMode && <span className={`badge ${inv.rsvpMode === 'whatsapp' ? 'badge-green' : inv.rsvpMode === 'supabase' ? 'badge-orange' : 'badge-gray'}`}>{RSVP_LABELS[inv.rsvpMode] || inv.rsvpMode}</span>}
                    {expired && <span className="badge badge-red">Vencida</span>}
                    <code className="inv-card-url">/i/{inv.slug}</code>
                </div>
            </div>
        </button>
    )
}

export default function AdminPanel() {
    const [invitations, setInvitations] = useState([])
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState('list')
    const [editSlug, setEditSlug] = useState(null)
    const [quickSlug, setQuickSlug] = useState(null)
    const [toast, setToast] = useState(null)
    const [selectedSlug, setSelectedSlug] = useState(null)
    const [cloneDialog, setCloneDialog] = useState(null)
    const [renameDialog, setRenameDialog] = useState(null)
    const [reportDialog, setReportDialog] = useState(null)
    const [actionLoading, setActionLoading] = useState('')
    const [quality, setQuality] = useState({ status: 'idle', summary: null, issues: [], details: [], workspaceSignature: null })
    const [customDialog, setCustomDialog] = useState(null)
    const [creatingCustom, setCreatingCustom] = useState(false)
    const [activationDialog, setActivationDialog] = useState(null)

    // Deploy state
    const [deployStatus, setDeployStatus] = useState({ hasChanges: false, changeCount: 0, files: [], signature: null })
    const [deploying, setDeploying] = useState(false)
    const [showDeployDialog, setShowDeployDialog] = useState(false)
    const [commitMessage, setCommitMessage] = useState('')
    const [publicationHistory, setPublicationHistory] = useState([])
    const [showHistoryDialog, setShowHistoryDialog] = useState(false)
    const [restoringPublication, setRestoringPublication] = useState(false)
    const [showExpired, setShowExpired] = useState(false)
    const [showDemos, setShowDemos] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [eventFilter, setEventFilter] = useState('all')
    const [rsvpFilter, setRsvpFilter] = useState('all')

    const fetchInvitations = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(API)
            const json = await res.json()
            if (json.ok) setInvitations(json.invitations)
        } catch (err) { console.error(err) }
        setLoading(false)
    }, [])

    const fetchDeployStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/deploy/status')
            const json = await res.json()
            if (json.ok) setDeployStatus({
                hasChanges: json.hasChanges,
                changeCount: json.changeCount,
                files: json.files || [],
                signature: json.signature || null,
            })
        } catch (err) { console.error('Deploy status check failed:', err) }
    }, [])

    const fetchPublicationHistory = useCallback(async () => {
        try {
            const res = await fetch('/api/deploy/history')
            const json = await res.json()
            if (json.ok) setPublicationHistory(json.publications || [])
        } catch (err) {
            console.error('Publication history check failed:', err)
        }
    }, [])

    useEffect(() => { fetchInvitations() }, [fetchInvitations])
    useEffect(() => { fetchDeployStatus() }, [fetchDeployStatus])
    useEffect(() => { fetchPublicationHistory() }, [fetchPublicationHistory])
    useEffect(() => {
        if (
            quality.status === 'ready'
            && quality.workspaceSignature
            && deployStatus.signature
            && quality.workspaceSignature !== deployStatus.signature
        ) {
            setQuality((current) => ({ ...current, status: 'stale' }))
        }
    }, [deployStatus.signature, quality.status, quality.workspaceSignature])

    // Poll deploy status every 15s while on list view
    useEffect(() => {
        if (view !== 'list') return
        const interval = setInterval(fetchDeployStatus, 15000)
        return () => clearInterval(interval)
    }, [view, fetchDeployStatus])

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    const handleDelete = async (slug) => {

        if (!confirm(`¿Eliminar "${slug}"? Esta acción no se puede deshacer.`)) return
        try {
            const res = await fetch(`${API}/${slug}`, { method: 'DELETE' })
            const json = await res.json()
            if (json.ok) {
                showToast('Invitación eliminada (solo local)')
                setSelectedSlug(null)
                fetchInvitations()
                fetchDeployStatus()
            }
            else showToast(json.error, 'error')
        } catch (err) { showToast(err.message, 'error') }
    }

    const handleToggle = async (slug, currentEnabled) => {
        try {
            const res = await fetch(`${API}/${slug}/toggle`, { method: 'PATCH' })
            const json = await res.json()
            if (json.ok) {
                showToast(json.enabled ? `"${slug}" activada` : `"${slug}" desactivada`)
                fetchInvitations()
                fetchDeployStatus()
            }
            else showToast(json.error, 'error')
        } catch (err) { showToast(err.message, 'error') }
    }

    const handlePortfolioToggle = async (slug, currentExcluded) => {
        try {
            const res = await fetch(`${API}/${slug}/portfolio`, { method: 'PATCH' })
            const json = await res.json()
            if (json.ok) {
                showToast(json.excludeFromPortfolio ? `"${slug}" oculta del landing` : `"${slug}" visible en landing`)
                fetchInvitations()
                fetchDeployStatus()
            }
            else showToast(json.error, 'error')
        } catch (err) { showToast(err.message, 'error') }
    }

    const openCloneDialog = (inv) => {
        setCloneDialog({
            sourceSlug: inv.slug,
            newSlug: `${inv.slug}-copia`,
            title: `${inv.title} copia`,
        })
    }

    const handleClone = async () => {
        if (!cloneDialog?.sourceSlug || !cloneDialog?.newSlug) return
        setActionLoading('clone')
        try {
            const res = await fetch(`${API}/${cloneDialog.sourceSlug}/clone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newSlug: slugify(cloneDialog.newSlug), title: cloneDialog.title || undefined }),
            })
            const json = await res.json()
            if (json.ok) {
                showToast(`Invitacion clonada: ${json.path}`)
                setCloneDialog(null)
                setSelectedSlug(json.slug)
                fetchInvitations()
                fetchDeployStatus()
            }
            else showToast(json.error, 'error')
        } catch (err) { showToast(err.message, 'error') }
        setActionLoading('')
    }

    const openRenameDialog = (inv) => {
        setRenameDialog({ oldSlug: inv.slug, newSlug: inv.slug })
    }

    const handleRename = async () => {
        if (!renameDialog?.oldSlug || !renameDialog?.newSlug) return
        const newSlug = slugify(renameDialog.newSlug)
        if (renameDialog.oldSlug === newSlug) {
            showToast('Escribe un slug diferente', 'error')
            return
        }
        if (!confirm(`Cambiar /i/${renameDialog.oldSlug} a /i/${newSlug}?`)) return
        setActionLoading('rename')
        try {
            const res = await fetch(`${API}/${renameDialog.oldSlug}/rename`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newSlug }),
            })
            const json = await res.json()
            if (json.ok) {
                showToast(`Link actualizado: ${json.path}`)
                setRenameDialog(null)
                setSelectedSlug(json.slug)
                fetchInvitations()
                fetchDeployStatus()
            }
            else showToast(json.error, 'error')
        } catch (err) { showToast(err.message, 'error') }
        setActionLoading('')
    }

    const showValidationReport = async (slug) => {
        setActionLoading(`validate:${slug}`)
        try {
            const res = await fetch(`${API}/${slug}/validate`)
            const json = await res.json()
            if (json.ok) setReportDialog({ type: 'validate', title: `Validacion - ${slug}`, report: json.report })
            else showToast(json.error, 'error')
        } catch (err) { showToast(err.message, 'error') }
        setActionLoading('')
    }

    const showAssetReport = async (slug) => {
        setActionLoading(`assets:${slug}`)
        try {
            const res = await fetch(`${API}/${slug}/assets`)
            const json = await res.json()
            if (json.ok) setReportDialog({ type: 'assets', title: `Assets - ${slug}`, report: json.report })
            else showToast(json.error, 'error')
        } catch (err) { showToast(err.message, 'error') }
        setActionLoading('')
    }

    const runQualityCheck = async () => {
        setQuality({ status: 'running', summary: null, issues: [], details: [], workspaceSignature: null })
        try {
            const res = await fetch('/api/quality/run', { method: 'POST' })
            const json = await res.json()
            setQuality({
                status: json.ready ? 'ready' : 'failed',
                summary: json.summary || null,
                issues: json.issues || [],
                details: json.details || [],
                error: json.error || null,
                workspaceSignature: json.workspaceSignature || null,
            })
            fetchDeployStatus()
        } catch (err) {
            setQuality({ status: 'failed', summary: null, issues: [], details: [], error: err.message, workspaceSignature: null })
        }
    }

    const openCustomDialog = () => {
        setCustomDialog({
            title: '',
            slug: '',
            eventType: 'boda',
            reference: 'plantilla-boda-editorial',
        })
    }

    const updateCustomTitle = (title) => {
        setCustomDialog((current) => ({ ...current, title, slug: slugify(title) }))
    }

    const createCustomDraft = async () => {
        if (!customDialog?.title || !customDialog?.slug) {
            showToast('Escribe el nombre de la invitación', 'error')
            return
        }
        setCreatingCustom(true)
        try {
            const res = await fetch('/api/starters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customDialog),
            })
            const json = await res.json()
            if (!json.ok) throw new Error(json.error || 'No se pudo crear el borrador')
            showToast('Borrador personalizado creado')
            setCustomDialog(null)
            setSelectedSlug(json.slug)
            setQuality((current) => ({ ...current, status: 'stale' }))
            fetchInvitations()
            fetchDeployStatus()
        } catch (err) {
            showToast(err.message, 'error')
        }
        setCreatingCustom(false)
    }

    const openActivationDialog = async (slug) => {
        setActionLoading(`activation-plan:${slug}`)
        try {
            const res = await fetch(`${API}/${slug}/activation`)
            const json = await res.json()
            if (!json.ok) throw new Error(json.error || 'No se pudo revisar el borrador')
            setActivationDialog({ ...json.plan.activation, plan: json.plan })
        } catch (err) {
            showToast(err.message, 'error')
        }
        setActionLoading('')
    }

    const handleActivateDraft = async () => {
        if (!activationDialog?.slug) return
        if (!activationDialog.title || !activationDialog.eventDate || !activationDialog.ogSource) {
            showToast('Completa título, fecha e imagen social', 'error')
            return
        }
        if (!confirm(`¿Preparar /i/${activationDialog.slug} como invitación activa local? Todavía no se publicará.`)) return

        setActionLoading(`activate:${activationDialog.slug}`)
        try {
            const { plan, ...payload } = activationDialog
            const res = await fetch(`${API}/${activationDialog.slug}/activation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const json = await res.json()
            if (!json.ok) throw new Error(json.error || 'No se pudo preparar la invitación')
            showToast(`Invitación preparada localmente: ${json.path}`)
            setActivationDialog(null)
            setSelectedSlug(json.slug)
            setQuality((current) => ({ ...current, status: 'stale' }))
            fetchInvitations()
            fetchDeployStatus()
        } catch (err) {
            showToast(err.message, 'error')
        }
        setActionLoading('')
    }

    const openDeployDialog = () => {
        const reviewIsCurrent = quality.status === 'ready'
            && quality.workspaceSignature
            && quality.workspaceSignature === deployStatus.signature
        if (!reviewIsCurrent) {
            showToast('Revisa el proyecto antes de publicar', 'error')
            document.querySelector('.quality-center')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
        }
        setShowDeployDialog(true)
    }

    const handleDeploy = async () => {
        setDeploying(true)
        try {
            const res = await fetch('/api/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: commitMessage || undefined })
            })
            const json = await res.json()
            if (json.ok) {
                if (json.deployed) {
                    showToast('✅ Cambios publicados — Vercel iniciará el deploy')
                    if (json.historyWarning) window.setTimeout(() => showToast(json.historyWarning, 'error'), 500)
                } else {
                    showToast(json.message || 'No hay cambios para publicar')
                }
                setShowDeployDialog(false)
                setCommitMessage('')
                fetchDeployStatus()
                fetchPublicationHistory()
            } else {
                showToast(json.error || 'Error al publicar', 'error')
            }
        } catch (err) { showToast('Error de conexión: ' + err.message, 'error') }
        setDeploying(false)
    }

    const handleRestorePublication = async () => {
        const latest = publicationHistory[0]
        if (!latest || latest.restoredAt) return
        if (!confirm(`¿Restaurar localmente la versión anterior a "${latest.message}"? Después deberás revisarla y publicarla.`)) return

        setRestoringPublication(true)
        try {
            const res = await fetch('/api/deploy/undo', { method: 'POST' })
            const json = await res.json()
            if (!json.ok) throw new Error(json.error || 'No se pudo restaurar la publicación')
            showToast('Versión anterior restaurada como cambios locales')
            setShowHistoryDialog(false)
            setQuality((current) => ({ ...current, status: 'stale' }))
            fetchInvitations()
            fetchDeployStatus()
            fetchPublicationHistory()
        } catch (err) {
            showToast(err.message, 'error')
        }
        setRestoringPublication(false)
    }

    const PROD_BASE = 'https://eventos.invita-ya.com'

    const copyLink = (slug) => {
        navigator.clipboard.writeText(`${PROD_BASE}/i/${slug}`)
        showToast('Enlace copiado al portapapeles')
    }

    const copyRsvpLink = (slug, key) => {
        navigator.clipboard.writeText(`${PROD_BASE}/i/${slug}/rsvp?key=${key}`)
        showToast('Enlace RSVP copiado al portapapeles')
    }

    const goBack = () => { setView('list'); fetchInvitations(); fetchDeployStatus() }
    const now = Date.now()
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase('es')
    const filteredInvitations = invitations.filter(invitation => {
        const matchesSearch = !normalizedSearch
            || invitation.title.toLocaleLowerCase('es').includes(normalizedSearch)
            || invitation.slug.toLocaleLowerCase('es').includes(normalizedSearch)
        const matchesEvent = eventFilter === 'all' || invitation.eventType === eventFilter
        const matchesRsvp = rsvpFilter === 'all' || invitation.rsvpMode === rsvpFilter
        return matchesSearch && matchesEvent && matchesRsvp
    })
    const hasFilters = Boolean(normalizedSearch) || eventFilter !== 'all' || rsvpFilter !== 'all'
    const drafts = filteredInvitations
        .filter(invitation => invitation.isDraft)
        .sort((left, right) => left.title.localeCompare(right.title, 'es'))
    const demoInvitations = filteredInvitations
        .filter(invitation => !invitation.isDraft && invitation.isDemo)
        .sort((left, right) => left.title.localeCompare(right.title, 'es'))
    const upcomingInvitations = filteredInvitations
        .filter(invitation => !invitation.isDraft && !invitation.isDemo && (eventTimestamp(invitation) === null || eventTimestamp(invitation) >= now))
        .sort((left, right) => {
            const leftDate = eventTimestamp(left) ?? Number.POSITIVE_INFINITY
            const rightDate = eventTimestamp(right) ?? Number.POSITIVE_INFINITY
            return leftDate - rightDate || left.title.localeCompare(right.title, 'es')
        })
    const expiredInvitations = filteredInvitations
        .filter(invitation => !invitation.isDraft && !invitation.isDemo && eventTimestamp(invitation) !== null && eventTimestamp(invitation) < now)
        .sort((left, right) => eventTimestamp(right) - eventTimestamp(left) || left.title.localeCompare(right.title, 'es'))
    const nextInvitationSlug = upcomingInvitations[0]?.slug || null

    return (
        <div className="admin admin-no-sidebar">
            {toast && <div className={`admin-toast ${toast.type}`}>{toast.type !== 'error' && <Check size={14} />}{toast.msg}</div>}

            {cloneDialog && (
                <div className="deploy-overlay" onClick={() => actionLoading !== 'clone' && setCloneDialog(null)}>
                    <div className="deploy-dialog" onClick={e => e.stopPropagation()}>
                        <div className="deploy-dialog-header">
                            <div className="deploy-dialog-icon"><Copy size={22} /></div>
                            <h3>Clonar invitacion</h3>
                            <button className="btn-icon deploy-dialog-close" onClick={() => setCloneDialog(null)} disabled={actionLoading === 'clone'}><X size={18} /></button>
                        </div>
                        <div className="deploy-dialog-body">
                            <div className="form-group">
                                <label className="form-label">Invitacion base</label>
                                <input className="form-input" value={cloneDialog.sourceSlug} disabled />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nuevo slug / link</label>
                                <input className="form-input" value={cloneDialog.newSlug} onChange={e => setCloneDialog(d => ({ ...d, newSlug: e.target.value }))} />
                                <p className="form-hint">Quedara como /i/{slugify(cloneDialog.newSlug || '')}</p>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Titulo inicial</label>
                                <input className="form-input" value={cloneDialog.title} onChange={e => setCloneDialog(d => ({ ...d, title: e.target.value }))} />
                            </div>
                        </div>
                        <div className="deploy-dialog-footer">
                            <button className="btn btn-secondary" onClick={() => setCloneDialog(null)} disabled={actionLoading === 'clone'}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleClone} disabled={actionLoading === 'clone'}>
                                {actionLoading === 'clone' ? <><Loader2 size={14} className="animate-spin" /> Clonando...</> : <><Copy size={14} /> Clonar</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {renameDialog && (
                <div className="deploy-overlay" onClick={() => actionLoading !== 'rename' && setRenameDialog(null)}>
                    <div className="deploy-dialog" onClick={e => e.stopPropagation()}>
                        <div className="deploy-dialog-header">
                            <div className="deploy-dialog-icon"><ExternalLink size={22} /></div>
                            <h3>Cambiar link</h3>
                            <button className="btn-icon deploy-dialog-close" onClick={() => setRenameDialog(null)} disabled={actionLoading === 'rename'}><X size={18} /></button>
                        </div>
                        <div className="deploy-dialog-body">
                            <div className="deploy-warning">
                                <AlertTriangle size={16} />
                                <span>Esto renombra carpetas locales y actualiza config/registry. Revisa links compartidos antes de publicar.</span>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Slug actual</label>
                                <input className="form-input" value={renameDialog.oldSlug} disabled />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Nuevo slug</label>
                                <input className="form-input" value={renameDialog.newSlug} onChange={e => setRenameDialog(d => ({ ...d, newSlug: e.target.value }))} />
                                <p className="form-hint">Nuevo link: /i/{slugify(renameDialog.newSlug || '')}</p>
                            </div>
                        </div>
                        <div className="deploy-dialog-footer">
                            <button className="btn btn-secondary" onClick={() => setRenameDialog(null)} disabled={actionLoading === 'rename'}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleRename} disabled={actionLoading === 'rename'}>
                                {actionLoading === 'rename' ? <><Loader2 size={14} className="animate-spin" /> Actualizando...</> : <><ExternalLink size={14} /> Cambiar link</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {customDialog && (
                <div className="deploy-overlay" onClick={() => !creatingCustom && setCustomDialog(null)}>
                    <div className="deploy-dialog" onClick={e => e.stopPropagation()}>
                        <div className="deploy-dialog-header">
                            <div className="deploy-dialog-icon"><Palette size={22} /></div>
                            <h3>Nueva invitación personalizada</h3>
                            <button className="btn-icon deploy-dialog-close" onClick={() => setCustomDialog(null)} disabled={creatingCustom}><X size={18} /></button>
                        </div>
                        <div className="deploy-dialog-body">
                            <p className="custom-dialog-intro">
                                Crea un borrador visual independiente usando otra invitación solo como referencia funcional.
                                No se publica ni obtiene un enlace hasta que el diseño esté listo.
                            </p>
                            <div className="form-group">
                                <label className="form-label">Nombre del proyecto</label>
                                <input
                                    className="form-input"
                                    value={customDialog.title}
                                    onChange={e => updateCustomTitle(e.target.value)}
                                    placeholder="Ej. Boda de Andrea y Luis"
                                />
                                {customDialog.slug && <div className="url-preview">Borrador: <code>{customDialog.slug}</code></div>}
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Tipo de evento</label>
                                    <select className="form-input" value={customDialog.eventType} onChange={e => setCustomDialog(d => ({ ...d, eventType: e.target.value }))}>
                                        <option value="boda">Boda</option>
                                        <option value="xv">XV Años</option>
                                        <option value="cumpleanos">Cumpleaños</option>
                                        <option value="primera-comunion">Primera Comunión</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Referencia estructural</label>
                                    <select className="form-input" value={customDialog.reference} onChange={e => setCustomDialog(d => ({ ...d, reference: e.target.value }))}>
                                        {invitations.filter(inv => !inv.isDraft).map(inv => (
                                            <option key={inv.slug} value={inv.slug}>{inv.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="deploy-dialog-footer">
                            <button className="btn btn-secondary" onClick={() => setCustomDialog(null)} disabled={creatingCustom}>Cancelar</button>
                            <button className="btn btn-primary" onClick={createCustomDraft} disabled={creatingCustom || !customDialog.title || !customDialog.slug}>
                                {creatingCustom ? <><Loader2 size={14} className="animate-spin" /> Creando…</> : <><Palette size={14} /> Crear borrador</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activationDialog && (
                <div className="deploy-overlay" onClick={() => !actionLoading.startsWith('activate:') && setActivationDialog(null)}>
                    <div className="deploy-dialog report-dialog" onClick={e => e.stopPropagation()}>
                        <div className="deploy-dialog-header">
                            <div className="deploy-dialog-icon"><Rocket size={22} /></div>
                            <h3>Preparar invitación activa</h3>
                            <button
                                className="btn-icon deploy-dialog-close"
                                onClick={() => setActivationDialog(null)}
                                disabled={actionLoading.startsWith('activate:')}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="deploy-dialog-body">
                            <div className="deploy-warning activation-local-note">
                                <AlertTriangle size={16} />
                                <span>Solo prepara archivos locales. No ejecuta commit, push ni publicación.</span>
                            </div>

                            {activationDialog.plan.errors.length > 0 && (
                                <div className="activation-issues">
                                    {activationDialog.plan.errors.map((error, index) => <p key={index}>{error}</p>)}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Título público</label>
                                <input
                                    className="form-input"
                                    value={activationDialog.title}
                                    onChange={e => setActivationDialog(current => ({ ...current, title: e.target.value }))}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Fecha y hora</label>
                                    <input
                                        type="datetime-local"
                                        className="form-input"
                                        value={activationDialog.eventDate}
                                        onChange={e => setActivationDialog(current => ({ ...current, eventDate: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirmación RSVP</label>
                                    <select
                                        className="form-input"
                                        value={activationDialog.rsvpMode}
                                        onChange={e => setActivationDialog(current => ({ ...current, rsvpMode: e.target.value }))}
                                    >
                                        <option value="none">Sin RSVP</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="supabase">Dashboard</option>
                                        <option value="mixed">Dashboard + WhatsApp</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripción para compartir</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={activationDialog.description}
                                    onChange={e => setActivationDialog(current => ({ ...current, description: e.target.value }))}
                                    placeholder="Si se deja vacía se usará una descripción genérica."
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Imagen para Open Graph</label>
                                    <select
                                        className="form-input"
                                        value={activationDialog.ogSource}
                                        onChange={e => setActivationDialog(current => ({ ...current, ogSource: e.target.value }))}
                                    >
                                        <option value="">Selecciona una imagen</option>
                                        {activationDialog.plan.ogCandidates.map(candidate => (
                                            <option key={candidate} value={candidate}>{candidate}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Encuadre</label>
                                    <select
                                        className="form-input"
                                        value={activationDialog.focalPoint}
                                        onChange={e => setActivationDialog(current => ({ ...current, focalPoint: e.target.value }))}
                                    >
                                        <option value="center">Centro</option>
                                        <option value="top">Arriba</option>
                                        <option value="bottom">Abajo</option>
                                        <option value="left">Izquierda</option>
                                        <option value="right">Derecha</option>
                                    </select>
                                </div>
                            </div>
                            <label className="activation-checkbox">
                                <input
                                    type="checkbox"
                                    checked={activationDialog.portfolioGalleryAllowed}
                                    onChange={e => setActivationDialog(current => ({ ...current, portfolioGalleryAllowed: e.target.checked }))}
                                />
                                Permitir fotografías personales cuando se abra desde el portafolio
                            </label>
                            <div className="activation-operations">
                                <strong>La preparación hará lo siguiente:</strong>
                                {activationDialog.plan.operations.map((operation, index) => <span key={index}>• {operation}</span>)}
                            </div>
                        </div>
                        <div className="deploy-dialog-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setActivationDialog(null)}
                                disabled={actionLoading.startsWith('activate:')}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleActivateDraft}
                                disabled={actionLoading.startsWith('activate:') || !activationDialog.title || !activationDialog.eventDate || !activationDialog.ogSource}
                            >
                                {actionLoading.startsWith('activate:')
                                    ? <><Loader2 size={14} className="animate-spin" /> Preparando…</>
                                    : <><Rocket size={14} /> Preparar localmente</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {reportDialog && (
                <div className="deploy-overlay" onClick={() => setReportDialog(null)}>
                    <div className="deploy-dialog report-dialog" onClick={e => e.stopPropagation()}>
                        <div className="deploy-dialog-header">
                            <div className={`deploy-dialog-icon ${reportDialog.report?.ok === false ? 'report-icon-warn' : ''}`}>
                                {reportDialog.report?.ok === false ? <AlertTriangle size={22} /> : <Check size={22} />}
                            </div>
                            <h3>{reportDialog.title}</h3>
                            <button className="btn-icon deploy-dialog-close" onClick={() => setReportDialog(null)}><X size={18} /></button>
                        </div>
                        <div className="deploy-dialog-body">
                            {reportDialog.type === 'validate' ? (
                                <ReportList report={reportDialog.report} />
                            ) : (
                                <AssetReport report={reportDialog.report} />
                            )}
                        </div>
                        <div className="deploy-dialog-footer">
                            <button className="btn btn-primary" onClick={() => setReportDialog(null)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {showHistoryDialog && (
                <div className="deploy-overlay" onClick={() => !restoringPublication && setShowHistoryDialog(false)}>
                    <div className="deploy-dialog report-dialog" onClick={e => e.stopPropagation()}>
                        <div className="deploy-dialog-header">
                            <div className="deploy-dialog-icon history-dialog-icon"><History size={22} /></div>
                            <h3>Historial de publicaciones</h3>
                            <button className="btn-icon deploy-dialog-close" onClick={() => setShowHistoryDialog(false)} disabled={restoringPublication}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="deploy-dialog-body">
                            <div className="history-explanation">
                                Deshacer restaura la versión anterior como cambios locales. Podrás revisarlos antes de volver a publicar.
                            </div>
                            {publicationHistory.length === 0 ? (
                                <div className="history-empty">El historial comenzará con la próxima publicación realizada desde este panel.</div>
                            ) : (
                                <div className="history-list">
                                    {publicationHistory.map((item, index) => (
                                        <article className={`history-item ${item.restoredAt ? 'is-restored' : ''}`} key={item.id}>
                                            <div className="history-item-heading">
                                                <strong>{item.message}</strong>
                                                {index === 0 && !item.restoredAt && <span className="badge badge-green">Última</span>}
                                                {item.restoredAt && <span className="badge badge-gray">Restaurada</span>}
                                            </div>
                                            <span>{new Date(item.publishedAt).toLocaleString('es-MX')}</span>
                                            <code>{item.publishedCommit.slice(0, 8)} · {item.files.length} archivo(s)</code>
                                        </article>
                                    ))}
                                </div>
                            )}
                            {deployStatus.hasChanges && publicationHistory[0] && !publicationHistory[0].restoredAt && (
                                <div className="deploy-warning history-warning">
                                    <AlertTriangle size={16} />
                                    <span>Hay cambios locales. Debes publicarlos o guardarlos antes de restaurar.</span>
                                </div>
                            )}
                        </div>
                        <div className="deploy-dialog-footer">
                            <button className="btn btn-secondary" onClick={() => setShowHistoryDialog(false)} disabled={restoringPublication}>Cerrar</button>
                            {publicationHistory[0] && !publicationHistory[0].restoredAt && (
                                <button
                                    className="btn btn-danger"
                                    onClick={handleRestorePublication}
                                    disabled={restoringPublication || deployStatus.hasChanges || !publicationHistory[0].canRestore}
                                >
                                    {restoringPublication
                                        ? <><Loader2 size={14} className="animate-spin" /> Restaurando…</>
                                        : <><RotateCcw size={14} /> Deshacer última publicación</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Deploy Confirmation Dialog */}
            {showDeployDialog && (
                <div className="deploy-overlay" onClick={() => !deploying && setShowDeployDialog(false)}>
                    <div className="deploy-dialog" onClick={e => e.stopPropagation()}>
                        <div className="deploy-dialog-header">
                            <div className="deploy-dialog-icon">
                                <Rocket size={22} />
                            </div>
                            <h3>Publicar cambios a producción</h3>
                            <button className="btn-icon deploy-dialog-close" onClick={() => !deploying && setShowDeployDialog(false)} disabled={deploying}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="deploy-dialog-body">
                            <div className="deploy-warning">
                                <AlertTriangle size={16} />
                                <span>Estos cambios serán visibles para todos los visitantes</span>
                            </div>

                            <div className="deploy-changes-summary">
                                <span className="deploy-changes-label">Archivos modificados</span>
                                <span className="deploy-changes-count">{deployStatus.changeCount}</span>
                            </div>

                            {deployStatus.files.length > 0 && (
                                <div className="deploy-file-list">
                                    {deployStatus.files.map((f, i) => (
                                        <div key={i} className="deploy-file-item">
                                            <span className={`deploy-file-status ${f.startsWith('??') ? 'new' : f.startsWith(' D') || f.startsWith('D') ? 'deleted' : 'modified'}`}>
                                                {f.startsWith('??') ? 'NEW' : f.startsWith(' D') || f.startsWith('D') ? 'DEL' : 'MOD'}
                                            </span>
                                            <code>{f.substring(3).trim()}</code>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
                                <label className="form-label">Mensaje del commit (opcional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="deploy: update invitations"
                                    value={commitMessage}
                                    onChange={e => setCommitMessage(e.target.value)}
                                    disabled={deploying}
                                    onKeyDown={e => e.key === 'Enter' && !deploying && handleDeploy()}
                                />
                            </div>
                        </div>

                        <div className="deploy-dialog-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDeployDialog(false)} disabled={deploying}>Cancelar</button>
                            <button className="btn btn-deploy" onClick={handleDeploy} disabled={deploying}>
                                {deploying ? <><Loader2 size={14} className="animate-spin" /> Publicando…</> : <><Rocket size={14} /> Publicar</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="admin-main" style={{ marginLeft: 0 }}>
                {/* Top bar */}
                <div className="admin-topbar">
                    <div className="brand-inline">
                        <h1>Invita-Ya</h1>
                        <span>Panel de Administración</span>
                    </div>
                </div>

                {view === 'create' && <WizardForm onBack={goBack} showToast={showToast} />}
                {view === 'edit' && <EditConfig slug={editSlug} onBack={goBack} showToast={showToast} />}
                {view === 'quick-edit' && <QuickTextEditor slug={quickSlug} onBack={goBack} showToast={showToast} />}
                {view === 'list' && <>
                    <div className="admin-header">
                        <h2>Invitaciones</h2>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button onClick={() => { fetchPublicationHistory(); setShowHistoryDialog(true) }} className="btn btn-secondary">
                                <History size={15} /> Historial
                                {publicationHistory.length > 0 && <span className="history-count">{publicationHistory.length}</span>}
                            </button>
                            <button onClick={openDeployDialog} className={`btn btn-deploy-header ${deployStatus.hasChanges ? 'has-changes' : ''}`} disabled={!deployStatus.hasChanges}>
                                <Upload size={15} />
                                Publicar
                                {deployStatus.hasChanges && <span className="deploy-badge">{deployStatus.changeCount}</span>}
                            </button>
                            <button onClick={openCustomDialog} className="btn btn-secondary"><Palette size={15} /> Diseño personalizado</button>
                            <button onClick={() => setView('create')} className="btn btn-primary"><Plus size={15} /> Nueva invitación</button>
                        </div>
                    </div>
                    <div className="admin-content">
                        <QualityCenter
                            quality={quality}
                            onRun={runQualityCheck}
                            onSelect={(slug) => {
                                setSelectedSlug(slug)
                                document.querySelector('.inv-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }}
                        />
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Loader2 className="animate-spin" size={28} style={{ color: '#9aa0a6' }} /></div>
                        ) : invitations.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon"><FileText size={28} /></div>
                                <h3>No hay invitaciones</h3>
                                <p>Crea tu primera invitación para empezar</p>
                                <button onClick={() => setView('create')} className="btn btn-primary"><Plus size={15} /> Nueva invitación</button>
                            </div>
                        ) : (
                            <div className="inv-layout">
                                <div className="inv-list">
                                    <div className="inv-filters">
                                        <label className="inv-search">
                                            <Search size={15} />
                                            <input
                                                type="search"
                                                value={searchQuery}
                                                onChange={event => setSearchQuery(event.target.value)}
                                                placeholder="Buscar por nombre o enlace…"
                                                aria-label="Buscar invitaciones"
                                            />
                                        </label>
                                        <select value={eventFilter} onChange={event => setEventFilter(event.target.value)} aria-label="Filtrar por tipo de evento">
                                            <option value="all">Todos los eventos</option>
                                            {Object.entries(EVENT_LABELS).filter(([value]) => value !== 'cumple').map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                        <select value={rsvpFilter} onChange={event => setRsvpFilter(event.target.value)} aria-label="Filtrar por confirmación">
                                            <option value="all">Todos los RSVP</option>
                                            {Object.entries(RSVP_LABELS).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                        {hasFilters && (
                                            <button type="button" onClick={() => { setSearchQuery(''); setEventFilter('all'); setRsvpFilter('all') }}>
                                                Limpiar
                                            </button>
                                        )}
                                    </div>
                                    <section className="inv-group">
                                        <div className="inv-group-header">
                                            <div>
                                                <CalendarDays size={16} />
                                                <span>Próximas</span>
                                            </div>
                                            <span className="inv-group-count">{upcomingInvitations.length}</span>
                                        </div>
                                        {upcomingInvitations.length > 0 ? upcomingInvitations.map(inv => (
                                            <InvitationRow
                                                key={inv.slug}
                                                invitation={inv}
                                                selected={selectedSlug === inv.slug}
                                                isNext={inv.slug === nextInvitationSlug}
                                                onSelect={() => setSelectedSlug(selectedSlug === inv.slug ? null : inv.slug)}
                                            />
                                        )) : <p className="inv-group-empty">No hay invitaciones próximas.</p>}
                                    </section>

                                    {drafts.length > 0 && (
                                        <section className="inv-group inv-group-drafts">
                                            <div className="inv-group-header">
                                                <div>
                                                    <FileText size={16} />
                                                    <span>Borradores</span>
                                                </div>
                                                <span className="inv-group-count">{drafts.length}</span>
                                            </div>
                                            {drafts.map(inv => (
                                                <InvitationRow
                                                    key={inv.slug}
                                                    invitation={inv}
                                                    selected={selectedSlug === inv.slug}
                                                    onSelect={() => setSelectedSlug(selectedSlug === inv.slug ? null : inv.slug)}
                                                />
                                            ))}
                                        </section>
                                    )}

                                    {demoInvitations.length > 0 && (
                                        <section className="inv-group inv-group-demos">
                                            <button
                                                type="button"
                                                className="inv-group-header inv-group-toggle"
                                                aria-expanded={showDemos || hasFilters}
                                                onClick={() => setShowDemos(current => !current)}
                                            >
                                                <div>
                                                    <Sparkles size={16} />
                                                    <span>Plantillas y demos</span>
                                                </div>
                                                <span className="inv-group-count">{demoInvitations.length}</span>
                                                <ChevronDown className={showDemos || hasFilters ? 'is-open' : ''} size={16} />
                                            </button>
                                            {(showDemos || hasFilters) && demoInvitations.map(inv => (
                                                <InvitationRow
                                                    key={inv.slug}
                                                    invitation={inv}
                                                    selected={selectedSlug === inv.slug}
                                                    onSelect={() => setSelectedSlug(selectedSlug === inv.slug ? null : inv.slug)}
                                                />
                                            ))}
                                        </section>
                                    )}

                                    {expiredInvitations.length > 0 && (
                                        <section className="inv-group inv-group-expired">
                                            <button
                                                type="button"
                                                className="inv-group-header inv-group-toggle"
                                                aria-expanded={showExpired}
                                                onClick={() => {
                                                    if (showExpired && expiredInvitations.some(inv => inv.slug === selectedSlug)) setSelectedSlug(null)
                                                    setShowExpired(current => !current)
                                                }}
                                            >
                                                <div>
                                                    <Archive size={16} />
                                                    <span>Vencidas</span>
                                                </div>
                                                <span className="inv-group-count">{expiredInvitations.length}</span>
                                                <ChevronDown className={showExpired ? 'is-open' : ''} size={16} />
                                            </button>
                                            {showExpired && expiredInvitations.map(inv => (
                                                <InvitationRow
                                                    key={inv.slug}
                                                    invitation={inv}
                                                    selected={selectedSlug === inv.slug}
                                                    onSelect={() => setSelectedSlug(selectedSlug === inv.slug ? null : inv.slug)}
                                                />
                                            ))}
                                        </section>
                                    )}
                                    {filteredInvitations.length === 0 && (
                                        <div className="inv-no-results">
                                            <Search size={20} />
                                            <strong>Sin resultados</strong>
                                            <span>Prueba con otro nombre o cambia los filtros.</span>
                                        </div>
                                    )}
                                </div>
                                {selectedSlug && (() => {
                                    const inv = invitations.find(i => i.slug === selectedSlug)
                                    if (!inv) return null
                                    return (
                                        <div className="inv-detail">
                                            <h3 className="inv-detail-title">{inv.title}</h3>

                                            {/* Toggles */}
                                            {!inv.isDefault && !inv.isDraft && (
                                                <div className="inv-detail-toggle">
                                                    <div className="toggle-row" style={{ marginBottom: '10px' }}>
                                                        <label className="toggle">
                                                            <input type="checkbox" checked={inv.enabled} onChange={() => handleToggle(inv.slug, inv.enabled)} />
                                                            <span className="toggle-slider" />
                                                        </label>
                                                        <span className="toggle-label">{inv.enabled ? 'Activa — visible por link' : 'Inactiva — oculta por link'}</span>
                                                    </div>
                                                    <div className="toggle-row">
                                                        <label className="toggle">
                                                            <input type="checkbox" checked={!inv.excludeFromPortfolio} onChange={() => handlePortfolioToggle(inv.slug, inv.excludeFromPortfolio)} />
                                                            <span className="toggle-slider" />
                                                        </label>
                                                        <span className="toggle-label">{!inv.excludeFromPortfolio ? 'Mostrar en el landing' : 'Ocultar en el landing'}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="inv-detail-actions">
                                                {inv.isDraft && <div className="draft-note">Este borrador todavía no tiene enlace público. Puedes revisarlo localmente sin enviarlo a producción.</div>}
                                                {inv.isDraft && <a href={`/admin/drafts/${inv.slug}`} target="_blank" rel="noreferrer" className="btn btn-action-full"><Eye size={14} /> Vista previa local</a>}
                                                {inv.isDraft && <button onClick={() => openActivationDialog(inv.slug)} className="btn btn-action-full" disabled={actionLoading === `activation-plan:${inv.slug}`}>
                                                    {actionLoading === `activation-plan:${inv.slug}` ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />} Preparar activación
                                                </button>}
                                                {!inv.isDraft && <button onClick={() => copyLink(inv.slug)} className="btn btn-action-full"><Copy size={14} /> Copiar enlace</button>}
                                                {!inv.isDraft && <a href={`/i/${inv.slug}`} target="_blank" rel="noreferrer" className="btn btn-action-full"><Eye size={14} /> Vista previa</a>}
                                                {!inv.isDraft && <button onClick={() => openCloneDialog(inv)} className="btn btn-action-full"><Copy size={14} /> Clonar</button>}
                                                {!inv.isDraft && !inv.isDefault && <button onClick={() => openRenameDialog(inv)} className="btn btn-action-full"><ExternalLink size={14} /> Cambiar link</button>}
                                                {!inv.isDraft && <button onClick={() => showValidationReport(inv.slug)} className="btn btn-action-full" disabled={actionLoading === `validate:${inv.slug}`}>
                                                    {actionLoading === `validate:${inv.slug}` ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Validar
                                                </button>}
                                                {!inv.isDraft && <button onClick={() => showAssetReport(inv.slug)} className="btn btn-action-full" disabled={actionLoading === `assets:${inv.slug}`}>
                                                    {actionLoading === `assets:${inv.slug}` ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Assets
                                                </button>}
                                                {inv.hasConfig && <button onClick={() => { setQuickSlug(inv.slug); setView('quick-edit') }} className="btn btn-action-full"><FileText size={14} /> Editor rapido</button>}
                                                {inv.hasConfig && <button onClick={() => { setEditSlug(inv.slug); setView('edit') }} className="btn btn-action-full"><Settings size={14} /> Configuración</button>}
                                                {inv.rsvpMode === 'supabase' && <a href={`/i/${inv.slug}/rsvp`} target="_blank" rel="noreferrer" className="btn btn-action-full"><ExternalLink size={14} /> RSVP Dashboard</a>}
                                                {inv.rsvpKey && <button onClick={() => copyRsvpLink(inv.slug, inv.rsvpKey)} className="btn btn-action-full"><Copy size={14} /> Copiar enlace RSVP</button>}
                                                {!inv.isDefault && inv.slug !== 'melani-marisol' && <button onClick={() => handleDelete(inv.slug)} className="btn btn-action-full btn-danger"><Trash2 size={14} /> {inv.isDraft ? 'Eliminar borrador' : 'Eliminar'}</button>}
                                            </div>
                                            {inv.rsvpKey && (
                                                <div className="inv-detail-key">
                                                    <span className="inv-detail-key-label">Clave RSVP</span>
                                                    <code className="inv-detail-key-value">{inv.rsvpKey}</code>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })()}
                            </div>
                        )}
                    </div>
                </>}
            </main>
        </div>
    )
}

function QualityCenter({ quality, onRun, onSelect }) {
    const summary = quality.summary
    const isRunning = quality.status === 'running'
    const isReady = quality.status === 'ready'
    const isStale = quality.status === 'stale'
    const hasResult = Boolean(summary)
    const cards = hasResult ? [
        {
            label: 'Configuraciones',
            value: summary.schemaPassed ? `${summary.configInvitations} correctas` : 'Revisar',
            good: summary.schemaPassed,
        },
        {
            label: 'Datos conectados',
            value: summary.consistencyErrors
                ? `${summary.consistencyErrors} errores`
                : `${summary.consistencyWarnings} avisos`,
            good: summary.consistencyErrors === 0,
            warning: summary.consistencyErrors === 0 && summary.consistencyWarnings > 0,
        },
        {
            label: 'Producción protegida',
            value: summary.productionBoundaryClean ? 'Administrador excluido' : 'Revisar',
            good: summary.productionBoundaryClean,
        },
        {
            label: 'Pruebas visuales',
            value: summary.browserTestsPassed ? `${summary.browserTestsPassed} aprobadas` : 'Revisar',
            good: summary.browserTestsPassed > 0,
        },
    ] : []

    return (
        <section className={`quality-center ${isReady ? 'quality-ready' : quality.status === 'failed' ? 'quality-failed' : isStale ? 'quality-stale' : ''}`}>
            <div className="quality-header">
                <div>
                    <span className="quality-kicker">Centro de calidad</span>
                    <h3>{isReady ? 'Proyecto listo para publicar' : isStale ? 'Hay cambios después de la última revisión' : quality.status === 'failed' ? 'Hay puntos por revisar' : 'Revisa todo con un clic'}</h3>
                    <p>
                        {isRunning
                            ? 'Estamos validando configuraciones, producción y todas las invitaciones.'
                            : isReady
                                ? 'Las comprobaciones importantes terminaron correctamente.'
                                : isStale
                                    ? 'Vuelve a revisar antes de publicar para comprobar el estado actual.'
                                    : 'No necesitas abrir la terminal. Esta revisión no publica ni modifica invitaciones.'}
                    </p>
                </div>
                <button className="btn btn-primary quality-run" onClick={onRun} disabled={isRunning}>
                    {isRunning ? <><Loader2 size={15} className="animate-spin" /> Revisando…</> : <><Check size={15} /> Revisar proyecto</>}
                </button>
            </div>

            {hasResult && (
                <div className="quality-grid">
                    {cards.map((card) => (
                        <div key={card.label} className={`quality-item ${card.good ? 'good' : 'bad'} ${card.warning ? 'warning' : ''}`}>
                            <span className="quality-item-icon">{card.good ? <Check size={15} /> : <AlertTriangle size={15} />}</span>
                            <div>
                                <span>{card.label}</span>
                                <strong>{card.value}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {quality.issues?.length > 0 && (
                <div className="quality-issues">
                    <div className="quality-issues-title">
                        <strong>Avisos para revisar</strong>
                        <span>No bloquean la publicación, pero conviene confirmarlos.</span>
                    </div>
                    {quality.issues.map((issue, index) => (
                        <div className="quality-issue" key={`${issue.slug}-${issue.type}-${index}`}>
                            <AlertTriangle size={15} />
                            <div>
                                <strong>{issue.slug}</strong>
                                <span>{issue.message}</span>
                            </div>
                            {issue.type !== 'open-graph' && (
                                <button className="btn btn-secondary" onClick={() => onSelect(issue.slug)}>Ver invitación</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {quality.status === 'failed' && (
                <div className="quality-details">
                    <strong>{quality.error || 'La revisión no pudo completarse.'}</strong>
                    {quality.details?.slice(0, 6).map((detail, index) => <span key={index}>{detail}</span>)}
                </div>
            )}
        </section>
    )
}

function ReportList({ report }) {
    const errors = report?.errors || []
    const warnings = report?.warnings || []
    const tips = report?.tips || []
    return (
        <div className="report-body">
            <div className={`report-status ${errors.length ? 'bad' : warnings.length ? 'warn' : 'good'}`}>
                {errors.length ? `${errors.length} error(es)` : warnings.length ? `${warnings.length} aviso(s)` : 'Lista para revisar build'}
            </div>
            {errors.length > 0 && <ReportSection title="Errores" items={errors} kind="error" />}
            {warnings.length > 0 && <ReportSection title="Avisos" items={warnings} kind="warning" />}
            {tips.length > 0 && <ReportSection title="Tips" items={tips} kind="tip" />}
        </div>
    )
}

function ReportSection({ title, items, kind }) {
    return (
        <div className="report-section">
            <h4>{title}</h4>
            <ul>
                {items.map((item, index) => <li key={`${kind}-${index}`}>{item}</li>)}
            </ul>
        </div>
    )
}

function AssetReport({ report }) {
    const files = report?.files || []
    const largeImages = report?.largeImages || []
    const largeAudio = report?.largeAudio || []
    return (
        <div className="report-body">
            <div className="asset-summary">
                <div><span>Total</span><strong>{report?.totalKb || 0} KB</strong></div>
                <div><span>Imagenes grandes</span><strong>{largeImages.length}</strong></div>
                <div><span>Audios grandes</span><strong>{largeAudio.length}</strong></div>
            </div>
            {(largeImages.length > 0 || largeAudio.length > 0) && (
                <ReportSection
                    title="Conviene optimizar"
                    kind="warning"
                    items={[...largeImages, ...largeAudio].map(file => `${file.path} (${file.kb} KB)`)}
                />
            )}
            <div className="report-section">
                <h4>Archivos mas pesados</h4>
                <ul>
                    {files.slice(0, 12).map((file) => <li key={file.path}>{file.path} ({file.kb} KB)</li>)}
                    {files.length === 0 && <li>No se encontraron assets multimedia.</li>}
                </ul>
            </div>
        </div>
    )
}

function QuickTextEditor({ slug, onBack, showToast }) {
    const [config, setConfig] = useState(null)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState(null)

    useEffect(() => {
        fetch(`${API}/${slug}`).then(r => r.json()).then(json => {
            if (!json.ok) return
            const cfg = json.config
            setConfig(cfg)
            setForm(configToQuickForm(cfg))
        })
    }, [slug])

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
    const updateEvent = (index, key, value) => setForm(prev => ({
        ...prev,
        events: prev.events.map((event, i) => i === index ? { ...event, [key]: value } : event),
    }))
    const updatePadrinoGroup = (index, key, value) => setForm(prev => ({
        ...prev,
        padrinoGroups: prev.padrinoGroups.map((group, i) => i === index ? { ...group, [key]: value } : group),
    }))

    const handleSave = async () => {
        setSaving(true)
        try {
            const nextConfig = quickFormToConfig(config, form)
            const res = await fetch(`${API}/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config: nextConfig }),
            })
            const json = await res.json()
            if (json.ok) {
                showToast('Editor rapido guardado con backup')
                onBack()
            } else {
                showToast(json.error, 'error')
            }
        } catch (err) {
            showToast(err.message, 'error')
        }
        setSaving(false)
    }

    if (!config || !form) {
        return (
            <div className="admin-content">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Loader2 className="animate-spin" size={28} style={{ color: '#9aa0a6' }} /></div>
            </div>
        )
    }

    return (
        <>
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={onBack} className="btn-icon"><ChevronLeft size={18} /></button>
                    <h2>Editor rapido - <span style={{ color: '#1a73e8' }}>{slug}</span></h2>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`/i/${slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary"><Eye size={14} /> Vista previa</a>
                    <button onClick={onBack} className="btn btn-secondary">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Guardar
                    </button>
                </div>
            </div>
            <div className="admin-content quick-editor">
                <div className="quick-grid">
                    <section className="card">
                        <div className="card-header"><h3>Portada y fecha</h3></div>
                        <div className="card-body">
                            <TextInput label="Titulo interno" value={form.title} onChange={v => update('title', v)} />
                            <TextInput label="Subtitulo portada" value={form.heroSubtitle} onChange={v => update('heroSubtitle', v)} />
                            <TextInput label="Nombre principal" value={form.heroName} onChange={v => update('heroName', v)} />
                            <div className="form-row">
                                <TextInput type="date" label="Fecha del evento" value={form.eventDate} onChange={v => update('eventDate', v)} />
                                <TextInput type="time" label="Hora principal" value={form.eventTime} onChange={v => update('eventTime', v)} />
                            </div>
                            <TextInput type="number" label="Duracion calendario (horas)" value={form.durationHours} onChange={v => update('durationHours', v)} min="1" max="24" />
                            <CheckboxInput label="Sincronizar footer con la fecha" checked={form.syncFooterDate} onChange={v => update('syncFooterDate', v)} />
                        </div>
                    </section>

                    <section className="card">
                        <div className="card-header"><h3>Introduccion</h3></div>
                        <div className="card-body">
                            <TextArea label="Mensaje" value={form.introMessage} onChange={v => update('introMessage', v)} />
                            <TextInput label="Etiqueta familia" value={form.introLabel} onChange={v => update('introLabel', v)} />
                            <TextInput label="Nombre 1" value={form.parent1} onChange={v => update('parent1', v)} />
                            <TextInput label="Nombre 2" value={form.parent2} onChange={v => update('parent2', v)} />
                            <TextArea label="Mensaje final" value={form.closingMessage} onChange={v => update('closingMessage', v)} />
                        </div>
                    </section>

                    <section className="card">
                        <div className="card-header"><h3>Padrinos</h3></div>
                        <div className="card-body">
                            <TextInput label="Titulo seccion" value={form.padrinosLabel} onChange={v => update('padrinosLabel', v)} />
                            <TextInput label="Subtitulo" value={form.padrinosSubtitle} onChange={v => update('padrinosSubtitle', v)} />
                            {form.padrinoGroups.length > 0 ? form.padrinoGroups.map((group, index) => (
                                <div className="quick-subcard" key={index}>
                                    <TextInput label={`Grupo ${index + 1}`} value={group.label} onChange={v => updatePadrinoGroup(index, 'label', v)} />
                                    <TextInput label="Nombre 1" value={group.padrino1} onChange={v => updatePadrinoGroup(index, 'padrino1', v)} />
                                    <TextInput label="Nombre 2" value={group.padrino2} onChange={v => updatePadrinoGroup(index, 'padrino2', v)} />
                                </div>
                            )) : (
                                <div className="quick-subcard">
                                    <TextInput label="Padrino" value={form.padrino1} onChange={v => update('padrino1', v)} />
                                    <TextInput label="Madrina" value={form.padrino2} onChange={v => update('padrino2', v)} />
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="card">
                        <div className="card-header"><h3>Eventos y lugares</h3></div>
                        <div className="card-body">
                            {form.events.map((event, index) => (
                                <div className="quick-subcard" key={index}>
                                    <TextInput label={`Evento ${index + 1} - titulo`} value={event.title} onChange={v => updateEvent(index, 'title', v)} />
                                    <TextInput label="Lugar" value={event.location} onChange={v => updateEvent(index, 'location', v)} />
                                    <TextArea label="Direccion" value={event.address} onChange={v => updateEvent(index, 'address', v)} />
                                    <div className="form-row">
                                        <TextInput type="time" label="Hora" value={event.time} onChange={v => updateEvent(index, 'time', v)} />
                                        <TextInput label="Link mapa" value={event.mapLink} onChange={v => updateEvent(index, 'mapLink', v)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card">
                        <div className="card-header"><h3>RSVP y footer</h3></div>
                        <div className="card-body">
                            <TextInput label="WhatsApp" value={form.whatsappNumber} onChange={v => update('whatsappNumber', onlyDigits(v))} />
                            <TextArea label="Mensaje confirmacion WhatsApp" value={form.whatsappConfirmMessage} onChange={v => update('whatsappConfirmMessage', v)} />
                            <TextArea label="Mensaje declinar WhatsApp" value={form.whatsappDeclineMessage} onChange={v => update('whatsappDeclineMessage', v)} />
                            <TextInput label="Texto limite RSVP" value={form.rsvpDeadline} onChange={v => update('rsvpDeadline', v)} />
                            <TextInput label="Footer nombre" value={form.footerName} onChange={v => update('footerName', v)} />
                            <TextInput label="Footer subtitulo" value={form.footerSubtitle} onChange={v => update('footerSubtitle', v)} disabled={form.syncFooterDate} />
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

function TextInput({ label, value, onChange, type = 'text', ...props }) {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} className="form-input" {...props} />
        </div>
    )
}

function TextArea({ label, value, onChange }) {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={3} className="form-input" />
        </div>
    )
}

function CheckboxInput({ label, checked, onChange }) {
    return (
        <div className="toggle-row">
            <label className="toggle">
                <input type="checkbox" checked={Boolean(checked)} onChange={e => onChange(e.target.checked)} />
                <span className="toggle-slider" />
            </label>
            <span className="toggle-label">{label}</span>
        </div>
    )
}

function configToQuickForm(config) {
    const eventDateTime = splitDateTime(config.countdown?.targetDate || config.calendar?.outlookStart)
    const durationHours = getDurationHours(config.calendar)
    const events = Array.isArray(config.events) ? config.events.map(event => ({
        title: event.title || '',
        location: event.location || '',
        address: event.address || '',
        time: event.time || '',
        mapLink: event.mapLink || '',
    })) : []
    const groups = Array.isArray(config.padrinos?.groups) ? config.padrinos.groups.map(group => ({
        label: group.label || '',
        padrino1: group.padrino1 || '',
        padrino2: group.padrino2 || '',
    })) : []

    return {
        title: config.title || '',
        heroSubtitle: config.hero?.subtitle || '',
        heroName: config.hero?.name || '',
        eventDate: eventDateTime.date,
        eventTime: eventDateTime.time,
        durationHours,
        syncFooterDate: true,
        introMessage: config.intro?.message || '',
        introLabel: config.intro?.label || '',
        parent1: config.intro?.parent1 || '',
        parent2: config.intro?.parent2 || '',
        closingMessage: config.intro?.closingMessage || '',
        padrinosLabel: config.padrinos?.label || '',
        padrinosSubtitle: config.padrinos?.subtitle || '',
        padrino1: config.padrinos?.padrino1 || '',
        padrino2: config.padrinos?.padrino2 || '',
        padrinoGroups: groups,
        events,
        whatsappNumber: config.rsvp?.whatsappNumber || '',
        whatsappConfirmMessage: config.rsvp?.whatsappConfirmMessage || '',
        whatsappDeclineMessage: config.rsvp?.whatsappDeclineMessage || '',
        rsvpDeadline: config.rsvp?.deadline || '',
        footerName: config.footer?.name || '',
        footerSubtitle: config.footer?.subtitle || '',
    }
}

function quickFormToConfig(config, form) {
    const next = JSON.parse(JSON.stringify(config))
    const start = buildLocalDate(form.eventDate, form.eventTime)
    const duration = Math.max(1, Number(form.durationHours) || 7)
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000)
    const displayDate = start.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
    const displayYear = String(start.getFullYear())
    const heroDate = start.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

    next.title = form.title
    next.hero = {
        ...(next.hero || {}),
        subtitle: form.heroSubtitle,
        name: form.heroName,
        date: heroDate,
    }
    next.countdown = {
        ...(next.countdown || {}),
        targetDate: `${form.eventDate}T${form.eventTime}:00`,
        displayDate,
        displayYear,
    }
    next.calendar = {
        ...(next.calendar || {}),
        title: form.title,
        location: buildCalendarLocation(form.events),
        startDateTime: formatCalendarDate(start),
        endDateTime: formatCalendarDate(end),
        outlookStart: formatOutlookDate(start),
        outlookEnd: formatOutlookDate(end),
        icsFilename: next.calendar?.icsFilename || `${next.slug}.ics`,
        icsProdId: form.title,
    }
    next.intro = {
        ...(next.intro || {}),
        message: form.introMessage,
        label: form.introLabel,
        parent1: form.parent1,
        parent2: form.parent2,
        closingMessage: form.closingMessage,
    }
    next.padrinos = {
        ...(next.padrinos || {}),
        label: form.padrinosLabel,
        subtitle: form.padrinosSubtitle,
        padrino1: form.padrino1,
        padrino2: form.padrino2,
    }
    if (form.padrinoGroups.length > 0) {
        next.padrinos.groups = form.padrinoGroups.map(group => ({
            label: group.label,
            padrino1: group.padrino1,
            ...(group.padrino2 ? { padrino2: group.padrino2 } : {}),
        }))
    }
    next.events = form.events.map((event, index) => ({
        ...(next.events?.[index] || {}),
        title: event.title,
        location: event.location,
        address: event.address,
        time: event.time,
        mapLink: event.mapLink,
    }))
    next.rsvp = {
        ...(next.rsvp || {}),
        whatsappNumber: form.whatsappNumber,
        whatsappConfirmMessage: form.whatsappConfirmMessage,
        whatsappDeclineMessage: form.whatsappDeclineMessage,
        deadline: form.rsvpDeadline,
    }
    next.footer = {
        ...(next.footer || {}),
        name: form.footerName || form.heroName,
        subtitle: form.syncFooterDate ? `${eventTypeLabel(next.eventType)} - ${displayDate}` : form.footerSubtitle,
    }
    return next
}

function splitDateTime(value) {
    const fallback = new Date()
    if (!value || Number.isNaN(Date.parse(value))) {
        return { date: toDateInput(fallback), time: '19:00' }
    }
    const match = String(value).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/)
    if (match) return { date: match[1], time: match[2] }
    const date = new Date(value)
    return { date: toDateInput(date), time: toTimeInput(date) }
}

function getDurationHours(calendar) {
    if (!calendar?.outlookStart || !calendar?.outlookEnd) return 7
    const start = Date.parse(calendar.outlookStart)
    const end = Date.parse(calendar.outlookEnd)
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 7
    return Math.max(1, Math.round((end - start) / (60 * 60 * 1000)))
}

function buildLocalDate(date, time) {
    return new Date(`${date || toDateInput(new Date())}T${time || '19:00'}:00`)
}

function formatCalendarDate(date) {
    return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}T${pad2(date.getHours())}${pad2(date.getMinutes())}00`
}

function formatOutlookDate(date) {
    return `${toDateInput(date)}T${toTimeInput(date)}:00`
}

function toDateInput(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function toTimeInput(date) {
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

function buildCalendarLocation(events) {
    const event = events[1] || events[0]
    if (!event) return ''
    return [event.location, event.address].filter(Boolean).join(', ')
}

function eventTypeLabel(type) {
    return EVENT_LABELS[type] || { 'primera-comunion': 'Primera Comunion', despedida: 'Celebracion', otro: 'Celebracion' }[type] || 'Celebracion'
}

function onlyDigits(value) {
    return String(value || '').replace(/\D/g, '')
}

function pad2(value) {
    return String(value).padStart(2, '0')
}

function EditConfig({ slug, onBack, showToast }) {
    const [config, setConfig] = useState(null)
    const [saving, setSaving] = useState(false)
    const [raw, setRaw] = useState('')

    useEffect(() => {
        fetch(`${API}/${slug}`).then(r => r.json()).then(json => {
            if (json.ok) { setConfig(json.config); setRaw(JSON.stringify(json.config, null, 4)) }
        })
    }, [slug])

    const handleSave = async () => {
        setSaving(true)
        try {
            const parsed = JSON.parse(raw)
            const res = await fetch(`${API}/${slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config: parsed }) })
            const json = await res.json()
            if (json.ok) { showToast('Configuración guardada'); onBack() }
            else showToast(json.error, 'error')
        } catch (err) { showToast('JSON inválido: ' + err.message, 'error') }
        setSaving(false)
    }

    return (
        <>
            <div className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={onBack} className="btn-icon"><ChevronLeft size={18} /></button>
                    <h2>Configuración — <span style={{ color: '#1a73e8' }}>{slug}</span></h2>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={onBack} className="btn btn-secondary">Cancelar</button>
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Guardar cambios
                    </button>
                </div>
            </div>
            <div className="admin-content">
                {!config ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Loader2 className="animate-spin" size={28} style={{ color: '#9aa0a6' }} /></div>
                ) : (
                    <textarea value={raw} onChange={e => setRaw(e.target.value)} className="config-editor" spellCheck={false} />
                )}
            </div>
        </>
    )
}
