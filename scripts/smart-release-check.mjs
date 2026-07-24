import { execFile, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const ROOT = process.cwd()
const INVENTORY_PATH = path.join(ROOT, 'docs', 'invitations.inventory.json')
const npmCommand = process.env.npm_execpath
    ? process.execPath
    : (process.platform === 'win32' ? 'npm.cmd' : 'npm')
const npmArgsPrefix = process.env.npm_execpath ? [process.env.npm_execpath] : []

function runNpm(args) {
    return new Promise((resolve, reject) => {
        const child = spawn(npmCommand, [...npmArgsPrefix, ...args], {
            cwd: ROOT,
            env: process.env,
            stdio: 'inherit',
        })
        child.on('error', reject)
        child.on('exit', (code) => {
            if (code === 0) resolve()
            else reject(new Error(`npm ${args.join(' ')} exited with code ${code}`))
        })
    })
}

async function getChangedPaths() {
    const [{ stdout: tracked }, { stdout: untracked }] = await Promise.all([
        execFileAsync('git', ['diff', '--name-only', 'HEAD'], { cwd: ROOT }),
        execFileAsync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: ROOT }),
    ])
    return [...new Set(`${tracked}\n${untracked}`
        .split(/\r?\n/)
        .map((file) => file.trim().replaceAll('\\', '/'))
        .filter(Boolean))]
}

function getActiveSlugs() {
    const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'))
    return new Set(
        inventory.invitations
            .filter((invitation) => invitation.enabled)
            .map((invitation) => invitation.slug),
    )
}

export function selectBrowserScope(changedPaths, activeSlugs) {
    const affectedSlugs = new Set()
    const generatedOrDocs = (file) =>
        file === 'docs/INVITATIONS.md'
        || file === 'docs/invitations.inventory.json'
        || file.startsWith('docs/')

    for (const file of changedPaths) {
        if (generatedOrDocs(file)) continue

        const source = file.match(/^src\/invitations\/([^/]+)\//)
        const publicAsset = file.match(/^public\/invitations\/([^/]+)\//)
        const slug = source?.[1] || publicAsset?.[1]
        if (!slug || !activeSlugs.has(slug)) {
            return { full: true, slugs: [] }
        }
        affectedSlugs.add(slug)
    }

    if (affectedSlugs.size === 0) return { full: true, slugs: [] }
    return { full: false, slugs: [...affectedSlugs].sort() }
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function main() {
    await runNpm(['run', 'publish:check'])

    const changedPaths = await getChangedPaths()
    const scope = selectBrowserScope(changedPaths, getActiveSlugs())
    if (scope.full) {
        console.log('Smart production scope: full route suite')
        await runNpm(['run', 'test:routes'])
        return
    }

    console.log(`Smart production scope: ${scope.slugs.join(', ')}`)
    const grep = scope.slugs.map(escapeRegex).join('|')
    await runNpm(['run', 'test:routes', '--', '--grep', grep])
}

const isDirectRun = process.argv[1]
    && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href

if (isDirectRun) {
    main().catch((error) => {
        console.error(error.message)
        process.exitCode = 1
    })
}
