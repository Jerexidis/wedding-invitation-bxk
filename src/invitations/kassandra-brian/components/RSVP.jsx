import { useState } from 'react';
import { Heart } from 'lucide-react';

// Ícono SVG inline de WhatsApp — reemplaza Font Awesome (ya no se necesita el CDN)
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const RSVP = () => {
    const [formData, setFormData] = useState({ name: '', guests: 1, attendance: 'si' });


    const handleNameChange = (e) => {
        // Solo permitir letras, espacios y acentos
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
            message = `Hola! Soy ${formData.name}. Confirmo mi asistencia para ${formData.guests} persona(s). Nos vemos en la boda!`;
        } else {
            message = `Hola! Soy ${formData.name}. Lamentablemente no podre asistir, pero les deseo muchas felicidades en esta nueva etapa juntos. Les mando un fuerte abrazo!`;
        }

        const whatsappUrl = `https://wa.me/524492905708?text=${encodeURIComponent(message)}`;

        // Usar window.location.href para que el sistema operativo del teléfono
        // abra WhatsApp directamente, sin ser bloqueado como popup
        window.location.href = whatsappUrl;
    };

    return (
        <section className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_white,_transparent)]" />

            <div className="max-w-lg mx-auto relative z-10 bg-slate-800/80 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-center mb-10">
                    <Heart className="w-12 h-12 text-[#89CFF0] mx-auto mb-4 animate-pulse" fill="currentColor" />
                    <h2 className="text-5xl font-serif mb-4">Confirmar</h2>
                    <p className="text-[#B8DFF0] font-light">Por favor confirma antes del 30 de abril de 2026</p>
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
                            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-slate-400 transition-colors"
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
                                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary text-white placeholder-slate-400"
                            />
                        )}

                        <select
                            name="attendance"
                            value={formData.attendance}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary text-white [&>option]:text-slate-900"
                        >
                            <option value="si">¡Sí iré!</option>
                            <option value="no">No podré :(</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                    >
                        Confirmar por WhatsApp <WhatsAppIcon />
                    </button>
                </form>
            </div>
        </section>
    );
};

export default RSVP;
