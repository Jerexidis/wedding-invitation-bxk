import React, { useRef } from "react";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Shirt,
  Gift,
  ChevronDown,
  Send,
  CheckCircle,
} from "lucide-react";

import { useCountdown } from '@/hooks/useCountdown';
import { useRsvpForm } from '@/hooks/useRsvpForm';
import { getThemeStyles } from '@/utils/theme';

const InvitacionBoda = ({ config }) => {
  const stackRef = useRef(null);
  const timeLeft = useCountdown(config.countdown.dateTime);
  const rsvpMode = config.rsvp?.mode || 'supabase';
  const supabaseRsvp = useRsvpForm(config.slug);
  const { formData, handleInputChange, rsvpStatus, resetForm } = supabaseRsvp;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rsvpMode === 'whatsapp' && config.rsvp?.whatsapp) {
      const msg = `Hola! Soy ${formData.name}. Confirmo mi asistencia para ${formData.guests} persona(s).${formData.message ? ` ${formData.message}` : ''} ¡Nos vemos!`;
      window.location.href = `https://wa.me/${config.rsvp.whatsapp}?text=${encodeURIComponent(msg)}`;
    } else {
      supabaseRsvp.handleSubmit(e);
    }
  };

  const scrollToRSVP = () => {
    document
      .getElementById("rsvp-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-boda-cream text-boda-text font-sans selection:bg-boda-light">
      <style>{getThemeStyles(config, 'sage')}</style>
      {/* --- HERO SECTION --- */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-90"
            style={{
              backgroundImage: `url('/invitations/${config.slug}/img/${config.hero.coverImage}')`,
            }}
          />
          <div className="absolute inset-0 bg-boda-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-boda-cream" />
        </div>

        <div className="relative z-10 text-white space-y-6 animate-fade-in-up">
          <p className="text-lg md:text-xl tracking-[0.25em] uppercase font-light opacity-90">
            {config.hero.heading}
          </p>
          <h1 className="text-6xl md:text-8xl font-vibes tracking-wide drop-shadow-lg">
            {config.hero.subheading}
          </h1>
          <div className="flex items-center justify-center gap-4 text-lg md:text-2xl font-light mt-4">
            <span>{config.countdown.displayDate.split(' ')[1]}</span>
            <span className="h-px w-8 bg-white/60"></span>
            <span>{config.countdown.displayDate.split(' ')[3]?.substring(0,3).toUpperCase()}</span>
            <span className="h-px w-8 bg-white/60"></span>
            <span>{config.countdown.displayYear}</span>
          </div>

          <button
            onClick={scrollToRSVP}
            className="mt-12 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/40 rounded-full text-white hover:bg-white hover:text-boda-dark transition-all duration-300 transform hover:scale-105"
          >
            Confirmar Asistencia
          </button>
        </div>

        <div className="absolute bottom-10 animate-bounce text-white/70">
          <ChevronDown size={32} />
        </div>
        {config.hero.song && (
            <audio autoPlay loop src={`/invitations/${config.slug}/audio/${config.hero.song}`} className="hidden" />
        )}
      </header>

      {/* --- CUENTA REGRESIVA --- */}
      <section className="py-20 px-4 bg-boda-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-vibes text-boda-primary mb-12">
            Solo faltan...
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <CountdownCircle value={timeLeft.dias} label="Días" />
            <CountdownCircle value={timeLeft.horas} label="Horas" />
            <CountdownCircle value={timeLeft.minutos} label="Min" />
            <CountdownCircle value={timeLeft.segundos} label="Seg" />
          </div>
        </div>
      </section>

      {/* --- DETALLES DEL EVENTO --- */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <DetailCard
            icon={<Calendar className="w-8 h-8 text-boda-primary" />}
            title="¿Cuándo?"
            content={config.countdown.displayDate}
            subContent={config.countdown.displayYear}
          />

          <DetailCard
            icon={<Clock className="w-8 h-8 text-boda-primary" />}
            title="Hora"
            content={`${config.events[0]?.title}: ${config.events[0]?.time}`}
            subContent={config.events[1] ? `${config.events[1]?.title}: ${config.events[1]?.time}` : ''}
          />

          <DetailCard
            icon={<MapPin className="w-8 h-8 text-boda-primary" />}
            title="¿Dónde?"
            content={config.events[0]?.location || config.calendarEvent.location}
            subContent=""
            link={config.events[0]?.mapLink}
          />
        </div>
      </section>

      {/* --- DRESS CODE & REGALOS --- */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="bg-boda-cream p-8 rounded-2xl border border-boda-accent/20 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <span className="p-3 bg-boda-light rounded-full">
                <Gift className="w-6 h-6 text-boda-primary" />
              </span>
            </div>
            <h3 className="text-2xl font-vibes text-boda-dark mb-4">Mesa de Regalos</h3>
            <p className="text-boda-text mb-4">
              {config.gifts.message || "Su presencia es nuestro mejor regalo. Si desean tener un detalle, pueden consultar nuestras opciones."}
            </p>
            {config.gifts.links.length > 0 && config.gifts.links[0].url && (
                <a href={config.gifts.links[0].url} target="_blank" rel="noreferrer" className="text-boda-primary font-medium hover:text-boda-dark underline decoration-boda-accent decoration-2 underline-offset-4">
                  Ver sugerencias
                </a>
            )}
          </div>

          <div className="bg-boda-cream p-8 rounded-2xl border border-boda-accent/20 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <span className="p-3 bg-boda-light rounded-full">
                <Shirt className="w-6 h-6 text-boda-primary" />
              </span>
            </div>
            <h3 className="text-2xl font-vibes text-boda-dark mb-4">Código de Vestimenta</h3>
            <p className="text-boda-text">
              <strong>{config.details.dressCode || "Formal"}</strong>
              {config.details.avoidColors && (
                  <>
                    <br /><br />
                    Favor de evitar los colores:<br/>
                    <span className="text-sm">{config.details.avoidColors}</span>
                  </>
              )}
            </p>
            {config.details.dressCodeImage && (
                <div className="mt-6 rounded-lg overflow-hidden border border-boda-accent/20">
                  <img src={`/invitations/${config.slug}/img/${config.details.dressCodeImage}`} alt="Ejemplo de vestimenta" className="w-full h-auto" />
                </div>
            )}
          </div>
        </div>
      </section>

      {/* --- GALERÍA POLAROID --- */}
      <section className="py-24 bg-boda-cream overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-vibes text-boda-primary mb-4">{config.galleryTitle || "Nuestra Historia"}</h2>
          <Divider />
        </div>
        <div className="polaroid-stack-container">
          <div className="polaroid-stack" ref={stackRef}>
            {config.gallery.slice(0, 4).map((photo, i) => (
                <div key={i} className="polaroid-card">
                  <img src={`/invitations/${config.slug}/img/${photo.filename}`} alt={`Foto ${i+1}`} />
                  <p className="caption">{photo.caption || `Momento ${i+1}`}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FORMULARIO RSVP --- */}
      <section
        id="rsvp-section"
        className="py-24 px-4 bg-boda-dark text-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>

        <div className="max-w-lg mx-auto relative z-10 bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <Heart className="w-10 h-10 text-boda-accent mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl font-vibes mb-2">RSVP</h2>
            <p className="text-slate-300">
              {config.rsvp.deadline || "Por favor confirma tu asistencia."}
            </p>
          </div>

          {rsvpStatus === "success" ? (
            <div className="text-center py-12 animate-fade-in">
              <CheckCircle className="w-16 h-16 text-boda-accent mx-auto mb-4" />
              <h3 className="text-2xl font-vibes mb-2">
                ¡Confirmación Recibida!
              </h3>
              <p className="text-boda-light/80">
                Gracias por acompañarnos en este día especial.
              </p>
              <button
                onClick={() => resetForm()}
                className="mt-6 text-sm text-boda-accent hover:text-boda-light underline"
              >
                Enviar otra respuesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text" name="name" required
                  value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-boda-accent focus:ring-1 focus:ring-boda-accent text-white placeholder-white/30 transition-colors"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Número de Adultos
                </label>
                <select
                  name="guests" value={formData.guests} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-boda-accent focus:ring-1 focus:ring-boda-accent text-white [&>option]:text-boda-dark transition-colors"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Persona" : "Personas"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Mensaje (Opcional)
                </label>
                <textarea
                  name="message" value={formData.message} onChange={handleInputChange} rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-boda-accent focus:ring-1 focus:ring-boda-accent text-white placeholder-white/30 transition-colors"
                  placeholder="¿Alguna alergia alimentaria?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={rsvpStatus === "submitting"}
                className={`w-full py-4 text-white rounded-lg font-medium tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${rsvpMode === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#1DA855]' : 'bg-boda-primary hover:bg-boda-dark'}`}
              >
                {rsvpStatus === "submitting" ? (
                  <>Enviando...</>
                ) : rsvpMode === 'whatsapp' ? (
                  <>
                    Confirmar por WhatsApp{' '}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </>
                ) : (
                  <>
                    Confirmar Asistencia <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center bg-boda-cream border-t border-boda-accent/20">
        <p className="font-vibes text-2xl text-boda-primary mb-2">{config.footer.names || config.hero.subheading}</p>
        <p className="text-boda-gray text-sm">{config.footer.message || "Te esperamos con mucha ilusión."}</p>
      </footer>
    </div>
  );
};

// --- Subcomponentes ---

const Divider = () => (
  <div className="flex items-center justify-center gap-3">
    <span className="h-px w-12 bg-boda-accent/40"></span>
    <span className="w-2 h-2 rounded-full bg-boda-primary/40"></span>
    <span className="h-px w-12 bg-boda-accent/40"></span>
  </div>
);

const CountdownCircle = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 md:w-20 md:h-20 bg-boda-light rounded-full flex items-center justify-center border border-boda-accent/30 shadow-sm mb-3">
      <span className="text-2xl md:text-3xl font-vibes text-boda-primary font-medium">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="text-xs uppercase tracking-widest text-boda-gray font-medium">
      {label}
    </span>
  </div>
);

const DetailCard = ({ icon, title, content, subContent, link }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-boda-accent/15 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="mb-5 p-4 bg-boda-light rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-vibes text-boda-dark mb-3">{title}</h3>
    <p className="text-boda-text font-medium">{content}</p>
    {subContent && <p className="text-boda-gray">{subContent}</p>}
    {link && (
      <a
        href={link}
        className="mt-4 text-sm text-boda-primary font-medium border-b border-boda-accent pb-0.5 hover:text-boda-dark"
      >
        Ver en mapa
      </a>
    )}
  </div>
);

export default InvitacionBoda;
