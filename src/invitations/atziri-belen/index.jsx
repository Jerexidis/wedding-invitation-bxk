import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronDown, Sparkles, Church, PartyPopper, ArrowLeft } from 'lucide-react';
import config from './config.json';
import { useCountdown } from '../../hooks/useCountdown';

// Custom Hanger SVG icon
const HangerIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a3 3 0 0 0-3 3c0 1.1.6 2 1.5 2.5L12 8l8.5 6.5a2 2 0 0 1-1.2 3.5H4.7a2 2 0 0 1-1.2-3.5L12 8" />
        <path d="M12 2v1" />
    </svg>
);

// Helper: convert Google Maps short link to an embed-friendly search URL
const getMapEmbedUrl = (location) => {
    const query = encodeURIComponent(location.trim());
    return `https://www.google.com/maps?q=${query}&output=embed`;
};

const InvitacionXV = () => {
    const navigate = useNavigate();
    const timeLeft = useCountdown(config.countdown.dateTime);

    return (
        <div className="min-h-screen bg-xv-cream text-xv-text font-montserrat selection:bg-xv-accent/30">

            

            {/* --- HERO SECTION --- */}
            <header className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={`/invitations/${config.slug}/img/${config.hero.coverImage}`}
                        alt="Fondo floral elegante"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-xv-dark/45" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-xv-cream" />
                </div>

                <div className="relative z-10 space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 text-xv-accent text-2xl tracking-[0.5em]">
                        <span>✦</span>
                        <Sparkles className="w-8 h-8" />
                        <span>✦</span>
                    </div>

                    <p className="text-lg md:text-xl tracking-[0.3em] uppercase font-light text-white/90">
                        {config.hero.heading}
                    </p>

                    <h1 className="text-6xl md:text-8xl text-white tracking-wide drop-shadow-lg font-vibes">
                        {config.hero.subheading}
                    </h1>

                    <div className="flex items-center justify-center gap-4 mt-2">
                        <span className="h-px w-16 bg-xv-accent/60"></span>
                        <Sparkles className="w-5 h-5 text-xv-accent" />
                        <span className="h-px w-16 bg-xv-accent/60"></span>
                    </div>

                    {config.details.adultsOnlyMessage && (
                        <p className="text-white/80 italic text-lg md:text-xl max-w-md mx-auto mt-2 font-serif">
                            "{config.details.adultsOnlyMessage}"
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-4 text-xl md:text-2xl font-light mt-4 text-white">
                        <span>{config.countdown.displayDate.split(' ')[1]}</span>
                        <span className="h-px w-8 bg-white/50"></span>
                        <span>{config.countdown.displayDate.split(' ')[3]?.substring(0,3).toUpperCase()}</span>
                        <span className="h-px w-8 bg-white/50"></span>
                        <span>{config.countdown.displayYear}</span>
                    </div>

                </div>

                <div className="absolute bottom-10 animate-bounce text-white/50">
                    <ChevronDown size={32} />
                </div>
                {config.hero.song && (
                    <audio autoPlay loop src={`/invitations/${config.slug}/audio/${config.hero.song}`} className="hidden" />
                )}
            </header>

            {/* --- FOTO POLAROID --- */}
            <section className="py-16 px-4 bg-xv-cream">
                <div className="flex justify-center">
                    <div className="bg-white p-3 pb-12 rounded-sm shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-[280px] md:max-w-[320px]">
                        <img
                            src={`/invitations/${config.slug}/img/Atziri.jpeg`}
                            alt={config.hero.subheading}
                            className="w-full h-auto object-cover aspect-[3/4] rounded-sm"
                        />
                        <p className="text-center mt-3 font-vibes text-2xl text-xv-primary">{config.hero.subheading}</p>
                    </div>
                </div>
            </section>

            {/* --- FRASE 1 --- */}
            <section className="py-10 px-6 bg-xv-cream">
                <div className="max-w-md mx-auto text-center">
                    <p className="text-xl md:text-2xl italic text-xv-gray leading-relaxed font-serif">
                        <span className="text-3xl text-xv-accent/50 font-vibes">❝</span><br />
                        Hoy dejo atrás mi niñez y doy la bienvenida a una nueva etapa de mi vida
                        <br /><span className="text-3xl text-xv-accent/50 font-vibes">❞</span>
                    </p>
                </div>
            </section>

            {/* --- MENSAJE --- */}
            <section className="py-20 px-4 bg-xv-cream">
                <div className="max-w-3xl mx-auto text-center">
                    <Divider />
                    
                    {config.parentsAndGodparents?.parents ? (
                        <>
                            <p className="text-xl md:text-2xl italic text-xv-gray leading-relaxed mt-8 font-serif">
                                Con la bendición de Dios y de mis padres
                            </p>
                            <p className="text-2xl md:text-3xl font-vibes text-xv-primary mt-2">
                                {config.parentsAndGodparents.parents.split(/\s+y\s+/).map((name, i, arr) => (
                                    <span key={i}>
                                        {name.trim()}
                                        {i < arr.length - 1 && <><br /><span className="text-lg text-xv-gray font-montserrat not-italic">&</span><br /></>}
                                    </span>
                                ))}
                            </p>
                        </>
                    ) : (
                        <p className="text-xl md:text-2xl italic text-xv-gray leading-relaxed mt-8 font-serif">
                            Con la bendición de Dios y de mis padres
                        </p>
                    )}

                    {config.parentsAndGodparents?.godparents && (
                        <>
                            <p className="text-xl md:text-2xl italic text-xv-gray leading-relaxed mt-6 font-serif">
                                Y mis padrinos
                            </p>
                            <p className="text-2xl md:text-3xl font-vibes text-xv-primary mt-2">
                                {config.parentsAndGodparents.godparents.split(/\s+y\s+/).map((name, i, arr) => (
                                    <span key={i}>
                                        {name.trim()}
                                        {i < arr.length - 1 && <><br /><span className="text-lg text-xv-gray font-montserrat not-italic">&</span><br /></>}
                                    </span>
                                ))}
                            </p>
                        </>
                    )}

                    <p className="text-lg text-xv-text mt-8">
                        <strong>tienen el honor de invitarle a la celebración de mis XV años</strong>
                    </p>
                    <h2 className="text-4xl md:text-5xl text-xv-primary mt-6 mb-4 font-vibes">
                        {config.hero.subheading}
                    </h2>

                    <div className="mt-12 pt-10 border-t border-xv-accent/15">
                        <p className="text-lg md:text-xl italic text-xv-gray leading-relaxed font-serif max-w-lg mx-auto">
                            “La vida es un camino lleno de sorpresas y oportunidades, y hoy celebro mis quince años con la certeza de que lo mejor está por venir. Los espero para que juntos celebremos la vida y el amor”
                        </p>
                        
                    </div>
                </div>
            </section>

            {/* --- COUNTDOWN — Números elegantes serif --- */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-vibes text-xv-primary mb-2">Faltan...</h2>
                    <div className="mb-14"><Divider /></div>
                    <div className="flex flex-nowrap justify-center items-baseline gap-3 sm:gap-6 md:gap-12">
                        <CountdownElegant value={timeLeft.dias} label="Días" />
                        <span className="text-xv-accent/40 text-xl sm:text-3xl font-light mb-6">:</span>
                        <CountdownElegant value={timeLeft.horas} label="Horas" />
                        <span className="text-xv-accent/40 text-xl sm:text-3xl font-light mb-6">:</span>
                        <CountdownElegant value={timeLeft.minutos} label="Min" />
                        <span className="text-xv-accent/40 text-xl sm:text-3xl font-light mb-6">:</span>
                        <CountdownElegant value={timeLeft.segundos} label="Seg" />
                    </div>
                </div>
            </section>

            {/* --- DETALLES DEL EVENTO --- */}
            <section className="py-24 bg-xv-cream px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-vibes text-xv-primary mb-4">Detalles del Evento</h2>
                        <Divider />
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {config.events.map((event, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-xv-accent/20 text-center shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-sm">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-xv-light rounded-full">
                                        {event.icon === 'church' ? <Church className="w-8 h-8 text-xv-primary" /> : event.icon === 'party' ? <PartyPopper className="w-8 h-8 text-xv-primary" /> : <Sparkles className="w-8 h-8 text-xv-primary" />}
                                    </div>
                                </div>
                                <h3 className="text-xl font-vibes text-xv-dark mb-1">{event.title}</h3>
                                <div className="space-y-2 mt-4">
                                    <p className="text-xv-text font-medium">{event.location}</p>
                                    {event.time && <p className="text-xv-primary font-medium mt-3">{event.time}</p>}
                                    {event.mapLink && (
                                        <>
                                            <div className="mt-4 rounded-xl overflow-hidden border border-xv-accent/20" style={{ height: '180px' }}>
                                                <iframe
                                                    src={getMapEmbedUrl(event.location)}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen=""
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    title={`Mapa - ${event.title}`}
                                                ></iframe>
                                            </div>
                                            <a href={event.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-xv-accent hover:text-xv-primary mt-2 transition-colors">
                                                <MapPin size={14} />
                                                Cómo llegar
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 mt-8">
                        <div className="bg-white p-8 rounded-2xl border border-xv-accent/20 text-center shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-sm">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-xv-light rounded-full">
                                    <HangerIcon className="w-7 h-7 text-xv-accent" />
                                </div>
                            </div>
                            <h3 className="text-xl font-vibes text-xv-dark mb-3">Código de Vestimenta</h3>
                            <p className="text-xv-text font-medium">{config.details.dressCode || "Formal"}</p>
                            <p className="text-base italic text-xv-gray mt-3 leading-relaxed font-serif">
                                "La moda es lo que te ofrecen los diseñadores cuatro veces al año. Y el estilo es lo que tú eliges."
                            </p>
                            {config.details.avoidColors && (
                                <p className="text-sm text-xv-gray mt-3 font-medium">{config.details.avoidColors}</p>
                            )}
                           
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-12 text-center bg-white border-t border-xv-accent/20">
                <Divider />
                <p className="text-2xl text-xv-primary mt-4 mb-1 font-vibes">{config.footer.names || config.hero.subheading}</p>
                <p className="text-xv-gray text-sm tracking-widest uppercase">XV Años • {config.countdown.displayYear}</p>
                <p className="text-xv-gray text-xs mt-4 italic">{config.footer.message || "Te esperamos con mucho cariño"}</p>
            </footer>
        </div>
    );
};

// --- Subcomponentes ---

const Divider = () => (
    <div className="flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-xv-accent/40"></span>
        <Sparkles className="w-4 h-4 text-xv-accent/60" />
        <span className="h-px w-12 bg-xv-accent/40"></span>
    </div>
);

/* Elegant Large Serif Numbers */
const CountdownElegant = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-xv-primary leading-none tracking-tight">
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs uppercase text-xv-gray tracking-[0.2em] mt-1 sm:mt-2">{label}</span>
    </div>
);

export default InvitacionXV;
