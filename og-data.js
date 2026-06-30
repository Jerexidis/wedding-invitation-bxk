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
    'plantilla-boda-editorial': {
        title: 'Plantilla de boda | Editorial rojo',
        description: 'Boda editorial en blanco y negro con acentos rojo vino, fotografías y confirmación interactiva.',
        image: '/invitations/plantilla-boda-editorial/img/hero-couple.webp',
    },
    'plantilla-rapunzel-xv': {
        title: 'Plantilla XV | Cuento de los faroles',
        description: 'Una invitación de XV años inspirada en faroles, torre, flores y una aventura de cuento.',
        image: '/invitations/plantilla-rapunzel-xv/img/hero-storybook.webp',
    },
    'plantilla-fiesta-casual': {
        title: 'Plantilla | Fiesta casual',
        description: 'Una invitación casual con collage editorial, disco, brillos y confirmación por WhatsApp.',
        image: '/invitations/plantilla-fiesta-casual/img/party-collage-frame.png',
    },
    'kassandra-brian': {
        title: 'Invitación de Kassandra & Brian 💕',
        description: 'Te invitamos a celebrar nuestra boda. ¡Toca aquí para ver la invitación completa!',
        image: '/invitations/kassandra-brian/img/Portada.jpeg',
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
    'michel-mtz': {
        title: 'Mis XV Años — Michel Guadalupe 🐸✨',
        description: 'Estás cordialmente invitado(a) a celebrar mis XV años. ¡Toca aquí para ver la invitación!',
        image: '/invitations/michel-mtz/img/og-preview.png',
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
    'erik-shady-bermejo': {
        title: 'Primera Comunión | Erik Shady Bermejo 🕊️',
        description: 'Te invito a celebrar mi Primera Comunión y 10 Años. ¡Toca aquí para confirmar tu asistencia!',
        image: '/invitations/erik-shady-bermejo/img/og-preview.png',
    },
    'alexa-y-santiago': {
        title: 'Primera Comunión | Alexa y Santiago 🕊️',
        description: 'Te invitamos a celebrar nuestra Primera Comunión. ¡Toca aquí para confirmar tu asistencia!',
        image: '/invitations/alexa-y-santiago/img/og-preview.jpg',
    },
    'victoria-rojas': {
        title: 'XV Años | Victoria Rojas ✨',
        description: 'Estás invitado(a) a la celebración de mis XV años. ¡Toca aquí para ver la invitación!',
        image: '/invitations/victoria-rojas/img/og-preview.jpg',
    },
    'maria-loyola': {
        title: 'XV Años | María José Loyola Lechuga ✨',
        description: 'Estás invitado(a) a la celebración de mis XV años. ¡Toca aquí para ver la invitación!',
        image: '/invitations/maria-loyola/img/og-preview.jpg',
    },
}
