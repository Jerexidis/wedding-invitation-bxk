import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const PHOTOS = [
    { id: 1, file: '1.jpeg', caption: 'El inicio de nuestro mayor orgullo' },
    { id: 2, file: '2.jpeg', caption: 'Nuestros días llenos de risas' },
    { id: 3, file: '3.jpeg', caption: 'Cada instante a su lado es un regalo' },
    { id: 4, file: '4.jpeg', caption: 'Siempre unidos con el mismo amor' },
    { id: 5, file: '5.png', caption: 'Su felicidad es nuestro motor' },
    { id: 6, file: '6.jpeg', caption: 'El fruto de estos 25 años juntos' },
    { id: 7, file: '7.png', caption: 'Nuestra mayor bendición' }
];

export default function Gallery({ basePath }) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

    const openLightbox = (index) => {
        setSelectedPhotoIndex(index);
    };

    const closeLightbox = () => {
        setSelectedPhotoIndex(null);
    };

    const showPrev = (e) => {
        e.stopPropagation();
        setSelectedPhotoIndex((prev) => (prev === 0 ? PHOTOS.length - 1 : prev - 1));
    };

    const showNext = (e) => {
        e.stopPropagation();
        setSelectedPhotoIndex((prev) => (prev === PHOTOS.length - 1 ? 0 : prev + 1));
    };

    // Helper to assign a unique tilt style based on index so it is stable
    const getPolaroidStyle = (index) => {
        const tilts = [-3, 2, -1.5, 3, -2, 2.5, -3];
        const tilt = tilts[index % tilts.length];
        return {
            transform: `rotate(${tilt}deg)`
        };
    };

    return (
        <section className="bla-section bla-gallery-section" data-bla-section>
            <div className="bla-gallery-header">
                <p className="bla-section__eyebrow">
                    <Camera size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Álbum de Recuerdos
                </p>
                <h2 className="bla-section__title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                    Nuestra Familia
                </h2>
                <p className="bla-section__subtitle" style={{ maxWidth: '480px', margin: '0 auto 2.5rem' }}>
                    Lo más hermoso que nos han dejado estos 25 años. El fruto de nuestro amor y nuestra mayor felicidad.
                </p>
            </div>

            {/* Polaroid Grid Layout */}
            <div className="bla-polaroid-grid">
                {PHOTOS.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="bla-polaroid-card"
                        style={getPolaroidStyle(index)}
                        onClick={() => openLightbox(index)}
                    >
                        <div className="bla-polaroid-card__img-wrapper">
                            <img
                                src={`${basePath}/img/${photo.file}`}
                                alt={photo.caption}
                                loading="lazy"
                            />
                        </div>
                        <div className="bla-polaroid-card__caption">
                            {photo.caption}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedPhotoIndex !== null && (
                <div className="bla-lightbox" onClick={closeLightbox}>
                    <button className="bla-lightbox__close" onClick={closeLightbox} aria-label="Cerrar galería">
                        <X size={28} />
                    </button>
                    
                    <button className="bla-lightbox__nav bla-lightbox__nav--prev" onClick={showPrev} aria-label="Foto anterior">
                        <ChevronLeft size={36} />
                    </button>

                    <div className="bla-lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <div className="bla-lightbox__card">
                            <img
                                src={`${basePath}/img/${PHOTOS[selectedPhotoIndex].file}`}
                                alt={PHOTOS[selectedPhotoIndex].caption}
                                className="bla-lightbox__image"
                            />
                            <p className="bla-lightbox__caption">
                                {PHOTOS[selectedPhotoIndex].caption}
                            </p>
                        </div>
                    </div>

                    <button className="bla-lightbox__nav bla-lightbox__nav--next" onClick={showNext} aria-label="Foto siguiente">
                        <ChevronRight size={36} />
                    </button>
                </div>
            )}
        </section>
    );
}
