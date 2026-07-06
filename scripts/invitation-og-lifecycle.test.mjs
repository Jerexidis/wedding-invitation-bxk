import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'invita-og-lifecycle-'))
const sourceDirectory = path.join(root, 'src', 'invitations', 'source')
const sourceImages = path.join(root, 'public', 'invitations', 'source', 'img')
const toolsUrl = pathToFileURL(path.join(process.cwd(), 'scripts', 'invitation-tools.mjs')).href

try {
    fs.mkdirSync(sourceDirectory, { recursive: true })
    fs.mkdirSync(sourceImages, { recursive: true })
    fs.mkdirSync(path.join(root, 'plugins'), { recursive: true })

    fs.writeFileSync(path.join(sourceDirectory, 'index.jsx'), "export default function Source() { return 'source' }\n")
    fs.writeFileSync(path.join(sourceDirectory, 'config.json'), `${JSON.stringify({
        slug: 'source',
        title: 'Source invitation',
        eventType: 'xv',
        countdown: { targetDate: '2027-01-01T18:00:00-06:00' },
        rsvp: { mode: 'none' },
        seo: { description: 'Source description', shareImage: 'hero.jpg' },
    }, null, 2)}\n`)
    fs.writeFileSync(path.join(root, 'src', 'invitations', 'registry.js'), `import { lazy } from 'react'
const invitations = [
    {
        slug: 'source',
        title: 'Source invitation',
        component: lazy(() => import('./source/index.jsx')),
        enabled: true,
        eventType: 'xv',
        rsvpMode: 'none',
        eventDate: '2027-01-01T18:00:00-06:00',
    },
]
export default invitations
`)
    fs.writeFileSync(path.join(root, 'og-data.js'), `export const ogData = {
    'source': {
        title: 'Source invitation',
        description: 'Source description',
        image: '/invitations/source/img/hero.jpg',
    },
}
`)
    fs.writeFileSync(path.join(root, 'plugins', 'rsvp-keys.json'), '{}\n')
    await sharp({
        create: {
            width: 800,
            height: 1200,
            channels: 3,
            background: '#8b5cf6',
        },
    }).jpeg().toFile(path.join(sourceImages, 'hero.jpg'))

    const childCode = `
        import assert from 'node:assert/strict'
        import fs from 'node:fs'
        import path from 'node:path'
        import { pathToFileURL } from 'node:url'
        const tools = await import(${JSON.stringify(toolsUrl)})
        const clone = await tools.cloneInvitation('source', 'target', { title: 'Target invitation' })
        assert.equal(clone.ogImage, '/invitations/target/img/og-preview.jpg')
        let og = (await import(pathToFileURL(path.join(process.cwd(), 'og-data.js')).href + '?clone=1')).ogData
        assert.equal(og.target.title, 'Target invitation')
        assert.equal(og.target.image, '/invitations/target/img/og-preview.jpg')

        await tools.renameInvitation('target', 'target-renamed')
        og = (await import(pathToFileURL(path.join(process.cwd(), 'og-data.js')).href + '?rename=1')).ogData
        assert.equal(og.target, undefined)
        assert.equal(og['target-renamed'].image, '/invitations/target-renamed/img/og-preview.jpg')
        assert.equal(fs.existsSync(path.join(process.cwd(), 'public/invitations/target-renamed/img/og-preview.jpg')), true)
        assert.equal(fs.existsSync(path.join(process.cwd(), 'public/invitations/target')), false)
        console.log('Invitation clone/rename Open Graph test passed')
    `
    const output = execFileSync(process.execPath, ['--input-type=module', '--eval', childCode], {
        cwd: root,
        encoding: 'utf8',
        windowsHide: true,
        env: process.env,
    })
    assert.match(output, /Open Graph test passed/)
    const renamedImage = await sharp(path.join(root, 'public/invitations/target-renamed/img/og-preview.jpg')).metadata()
    assert.equal(renamedImage.width, 1200)
    assert.equal(renamedImage.height, 630)
    console.log(output.trim())
} finally {
    fs.rmSync(root, { recursive: true, force: true })
}
