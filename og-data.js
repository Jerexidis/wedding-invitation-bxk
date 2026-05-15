/**
 * Open Graph metadata for each invitation.
 * 
 * Used by the Vercel Edge Middleware to serve proper OG meta tags
 * to social-media crawlers (WhatsApp, Facebook, Twitter, etc.)
 * 
 * To add a new invitation:
 *   1. Add an entry here keyed by slug
 *   2. Place a preview image at /public/invitations/<slug>/img/og-preview.jpg
 *      (recommended size: 1200×630px)
 */

export const ogData = {
    'kassandra-brian': {
        title: 'Invitación de Kassandra & Brian 💕',
        description: 'Te invitamos a celebrar nuestra boda. ¡Toca aquí para ver la invitación completa!',
        image: '/invitations/kassandra-brian/img/og-preview.jpg',
    },
    'atziri-belen': {
        title: 'Mis XV Años — Atziri Belén ✨',
        description: 'Estás invitado(a) a la celebración de mis XV años. ¡Toca aquí para ver la invitación!',
        image: '/invitations/atziri-belen/img/og-preview.jpg',
    },
    'melani-marisol': {
        title: 'Mis XV Años — Melani Marisol 🐸✨',
        description: 'Estás cordialmente invitado(a) a celebrar mis XV años. ¡Toca aquí para ver la invitación!',
        image: '/invitations/melani-marisol/img/og-preview-v5.jpg',
    },
    'despedida-kass-brian': {
        title: 'Despedida de Solteros | Kass & Brian 🎉',
        description: '¡Estás invitad@ a nuestra Despedida de Solteros! 16 de mayo 2026. ¡No faltes!',
        image: '/invitations/despedida-kass-brian/img/share-preview.png',
    },
    'isabella': {
        title: 'Primera Comunión | Isabella 🕊️',
        description: 'Te invito a celebrar mi Primera Comunión. ¡Toca aquí para confirmar tu asistencia!',
        image: '/invitations/isabella/img/og-preview.jpg',
    },
    'alexa-y-santiago': {
        title: 'Primera Comunión | Alexa y Santiago 🕊️',
        description: 'Te invitamos a celebrar nuestra Primera Comunión. ¡Toca aquí para confirmar tu asistencia!',
        image: '/invitations/alexa-y-santiago/img/og-preview.jpg',
    },
}
