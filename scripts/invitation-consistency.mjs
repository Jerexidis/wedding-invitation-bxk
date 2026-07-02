import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const REGISTRY_PATH = path.join(ROOT, 'src', 'invitations', 'registry.js')
const OG_DATA_PATH = path.join(ROOT, 'og-data.js')

function readJson(filePath) {
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function comparableDate(value) {
    if (!value) return null
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? String(value) : new Date(parsed).toISOString()
}

function compare(report, label, registryValue, configValue) {
    if (registryValue == null || configValue == null) return
    if (registryValue !== configValue) {
        report.warnings.push(`${label} differs: registry=${JSON.stringify(registryValue)}, config=${JSON.stringify(configValue)}`)
    }
}

async function main() {
    const strict = process.argv.includes('--strict')
    const registryUrl = `${pathToFileURL(REGISTRY_PATH).href}?consistency=${Date.now()}`
    const ogUrl = `${pathToFileURL(OG_DATA_PATH).href}?consistency=${Date.now()}`
    const [{ default: invitations }, { ogData }] = await Promise.all([
        import(registryUrl),
        import(ogUrl),
    ])

    const reports = []
    const slugs = new Set()

    for (const invitation of invitations) {
        const report = { slug: invitation.slug, errors: [], warnings: [] }
        const sourceDirectory = path.join(ROOT, 'src', 'invitations', invitation.slug)
        const publicDirectory = path.join(ROOT, 'public', 'invitations', invitation.slug)
        const entryPath = path.join(sourceDirectory, 'index.jsx')
        const config = readJson(path.join(sourceDirectory, 'config.json'))
        const og = ogData[invitation.slug]

        if (slugs.has(invitation.slug)) report.errors.push('duplicate registry slug')
        slugs.add(invitation.slug)
        if (!fs.existsSync(entryPath)) report.errors.push('missing invitation entry point')
        if (!fs.existsSync(publicDirectory)) report.errors.push('missing public asset directory')
        if (!og) report.errors.push('missing Open Graph entry')

        if (config) {
            compare(report, 'title', invitation.title, config.title)
            compare(report, 'eventType', invitation.eventType, config.eventType)
            compare(report, 'rsvpMode', invitation.rsvpMode, config.rsvp?.mode)
            compare(
                report,
                'eventDate',
                comparableDate(invitation.eventDate),
                comparableDate(config.countdown?.targetDate),
            )
        }

        if (og?.image) {
            const imagePath = path.join(ROOT, 'public', og.image.replace(/^\/+/, ''))
            if (!fs.existsSync(imagePath)) report.errors.push(`Open Graph image does not exist: ${og.image}`)
        }
        reports.push(report)
    }

    for (const slug of Object.keys(ogData)) {
        if (!slugs.has(slug)) {
            reports.push({
                slug,
                errors: [],
                warnings: ['Open Graph entry has no active registry invitation'],
            })
        }
    }

    let errors = 0
    let warnings = 0
    for (const report of reports) {
        errors += report.errors.length
        warnings += report.warnings.length
        if (!report.errors.length && !report.warnings.length) {
            console.log(`OK ${report.slug}`)
            continue
        }
        console.log(`${report.errors.length ? 'ERROR' : 'WARN'} ${report.slug}`)
        for (const error of report.errors) console.log(`  error: ${error}`)
        for (const warning of report.warnings) console.log(`  warning: ${warning}`)
    }

    console.log(`Consistency summary: ${errors} error(s), ${warnings} warning(s)`)
    if (errors || (strict && warnings)) process.exitCode = 1
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
