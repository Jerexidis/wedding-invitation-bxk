import { ogData } from './og-data.js'

/**
 * Vercel Edge Middleware
 * 
 * Detects social-media crawlers (WhatsApp, Facebook, Twitter, Telegram,
 * Discord, LinkedIn, etc.) and returns a minimal HTML page containing
 * the correct Open Graph & Twitter Card meta tags for each invitation.
 * 
 * Normal visitors are passed through to the SPA unchanged.
 */

// Regex that matches the User-Agent strings of major crawlers / link-preview bots
const BOT_UA = /facebookexternalhit|Facebot|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|Googlebot|bingbot/i

export const config = {
    matcher: '/i/:slug*',
}

export default function middleware(request) {
    const ua = request.headers.get('user-agent') || ''

    // Only intercept requests from social-media crawlers
    if (!BOT_UA.test(ua)) {
        return            // undefined  → Vercel serves the normal SPA
    }

    // Extract the slug from the URL path:  /i/<slug>  or  /i/<slug>/anything
    const url = new URL(request.url)
    const match = url.pathname.match(/^\/i\/([^/]+)/)
    const slug = match?.[1]

    if (!slug || !ogData[slug]) {
        return            // Unknown slug → fall through to SPA (shows 404)
    }

    const og = ogData[slug]
    const origin = url.origin                                     // e.g. https://invita-ya.com
    const canonicalUrl = `${origin}/i/${slug}`
    const imageUrl = `${origin}${og.image}`

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>${og.title}</title>

    <!-- Open Graph -->
    <meta property="og:type"        content="website" />
    <meta property="og:title"       content="${og.title}" />
    <meta property="og:description" content="${og.description}" />
    <meta property="og:image"       content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url"         content="${canonicalUrl}" />

    <!-- Twitter Card -->
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content="${og.title}" />
    <meta name="twitter:description" content="${og.description}" />
    <meta name="twitter:image"       content="${imageUrl}" />

    <!-- Redirect real users who somehow land here -->
    <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
</head>
<body>
    <p>Redirigiendo a la invitación…</p>
</body>
</html>`

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    })
}
