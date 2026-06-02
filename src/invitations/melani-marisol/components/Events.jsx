import React from 'react';
import { MapPin, Church, PartyPopper } from 'lucide-react';

const Events = () => {
    return (
        <section className="relative py-16 px-6 bg-rana-cream overflow-hidden">
            {/* Contenedor de marcas de agua */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Frog silhouette watermark */}
                <img
                    src="/invitations/melani-marisol/img/frog-silhouette.png"
                    alt=""
                    className="absolute top-10 -right-4 w-32 md:w-36 opacity-[0.04] select-none"
                    style={{ filter: 'sepia(0.5) hue-rotate(100deg)' }}
                />
            </div>

            {/* Animated Colored Images */}
            <img
                src="/invitations/melani-marisol/img/luciernaga.png"
                alt="Luciérnaga"
                className="absolute top-12 left-8 md:left-20 w-12 md:w-16 z-20 drop-shadow-lg pointer-events-none"
                style={{ animation: 'float 3.5s ease-in-out infinite' }}
            />
            <img
                src="/invitations/melani-marisol/img/rana.png"
                alt="Rana"
                className="absolute -bottom-4 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 w-20 md:w-28 z-20 drop-shadow-xl pointer-events-none"
                style={{ animation: 'float 4s ease-in-out infinite 1s' }}
            />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <p className="text-sm uppercase tracking-[0.3em] text-rana-gray mb-2">Te esperamos en</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-rana-primary">Mis Eventos</h2>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
                    <EventCard
                        icon="church"
                        title="Ceremonia Religiosa"
                        location="Santa María Estrella de la Evangelización"
                        address="Calle Alfa Col. La Estrella, Aguascalientes, Ags."
                        time="7:00 PM"
                        link="https://maps.app.goo.gl/kDFwgahtGoUxw8yd9"
                    />

                    <EventCard
                        icon="party"
                        title="Recepción"
                        location="Quinta Sarai"
                        address="Av. Siglo XXI KM 3.5"
                        time="8:00 PM"
                        link="https://maps.app.goo.gl/YEdgpgBVP1a6hrjU8"
                    />
                </div>
            </div>
        </section>
    );
};

const EventCard = ({ icon, title, location, address, time, link }) => (
    <div className="flex-1 min-w-[280px] max-w-md mx-auto bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center border border-rana-lily/50 hover:-translate-y-1 group relative z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rana-primary to-rana-teal flex items-center justify-center text-white mb-6 text-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
            {icon === 'church' ?
                <Church className="w-7 h-7 text-white" /> :
                <PartyPopper className="w-8 h-8 text-white" strokeWidth={2.5} />
            }
        </div>
        <h3 className="text-lg uppercase tracking-widest text-rana-dark font-semibold mb-3">{title}</h3>
        <p className="text-rana-primary font-semibold text-sm mb-1">{location}</p>
        <p className="text-rana-gray text-xs mb-2">{address}</p>
        <div className="w-16 h-[1px] bg-rana-accent/60 mx-auto my-4" />
        <p className="text-rana-dark font-bold text-xl mb-6">{time}</p>

        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rana-primary to-rana-teal text-white px-6 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wide hover:opacity-90 hover:shadow-lg transition-all shadow-md"
        >
            <MapPin size={16} /> Ver Ubicación
        </a>
    </div>
);

export default Events;

const style = document.createElement('style');
style.innerHTML = `
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
    100% { transform: translateY(0px); }
}
`;
if (typeof document !== 'undefined') {
    document.head.appendChild(style);
}
