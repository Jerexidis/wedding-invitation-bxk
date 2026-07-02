import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const SRC_ROOT = path.join(ROOT, 'src', 'invitations')
const PUBLIC_ROOT = path.join(ROOT, 'public', 'invitations')
const REGISTRY_PATH = path.join(SRC_ROOT, 'registry.js')
const MARKDOWN_PATH = path.join(ROOT, 'docs', 'INVITATIONS.md')
const JSON_PATH = path.join(ROOT, 'docs', 'invitations.inventory.json')

const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])
const AUDIO_EXTENSIONS = new Set(['.aac', '.m4a', '.mp3', '.ogg', '.wav', '.webm'])

function slash(value) {
    return value.replaceAll(path.sep, '/')
}

function relative(value) {
    return slash(path.relative(ROOT, value))
}

function readJson(filePath) {
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function listFiles(root) {
    if (!fs.existsSync(root)) return []

    const files = []
    const visit = (directory) => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const fullPath = path.join(directory, entry.name)
            if (entry.isDirectory()) visit(fullPath)
            else if (entry.isFile()) files.push(fullPath)
        }
    }
    visit(root)
    return files.sort((a, b) => a.localeCompare(b))
}

function classifyArchitecture(sourceDirectory, entrySource, sourceFiles) {
    if (entrySource.includes('DynamicInvitation')) return 'shared-config'
    if (sourceFiles.some((file) => slash(file).includes('/components/'))) return 'dedicated-components'
    if (sourceFiles.some((file) => /Override\.jsx$/.test(file))) return 'hybrid-overrides'
    if (entrySource.includes('../../components/invitation/')) return 'custom-composition'
    return 'standalone-custom'
}

function summarizeAssets(publicDirectory) {
    const files = listFiles(publicDirectory)
    let bytes = 0
    let images = 0
    let audio = 0

    for (const file of files) {
        const extension = path.extname(file).toLowerCase()
        bytes += fs.statSync(file).size
        if (IMAGE_EXTENSIONS.has(extension)) images += 1
        if (AUDIO_EXTENSIONS.has(extension)) audio += 1
    }

    return {
        files: files.length,
        images,
        audio,
        bytes,
        megabytes: Number((bytes / 1024 / 1024).toFixed(2)),
    }
}

function listRelevantSourceFiles(sourceDirectory) {
    return listFiles(sourceDirectory)
        .filter((file) => {
            const extension = path.extname(file).toLowerCase()
            return ['.css', '.js', '.json', '.jsx', '.md', '.ts', '.tsx'].includes(extension)
                && !slash(file).includes('/.backups/')
        })
        .map(relative)
}

function resolveServices(config, sourceText, registryRsvpMode) {
    const rsvpMode = config?.rsvp?.mode || registryRsvpMode || null
    const source = sourceText.toLowerCase()
    return {
        rsvp: rsvpMode,
        gallery: config?.gallery?.enabled !== false && (Boolean(config?.gallery) || source.includes('gallery')),
        audio: Boolean(
            config?.hero?.audio
            || config?.hero?.audioFile
            || config?.hero?.music
            || source.includes('audio')
            || source.includes('.mp3')
            || source.includes('.m4a')
            || source.includes('.webm'),
        ),
        calendar: Boolean(config?.calendar || source.includes('calendar')),
    }
}

async function buildInventory() {
    const registryUrl = `${pathToFileURL(REGISTRY_PATH).href}?inventory=${Date.now()}`
    const { default: invitations } = await import(registryUrl)

    return {
        version: 1,
        generatedFrom: [
            'src/invitations/registry.js',
            'src/invitations/<slug>/',
            'public/invitations/<slug>/',
        ],
        invitations: invitations.map((invitation) => {
            const sourceDirectory = path.join(SRC_ROOT, invitation.slug)
            const publicDirectory = path.join(PUBLIC_ROOT, invitation.slug)
            const entryPath = path.join(sourceDirectory, 'index.jsx')
            const configPath = path.join(sourceDirectory, 'config.json')
            const entrySource = fs.existsSync(entryPath) ? fs.readFileSync(entryPath, 'utf8') : ''
            const config = readJson(configPath)
            const sourceFiles = listRelevantSourceFiles(sourceDirectory)
            const sourceText = sourceFiles
                .map((file) => fs.readFileSync(path.join(ROOT, file), 'utf8'))
                .join('\n')

            return {
                slug: invitation.slug,
                title: invitation.title,
                architecture: classifyArchitecture(sourceDirectory, entrySource, sourceFiles),
                enabled: invitation.enabled !== false,
                demo: invitation.isDemo === true,
                eventType: invitation.eventType || config?.eventType || null,
                eventDate: invitation.eventDate || config?.countdown?.targetDate || null,
                portfolioGalleryAllowed: invitation.portfolioGalleryAllowed === true,
                services: resolveServices(config, sourceText, invitation.rsvpMode),
                sourceFiles,
                designBrief: sourceFiles.find((file) => file.endsWith('/DESIGN.md')) || null,
                assets: summarizeAssets(publicDirectory),
            }
        }),
    }
}

function renderJson(inventory) {
    return `${JSON.stringify(inventory, null, 2)}\n`
}

function renderMarkdown(inventory) {
    const lines = [
        '# Invitation inventory',
        '',
        '<!-- Generated by scripts/invitation-inventory.mjs. Do not edit manually. -->',
        '',
        'Read `docs/CODEBASE.md` for global architecture. Use this file to select',
        'the minimum invitation-specific files needed for a task.',
        '',
        '| Slug | Architecture | Event | RSVP | Source | Assets |',
        '| --- | --- | --- | --- | ---: | ---: |',
    ]

    for (const invitation of inventory.invitations) {
        lines.push(
            `| \`${invitation.slug}\` | ${invitation.architecture} | ${invitation.eventType || '—'} | ${invitation.services.rsvp || 'custom/none'} | ${invitation.sourceFiles.length} files | ${invitation.assets.megabytes.toFixed(2)} MB |`,
        )
    }

    lines.push('', '## Targeted context', '')

    for (const invitation of inventory.invitations) {
        const flags = [
            invitation.demo ? 'demo' : null,
            invitation.portfolioGalleryAllowed ? 'portfolio gallery allowed' : null,
            invitation.services.gallery ? 'gallery' : null,
            invitation.services.audio ? 'audio' : null,
            invitation.services.calendar ? 'calendar' : null,
        ].filter(Boolean)

        lines.push(`### ${invitation.slug}`, '')
        lines.push(`- Entry: \`src/invitations/${invitation.slug}/index.jsx\``)
        lines.push(`- Architecture: \`${invitation.architecture}\``)
        lines.push(`- Flags: ${flags.length ? flags.join(', ') : 'none'}`)
        if (invitation.designBrief) lines.push(`- Design brief: \`${invitation.designBrief}\``)
        lines.push(`- Source: ${invitation.sourceFiles.map((file) => `\`${file}\``).join(', ')}`)
        lines.push('')
    }

    lines.push(
        '## Refresh',
        '',
        '```bash',
        'npm run context:check',
        'npm run context:refresh',
        '```',
        '',
    )

    return lines.join('\n')
}

function compareFile(filePath, expected) {
    return fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === expected
}

async function main() {
    const command = process.argv[2] || 'check'
    const inventory = await buildInventory()
    const json = renderJson(inventory)
    const markdown = renderMarkdown(inventory)

    if (command === 'refresh') {
        fs.mkdirSync(path.dirname(MARKDOWN_PATH), { recursive: true })
        fs.writeFileSync(JSON_PATH, json, 'utf8')
        fs.writeFileSync(MARKDOWN_PATH, markdown, 'utf8')
        console.log(`Updated ${relative(MARKDOWN_PATH)} and ${relative(JSON_PATH)}`)
        return
    }

    if (command === 'check') {
        const stale = [
            compareFile(MARKDOWN_PATH, markdown) ? null : relative(MARKDOWN_PATH),
            compareFile(JSON_PATH, json) ? null : relative(JSON_PATH),
        ].filter(Boolean)

        if (stale.length) {
            console.error(`Invitation context is stale: ${stale.join(', ')}`)
            console.error('Run: npm run context:refresh')
            process.exitCode = 1
            return
        }

        console.log('Invitation context is current')
        return
    }

    console.error(`Unknown command: ${command}`)
    console.error('Use: refresh | check')
    process.exitCode = 1
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
