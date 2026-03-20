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
    return <Component />
}

function App() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400 text-lg">Cargando...</div></div>}>
            <Routes>
                <Route path="/" element={<DefaultInvitation />} />
                <Route path="/i/:slug" element={<InvitationBySlug />} />
                <Route path="/i/:slug/rsvp" element={<RsvpDashboard />} />
                {AdminPanel && <Route path="/admin" element={<AdminPanel />} />}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    )
}

export default App
