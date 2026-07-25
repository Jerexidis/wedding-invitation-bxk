import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Camera,
    CheckCircle2,
    Heart,
    Images,
    LoaderCircle,
    RefreshCw,
    Upload,
    X,
} from 'lucide-react'
import {
    albumLimits,
    isAlbumConfigured,
    listAlbumPhotos,
    uploadAlbumPhoto,
    validateAlbumFiles,
} from '../utils/albumStore'
import './shared-album.css'

function PhotoCard({ photo, onOpen }) {
    return (
        <button
            className="album-photo"
            type="button"
            onClick={() => onOpen(photo)}
            aria-label="Abrir fotografía"
        >
            <img src={photo.url} alt="Recuerdo compartido por un invitado" loading="lazy" />
        </button>
    )
}

export default function SharedAlbum({
    className = '',
    eventFolder = 'evento-principal',
    kicker = 'Nuestro evento',
    title = 'Álbum compartido',
    intro = 'Ayúdanos a guardar cada sonrisa, abrazo y momento especial que vivamos juntos.',
    sectionLabel = 'Recuerdos compartidos',
    galleryTitle = 'Nuestros momentos',
    emptyTitle = 'La primera foto puede ser tuya',
    emptyText = 'Comparte un momento y comienza este álbum con nosotros.',
    footerText = 'Gracias por ser parte de nuestra historia',
    heroImage = null,
    heroImageAlt = '',
    invitationHref = null,
    invitationLabel = 'Volver a la invitación',
}) {
    const inputRef = useRef(null)
    const [photos, setPhotos] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [previewUrls, setPreviewUrls] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadedCount, setUploadedCount] = useState(0)
    const [message, setMessage] = useState(null)
    const [activePhoto, setActivePhoto] = useState(null)

    const loadPhotos = useCallback(async (quiet = false) => {
        if (!quiet) setRefreshing(true)
        try {
            setPhotos(await listAlbumPhotos(eventFolder))
        } catch (error) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [eventFolder])

    useEffect(() => {
        loadPhotos(true)
        const interval = window.setInterval(() => loadPhotos(true), 30000)
        return () => window.clearInterval(interval)
    }, [loadPhotos])

    useEffect(() => {
        const previousTitle = document.title
        document.title = `${title} | Invita-Ya`
        return () => {
            document.title = previousTitle
        }
    }, [title])

    useEffect(() => {
        const urls = selectedFiles.map((file) => URL.createObjectURL(file))
        setPreviewUrls(urls)
        return () => urls.forEach((url) => URL.revokeObjectURL(url))
    }, [selectedFiles])

    useEffect(() => {
        if (!activePhoto) return undefined
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setActivePhoto(null)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [activePhoto])

    function handleSelection(event) {
        setMessage(null)
        try {
            setSelectedFiles(validateAlbumFiles(event.target.files))
        } catch (error) {
            setSelectedFiles([])
            setMessage({ type: 'error', text: error.message })
        }
    }

    function clearSelection() {
        setSelectedFiles([])
        if (inputRef.current) inputRef.current.value = ''
    }

    async function handleUpload() {
        if (!selectedFiles.length || uploading) return

        setUploading(true)
        setUploadedCount(0)
        setMessage(null)

        try {
            for (let index = 0; index < selectedFiles.length; index += 1) {
                await uploadAlbumPhoto(selectedFiles[index], eventFolder)
                setUploadedCount(index + 1)
            }
            const total = selectedFiles.length
            clearSelection()
            setMessage({
                type: 'success',
                text: total === 1
                    ? '¡Tu foto ya forma parte del álbum!'
                    : `¡Tus ${total} fotos ya forman parte del álbum!`,
            })
            await loadPhotos(true)
        } catch (error) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setUploading(false)
        }
    }

    const configured = isAlbumConfigured()

    return (
        <main className={`shared-album ${className}`.trim()}>
            <section className="album-hero">
                <div className="album-hero__glow album-hero__glow--one" />
                <div className="album-hero__glow album-hero__glow--two" />
                <div className="album-hero__content">
                    <div className="album-kicker"><Heart size={14} fill="currentColor" /> {kicker}</div>
                    {heroImage && (
                        <img className="album-hero__image" src={heroImage} alt={heroImageAlt} />
                    )}
                    <h1>{title}</h1>
                    <p>{intro}</p>
                    <button
                        className="album-primary-button"
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={!configured || uploading}
                    >
                        <Camera size={20} />
                        Compartir mis fotos
                    </button>
                    <span className="album-helper">Puedes elegir hasta {albumLimits.maxFiles} fotos por subida</span>
                </div>
            </section>

            <section className="album-content">
                <div className="album-upload-card">
                    <input
                        ref={inputRef}
                        className="album-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                        multiple
                        onChange={handleSelection}
                    />

                    {!selectedFiles.length ? (
                        <button
                            className="album-dropzone"
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={!configured}
                        >
                            <span className="album-dropzone__icon"><Upload size={25} /></span>
                            <strong>Selecciona fotos de tu galería</strong>
                            <span>JPEG, PNG, WebP o HEIC · máximo {albumLimits.maxSourceMegabytes} MB</span>
                        </button>
                    ) : (
                        <div className="album-selection">
                            <div className="album-selection__header">
                                <div>
                                    <strong>{selectedFiles.length} {selectedFiles.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}</strong>
                                    <span>Las optimizaremos antes de subirlas</span>
                                </div>
                                <button type="button" onClick={clearSelection} disabled={uploading} aria-label="Quitar selección">
                                    <X size={19} />
                                </button>
                            </div>
                            <div className="album-previews">
                                {previewUrls.map((url, index) => (
                                    <img key={url} src={url} alt={`Vista previa ${index + 1}`} />
                                ))}
                            </div>
                            <button
                                className="album-primary-button album-primary-button--wide"
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <LoaderCircle className="album-spinner" size={20} />
                                        Subiendo {Math.min(uploadedCount + 1, selectedFiles.length)} de {selectedFiles.length}
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        Subir al álbum
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {!configured && (
                        <div className="album-notice album-notice--error">
                            Falta configurar la conexión con Supabase.
                        </div>
                    )}
                    {message && (
                        <div className={`album-notice album-notice--${message.type}`} role="status">
                            {message.type === 'success' && <CheckCircle2 size={18} />}
                            {message.text}
                        </div>
                    )}
                </div>

                <div className="album-gallery-heading">
                    <div>
                        <span className="album-section-label"><Images size={16} /> {sectionLabel}</span>
                        <h2>{galleryTitle}</h2>
                    </div>
                    <button
                        className="album-refresh"
                        type="button"
                        onClick={() => loadPhotos()}
                        disabled={refreshing}
                        aria-label="Actualizar fotografías"
                    >
                        <RefreshCw className={refreshing ? 'album-spinner' : ''} size={19} />
                    </button>
                </div>

                {loading ? (
                    <div className="album-empty">
                        <LoaderCircle className="album-spinner" size={28} />
                        <p>Cargando recuerdos…</p>
                    </div>
                ) : photos.length ? (
                    <div className="album-gallery">
                        {photos.map((photo) => (
                            <PhotoCard key={photo.id} photo={photo} onOpen={setActivePhoto} />
                        ))}
                    </div>
                ) : (
                    <div className="album-empty">
                        <span><Camera size={28} /></span>
                        <h3>{emptyTitle}</h3>
                        <p>{emptyText}</p>
                    </div>
                )}
            </section>

            <footer className="album-footer">
                <Heart size={15} fill="currentColor" />
                {footerText}
                {invitationHref && (
                    <a className="album-footer__link" href={invitationHref}>{invitationLabel}</a>
                )}
            </footer>

            {activePhoto && (
                <div className="album-lightbox" role="dialog" aria-modal="true" aria-label="Fotografía ampliada" onClick={() => setActivePhoto(null)}>
                    <button type="button" onClick={() => setActivePhoto(null)} aria-label="Cerrar fotografía">
                        <X size={24} />
                    </button>
                    <img src={activePhoto.url} alt="Recuerdo compartido ampliado" onClick={(event) => event.stopPropagation()} />
                </div>
            )}
        </main>
    )
}
