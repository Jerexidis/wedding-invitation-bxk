import {
    albumLimits,
    optimizeAlbumPhoto,
    validateAlbumFiles,
} from './albumStore'

const API_BASE = '/api/albums/gretel-y-geraldine'

async function readError(response, fallback) {
    try {
        const body = await response.json()
        return body.error || fallback
    } catch {
        return fallback
    }
}

export const gretelDriveAlbumStore = {
    albumLimits,
    isAlbumConfigured: () => true,
    validateAlbumFiles,

    async uploadAlbumPhoto(file) {
        const optimized = await optimizeAlbumPhoto(file)
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'image/jpeg',
                'X-Album-Filename': file.name,
            },
            body: optimized,
        })

        if (!response.ok) {
            throw new Error(await readError(response, 'No se pudo subir la fotografía a Google Drive.'))
        }

        return response.json()
    },

    async listAlbumPhotos() {
        const response = await fetch(API_BASE, {
            headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
            throw new Error(await readError(response, 'No se pudo cargar el álbum desde Google Drive.'))
        }

        const body = await response.json()
        return body.photos || []
    },
}
