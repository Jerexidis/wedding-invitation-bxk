import React from 'react';
import { MapPin } from 'lucide-react';

const Events = () => {
    return (
        <section className="py-16 px-6 bg-secondary flex flex-col md:flex-row justify-center items-center gap-8 flex-wrap">

            <EventCard
                icon="church"
                title="Ceremonia"
                location="Quinta Maria Jardin de Eventos"
                time="6:00 PM"
                link="https://maps.app.goo.gl/e4Mi817xanEJ4B6c9"
            />

            <EventCard
                icon="glass"
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
        <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center text-primary mb-6 text-2xl">
            <i className={`fas fa-${icon === 'church' ? 'church' : 'glass-cheers'}`}></i>
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
