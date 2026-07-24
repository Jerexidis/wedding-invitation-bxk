import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { execFile } from 'child_process'
import {
    analyzeAssets,
    cloneInvitation as cloneLocalInvitation,
    optimizeInvitation,
    renameInvitation as renameLocalInvitation,
    validateInvitation,
} from '../scripts/invitation-tools.mjs'
import {
    activateDraft,
    getDraftActivationPlan,
} from '../scripts/invitation-lifecycle.mjs'
import {
    beginPublication,
    getPublicationHistory,
    recordPublication,
    restoreLatestPublication,
} from '../scripts/publication-history.mjs'

const INVITATIONS_SRC = path.resolve('src/invitations')
const INVITATIONS_PUBLIC = path.resolve('public/invitations')
const REGISTRY_PATH = path.resolve('src/invitations/registry.js')
const OG_DATA_PATH = path.resolve('og-data.js')
const RSVP_KEYS_PATH = path.resolve('plugins/rsvp-keys.json')
let qualityCheckPromise = null

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
                if (req.method === 'POST' && req.url === '/api/quality/run') {
                    try {
                        if (!qualityCheckPromise) {
                            qualityCheckPromise = runQualityCheck()
                                .finally(() => { qualityCheckPromise = null })
                        }
                        const result = await qualityCheckPromise
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify(result))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                if (req.method === 'POST' && req.url === '/api/starters') {
                    try {
                        const data = await parseBody(req)
                        const result = await createCustomStarter(data)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...result }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

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
                if (req.method === 'GET' && req.url === '/api/deploy/history') {
                    try {
                        const history = getPublicationHistory(process.cwd())
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...history }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                if (req.method === 'POST' && req.url === '/api/deploy/undo') {
                    try {
                        const result = restoreLatestPublication(process.cwd())
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...result }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 409
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

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

                // PATCH /api/invitations/:slug/portfolio
                const portfolioMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)\/portfolio$/)
                if (req.method === 'PATCH' && portfolioMatch) {
                    try {
                        const slug = portfolioMatch[1]
                        const newExcluded = togglePortfolioVisibility(slug)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, slug, excludeFromPortfolio: newExcluded }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // GET/POST /api/invitations/:slug/activation
                const activationMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)\/activation$/)
                if (req.method === 'GET' && activationMatch) {
                    try {
                        const plan = getDraftActivationPlan(activationMatch[1])
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, plan }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }
                if (req.method === 'POST' && activationMatch) {
                    try {
                        const data = await parseBody(req)
                        const result = await activateDraft(activationMatch[1], data)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...result }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 400
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // POST /api/invitations/:slug/clone
                const cloneMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)\/clone$/)
                if (req.method === 'POST' && cloneMatch) {
                    try {
                        const slug = cloneMatch[1]
                        const data = await parseBody(req)
                        const result = await cloneLocalInvitation(slug, data.newSlug, { title: data.title })
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...result }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // PATCH /api/invitations/:slug/rename
                const renameMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)\/rename$/)
                if (req.method === 'PATCH' && renameMatch) {
                    try {
                        const slug = renameMatch[1]
                        const data = await parseBody(req)
                        const result = await renameLocalInvitation(slug, data.newSlug)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, ...result }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // GET /api/invitations/:slug/validate
                const validateMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)\/validate$/)
                if (req.method === 'GET' && validateMatch) {
                    try {
                        const slug = validateMatch[1]
                        const report = await validateInvitation(slug)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, report }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // GET /api/invitations/:slug/assets
                const assetsMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)\/assets$/)
                if (req.method === 'GET' && assetsMatch) {
                    try {
                        const slug = assetsMatch[1]
                        const report = await analyzeAssets(slug)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, report }))
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json')
                        res.statusCode = 500
                        res.end(JSON.stringify({ ok: false, error: err.message }))
                    }
                    return
                }

                // POST /api/invitations/:slug/optimize
                const optimizeMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)\/optimize$/)
                if (req.method === 'POST' && optimizeMatch) {
                    try {
                        const slug = optimizeMatch[1]
                        const data = await parseBody(req)
                        const report = await optimizeInvitation(slug, { write: Boolean(data.write) })
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ ok: true, report }))
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
                            delete data.config.rsvpKey
                            backupConfig(slug, configPath)
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
function runQualityCheck() {
    const hasNpmCli = Boolean(process.env.npm_execpath)
    const command = hasNpmCli ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm')
    const args = hasNpmCli
        ? [process.env.npm_execpath, 'run', 'release:check']
        : ['run', 'release:check']
    return new Promise((resolve) => {
        execFile(
            command,
            args,
            {
                cwd: process.cwd(),
                env: { ...process.env, NODE_ENV: 'production' },
                timeout: 300000,
                maxBuffer: 4 * 1024 * 1024,
            },
            async (error, stdout = '', stderr = '') => {
                const output = `${stdout}\n${stderr}`
                const consistency = output.match(/Consistency summary:\s*(\d+) error\(s\),\s*(\d+) warning\(s\)/)
                const browserTests = [...output.matchAll(/(\d+) passed/g)].at(-1)
                const schema = output.match(/Schema validation passed for\s*(\d+)/)
                const workspace = await getDeployStatus()
                const summary = {
                    schemaPassed: Boolean(schema),
                    configInvitations: Number(schema?.[1] || 0),
                    consistencyErrors: Number(consistency?.[1] || 0),
                    consistencyWarnings: Number(consistency?.[2] || 0),
                    contextCurrent: output.includes('Invitation context is current'),
                    productionBoundaryClean: output.includes('Production boundary is clean'),
                    browserTestsPassed: Number(browserTests?.[1] || 0),
                }
                const issues = parseConsistencyIssues(output)
                const outputLines = output
                    .split(/\r?\n/)
                    .map((line) => line.trim())
                    .filter(Boolean)
                const detectedDetails = outputLines
                    .filter((line) => {
                        const normalized = line.toLowerCase()
                        return normalized.startsWith('warning:')
                            || normalized.startsWith('error:')
                            || normalized.includes('failed')
                            || normalized.includes('is stale')
                            || normalized.startsWith('run:')
                            || normalized.startsWith('npm error')
                    })
                    .slice(-30)
                // Some tools report failures without using "error" or "failed".
                // Keep a bounded tail as a fallback so the admin never hides the
                // only useful diagnostic behind a generic message.
                const details = error && detectedDetails.length === 0
                    ? outputLines.slice(-12)
                    : detectedDetails

                resolve({
                    ok: !error,
                    ready: !error
                        && summary.schemaPassed
                        && summary.consistencyErrors === 0
                        && summary.contextCurrent
                        && summary.productionBoundaryClean
                        && summary.browserTestsPassed > 0,
                    summary,
                    issues,
                    workspaceSignature: workspace.signature,
                    details,
                    error: error ? 'La revisión encontró un problema. Revisa los detalles.' : null,
                })
            },
        )
    })
}

function parseConsistencyIssues(output) {
    const issues = []
    let currentSlug = null
    for (const rawLine of output.split(/\r?\n/)) {
        const line = rawLine.trim()
        if (line.startsWith('Consistency summary:')) break
        const status = line.match(/^(?:OK|WARN|ERROR)\s+([a-z0-9-]+)$/)
        if (status) {
            currentSlug = status[1]
            continue
        }
        if (!line.startsWith('warning:') || !currentSlug) continue
        const raw = line.replace(/^warning:\s*/, '')
        let type = 'general'
        let message = raw
        if (raw.startsWith('title differs:')) {
            type = 'title'
            message = 'El título no coincide entre la configuración y el listado.'
        } else if (raw.startsWith('eventDate differs:')) {
            type = 'date'
            message = 'La fecha no coincide entre la configuración y el listado.'
        } else if (raw.includes('Open Graph entry has no active registry invitation')) {
            type = 'open-graph'
            message = 'Existe una vista previa social sin invitación activa.'
        }
        issues.push({ slug: currentSlug, type, message })
    }
    return issues
}

function createCustomStarter(data) {
    const slug = String(data.slug || '').trim()
    const title = String(data.title || '').trim()
    const eventType = String(data.eventType || '').trim()
    const reference = String(data.reference || '').trim()
    if (reference && !fs.existsSync(path.join(INVITATIONS_SRC, reference))) {
        return Promise.reject(new Error('La invitación de referencia no existe'))
    }

    const args = [
        path.resolve('scripts/invitation-starter.mjs'),
        '--slug', slug,
        '--title', title,
        '--event-type', eventType,
    ]
    if (reference) args.push('--reference', reference)
    args.push('--write')

    return new Promise((resolve, reject) => {
        execFile(process.execPath, args, { cwd: process.cwd(), timeout: 30000 }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(String(stderr || stdout || error.message).trim()))
                return
            }
            resolve({
                slug,
                title,
                path: path.join('src', 'invitations', slug).replaceAll(path.sep, '/'),
            })
        })
    })
}

function readRegistry() {
    const content = fs.readFileSync(REGISTRY_PATH, 'utf-8')
    const rsvpKeys = readRsvpKeys()
    const entries = []
    const regex = /\{\s*slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],/g
    let match
    while ((match = regex.exec(content)) !== null) {
        const slug = match[1]
        const block = content.substring(match.index, content.indexOf('}', match.index))
        const isDefault = block.includes('isDefault: true')
        const isDemo = block.includes('isDemo: true')
        const enabled = !block.includes('enabled: false')
        const excludeFromPortfolio = block.includes('excludeFromPortfolio: true')
        const registryEventType = block.match(/eventType:\s*['"]([^'"]+)['"]/)?.[1] || null
        const registryRsvpMode = block.match(/rsvpMode:\s*['"]([^'"]+)['"]/)?.[1] || null
        const registryEventDate = block.match(/eventDate:\s*['"]([^'"]+)['"]/)?.[1] || null

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
            isDemo,
            enabled,
            excludeFromPortfolio,
            hasConfig,
            rsvpMode: config?.rsvp?.mode || registryRsvpMode,
            eventType: config?.eventType || registryEventType,
            eventDate: config?.countdown?.targetDate || registryEventDate,
            rsvpKey: rsvpKeys[slug] || config?.rsvpKey || null,
        })
    }
    const registered = new Set(entries.map((entry) => entry.slug))
    for (const directory of fs.readdirSync(INVITATIONS_SRC, { withFileTypes: true })) {
        if (!directory.isDirectory() || registered.has(directory.name)) continue
        const manifestPath = path.join(INVITATIONS_SRC, directory.name, 'invitation.manifest.json')
        if (!fs.existsSync(manifestPath)) continue
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
            entries.push({
                slug: directory.name,
                title: manifest.title || directory.name,
                isDefault: false,
                enabled: false,
                isDraft: true,
                hasConfig: false,
                rsvpMode: manifest.services?.rsvp || 'none',
                eventType: manifest.eventType || null,
                eventDate: null,
                rsvpKey: null,
            })
        } catch {}
    }
    return entries
}

function readRsvpKeys() {
    try {
        if (!fs.existsSync(RSVP_KEYS_PATH)) return {}
        return JSON.parse(fs.readFileSync(RSVP_KEYS_PATH, 'utf-8'))
    } catch {
        return {}
    }
}

function writeRsvpKey(slug, key) {
    const keys = readRsvpKeys()
    keys[slug] = key
    fs.writeFileSync(RSVP_KEYS_PATH, JSON.stringify(keys, null, 4), 'utf-8')
}

function removeRsvpKey(slug) {
    const keys = readRsvpKeys()
    if (!keys[slug]) return
    delete keys[slug]
    fs.writeFileSync(RSVP_KEYS_PATH, JSON.stringify(keys, null, 4), 'utf-8')
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
    const rsvpKey = crypto.randomBytes(12).toString('base64url')
    config.slug = slug
    delete config.rsvpKey

    // 3. Write config.json
    fs.writeFileSync(
        path.join(srcDir, 'config.json'),
        JSON.stringify(config, null, 4),
        'utf-8'
    )

    // 4. Create a compact design brief for future human/agent context.
    const designBrief = [
        `# ${title}`,
        '',
        '## Technical profile',
        '',
        `- Slug: \`${slug}\``,
        `- Event type: \`${config.eventType || 'other'}\``,
        '- Architecture: `shared-config`',
        '',
        '## Art direction',
        '',
        '<!-- Describe the concept, mood, palette, typography, composition, and references. -->',
        '',
        '## Custom decisions',
        '',
        '<!-- Record durable overrides, unique sections, animations, and constraints. -->',
        '',
        '## Preserve',
        '',
        '<!-- List visual or functional details that future edits must not change. -->',
        '',
    ].join('\n')
    fs.writeFileSync(path.join(srcDir, 'DESIGN.md'), designBrief, 'utf-8')

    // 5. Write rsvp-access.json to public. The raw key stays in a dev-only plugin file.
    writeRsvpKey(slug, rsvpKey)
    const rsvpKeyHash = crypto.createHash('sha256').update(rsvpKey).digest('hex')
    fs.writeFileSync(
        path.join(publicDir, 'rsvp-access.json'),
        JSON.stringify({ hash: rsvpKeyHash }),
        'utf-8'
    )

    // Write uploaded photos if any
    if (data.photos && Array.isArray(data.photos)) {
        for (const photo of data.photos) {
            if (photo.name && photo.data) {
                const base64Data = photo.data.split(';base64,').pop()
                fs.writeFileSync(
                    path.join(imgDir, photo.name),
                    base64Data,
                    'base64'
                )
            }
        }
    }

    // 6. Generate thin index.jsx (uses shared DynamicInvitation)
    const indexContent = [
        "import config from './config.json'",
        "import DynamicInvitation from '../../components/DynamicInvitation'",
        "",
        "export default () => <DynamicInvitation config={config} />",
        "",
    ].join('\n')
    fs.writeFileSync(path.join(srcDir, 'index.jsx'), indexContent, 'utf-8')

    // 7. Update registry.js
    updateRegistry(slug, title)

    // 8. Update og-data.js for WhatsApp/Facebook previews
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
    removeRsvpKey(slug)

    // Limpiar og-data.js
    try {
        removeFromOgData(slug)
    } catch (e) {
        console.warn(`[Admin] No se pudo limpiar og-data.js para "${slug}":`, e.message)
    }
}

function backupConfig(slug, configPath) {
    if (!fs.existsSync(configPath)) return
    const backupDir = path.join(INVITATIONS_SRC, slug, '.backups')
    fs.mkdirSync(backupDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    fs.copyFileSync(configPath, path.join(backupDir, `config.${stamp}.json`))
}

// ─── REGISTRY HELPERS ───────────────────────────────────────────
function updateRegistry(slug, title) {
    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8')

    // Read config to keep showcase/admin metadata in sync.
    let targetDate = null
    let eventType = null
    let rsvpMode = null
    try {
        const configPath = path.join(INVITATIONS_SRC, slug, 'config.json')
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            targetDate = config.countdown?.targetDate
            eventType = config.eventType
            rsvpMode = config.rsvp?.mode
        }
    } catch(e) {}

    const eventTypeLine = eventType ? `\n        eventType: '${eventType}',` : ''
    const rsvpModeLine = rsvpMode ? `\n        rsvpMode: '${rsvpMode}',` : ''
    const dateLine = targetDate ? `\n        eventDate: '${targetDate}',` : ''
    const newEntry = `    {
        slug: '${slug}',
        title: '${title}',
        component: lazy(() => import('./${slug}/index.jsx')),
        enabled: true,${eventTypeLine}${rsvpModeLine}${dateLine}
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

// ─── TOGGLE PORTFOLIO VISIBILITY ────────────────────────────────
function togglePortfolioVisibility(slug) {
    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8')

    const slugIndex = content.indexOf(`slug: '${slug}'`)
    if (slugIndex === -1) {
        throw new Error(`Invitación "${slug}" no encontrada en el registro`)
    }

    const blockStart = content.lastIndexOf('{', slugIndex)
    const blockEnd = content.indexOf('}', slugIndex)
    if (blockStart === -1 || blockEnd === -1) {
        throw new Error(`Error parsing registry block for "${slug}"`)
    }

    let block = content.substring(blockStart, blockEnd + 1)
    let isExcluded = block.includes('excludeFromPortfolio: true')
    let newBlock

    if (isExcluded) {
        newBlock = block.replace(/\n\s*excludeFromPortfolio:\s*true,?/g, '')
    } else {
        newBlock = block.replace(/,?\s*\}\s*$/, ',\n        excludeFromPortfolio: true,\n    }')
    }

    content = content.substring(0, blockStart) + newBlock + content.substring(blockEnd + 1)
    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8')
    return !isExcluded
}

// ─── GIT DEPLOY ─────────────────────────────────────────────────
function gitDeploy(commitMsg) {
    const PROJECT_ROOT = path.resolve('.')
    const message = String(commitMsg || 'deploy: update invitations').replace(/[\r\n]/g, ' ').trim()
    const pendingHistory = beginPublication(PROJECT_ROOT, message)

    return runGit(['add', '.'], PROJECT_ROOT)
        .then(() => runGit(['commit', '-m', message], PROJECT_ROOT))
        .then((commitResult) => runGit(['push'], PROJECT_ROOT).then((pushResult) => {
            let history = null
            let historyWarning = null
            try {
                history = recordPublication(PROJECT_ROOT, pendingHistory)
            } catch (error) {
                historyWarning = `La publicación terminó, pero no se pudo guardar el historial: ${error.message}`
            }
            return {
                deployed: true,
                message: 'Cambios publicados exitosamente',
                output: `${commitResult.stdout}${pushResult.stdout}`,
                history,
                historyWarning,
            }
        }))
        .catch((error) => {
            const output = `${error.stdout || ''}${error.stderr || ''}`
            if (output.includes('nothing to commit')) {
                return { deployed: false, message: 'No hay cambios para publicar' }
            }
            throw new Error(output || error.message)
        })
}

// ─── DEPLOY STATUS ──────────────────────────────────────────────
function getDeployStatus() {
    const PROJECT_ROOT = path.resolve('.')
    return Promise.all([
        runGit(['status', '--porcelain'], PROJECT_ROOT, 10000),
        runGit(['diff', '--no-ext-diff'], PROJECT_ROOT, 10000),
        runGit(['diff', '--cached', '--no-ext-diff'], PROJECT_ROOT, 10000),
    ]).then(([statusResult, diffResult, cachedResult]) => {
        const stdout = statusResult.stdout
        const changes = stdout.trim().split('\n').filter(Boolean)
        const untrackedState = changes
            .filter((line) => line.startsWith('?? '))
            .map((line) => {
                const filePath = path.resolve(line.slice(3).trim())
                try {
                    const stat = fs.statSync(filePath)
                    return `${line}:${stat.size}:${stat.mtimeMs}`
                } catch {
                    return line
                }
            })
            .join('\n')
        const signature = crypto
            .createHash('sha256')
            .update(`${stdout}\n${diffResult.stdout}\n${cachedResult.stdout}\n${untrackedState}`)
            .digest('hex')
        return {
            hasChanges: changes.length > 0,
            changeCount: changes.length,
            files: changes.slice(0, 20), // Limit to 20 for display
            signature,
        }
    })
}

function runGit(args, cwd, timeout = 60000) {
    return new Promise((resolve, reject) => {
        execFile('git', args, { cwd, timeout, maxBuffer: 4 * 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                error.stdout = stdout
                error.stderr = stderr
                reject(error)
                return
            }
            resolve({ stdout, stderr })
        })
    })
}
