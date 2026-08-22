import {
    downloadAlbumPhoto,
    sendAlbumError,
    verifyAlbumPhoto,
} from '../../_lib/googleDriveAlbum.js'

function safeDownloadName(name) {
    const base = name.replace(/[^a-zA-Z0-9._-]+/g, '-') || 'recuerdo.jpg'
    return base.toLowerCase().endsWith('.jpg') ? base : `${base}.jpg`
}

export default async function handler(request, response) {
    response.setHeader('X-Content-Type-Options', 'nosniff')

    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET')
        response.status(405).json({ error: 'Método no permitido.' })
        return
    }

    try {
        const fileId = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id
        const file = await verifyAlbumPhoto(fileId)
        const driveResponse = await downloadAlbumPhoto(fileId, file)
        const bytes = Buffer.from(await driveResponse.arrayBuffer())

        response.setHeader('Content-Type', file.mimeType || 'image/jpeg')
        response.setHeader('Content-Length', String(bytes.length))
        response.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, immutable')
        if (request.query.download === '1') {
            response.setHeader('Content-Disposition', `attachment; filename="${safeDownloadName(file.name)}"`)
        }
        response.status(200).send(bytes)
    } catch (error) {
        sendAlbumError(response, error)
    }
}
