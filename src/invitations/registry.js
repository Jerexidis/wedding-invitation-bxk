import { lazy } from 'react'

/**
 * Registro central de invitaciones.
 * 
 * Para agregar una nueva invitación:
 * 1. Crea la carpeta src/invitations/<slug>/ con su index.jsx y components/
 * 2. Crea la carpeta public/invitations/<slug>/ con sus assets (img/, audio/, etc.)
 * 3. Agrega una entrada aquí abajo
 */
const invitations = [
    {
        slug: 'kassandra-brian',
        title: 'Nuestra Boda | Kassandra & Brian',
        component: lazy(() => import('./kassandra-brian/index.jsx')),
        isDefault: true,
    },
    // Ejemplo para futuras invitaciones:
    // {
    //     slug: 'maria-jose',
    //     title: 'Nuestra Boda | María & José',
    //     component: lazy(() => import('./maria-jose/index.jsx')),
    // },

    // {
    //     slug: 'atziri-belen',
    //     title: 'Atziri Belén',
    //     component: lazy(() => import('./atziri-belen/index.jsx')),
    // },

]

export const getDefaultInvitation = () =>
    invitations.find((inv) => inv.isDefault) || invitations[0]

export const getInvitationBySlug = (slug) =>
    invitations.find((inv) => inv.slug === slug)

export default invitations
