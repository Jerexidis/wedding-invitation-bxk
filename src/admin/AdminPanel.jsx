import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, ExternalLink, Copy, Settings, Eye, ChevronLeft, Check, Loader2, FileText, MoreVertical, Upload, CloudOff, EyeOff, Rocket, X, AlertTriangle } from 'lucide-react'
import WizardForm from './WizardForm'
import './AdminPanel.css'

const API = '/api/invitations'
const EVENT_LABELS = { xv: 'XV Años', boda: 'Boda', bautizo: 'Bautizo', cumple: 'Cumpleaños' }
const RSVP_LABELS = { whatsapp: 'WhatsApp', supabase: 'Dashboard', none: 'Sin RSVP' }

export default function AdminPanel() {
    const [invitations, setInvitations] = useState([])
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState('list')
    const [editSlug, setEditSlug] = useState(null)
    const [toast, setToast] = useState(null)
    const [selectedSlug, setSelectedSlug] = useState(null)

    // Deploy state
    const [deployStatus, setDeployStatus] = useState({ hasChanges: false, changeCount: 0, files: [] })
    const [deploying, setDeploying] = useState(false)
    const [showDeployDialog, setShowDeployDialog] = useState(false)
    const [commitMessage, setCommitMessage] = useState('')

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
            if (json.ok) setDeployStatus({ hasChanges: json.hasChanges, changeCount: json.changeCount, files: json.files || [] })
        } catch (err) { console.error('Deploy status check failed:', err) }
    }, [])

    useEffect(() => { fetchInvitations() }, [fetchInvitations])
    useEffect(() => { fetchDeployStatus() }, [fetchDeployStatus])

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
                } else {
                    showToast(json.message || 'No hay cambios para publicar')
                }
                setShowDeployDialog(false)
                setCommitMessage('')
                fetchDeployStatus()
            } else {
                showToast(json.error || 'Error al publicar', 'error')
            }
        } catch (err) { showToast('Error de conexión: ' + err.message, 'error') }
        setDeploying(false)
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

    return (
        <div className="admin admin-no-sidebar">
            {toast && <div className={`admin-toast ${toast.type}`}>{toast.type !== 'error' && <Check size={14} />}{toast.msg}</div>}

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
                {view === 'list' && <>
                    <div className="admin-header">
                        <h2>Invitaciones</h2>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button onClick={() => setShowDeployDialog(true)} className={`btn btn-deploy-header ${deployStatus.hasChanges ? 'has-changes' : ''}`} disabled={!deployStatus.hasChanges}>
                                <Upload size={15} />
                                Publicar
                                {deployStatus.hasChanges && <span className="deploy-badge">{deployStatus.changeCount}</span>}
                            </button>
                            <button onClick={() => setView('create')} className="btn btn-primary"><Plus size={15} /> Nueva invitación</button>
                        </div>
                    </div>
                    <div className="admin-content">
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
                                    {invitations.map(inv => (
                                        <div key={inv.slug} className={`inv-row ${selectedSlug === inv.slug ? 'inv-row-selected' : ''}`} onClick={() => setSelectedSlug(selectedSlug === inv.slug ? null : inv.slug)}>
                                            <span className={`status-dot ${inv.enabled ? 'status-active' : 'status-draft'}`} />
                                            <div className="inv-row-info">
                                                <span className="inv-row-name">{inv.title}</span>
                                                <div className="inv-row-meta">
                                                    {inv.isDefault && <span className="badge badge-blue">Landing</span>}
                                                    {!inv.enabled && <span className="badge badge-gray">Inactiva</span>}
                                                    {inv.eventType && <span className={`badge ${inv.eventType === 'xv' ? 'badge-purple' : inv.eventType === 'boda' ? 'badge-orange' : 'badge-gray'}`}>{EVENT_LABELS[inv.eventType] || inv.eventType}</span>}
                                                    {inv.rsvpMode && <span className={`badge ${inv.rsvpMode === 'whatsapp' ? 'badge-green' : inv.rsvpMode === 'supabase' ? 'badge-orange' : 'badge-gray'}`}>{RSVP_LABELS[inv.rsvpMode] || inv.rsvpMode}</span>}
                                                    {inv.eventDate && new Date(inv.eventDate) < new Date() && <span className="badge badge-red">Vencida</span>}
                                                    <code className="inv-card-url">/i/{inv.slug}</code>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {selectedSlug && (() => {
                                    const inv = invitations.find(i => i.slug === selectedSlug)
                                    if (!inv) return null
                                    return (
                                        <div className="inv-detail">
                                            <h3 className="inv-detail-title">{inv.title}</h3>

                                            {/* Toggle visibility */}
                                            {!inv.isDefault && (
                                                <div className="inv-detail-toggle">
                                                    <div className="toggle-row">
                                                        <label className="toggle">
                                                            <input type="checkbox" checked={inv.enabled} onChange={() => handleToggle(inv.slug, inv.enabled)} />
                                                            <span className="toggle-slider" />
                                                        </label>
                                                        <span className="toggle-label">{inv.enabled ? 'Activa — visible' : 'Inactiva — oculta'}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="inv-detail-actions">
                                                <button onClick={() => copyLink(inv.slug)} className="btn btn-action-full"><Copy size={14} /> Copiar enlace</button>
                                                <a href={`/i/${inv.slug}`} target="_blank" className="btn btn-action-full"><Eye size={14} /> Vista previa</a>
                                                {inv.hasConfig && <button onClick={() => { setEditSlug(inv.slug); setView('edit') }} className="btn btn-action-full"><Settings size={14} /> Configuración</button>}
                                                {inv.rsvpMode === 'supabase' && <a href={`/i/${inv.slug}/rsvp`} target="_blank" className="btn btn-action-full"><ExternalLink size={14} /> RSVP Dashboard</a>}
                                                {inv.rsvpKey && <button onClick={() => copyRsvpLink(inv.slug, inv.rsvpKey)} className="btn btn-action-full"><Copy size={14} /> Copiar enlace RSVP</button>}
                                                {!inv.isDefault && inv.slug !== 'melani-marisol' && <button onClick={() => handleDelete(inv.slug)} className="btn btn-action-full btn-danger"><Trash2 size={14} /> Eliminar</button>}
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
