import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { pathToFileURL } from 'url'

const ROOT = process.cwd()
const SRC_ROOT = path.join(ROOT, 'src', 'invitations')
const PUBLIC_ROOT = path.join(ROOT, 'public', 'invitations')
const REGISTRY_PATH = path.join(SRC_ROOT, 'registry.js')
const RSVP_KEYS_PATH = path.join(ROOT, 'plugins', 'rsvp-keys.json')

const VALID_RSVP_MODES = new Set(['whatsapp', 'supabase', 'mixed', 'none'])
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const AUDIO_EXTENSIONS = new Set(['.mp3', '.m4a', '.wav', '.ogg'])

export function slugify(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

export function isValidSlug(slug) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export function listInvitationSlugs() {
    if (!fs.existsSync(SRC_ROOT)) return []
    return fs.readdirSync(SRC_ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
}

export function cloneInvitation(sourceSlug, targetSlug, options = {}) {
    sourceSlug = slugify(sourceSlug)
    targetSlug = slugify(targetSlug)
    ensureSlug(sourceSlug, 'sourceSlug')
    ensureSlug(targetSlug, 'targetSlug')

    const sourceSrc = path.join(SRC_ROOT, sourceSlug)
    const targetSrc = path.join(SRC_ROOT, targetSlug)
    const sourcePublic = path.join(PUBLIC_ROOT, sourceSlug)
    const targetPublic = path.join(PUBLIC_ROOT, targetSlug)

    if (!fs.existsSync(sourceSrc)) throw new Error(`Source invitation not found: ${sourceSlug}`)
    if (fs.existsSync(targetSrc) || fs.existsSync(targetPublic)) {
        throw new Error(`Target invitation already exists: ${targetSlug}`)
    }

    fs.cpSync(sourceSrc, targetSrc, { recursive: true })
    if (fs.existsSync(sourcePublic)) {
        fs.cpSync(sourcePublic, targetPublic, { recursive: true })
    } else {
        fs.mkdirSync(path.join(targetPublic, 'img'), { recursive: true })
        fs.mkdirSync(path.join(targetPublic, 'audio'), { recursive: true })
    }

    replaceTextInDir(targetSrc, sourceSlug, targetSlug)
    const config = readConfig(targetSlug)
    if (config) {
        config.slug = targetSlug
        if (options.title) config.title = String(options.title)
        if (config.calendar?.icsFilename) config.calendar.icsFilename = `${targetSlug}.ics`
        if (options.title && config.calendar?.icsProdId) config.calendar.icsProdId = String(options.title)
        writeConfig(targetSlug, config)
    }

    const title = options.title || config?.title || readRegistryEntry(sourceSlug)?.title || targetSlug
    appendRegistryEntry(targetSlug, title, config)
    const rsvpKey = rotateRsvpKey(targetSlug)

    return {
        slug: targetSlug,
        path: `/i/${targetSlug}`,
        rsvpLink: `/i/${targetSlug}/rsvp?key=${rsvpKey}`,
        notes: [
            'Registry was updated because the SPA router needs it.',
            'Open Graph metadata was not edited automatically; run validate to review share-preview gaps.',
        ],
    }
}

export function renameInvitation(oldSlug, newSlug) {
    oldSlug = slugify(oldSlug)
    newSlug = slugify(newSlug)
    ensureSlug(oldSlug, 'oldSlug')
    ensureSlug(newSlug, 'newSlug')

    const oldSrc = path.join(SRC_ROOT, oldSlug)
    const newSrc = path.join(SRC_ROOT, newSlug)
    const oldPublic = path.join(PUBLIC_ROOT, oldSlug)
    const newPublic = path.join(PUBLIC_ROOT, newSlug)

    if (!fs.existsSync(oldSrc)) throw new Error(`Invitation not found: ${oldSlug}`)
    if (fs.existsSync(newSrc) || fs.existsSync(newPublic)) {
        throw new Error(`New slug already exists: ${newSlug}`)
    }

    fs.renameSync(oldSrc, newSrc)
    if (fs.existsSync(oldPublic)) fs.renameSync(oldPublic, newPublic)

    replaceTextInDir(newSrc, oldSlug, newSlug)
    const config = readConfig(newSlug)
    if (config) {
        config.slug = newSlug
        if (config.calendar?.icsFilename) config.calendar.icsFilename = `${newSlug}.ics`
        writeConfig(newSlug, config)
    }

    updateRegistrySlug(oldSlug, newSlug, config)
    renameRsvpKey(oldSlug, newSlug)

    return {
        oldSlug,
        slug: newSlug,
        path: `/i/${newSlug}`,
        notes: [
            'Source and public folders were renamed.',
            'Open Graph metadata was not edited automatically; validate will flag old share metadata.',
        ],
    }
}

export async function validateInvitation(slug) {
    slug = slugify(slug)
    ensureSlug(slug, 'slug')

    const report = createReport(slug)
    const srcDir = path.join(SRC_ROOT, slug)
    const publicDir = path.join(PUBLIC_ROOT, slug)
    const config = readConfig(slug)
    const manifest = readManifest(slug)
    const registryEntry = readRegistryEntry(slug)

    if (!fs.existsSync(srcDir)) report.errors.push(`Missing source folder: src/invitations/${slug}`)
    if (!fs.existsSync(path.join(srcDir, 'index.jsx'))) report.errors.push('Missing index.jsx')
    if (!fs.existsSync(publicDir)) report.warnings.push(`Missing public folder: public/invitations/${slug}`)
    if (!config) {
        if (manifest?.status === 'draft' && manifest?.registered === false) {
            if (manifest.slug !== slug) {
                report.errors.push(`invitation.manifest.json slug is "${manifest.slug}", expected "${slug}"`)
            }
            if (!manifest.title) report.errors.push('Missing invitation.manifest.json title')
            if (!manifest.eventType) report.warnings.push('Missing invitation.manifest.json eventType')
            if (registryEntry) report.warnings.push('Draft manifest is unregistered but registry.js contains an entry')
            const hasDraftPreview = fs.existsSync(path.join(srcDir, 'assets', 'og-preview.jpg'))
                || fs.existsSync(path.join(publicDir, 'img', 'og-preview.jpg'))
            if (manifest.services?.seo && !hasDraftPreview) {
                report.warnings.push('Draft enables SEO but og-preview.jpg is missing')
            }
            report.warnings.push('Custom draft is intentionally unregistered; publication checks were skipped')
            await validateAssetHealth(slug, report)
            return finishReport(report)
        }
        report.warnings.push('Legacy invitation without config.json; only folder and registry checks were run')
        if (!registryEntry) report.errors.push('Missing registry.js entry')
        return finishReport(report)
    }

    if (config.slug !== slug) report.errors.push(`config.slug is "${config.slug}", expected "${slug}"`)
    if (!config.title) report.errors.push('Missing config.title')
    if (!config.eventType) report.warnings.push('Missing config.eventType')

    if (!registryEntry) {
        report.errors.push('Missing registry.js entry')
    } else {
        if (!registryEntry.importPath.includes(`./${slug}/index.jsx`)) {
            report.errors.push(`Registry import path does not point to ./${slug}/index.jsx`)
        }
        if (registryEntry.title !== config.title) {
            report.warnings.push(`Registry title differs from config.title`)
        }
    }

    validateDate(config.countdown?.targetDate, 'countdown.targetDate', report.errors)
    validateRequired(config.hero?.backgroundImage, 'hero.backgroundImage', report.errors)
    validateAsset(slug, 'img', config.hero?.backgroundImage, 'hero.backgroundImage', report)
    validateAsset(slug, 'audio', config.hero?.song, 'hero.song', report, false)
    validateAsset(slug, 'img', config.seo?.shareImage, 'seo.shareImage', report, false)

    if (!config.seo?.shareImage) report.warnings.push('Missing seo.shareImage for social previews')
    validateCalendar(config.calendar, report)
    validateEvents(config.events, report)
    validateSectionAssets(slug, config, report)
    validateRsvp(slug, config.rsvp, report)
    await validateAssetHealth(slug, report)

    return finishReport(report)
}

export async function validateAllInvitations() {
    const reports = []
    for (const slug of listInvitationSlugs()) {
        reports.push(await validateInvitation(slug))
    }
    return reports
}

export async function analyzeAssets(slug) {
    slug = slugify(slug)
    ensureSlug(slug, 'slug')

    const publicDir = path.join(PUBLIC_ROOT, slug)
    const files = []
    walk(publicDir, (file) => {
        const ext = path.extname(file).toLowerCase()
        if (!IMAGE_EXTENSIONS.has(ext) && !AUDIO_EXTENSIONS.has(ext)) return
        const stat = fs.statSync(file)
        files.push({
            path: slash(path.relative(ROOT, file)),
            bytes: stat.size,
            kb: Math.round(stat.size / 1024),
            type: IMAGE_EXTENSIONS.has(ext) ? 'image' : 'audio',
            ext,
        })
    })

    files.sort((a, b) => b.bytes - a.bytes)
    return {
        slug,
        totalKb: files.reduce((sum, file) => sum + file.kb, 0),
        largeImages: files.filter((file) => file.type === 'image' && file.bytes > 1_500_000),
        largeAudio: files.filter((file) => file.type === 'audio' && file.bytes > 5_000_000),
        files,
    }
}

export async function optimizeInvitation(slug, options = {}) {
    slug = slugify(slug)
    ensureSlug(slug, 'slug')

    const write = Boolean(options.write)
    const sharp = await loadSharp()
    const publicDir = path.join(PUBLIC_ROOT, slug)
    const results = []

    const imageFiles = []
    walk(publicDir, (file) => {
        if (IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())) imageFiles.push(file)
    })

    for (const file of imageFiles) {
        const before = fs.statSync(file).size
        const ext = path.extname(file).toLowerCase()
        const image = sharp(file).rotate()
        const meta = await image.metadata()
        const resized = meta.width && meta.width > 2200 ? image.resize({ width: 2200, withoutEnlargement: true }) : image
        let buffer

        if (ext === '.jpg' || ext === '.jpeg') {
            buffer = await resized.jpeg({ quality: 82, mozjpeg: true }).toBuffer()
        } else if (ext === '.png') {
            buffer = await resized.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
        } else if (ext === '.webp') {
            buffer = await resized.webp({ quality: 82 }).toBuffer()
        }

        if (!buffer) continue
        const saved = before - buffer.length
        const item = {
            path: slash(path.relative(ROOT, file)),
            before,
            after: buffer.length,
            saved,
            savedKb: Math.max(0, Math.round(saved / 1024)),
            changed: saved > 4096,
            written: false,
        }

        if (write && item.changed) {
            const tmp = `${file}.tmp`
            fs.writeFileSync(tmp, buffer)
            fs.renameSync(tmp, file)
            item.written = true
        }
        results.push(item)
    }

    return {
        slug,
        dryRun: !write,
        optimized: results.filter((item) => item.changed),
        skipped: results.filter((item) => !item.changed),
        totalSavedKb: results.reduce((sum, item) => sum + (item.changed ? item.savedKb : 0), 0),
    }
}

export async function runPreflight(slugOrAll = '--all') {
    const reports = slugOrAll === '--all'
        ? await validateAllInvitations()
        : [await validateInvitation(slugOrAll)]

    const hasErrors = reports.some((report) => report.errors.length > 0)
    const hasWarnings = reports.some((report) => report.warnings.length > 0)
    return {
        ok: !hasErrors,
        hasWarnings,
        reports,
    }
}

function ensureSlug(slug, name) {
    if (!isValidSlug(slug)) throw new Error(`${name} must use lowercase letters, numbers, and single hyphens`)
}

function readConfig(slug) {
    const configPath = path.join(SRC_ROOT, slug, 'config.json')
    if (!fs.existsSync(configPath)) return null
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    } catch {
        return null
    }
}

function readManifest(slug) {
    const manifestPath = path.join(SRC_ROOT, slug, 'invitation.manifest.json')
    if (!fs.existsSync(manifestPath)) return null
    try {
        return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    } catch {
        return null
    }
}

function writeConfig(slug, config) {
    fs.writeFileSync(path.join(SRC_ROOT, slug, 'config.json'), `${JSON.stringify(config, null, 4)}\n`, 'utf-8')
}

function readRegistryEntry(slug) {
    if (!fs.existsSync(REGISTRY_PATH)) return null
    const content = fs.readFileSync(REGISTRY_PATH, 'utf-8')
    const blocks = content.match(/^\s*\{[\s\S]*?\n\s*\},/gm) || []
    const block = blocks.find((candidate) =>
        new RegExp(`slug:\\s*['"]${escapeRegex(slug)}['"]`).test(candidate)
    )
    if (!block) return null
    return {
        slug,
        title: block.match(/title:\s*['"]([^'"]+)['"]/)?.[1] || '',
        importPath: block.match(/import\(['"]([^'"]+)['"]\)/)?.[1] || '',
        enabled: !/enabled:\s*false/.test(block),
        block,
    }
}

function appendRegistryEntry(slug, title, config) {
    if (readRegistryEntry(slug)) throw new Error(`Registry already has slug: ${slug}`)
    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8')
    const eventTypeLine = config?.eventType ? `\n        eventType: '${escapeJs(config.eventType)}',` : ''
    const rsvpModeLine = config?.rsvp?.mode ? `\n        rsvpMode: '${escapeJs(config.rsvp.mode)}',` : ''
    const dateLine = config?.countdown?.targetDate ? `\n        eventDate: '${escapeJs(config.countdown.targetDate)}',` : ''
    const newEntry = `    {\n        slug: '${slug}',\n        title: '${escapeJs(title)}',\n        component: lazy(() => import('./${slug}/index.jsx')),\n        enabled: true,${eventTypeLine}${rsvpModeLine}${dateLine}\n    },`
    const index = content.indexOf('\n]')
    if (index === -1) throw new Error('Could not find registry array end')
    content = `${content.slice(0, index)}\n${newEntry}\n${content.slice(index)}`
    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8')
}

function updateRegistrySlug(oldSlug, newSlug, config) {
    let content = fs.readFileSync(REGISTRY_PATH, 'utf-8')
    const entry = readRegistryEntry(oldSlug)
    if (!entry) throw new Error(`Registry entry not found: ${oldSlug}`)
    let block = entry.block
        .replace(new RegExp(`slug:\\s*['"]${escapeRegex(oldSlug)}['"]`), `slug: '${newSlug}'`)
        .replace(new RegExp(`import\\(['"]\\./${escapeRegex(oldSlug)}/index\\.jsx['"]\\)`), `import('./${newSlug}/index.jsx')`)

    if (config?.title) block = block.replace(/title:\s*['"][^'"]+['"]/, `title: '${escapeJs(config.title)}'`)
    content = content.replace(entry.block, block)
    fs.writeFileSync(REGISTRY_PATH, content, 'utf-8')
}

function readRsvpKeys() {
    try {
        if (!fs.existsSync(RSVP_KEYS_PATH)) return {}
        return JSON.parse(fs.readFileSync(RSVP_KEYS_PATH, 'utf-8'))
    } catch {
        return {}
    }
}

function writeRsvpKeys(keys) {
    fs.mkdirSync(path.dirname(RSVP_KEYS_PATH), { recursive: true })
    fs.writeFileSync(RSVP_KEYS_PATH, `${JSON.stringify(keys, null, 4)}\n`, 'utf-8')
}

function rotateRsvpKey(slug) {
    const key = crypto.randomBytes(12).toString('base64url')
    const keys = readRsvpKeys()
    keys[slug] = key
    writeRsvpKeys(keys)

    const publicDir = path.join(PUBLIC_ROOT, slug)
    fs.mkdirSync(publicDir, { recursive: true })
    const hash = crypto.createHash('sha256').update(key).digest('hex')
    fs.writeFileSync(path.join(publicDir, 'rsvp-access.json'), `${JSON.stringify({ hash }, null, 4)}\n`, 'utf-8')
    return key
}

function renameRsvpKey(oldSlug, newSlug) {
    const keys = readRsvpKeys()
    if (keys[oldSlug]) {
        keys[newSlug] = keys[oldSlug]
        delete keys[oldSlug]
        writeRsvpKeys(keys)
    }
}

function replaceTextInDir(dir, from, to) {
    const textExts = new Set(['.js', '.jsx', '.json', '.css', '.html', '.md', '.txt'])
    walk(dir, (file) => {
        if (!textExts.has(path.extname(file).toLowerCase())) return
        const before = fs.readFileSync(file, 'utf-8')
        const after = before.split(from).join(to)
        if (after !== before) fs.writeFileSync(file, after, 'utf-8')
    })
}

function validateRequired(value, label, errors) {
    if (!value) errors.push(`Missing ${label}`)
}

function validateDate(value, label, errors) {
    if (!value) {
        errors.push(`Missing ${label}`)
        return
    }
    const time = Date.parse(value)
    if (Number.isNaN(time)) errors.push(`Invalid ${label}: ${value}`)
}

function validateAsset(slug, folder, value, label, report, required = true, missingSeverity = 'error') {
    if (!value) {
        if (required) report.errors.push(`Missing ${label}`)
        return
    }
    const fullPath = path.join(PUBLIC_ROOT, slug, folder, value)
    if (!fs.existsSync(fullPath)) {
        const message = `Missing asset for ${label}: public/invitations/${slug}/${folder}/${value}`
        if (missingSeverity === 'warning') report.warnings.push(message)
        else report.errors.push(message)
    }
}

function validateCalendar(calendar, report) {
    if (!calendar) {
        report.warnings.push('Missing calendar config')
        return
    }
    for (const field of ['title', 'description', 'location', 'startDateTime', 'endDateTime', 'outlookStart', 'outlookEnd']) {
        if (!calendar[field]) report.warnings.push(`Missing calendar.${field}`)
    }
    for (const field of ['startDateTime', 'endDateTime']) {
        if (calendar[field] && !/^\d{8}T\d{6}$/.test(calendar[field])) {
            report.warnings.push(`calendar.${field} should use YYYYMMDDTHHMMSS`)
        }
    }
    for (const field of ['outlookStart', 'outlookEnd']) {
        if (calendar[field] && Number.isNaN(Date.parse(calendar[field]))) {
            report.warnings.push(`calendar.${field} is not a valid date`)
        }
    }
}

function validateEvents(events, report) {
    if (!Array.isArray(events) || events.length === 0) {
        report.warnings.push('Missing events[]')
        return
    }
    events.forEach((event, index) => {
        for (const field of ['title', 'location', 'time']) {
            if (!event[field]) report.warnings.push(`events[${index}].${field} is empty`)
        }
        if (event.mapLink && !/^https?:\/\//.test(event.mapLink)) {
            report.warnings.push(`events[${index}].mapLink should be an http(s) URL`)
        }
    })
}

function validateSectionAssets(slug, config, report) {
    if (config.dressCode?.enabled) {
        validateAsset(slug, 'img', config.dressCode.image, 'dressCode.image', report, false, 'warning')
    }
    for (const [index, photo] of (config.gallery?.photos || []).entries()) {
        validateAsset(slug, 'img', photo.src, `gallery.photos[${index}].src`, report)
    }
}

function validateRsvp(slug, rsvp, report) {
    if (!rsvp) {
        report.warnings.push('Missing rsvp config')
        return
    }
    if (!VALID_RSVP_MODES.has(rsvp.mode)) report.errors.push(`Invalid rsvp.mode: ${rsvp.mode}`)
    if ((rsvp.mode === 'whatsapp' || rsvp.mode === 'mixed') && !/^\d{10,15}$/.test(String(rsvp.whatsappNumber || ''))) {
        report.warnings.push('rsvp.whatsappNumber should include country code and digits only')
    }
    if (rsvp.mode === 'supabase' || rsvp.mode === 'mixed') {
        const accessPath = path.join(PUBLIC_ROOT, slug, 'rsvp-access.json')
        if (!fs.existsSync(accessPath)) {
            report.errors.push('Missing public rsvp-access.json')
            return
        }
        try {
            const access = JSON.parse(fs.readFileSync(accessPath, 'utf-8'))
            if (access.key) report.warnings.push('rsvp-access.json uses raw key; prefer hash')
            if (!access.hash && !access.key) report.errors.push('rsvp-access.json needs hash')
            if (access.hash && !/^[a-f0-9]{64}$/i.test(access.hash)) report.errors.push('rsvp-access.json hash is invalid')
        } catch {
            report.errors.push('Invalid rsvp-access.json')
        }
    }
}

async function validateAssetHealth(slug, report) {
    const assets = await analyzeAssets(slug)
    for (const file of assets.largeImages) {
        report.warnings.push(`Large image (${file.kb} KB): ${file.path}`)
    }
    for (const file of assets.largeAudio) {
        report.warnings.push(`Large audio (${file.kb} KB): ${file.path}`)
    }

    const config = readConfig(slug)
    const shareImage = config?.seo?.shareImage
    if (shareImage) {
        const sharePath = path.join(PUBLIC_ROOT, slug, 'img', shareImage)
        if (fs.existsSync(sharePath)) {
            try {
                const sharp = await loadSharp()
                const meta = await sharp(sharePath).metadata()
                if (meta.width && meta.height) {
                    const ratio = meta.width / meta.height
                    if (Math.abs(ratio - 1200 / 630) > 0.08) {
                        report.warnings.push(`seo.shareImage ratio is ${meta.width}x${meta.height}; recommended 1200x630`)
                    }
                }
            } catch {
                report.warnings.push('Could not inspect seo.shareImage dimensions')
            }
        }
    }
}

function createReport(slug) {
    return { slug, ok: false, errors: [], warnings: [], tips: [] }
}

function finishReport(report) {
    report.ok = report.errors.length === 0
    if (report.ok && report.warnings.length === 0) report.tips.push('Ready for local build check')
    return report
}

async function loadSharp() {
    try {
        const mod = await import('sharp')
        return mod.default
    } catch {
        throw new Error('sharp is not available. Run npm ci before asset optimization.')
    }
}

function walk(dir, visitor) {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(fullPath, visitor)
        else visitor(fullPath)
    }
}

function slash(value) {
    return value.replace(/\\/g, '/')
}

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeJs(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function parseArgs(argv) {
    const args = [...argv]
    const command = args.shift()
    const positional = []
    const options = {}
    while (args.length) {
        const arg = args.shift()
        if (arg.startsWith('--')) {
            const key = arg.slice(2)
            const next = args[0]
            options[key] = next && !next.startsWith('--') ? args.shift() : true
        } else {
            positional.push(arg)
        }
    }
    return { command, positional, options }
}

function printReport(report) {
    console.log(`\n${report.ok ? 'OK' : 'FAIL'} ${report.slug}`)
    for (const error of report.errors) console.log(`  error: ${error}`)
    for (const warning of report.warnings) console.log(`  warning: ${warning}`)
    for (const tip of report.tips) console.log(`  tip: ${tip}`)
}

async function main() {
    const { command, positional, options } = parseArgs(process.argv.slice(2))

    if (!command || command === 'help') {
        console.log([
            'Usage:',
            '  node scripts/invitation-tools.mjs clone <sourceSlug> <newSlug> [--title "..."]',
            '  node scripts/invitation-tools.mjs rename <oldSlug> <newSlug>',
            '  node scripts/invitation-tools.mjs validate <slug|--all>',
            '  node scripts/invitation-tools.mjs assets <slug>',
            '  node scripts/invitation-tools.mjs optimize <slug> [--write]',
            '  node scripts/invitation-tools.mjs preflight <slug|--all>',
        ].join('\n'))
        return
    }

    if (command === 'clone') {
        const result = cloneInvitation(positional[0], positional[1], { title: options.title })
        console.log(JSON.stringify(result, null, 2))
        return
    }

    if (command === 'rename') {
        const result = renameInvitation(positional[0], positional[1])
        console.log(JSON.stringify(result, null, 2))
        return
    }

    if (command === 'validate') {
        const target = positional[0] || (options.all ? '--all' : '')
        const reports = target === '--all' ? await validateAllInvitations() : [await validateInvitation(target)]
        reports.forEach(printReport)
        if (reports.some((report) => !report.ok)) process.exitCode = 1
        return
    }

    if (command === 'assets') {
        console.log(JSON.stringify(await analyzeAssets(positional[0]), null, 2))
        return
    }

    if (command === 'optimize') {
        console.log(JSON.stringify(await optimizeInvitation(positional[0], { write: Boolean(options.write) }), null, 2))
        return
    }

    if (command === 'preflight') {
        const target = positional[0] || (options.all ? '--all' : '')
        const result = await runPreflight(target || '--all')
        result.reports.forEach(printReport)
        if (!result.ok) process.exitCode = 1
        return
    }

    throw new Error(`Unknown command: ${command}`)
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (isCli) {
    main().catch((error) => {
        console.error(error.message)
        process.exitCode = 1
    })
}
