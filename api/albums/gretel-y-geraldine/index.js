import {
    assertAllowedOrigin,
    listAlbumPhotos,
    sendAlbumError,
    uploadAlbumPhoto,
} from '../../_lib/googleDriveAlbum.js'

export const config = {
    api: { bodyParser: false },
}

async function readBody(request) {
    const chunks = []
    for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
}

export default async function handler(request, response) {
    response.setHeader('X-Content-Type-Options', 'nosniff')

    try {
        if (request.method === 'GET') {
            const photos = await listAlbumPhotos()
            response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=20, stale-while-revalidate=60')
            response.status(200).json({ photos })
            return
        }

        if (request.method === 'POST') {
            assertAllowedOrigin(request)
            if (request.headers['content-type'] !== 'image/jpeg') {
                response.status(415).json({ error: 'La subida debe ser una fotografía JPEG optimizada.' })
                return
            }

            const file = await uploadAlbumPhoto(await readBody(request))
            response.setHeader('Cache-Control', 'no-store')
            response.status(201).json({ id: file.id, name: file.name })
            return
        }

        response.setHeader('Allow', 'GET, POST')
        response.status(405).json({ error: 'Método no permitido.' })
    } catch (error) {
        sendAlbumError(response, error)
    }
}
