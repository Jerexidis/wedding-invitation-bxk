import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Images } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Gallery({ config, basePath }) {
    const initialPhotos = useMemo(
        () => (config.gallery?.photos || []).map(p => ({
            src: `${basePath}/img/${p.src}`,
            caption: p.caption,
            position: p.position || 'center',
            objectFit: p.objectFit || 'cover'
        })),
        [basePath, config.gallery?.photos]
    );

    const [photos, setPhotos] = useState(initialPhotos);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setPhotos(initialPhotos);
    }, [initialPhotos]);

    useEffect(() => {
        if (!photos.length) return undefined;
        const interval = setInterval(() => {
            if (isAnimating) return;
            setIsAnimating(true);
            setTimeout(() => {
                setPhotos((prev) => {
                    const newPhotos = [...prev];
                    const topPhoto = newPhotos.pop();
                    newPhotos.unshift(topPhoto);
                    return newPhotos;
                });
                setIsAnimating(false);
            }, 600);
        }, 2500);
        return () => clearInterval(interval);
    }, [isAnimating, photos.length]);

    if (!config.gallery?.enabled || !photos.length) return null;

    return (
        <section className="bla-section bla-gallery-section" data-bla-section>
            <p className="bla-section__eyebrow">
                <Camera size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Nuestros Momentos
            </p>
            <h2 className="bla-section__title">Galería de Fotos</h2>
            <p className="bla-section__subtitle">
                Un pequeño viaje por algunos de los mejores recuerdos en estos 25 años de amor.
            </p>

            <div className="bla-gallery-stack-container">
                <div className="bla-gallery-stack">
                    {photos.map((photo, index) => {
                        const isTop = index === photos.length - 1;
                        // Alternate rotation tilt for organic scrapbook design
                        let animationClass = '';
                        if (isTop && isAnimating) {
                            animationClass = ' bla-gallery-stack__card--exit';
                        } else {
                            animationClass = index % 2 === 0
                                ? ' bla-gallery-stack__card--tilt-left'
                                : ' bla-gallery-stack__card--tilt-right';
                        }

                        return (
                            <div
                                key={photo.src}
                                className={`bla-gallery-stack__card${animationClass}`}
                                style={{ zIndex: index }}
                            >
                                <div className="bla-gallery-stack__img-wrapper">
                                    <img
                                        src={photo.src}
                                        alt={photo.caption}
                                        className="bla-gallery-stack__img"
                                        style={{
                                            objectPosition: photo.position,
                                            objectFit: photo.objectFit
                                        }}
                                        loading="eager"
                                        decoding="async"
                                    />
                                </div>
                                <p className="bla-gallery-stack__caption">{photo.caption}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* <div className="bla-shared-album-callout">
                <Images size={26} aria-hidden="true" />
                <div>
                    <h3>El álbum de nuestro gran día</h3>
                    <p>Sube las fotos que tomes durante la celebración y descubre los recuerdos compartidos por todos.</p>
                </div>
                <Link to="/i/boda-lorena-y-arturo/album">
                    Compartir mis fotos
                </Link>
            </div> */}
        </section>
    );
}
