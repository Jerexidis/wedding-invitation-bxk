import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const INVITATIONS_ROOT = path.join(ROOT, 'src', 'invitations')
const SCHEMA_PATH = path.join(ROOT, 'schemas', 'invitation-config.schema.json')

function valueType(value) {
    if (Array.isArray(value)) return 'array'
    if (value === null) return 'null'
    return typeof value
}

function resolveReference(rootSchema, reference) {
    if (!reference.startsWith('#/')) throw new Error(`Unsupported schema reference: ${reference}`)
    return reference
        .slice(2)
        .split('/')
        .reduce((value, key) => value?.[key.replaceAll('~1', '/').replaceAll('~0', '~')], rootSchema)
}

function validateNode(value, rule, location, rootSchema, errors) {
    if (rule.$ref) {
        const referenced = resolveReference(rootSchema, rule.$ref)
        if (!referenced) {
            errors.push(`${location}: unresolved schema reference ${rule.$ref}`)
            return
        }
        validateNode(value, referenced, location, rootSchema, errors)
        return
    }

    if (rule.type && valueType(value) !== rule.type) {
        errors.push(`${location}: expected ${rule.type}, received ${valueType(value)}`)
        return
    }

    if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${location}: expected one of ${rule.enum.join(', ')}`)
    }

    if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
            errors.push(`${location}: must not be empty`)
        }
        if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
            errors.push(`${location}: does not match ${rule.pattern}`)
        }
    }

    if (Array.isArray(value)) {
        if (rule.minItems && value.length < rule.minItems) {
            errors.push(`${location}: requires at least ${rule.minItems} item(s)`)
        }
        if (rule.items) {
            value.forEach((item, index) =>
                validateNode(item, rule.items, `${location}[${index}]`, rootSchema, errors))
        }
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const required of rule.required || []) {
            if (!(required in value)) errors.push(`${location}.${required}: required`)
        }
        for (const [key, childRule] of Object.entries(rule.properties || {})) {
            if (key in value) validateNode(value[key], childRule, `${location}.${key}`, rootSchema, errors)
        }
    }
}

function configFiles(target) {
    if (target && target !== '--all') {
        return [path.join(INVITATIONS_ROOT, target, 'config.json')]
    }
    return fs.readdirSync(INVITATIONS_ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(INVITATIONS_ROOT, entry.name, 'config.json'))
        .filter((file) => fs.existsSync(file))
        .sort()
}

function isValidInvitationDate(value) {
    return !Number.isNaN(Date.parse(value)) || /^\d{8}T\d{6}$/.test(value)
}

function main() {
    const target = process.argv[2] || '--all'
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'))
    const reports = []

    for (const file of configFiles(target)) {
        const slug = path.basename(path.dirname(file))
        const errors = []
        if (!fs.existsSync(file)) {
            errors.push(`${slug}: config.json not found`)
        } else {
            try {
                const config = JSON.parse(fs.readFileSync(file, 'utf8'))
                validateNode(config, schema, '$', schema, errors)
                if (config.slug !== slug) errors.push(`$.slug: expected folder slug ${slug}`)
                for (const [field, value] of [
                    ['$.countdown.targetDate', config.countdown?.targetDate],
                    ['$.calendar.startDateTime', config.calendar?.startDateTime],
                    ['$.calendar.endDateTime', config.calendar?.endDateTime],
                ]) {
                    if (value && !isValidInvitationDate(value)) errors.push(`${field}: invalid date`)
                }
            } catch (error) {
                errors.push(`${slug}: invalid JSON (${error.message})`)
            }
        }
        reports.push({ slug, errors })
    }

    if (!reports.length) {
        console.error('No config-based invitations found')
        process.exitCode = 1
        return
    }

    let totalErrors = 0
    for (const report of reports) {
        if (!report.errors.length) {
            console.log(`OK ${report.slug}`)
            continue
        }
        totalErrors += report.errors.length
        console.error(`ERROR ${report.slug}`)
        for (const error of report.errors) console.error(`  - ${error}`)
    }

    if (totalErrors) {
        console.error(`Schema validation failed with ${totalErrors} error(s)`)
        process.exitCode = 1
        return
    }
    console.log(`Schema validation passed for ${reports.length} config-based invitation(s)`)
}

main()
