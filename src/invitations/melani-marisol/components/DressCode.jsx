import React from 'react';

const DressCode = () => {
    return (
        <section className="relative py-16 px-4 bg-rana-light text-center overflow-hidden">
            {/* Princess silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/princess-silhouette.png"
                alt=""
                className="absolute -top-6 -left-4 w-40 md:w-48 opacity-[0.05] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)', transform: 'scaleX(-1)' }}
            />
            {/* Frog silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/frog-silhouette.png"
                alt=""
                className="absolute -bottom-4 -right-4 w-28 md:w-36 opacity-[0.04] pointer-events-none select-none"
                style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
            />
            <div className="max-w-sm mx-auto bg-white p-8 rounded-3xl shadow-md border border-rana-lily/50 relative z-10">
                <h3 className="text-lg font-semibold text-rana-dark uppercase tracking-widest mb-6">Código de Vestimenta</h3>

                <div className="bg-gradient-to-br from-rana-cream to-rana-light p-6 rounded-2xl border border-rana-lily/30 mb-4">
                    {/* Ilustraciones de vestimenta formal */}
                    <div className="flex justify-center mb-5">
                        <img 
                            src="/invitations/melani-marisol/img/dresscode-icon.png" 
                            alt="Vestimenta formal" 
                            className="w-24 md:w-28 opacity-80 mix-blend-multiply"
                        />
                    </div>

                    <p className="font-bold text-rana-primary text-2xl tracking-wide">
                        Formal
                    </p>
                </div>
            </div>
        </section>
    );
};

export default DressCode;
