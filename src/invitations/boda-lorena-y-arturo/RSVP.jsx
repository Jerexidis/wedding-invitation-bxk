import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px', flexShrink: 0 }} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

export default function RSVP({ config, basePath }) {
    const [rsvpForm, setRsvpForm] = useState({ name: '', guests: 1, message: '' });
    const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        setRsvpForm((prev) => ({ ...prev, name: value }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRsvpForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRsvpSubmit = (e) => {
        e.preventDefault();
        if (!rsvpForm.name.trim()) {
            alert('Por favor, escribe tu nombre completo para confirmar.');
            return;
        }
        const message = `¡Hola! 🥈✨ Soy *${rsvpForm.name}* y confirmo asistencia a las Bodas de Plata de Lorena y Arturo. 🎉\n👥 Personas: ${rsvpForm.guests}${rsvpForm.message?.trim() ? `\n💬 ${rsvpForm.message.trim()}` : ''}`;
        
        const num1 = config.rsvp.whatsappNumbers.lorena;
        const num2 = config.rsvp.whatsappNumbers.arturo;
        
        // Open first WhatsApp chat (Lorena)
        window.open(`https://wa.me/${num1}?text=${encodeURIComponent(message)}`, '_blank');
        
        // Open second WhatsApp chat (Arturo) after a small delay
        setTimeout(() => {
            window.open(`https://wa.me/${num2}?text=${encodeURIComponent(message)}`, '_blank');
        }, 800);
        
        setRsvpSubmitted(true);
    };

    return (
        <section className="bla-section bla-rsvp" data-bla-section>
            {rsvpSubmitted ? (
                <div className="bla-card bla-rsvp__card">
                    <div className="bla-silver-badge-small" style={{ margin: '0 auto 1rem' }}>
                        <span>25</span>
                    </div>
                    <h2 className="bla-section__title" style={{ marginTop: '0.5rem' }}>¡Gracias!</h2>
                    <p className="bla-section__subtitle">
                        Tu confirmación ha sido enviada. ¡Nos vemos en la fiesta de plata! 🥈🎉
                    </p>
                </div>
            ) : (
                <div className="bla-card bla-rsvp__card">
                    <img
                        src={`${basePath}/img/anillos-divider.png`}
                        alt=""
                        style={{ width: '60px', margin: '0 auto 0.5rem', display: 'block', opacity: 0.6 }}
                    />
                    <p className="bla-section__eyebrow" style={{ marginTop: '0.5rem' }}>Confirma tu asistencia</p>
                    <h2 className="bla-section__title">RSVP</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--bla-text-light)', marginBottom: '0.5rem' }}>
                        {config.rsvp.deadline}
                    </p>

                    <form onSubmit={(e) => e.preventDefault()} className="bla-rsvp__form">
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Tu nombre completo"
                            value={rsvpForm.name}
                            onChange={handleNameChange}
                            className="bla-rsvp__input"
                            pattern="[a-zA-Záéí0-9áéíóúÁÉÍÓÚñÑüÜ\s]+"
                            title="Solo se permiten letras"
                        />
                        <input
                            type="number"
                            name="guests"
                            min="1"
                            max="10"
                            placeholder="Número de personas"
                            value={rsvpForm.guests}
                            onChange={handleInputChange}
                            className="bla-rsvp__input"
                        />

                        <textarea
                            name="message"
                            placeholder="Mensaje para los festejados (opcional) 💕"
                            value={rsvpForm.message}
                            onChange={handleInputChange}
                            rows={3}
                            maxLength={200}
                            className="bla-rsvp__input bla-rsvp__textarea"
                        />

                        <button
                            type="button"
                            onClick={handleRsvpSubmit}
                            className="bla-rsvp__btn"
                            style={{ marginTop: '0.5rem' }}
                        >
                            Confirmar asistencia por WhatsApp
                            <WhatsAppIcon />
                        </button>
                    </form>
                </div>
            )}
        </section>
    );
}
