import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Heart, ShieldCheck } from 'lucide-react'
import './legal.css'

export default function LegalLayout({ title, description, updatedAt, sections, children }) {
    useEffect(() => {
        const previousTitle = document.title
        document.title = `${title} | Invita-Ya`
        return () => {
            document.title = previousTitle
        }
    }, [title])

    return (
        <div className="legal-page">
            <header className="legal-nav">
                <Link className="legal-brand" to="/" aria-label="Volver a Invita-Ya">
                    <span><Heart size={16} fill="currentColor" /></span>
                    Invita-Ya
                </Link>
                <span className="legal-nav__label">Documentos legales</span>
            </header>

            <main className="legal-shell">
                <header className="legal-hero">
                    <Link className="legal-back" to="/"><ArrowLeft size={16} /> Volver al inicio</Link>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    <time dateTime="2026-08-22">Última actualización: {updatedAt}</time>
                </header>

                <div className="legal-grid">
                    <aside className="legal-index" aria-label="Contenido de esta página">
                        <strong>En esta página</strong>
                        <nav>
                            {sections.map((section) => (
                                <a key={section.id} href={`#${section.id}`}>{section.label}</a>
                            ))}
                        </nav>
                    </aside>

                    <article className="legal-document">
                        <div className="legal-summary">
                            <ShieldCheck size={24} />
                            <p>
                                Este documento explica de forma directa cómo funciona Invita-Ya y qué sucede con la información utilizada por el servicio.
                            </p>
                        </div>
                        {children}
                    </article>
                </div>
            </main>

            <footer className="legal-footer">
                <div>
                    <strong>Invita-Ya</strong>
                    <span>Invitaciones digitales interactivas</span>
                </div>
                <nav aria-label="Documentos legales">
                    <Link to="/privacidad">Privacidad</Link>
                    <Link to="/terminos">Términos</Link>
                    <Link to="/">Inicio <ArrowUpRight size={14} /></Link>
                </nav>
            </footer>
        </div>
    )
}
