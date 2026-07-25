import { supabase } from './supabase'

const BUCKET = 'shared-album'
const DEFAULT_EVENT_FOLDER = 'evento-principal'
const MAX_SOURCE_BYTES = 25 * 1024 * 1024
const MAX_FILES_PER_BATCH = 10
const MAX_IMAGE_EDGE = 2400

export const albumLimits = {
    maxFiles: MAX_FILES_PER_BATCH,
    maxSourceMegabytes: MAX_SOURCE_BYTES / 1024 / 1024,
}

export function isAlbumConfigured() {
    return Boolean(
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY
    )
}

export function validateAlbumFiles(files) {
    const acceptedTypes = new Set([
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/heic',
        'image/heif',
    ])
    const selected = Array.from(files).slice(0, MAX_FILES_PER_BATCH)

    if (files.length > MAX_FILES_PER_BATCH) {
        throw new Error(`Puedes subir hasta ${MAX_FILES_PER_BATCH} fotos a la vez.`)
    }

    for (const file of selected) {
        if (!acceptedTypes.has(file.type)) {
            throw new Error(`"${file.name}" no es un formato de imagen compatible.`)
        }
        if (file.size > MAX_SOURCE_BYTES) {
            throw new Error(`"${file.name}" pesa más de ${albumLimits.maxSourceMegabytes} MB.`)
        }
    }

    return selected
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const image = new Image()

        image.onload = () => {
            URL.revokeObjectURL(url)
            resolve(image)
        }
        image.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error(`No pudimos leer "${file.name}".`))
        }
        image.src = url
    })
}

async function optimizeImage(file) {
    const image = await loadImage(file)
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) throw new Error('Tu navegador no pudo preparar la fotografía.')

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.84)
    })

    if (!blob) throw new Error(`No pudimos optimizar "${file.name}".`)
    return blob
}

function resolveEventFolder(eventFolder = DEFAULT_EVENT_FOLDER) {
    if (!/^[a-z0-9][a-z0-9/-]*$/i.test(eventFolder) || eventFolder.includes('..')) {
        throw new Error('La carpeta del álbum no es válida.')
    }
    return eventFolder.replace(/\/+$/, '')
}

export async function uploadAlbumPhoto(file, eventFolder = DEFAULT_EVENT_FOLDER) {
    if (!isAlbumConfigured()) {
        throw new Error('El álbum todavía no tiene conexión con Supabase.')
    }

    const optimized = await optimizeImage(file)
    const uniqueId = typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const path = `${resolveEventFolder(eventFolder)}/${Date.now()}-${uniqueId}.jpg`

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, optimized, {
            cacheControl: '31536000',
            contentType: 'image/jpeg',
            upsert: false,
        })

    if (error) throw new Error(error.message || 'No se pudo subir la fotografía.')
    return path
}

export async function listAlbumPhotos(eventFolder = DEFAULT_EVENT_FOLDER) {
    if (!isAlbumConfigured()) return []

    const folder = resolveEventFolder(eventFolder)
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(folder, {
            limit: 300,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
        })

    if (error) throw new Error(error.message || 'No se pudo cargar el álbum.')

    return (data || [])
        .filter((item) => item.name && item.id)
        .map((item) => {
            const path = `${folder}/${item.name}`
            const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path)
            return {
                id: item.id,
                name: item.name,
                createdAt: item.created_at,
                url: publicData.publicUrl,
            }
        })
}
