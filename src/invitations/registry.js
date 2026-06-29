import { lazy } from 'react'

/**
 * Registro central de invitaciones.
 *
 * Para agregar una nueva invitación:
 * 1. Crea la carpeta src/invitations/<slug>/ con su index.jsx y components/
 * 2. Crea la carpeta public/invitations/<slug>/ con sus assets (img/, audio/, etc.)
 * 3. Agrega una entrada aquí abajo con enabled: true
 *
 * Para desactivar una invitación sin borrarla del registro:
 * - Cambia enabled: false (no será accesible por URL ni aparecerá en el panel)
 */
const invitations = [
    {
        slug: 'kassandra-brian',
        title: 'Nuestra Boda | Kassandra & Brian',
        component: lazy(() => import('./kassandra-brian/index.jsx')),
        enabled: true,
        eventType: 'boda',
        rsvpMode: 'whatsapp',
        eventDate: '2026-05-30T16:00:00',
    },
    {
        slug: 'melani-marisol',
        title: 'XV Años | Melani Marisol',
        component: lazy(() => import('./melani-marisol/index.jsx')),
        enabled: true,
        isDemo: true,
        eventType: 'xv',
        rsvpMode: 'whatsapp',
        eventDate: '2026-05-02T19:00:00',
    },

    {
        slug: 'despedida-kass-brian',
        title: 'Celebración | despedida-kass-brian',
        component: lazy(() => import('./despedida-kass-brian/index.jsx')),
        enabled: true,
        eventType: 'despedida',
        rsvpMode: 'whatsapp',
        eventDate: '2026-05-16T19:00:00',
    },

    {
        slug: 'isabella',
        title: 'Celebración | Isabella',
        component: lazy(() => import('./isabella/index.jsx')),
        enabled: true,
        eventType: 'primera-comunion',
        rsvpMode: 'supabase',
        eventDate: '2026-06-27T13:00:00',
    },
    {
        slug: 'erik-shady-bermejo',
        title: 'Primera Comunión y 10 Años | Erik Shady Bermejo',
        component: lazy(() => import('./erik-shady-bermejo/index.jsx')),
        enabled: true,
        eventType: 'primera-comunion',
        rsvpMode: 'mixed',
        eventDate: '2026-06-27T12:00:00',
    },
    {
        slug: 'alexa-y-santiago',
        title: 'Celebración | Alexa y Santiago',
        component: lazy(() => import('./alexa-y-santiago/index.jsx')),
        enabled: true,
        eventType: 'primera-comunion',
        rsvpMode: 'supabase',
        eventDate: '2026-06-27T13:00:00',
    },

    {
        slug: 'victoria-rojas',
        title: 'XV Años | Victoria Rojas',
        component: lazy(() => import('./victoria-rojas/index.jsx')),
        enabled: true,
        eventType: 'xv',
        rsvpMode: 'mixed',
        eventDate: '2026-07-25T12:00:00',
    },

    {
        slug: 'michel-mtz',
        title: 'XV Años | Michel Mtz Valdez',
        component: lazy(() => import('./michel-mtz/index.jsx')),
        enabled: true,
        eventType: 'xv',
        rsvpMode: 'whatsapp',
        eventDate: '2026-06-27T19:00:00',
    },

    {
        slug: 'maria-loyola',
        title: 'XV Años | María José Loyola Lopéz',
        component: lazy(() => import('./maria-loyola/index.jsx')),
        enabled: true,
        eventType: 'xv',
        rsvpMode: 'mixed',
        eventDate: '2026-07-25T18:00:00',
    },

]

// Solo invitaciones activas
const activeInvitations = invitations.filter((inv) => inv.enabled)

export const getDefaultInvitation = () =>
    activeInvitations.find((inv) => inv.isDefault) || activeInvitations[0]

export const getInvitationBySlug = (slug) =>
    activeInvitations.find((inv) => inv.slug === slug)

export default activeInvitations
