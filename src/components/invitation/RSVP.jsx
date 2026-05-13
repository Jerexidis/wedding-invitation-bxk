import { useState } from 'react';
import { Heart, Send } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const RSVP = ({ data, slug, basePath }) => {
    const [formData, setFormData] = useState({ name: '', guests: 1, message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        setFormData(prev => ({ ...prev, name: value }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.mode === 'whatsapp') {
            const message = data.whatsappConfirmMessage
                .replace('{name}', formData.name)
                .replace('{guests}', formData.guests);
            window.location.href = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(message)}`;
        } else if (data.mode === 'supabase') {
            setSubmitting(true);
            try {
                const { addConfirmation } = await import('../../utils/rsvpStore');
                await addConfirmation(slug, {
                    name: formData.name,
                    guests: parseInt(formData.guests),
                    message: formData.message,
                });
                setSubmitted(true);
            } catch (err) {
                console.error('Error submitting RSVP:', err);
                alert('Hubo un error al enviar tu confirmación. Inténtalo de nuevo.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    if (data.mode === 'none') return null;

    if (submitted) {
        return (
            <section className="py-24 px-4 bg-gradient-to-b from-[#A8896A] to-[#C4A882] text-white relative overflow-hidden">
                <div className="max-w-lg mx-auto text-center relative z-10 bg-white/15 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-lg">
                    <div className="inline-flex items-center justify-center p-3 bg-inv-accent/15 rounded-full mb-4">
                        <Heart className="w-10 h-10 text-white" fill="currentColor" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-inv-display mb-4 text-white">¡Gracias!</h2>
                    <p className="text-white/70">Tu confirmación ha sido registrada exitosamente.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-[#A8896A] to-[#C4A882] text-white relative overflow-hidden">

            <div className="max-w-lg mx-auto relative z-10 bg-white/15 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-lg">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-white/15 rounded-full mb-4">
                        <Heart className="w-10 h-10 text-inv-accent animate-pulse" fill="currentColor" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-inv-display mb-4 text-white">Confirmar</h2>
                    <p className="text-white/70 font-light">{data.deadline}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input type="text" name="name" required placeholder="Nombre Completo" value={formData.name} onChange={handleNameChange} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+" title="Solo se permiten letras" className="w-full px-4 py-4 bg-white/20 border border-white/25 rounded-xl focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 text-white placeholder-white/50 transition-colors" />
                    </div>

                    <div>
                        <input type="number" name="guests" min="1" max="10" placeholder="N° de Personas" value={formData.guests} onChange={handleInputChange} className="w-full px-4 py-4 bg-white/20 border border-white/25 rounded-xl focus:outline-none focus:border-white/50 text-white placeholder-white/50" />
                    </div>

                    {data.mode === 'supabase' && (
                        <textarea name="message" placeholder="Mensaje (opcional)" value={formData.message} onChange={handleInputChange} rows={3} className="w-full px-4 py-4 bg-white/20 border border-white/25 rounded-xl focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 text-white placeholder-white/50 transition-colors resize-none" />
                    )}

                    <button type="submit" disabled={submitting} className="w-full py-4 bg-white/25 hover:bg-white/35 text-white rounded-xl font-bold tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg border border-white/20 disabled:opacity-60">
                        {submitting ? 'Enviando...' : data.mode === 'whatsapp' ? (<>Confirmar por WhatsApp <WhatsAppIcon /></>) : (<>Confirmar Asistencia <Send size={18} /></>)}
                    </button>
                </form>

                {data.directMessage?.enabled && (
                    <div className="mt-8 text-center">
                        <p className="text-white/50 text-sm mb-3">{data.directMessage.label}</p>
                        <a href={`https://wa.me/${data.directMessage.number}?text=${encodeURIComponent(data.directMessage.text)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
                            <WhatsAppIcon /> {data.directMessage.buttonText}
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RSVP;
