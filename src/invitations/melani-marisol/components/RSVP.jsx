import { useState } from 'react';
import { Heart } from 'lucide-react';

const RSVP = () => {
    const [formData, setFormData] = useState({ name: '', guests: 1, attendance: 'si' });

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        setFormData(prev => ({ ...prev, name: value }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let message;
        if (formData.attendance === 'si') {
            message = `🐸👑 ¡Hola! Soy ${formData.name}. Confirmo mi asistencia a los XV Años de Melani Marisol para ${formData.guests} persona(s). ¡Nos vemos en la fiesta! 🎉✨`;
        } else {
            message = `Hola! Soy ${formData.name}. Lamentablemente no podré asistir a los XV Años de Melani Marisol, pero le deseo lo mejor en esta hermosa celebración. ¡Muchas felicidades! 💚`;
        }

        // Número para confirmar asistencia
        const whatsappUrl = `https://wa.me/524691761149?text=${encodeURIComponent(message)}`;
        window.location.href = whatsappUrl;
    };

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-rana-dark to-rana-swamp text-white relative overflow-hidden">
            {/* Background Decoration */}
            <img
                src="/invitations/melani-marisol/img/lotus-silhouette.png"
                alt=""
                className="absolute top-6 left-4 w-28 md:w-36 opacity-[0.06] pointer-events-none select-none"
                style={{ filter: 'invert(1) sepia(0.3) hue-rotate(80deg)' }}
            />
            <img
                src="/invitations/melani-marisol/img/frog-silhouette.png"
                alt=""
                className="absolute -bottom-4 -right-4 w-28 md:w-36 opacity-[0.06] pointer-events-none select-none"
                style={{ filter: 'invert(1) sepia(0.3) hue-rotate(80deg)' }}
            />

            <div className="max-w-lg mx-auto relative z-10 bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-rana-accent/20 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-rana-primary/30 rounded-full mb-4">
                        <Heart className="w-10 h-10 text-rana-accent animate-pulse" fill="currentColor" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">Confirmar</h2>
                    <p className="text-rana-lily/70 font-light">Por favor confirma tu asistencia</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Nombre Completo"
                            value={formData.name}
                            onChange={handleNameChange}
                            pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+"
                            title="Solo se permiten letras"
                            className="w-full px-4 py-4 bg-white/10 border border-rana-accent/20 rounded-xl focus:outline-none focus:border-rana-accent focus:ring-1 focus:ring-rana-accent text-white placeholder-rana-lily/40 transition-colors"
                        />
                    </div>

                    <div className={`grid gap-4 ${formData.attendance === 'si' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {formData.attendance === 'si' && (
                            <input
                                type="number"
                                name="guests"
                                min="1"
                                max="10"
                                placeholder="N° Personas"
                                value={formData.guests}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 bg-white/10 border border-rana-accent/20 rounded-xl focus:outline-none focus:border-rana-accent text-white placeholder-rana-lily/40"
                            />
                        )}

                        <select
                            name="attendance"
                            value={formData.attendance}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 bg-white/10 border border-rana-accent/20 rounded-xl focus:outline-none focus:border-rana-accent text-white [&>option]:text-rana-dark"
                        >
                            <option value="si">¡Sí iré! 🎉</option>
                            <option value="no">No podré :(</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-rana-primary to-rana-teal hover:from-rana-primary-light hover:to-rana-primary text-white rounded-xl font-bold tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg border border-rana-accent/20"
                    >
                        Confirmar por WhatsApp <i className="fab fa-whatsapp text-xl"></i>
                    </button>
                </form>

                {/* Message to birthday girl */}
                <div className="mt-8 text-center">
                    <p className="text-rana-lily/50 text-sm mb-3">¿Quieres enviarle un mensaje a la festejada?</p>
                    <a
                        href="https://wa.me/524495915005"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-rana-accent hover:text-rana-firefly transition-colors text-sm font-medium"
                    >
                        <i className="fab fa-whatsapp"></i>
                        Enviar mensaje a Melani 💚
                    </a>
                </div>
            </div>
        </section>
    );
};

export default RSVP;
