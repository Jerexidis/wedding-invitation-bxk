import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const Gallery = ({ data, basePath, allowInPortfolio = false }) => {
    const [searchParams] = useSearchParams();
    const isPortfolioProtected = searchParams.get('portfolio') === '1' && !allowInPortfolio;
    const initialPhotos = useMemo(
        () => (data?.photos || []).map(p => ({ src: `${basePath}/img/${p.src}`, caption: p.caption, position: p.position })),
        [basePath, data?.photos]
    );
    const [photos, setPhotos] = useState(initialPhotos);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setPhotos(initialPhotos);
    }, [initialPhotos]);

    useEffect(() => {
        if (isPortfolioProtected || !photos.length) return undefined;
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
    }, [isAnimating, isPortfolioProtected, photos.length]);

    // Portfolio mode omits the gallery before any <img> is rendered.
    // This protects guest photos by default; explicit exceptions must opt in.
    if (isPortfolioProtected || !data?.photos?.length) return null;

    return (
        <section className="relative py-20 px-6 bg-gradient-to-b from-inv-cream to-inv-light text-center overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <p className="text-sm uppercase tracking-[0.3em] text-inv-gray mb-2">Momentos especiales</p>
                <h2 className="text-4xl md:text-5xl font-inv-display text-inv-primary mb-12">Mi Galería</h2>
                <div className="relative w-[260px] h-[340px] md:w-[320px] md:h-[400px] mx-auto max-w-full">
                    <div className="relative w-full h-full">
                        {photos.map((photo, index) => {
                            const isTop = index === photos.length - 1;
                            let rotation = index % 2 === 0 ? '-rotate-2' : 'rotate-3';
                            if (isTop && isAnimating) rotation = '-translate-x-[150%] -translate-y-[20%] -rotate-[30deg] opacity-0';
                            return (
                                <div key={photo.src} className={`absolute top-0 left-0 w-full h-full bg-white p-3 pb-12 shadow-xl rounded-sm transform-gpu transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] will-change-transform ${rotation}`} style={{ zIndex: index, transformOrigin: 'bottom center', boxShadow: '0 4px 20px rgba(26, 60, 52, 0.15), 0 1px 4px rgba(0,0,0,0.1)' }}>
                                    <img src={photo.src} alt={photo.caption} loading="eager" decoding="async" className="w-full h-[80%] object-cover bg-inv-lily/30 border border-inv-lily/20" style={{ objectPosition: photo.position || 'center' }} />
                                    <p className="font-inv-display text-xl text-inv-primary mt-3 transform -rotate-1">{photo.caption}</p>
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
