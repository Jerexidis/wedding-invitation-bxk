import React from 'react';

const Intro = () => {
    return (
        <section className="relative py-20 px-6 bg-gradient-to-b from-rana-cream to-rana-light text-center overflow-hidden">
            {/* Lotus silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/lotus-silhouette.png"
                alt=""
                className="absolute top-4 left-4 w-28 md:w-36 opacity-[0.05] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />
            {/* Princess silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/princess-silhouette.png"
                alt=""
                className="absolute -bottom-8 -right-4 w-48 md:w-56 opacity-[0.06] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />

            <div className="max-w-2xl mx-auto relative z-10">

                <p className="text-rana-gray text-sm uppercase tracking-[0.3em] mb-4">Con la bendición de Dios y de mis papás</p>

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-lg border border-rana-lily/50 mb-8">
                    <h3 className="text-sm uppercase tracking-[0.25em] text-rana-primary font-semibold mb-3">Mis Papás</h3>
                    <p className="font-serif text-2xl md:text-3xl text-rana-dark leading-relaxed">
                        José Alberto Medina García
                    </p>
                    <div className="flex items-center justify-center gap-3 my-2">
                        <div className="w-8 h-[1px] bg-rana-accent" />
                        <span className="text-rana-accent text-lg">&</span>
                        <div className="w-8 h-[1px] bg-rana-accent" />
                    </div>
                    <p className="font-serif text-2xl md:text-3xl text-rana-dark leading-relaxed">
                        Catalina Palacios Romero
                    </p>
                </div>

                <p className="text-rana-gray text-base md:text-lg italic leading-relaxed max-w-lg mx-auto">
                    "Tienen el honor de invitarte a celebrar los XV Años de su hija"
                </p>

                <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="w-12 h-[1px] bg-rana-accent/60" />
                    <span className="text-rana-accent text-xl">👑</span>
                    <div className="w-12 h-[1px] bg-rana-accent/60" />
                </div>
            </div>
        </section>
    );
};

export default Intro;
