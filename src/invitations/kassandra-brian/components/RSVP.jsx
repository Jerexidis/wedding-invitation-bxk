import { useState } from 'react';

// Ícono SVG inline de WhatsApp — reemplaza Font Awesome (ya no se necesita el CDN)
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const RSVP = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [name, setName] = useState('');
    const [sent, setSent] = useState(false);

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        setName(value);
    };

    const handleSend = () => {
        if (!name.trim()) return;
        const message = `Hola! Soy ${name}. Lamentablemente no podré asistir a la boda, pero les deseo muchas felicidades en esta nueva etapa juntos. Les mando un fuerte abrazo!`;
        const whatsappUrl = `https://wa.me/524492905708?text=${encodeURIComponent(message)}`;
        window.location.href = whatsappUrl;
        setSent(true);
    };

    return (
        <section className="py-20 px-4 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_white,_transparent)]" />

            <div className="max-w-md mx-auto relative z-10 text-center">
                {!showConfirm ? (
                    <div className="space-y-6 animate-fade-in">
                        <p className="text-[#B8DFF0] font-light text-sm uppercase tracking-[0.2em]">
                            ¿No podrás acompañarnos?
                        </p>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full text-white font-light tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            <span>No podré asistir</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                <path d="m9 18 6-6-6-6"/>
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="bg-slate-800/80 p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6 animate-fade-in">
                        <p className="text-[#B8DFF0] font-light">
                            Lamentamos que no puedas asistir. Por favor escribe tu nombre para hacérnoslo saber.
                        </p>

                        <input
                            type="text"
                            required
                            placeholder="Tu nombre"
                            value={name}
                            onChange={handleNameChange}
                            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-slate-400 transition-colors text-center"
                        />

                        <button
                            onClick={handleSend}
                            disabled={!name.trim()}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            Enviar por WhatsApp <WhatsAppIcon />
                        </button>

                        <button
                            onClick={() => setShowConfirm(false)}
                            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                        >
                            ← Volver
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RSVP;
