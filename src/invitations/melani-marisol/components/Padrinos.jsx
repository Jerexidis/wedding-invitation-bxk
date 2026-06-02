import React from 'react';

const Padrinos = () => {
    return (
        <section className="relative py-16 px-6 bg-rana-dark text-center overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, #FFD700 1px, transparent 1px), radial-gradient(circle at 80% 20%, #FFD700 1px, transparent 1px), radial-gradient(circle at 60% 80%, #FFD700 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}
            />
            {/* Lotus silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/lotus-silhouette.png"
                alt=""
                className="absolute -bottom-6 -left-6 w-32 md:w-40 opacity-[0.06] pointer-events-none select-none"
                style={{ filter: 'invert(1) sepia(0.3) hue-rotate(80deg)' }}
            />
            {/* Frog silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/frog-silhouette.png"
                alt=""
                className="absolute -top-2 -right-2 w-24 md:w-32 opacity-[0.06] pointer-events-none select-none"
                style={{ filter: 'invert(1) sepia(0.3) hue-rotate(80deg)', transform: 'scaleX(-1)' }}
            />
            {/* Tiana sketch illustration */}
            <img
                src="/invitations/melani-marisol/img/tiana-sketch.png"
                alt=""
                className="absolute top-1/2 right-0 -translate-y-1/2 w-64 md:w-80 opacity-80 pointer-events-none select-none drop-shadow-2xl"
            />

            <div className="max-w-2xl mx-auto relative z-10">
                <p className="text-rana-firefly/80 text-sm uppercase tracking-[0.3em] mb-3">Con el cariño de</p>
                <h2 className="font-serif text-4xl md:text-5xl text-white mb-10">Mis Padrinos</h2>

                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-rana-accent/20 shadow-2xl">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-rana-accent text-2xl">✦</span>
                    </div>

                    <p className="font-serif text-2xl md:text-3xl text-white leading-relaxed">
                        Jorge Luis Reyes Roque
                    </p>
                    <div className="flex items-center justify-center gap-3 my-3">
                        <div className="w-8 h-[1px] bg-rana-accent/50" />
                        <span className="text-rana-accent text-lg">&</span>
                        <div className="w-8 h-[1px] bg-rana-accent/50" />
                    </div>
                    <p className="font-serif text-2xl md:text-3xl text-white leading-relaxed">
                        María del Refugio Torres Marmolejo
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-6">
                        <span className="text-rana-accent text-2xl">✦</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Padrinos;
