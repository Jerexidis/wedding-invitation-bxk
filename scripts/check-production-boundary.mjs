import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const DIST_ROOT = path.join(ROOT, 'dist')
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.map', '.txt'])

const FORBIDDEN_PATH_NAMES = new Set([
    'rsvp-keys.json',
])

const FORBIDDEN_TEXT = [
    'plugins/rsvp-keys.json',
    'src/admin/AdminPanel',
    '/api/deploy/status',
    '/api/invitations',
]

function listFiles(root) {
    const files = []
    const visit = (directory) => {
        for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
            const fullPath = path.join(directory, entry.name)
            if (entry.isDirectory()) visit(fullPath)
            else if (entry.isFile()) files.push(fullPath)
        }
    }
    visit(root)
    return files
}

function relative(filePath) {
    return path.relative(ROOT, filePath).replaceAll(path.sep, '/')
}

function main() {
    if (!fs.existsSync(DIST_ROOT)) {
        console.error('Production boundary check requires an existing dist/. Run npm run build first.')
        process.exitCode = 1
        return
    }

    const violations = []

    for (const file of listFiles(DIST_ROOT)) {
        if (FORBIDDEN_PATH_NAMES.has(path.basename(file).toLowerCase())) {
            violations.push(`${relative(file)}: forbidden local file`)
            continue
        }

        if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) continue
        const content = fs.readFileSync(file, 'utf8')
        for (const marker of FORBIDDEN_TEXT) {
            if (content.includes(marker)) {
                violations.push(`${relative(file)}: contains ${JSON.stringify(marker)}`)
            }
        }
    }

    if (violations.length) {
        console.error('Local-only tooling leaked into the production output:')
        for (const violation of violations) console.error(`- ${violation}`)
        process.exitCode = 1
        return
    }

    console.log('Production boundary is clean: local admin tooling is absent from dist/')
}

main()
