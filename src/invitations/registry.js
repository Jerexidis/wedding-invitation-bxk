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
 *
 * Privacidad del portafolio:
 * - Las invitaciones abiertas desde el landing reciben hideGallery: true.
 * - Solo usa portfolioGalleryAllowed: true cuando exista autorización expresa
 *   para publicar las fotografías de la galería.
 */
const invitations = [
    {
        slug: 'plantilla-boda-editorial',
        title: 'Plantilla Boda | Editorial Rojo',
        component: lazy(() => import('./plantilla-boda-editorial/index.jsx')),
        enabled: true,
        isDemo: true,
        portfolioPriority: 1,
        eventType: 'boda',
        rsvpMode: 'whatsapp',
        eventDate: '2027-10-16T17:00:00-06:00',
    },
    {
        slug: 'plantilla-rapunzel-xv',
        title: 'Plantilla XV | Cuento de los Faroles',
        component: lazy(() => import('./plantilla-rapunzel-xv/index.jsx')),
        enabled: true,
        isDemo: true,
        portfolioPriority: 2,
        eventType: 'xv',
        rsvpMode: 'whatsapp',
        eventDate: '2027-03-20T18:00:00-06:00',
    },
    {
        slug: 'plantilla-fiesta-casual',
        title: 'Plantilla | Fiesta Casual',
        component: lazy(() => import('./plantilla-fiesta-casual/index.jsx')),
        enabled: true,
        isDemo: true,
        portfolioPriority: 3,
        eventType: 'cumpleanos',
        rsvpMode: 'whatsapp',
        eventDate: '2026-12-13T21:00:00-06:00',
    },
    {
        slug: 'plantilla-bluey-fiesta',
        title: 'Plantilla | Fiesta Bluey',
        component: lazy(() => import('./plantilla-bluey-fiesta/index.jsx')),
        enabled: true,
        isDemo: true,
        portfolioPriority: 4,
        eventType: 'cumpleanos',
        rsvpMode: 'whatsapp',
        eventDate: '2027-08-15T16:00:00-06:00',
    },
    {
        slug: 'plantilla-minecraft-fiesta',
        title: 'Plantilla | Fiesta Minecraft',
        component: lazy(() => import('./plantilla-minecraft-fiesta/index.jsx')),
        enabled: true,
        isDemo: true,
        portfolioPriority: 5,
        eventType: 'cumpleanos',
        rsvpMode: 'whatsapp',
        eventDate: '2027-09-20T15:00:00-06:00',
    },
    {
        slug: 'kassandra-brian',
        title: 'Nuestra Boda | Kassandra & Brian',
        component: lazy(() => import('./kassandra-brian/index.jsx')),
        enabled: true,
        eventType: 'boda',
        rsvpMode: 'whatsapp',
        portfolioGalleryAllowed: true,
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
        title: 'Despedida de Solteros | Kass & Brian',
        component: lazy(() => import('./despedida-kass-brian/index.jsx')),
        enabled: true,
        eventType: 'despedida',
        rsvpMode: 'whatsapp',
        eventDate: '2026-10-17T19:00:00',
        portfolioPriority: 6,
    },

    {
        slug: 'isabella',
        title: 'Primera Comunión | Isabella',
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
        excludeFromPortfolio: true,
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
        eventDate: '2026-06-27T17:00:00',
        excludeFromPortfolio: true,
    },

    {
        slug: 'maria-loyola',
        title: 'XV Años | María José Loyola Lechuga',
        component: lazy(() => import('./maria-loyola/index.jsx')),
        enabled: true,
        eventType: 'xv',
        rsvpMode: 'mixed',
        eventDate: '2026-07-25T18:00:00',
    },

    {
        slug: 'jose-raul',
        title: 'XV Años | José Raúl',
        component: lazy(() => import('./jose-raul/index.jsx')),
        enabled: true,
        eventType: 'xv',
        rsvpMode: 'none',
        eventDate: '2026-08-15T14:00:00',
    },

    {
        slug: 'maia-sofia-duran-avila',
        title: 'Mis XV | Maia Sofía Durán Ávila',
        component: lazy(() => import('./maia-sofia-duran-avila/index.jsx')),
        enabled: true,
        eventType: 'xv',
        rsvpMode: 'mixed',
        eventDate: '2026-07-24T19:00:00-06:00',
    },

    {
        slug: 'andre-joel',
        title: 'Bautizo | Andre Joel',
        component: lazy(() => import('./andre-joel/index.jsx')),
        enabled: true,
        eventType: 'bautizo',
        rsvpMode: 'none',
        eventDate: '2026-07-18T15:30:00',
    },

    {
        slug: 'boda-lorena-y-arturo',
        title: 'Nuestra Boda | Lorena & Arturo',
        component: lazy(() => import('./boda-lorena-y-arturo/index.jsx')),
        enabled: true,
        eventType: 'boda',
        rsvpMode: 'whatsapp',
        eventDate: '2026-08-08T19:00:00',
    },

    {
        slug: 'hannia',
        title: 'Fiesta de Hannia | 23 años',
        component: lazy(() => import('./hannia/index.jsx')),
        enabled: true,
        eventType: 'cumpleanos',
        rsvpMode: 'supabase',
        eventDate: '2026-07-20T15:00:00-06:00',
    },

    {
        slug: 'daniela-itzel',
        title: 'Mis XV | Daniela Itzel',
        component: lazy(() => import('./daniela-itzel/index.jsx')),
        enabled: true,
        eventType: 'xv',
        rsvpMode: 'mixed',
        eventDate: '2026-08-22T17:00:00-06:00',
    },

    {
        slug: 'angelica-y-salvador',
        title: 'Nuestra Boda | Angélica & Salvador',
        component: lazy(() => import('./angelica-y-salvador/index.jsx')),
        enabled: true,
        eventType: 'boda',
        rsvpMode: 'mixed',
        eventDate: '2026-08-22T19:00:00-06:00',
    },

]

// Solo invitaciones activas
const activeInvitations = invitations.filter((inv) => inv.enabled)

export const getDefaultInvitation = () =>
    activeInvitations.find((inv) => inv.isDefault) || activeInvitations[0]

export const getInvitationBySlug = (slug) =>
    activeInvitations.find((inv) => inv.slug === slug)

export default activeInvitations
