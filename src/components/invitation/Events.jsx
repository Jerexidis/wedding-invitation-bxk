import { MapPin, Church, PartyPopper } from 'lucide-react';

const Events = ({ data, basePath }) => {
    return (
        <section className="relative py-16 px-6 bg-inv-cream overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-inv-display text-inv-primary">Te esperamos en:</h2>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
                    {data.map((event, i) => (
                        <EventCard key={i} icon={event.icon} title={event.title} location={event.location} address={event.address} time={event.time} link={event.mapLink} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const EventCard = ({ icon, title, location, address, time, link }) => (
    <div className="flex-1 min-w-[280px] max-w-md mx-auto bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center border border-inv-lily/50 hover:-translate-y-1 group relative z-10">
        <div className="w-16 h-16 rounded-full bg-inv-accent/15 border border-inv-accent/30 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300">
            {icon === 'church' ? <Church className="w-7 h-7 text-inv-accent-warm" /> : <PartyPopper className="w-8 h-8 text-inv-accent-warm" strokeWidth={2.5} />}
        </div>
        <h3 className="text-lg uppercase tracking-widest text-inv-dark font-semibold mb-3">{title}</h3>
        <p className="text-inv-primary font-semibold text-sm mb-1">{location}</p>
        <p className="text-inv-gray text-xs mb-2">{address}</p>
        <div className="w-16 h-[1px] bg-inv-accent/60 mx-auto my-4" />
        <p className="text-inv-dark font-bold text-xl mb-6">{time} <span className="text-sm font-medium text-inv-gray">hrs</span></p>
        {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-inv-accent-warm text-white px-6 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wide hover:opacity-90 hover:shadow-lg transition-all shadow-md">
                <MapPin size={16} /> Ver Ubicación
            </a>
        )}
    </div>
);

export default Events;
