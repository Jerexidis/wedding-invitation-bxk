import React from 'react';
import { Gift } from 'lucide-react';

const Gifts = () => {
    return (
        <section className="relative py-20 px-4 bg-white text-center overflow-hidden">
            {/* Princess silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/princess-silhouette.png"
                alt=""
                className="absolute -top-4 -right-6 w-40 md:w-48 opacity-[0.04] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />
            {/* Lotus silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/lotus-silhouette.png"
                alt=""
                className="absolute -bottom-6 -left-6 w-32 md:w-40 opacity-[0.04] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="inline-flex items-center justify-center p-4 bg-rana-light rounded-full mb-6 shadow-sm">
                    <Gift className="w-8 h-8 text-rana-primary" />
                </div>

                <h3 className="text-3xl md:text-4xl font-serif text-rana-primary mb-4">Mesa de Regalos</h3>
                <p className="text-rana-gray mb-8 max-w-md mx-auto">
                    Tu presencia es mi mayor regalo, pero si deseas tener un detalle conmigo:
                </p>

                <div className="bg-gradient-to-br from-rana-cream to-rana-light p-8 rounded-3xl border border-rana-lily/50 max-w-md mx-auto shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="inline-flex items-center gap-2 bg-rana-primary text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
                            <span>💌</span>
                            <span>Opción en mesa: Lluvia de Sobres</span>
                        </div>
                        <p className="text-rana-gray text-sm leading-relaxed text-center mt-2 px-2">
                            Es una tradición de ahora regalar efectivo en sobres que estarán a la entrada de la fiesta para colocarse en un buzón.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gifts;
