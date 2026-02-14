import { useState, useEffect } from 'react';

const initialPhotos = [
    { src: "/img/foto1.jpeg", caption: "K & B" }, //recortar
    { src: "/img/foto2.jpeg", caption: "Juntos" },
    { src: "/img/foto3.jpeg", caption: "¡Sí quiero!" },
    { src: "/img/foto4.jpeg", caption: "Para siempre" }
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
        }, 2000); // Tiempo original de 2 segundos

        return () => clearInterval(interval);
    }, [isAnimating]);

    return (
        <section className="py-24 bg-secondary overflow-x-hidden text-center">
            <h2 className="text-5xl font-serif text-slate-800 mb-12">Nuestra Historia</h2>

            <div className="relative w-[280px] h-[350px] md:w-[350px] md:h-[420px] mx-auto max-w-full">
                <div className="relative w-full h-full">
                    {photos.map((photo, index) => {
                        const isTop = index === photos.length - 1;
                        let rotation = index % 2 === 0 ? '-rotate-2' : 'rotate-3';
                        if (isTop && isAnimating) rotation = '-translate-x-[150%] -translate-y-[20%] -rotate-[30deg] opacity-0';

                        return (
                            <div
                                key={photo.caption}
                                className={`absolute top-0 left-0 w-full h-full bg-white p-4 pb-12 shadow-xl rounded-sm transform-gpu transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] will-change-transform ${rotation}`}
                                style={{
                                    zIndex: index,
                                    transformOrigin: 'bottom center'
                                }}
                            >
                                <img
                                    src={photo.src}
                                    alt={photo.caption}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-[80%] object-cover bg-gray-100 border border-gray-100"
                                />
                                <p className="font-serif text-2xl text-slate-600 mt-4 transform -rotate-1">
                                    {photo.caption}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Gallery;
