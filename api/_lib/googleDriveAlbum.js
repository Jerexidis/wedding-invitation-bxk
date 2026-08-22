import { randomUUID } from 'node:crypto'

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const DRIVE_API = 'https://www.googleapis.com/drive/v3'
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3'
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024

function requiredEnvironment() {
    const values = {
        clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
        folderId: process.env.GOOGLE_DRIVE_GRETEL_GERALDINE_FOLDER_ID,
    }

    const missing = Object.entries(values)
        .filter(([, value]) => !value)
        .map(([key]) => key)

    if (missing.length) {
        const error = new Error(`Google Drive no está configurado: ${missing.join(', ')}`)
        error.code = 'DRIVE_NOT_CONFIGURED'
        throw error
    }

    return values
}

export function assertAllowedOrigin(request) {
    const configuredOrigins = (process.env.ALBUM_ALLOWED_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)

    if (!configuredOrigins.length) return

    const origin = request.headers.origin
    if (origin && !configuredOrigins.includes(origin)) {
        const error = new Error('Este origen no tiene permiso para subir fotografías.')
        error.code = 'ORIGIN_NOT_ALLOWED'
        throw error
    }
}

async function getAccessToken() {
    const { clientId, clientSecret, refreshToken } = requiredEnvironment()
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    })

    if (!response.ok) {
        console.error('[Drive album] OAuth refresh failed', response.status, await response.text())
        throw new Error('No fue posible autenticar el álbum con Google Drive.')
    }

    const body = await response.json()
    return body.access_token
}

async function driveRequest(path, options = {}) {
    const accessToken = await getAccessToken()
    const response = await fetch(`${DRIVE_API}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(options.headers || {}),
        },
    })

    if (!response.ok) {
        console.error('[Drive album] API request failed', response.status, await response.text())
        throw new Error('Google Drive no pudo completar la solicitud del álbum.')
    }

    return response
}

function safeFileId(fileId) {
    if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
        const error = new Error('La fotografía solicitada no es válida.')
        error.code = 'INVALID_FILE_ID'
        throw error
    }
    return fileId
}

export async function verifyAlbumPhoto(fileId) {
    const { folderId } = requiredEnvironment()
    const id = safeFileId(fileId)
    const fields = encodeURIComponent('id,name,mimeType,parents,size')
    const response = await driveRequest(`/files/${id}?fields=${fields}&supportsAllDrives=true`)
    const file = await response.json()

    if (!file.parents?.includes(folderId) || !file.mimeType?.startsWith('image/')) {
        const error = new Error('La fotografía no pertenece a este álbum.')
        error.code = 'PHOTO_NOT_IN_ALBUM'
        throw error
    }

    return file
}

export async function listAlbumPhotos() {
    const { folderId } = requiredEnvironment()
    const query = `'${folderId.replaceAll("'", "\\'")}' in parents and trashed = false and mimeType contains 'image/'`
    const params = new URLSearchParams({
        q: query,
        pageSize: '300',
        orderBy: 'createdTime desc',
        fields: 'files(id,name,mimeType,createdTime,size)',
        spaces: 'drive',
        supportsAllDrives: 'true',
        includeItemsFromAllDrives: 'true',
    })
    const response = await driveRequest(`/files?${params}`)
    const body = await response.json()

    return (body.files || []).map((file) => ({
        id: file.id,
        name: file.name,
        createdAt: file.createdTime,
        url: `/api/albums/gretel-y-geraldine/photo?id=${encodeURIComponent(file.id)}`,
        downloadUrl: `/api/albums/gretel-y-geraldine/photo?id=${encodeURIComponent(file.id)}&download=1`,
    }))
}

export async function uploadAlbumPhoto(buffer) {
    const { folderId } = requiredEnvironment()
    if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > MAX_UPLOAD_BYTES) {
        const error = new Error('La fotografía preparada supera el límite permitido.')
        error.code = 'INVALID_UPLOAD_SIZE'
        throw error
    }

    const accessToken = await getAccessToken()
    const boundary = `invita_ya_${randomUUID().replaceAll('-', '')}`
    const filename = `${Date.now()}-${randomUUID()}.jpg`
    const metadata = Buffer.from(JSON.stringify({ name: filename, parents: [folderId] }))
    const opening = Buffer.from(
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`
    )
    const mediaHeader = Buffer.from(
        `\r\n--${boundary}\r\nContent-Type: image/jpeg\r\n\r\n`
    )
    const closing = Buffer.from(`\r\n--${boundary}--`)
    const body = Buffer.concat([opening, metadata, mediaHeader, buffer, closing])
    const response = await fetch(
        `${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id,name,mimeType,createdTime,size&supportsAllDrives=true`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': `multipart/related; boundary=${boundary}`,
                'Content-Length': String(body.length),
            },
            body,
        }
    )

    if (!response.ok) {
        console.error('[Drive album] Upload failed', response.status, await response.text())
        throw new Error('Google Drive no pudo guardar la fotografía.')
    }

    return response.json()
}

export async function downloadAlbumPhoto(fileId, verifiedFile = null) {
    if (!verifiedFile) await verifyAlbumPhoto(fileId)
    return driveRequest(`/files/${safeFileId(fileId)}?alt=media&supportsAllDrives=true`)
}

export function sendAlbumError(response, error) {
    const knownStatus = {
        DRIVE_NOT_CONFIGURED: 503,
        ORIGIN_NOT_ALLOWED: 403,
        INVALID_FILE_ID: 400,
        PHOTO_NOT_IN_ALBUM: 404,
        INVALID_UPLOAD_SIZE: 413,
    }
    const status = knownStatus[error.code] || 502
    response.status(status).json({
        error: error.code === 'DRIVE_NOT_CONFIGURED'
            ? 'El álbum todavía no tiene conexión con Google Drive.'
            : error.message || 'No se pudo completar la solicitud del álbum.',
    })
}
