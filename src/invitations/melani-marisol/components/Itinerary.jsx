import React from 'react';
import { Church, PartyPopper } from 'lucide-react';

const itineraryItems = [
    { time: '7:00 PM', event: 'Ceremonia Religiosa', icon: <Church className="w-5 h-5 text-white" />, description: 'Santa María Estrella de la Evangelización' },
    { time: '7:00 PM', event: 'Recepción', icon: <PartyPopper className="w-6 h-6 text-white" strokeWidth={2.5} />, description: 'Quinta Sarai' },
];

const Itinerary = () => {
    return (
        <section className="py-14 px-6 bg-rana-dark text-center relative overflow-hidden">
            {/* Subtle firefly background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-rana-firefly/30"
                        style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `firefly ${Math.random() * 4 + 3}s ease-in-out ${Math.random() * 2}s infinite alternate`,
                            boxShadow: '0 0 6px 2px rgba(255, 245, 157, 0.3)',
                        }}
                    />
                ))}
            </div>

            {/* Frog silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/frog-silhouette.png"
                alt=""
                className="absolute -bottom-4 -right-4 w-32 md:w-40 opacity-[0.06] pointer-events-none select-none"
                style={{ filter: 'invert(1) sepia(0.3) hue-rotate(80deg)' }}
            />
            {/* Lotus silhouette watermark */}
            <img
                src="/invitations/melani-marisol/img/lotus-silhouette.png"
                alt=""
                className="absolute -top-6 -left-6 w-36 md:w-44 opacity-[0.05] pointer-events-none select-none"
                style={{ filter: 'invert(1) sepia(0.3) hue-rotate(80deg)' }}
            />

            <div className="max-w-md mx-auto relative z-10">
                <p className="text-rana-firefly/70 text-sm uppercase tracking-[0.3em] mb-2">Programa del evento</p>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-10">Itinerario</h2>

                {/* Vertical timeline list */}
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-rana-accent/40 via-rana-accent/20 to-transparent" />

                    <div className="space-y-6">
                        {itineraryItems.map((item, index) => (
                            <div
                                key={index}
                                className="relative flex items-start gap-5 group"
                            >
                                {/* Timeline dot */}
                                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-rana-primary border-2 border-rana-accent/50 flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>

                                {/* Content card */}
                                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-rana-accent/10 hover:border-rana-accent/30 transition-colors duration-300 text-left">
                                    <p className="text-rana-accent font-bold text-sm tracking-wider mb-1">{item.time}</p>
                                    <p className="text-white font-semibold text-base">{item.event}</p>
                                    <p className="text-rana-lily/60 text-xs mt-1 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes firefly {
                    0% { opacity: 0.2; transform: translate(0, 0); }
                    50% { opacity: 0.8; transform: translate(10px, -15px); }
                    100% { opacity: 0.3; transform: translate(-10px, 5px); }
                }
            `}</style>
        </section>
    );
};

export default Itinerary;
