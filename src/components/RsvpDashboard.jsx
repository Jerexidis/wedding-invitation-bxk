import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getConfirmations, removeConfirmation } from '../utils/rsvpStore'

const RsvpDashboard = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [confirmations, setConfirmations] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // ─── Auth State ───
    const [authorized, setAuthorized] = useState(false)
    const [authChecking, setAuthChecking] = useState(true)
    const [passwordInput, setPasswordInput] = useState('')
    const [authError, setAuthError] = useState('')
    const [storedKey, setStoredKey] = useState(null)

    // Check authorization on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`/invitations/${slug}/rsvp-access.json`)
                if (!res.ok) {
                    // No access file = no protection (backwards compatible)
                    setAuthorized(true)
                    setAuthChecking(false)
                    return
                }
                const data = await res.json()
                const correctKey = data.key

                // Check URL param first
                const urlKey = searchParams.get('key')
                if (urlKey && urlKey === correctKey) {
                    localStorage.setItem(`rsvp_auth_${slug}`, correctKey)
                    setAuthorized(true)
                    setAuthChecking(false)
                    return
                }

                // Check localStorage
                const savedKey = localStorage.getItem(`rsvp_auth_${slug}`)
                if (savedKey && savedKey === correctKey) {
                    setAuthorized(true)
                    setAuthChecking(false)
                    return
                }

                setStoredKey(correctKey)
                setAuthChecking(false)
            } catch {
                // If fetch fails, allow access (backwards compatible)
                setAuthorized(true)
                setAuthChecking(false)
            }
        }
        checkAuth()
    }, [slug, searchParams])

    const handlePasswordSubmit = (e) => {
        e.preventDefault()
        if (passwordInput === storedKey) {
            localStorage.setItem(`rsvp_auth_${slug}`, storedKey)
            setAuthorized(true)
            setAuthError('')
        } else {
            setAuthError('Clave incorrecta. Intenta de nuevo.')
            setPasswordInput('')
        }
    }

    const fetchData = async () => {
        try {
            const data = await getConfirmations(slug)
            setConfirmations(data)
        } catch (err) {
            console.error('Error fetching confirmations:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authorized) return
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [slug, authorized])

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta confirmación?')) return
        setDeleting(id)
        try {
            await removeConfirmation(id)
            setConfirmations(prev => prev.filter(c => c.id !== id))
        } catch (err) {
            console.error('Error deleting:', err)
        } finally {
            setDeleting(null)
        }
    }

    const totalGuests = confirmations.reduce((sum, c) => sum + (c.guests || 1), 0)

    const filtered = confirmations.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString('es-MX', {
            day: 'numeric', month: 'long', year: 'numeric',
        })
    }

    const formatTime = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleTimeString('es-MX', {
            hour: '2-digit', minute: '2-digit',
        })
    }

    const timeAgo = (dateStr) => {
        if (!dateStr) return ''
        const d = new Date(dateStr)
        const diffMs = new Date() - d
        if (diffMs < 0) return 'hace un momento'
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
        if (diffHrs < 1) return 'hace un momento'
        if (diffHrs < 24) return `hace ${diffHrs} hora${diffHrs > 1 ? 's' : ''}`
        const diffDays = Math.floor(diffHrs / 24)
        return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
    }

    const isNew = (dateStr) => {
        if (!dateStr) return false
        const d = new Date(dateStr)
        const diffMs = new Date() - d
        return diffMs >= 0 && diffMs < 24 * 60 * 60 * 1000
    }

    const getDuplicateNames = () => {
        const names = confirmations.map(c => c.name?.toLowerCase().trim()).filter(Boolean)
        const duplicates = names.filter((item, index) => names.indexOf(item) !== index)
        return [...new Set(duplicates)]
    }

    const getInitials = (name) => {
        if (!name) return '?'
        const parts = name.trim().split(' ')
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
        return name.charAt(0).toUpperCase()
    }

    const avatarColors = [
        '#1a73e8', '#e8710a', '#0d652d', '#a142f4',
        '#d93025', '#1e8e3e', '#185abc', '#b31412',
    ]
    const getAvatarColor = (name) => {
        let hash = 0
        for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
        return avatarColors[Math.abs(hash) % avatarColors.length]
    }

    const exportCSV = () => {
        const headers = 'Nombre,Personas,Mensaje,Fecha\n'
        const rows = confirmations.map(c => {
            const name = (c.name || '').replace(/,/g, ' ')
            const msg = (c.message || '').replace(/,/g, ' ').replace(/\n/g, ' ')
            const date = formatDate(c.created_at) + ' ' + formatTime(c.created_at)
            return `${name},${c.guests},${msg},${date}`
        }).join('\n')
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `confirmaciones-${slug}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    // ─── AUTH CHECKING SCREEN ───
    if (authChecking) {
        return (
            <>
                <style>{cssStyles}</style>
                <div className="rsvp-app">
                    <div className="rsvp-auth-screen">
                        <div className="rsvp-loader"></div>
                        <p style={{ color: '#5f6368', marginTop: '16px' }}>Verificando acceso...</p>
                    </div>
                </div>
            </>
        )
    }

    // ─── PASSWORD PROMPT SCREEN ───
    if (!authorized) {
        return (
            <>
                <style>{cssStyles}</style>
                <div className="rsvp-app">
                    <div className="rsvp-auth-screen">
                        <div className="rsvp-auth-card">
                            <div className="rsvp-auth-logo">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                                </svg>
                            </div>
                            <h2 className="rsvp-auth-title">Acceso restringido</h2>
                            <p className="rsvp-auth-desc">
                                Ingresa la clave de acceso para ver las confirmaciones de esta invitación.
                            </p>
                            <form onSubmit={handlePasswordSubmit} className="rsvp-auth-form">
                                <input
                                    type="text"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Clave de acceso"
                                    className="rsvp-auth-input"
                                    autoFocus
                                    autoComplete="off"
                                />
                                {authError && <p className="rsvp-auth-error">{authError}</p>}
                                <button type="submit" className="rsvp-auth-btn">
                                    Acceder
                                </button>
                            </form>
                            <p className="rsvp-auth-hint">
                                La clave fue proporcionada al crear tu invitación.
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // ─── MAIN DASHBOARD (authorized) ───
    return (
        <>
            <style>{cssStyles}</style>
            <div className="rsvp-app">
                {/* ─── Top Bar ─── */}
                <header className="rsvp-topbar">
                    <div className="rsvp-topbar-inner">
                        <div className="rsvp-topbar-left">
                            <div className="rsvp-logo-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v-2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                                </svg>
                            </div>
                            <div>
                                <h1 className="rsvp-topbar-title">Confirmaciones</h1>
                                <p className="rsvp-topbar-slug">/{slug}</p>
                            </div>
                        </div>
                        <div className="rsvp-topbar-actions">
                            <button onClick={fetchData} className="rsvp-btn-icon" title="Actualizar">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                                </svg>
                            </button>
                            {confirmations.length > 0 && (
                                <button onClick={exportCSV} className="rsvp-btn-secondary" title="Exportar CSV">
                                    <span className="rsvp-btn-text">📥 Exportar</span>
                                    <span className="rsvp-btn-icon-only">📥</span>
                                </button>
                            )}
                            <button onClick={() => navigate(`/i/${slug}`)} className="rsvp-btn-secondary" title="Ver invitación">
                                <span className="rsvp-btn-text">Ver invitación</span>
                                <span className="rsvp-btn-icon-only">💌</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="rsvp-body">
                    {/* ─── Stats Cards ─── */}
                    <div className="rsvp-stats-grid">
                        <div className="rsvp-stat-card">
                            <div className="rsvp-stat-icon" style={{ background: '#e8f0fe', color: '#1a73e8' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                                </svg>
                            </div>
                            <div className="rsvp-stat-info">
                                <span className="rsvp-stat-number">{confirmations.length}</span>
                                <span className="rsvp-stat-label">Confirmaciones</span>
                                {confirmations.length > 0 && (
                                    <span className="rsvp-stat-sub">Última: {timeAgo(confirmations[0].created_at)}</span>
                                )}
                            </div>
                        </div>
                        <div className="rsvp-stat-card">
                            <div className="rsvp-stat-icon" style={{ background: '#fce8e6', color: '#d93025' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                                </svg>
                            </div>
                            <div className="rsvp-stat-info">
                                <span className="rsvp-stat-number">{totalGuests}</span>
                                <span className="rsvp-stat-label">Total de personas</span>
                            </div>
                        </div>
                    </div>

                    {getDuplicateNames().length > 0 && (
                        <div className="rsvp-alert-warning">
                            <span className="rsvp-alert-icon">⚠️</span>
                            <div>
                                <strong>Atención:</strong> Hemos detectado posibles nombres duplicados. Revisa las confirmaciones de: <strong>{getDuplicateNames().map(n => n.replace(/\b\w/g, l => l.toUpperCase())).join(', ')}</strong>.
                            </div>
                        </div>
                    )}

                    {/* ─── Search and Table ─── */}
                    <div className="rsvp-panel">
                        <div className="rsvp-panel-header">
                            <h2 className="rsvp-panel-title">Lista de invitados confirmados</h2>
                            <div className="rsvp-search-wrap">
                                <svg className="rsvp-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="rsvp-search-input"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="rsvp-empty-state">
                                <div className="rsvp-loader"></div>
                                <p>Cargando confirmaciones...</p>
                            </div>
                        ) : confirmations.length === 0 ? (
                            <div className="rsvp-empty-state">
                                <div className="rsvp-empty-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dadce0" strokeWidth="1.5">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/>
                                        <line x1="17" y1="11" x2="23" y2="11"/>
                                    </svg>
                                </div>
                                <h3 className="rsvp-empty-title">Aún no hay confirmaciones</h3>
                                <p className="rsvp-empty-desc">
                                    Cuando los invitados confirmen su asistencia desde la invitación, aparecerán aquí automáticamente.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="rsvp-table-wrap">
                                    <table className="rsvp-table">
                                        <thead>
                                            <tr>
                                                <th>Invitado</th>
                                                <th>Personas</th>
                                                <th>Mensaje</th>
                                                <th>Fecha</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map((c) => (
                                                <tr key={c.id}>
                                                    <td>
                                                        <div className="rsvp-user-cell">
                                                            <div className="rsvp-avatar" style={{ background: getAvatarColor(c.name) }}>
                                                                {getInitials(c.name)}
                                                            </div>
                                                            <span className="rsvp-user-name">
                                                                {c.name}
                                                                {isNew(c.created_at) && <span className="rsvp-new-dot" title="Confirmación reciente (últimas 24h)"></span>}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="rsvp-guests-badge">{c.guests}</span>
                                                    </td>
                                                    <td>
                                                        <span className="rsvp-message-text">{c.message || '—'}</span>
                                                    </td>
                                                    <td>
                                                        <div className="rsvp-date-cell">
                                                            <span className="rsvp-date">{formatDate(c.created_at)}</span>
                                                            <span className="rsvp-time">{formatTime(c.created_at)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleDelete(c.id)}
                                                            disabled={deleting === c.id}
                                                            className="rsvp-delete-btn"
                                                            title="Eliminar"
                                                        >
                                                            {deleting === c.id ? (
                                                                <div className="rsvp-mini-loader"></div>
                                                            ) : (
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {filtered.length === 0 && searchTerm && (
                                    <div className="rsvp-no-results">
                                        No se encontraron resultados para "{searchTerm}"
                                    </div>
                                )}

                                <div className="rsvp-panel-footer">
                                    Mostrando {filtered.length} de {confirmations.length} confirmaciones • Se actualiza automáticamente
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <footer className="rsvp-footer">
                    <p>Panel de confirmaciones • Invita-ya</p>
                </footer>
            </div>
        </>
    )
}

// ─── CSS ────────────────────────────────────────────────────
const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    .rsvp-app {
        min-height: 100vh;
        background: #f8f9fa;
        font-family: 'Google Sans', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #202124;
        display: flex;
        flex-direction: column;
    }

    /* ─── Auth Screen ─── */
    .rsvp-auth-screen {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        min-height: 100vh;
    }
    .rsvp-auth-card {
        background: #fff;
        border: 1px solid #dadce0;
        border-radius: 16px;
        padding: 48px 40px;
        max-width: 420px;
        width: 100%;
        text-align: center;
        box-shadow: 0 1px 3px rgba(60,64,67,0.08);
    }
    .rsvp-auth-logo {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #e8f0fe;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
    }
    .rsvp-auth-title {
        font-size: 1.5rem;
        font-weight: 500;
        color: #202124;
        margin-bottom: 8px;
    }
    .rsvp-auth-desc {
        font-size: 0.875rem;
        color: #5f6368;
        line-height: 1.5;
        margin-bottom: 24px;
    }
    .rsvp-auth-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .rsvp-auth-input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #dadce0;
        border-radius: 8px;
        font-size: 0.9375rem;
        font-family: inherit;
        color: #202124;
        text-align: center;
        letter-spacing: 0.15em;
        outline: none;
        transition: all 0.2s;
    }
    .rsvp-auth-input:focus {
        border-color: #1a73e8;
        box-shadow: 0 0 0 2px rgba(26,115,232,0.15);
    }
    .rsvp-auth-btn {
        padding: 12px 24px;
        background: #1a73e8;
        color: #fff;
        border: none;
        border-radius: 24px;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.15s;
    }
    .rsvp-auth-btn:hover { background: #1765cc; }
    .rsvp-auth-error {
        color: #d93025;
        font-size: 0.8125rem;
        margin: -4px 0;
    }
    .rsvp-auth-hint {
        margin-top: 20px;
        font-size: 0.75rem;
        color: #80868b;
    }

    /* ─── Top Bar ─── */
    .rsvp-topbar {
        background: #fff;
        border-bottom: 1px solid #dadce0;
        padding: 0 24px;
        height: 64px;
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 1px 3px rgba(60,64,67,0.05);
    }
    .rsvp-topbar-inner {
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .rsvp-topbar-left {
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .rsvp-logo-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: #e8f0fe;
        color: #1a73e8;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .rsvp-topbar-title {
        font-size: 1.125rem;
        font-weight: 500;
        color: #202124;
        letter-spacing: -0.01em;
    }
    .rsvp-topbar-slug {
        font-size: 0.75rem;
        color: #5f6368;
        font-family: 'Roboto Mono', monospace;
    }
    .rsvp-topbar-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .rsvp-btn-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: #5f6368;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
    }
    .rsvp-btn-icon:hover {
        background: #f1f3f4;
        color: #202124;
    }
    .rsvp-btn-secondary {
        padding: 8px 20px;
        border-radius: 24px;
        border: 1px solid #dadce0;
        background: #fff;
        color: #1a73e8;
        font-size: 0.8125rem;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s;
    }
    .rsvp-btn-secondary:hover {
        background: #f1f3f4;
        border-color: #d2e3fc;
    }
    .rsvp-btn-icon-only {
        display: none;
        font-size: 16px;
    }

    /* ─── Body ─── */
    .rsvp-body {
        flex: 1;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        padding: 24px;
    }

    /* ─── Stats ─── */
    .rsvp-stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 24px;
    }
    .rsvp-stat-sub {
        display: block;
        font-size: 13px;
        color: #1a73e8;
        margin-top: 4px;
        font-weight: 500;
    }
    .rsvp-new-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #1a73e8;
        border-radius: 50%;
        margin-left: 8px;
        vertical-align: middle;
    }
    .rsvp-alert-warning {
        background-color: #fff8e1;
        border: 1px solid #ffe082;
        color: #b06000;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
    }
    .rsvp-alert-icon {
        font-size: 20px;
    }
    .rsvp-stat-card {
        background: #fff;
        border: 1px solid #dadce0;
        border-radius: 12px;
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: box-shadow 0.2s;
    }
    .rsvp-stat-card:hover {
        box-shadow: 0 1px 6px rgba(60,64,67,0.1);
    }
    .rsvp-stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .rsvp-stat-info {
        display: flex;
        flex-direction: column;
    }
    .rsvp-stat-number {
        font-size: 1.75rem;
        font-weight: 700;
        color: #202124;
        line-height: 1.1;
    }
    .rsvp-stat-label {
        font-size: 0.8125rem;
        color: #5f6368;
        margin-top: 2px;
    }

    /* ─── Panel ─── */
    .rsvp-panel {
        background: #fff;
        border: 1px solid #dadce0;
        border-radius: 12px;
        overflow: hidden;
    }
    .rsvp-panel-header {
        padding: 16px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e8eaed;
        flex-wrap: wrap;
        gap: 12px;
    }
    .rsvp-panel-title {
        font-size: 0.9375rem;
        font-weight: 500;
        color: #202124;
    }
    .rsvp-search-wrap {
        position: relative;
        width: 280px;
    }
    .rsvp-search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #80868b;
    }
    .rsvp-search-input {
        width: 100%;
        padding: 8px 12px 8px 36px;
        border: 1px solid #dadce0;
        border-radius: 24px;
        font-size: 0.8125rem;
        font-family: inherit;
        color: #202124;
        background: #f1f3f4;
        outline: none;
        transition: all 0.2s;
    }
    .rsvp-search-input:focus {
        background: #fff;
        border-color: #1a73e8;
        box-shadow: 0 0 0 2px rgba(26,115,232,0.15);
    }
    .rsvp-search-input::placeholder {
        color: #80868b;
    }

    /* ─── Table ─── */
    .rsvp-table-wrap {
        overflow-x: auto;
    }
    .rsvp-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
    }
    .rsvp-table thead {
        background: #f8f9fa;
    }
    .rsvp-table th {
        padding: 12px 24px;
        text-align: left;
        font-weight: 500;
        color: #5f6368;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        border-bottom: 1px solid #e8eaed;
        white-space: nowrap;
    }
    .rsvp-table td {
        padding: 14px 24px;
        border-bottom: 1px solid #f1f3f4;
        vertical-align: middle;
    }
    .rsvp-table tbody tr {
        transition: background 0.1s;
    }
    .rsvp-table tbody tr:hover {
        background: #f8f9fb;
    }
    .rsvp-table tbody tr:last-child td {
        border-bottom: none;
    }

    /* ─── Table Cells ─── */
    .rsvp-user-cell {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .rsvp-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: 0.8125rem;
        color: #fff;
        flex-shrink: 0;
        letter-spacing: 0.02em;
    }
    .rsvp-user-name {
        font-weight: 500;
        color: #202124;
        white-space: nowrap;
    }
    .rsvp-guests-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        height: 28px;
        padding: 0 8px;
        border-radius: 14px;
        background: #e8f0fe;
        color: #1a73e8;
        font-weight: 600;
        font-size: 0.8125rem;
    }
    .rsvp-message-text {
        color: #5f6368;
        font-size: 0.8125rem;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
    }
    .rsvp-date-cell {
        display: flex;
        flex-direction: column;
    }
    .rsvp-date {
        font-size: 0.8125rem;
        color: #202124;
        white-space: nowrap;
    }
    .rsvp-time {
        font-size: 0.75rem;
        color: #80868b;
    }
    .rsvp-delete-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: #80868b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
    }
    .rsvp-delete-btn:hover {
        background: #fce8e6;
        color: #d93025;
    }
    .rsvp-delete-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    /* ─── Panel Footer ─── */
    .rsvp-panel-footer {
        padding: 12px 24px;
        font-size: 0.75rem;
        color: #80868b;
        border-top: 1px solid #e8eaed;
        background: #f8f9fa;
    }
    .rsvp-no-results {
        padding: 40px 24px;
        text-align: center;
        color: #5f6368;
        font-size: 0.875rem;
    }

    /* ─── Empty State ─── */
    .rsvp-empty-state {
        text-align: center;
        padding: 64px 24px;
    }
    .rsvp-empty-icon {
        margin-bottom: 16px;
    }
    .rsvp-empty-title {
        font-size: 1rem;
        font-weight: 500;
        color: #202124;
        margin-bottom: 6px;
    }
    .rsvp-empty-desc {
        font-size: 0.875rem;
        color: #5f6368;
        max-width: 360px;
        margin: 0 auto;
        line-height: 1.5;
    }

    /* ─── Footer ─── */
    .rsvp-footer {
        text-align: center;
        padding: 20px 24px;
        font-size: 0.75rem;
        color: #80868b;
        border-top: 1px solid #e8eaed;
    }

    /* ─── Loaders ─── */
    .rsvp-loader {
        width: 36px;
        height: 36px;
        border: 3px solid #e8eaed;
        border-top-color: #1a73e8;
        border-radius: 50%;
        animation: rsvp-spin 0.7s linear infinite;
        margin: 0 auto 16px;
    }
    .rsvp-mini-loader {
        width: 16px;
        height: 16px;
        border: 2px solid #e8eaed;
        border-top-color: #d93025;
        border-radius: 50%;
        animation: rsvp-spin 0.7s linear infinite;
    }
    @keyframes rsvp-spin {
        to { transform: rotate(360deg); }
    }

    /* ─── Responsive ─── */
    @media (max-width: 768px) {
        .rsvp-stats-grid {
            grid-template-columns: 1fr;
        }
        .rsvp-panel-header {
            flex-direction: column;
            align-items: stretch;
        }
        .rsvp-search-wrap {
            width: 100%;
        }
        .rsvp-topbar-slug {
            display: none;
        }
        .rsvp-auth-card {
            padding: 32px 24px;
        }
        .rsvp-btn-text {
            display: none;
        }
        .rsvp-btn-icon-only {
            display: inline;
        }
        .rsvp-topbar-actions .rsvp-btn-secondary {
            padding: 8px 12px;
        }
    }
    @media (max-width: 480px) {
        .rsvp-body { padding: 16px; }
    }
`

export default RsvpDashboard
