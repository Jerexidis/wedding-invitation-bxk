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
        isDefault: true,
        enabled: true,
    },
    {
        slug: 'atziri-belen',
        title: 'Atziri Belén',
        component: lazy(() => import('./atziri-belen/index.jsx')),
        enabled: false, // cambiar a true para activar
    },
    {
        slug: 'melani-marisol',
        title: 'XV Años | Melani Marisol',
        component: lazy(() => import('./melani-marisol/index.jsx')),
        enabled: true,
    },
]

// Solo invitaciones activas
const activeInvitations = invitations.filter((inv) => inv.enabled)

export const getDefaultInvitation = () =>
    activeInvitations.find((inv) => inv.isDefault) || activeInvitations[0]

export const getInvitationBySlug = (slug) =>
    activeInvitations.find((inv) => inv.slug === slug)

export default activeInvitations
