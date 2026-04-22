import fs from 'fs'
import path from 'path'

const TEMPLATES_DIR = path.resolve('src/templates')
const INVITATIONS_SRC = path.resolve('src/invitations')
const INVITATIONS_PUBLIC = path.resolve('public/invitations')
const REGISTRY_PATH = path.resolve('src/invitations/registry.js')

/**
 * Vite plugin that adds admin API endpoints (dev mode only).
 */
export default function devAdminPlugin() {
    return {
        name: 'dev-admin-api',
        apply: 'serve', // Only in dev mode

        configureServer(server) {
            // Parse JSON body
            const parseBody = (req) =>
                new Promise((resolve, reject) => {
                    let body = ''
                    req.on('data', (chunk) => (body += chunk))
                    req.on('end', () => {
                        try {
                            resolve(JSON.parse(body))
                        } catch {
                            resolve({})
                        }
                    })
                    req.on('error', reject)
                })

            server.middlewares.use(async (req, res, next) => {
                // GET /api/invitations
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

                // POST /api/invitations
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

                // MATCH SLUG
                const slugMatch = req.url?.match(/^\/api\/invitations\/([a-z0-9-]+)$/)

                // GET /api/invitations/:slug
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

                // PUT /api/invitations/:slug
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
                        
                        // Overwrite config.json
                        if (data.config) {
                            fs.writeFileSync(configPath, JSON.stringify(data.config, null, 2), 'utf-8')
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
    // Parse the invitations array from the registry source
    const entries = []
    const regex = /\{\s*slug:\s*'([^']+)',\s*title:\s*'([^']+)',/g
    let match
    while ((match = regex.exec(content)) !== null) {
        const slug = match[1]
        const isDefault = content.substring(match.index, content.indexOf('}', match.index)).includes('isDefault: true')
        
        let rsvpKey = null
        try {
            const configPath = path.join(INVITATIONS_SRC, slug, 'config.json')
            if (fs.existsSync(configPath)) {
                const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
                rsvpKey = configData.rsvpKey || null
            }
        } catch (e) {}

        entries.push({ slug, title: match[2], isDefault, rsvpKey })
    }
    return entries
}

// ─── CREATE INVITATION ──────────────────────────────────────────
function createInvitation(data) {
    const { slug, title, templateName, config } = data

    if (!slug || !title || !templateName || !config) {
        throw new Error('Faltan datos: slug, title, templateName, y config son requeridos')
    }

    // Validate slug
    if (!/^[a-z0-9-]+$/.test(slug)) {
        throw new Error('El slug solo puede contener letras minúsculas, números y guiones')
    }

    const srcDir = path.join(INVITATIONS_SRC, slug)
    const publicDir = path.join(INVITATIONS_PUBLIC, slug)
    const imgDir = path.join(publicDir, 'img')
    const audioDir = path.join(publicDir, 'audio')

    // Check if already exists
    if (fs.existsSync(srcDir)) {
        throw new Error(`La invitación "${slug}" ya existe`)
    }

    // 1. Create directories
    fs.mkdirSync(srcDir, { recursive: true })
    fs.mkdirSync(imgDir, { recursive: true })
    fs.mkdirSync(audioDir, { recursive: true })

    // 2. Auto-generate RSVP access key
    const rsvpKey = Math.random().toString(36).substring(2, 8)
    config.rsvpKey = rsvpKey

    // 3. Write config.json
    fs.writeFileSync(
        path.join(srcDir, 'config.json'),
        JSON.stringify(config, null, 2),
        'utf-8'
    )

    // 4. Write rsvp-access.json to public (for runtime Dashboard verification)
    fs.writeFileSync(
        path.join(publicDir, 'rsvp-access.json'),
        JSON.stringify({ key: rsvpKey }),
        'utf-8'
    )

    // 3. Generate lightweight wrapper index.jsx
    //    Instead of copying the entire template (300+ lines), we generate a tiny
    //    wrapper that imports the shared template and passes its config as a prop.
    const templateFile = path.join(TEMPLATES_DIR, `${templateName}.jsx`)
    if (!fs.existsSync(templateFile)) {
        throw new Error(`La plantilla ${templateName} no existe: ${templateFile}`)
    }

    // Store template name in config for reference
    config.templateName = templateName

    const wrapperContent = `import config from './config.json'
import ${templateName} from '../../templates/${templateName}'

export default function Invitation() {
    return <${templateName} config={config} />
}
`
    fs.writeFileSync(path.join(srcDir, 'index.jsx'), wrapperContent, 'utf-8')

    // 5. Update registry.js
    updateRegistry(slug, title)

    return { slug, path: `/i/${slug}`, rsvpLink: `/i/${slug}/rsvp?key=${rsvpKey}` }
}

// ─── DELETE INVITATION ──────────────────────────────────────────
function deleteInvitation(slug) {
    if (slug === 'kassandra-brian') {
        throw new Error('No se puede eliminar la invitación default')
    }

    const srcDir = path.join(INVITATIONS_SRC, slug)
    const publicDir = path.join(INVITATIONS_PUBLIC, slug)

    if (!fs.existsSync(srcDir)) {
        throw new Error(`La invitación "${slug}" no existe`)
    }

    // Remove source files
    fs.rmSync(srcDir, { recursive: true, force: true })

    // Remove public assets
    if (fs.existsSync(publicDir)) {
        fs.rmSync(publicDir, { recursive: true, force: true })
    }

    // Remove from registry
    removeFromRegistry(slug)
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

    // Insert before the closing bracket of the array
    // Find the last ] in the invitations array
    const arrayEndIndex = content.indexOf('\n]')
    if (arrayEndIndex === -1) {
        throw new Error('No se pudo encontrar el array de invitaciones en registry.js')
    }

    content = content.slice(0, arrayEndIndex) + '\n' + newEntry + '\n' + content.slice(arrayEndIndex)
    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8')
}

function removeFromRegistry(slug) {
    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8')

    // Remove the block for this slug
    const regex = new RegExp(
        `\\s*\\{[^}]*slug:\\s*'${slug}'[^}]*\\},?`,
        'g'
    )
    content = content.replace(regex, '')

    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8')
}
