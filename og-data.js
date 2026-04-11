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
}
