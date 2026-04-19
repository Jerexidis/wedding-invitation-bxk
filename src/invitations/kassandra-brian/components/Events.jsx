import React from 'react';
import { MapPin } from 'lucide-react';

// SVG de iglesia — reemplaza fa-church (Font Awesome eliminado)
const ChurchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
        <path d="M12 2v4M10 4h4"/>
        <path d="M5 10v10h14V10"/>
        <path d="M2 10h20"/>
        <path d="M9 20v-6h6v6"/>
        <path d="M5 10l7-6 7 6"/>
    </svg>
);

// SVG de copa de brindis — reemplaza fa-glass-cheers (Font Awesome eliminado)
const CheersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
        <path d="M8 22h8M12 11v11"/>
        <path d="M5 3l2 9a5 5 0 0010 0l2-9"/>
        <path d="M3 3h18"/>
    </svg>
);

const Events = () => {
    return (
        <section className="py-16 px-6 bg-secondary flex flex-col md:flex-row justify-center items-center gap-8 flex-wrap">

            <EventCard
                icon={<ChurchIcon />}
                title="Ceremonia"
                location="Quinta Maria Jardin de Eventos"
                time="6:00 PM"
                link="https://maps.app.goo.gl/e4Mi817xanEJ4B6c9"
            />

            <EventCard
                icon={<CheersIcon />}
                title="Recepción"
                location="Misma ubicación de Ceremonia"
                time="7:00 PM"
                link="https://maps.app.goo.gl/e4Mi817xanEJ4B6c9"
            />

        </section>
    );
};

const EventCard = ({ icon, title, location, time, link }) => (
    <div className="bg-card-bg w-full md:w-80 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center flex flex-col items-center border border-slate-100">
        <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center text-primary mb-6">
            {icon}
        </div>
        <h3 className="text-xl uppercase tracking-widest text-slate-800 font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 text-sm mb-1">{location}</p>
        <p className="text-slate-900 font-bold mb-6">{time}</p>

        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-primary-dark transition-colors"
        >
            <MapPin size={16} /> Ver Ubicación
        </a>
    </div>
);

export default Events;
