import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import {
    beginPublication,
    getPublicationHistory,
    recordPublication,
    restoreLatestPublication,
} from './publication-history.mjs'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'invita-history-'))

function git(...args) {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', windowsHide: true })
}

try {
    git('init')
    git('config', 'user.name', 'Invita History Test')
    git('config', 'user.email', 'history-test@example.invalid')
    git('config', 'core.autocrlf', 'false')

    fs.writeFileSync(path.join(root, '.gitignore'), '.invita-history/\n', 'utf8')
    fs.writeFileSync(path.join(root, 'existing.txt'), 'before\n', 'utf8')
    git('add', '.')
    git('commit', '-m', 'initial')

    const pending = beginPublication(root, 'publish test')
    fs.writeFileSync(path.join(root, 'existing.txt'), 'after\n', 'utf8')
    fs.writeFileSync(path.join(root, 'new.bin'), Buffer.from([0, 1, 2, 255]))
    git('add', '.')
    git('commit', '-m', 'publish test')
    const publishedCommit = git('rev-parse', 'HEAD').trim()
    recordPublication(root, pending, publishedCommit)

    const beforeRestore = getPublicationHistory(root)
    assert.equal(beforeRestore.publications.length, 1)
    assert.equal(beforeRestore.latest.canRestore, true)
    assert.deepEqual(beforeRestore.latest.files.sort(), ['existing.txt', 'new.bin'])

    const result = restoreLatestPublication(root)
    assert.equal(result.publishedCommit, publishedCommit)
    assert.equal(fs.readFileSync(path.join(root, 'existing.txt'), 'utf8'), 'before\n')
    assert.equal(fs.existsSync(path.join(root, 'new.bin')), false)
    assert.match(git('status', '--short'), /existing\.txt/)
    assert.match(git('status', '--short'), /new\.bin/)

    const afterRestore = getPublicationHistory(root)
    assert.ok(afterRestore.latest.restoredAt)
    console.log('Publication history restore test passed')
} finally {
    fs.rmSync(root, { recursive: true, force: true })
}
