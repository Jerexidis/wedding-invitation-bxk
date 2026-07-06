import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execFileSync } from 'node:child_process'

const ROOT = process.cwd()
const SRC_ROOT = path.join(ROOT, 'src', 'invitations')
const PUBLIC_ROOT = path.join(ROOT, 'public', 'invitations')
const REGISTRY_PATH = path.join(SRC_ROOT, 'registry.js')
const OG_DATA_PATH = path.join(ROOT, 'og-data.js')
const RSVP_KEYS_PATH = path.join(ROOT, 'plugins', 'rsvp-keys.json')
const CONTEXT_PATHS = [
    path.join(ROOT, 'docs', 'INVITATIONS.md'),
    path.join(ROOT, 'docs', 'invitations.inventory.json'),
]
const VALID_RSVP_MODES = new Set(['whatsapp', 'supabase', 'mixed', 'none'])
const IMAGE_EXTENSIONS = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])
const FOCAL_POINTS = new Set(['center', 'top', 'bottom', 'left', 'right'])

function isValidSlug(slug) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

function readJson(filePath) {
    if (!fs.existsSync(filePath)) return null
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch {
        return null
    }
}

function slash(value) {
    return value.replaceAll(path.sep, '/')
}

function relative(value) {
    return slash(path.relative(ROOT, value))
}

function listImages(directory) {
    if (!fs.existsSync(directory)) return []
    const images = []
    const visit = (current) => {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const fullPath = path.join(current, entry.name)
            if (entry.isDirectory()) visit(fullPath)
            else if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) images.push(fullPath)
        }
    }
    visit(directory)
    return images
}

function scoreImage(filePath) {
    const name = path.basename(filePath).toLowerCase()
    if (/^og-preview\./.test(name)) return 0
    if (name.includes('hero') || name.includes('portada')) return 1
    return 2
}

function findOgCandidates(slug) {
    const roots = [
        path.join(PUBLIC_ROOT, slug, 'img'),
        path.join(SRC_ROOT, slug, 'assets'),
    ]
    return roots
        .flatMap(listImages)
        .sort((left, right) => scoreImage(left) - scoreImage(right) || left.localeCompare(right))
        .map((filePath) => relative(filePath))
}

function registryHasSlug(slug) {
    if (!fs.existsSync(REGISTRY_PATH)) return false
    const source = fs.readFileSync(REGISTRY_PATH, 'utf8')
    return new RegExp(`slug:\\s*['"]${slug}['"]`).test(source)
}

function ogHasSlug(slug) {
    if (!fs.existsSync(OG_DATA_PATH)) return false
    const source = fs.readFileSync(OG_DATA_PATH, 'utf8')
    return new RegExp(`['"]${slug}['"]\\s*:`).test(source)
}

function normalizeActivation(slug, manifest, input = {}) {
    const services = manifest?.services || {}
    return {
        slug,
        title: String(input.title || manifest?.title || '').trim(),
        eventType: String(input.eventType || manifest?.eventType || '').trim(),
        eventDate: String(input.eventDate || manifest?.eventDate || '').trim(),
        rsvpMode: String(input.rsvpMode || services.rsvp || 'none').trim(),
        description: String(input.description || manifest?.seo?.description || '').trim(),
        ogSource: String(input.ogSource || '').trim(),
        focalPoint: FOCAL_POINTS.has(input.focalPoint) ? input.focalPoint : 'center',
        portfolioGalleryAllowed: input.portfolioGalleryAllowed === true,
    }
}

export function getDraftActivationPlan(slug, input = {}) {
    slug = String(slug || '').trim()
    const errors = []
    const warnings = []
    const sourceDirectory = path.join(SRC_ROOT, slug)
    const manifestPath = path.join(sourceDirectory, 'invitation.manifest.json')
    const manifest = readJson(manifestPath)
    const candidates = isValidSlug(slug) ? findOgCandidates(slug) : []
    const activation = normalizeActivation(slug, manifest, input)
    if (!activation.ogSource) activation.ogSource = candidates[0] || ''

    if (!isValidSlug(slug)) errors.push('El slug del borrador no es válido.')
    if (!fs.existsSync(sourceDirectory)) errors.push('No existe la carpeta fuente del borrador.')
    if (!fs.existsSync(path.join(sourceDirectory, 'index.jsx'))) errors.push('Falta index.jsx.')
    if (!manifest) errors.push('Falta invitation.manifest.json o no contiene JSON válido.')
    if (manifest?.slug !== slug) errors.push('El slug del manifiesto no coincide con la carpeta.')
    if (manifest?.status !== 'draft' || manifest?.registered !== false) {
        errors.push('La invitación no es un borrador privado pendiente de registro.')
    }
    if (registryHasSlug(slug)) errors.push('El slug ya existe en registry.js.')
    if (ogHasSlug(slug)) errors.push('El slug ya existe en og-data.js.')
    if (!activation.title) errors.push('Falta el título público.')
    if (!activation.eventType) errors.push('Falta el tipo de evento.')
    if (!activation.eventDate || Number.isNaN(Date.parse(activation.eventDate))) {
        errors.push('Falta una fecha de evento válida.')
    }
    if (!VALID_RSVP_MODES.has(activation.rsvpMode)) errors.push('El modo RSVP no es válido.')
    if (!activation.ogSource) errors.push('Falta una imagen para generar Open Graph.')
    if (activation.ogSource && !candidates.includes(activation.ogSource)) {
        errors.push('La imagen Open Graph debe pertenecer a los assets del borrador.')
    }
    if (!activation.description) {
        warnings.push('Se usará una descripción social genérica.')
    }

    return {
        ok: errors.length === 0,
        slug,
        errors,
        warnings,
        activation,
        ogCandidates: candidates,
        operations: [
            'Generar public/invitations/<slug>/img/og-preview.jpg a 1200×630.',
            'Registrar la ruta pública en registry.js.',
            'Agregar los metadatos sociales a og-data.js.',
            'Marcar invitation.manifest.json como published y registered.',
            ...(activation.rsvpMode === 'supabase' || activation.rsvpMode === 'mixed'
                ? ['Crear una clave nueva para el dashboard RSVP.']
                : []),
            'Actualizar el inventario generado del proyecto.',
        ],
    }
}

function escapeJs(value) {
    return String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\r', ' ').replaceAll('\n', ' ')
}

function writeAtomic(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    const temporaryPath = `${filePath}.${process.pid}.tmp`
    fs.writeFileSync(temporaryPath, content)
    fs.renameSync(temporaryPath, filePath)
}

function appendRegistryEntry(activation) {
    let source = fs.readFileSync(REGISTRY_PATH, 'utf8')
    const endIndex = source.indexOf('\n]')
    if (endIndex === -1) throw new Error('No se encontró el cierre del registro de invitaciones.')
    const entry = `    {
        slug: '${escapeJs(activation.slug)}',
        title: '${escapeJs(activation.title)}',
        component: lazy(() => import('./${activation.slug}/index.jsx')),
        enabled: true,
        eventType: '${escapeJs(activation.eventType)}',
        rsvpMode: '${escapeJs(activation.rsvpMode)}',
        eventDate: '${escapeJs(activation.eventDate)}',${activation.portfolioGalleryAllowed ? '\n        portfolioGalleryAllowed: true,' : ''}
    },`
    source = `${source.slice(0, endIndex)}\n${entry}\n${source.slice(endIndex)}`
    writeAtomic(REGISTRY_PATH, source)
}

const DEFAULT_DESCRIPTIONS = {
    xv: 'Estás invitado(a) a celebrar mis XV años. Toca aquí para ver la invitación.',
    boda: 'Te invitamos a celebrar nuestra boda. Toca aquí para ver la invitación.',
    bautizo: 'Te invitamos a celebrar este día tan especial. Toca aquí para ver la invitación.',
    cumpleanos: 'Estás invitado(a). Toca aquí para ver la invitación y confirmar tu asistencia.',
    'primera-comunion': 'Te invitamos a celebrar nuestra Primera Comunión. Toca aquí para ver la invitación.',
}

function appendOgEntry(activation) {
    let source = fs.readFileSync(OG_DATA_PATH, 'utf8')
    const endIndex = source.lastIndexOf('}')
    if (endIndex === -1) throw new Error('No se encontró el cierre de og-data.js.')
    const description = activation.description || DEFAULT_DESCRIPTIONS[activation.eventType]
        || 'Estás invitado(a). Toca aquí para ver la invitación completa.'
    const entry = `    '${escapeJs(activation.slug)}': {
        title: '${escapeJs(activation.title)}',
        description: '${escapeJs(description)}',
        image: '/invitations/${activation.slug}/img/og-preview.jpg',
    },
`
    source = `${source.slice(0, endIndex)}${entry}${source.slice(endIndex)}`
    writeAtomic(OG_DATA_PATH, source)
}

function snapshotFiles(filePaths) {
    return new Map(filePaths.map((filePath) => [
        filePath,
        fs.existsSync(filePath) ? fs.readFileSync(filePath) : null,
    ]))
}

function restoreSnapshot(snapshot) {
    for (const [filePath, content] of snapshot) {
        if (content === null) {
            fs.rmSync(filePath, { force: true })
        } else {
            writeAtomic(filePath, content)
        }
    }
}

function createRsvpAccess(slug) {
    const keys = readJson(RSVP_KEYS_PATH) || {}
    const key = crypto.randomBytes(12).toString('base64url')
    keys[slug] = key
    writeAtomic(RSVP_KEYS_PATH, `${JSON.stringify(keys, null, 4)}\n`)
    const hash = crypto.createHash('sha256').update(key).digest('hex')
    const accessPath = path.join(PUBLIC_ROOT, slug, 'rsvp-access.json')
    writeAtomic(accessPath, `${JSON.stringify({ hash }, null, 4)}\n`)
    return key
}

async function generateOgImage(activation) {
    const sourcePath = path.resolve(ROOT, activation.ogSource)
    const targetPath = path.join(PUBLIC_ROOT, activation.slug, 'img', 'og-preview.jpg')
    const sourceBuffer = fs.readFileSync(sourcePath)
    const { default: sharp } = await import('sharp')
    const output = await sharp(sourceBuffer)
        .rotate()
        .resize(1200, 630, {
            fit: 'cover',
            position: activation.focalPoint,
        })
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer()
    writeAtomic(targetPath, output)
}

export async function activateDraft(slug, input = {}) {
    const plan = getDraftActivationPlan(slug, input)
    if (!plan.ok) throw new Error(plan.errors.join(' '))

    const { activation } = plan
    const manifestPath = path.join(SRC_ROOT, slug, 'invitation.manifest.json')
    const ogTargetPath = path.join(PUBLIC_ROOT, slug, 'img', 'og-preview.jpg')
    const rsvpAccessPath = path.join(PUBLIC_ROOT, slug, 'rsvp-access.json')
    const snapshot = snapshotFiles([
        REGISTRY_PATH,
        OG_DATA_PATH,
        RSVP_KEYS_PATH,
        manifestPath,
        ogTargetPath,
        rsvpAccessPath,
        ...CONTEXT_PATHS,
    ])

    try {
        await generateOgImage(activation)
        appendRegistryEntry(activation)
        appendOgEntry(activation)

        const manifest = readJson(manifestPath)
        const publishedManifest = {
            ...manifest,
            title: activation.title,
            eventType: activation.eventType,
            eventDate: activation.eventDate,
            status: 'published',
            registered: true,
            services: {
                ...manifest.services,
                rsvp: activation.rsvpMode,
                seo: true,
            },
            seo: {
                ...manifest.seo,
                description: activation.description || DEFAULT_DESCRIPTIONS[activation.eventType] || '',
                shareImage: 'og-preview.jpg',
                focalPoint: activation.focalPoint,
            },
        }
        writeAtomic(manifestPath, `${JSON.stringify(publishedManifest, null, 2)}\n`)

        let rsvpKey = null
        if (activation.rsvpMode === 'supabase' || activation.rsvpMode === 'mixed') {
            rsvpKey = createRsvpAccess(slug)
        }

        execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'invitation-inventory.mjs'), 'refresh'], {
            cwd: ROOT,
            encoding: 'utf8',
            timeout: 30000,
        })

        return {
            slug,
            path: `/i/${slug}`,
            rsvpLink: rsvpKey ? `/i/${slug}/rsvp?key=${rsvpKey}` : null,
            generatedOg: `/invitations/${slug}/img/og-preview.jpg`,
        }
    } catch (error) {
        restoreSnapshot(snapshot)
        throw new Error(`La activación se revirtió: ${error.message}`)
    }
}
