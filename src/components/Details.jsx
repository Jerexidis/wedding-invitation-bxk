import React from 'react';
import { Ban, User } from 'lucide-react';

const Details = () => {
    return (
        <section className="py-16 px-4 flex flex-wrap justify-center gap-8 bg-white">

            {/* Tarjeta: Recepción Adultos */}
            <div className="flex-1 min-w-[300px] max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="mb-4 text-primary text-3xl">
                    <i className="fas fa-glass-cheers"></i>
                </div>
                <h4 className="text-lg font-sans font-semibold text-slate-700 uppercase tracking-widest mb-4">Recepción Adultos</h4>

                <div className="bg-secondary p-5 rounded-xl border-l-4 border-primary mt-2">
                    <p className="text-sm text-slate-600 italic leading-relaxed">
                        "Amamos a los niños, pero queremos que este día papá y mamá celebren sin preocupaciones."
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        <Ban size={12} />
                        <span>Evento sin niños</span>
                    </div>
                </div>
            </div>

            {/* Tarjeta: Dress Code */}
            <div className="flex-1 min-w-[300px] max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="mb-4 text-primary text-3xl">
                    <User size={32} strokeWidth={1.5} className="mx-auto" />
                </div>
                <h4 className="text-lg font-sans font-semibold text-slate-700 uppercase tracking-widest mb-4">Dress Code</h4>

                <p className="font-semibold text-slate-800 text-sm tracking-wide mb-4">
                    FORMAL / COLORES PRIMAVERA
                </p>

                <img
                    src="/img/dresscode.png"
                    alt="Paleta de colores sugerida"
                    className="w-full max-w-[200px] mx-auto rounded-lg mb-4"
                />

                <p className="text-xs text-slate-500">
                    Agradecemos evitar los colores: <br />
                    <span className="line-through text-slate-400">Blanco y Azul</span>
                </p>
            </div>
        </section>
    );
};

export default Details;