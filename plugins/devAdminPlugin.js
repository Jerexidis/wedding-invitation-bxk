import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { exec } from 'child_process'

const INVITATIONS_SRC = path.resolve('src/invitations')
const INVITATIONS_PUBLIC = path.resolve('public/invitations')
const REGISTRY_PATH = path.resolve('src/invitations/registry.js')
const OG_DATA_PATH = path.resolve('og-data.js')
const BASE_TEMPLATE = path.resolve('src/invitations/melani-marisol')

/**
 * Vite plugin that adds admin API endpoints (dev mode only).
 * Supports the new melani-marisol-based scaffold architecture.
 */
export default function devAdminPlugin() {
    return {
        name: 'dev-admin-api',
        apply: 'serve',

        configureServer(server) {
            const parseBody = (req) =>
                new Promise((resolve, reject) => {
                    let body = ''
                    req.on('data', (chunk) => (body += chunk))
                    req.on('end', () => {
                        try { resolve(JSON.parse(body)) } catch { resolve({}) }
                    })
                    req.on('error', reject)
                })

            server.middlewares.use(async (req, res, next) => {
                // GET /api/invitations — List all
                if (req.method === 'GET' && req.url === '/api/invitations') {
                    try {
                        const invitations = readRegistry()
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, invitations }))
                    } catch (err) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // POST /api/invitations — Create new
                if (req.method === 'POST' && req.url === '/api/invitations') {
                    try {
                        const data = await parseBody(req)
                        const result = createInvitation(data)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...result }))
                    } catch (err) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // POST /api/deploy — Git add + commit + push
                if (req.method === 'POST' && req.url === '/api/deploy') {
                    try {
                        const data = await parseBody(req)
                        const commitMsg = data.message || 'deploy: update invitations'
                        const result = await gitDeploy(commitMsg)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...result }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // GET /api/deploy/status — Check for pending changes
                if (req.method === 'GET' && req.url === '/api/deploy/status') {
                    try {
                        const status = await getDeployStatus()
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...status }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // PATCH /api/invitations/:slug/toggle
                const toggleMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)\/toggle$/)
                if (req.method === 'PATCH' && toggleMatch) {
                    try {
                        const slug = toggleMatch[1]
                        const newState = toggleInvitation(slug)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, slug, enabled: newState }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                const slugMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)$/)

                // GET /api/invitations/:slug — Get config
                if (req.method === 'GET' && slugMatch) {
                    try {
                        const slug = slugMatch[1]
                        const configPath = path.join(INVITATIONS_SRC, slug, 'config.json')
                        if (fs.existsSync(configPath)) {
                            const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
                            res.setHeader('Content-Type', 'application/json')
                            res.end(JSON.stringify({ ok: true, config: configData }))
                        } else {
                            res.statusCode = 404
                            res.end(JSON.stringify({ ok: false, error: 'Config not found' }))
                        }
                    } catch (err) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // PUT /api/invitations/:slug — Update config
                if (req.method === 'PUT' && slugMatch) {
                    try {
                        const slug = slugMatch[1]
                        const data = await parseBody(req)
                        const configPath = path.join(INVITATIONS_SRC, slug, 'config.json')
                        if (!fs.existsSync(configPath)) {
                            res.statusCode = 404
                            res.end(JSON.stringify({ ok: false, error: 'Config not found' }))
                            return
                        }
                        if (data.config) {
                            fs.writeFileSync(configPath, JSON.stringify(data.config, null, 4), 'utf-8')
                        }
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, slug }))
                    } catch (err) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // DELETE /api/invitations/:slug
                if (req.method === 'DELETE' && slugMatch) {
                    try {
                        const slug = slugMatch[1]
                        deleteInvitation(slug)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true }))
                    } catch (err) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                next()
            })
        },
    }
}

// ─── READ REGISTRY ──────────────────────────────────────────────
function readRegistry() {
    const content = fs.readFileSync(REGISTRY_PATH, 'utf-8')
    const entries = []
    const regex = /\{\s*slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],/g
    let match
    while ((match = regex.exec(content)) !== null) {
        const slug = match[1]
        const block = content.substring(match.index, content.indexOf('}', match.index))
        const isDefault = block.includes('isDefault: true')
        const enabled = !block.includes('enabled: false')

        // Read config.json if it exists
        let config = null
        let hasConfig = false
        try {
            const configPath = path.join(INVITATIONS_SRC, slug, 'config.json')
            if (fs.existsSync(configPath)) {
                config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
                hasConfig = true
            }
        } catch (e) {}

        entries.push({
            slug,
            title: match[2],
            isDefault,
            enabled,
            hasConfig,
            rsvpMode: config?.rsvp?.mode || null,
            eventType: config?.eventType || null,
            eventDate: config?.countdown?.targetDate || null,
            rsvpKey: config?.rsvpKey || null,
        })
    }
    return entries
}

// ─── CREATE INVITATION ──────────────────────────────────────────
function createInvitation(data) {
    const { slug, title, config } = data

    if (!slug || !title || !config) {
        throw new Error('Faltan datos: slug, title, y config son requeridos')
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
        throw new Error('El slug solo puede contener letras minúsculas, números y guiones')
    }

    const srcDir = path.join(INVITATIONS_SRC, slug)
    const publicDir = path.join(INVITATIONS_PUBLIC, slug)
    const imgDir = path.join(publicDir, 'img')
    const audioDir = path.join(publicDir, 'audio')

    if (fs.existsSync(srcDir)) {
        throw new Error(`La invitación "${slug}" ya existe`)
    }

    // 1. Create directories (no components folder needed)
    fs.mkdirSync(srcDir, { recursive: true })
    fs.mkdirSync(imgDir, { recursive: true })
    fs.mkdirSync(audioDir, { recursive: true })

    // 2. Auto-generate RSVP access key
    const rsvpKey = Math.random().toString(36).substring(2, 8)
    config.rsvpKey = rsvpKey
    config.slug = slug

    // 3. Write config.json
    fs.writeFileSync(
        path.join(srcDir, 'config.json'),
        JSON.stringify(config, null, 4),
        'utf-8'
    )

    // 4. Write rsvp-access.json to public (hash only — clave cruda queda solo en config.json)
    const rsvpKeyHash = crypto.createHash('sha256').update(rsvpKey).digest('hex')
    fs.writeFileSync(
        path.join(publicDir, 'rsvp-access.json'),
        JSON.stringify({ hash: rsvpKeyHash }),
        'utf-8'
    )

    // 5. Generate thin index.jsx (uses shared DynamicInvitation)
    const indexContent = [
        "import config from './config.json'",
        "import DynamicInvitation from '../../components/DynamicInvitation'",
        "",
        "export default () => <DynamicInvitation config={config} />",
        "",
    ].join('\n')
    fs.writeFileSync(path.join(srcDir, 'index.jsx'), indexContent, 'utf-8')

    // 6. Update registry.js
    updateRegistry(slug, title)

    // 7. Update og-data.js for WhatsApp/Facebook previews
    try {
        updateOgData(slug, title, config.eventType)
    } catch (e) {
        console.warn(`[Admin] No se pudo actualizar og-data.js para "${slug}":`, e.message)
    }

    return { slug, path: `/i/${slug}`, rsvpLink: `/i/${slug}/rsvp?key=${rsvpKey}` }
}


// ─── DELETE INVITATION ──────────────────────────────────────────
function deleteInvitation(slug) {
    if (slug === 'kassandra-brian') {
        throw new Error('No se puede eliminar la invitación default (kassandra-brian)')
    }
    if (slug === 'melani-marisol') {
        throw new Error('No se puede eliminar la plantilla base (melani-marisol)')
    }

    const srcDir = path.join(INVITATIONS_SRC, slug)
    const publicDir = path.join(INVITATIONS_PUBLIC, slug)

    if (!fs.existsSync(srcDir)) {
        throw new Error(`La invitación "${slug}" no existe`)
    }

    fs.rmSync(srcDir, { recursive: true, force: true })
    if (fs.existsSync(publicDir)) {
        fs.rmSync(publicDir, { recursive: true, force: true })
    }
    removeFromRegistry(slug)

    // Limpiar og-data.js
    try {
        removeFromOgData(slug)
    } catch (e) {
        console.warn(`[Admin] No se pudo limpiar og-data.js para "${slug}":`, e.message)
    }
}

// ─── REGISTRY HELPERS ───────────────────────────────────────────
function updateRegistry(slug, title) {
    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8')

    const newEntry = `    {
        slug: '${slug}',
        title: '${title}',
        component: lazy(() => import('./${slug}/index.jsx')),
        enabled: true,
    },`

    const arrayEndIndex = content.indexOf('\n]')
    if (arrayEndIndex === -1) {
        throw new Error('No se pudo encontrar el array de invitaciones en registry.js')
    }

    content = content.slice(0, arrayEndIndex) + '\n' + newEntry + '\n' + content.slice(arrayEndIndex)
    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8')
}

function removeFromRegistry(slug) {
    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8')
    const regex = new RegExp(`\\s*\\{[^}]*slug:\\s*['"]${slug}['"][^}]*\\},?`, 'g')
    content = content.replace(regex, '')
    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8')
}

// ─── OG-DATA HELPERS ────────────────────────────────────────────
const EVENT_EMOJIS = { xv: '✨', boda: '💕', bautizo: '👶', cumple: '🎂', 'primera-comunion': '🕊️' }
const EVENT_DESCRIPTIONS = {
    xv: 'Estás invitado(a) a la celebración de mis XV años. ¡Toca aquí para ver la invitación!',
    boda: 'Te invitamos a celebrar nuestra boda. ¡Toca aquí para ver la invitación completa!',
    bautizo: 'Te invitamos a celebrar este día tan especial. ¡Toca aquí para ver la invitación!',
    cumple: '¡Estás invitad@! Toca aquí para ver la invitación y confirmar tu asistencia.',
    'primera-comunion': 'Te invito a celebrar mi Primera Comunión. ¡Toca aquí para confirmar tu asistencia!',
}

function updateOgData(slug, title, eventType) {
    if (!fs.existsSync(OG_DATA_PATH)) return

    let content = fs.readFileSync(OG_DATA_PATH, 'utf-8')

    // No duplicar si ya existe
    if (content.includes(`'${slug}'`) || content.includes(`"${slug}"`)) return

    const emoji = EVENT_EMOJIS[eventType] || '🎉'
    const description = EVENT_DESCRIPTIONS[eventType] || '¡Estás invitad@! Toca aquí para ver la invitación y confirmar tu asistencia.'

    const newEntry = `    '${slug}': {
        title: '${title.replace(/'/g, "\\'")} ${emoji}',
        description: '${description}',
        image: '/invitations/${slug}/img/og-preview.jpg',
    },`

    // Insertar antes del cierre del objeto }
    const closingIndex = content.lastIndexOf('}')
    if (closingIndex === -1) return

    content = content.slice(0, closingIndex) + newEntry + '\n' + content.slice(closingIndex)
    fs.writeFileSync(OG_DATA_PATH, content, 'utf-8')
}

function removeFromOgData(slug) {
    if (!fs.existsSync(OG_DATA_PATH)) return

    let content = fs.readFileSync(OG_DATA_PATH, 'utf-8')
    // Eliminar el bloque completo del slug (con comillas simples o dobles)
    const regex = new RegExp(`\\s*['"]${slug}['"]:\\s*\\{[^}]*\\},?`, 'g')
    content = content.replace(regex, '')
    fs.writeFileSync(OG_DATA_PATH, content, 'utf-8')
}

// ─── TOGGLE INVITATION ─────────────────────────────────────────
function toggleInvitation(slug) {
    if (slug === 'kassandra-brian') {
        throw new Error('No se puede desactivar la invitación default (kassandra-brian)')
    }

    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8')

    // Find the block for this slug
    const blockRegex = new RegExp(`(\\{[^}]*slug:\\s*['"]${slug}['"][^}]*)enabled:\\s*(true|false)`, 's')
    const match = content.match(blockRegex)

    if (!match) {
        throw new Error(`Invitación "${slug}" no encontrada en el registro`)
    }

    const currentState = match[2] === 'true'
    const newState = !currentState
    content = content.replace(blockRegex, `$1enabled: ${newState}`)
    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8')
    return newState
}

// ─── GIT DEPLOY ─────────────────────────────────────────────────
function gitDeploy(commitMsg) {
    const PROJECT_ROOT = path.resolve('.')
    return new Promise((resolve, reject) => {
        // Stage all changes, commit, and push
        exec(
            `git add . && git commit -m "${commitMsg.replace(/"/g, '\\"')}" && git push`,
            { cwd: PROJECT_ROOT, timeout: 60000 },
            (error, stdout, stderr) => {
                if (error) {
                    // If nothing to commit, that's not a real error
                    if (stderr?.includes('nothing to commit') || stdout?.includes('nothing to commit')) {
                        resolve({ deployed: false, message: 'No hay cambios para publicar' })
                        return
                    }
                    reject(new Error(stderr || error.message))
                    return
                }
                resolve({ deployed: true, message: 'Cambios publicados exitosamente', output: stdout })
            }
        )
    })
}

// ─── DEPLOY STATUS ──────────────────────────────────────────────
function getDeployStatus() {
    const PROJECT_ROOT = path.resolve('.')
    return new Promise((resolve, reject) => {
        exec(
            'git status --porcelain',
            { cwd: PROJECT_ROOT, timeout: 10000 },
            (error, stdout) => {
                if (error) {
                    reject(new Error(error.message))
                    return
                }
                const changes = stdout.trim().split('\n').filter(Boolean)
                resolve({
                    hasChanges: changes.length > 0,
                    changeCount: changes.length,
                    files: changes.slice(0, 20), // Limit to 20 for display
                })
            }
        )
    })
}
