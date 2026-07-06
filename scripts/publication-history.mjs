import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execFileSync } from 'node:child_process'

const HISTORY_VERSION = 1
const HISTORY_LIMIT = 20

function historyPath(root) {
    return path.join(root, '.invita-history', 'history.json')
}

function runGit(root, args, options = {}) {
    return execFileSync('git', args, {
        cwd: root,
        encoding: options.binary ? null : 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        timeout: 60000,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        ...options,
    })
}

function readHistory(root) {
    const filePath = historyPath(root)
    if (!fs.existsSync(filePath)) return { version: HISTORY_VERSION, publications: [] }
    try {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        return {
            version: HISTORY_VERSION,
            publications: Array.isArray(parsed.publications) ? parsed.publications : [],
        }
    } catch {
        throw new Error('El historial local de publicaciones está dañado.')
    }
}

function writeHistory(root, history) {
    const filePath = historyPath(root)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    const temporaryPath = `${filePath}.${process.pid}.tmp`
    fs.writeFileSync(temporaryPath, `${JSON.stringify(history, null, 2)}\n`, 'utf8')
    fs.rmSync(filePath, { force: true })
    fs.renameSync(temporaryPath, filePath)
}

function currentCommit(root) {
    return runGit(root, ['rev-parse', 'HEAD']).trim()
}

function commitExists(root, commit) {
    try {
        runGit(root, ['cat-file', '-e', `${commit}^{commit}`])
        return true
    } catch {
        return false
    }
}

function changedFiles(root, fromCommit, toCommit) {
    const output = runGit(root, ['diff', '--name-only', '-z', fromCommit, toCommit], { binary: true })
    return output
        .toString('utf8')
        .split('\0')
        .filter(Boolean)
        .map((file) => file.replaceAll('\\', '/'))
}

function safeWorkspacePath(root, relativePath) {
    const absoluteRoot = path.resolve(root)
    const absolutePath = path.resolve(root, relativePath)
    if (absolutePath !== absoluteRoot && !absolutePath.startsWith(`${absoluteRoot}${path.sep}`)) {
        throw new Error(`Ruta fuera del proyecto: ${relativePath}`)
    }
    return absolutePath
}

function commitHasFile(root, commit, relativePath) {
    try {
        runGit(root, ['cat-file', '-e', `${commit}:${relativePath}`])
        return true
    } catch {
        return false
    }
}

function restoreFile(root, commit, relativePath) {
    const targetPath = safeWorkspacePath(root, relativePath)
    if (!commitHasFile(root, commit, relativePath)) {
        fs.rmSync(targetPath, { force: true })
        return
    }

    const content = runGit(root, ['show', `${commit}:${relativePath}`], { binary: true })
    fs.mkdirSync(path.dirname(targetPath), { recursive: true })
    fs.writeFileSync(targetPath, content)
}

export function beginPublication(root, message) {
    root = path.resolve(root)
    return {
        baseCommit: currentCommit(root),
        message: String(message || 'deploy: update invitations').trim(),
        startedAt: new Date().toISOString(),
    }
}

export function recordPublication(root, pending, publishedCommit = currentCommit(root)) {
    root = path.resolve(root)
    if (!pending?.baseCommit || !commitExists(root, pending.baseCommit)) {
        throw new Error('No se pudo identificar la versión anterior a la publicación.')
    }
    if (!commitExists(root, publishedCommit)) {
        throw new Error('No se pudo identificar el commit publicado.')
    }

    const history = readHistory(root)
    const entry = {
        id: `${Date.now()}-${publishedCommit.slice(0, 8)}`,
        publishedAt: new Date().toISOString(),
        message: pending.message,
        baseCommit: pending.baseCommit,
        publishedCommit,
        files: changedFiles(root, pending.baseCommit, publishedCommit),
        restoredAt: null,
    }
    history.publications.unshift(entry)
    history.publications = history.publications.slice(0, HISTORY_LIMIT)
    writeHistory(root, history)
    return entry
}

export function getPublicationHistory(root) {
    root = path.resolve(root)
    const history = readHistory(root)
    const publications = history.publications.map((entry) => ({
        ...entry,
        canRestore: !entry.restoredAt && commitExists(root, entry.baseCommit) && commitExists(root, entry.publishedCommit),
    }))
    return {
        publications,
        latest: publications[0] || null,
    }
}

export function restoreLatestPublication(root) {
    root = path.resolve(root)
    const history = readHistory(root)
    const entry = history.publications[0]
    if (!entry || entry.restoredAt) throw new Error('La última publicación ya fue restaurada o no existe.')
    if (!commitExists(root, entry.baseCommit) || !commitExists(root, entry.publishedCommit)) {
        throw new Error('Los commits necesarios ya no están disponibles en el repositorio local.')
    }

    const head = currentCommit(root)
    if (head !== entry.publishedCommit) {
        throw new Error('Hay commits posteriores. Solo se puede deshacer la publicación más reciente.')
    }

    const status = runGit(root, ['status', '--porcelain', '--untracked-files=all'])
        .split(/\r?\n/)
        .filter(Boolean)
        .filter((line) => !line.slice(3).replaceAll('\\', '/').startsWith('.invita-history/'))
    if (status.length) {
        throw new Error('Hay cambios locales. Publícalos o guárdalos antes de restaurar una versión.')
    }

    for (const relativePath of entry.files) {
        restoreFile(root, entry.baseCommit, relativePath)
    }

    entry.restoredAt = new Date().toISOString()
    writeHistory(root, history)
    return {
        id: entry.id,
        restoredCommit: entry.baseCommit,
        publishedCommit: entry.publishedCommit,
        files: entry.files,
        message: 'La versión anterior quedó restaurada como cambios locales pendientes de revisión.',
    }
}
