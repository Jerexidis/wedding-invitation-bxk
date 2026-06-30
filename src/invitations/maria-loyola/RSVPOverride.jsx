import { useState } from 'react';
import { Heart, Send } from 'lucide-react';

const WhatsAppIcon = ({ className = "w-5 h-5", size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={size ? { width: size, height: size } : {}} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const RSVPOverride = ({ data, slug, basePath }) => {
    const [formData, setFormData] = useState({ name: '' });
    const [attendance, setAttendance] = useState('yes');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        setFormData({ name: value });
    };

    const buildWhatsAppUrl = () => {
        const template = attendance === 'yes'
            ? data.whatsappConfirmMessage
            : data.whatsappDeclineMessage;
        const messageText = template.replace('{name}', formData.name);
        
        return `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(messageText)}`;
    };

    const saveToDatabase = async () => {
        const { addConfirmation } = await import('../../utils/rsvpStore');
        const dbMessage = attendance === 'yes' ? '🟢 Sí asisto' : '🔴 No asisto';
        await addConfirmation(slug, {
            name: formData.name,
            guests: 0,
            message: dbMessage,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.mode === 'whatsapp') {
            window.location.href = buildWhatsAppUrl();
        } else if (data.mode === 'supabase') {
            setSubmitting(true);
            try {
                await saveToDatabase();
                setSubmitted(true);
            } catch (err) {
                console.error('Error submitting RSVP:', err);
                alert('Hubo un error al enviar tu confirmación. Inténtalo de nuevo.');
            } finally {
                setSubmitting(false);
            }
        } else if (data.mode === 'mixed') {
            setSubmitting(true);
            try {
                // 1. Save to database first
                await saveToDatabase();
                setSubmitted(true);
                // 2. Then open WhatsApp after a short delay so the user sees the success state
                setTimeout(() => {
                    window.open(buildWhatsAppUrl(), '_blank');
                }, 800);
            } catch (err) {
                console.error('Error submitting RSVP:', err);
                // Even if DB fails, still send to WhatsApp
                window.open(buildWhatsAppUrl(), '_blank');
                setSubmitted(true);
            } finally {
                setSubmitting(false);
            }
        }
    };

    if (data.mode === 'none') return null;

    if (submitted) {
        return (
            <section className="py-24 px-4 bg-gradient-to-b from-inv-dark to-inv-dark/90 text-white relative overflow-hidden">
                <div className="max-w-lg mx-auto text-center relative z-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-30 pointer-events-none rounded-3xl"></div>
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm rounded-full mb-4">
                        <WhatsAppIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-inv-display mb-4 text-white tracking-widest drop-shadow-sm">¡Gracias!</h2>
                    <p className="text-white/90 font-light tracking-wide">Tu confirmación ha sido registrada exitosamente.</p>
                </div>
            </section>
        );
    }

    const btnStyle = {
        padding: '14px 16px',
        borderRadius: '12px',
        fontWeight: '700',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.875rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        cursor: 'pointer'
    };

    const activeStyle = {
        ...btnStyle,
        backgroundColor: '#B4503C',
        color: '#ffffff',
        borderColor: '#B4503C',
        boxShadow: '0 4px 12px rgba(180, 80, 60, 0.2)',
        transform: 'scale(1.02)'
    };

    const inactiveStyle = {
        ...btnStyle,
        backgroundColor: '#ffffff',
        color: '#64372D',
        borderColor: 'rgba(180, 80, 60, 0.2)',
        opacity: 0.7
    };

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-inv-dark to-inv-dark/90 text-white relative overflow-hidden">
            <div className="max-w-lg mx-auto relative z-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-30 pointer-events-none rounded-3xl"></div>
                <div className="text-center mb-10 relative z-10">
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm rounded-full mb-4">
                        <WhatsAppIcon className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-inv-display mb-4 text-white tracking-widest drop-shadow-sm">Confirmar</h2>
                    <p className="text-white/90 font-light tracking-widest text-sm uppercase">{data.deadline}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <input type="text" name="name" required placeholder="Nombre de la Familia (Ej: Familia González)" value={formData.name} onChange={handleNameChange} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+" title="Solo se permiten letras" className="w-full px-5 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:border-white focus:bg-white/20 focus:ring-1 focus:ring-white/50 text-white placeholder-white/70 transition-all shadow-sm" />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-[0.2em] font-bold text-white/80" style={{ color: '#64372D' }}>¿Asistirán al evento?</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setAttendance('yes')}
                                style={attendance === 'yes' ? activeStyle : inactiveStyle}
                            >
                                🟢 Sí asisto
                            </button>
                            <button
                                type="button"
                                onClick={() => setAttendance('no')}
                                style={attendance === 'no' ? activeStyle : inactiveStyle}
                            >
                                🔴 No asisto
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={submitting} className="w-full py-4 bg-white hover:bg-white/90 text-inv-dark rounded-xl font-bold tracking-widest uppercase transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md border border-white disabled:opacity-60">
                        {submitting ? 'Enviando...' : (data.mode === 'whatsapp' || data.mode === 'mixed') ? (<>Confirmar por WhatsApp <WhatsAppIcon /></>) : (<>Confirmar Asistencia <Send size={18} /></>)}
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

export default RSVPOverride;
