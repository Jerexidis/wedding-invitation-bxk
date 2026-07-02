import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()

function parseArgs(argv) {
    const options = { write: false, reference: null }
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index]
        if (argument === '--write') options.write = true
        else if (argument === '--slug') options.slug = argv[++index]
        else if (argument === '--title') options.title = argv[++index]
        else if (argument === '--event-type') options.eventType = argv[++index]
        else if (argument === '--reference') options.reference = argv[++index]
        else throw new Error(`Unknown argument: ${argument}`)
    }
    return options
}

function buildFiles(options) {
    const sourceRoot = path.join(ROOT, 'src', 'invitations', options.slug)
    const publicRoot = path.join(ROOT, 'public', 'invitations', options.slug)
    const manifest = {
        version: 1,
        slug: options.slug,
        title: options.title,
        eventType: options.eventType,
        architecture: 'standalone-custom',
        status: 'draft',
        registered: false,
        functionalReference: options.reference,
        entry: 'index.jsx',
        styles: ['invitation.css'],
        services: {
            audio: false,
            calendar: false,
            gallery: false,
            rsvp: 'none',
            seo: false,
        },
    }
    const designBrief = `# ${options.title}

## Technical profile

- Slug: \`${options.slug}\`
- Event type: \`${options.eventType}\`
- Architecture: \`standalone-custom\`
- Functional reference: ${options.reference ? `\`${options.reference}\`` : 'none yet'}
- Status: draft and not registered

## Concept

<!-- Describe the original visual story in one or two sentences. -->

## Art direction

- Mood:
- Palette:
- Typography:
- Composition:
- References:

## Structure

- Section order:
- Shared services:
- Custom sections:

## Motion

<!-- Record meaningful animations and interaction behavior. -->

## Preserve

<!-- List details future edits must not change without approval. -->
`
    const component = `import { useEffect } from 'react'
import './invitation.css'

const invitationTitle = ${JSON.stringify(options.title)}

export default function CustomInvitation({ portfolioMode = false }) {
    useEffect(() => {
        const previousTitle = document.title
        document.title = invitationTitle
        return () => { document.title = previousTitle }
    }, [])

    return (
        <main className="custom-invitation" data-portfolio={portfolioMode ? 'true' : 'false'}>
            <section className="custom-invitation__hero" aria-labelledby="invitation-title">
                <p className="custom-invitation__eyebrow">Próximamente</p>
                <h1 id="invitation-title">{invitationTitle}</h1>
                <p>Starter creativo listo para desarrollar.</p>
            </section>

            {/* Add original sections here. Reuse shared hooks/services for behavior. */}
        </main>
    )
}
`
    const styles = `:root {
    --custom-background: #f7f3ed;
    --custom-text: #2d2926;
    --custom-accent: #8c6a4a;
}

.custom-invitation {
    min-height: 100vh;
    overflow-x: hidden;
    background: var(--custom-background);
    color: var(--custom-text);
}

.custom-invitation__hero {
    display: grid;
    min-height: 100svh;
    place-content: center;
    padding: 2rem;
    text-align: center;
}

.custom-invitation__eyebrow {
    color: var(--custom-accent);
    letter-spacing: 0.18em;
    text-transform: uppercase;
}
`
    return new Map([
        [path.join(sourceRoot, 'invitation.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`],
        [path.join(sourceRoot, 'DESIGN.md'), designBrief],
        [path.join(sourceRoot, 'index.jsx'), component],
        [path.join(sourceRoot, 'invitation.css'), styles],
        [path.join(publicRoot, 'img', '.gitkeep'), ''],
        [path.join(publicRoot, 'audio', '.gitkeep'), ''],
    ])
}

function validateOptions(options) {
    const errors = []
    if (!options.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.slug)) {
        errors.push('--slug is required and must contain lowercase letters, numbers, and hyphens')
    }
    if (!options.title?.trim()) errors.push('--title is required')
    if (!options.eventType?.trim()) errors.push('--event-type is required')
    if (options.reference && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.reference)) {
        errors.push('--reference must be an invitation slug')
    }
    if (errors.length) throw new Error(errors.join('\n'))
}

function main() {
    const options = parseArgs(process.argv.slice(2))
    validateOptions(options)
    const files = buildFiles(options)
    const sourceRoot = path.join(ROOT, 'src', 'invitations', options.slug)
    const publicRoot = path.join(ROOT, 'public', 'invitations', options.slug)

    if (fs.existsSync(sourceRoot) || fs.existsSync(publicRoot)) {
        throw new Error(`Invitation path already exists for slug: ${options.slug}`)
    }

    console.log(`${options.write ? 'Creating' : 'Dry run for'} custom invitation: ${options.slug}`)
    for (const file of files.keys()) {
        console.log(`- ${path.relative(ROOT, file).replaceAll(path.sep, '/')}`)
    }

    if (!options.write) {
        console.log('No files written. Add --write when the scaffold is approved.')
        return
    }

    for (const [file, content] of files) {
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, content, 'utf8')
    }
    console.log('Draft created but not registered or published.')
    console.log('Complete DESIGN.md and the implementation before adding it to registry.js.')
}

try {
    main()
} catch (error) {
    console.error(error.message)
    process.exitCode = 1
}
