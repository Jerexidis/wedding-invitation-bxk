import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Gift, CheckCircle, Send, ArrowLeft } from 'lucide-react';

import { useCountdown } from '@/hooks/useCountdown';
import { useRsvpForm } from '@/hooks/useRsvpForm';
import { getThemeStyles } from '@/utils/theme';

const InvitacionBautizo = ({ config }) => {
    const navigate = useNavigate();
    const timeLeft = useCountdown(config.countdown.dateTime);
    const { formData, handleInputChange, handleSubmit, rsvpStatus, resetForm } = useRsvpForm(config.slug);

    const scrollToRSVP = () => document.getElementById('rsvp-section').scrollIntoView({ behavior: 'smooth' });

    const galleryPhotos = config.gallery;

    return (
        <div className="min-h-screen bg-bautizo-cream text-bautizo-text font-montserrat selection:bg-bautizo-accent/30">
            <style>{getThemeStyles(config, 'ocean')}</style>

            {/* --- BOTÓN VOLVER --- */}
            <button
                onClick={() => navigate('/')}
                className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md text-sm font-medium text-slate-700 rounded-full shadow-lg border border-slate-200/60 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
                <ArrowLeft size={16} />
                <span>Volver al inicio</span>
            </button>

            {/* --- HERO SECTION --- */}
            <header className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-20 left-10 text-bautizo-accent animate-pulse-soft">
                    <Star size={48} fill="currentColor" className="opacity-40" />
                </div>
                <div className="absolute bottom-40 right-10 text-bautizo-accent animate-bounce-slow">
                    <Star size={28} fill="currentColor" className="opacity-30" />
                </div>
                <div className="absolute top-32 right-16 text-bautizo-accent/30 animate-pulse">
                    <Star size={24} fill="currentColor" />
                </div>

                <div className="relative z-10 space-y-6 animate-fade-in-up max-w-2xl">
                    <div className="inline-block p-2 px-5 bg-white rounded-full text-bautizo-primary font-bold uppercase text-xs tracking-widest shadow-sm mb-4">
                        {config.hero.heading}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-vibes text-bautizo-dark leading-tight">
                        {config.hero.subheading}
                    </h1>

                    <div className="flex justify-center my-4">
                        <div className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-bautizo-accent/30 shadow-xl ring-4 ring-white">
                            <img
                                src={`/invitations/${config.slug}/img/${config.hero.coverImage}`}
                                alt={config.hero.subheading}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {config.details.adultsOnlyMessage && (
                        <p className="text-lg md:text-xl text-bautizo-primary italic font-serif">
                            "{config.details.adultsOnlyMessage}"
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-4 text-bautizo-dark font-medium mt-8 text-lg">
                        <span>{config.countdown.displayDate.split(' ')[0]}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-bautizo-accent"></span>
                        <span>{config.countdown.displayDate.split(' ').slice(1).join(' ')}, {config.countdown.displayYear}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-bautizo-accent"></span>
                        <span>{config.events[0]?.time}</span>
                    </div>

                    <button
                        onClick={scrollToRSVP}
                        className="mt-10 px-8 py-3 bg-bautizo-primary text-white rounded-full font-medium hover:bg-bautizo-accent transition-all shadow-lg transform hover:-translate-y-1"
                    >
                        Acompáñanos
                    </button>
                </div>

                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-white/40"></div>
                </div>
                {config.hero.song && (
                    <audio autoPlay loop src={`/invitations/${config.slug}/audio/${config.hero.song}`} className="hidden" />
                )}
            </header>

            {config.parentsAndGodparents && (config.parentsAndGodparents.parents || config.parentsAndGodparents.godparents) && (
            <section className="py-12 px-4 bg-bautizo-cream pb-0">
                <div className="max-w-3xl mx-auto text-center">
                    <Divider />
                    
                    {config.parentsAndGodparents.parents && (
                        <>
                            <p className="text-xl md:text-2xl italic text-bautizo-gray leading-relaxed mt-8 font-serif">
                                Con la bendición de Dios y de mis padres
                            </p>
                            <p className="text-2xl md:text-3xl font-vibes text-bautizo-primary mt-2">
                                {config.parentsAndGodparents.parents}
                            </p>
                        </>
                    )}

                    {config.parentsAndGodparents.godparents && (
                        <>
                            <p className="text-xl md:text-2xl italic text-bautizo-gray leading-relaxed mt-6 font-serif">
                                Y mis padrinos
                            </p>
                            <p className="text-2xl md:text-3xl font-vibes text-bautizo-primary mt-2">
                                {config.parentsAndGodparents.godparents}
                            </p>
                        </>
                    )}
                </div>
            </section>
            )}

            {/* --- CUENTA REGRESIVA — Cajas redondeadas --- */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-vibes text-bautizo-primary mb-2">¡Falta poco!</h2>
                    <div className="mb-10"><Divider /></div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <CountdownBox value={timeLeft.dias} label="Días" />
                        <CountdownBox value={timeLeft.horas} label="Horas" />
                        <CountdownBox value={timeLeft.minutos} label="Minutos" />
                        <CountdownBox value={timeLeft.segundos} label="Segundos" />
                    </div>
                </div>
            </section>

            {/* --- INFO CARDS --- */}
            <section className="py-20 px-4 bg-bautizo-cream">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-vibes text-bautizo-primary mb-4">Detalles</h2>
                        <Divider />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {config.events.map((event, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl text-center border border-bautizo-accent/15 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-16 h-16 bg-bautizo-light rounded-full flex items-center justify-center mb-4">
                                    {event.icon === 'church' ? <Star size={28} className="text-bautizo-primary" fill="currentColor" /> : <Gift size={28} className="text-bautizo-primary" />}
                                </div>
                                <h3 className="text-2xl font-vibes text-bautizo-dark mb-2">{event.title}</h3>
                                <p className="text-bautizo-text font-medium">{event.location}</p>
                                <p className="text-bautizo-primary font-bold mt-3">{event.time}</p>
                                {event.mapLink && (
                                    <a href={event.mapLink} target="_blank" rel="noreferrer" className="text-sm mt-3 text-bautizo-accent hover:text-bautizo-primary underline">Ver mapa</a>
                                )}
                            </div>
                        ))}
                    </div>

                    {config.gifts?.message && (
                        <div className="text-center mt-16 max-w-2xl mx-auto animate-fade-in">
                            <Divider />
                            <p className="font-serif italic text-xl text-bautizo-gray mt-6">
                                "{config.gifts.message}"
                            </p>
                            {config.gifts.links?.length > 0 && config.gifts.links[0].url && (
                                <a href={config.gifts.links[0].url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-bautizo-primary hover:text-bautizo-accent underline font-medium">Ver opciones de regalo</a>
                            )}
                        </div>
                    )}


                </div>
            </section>

            {/* --- GALERÍA — Grid 2×2 --- */}
            <section className="py-20 px-4 bg-white">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-vibes text-bautizo-primary mb-4">{config.galleryTitle || "Momentos"}</h2>
                    <Divider />
                </div>
                <div className="gallery-grid">
                    {galleryPhotos.slice(0, 4).map((photo, i) => (
                        <div key={i} className="gallery-grid-card">
                            <img src={`/invitations/${config.slug}/img/${photo.filename}`} alt={photo.caption || `Momento ${i+1}`} />
                            <div className="label bg-white/70 text-bautizo-dark">{photo.caption || `Momento ${i+1}`}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- RSVP --- */}
            <section id="rsvp-section" className="py-20 px-4 bg-bautizo-cream">
                <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-bautizo-accent/15">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-vibes text-bautizo-primary mb-2">Confirmación</h2>
                        <p className="text-bautizo-gray">{config.rsvp.deadline || "Ayúdanos a preparar todo para ti."}</p>
                    </div>

                    {rsvpStatus === 'success' ? (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-bautizo-dark mb-2">¡Gracias!</h3>
                            <p className="text-bautizo-gray">Nos vemos en el bautizo.</p>
                            <button onClick={() => resetForm()} className="mt-4 text-sm text-bautizo-primary hover:text-bautizo-accent underline transition-colors">Volver al formulario</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-bautizo-dark mb-1 ml-1">Nombre</label>
                                <input
                                    type="text" name="name" required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-bautizo-light/50 border border-bautizo-accent/20 rounded-xl focus:outline-none focus:border-bautizo-primary focus:ring-1 focus:ring-bautizo-primary text-bautizo-text transition-colors"
                                    placeholder="Tu nombre completo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-bautizo-dark mb-1 ml-1">Personas</label>
                                <select
                                    name="guests"
                                    className="w-full px-4 py-3 bg-bautizo-light/50 border border-bautizo-accent/20 rounded-xl focus:outline-none focus:border-bautizo-primary focus:ring-1 focus:ring-bautizo-primary text-bautizo-text transition-colors"
                                    value={formData.guests}
                                    onChange={handleInputChange}
                                >
                                    <option value="1">1 Adulto</option>
                                    <option value="2">2 Adultos</option>
                                    <option value="3">2 Adultos + 1 Niño</option>
                                    <option value="4">Familia (4)</option>
                                </select>
                            </div>
                            <button
                                type="submit" disabled={rsvpStatus === 'submitting'}
                                className="w-full py-3 bg-bautizo-primary hover:bg-bautizo-accent text-white rounded-xl font-bold shadow-md transition-all mt-4 flex items-center justify-center gap-2"
                            >
                                {rsvpStatus === 'submitting' ? 'Confirmando...' : (<>Confirmar Asistencia <Send size={16} /></>)}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <footer className="py-8 text-center bg-white text-bautizo-gray text-sm border-t border-bautizo-accent/15">
                <p className="font-vibes text-xl text-bautizo-primary mb-1">{config.footer.names || config.hero.subheading}</p>
                <p>{config.footer.message || "Bautizo • 2026"}</p>
            </footer>
        </div>
    );
};

// --- Subcomponentes ---

const Divider = () => (
    <div className="flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-bautizo-accent/40"></span>
        <Star size={14} className="text-bautizo-accent/60" fill="currentColor" />
        <span className="h-px w-12 bg-bautizo-accent/40"></span>
    </div>
);

/* Rounded Soft Boxes */
const CountdownBox = ({ value, label }) => (
    <div className="bg-bautizo-light border border-bautizo-accent/20 rounded-2xl px-5 py-4 min-w-[80px] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
        <span className="block text-3xl md:text-4xl font-bold text-bautizo-primary leading-none">
            {String(value).padStart(2, '0')}
        </span>
        <span className="block text-[0.65rem] uppercase text-bautizo-gray tracking-widest mt-1.5">{label}</span>
    </div>
);

export default InvitacionBautizo;
