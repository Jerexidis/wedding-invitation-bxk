import { useState } from 'react';
import { Send, CheckCircle, Heart } from 'lucide-react';

const RSVP = () => {
    const [formData, setFormData] = useState({ name: '', guests: 1, attendance: 'si' });
    const [rsvpStatus, setRsvpStatus] = useState('idle');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setRsvpStatus('submitting');
        setTimeout(() => {
            setRsvpStatus('success');
            // Here you would typically send data to a backend
            const message = ` Hola! Soy ${formData.name}. Confirmo mi asistencia para ${formData.guests} personas.`;
            const whatsappUrl = `https://wa.me/524941043296?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }, 1500);
    };

    return (
        <section className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_white,_transparent)]" />

            <div className="max-w-lg mx-auto relative z-10 bg-slate-800/80 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-center mb-10">
                    <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" fill="currentColor" />
                    <h2 className="text-5xl font-serif mb-4">Confirmar</h2>
                    <p className="text-slate-300 font-light">Por favor confirma antes del 30 de abril de 2026</p>
                </div>

                {rsvpStatus === 'success' ? (
                    <div className="text-center py-12 animate-fade-in">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-serif mb-2">¡Gracias por confirmar!</h3>
                        <p className="text-slate-300 mb-6">Hemos abierto WhatsApp para enviar tu respuesta.</p>
                        <button
                            onClick={() => setRsvpStatus('idle')}
                            className="text-sm text-blue-300 hover:text-blue-200 underline"
                        >
                            Enviar otra respuesta
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Nombre Completo"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-slate-400 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="guests"
                                min="1"
                                max="10"
                                placeholder="N° Personas"
                                value={formData.guests}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary text-white placeholder-slate-400"
                            />

                            <select
                                name="attendance"
                                value={formData.attendance}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary text-white [&>option]:text-slate-900"
                            >
                                <option value="si">¡Sí ire!</option>
                                <option value="no">No podré :(</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={rsvpStatus === 'submitting'}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
                        >
                            {rsvpStatus === 'submitting' ? 'Enviando...' : (
                                <>Confirmar por WhatsApp <i className="fab fa-whatsapp text-xl"></i></>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default RSVP;
