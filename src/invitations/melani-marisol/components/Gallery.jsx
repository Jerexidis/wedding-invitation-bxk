import { useState, useEffect } from 'react';

const initialPhotos = [
    { src: "/invitations/melani-marisol/img/img1.jpg", caption: "Mi princesa" },
    { src: "/invitations/melani-marisol/img/img2.jpg", caption: "Mis XV" },
    { src: "/invitations/melani-marisol/img/img3.jpg", caption: "En familia" },
    { src: "/invitations/melani-marisol/img/img4.jpg", caption: "¡Feliz!" },
];

const Gallery = () => {
    const [photos, setPhotos] = useState(initialPhotos);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isAnimating) return;
            setIsAnimating(true);
            setTimeout(() => {
                setPhotos(prev => {
                    const newPhotos = [...prev];
                    const topPhoto = newPhotos.pop();
                    newPhotos.unshift(topPhoto);
                    return newPhotos;
                });
                setIsAnimating(false);
            }, 600);
        }, 2500);

        return () => clearInterval(interval);
    }, [isAnimating]);

    return (
        <section className="relative py-20 px-6 bg-gradient-to-b from-rana-cream to-rana-light text-center overflow-hidden">
            {/* Frog silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/frog-silhouette.png"
                alt=""
                className="absolute -bottom-4 -left-4 w-28 md:w-36 opacity-[0.04] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)', transform: 'scaleX(-1)' }}
            />
            {/* Lotus silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/lotus-silhouette.png"
                alt=""
                className="absolute -top-4 -right-4 w-28 md:w-36 opacity-[0.04] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />
            <div className="max-w-4xl mx-auto">
                <p className="text-sm uppercase tracking-[0.3em] text-rana-gray mb-2">Momentos especiales</p>
                <h2 className="text-4xl md:text-5xl font-serif text-rana-primary mb-12">Mi Galería</h2>

                <div className="relative w-[260px] h-[340px] md:w-[320px] md:h-[400px] mx-auto max-w-full">
                    <div className="relative w-full h-full">
                        {photos.map((photo, index) => {
                            const isTop = index === photos.length - 1;
                            let rotation = index % 2 === 0 ? '-rotate-2' : 'rotate-3';
                            if (isTop && isAnimating) rotation = '-translate-x-[150%] -translate-y-[20%] -rotate-[30deg] opacity-0';

                            return (
                                <div
                                    key={photo.caption}
                                    className={`absolute top-0 left-0 w-full h-full bg-white p-3 pb-12 shadow-xl rounded-sm transform-gpu transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] will-change-transform ${rotation}`}
                                    style={{
                                        zIndex: index,
                                        transformOrigin: 'bottom center',
                                        boxShadow: '0 4px 20px rgba(26, 60, 52, 0.15), 0 1px 4px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <img
                                        src={photo.src}
                                        alt={photo.caption}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-[80%] object-cover bg-rana-lily/30 border border-rana-lily/20"
                                    />
                                    <p className="font-serif text-xl text-rana-primary mt-3 transform -rotate-1">
                                        {photo.caption}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
