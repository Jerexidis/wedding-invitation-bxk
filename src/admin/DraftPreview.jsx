import { lazy, Suspense, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

const invitationModules = import.meta.glob('../invitations/*/index.jsx')
const manifestModules = import.meta.glob('../invitations/*/invitation.manifest.json', {
    eager: true,
    import: 'default',
})

export default function DraftPreview() {
    const { slug } = useParams()
    const entryKey = `../invitations/${slug}/index.jsx`
    const manifestKey = `../invitations/${slug}/invitation.manifest.json`
    const loader = invitationModules[entryKey]
    const manifest = manifestModules[manifestKey]
    const Component = useMemo(() => (loader ? lazy(loader) : null), [loader])
    const isPrivateDraft = manifest?.status === 'draft' && manifest?.registered === false

    if (!Component || !isPrivateDraft) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-100 p-8 text-center text-stone-800">
                <h1 className="font-serif text-4xl">Borrador no encontrado</h1>
                <p>Esta vista sólo abre borradores personalizados locales.</p>
                <Link className="underline" to="/admin">Volver al panel</Link>
            </main>
        )
    }

    return (
        <Suspense fallback={<div className="min-h-screen grid place-items-center bg-stone-100">Cargando borrador…</div>}>
            <Component />
        </Suspense>
    )
}
