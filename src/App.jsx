import React, { Suspense, lazy } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { getDefaultInvitation, getInvitationBySlug } from './invitations/registry'

const RsvpDashboard = lazy(() => import('./components/RsvpDashboard'))

// Admin panel solo disponible en dev (el archivo no existe en producción)
let AdminPanel = null
if (import.meta.env.DEV) {
    try {
        AdminPanel = lazy(() => import('./admin/AdminPanel'))
    } catch {
        // Admin not available
    }
}

/* Página 404 */
function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-800 font-sans">
            <h1 className="font-serif text-6xl mb-4">404</h1>
            <p className="text-lg text-slate-500">Invitación no encontrada</p>
        </div>
    )
}

/* Carga la invitación default (ruta /) */
function DefaultInvitation() {
    const invitation = getDefaultInvitation()
    if (!invitation) return <NotFound />
    const Component = invitation.component
    return <Component />
}

/* Carga una invitación por su slug (ruta /i/:slug) */
function InvitationBySlug() {
    const { slug } = useParams()
    const invitation = getInvitationBySlug(slug)
    if (!invitation) return <NotFound />
    const Component = invitation.component
    return (
        <ErrorBoundary slug={slug}>
            <Component />
        </ErrorBoundary>
    )
}

/* Error Boundary para capturar errores de renderizado */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-800 font-sans p-8">
                    <h1 className="font-serif text-4xl mb-4 text-red-600">Error en la invitación</h1>
                    <p className="text-lg text-slate-500 mb-4">Slug: {this.props.slug}</p>
                    <pre className="bg-red-50 text-red-800 p-4 rounded-lg max-w-2xl overflow-auto text-sm">
                        {this.state.error?.message}
                        {'\n\n'}
                        {this.state.error?.stack}
                    </pre>
                </div>
            )
        }
        return this.props.children
    }
}
/* Carga el dashboard de RSVP validando primero que la invitación exista */
function RsvpBySlug() {
    const { slug } = useParams()
    const invitation = getInvitationBySlug(slug)
    if (!invitation) return <NotFound />
    return <RsvpDashboard />
}

function App() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400 text-lg">Cargando...</div></div>}>
            <Routes>
                <Route path="/" element={<DefaultInvitation />} />
                <Route path="/i/:slug" element={<InvitationBySlug />} />
                <Route path="/i/:slug/rsvp" element={<RsvpBySlug />} />
                {AdminPanel && <Route path="/admin" element={<AdminPanel />} />}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    )
}

export default App
